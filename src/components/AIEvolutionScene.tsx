import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { MathUtils } from 'three';
import { MotionValue } from 'framer-motion';

// ── Color palette per scene ────────────────────────────────────────────────
const sceneColors = [
    new THREE.Color('#0ea5e9'), // Awakening — sky blue
    new THREE.Color('#06b6d4'), // Neural Learning — cyan
    new THREE.Color('#3b82f6'), // Timeline — electric blue
    new THREE.Color('#8b5cf6'), // Galaxy — violet
    new THREE.Color('#a855f7'), // AI Core — purple
];

const getSceneColor = (p: number): THREE.Color => {
    const idx = Math.min(p * 5, 4);
    const lo = Math.floor(idx);
    const hi = Math.min(lo + 1, 4);
    const t = idx - lo;
    return sceneColors[lo].clone().lerp(sceneColors[hi], t);
};

// ── Particle Field ─────────────────────────────────────────────────────────
// 300 particles that morph through all 5 stages via position lerping
const ParticleField = ({ progress }: { progress: MotionValue<number> }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const groupRef = useRef<THREE.Group>(null);

    const PARTICLE_COUNT = 300;

    // Base positions — random sphere
    const basePositions = useMemo(() => {
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const r = 3.5 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        return positions;
    }, []);

    // Working buffer for morphing
    const [dynamicPositions] = useState(() => new Float32Array(basePositions));

    useFrame((state) => {
        if (!pointsRef.current || !groupRef.current) return;
        const p = progress.get();
        const time = state.clock.getElapsedTime();

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
            const bx = basePositions[ix], by = basePositions[iy], bz = basePositions[iz];

            // Default — Scene 1: Gentle drift in void
            let tx = bx + Math.sin(time * 0.5 + i * 0.1) * 0.15;
            let ty = by + Math.cos(time * 0.4 + i * 0.15) * 0.15;
            let tz = bz + Math.sin(time * 0.3 - i * 0.05) * 0.15;

            // Scene 2 (0.2–0.4): Snap into structured network — tighten positions
            if (p > 0.15) {
                const networkP = MathUtils.clamp((p - 0.15) / 0.25, 0, 1);
                // Snap particles closer to grid-like positions
                const gridX = Math.round(bx * 2) / 2;
                const gridY = Math.round(by * 2) / 2;
                const gridZ = Math.round(bz * 2) / 2;
                tx = MathUtils.lerp(tx, gridX + Math.sin(time + i) * 0.05, networkP);
                ty = MathUtils.lerp(ty, gridY + Math.cos(time + i) * 0.05, networkP);
                tz = MathUtils.lerp(tz, gridZ + Math.sin(time - i) * 0.05, networkP);
            }

            // Scene 4 (0.6–0.8): Galaxy swirl
            if (p > 0.55) {
                const swirlP = MathUtils.clamp((p - 0.55) / 0.25, 0, 1);
                const radius = Math.sqrt(bx * bx + bz * bz);
                const swirlAngle = radius * p * 6;
                const twistedX = bx * Math.cos(swirlAngle) - bz * Math.sin(swirlAngle);
                const twistedZ = bx * Math.sin(swirlAngle) + bz * Math.cos(swirlAngle);
                const flattenedY = by * (1 - swirlP * 0.85) + Math.sin(radius * 5 - time * 2) * 0.2 * swirlP;

                tx = MathUtils.lerp(tx, twistedX, swirlP);
                ty = MathUtils.lerp(ty, flattenedY, swirlP);
                tz = MathUtils.lerp(tz, twistedZ, swirlP);
            }

            // Scene 5 (0.8–1.0): Collapse into singularity
            if (p > 0.78) {
                const collapseP = MathUtils.clamp((p - 0.78) / 0.22, 0, 1);
                tx = MathUtils.lerp(tx, 0, collapseP * 0.85);
                ty = MathUtils.lerp(ty, 0, collapseP * 0.85);
                tz = MathUtils.lerp(tz, 0, collapseP * 0.85);
            }

            // Smooth interpolation to target
            dynamicPositions[ix] = MathUtils.lerp(dynamicPositions[ix], tx, 0.08);
            dynamicPositions[iy] = MathUtils.lerp(dynamicPositions[iy], ty, 0.08);
            dynamicPositions[iz] = MathUtils.lerp(dynamicPositions[iz], tz, 0.08);
        }

        pointsRef.current.geometry.attributes.position.needsUpdate = true;

        // Color evolution
        const currentColor = getSceneColor(p);
        (pointsRef.current.material as THREE.PointsMaterial).color.lerp(currentColor, 0.08);

        // Opacity: brighten as intelligence grows
        (pointsRef.current.material as THREE.PointsMaterial).opacity = MathUtils.lerp(0.4, 1, p);

        // Size: grow with evolution
        (pointsRef.current.material as THREE.PointsMaterial).size = MathUtils.lerp(0.04, 0.07, p);

        // Parallax — subtle mouse tracking
        groupRef.current.position.x = MathUtils.lerp(groupRef.current.position.x, state.pointer.x * 1.5, 0.03);
        groupRef.current.position.y = MathUtils.lerp(groupRef.current.position.y, state.pointer.y * 1.5, 0.03);

        // Continuous rotation — accelerates with progress
        groupRef.current.rotation.y += 0.0008 + p * 0.003;
        groupRef.current.rotation.x += 0.0003 + p * 0.001;
    });

    return (
        <group ref={groupRef}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={PARTICLE_COUNT}
                        array={dynamicPositions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    size={0.04}
                    color="#0ea5e9"
                    transparent
                    opacity={0.4}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    sizeAttenuation
                />
            </points>
        </group>
    );
};

