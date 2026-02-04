import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const Robot3D = () => {
    const groupRef = useRef<THREE.Group>(null!);
    const headRef = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (groupRef.current) {
            // Floating animation
            groupRef.current.position.y = Math.sin(time * 2) * 0.1;
        }

        if (headRef.current) {
            // Simple mouse tracking
            const mouseX = state.mouse.x * 0.5;
            const mouseY = state.mouse.y * 0.5;

            // Lerp rotation for smooth looking
            headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouseX, 0.1);
            headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouseY, 0.1);
        }
    });

    return (
        <group ref={groupRef}>
            {/* Head Group for rotation */}
            <group ref={headRef}>
                {/* Main Head Shape - Lighter Grey Metal */}
                <RoundedBox args={[1.2, 1, 1]} radius={0.2} smoothness={4}>
                    <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} envMapIntensity={1} />
                </RoundedBox>

                {/* Face Screen (Black Glass) */}
                <RoundedBox args={[1.0, 0.6, 0.05]} radius={0.05} smoothness={4} position={[0, 0, 0.51]}>
                    <meshStandardMaterial color="#050505" roughness={0.1} metalness={1} />
                </RoundedBox>

                {/* Glowing Eyes - Brighter & larger */}
                {/* Left Eye */}
                <mesh position={[-0.25, 0, 0.54]}>
                    <planeGeometry args={[0.22, 0.1]} />
                    <meshBasicMaterial color="#00aaff" toneMapped={false} />
                </mesh>
                <pointLight position={[-0.25, 0, 0.6]} color="#00aaff" intensity={2} distance={2} />

                {/* Right Eye */}
                <mesh position={[0.25, 0, 0.54]}>
                    <planeGeometry args={[0.22, 0.1]} />
                    <meshBasicMaterial color="#00aaff" toneMapped={false} />
                </mesh>
                <pointLight position={[0.25, 0, 0.6]} color="#00aaff" intensity={2} distance={2} />

                {/* Antenna - Metallic */}
                <mesh position={[0, 0.6, 0]}>
                    <cylinderGeometry args={[0.02, 0.02, 0.3]} />
                    <meshStandardMaterial color="#888" metalness={1} roughness={0.2} />
                </mesh>
                <mesh position={[0, 0.8, 0]}>
                    <sphereGeometry args={[0.08]} />
                    <meshBasicMaterial color="#ff3333" toneMapped={false} />
                </mesh>
                <pointLight position={[0, 0.8, 0]} color="#ff3333" intensity={1} distance={1} />
            </group>

            {/* Neck */}
            <mesh position={[0, -0.6, 0]}>
                <cylinderGeometry args={[0.1, 0.1, 0.2]} />
                <meshStandardMaterial color="#444" metalness={0.5} />
            </mesh>

            {/* Body */}
            <mesh position={[0, -1.2, 0]}>
                <sphereGeometry args={[0.65]} />
                <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.8} />
            </mesh>

            {/* Core Light */}
            <mesh position={[0, -1.2, 0.55]}>
                <circleGeometry args={[0.15]} />
                <meshBasicMaterial color="#00aaff" toneMapped={false} />
            </mesh>
            <pointLight position={[0, -1.2, 1]} color="#00aaff" intensity={1.5} distance={2} />

            {/* Extra Rim Light for separation */}
            <spotLight position={[5, 5, -5]} intensity={5} color="#4444ff" angle={0.5} penumbra={1} />
            <spotLight position={[-5, 5, -5]} intensity={5} color="#ff4444" angle={0.5} penumbra={1} />
        </group>
    );
};

export default Robot3D;
