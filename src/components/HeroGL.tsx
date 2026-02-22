import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── Vertex + Fragment shaders ────────────────────────────────────────────────

const vertexShader = `
  uniform float uTime;
  uniform float uMouse;
  uniform vec2 uMousePos;
  uniform float uScroll;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplace;

  // Classic Perlin 3D noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

  float cnoise(vec3 P) {
    vec3 Pi0 = floor(P); vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod289(Pi0); Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz; vec4 iz1 = Pi1.zzzz;
    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0); vec4 ixy1 = permute(ixy + iz1);
    vec4 gx0 = ixy0 * (1.0 / 7.0); vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0)); gx0 -= sz0 * (step(0.0, gx0) - 0.5); gy0 -= sz0 * (step(0.0, gy0) - 0.5);
    vec4 gx1 = ixy1 * (1.0 / 7.0); vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0)); gx1 -= sz1 * (step(0.0, gx1) - 0.5); gy1 -= sz1 * (step(0.0, gy1) - 0.5);
    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x); vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z); vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x); vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z); vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
    vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
    g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
    g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
    vec3 f = fade(Pf0);
    vec4 n_z0 = mix(vec4(dot(g000,Pf0),dot(g100,vec3(Pf1.x,Pf0.yz)),dot(g010,vec3(Pf0.x,Pf1.y,Pf0.z)),dot(g110,vec3(Pf1.xy,Pf0.z))), vec4(dot(g001,vec3(Pf0.xy,Pf1.z)),dot(g101,vec3(Pf1.x,Pf0.y,Pf1.z)),dot(g011,vec3(Pf0.x,Pf1.yz)),dot(g111,Pf1)), f.z);
    vec4 n_y0 = mix(n_z0.xy, n_z0.zw, f.y);
    return 2.2 * mix(n_y0.x, n_y0.y, f.x);
  }

  void main() {
    vNormal = normal;
    vPosition = position;

    // Noise displacement
    float noise = cnoise(position * 0.8 + uTime * 0.12);
    float mouseInfluence = uMouse * 0.4;
    float displacement = noise * (0.35 + mouseInfluence);

    // Scroll: flatten the sphere
    float scrollFlatten = uScroll * 0.8;
    vec3 pos = position;
    pos.y *= (1.0 - scrollFlatten * 0.6);
    pos.xz *= (1.0 + scrollFlatten * 0.3);

    pos += normal * displacement;
    vDisplace = displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uMouse;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplace;

  void main() {
    // Fresnel rim glow
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - dot(vNormal, viewDir), 3.0);

    // Color: deep blue-white gradient based on displacement
    vec3 baseColor = vec3(0.05, 0.05, 0.1);
    vec3 glowColor = vec3(0.8, 0.9, 1.0);
    vec3 color = mix(baseColor, glowColor, fresnel + vDisplace * 0.5);

    // Subtle time pulse on the emissive
    float pulse = 0.5 + 0.5 * sin(uTime * 0.8);
    color += glowColor * fresnel * 0.3 * pulse * uMouse;

    gl_FragColor = vec4(color, fresnel * 0.85 + 0.05);
  }
`;

// ── The actual mesh ──────────────────────────────────────────────────────────

const NeuralSphere = ({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const { mouse } = useThree();
    const mouseStrength = useRef(0);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: 0 },
        uMousePos: { value: new THREE.Vector2(0, 0) },
        uScroll: { value: 0 },
    }), []);

    useFrame(({ clock }) => {
        if (!meshRef.current) return;

        const t = clock.getElapsedTime();
        const targetMouse = Math.sqrt(mouse.x ** 2 + mouse.y ** 2);
        mouseStrength.current += (targetMouse - mouseStrength.current) * 0.05;

        uniforms.uTime.value = t;
        uniforms.uMouse.value = mouseStrength.current;
        uniforms.uMousePos.value.set(mouse.x, mouse.y);
        uniforms.uScroll.value = scrollProgress.current;

        // Slow rotation
        meshRef.current.rotation.y = t * 0.08;
        meshRef.current.rotation.x = Math.sin(t * 0.05) * 0.15;
    });

    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[2.2, 64]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                wireframe={false}
                side={THREE.FrontSide}
            />
        </mesh>
    );
};

// ── Wireframe overlay ──────────────────────────────────────────────────────

const WireOverlay = () => {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y = clock.getElapsedTime() * 0.06;
        meshRef.current.rotation.z = clock.getElapsedTime() * 0.03;
    });
    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[2.25, 4]} />
            <meshBasicMaterial color="#ffffff" wireframe opacity={0.04} transparent />
        </mesh>
    );
};

// ── Scene wrapper (needs ScrollControls) ─────────────────────────────────────

const Scene = () => {
    const scrollProgress = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const max = document.body.scrollHeight - window.innerHeight;
            scrollProgress.current = max > 0 ? window.scrollY / max : 0;
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <ambientLight intensity={0.1} />
            <pointLight position={[5, 5, 5]} intensity={0.5} color="#4af" />
            <NeuralSphere scrollProgress={scrollProgress} />
            <WireOverlay />
        </>
    );
};

// ── Public export (lazy-loadable) ────────────────────────────────────────────

const HeroGL = () => {
    // Respect prefers-reduced-motion: skip WebGL entirely for accessibility
    const prefersReduced = typeof window !== 'undefined'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) return null;

    return (
        <Canvas
            camera={{ position: [0, 0, 6], fov: 45 }}
            gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
            }}
            dpr={[1, 1.5]}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
            <Scene />
        </Canvas>
    );
};

export default HeroGL;