// ── Neural Connections ─────────────────────────────────────────────────────
// LineSegments between nearby particles — fade in during Scene 2, dissolve in Scene 4
const NeuralConnections = ({ progress, positions }: {
    progress: MotionValue<number>;
    positions: Float32Array;
}) => {
    const linesRef = useRef<THREE.LineSegments>(null);

    const lineIndices = useMemo(() => {
        const indices: number[] = [];
        const count = positions.length / 3;
        for (let i = 0; i < count; i++) {
            for (let j = i + 1; j < count; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                if (Math.sqrt(dx * dx + dy * dy + dz * dz) < 0.9) {
                    indices.push(i, j);
                }
                if (indices.length > 300) break; // cap at 150 connections
            }
            if (indices.length > 300) break;
        }
        return new Uint16Array(indices);
    }, [positions]);

    useFrame(() => {
        if (!linesRef.current) return;
        const p = progress.get();

        // Lines visible during scenes 2–3, fade out in scene 4
        const fadeIn = MathUtils.clamp((p - 0.15) / 0.15, 0, 1);
        const fadeOut = MathUtils.clamp((p - 0.6) / 0.15, 0, 1);
        const lineOpacity = Math.min(0.4, fadeIn * 0.4) * (1 - fadeOut);

        (linesRef.current.material as THREE.LineBasicMaterial).opacity = lineOpacity;

        // Draw range — lines grow gradually
        const totalLines = lineIndices.length;
        const drawCount = Math.floor(MathUtils.clamp((p - 0.15) / 0.25, 0, 1) * totalLines);
        linesRef.current.geometry.setDrawRange(0, drawCount);

        // Color evolution
        const currentColor = getSceneColor(p);
        (linesRef.current.material as THREE.LineBasicMaterial).color.lerp(currentColor, 0.08);
    });

    return (
        <lineSegments ref={linesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="index"
                    count={lineIndices.length}
                    array={lineIndices}
                    itemSize={1}
                />
            </bufferGeometry>
            <lineBasicMaterial
                color="#06b6d4"
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </lineSegments>
    );
};

// ── AI Core ────────────────────────────────────────────────────────────────
// Glowing sphere that materializes in Scene 5
const AICore = ({ progress }: { progress: MotionValue<number> }) => {
    const coreRef = useRef<THREE.Mesh>(null);
    const matRef = useRef<THREE.MeshStandardMaterial>(null);

    useFrame((state) => {
        if (!coreRef.current || !matRef.current) return;
        const p = progress.get();
        const time = state.clock.getElapsedTime();

        // Materialize from progress 0.75 onwards
        const visibility = MathUtils.clamp((p - 0.75) / 0.25, 0, 1);

        const scale = MathUtils.lerp(0.01, 1.2, visibility);
        coreRef.current.scale.setScalar(scale);

        // Heartbeat pulse
        const pulse = 2 + Math.sin(time * 3.0) * 1.5;

        const currentColor = getSceneColor(p);
        matRef.current.color.lerp(currentColor, 0.08);
        matRef.current.emissive.copy(currentColor);
        matRef.current.emissiveIntensity = pulse * visibility;
        matRef.current.opacity = MathUtils.lerp(0, 0.9, visibility);

        // Spin
        coreRef.current.rotation.x += 0.005 * (1 + p);
        coreRef.current.rotation.y += 0.008 * (1 + p * 2);
    });

    return (
        <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={coreRef} scale={0}>
                <sphereGeometry args={[1.2, 64, 64]} />
                <meshStandardMaterial
                    ref={matRef}
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={0}
                    transparent
                    opacity={0}
                    roughness={0.1}
                    metalness={0.9}
                />
            </mesh>
        </Float>
    );
};

// ── Orbital Rings ──────────────────────────────────────────────────────────
// Two torus rings orbiting the AI core, visible only in Scene 5
const OrbitalRings = ({ progress }: { progress: MotionValue<number> }) => {
    const groupRef = useRef<THREE.Group>(null);
    const mat1 = useRef<THREE.MeshStandardMaterial>(null);
    const mat2 = useRef<THREE.MeshStandardMaterial>(null);

    useFrame((_, delta) => {
        if (!groupRef.current || !mat1.current || !mat2.current) return;
        const p = progress.get();

        const visibility = MathUtils.clamp((p - 0.8) / 0.2, 0, 1);

        groupRef.current.visible = visibility > 0.01;
        if (!groupRef.current.visible) return;

        groupRef.current.scale.setScalar(MathUtils.lerp(3, 1, visibility));

        // Independent rotations
        groupRef.current.children[0].rotation.x += delta * 1.2;
        groupRef.current.children[0].rotation.y += delta * 1.5;
        groupRef.current.children[1].rotation.x -= delta * 0.8;
        groupRef.current.children[1].rotation.z += delta * 2.0;

        const currentColor = getSceneColor(p);

        mat1.current.color.copy(currentColor);
        mat1.current.emissive.copy(currentColor).multiplyScalar(2 * visibility);
        mat1.current.opacity = visibility * 0.8;

        mat2.current.color.setHex(0x06b6d4);
        mat2.current.emissive.setHex(0x06b6d4).multiplyScalar(1.5 * visibility);
        mat2.current.opacity = visibility * 0.6;
    });

    return (
        <group ref={groupRef} visible={false}>
            <mesh>
                <torusGeometry args={[1.5, 0.015, 16, 100]} />
                <meshStandardMaterial ref={mat1} color="#ffffff" transparent depthWrite={false} />
            </mesh>
            <mesh>
                <torusGeometry args={[1.8, 0.008, 16, 100]} />
                <meshStandardMaterial ref={mat2} color="#ffffff" transparent depthWrite={false} />
            </mesh>
        </group>
    );
};

// ── Atmosphere ─────────────────────────────────────────────────────────────
const Atmosphere = ({ progress }: { progress: MotionValue<number> }) => {
    const sparklesRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!sparklesRef.current) return;
        const p = progress.get();
        const scale = 1 + p * 0.3;
        sparklesRef.current.scale.setScalar(scale);
        sparklesRef.current.rotation.y -= 0.0005;

        sparklesRef.current.children.forEach((c) => {
            const points = c as THREE.Points;
            if (points.material && 'color' in points.material) {
                (points.material as THREE.PointsMaterial).color.lerp(getSceneColor(p), 0.05);
            }
        });
    });

    return (
        <group ref={sparklesRef}>
            <Sparkles
                count={200}
                scale={10}
                size={3}
                speed={0.8}
                opacity={0.25}
                color="#ffffff"
                noise={1}
            />
        </group>
    );
};

