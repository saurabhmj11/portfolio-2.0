import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { buildEmbeddingSpace, buildPointCloud, type EmbeddingSpace } from './embedding';

/**
 * The hero's "embedding space": a point cloud of document chunks clustered
 * around each project, with a scroll-driven RAG pass through it:
 *   query appears → top-k neighbours are retrieved → they converge into an answer.
 *
 * Everything time-varying is read from `progress` (a ref, 0..1) inside
 * useFrame, so scrolling never triggers a React re-render.
 */

export interface SceneProgress { current: number }

const PALETTE = ['#06b6d4', '#a855f7', '#22d3ee', '#818cf8', '#ec4899', '#38bdf8', '#c084fc', '#4ade80'];
const QUERY_COLOR = new THREE.Color('#ffffff');

const smooth = (a: number, b: number, x: number) => THREE.MathUtils.smoothstep(x, a, b);

/** Stage weights derived from scroll progress. */
function stages(p: number) {
    return {
        query: smooth(0.08, 0.2, p),
        focus: smooth(0.3, 0.42, p),
        lines: smooth(0.32, 0.5, p),
        converge: smooth(0.58, 0.76, p),
    };
}

// ── Point cloud shader ──────────────────────────────────────────────────────
const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uFocus;
  uniform float uConverge;
  uniform vec3  uQuery;
  uniform float uRetrieved[8];
  uniform vec3  uCenters[8];
  uniform vec3  uColors[8];

  attribute float aCluster;
  attribute float aSeed;

  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;
    float r = 0.0;
    vec3 color = vec3(0.42, 0.45, 0.6);

    if (aCluster >= 0.0) {
      int ci = int(aCluster + 0.5);
      r = uRetrieved[ci];
      color = uColors[ci];
      // Generate: retrieved chunks pull together into one bright "answer".
      vec3 c = uCenters[ci];
      vec3 answer = mix(c, uQuery, 0.85) + (pos - c) * 0.45;
      pos = mix(pos, answer, r * uConverge);
    }

    // Gentle, per-point drift so the space feels alive.
    float t = uTime * 0.25 + aSeed * 6.2831;
    pos += vec3(sin(t), cos(t * 1.3), sin(t * 0.7)) * 0.06;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = (1.4 + aSeed * 2.2) * (1.0 + r * uFocus * 0.8);
    gl_PointSize = size * uPixelRatio * (16.0 / -mv.z);

    float dim = mix(1.0, 0.16, uFocus * (1.0 - r));
    vAlpha = (aCluster >= 0.0 ? 0.7 : 0.35) * dim * (1.0 + r * uFocus * 0.9);
    vColor = color;
  }
`;

const fragment = /* glsl */ `
  varying vec3  vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor * a * vAlpha * 1.6, a * vAlpha);
  }
