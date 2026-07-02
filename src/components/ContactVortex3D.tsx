import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Vortex Particle Mesh ──────────────────────────────────────────────────────
const PARTICLE_COUNT = 400;

interface VortexProps {
    speed: number;       // 0 = idle, 1 = typing, 2 = submitting
    explode: boolean;    // true triggers the radial burst
}

const VortexParticles = ({ speed, explode }: VortexProps) => {
    const pointsRef = useRef<THREE.Points>(null);
    const velocities = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
    const origins   = useRef<Float32Array>(new Float32Array(PARTICLE_COUNT * 3));
    const explodeRef = useRef(false);
    const explodeT   = useRef(0);

    // Initialize positions on a double helix / vortex spiral
    const positions = useMemo(() => {
        const pos = new Float32Array(PARTICLE_COUNT * 3);
        const vel = velocities.current;
        const ori = origins.current;

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const t = (i / PARTICLE_COUNT) * Math.PI * 12;        // spiral turns
            const r = 0.4 + (i / PARTICLE_COUNT) * 1.6;           // radius grows
            const spread = (Math.random() - 0.5) * 0.3;

            const x = Math.cos(t) * r + spread;
            const y = (i / PARTICLE_COUNT) * 4.0 - 2.0;           // -2 to +2 height
            const z = Math.sin(t) * r + spread;

            pos[i*3]   = x;
            pos[i*3+1] = y;
            pos[i*3+2] = z;

            ori[i*3] = x; ori[i*3+1] = y; ori[i*3+2] = z;

            // Tangential velocity for the burst
            vel[i*3]   = (Math.random() - 0.5) * 4;
            vel[i*3+1] = Math.random() * 3;
            vel[i*3+2] = (Math.random() - 0.5) * 4;
        }
        return pos;
    }, []);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3));
        return geo;
    }, [positions]);

    const material = useMemo(() => new THREE.PointsMaterial({
        size: 0.03,
        transparent: true,
        opacity: 0.65,
        sizeAttenuation: true,
        vertexColors: false,
        color: new THREE.Color(0.3, 0.5, 1.0),
    }), []);

    // Sync explode flag
    useEffect(() => {
        if (explode && !explodeRef.current) {
            explodeRef.current = true;
            explodeT.current = 0;
        }
        if (!explode) {
            explodeRef.current = false;
        }
    }, [explode]);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;
        const pos = geometry.attributes.position as THREE.BufferAttribute;
        const t = state.clock.getElapsedTime();

        // Rotate whole vortex (speed 0=slow, 1=medium, 2=fast)
        const baseRot = 0.003 + speed * 0.012;
        pointsRef.current.rotation.y += baseRot;

        if (explodeRef.current) {
            // Burst phase: scatter particles outward
            explodeT.current += delta;
            const progress = Math.min(explodeT.current / 1.4, 1);
            const eased = progress * (2 - progress); // ease-out quad

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const ox = origins.current[i*3];
                const oy = origins.current[i*3+1];
                const oz = origins.current[i*3+2];
                const vx = velocities.current[i*3];
                const vy = velocities.current[i*3+1];
                const vz = velocities.current[i*3+2];

                pos.setXYZ(i,
                    ox + vx * eased,
                    oy + vy * eased,
                    oz + vz * eased,
                );
            }

            // Flash color to white on burst
            material.color.setRGB(
                0.3 + eased * 0.7,
                0.5 + eased * 0.5,
                1.0,
            );
            material.opacity = 0.65 * (1 - progress * 0.4);

        } else {
            // Normal vortex breathing
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                const ox = origins.current[i*3];
                const oy = origins.current[i*3+1];
                const oz = origins.current[i*3+2];

                // Radial breathing oscillation
                const wave = 1 + Math.sin(t * (1 + speed * 0.5) + i * 0.05) * 0.08;
                pos.setXYZ(i, ox * wave, oy, oz * wave);
            }

            // Color shift from blue to purple during typing
            material.color.setRGB(
                0.3 + speed * 0.2,
                0.5 - speed * 0.1,
                1.0,
            );
            material.opacity = 0.55 + speed * 0.1;
        }

        pos.needsUpdate = true;
    });

    return (
        <>
            <points ref={pointsRef} geometry={geometry} material={material} />
            {/* Central core glow */}
            <pointLight color={new THREE.Color(0.3, 0.5, 1.0)} intensity={1.0 + speed * 0.5} distance={4} position={[0, 0, 0]} />
        </>
    );
};

// ── Public Component ──────────────────────────────────────────────────────────
interface ContactVortex3DProps {
    isTyping: boolean;
    isSubmitting: boolean;
    isSuccess: boolean;
    className?: string;
}

const ContactVortex3D = ({ isTyping, isSubmitting, isSuccess, className = '' }: ContactVortex3DProps) => {
    const speed = isSubmitting ? 2 : isTyping ? 1 : 0;
    const explode = isSuccess;

    return (
        <div className={`w-full h-full ${className}`} aria-hidden="true">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 55 }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.1} />
                <VortexParticles speed={speed} explode={explode} />
            </Canvas>
        </div>
    );
};

export default ContactVortex3D;