// ── Camera Rig ─────────────────────────────────────────────────────────────
// Subtle camera motion driven by scroll to enhance cinematic feeling
const CameraRig = ({ progress }: { progress: MotionValue<number> }) => {
    useFrame((state) => {
        const p = progress.get();

        // Subtle camera orbit through the journey
        const camX = Math.sin(p * Math.PI * 0.5) * 1.5;
        const camY = MathUtils.lerp(0.5, -0.3, p);
        const camZ = MathUtils.lerp(7, 5, p);

        state.camera.position.x = MathUtils.lerp(state.camera.position.x, camX, 0.03);
        state.camera.position.y = MathUtils.lerp(state.camera.position.y, camY, 0.03);
        state.camera.position.z = MathUtils.lerp(state.camera.position.z, camZ, 0.03);
        state.camera.lookAt(0, 0, 0);
    });

    return null;
};

// ── Main Scene Export ──────────────────────────────────────────────────────
const AIEvolutionScene = ({ progress }: { progress: MotionValue<number> }) => {
    // Generate base positions once for sharing between particles and connections
    const basePositions = useMemo(() => {
        const count = 300;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 3.5 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        return positions;
    }, []);

    return (
        <div className="w-full h-full absolute inset-0 z-0">
            <Canvas
                camera={{ position: [0, 0.5, 7], fov: 50 }}
                dpr={[1, 1.5]}
                performance={{ min: 0.5 }}
                gl={{ antialias: false, powerPreference: 'high-performance' }}
            >
                <color attach="background" args={['#020617']} />
                <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#8b5cf6" />

                <CameraRig progress={progress} />
                <ParticleField progress={progress} />
                <NeuralConnections progress={progress} positions={basePositions} />
                <AICore progress={progress} />
                <OrbitalRings progress={progress} />
                <Atmosphere progress={progress} />
            </Canvas>
        </div>
    );
};

export default AIEvolutionScene;