`;

function PointCloud({ space, progress }: { space: EmbeddingSpace; progress: SceneProgress }) {
    const cloud = useMemo(() => buildPointCloud(space), [space]);
    const gl = useThree(s => s.gl);

    const material = useMemo(() => new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uTime: { value: 0 },
            uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.5) },
            uFocus: { value: 0 },
            uConverge: { value: 0 },
            uQuery: { value: new THREE.Vector3(...space.query.position) },
            uRetrieved: { value: space.projects.map(p => (p.retrieved ? 1 : 0)).concat(Array(8).fill(0)).slice(0, 8) },
            uCenters: { value: space.projects.map(p => new THREE.Vector3(...p.position)).concat(Array.from({ length: 8 }, () => new THREE.Vector3())).slice(0, 8) },
            uColors: { value: PALETTE.map(c => new THREE.Color(c)) },
        },
    }), [gl, space]);

    const geometry = useMemo(() => {
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(cloud.positions, 3));
        g.setAttribute('aCluster', new THREE.BufferAttribute(cloud.cluster, 1));
        g.setAttribute('aSeed', new THREE.BufferAttribute(cloud.seeds, 1));
        return g;
    }, [cloud]);

    useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

    useFrame((_, dt) => {
        const s = stages(progress.current);
        const u = material.uniforms;
        u.uTime.value += Math.min(dt, 0.05);
        u.uFocus.value = s.focus;
        u.uConverge.value = s.converge;
    });

    return <points geometry={geometry} material={material} frustumCulled={false} />;
}

// ── Project nodes + labels ──────────────────────────────────────────────────
function ProjectNodes({ space, progress, onSelect }: { space: EmbeddingSpace; progress: SceneProgress; onSelect: (id: string) => void }) {
    const meshes = useRef<(THREE.Mesh | null)[]>([]);
    const labels = useRef<(HTMLDivElement | null)[]>([]);
    const scores = useRef<(HTMLSpanElement | null)[]>([]);
    const query = new THREE.Vector3(...space.query.position);

    useFrame(() => {
        const s = stages(progress.current);
        space.projects.forEach((p, i) => {
            const m = meshes.current[i];
            const r = p.retrieved ? 1 : 0;
            if (m) {
                // Converge retrieved nodes toward the answer, like their chunks.
                const c = new THREE.Vector3(...p.position);
                const target = c.clone().lerp(query, 0.85);
                m.position.copy(c.lerp(target, r * s.converge));
                const scale = 0.11 * (1 + r * s.focus * 0.9) * (1 - (1 - r) * s.focus * 0.5) * (1 - 0.65 * s.converge);
                m.scale.setScalar(scale);
            }
            const label = labels.current[i];
            if (label) {
                // Faded-out labels must not catch clicks.
                const visible = p.retrieved ? s.converge < 0.9 : s.focus < 0.9;
                label.style.visibility = visible ? 'visible' : 'hidden';
                const alpha = p.retrieved
                    ? (0.55 + 0.45 * s.focus) * (1 - s.converge)
                    : 0.55 * (1 - s.focus);
                label.style.opacity = String(Math.max(0, alpha));
            }
            const score = scores.current[i];
            if (score) score.style.opacity = String(p.retrieved ? s.lines * (1 - s.converge) : 0);
        });
    });

    return (
        <>
            {space.projects.map((p, i) => (
                <mesh key={p.id} ref={el => { meshes.current[i] = el; }} position={p.position}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshBasicMaterial color={PALETTE[i % PALETTE.length]} toneMapped={false} />
                    <Html center distanceFactor={11} zIndexRange={[5, 0]}>
                        <div
                            ref={el => { labels.current[i] = el; }}
                            className="whitespace-nowrap translate-y-6 text-center font-mono select-none"
                            style={{ opacity: 0.55 }}
                        >
                            {/* Mouse shortcut; keyboard and screen-reader users get the
                                caption buttons and the project grid instead. */}
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => onSelect(p.id)}
                                className="pointer-events-auto cursor-pointer text-[11px] tracking-wide text-white px-2 py-1 rounded-full border border-transparent hover:border-cyan-300/60 hover:bg-black/60 hover:text-cyan-200 transition-colors"
                            >
                                {p.title}
                            </button>
                            <br />
                            <span
                                ref={el => { scores.current[i] = el; }}
                                className="text-[10px] text-cyan-300"
                                style={{ opacity: 0 }}
                            >
                                cos = {p.score.toFixed(3)}
                            </span>
                        </div>
                    </Html>
                </mesh>
            ))}
        </>
    );
}

// ── Query vector + retrieval edges ──────────────────────────────────────────
function QueryAndEdges({ space, progress }: { space: EmbeddingSpace; progress: SceneProgress }) {
    const node = useRef<THREE.Mesh>(null);
    const ring = useRef<THREE.Mesh>(null);
    const camera = useThree(st => st.camera);
    const retrieved = useMemo(() => space.projects.filter(p => p.retrieved).sort((a, b) => a.rank - b.rank), [space]);
    const q = useMemo(() => new THREE.Vector3(...space.query.position), [space]);

    const edges = useMemo(() => retrieved.map(() => {
        const g = new THREE.BufferGeometry().setFromPoints([q.clone(), q.clone()]);
        const m = new THREE.LineBasicMaterial({ color: '#67e8f9', transparent: true, opacity: 0, toneMapped: false });
        return new THREE.Line(g, m);
    }), [retrieved, q]);

    useEffect(() => () => edges.forEach(l => { l.geometry.dispose(); (l.material as THREE.Material).dispose(); }), [edges]);

    useFrame(({ clock }) => {
        const s = stages(progress.current);
        if (node.current) {
            node.current.scale.setScalar(0.12 * s.query * (1 + 0.5 * s.converge) * (1 + 0.08 * Math.sin(clock.elapsedTime * 3)));
            node.current.visible = s.query > 0.01;
        }
        if (ring.current) {
            const k = (clock.elapsedTime * 0.6) % 1;
            ring.current.scale.setScalar(0.15 + k * 0.7 * s.query);
            (ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.45 * s.query * (1 - s.focus * 0.6) * (1 - s.converge);
            ring.current.quaternion.copy(camera.quaternion); // billboard
        }
        edges.forEach((line, i) => {
            const p = retrieved[i];
            // Stagger: best match connects first.
            const t = THREE.MathUtils.clamp(s.lines * 1.6 - i * 0.2, 0, 1);
            const target = new THREE.Vector3(...p.position);
            const end = q.clone().lerp(target, t);
            const pos = line.geometry.attributes.position as THREE.BufferAttribute;
            pos.setXYZ(1, end.x, end.y, end.z);
            pos.needsUpdate = true;
            (line.material as THREE.LineBasicMaterial).opacity = t * 0.9 * (1 - s.converge);
        });
    });

    return (
        <>
            <mesh ref={node} position={q} visible={false}>
                <sphereGeometry args={[1, 24, 24]} />
                <meshBasicMaterial color={QUERY_COLOR} toneMapped={false} />
            </mesh>
            <mesh ref={ring} position={q}>
                <ringGeometry args={[0.9, 1, 48]} />
                <meshBasicMaterial color="#67e8f9" transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
            {edges.map((l, i) => <primitive key={i} object={l} />)}
        </>
    );
}

// ── Camera choreography ─────────────────────────────────────────────────────
function CameraRig({ space, progress }: { space: EmbeddingSpace; progress: SceneProgress }) {
    const camera = useThree(s => s.camera);
    const pointer = useRef({ x: 0, y: 0 });
    const look = useRef(new THREE.Vector3());

    const focusPoint = useMemo(() => {
        const ret = space.projects.filter(p => p.retrieved);
        const c = new THREE.Vector3();
        ret.forEach(p => c.add(new THREE.Vector3(...p.position)));
        c.divideScalar(Math.max(ret.length, 1));
        return c.lerp(new THREE.Vector3(...space.query.position), 0.4);
    }, [space]);
    const answerPoint = useMemo(() => {
        const ret = space.projects.filter(p => p.retrieved);
        const q = new THREE.Vector3(...space.query.position);
        const c = new THREE.Vector3();
        ret.forEach(p => c.add(new THREE.Vector3(...p.position).lerp(q, 0.85)));
        return c.divideScalar(Math.max(ret.length, 1));
    }, [space]);

    useEffect(() => {
        const onMove = (e: PointerEvent) => {
            pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
    }, []);

    useFrame(({ clock }, dt) => {
        const p = progress.current;
        const s = stages(p);
        const t = clock.elapsedTime;

        // Idle: slow orbit around the whole space.
        const a = t * 0.04;
        const idlePos = new THREE.Vector3(Math.sin(a) * 15, 1.6, Math.cos(a) * 15);
        const idleLook = new THREE.Vector3(0, 0, 0);

        // Retrieve: dolly toward the query and its neighbours.
        const retrievePos = focusPoint.clone().add(new THREE.Vector3(1.2, 1.4, 8.5));
        // Generate: settle in front of the converged answer.
        // Frame the converged answer right of centre so the captions (bottom-left) stay clear.
        const ANSWER_SHIFT = new THREE.Vector3(-2.2, 0, 0);
        const answerPos = answerPoint.clone().add(ANSWER_SHIFT).add(new THREE.Vector3(0, 0.5, 5));

        const k1 = Math.max(s.query * 0.35, s.focus);
        const pos = idlePos.clone().lerp(retrievePos, k1).lerp(answerPos, s.converge);
        const lookAt = idleLook.clone().lerp(focusPoint, k1).lerp(answerPoint.clone().add(ANSWER_SHIFT), s.converge);

        // Subtle pointer parallax.
        pos.x += pointer.current.x * 0.6;
        pos.y -= pointer.current.y * 0.4;

        const lambda = 3.2;
        camera.position.x = THREE.MathUtils.damp(camera.position.x, pos.x, lambda, dt);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, pos.y, lambda, dt);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, pos.z, lambda, dt);
        look.current.x = THREE.MathUtils.damp(look.current.x, lookAt.x, lambda, dt);
        look.current.y = THREE.MathUtils.damp(look.current.y, lookAt.y, lambda, dt);
        look.current.z = THREE.MathUtils.damp(look.current.z, lookAt.z, lambda, dt);
        camera.lookAt(look.current);
    });

    return null;
}

export default function EmbeddingScene({ progress, active, onSelect }: { progress: SceneProgress; active: boolean; onSelect: (id: string) => void }) {
    const space = useMemo(() => buildEmbeddingSpace(), []);

    return (
        <Canvas
            frameloop={active ? 'always' : 'never'}
            dpr={[1, 1.5]}
            camera={{ position: [0, 1.6, 15], fov: 50, near: 0.1, far: 100 }}
            gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
            aria-hidden="true"
            style={{ pointerEvents: 'none' }}
        >
            <CameraRig space={space} progress={progress} />
            <PointCloud space={space} progress={progress} />
            <ProjectNodes space={space} progress={progress} onSelect={onSelect} />
            <QueryAndEdges space={space} progress={progress} />
            <EffectComposer multisampling={0}>
                <Bloom mipmapBlur intensity={1.1} luminanceThreshold={0.12} luminanceSmoothing={0.35} radius={0.75} />
            </EffectComposer>
        </Canvas>
    );
}
