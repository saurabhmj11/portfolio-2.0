import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useIsMobile from '../hooks/useIsMobile';

/*
 * ═══════════════════════════════════════════════════════════════════════════
 * AWARD-WINNING HERO: Morphing Iridescent Orb
 * 
 * Inspired by: Stripe.com globe, Linear.app, Vercel's design language
 * 
 * - Complex 3D noise displacement creates organic, alien surface
 * - Holographic / iridescent color shifting based on view angle + time
 * - Mouse cursor physically distorts the surface (sphere bulges toward you)
 * - Orbiting light motes add magical depth
 * - Everything rendered in a single performant draw call via custom shaders
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ── Morphing Orb Vertex Shader ──────────────────────────────────────────────
const orbVertex = `
  uniform float uTime;
  uniform vec3  uMouse3D;
  uniform float uMouseIntensity;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vDisplacement;
  varying float vFresnel;

  // ── Simplex 3D noise ──────────────────────────────────────────────────────
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    vNormal = normalize(normalMatrix * normal);
    
    // Multi-octave noise for organic deformation
    float n1 = snoise(position * 1.2 + uTime * 0.15) * 0.5;
    float n2 = snoise(position * 2.4 + uTime * 0.25) * 0.25;
    float n3 = snoise(position * 4.8 + uTime * 0.35) * 0.125;
    float noise = n1 + n2 + n3;

    // Mouse distortion: sphere bulges toward cursor position
    float distToMouse = distance(position, uMouse3D);
    float mouseWarp = smoothstep(3.0, 0.0, distToMouse) * uMouseIntensity * 1.5;
    vec3 mouseDir = normalize(uMouse3D - position);

    vec3 pos = position;
    pos += normal * noise * 0.4;                         // Organic morphing
    pos += mouseDir * mouseWarp * 0.6;                   // Mouse attraction
    pos += normal * mouseWarp * 0.15;                    // Slight expansion near mouse

    vDisplacement = noise + mouseWarp * 0.5;
    vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;

    // Fresnel for rim glow
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    vFresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// ── Morphing Orb Fragment Shader (Holographic / Iridescent) ─────────────────
const orbFragment = `
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vDisplacement;
  varying float vFresnel;

  vec3 iridescence(float angle, float time) {
    // Shifting rainbow based on view angle + time
    float h = fract(angle * 0.5 + time * 0.05);
    // HSL to RGB approximation
    vec3 color = 0.5 + 0.5 * cos(6.28318 * (h + vec3(0.0, 0.33, 0.67)));
    return color;
  }

  void main() {
    // Base deep dark color
    vec3 base = vec3(0.02, 0.01, 0.05);

    // Iridescent color from view angle
    vec3 viewDir = normalize(cameraPosition - vWorldPos);
    float angle = dot(vNormal, viewDir);
    vec3 iri = iridescence(angle, uTime);

    // Displacement-based color modulation
    vec3 hotColor  = vec3(0.0, 0.8, 1.0);    // Cyan peaks
    vec3 coldColor = vec3(0.3, 0.0, 0.8);    // Purple valleys

    vec3 dispColor = mix(coldColor, hotColor, vDisplacement * 0.5 + 0.5);

    // Combine: base + displacement coloring + iridescent shimmer on edges
    vec3 color = base;
    color += dispColor * 0.4;
    color += iri * vFresnel * 0.8;         // Rainbow shimmer on rim
    color += hotColor * vFresnel * 0.3;    // Cyan rim glow
    
    // Pulsing core glow
    float pulse = 0.5 + 0.5 * sin(uTime * 1.5);
    color += vec3(0.05, 0.1, 0.3) * pulse * (1.0 - vFresnel);

    float alpha = 0.85 + vFresnel * 0.15;

    gl_FragColor = vec4(color, alpha);
  }
`;

// ── The Morphing Orb ────────────────────────────────────────────────────────
const MorphOrb = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { mouse, viewport } = useThree();

    const smoothMouse = useRef(new THREE.Vector3(0, 0, 0));
    const mouseIntensity = useRef(0);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse3D: { value: new THREE.Vector3(0, 0, 0) },
        uMouseIntensity: { value: 0 },
    }), []);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();

        // Map mouse to 3D space on the sphere surface
        const mx = (mouse.x * viewport.width) / 2;
        const my = (mouse.y * viewport.height) / 2;
        const target = new THREE.Vector3(mx, my, 2);

        smoothMouse.current.lerp(target, 0.08);

        // Mouse intensity based on distance from center
        const dist = Math.sqrt(mouse.x ** 2 + mouse.y ** 2);
        mouseIntensity.current += (dist - mouseIntensity.current) * 0.05;

        uniforms.uTime.value = t;
        uniforms.uMouse3D.value.copy(smoothMouse.current);
        uniforms.uMouseIntensity.value = mouseIntensity.current;

        // Slow majestic rotation
        meshRef.current.rotation.y = t * 0.06;
        meshRef.current.rotation.x = Math.sin(t * 0.03) * 0.1;
    });

    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[2.2, 128]} />
            <shaderMaterial
                vertexShader={orbVertex}
                fragmentShader={orbFragment}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                side={THREE.FrontSide}
            />
        </mesh>
    );
};

// ── Orbiting Light Motes (magical floating particles) ───────────────────────
const LightMotes = () => {
    const ref = useRef<THREE.Points>(null);
    const count = 300;

    const [positions, sizes] = useMemo(() => {
        const p = new Float32Array(count * 3);
        const s = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            // Distribute in a shell around the orb
            const r = 2.8 + Math.random() * 3.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            p[i * 3 + 2] = r * Math.cos(phi);
            s[i] = Math.random() * 3 + 1;
        }
        return [p, s];
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.03;
            ref.current.rotation.x = state.clock.getElapsedTime() * 0.01;
        }
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
            </bufferGeometry>
            <pointsMaterial
                color="#88ccff"
                size={0.03}
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

// ── Outer Glow Shell ────────────────────────────────────────────────────────
const GlowShell = () => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (ref.current) {
            const scale = 1.0 + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.03;
            ref.current.scale.setScalar(scale);
        }
    });
    return (
        <mesh ref={ref}>
            <icosahedronGeometry args={[2.8, 16]} />
            <meshBasicMaterial
                color="#1144aa"
                transparent
                opacity={0.04}
                wireframe
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    );
};

// ── Orbiting Code Fragments (AI Brain Identity) ─────────────────────────────
const codeSnippets = ['<AI/>', 'LLM', 'GPT', 'RAG', 'Transformer', 'Fine-tune', 'RLHF', 'LangChain', 'Diffusion', 'Embeddings', 'Vector DB', 'Agents'];

const CodeFragment = ({ text, radius, speed, offset, tiltX, tiltZ }: {
    text: string; radius: number; speed: number; offset: number; tiltX: number; tiltZ: number;
}) => {
    const ref = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (!ref.current) return;
        const t = state.clock.getElapsedTime() * speed + offset;
        ref.current.position.x = Math.cos(t) * radius;
        ref.current.position.y = Math.sin(t * 0.7) * radius * 0.3;
        ref.current.position.z = Math.sin(t) * radius;
        // Always face camera
        ref.current.quaternion.copy(state.camera.quaternion);
    });

    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, 256, 64);
        ctx.font = 'bold 28px monospace';
        ctx.fillStyle = '#00eeff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 128, 32);
        const tex = new THREE.CanvasTexture(canvas);
        tex.flipY = false;
        tex.needsUpdate = true;
        return tex;
    }, [text]);

    return (
        <group ref={ref} rotation={[tiltX, 0, tiltZ]}>
            <mesh>
                <planeGeometry args={[1.2, 0.3]} />
                <meshBasicMaterial
                    map={texture}
                    transparent
                    opacity={0.7}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
};

const OrbitingCodeFragments = () => {
    return (
        <group>
            {codeSnippets.map((text, i) => (
                <CodeFragment
                    key={text}
                    text={text}
                    radius={3.0 + (i % 3) * 0.8}
                    speed={0.15 + i * 0.03}
                    offset={(i / codeSnippets.length) * Math.PI * 2}
                    tiltX={i * 0.2}
                    tiltZ={i * 0.15}
                />
            ))}
        </group>
    );
};

// ── Click-to-Shockwave ──────────────────────────────────────────────────────
const ShockwaveRing = ({ startTime }: { startTime: number }) => {
    const ref = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (!ref.current) return;
        const elapsed = state.clock.getElapsedTime() - startTime;
        const scale = 1 + elapsed * 4;
        const opacity = Math.max(0, 1 - elapsed * 1.5);
        ref.current.scale.setScalar(scale);
        (ref.current.material as THREE.MeshBasicMaterial).opacity = opacity;
        if (opacity <= 0) ref.current.visible = false;
    });
    return (
        <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[1.8, 2.0, 64]} />
            <meshBasicMaterial
                color="#00ffff"
                transparent
                opacity={1}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    );
};
// ── Exploding Text Burst Fragment ───────────────────────────────────────────
const burstWords = ['<AI/>', 'LLM', 'GPT', 'RAG', 'Transformer', 'Fine-tune', 'RLHF', 'LangChain', 'Diffusion', 'Embeddings', 'Vector DB', 'Agents', 'PyTorch', 'Prompt Eng', 'deploy()'];

interface BurstParticle {
    text: string;
    velocity: THREE.Vector3;
    startTime: number;
}

const BurstFragment = ({ text, velocity, startTime }: BurstParticle) => {
    const ref = useRef<THREE.Group>(null);

    const texture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, 256, 64);
        ctx.font = 'bold 32px monospace';
        ctx.fillStyle = '#00ffcc';
        ctx.strokeStyle = '#003322';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(text, 128, 32);
        ctx.fillText(text, 128, 32);
        const tex = new THREE.CanvasTexture(canvas);
        tex.flipY = false;
        tex.needsUpdate = true;
        return tex;
    }, [text]);

    useFrame((state) => {
        if (!ref.current) return;
        const elapsed = state.clock.getElapsedTime() - startTime;
        if (elapsed > 2.5) {
            ref.current.visible = false;
            return;
        }

        // Fly outward with deceleration
        const decay = Math.max(0, 1 - elapsed * 0.4);
        ref.current.position.x += velocity.x * 0.03 * decay;
        ref.current.position.y += velocity.y * 0.03 * decay;
        ref.current.position.z += velocity.z * 0.03 * decay;

        // Spin
        ref.current.rotation.z += 0.02;

        // Fade out
        const opacity = Math.max(0, 1 - elapsed / 2.5);
        const mat = (ref.current.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = opacity;

        // Scale up slightly then shrink
        const scale = elapsed < 0.3 ? 1 + elapsed * 3 : Math.max(0.3, 1.9 - elapsed * 0.5);
        ref.current.scale.setScalar(scale);

        // Face camera
        ref.current.quaternion.copy(state.camera.quaternion);
    });

    return (
        <group ref={ref}>
            <mesh>
                <planeGeometry args={[1.4, 0.35]} />
                <meshBasicMaterial
                    map={texture}
                    transparent
                    opacity={1}
                    side={THREE.DoubleSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
};

// ── Text Burst Manager ──────────────────────────────────────────────────────
interface BurstEvent {
    time: number;
    particles: BurstParticle[];
}

const createBurst = (time: number): BurstEvent => {
    const particles: BurstParticle[] = [];
    // Pick 6-8 random words and give each a random outward velocity
    const count = 6 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
        const text = burstWords[Math.floor(Math.random() * burstWords.length)];
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const upAngle = (Math.random() - 0.5) * Math.PI;
        const speed = 2 + Math.random() * 3;
        particles.push({
            text,
            velocity: new THREE.Vector3(
                Math.cos(angle) * Math.cos(upAngle) * speed,
                Math.sin(upAngle) * speed,
                Math.sin(angle) * Math.cos(upAngle) * speed
            ),
            startTime: time,
        });
    }
    return { time, particles };
};

// ── Scene ───────────────────────────────────────────────────────────────────
const Scene = () => {
    const { mouse, camera } = useThree();
    const [shockwaves, setShockwaves] = useState<number[]>([]);
    const [bursts, setBursts] = useState<BurstEvent[]>([]);

    const clockRef = useRef(0);

    // Click handler for shockwave + text burst
    const handleClick = () => {
        const now = clockRef.current;
        setShockwaves((prev: number[]) => [...prev.slice(-3), now]);
        setBursts((prev: BurstEvent[]) => [...prev.slice(-3), createBurst(now)]);
    };

    useFrame((state) => {
        clockRef.current = state.clock.getElapsedTime();
        // Cinematic parallax — camera orbits slightly with mouse
        const tx = mouse.x * 2.0;
        const ty = mouse.y * 1.5;
        camera.position.x += (tx - camera.position.x) * 0.03;
        camera.position.y += (ty - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);
    });

    return (
        <>
            <ambientLight intensity={0.15} />
            <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
            <pointLight position={[-5, -3, 3]} intensity={1.0} color="#0066ff" />
            <pointLight position={[3, -5, -3]} intensity={0.6} color="#8800ff" />

            <group position={[5, -0.5, -1]} scale={0.85} onClick={handleClick}>
                <MorphOrb />
                <LightMotes />
                <GlowShell />
                <OrbitingCodeFragments />
                {shockwaves.map((t: number, i: number) => (
                    <ShockwaveRing key={`sw-${i}-${t}`} startTime={t} />
                ))}
                {bursts.map((burst, bi) =>
                    burst.particles.map((p, pi) => (
                        <BurstFragment
                            key={`burst-${bi}-${pi}`}
                            text={p.text}
                            velocity={p.velocity}
                            startTime={p.startTime}
                        />
                    ))
                )}
            </group>
        </>
    );
};

// ── Export ───────────────────────────────────────────────────────────────────
const InteractiveCore = () => {
    const isMobile = useIsMobile();
    if (isMobile) return null;
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-100 overflow-hidden mix-blend-screen">
            <Canvas
                camera={{ position: [0, 0, 7], fov: 50 }}
                gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                dpr={[1, 2]}
                style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}
            >
                <Scene />
            </Canvas>
        </div>
    );
};

export default InteractiveCore;
