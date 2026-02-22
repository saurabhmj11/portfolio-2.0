import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';
import useIsMobile from '../hooks/useIsMobile';

const Crystal = () => {
    const meshRef = useRef<THREE.Mesh>(null!);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
            meshRef.current.rotation.y = time * 0.15;
        }
    });

    return (
        <group>
            <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                <mesh ref={meshRef} scale={1.2}>
                    <icosahedronGeometry args={[1, 0]} />
                    <MeshTransmissionMaterial
                        backside
                        resolution={1024}
                        thickness={0.3}
                        roughness={0}
                        transmission={1}
                        ior={1.5}
                        chromaticAberration={0.1}
                        anisotropy={1}
                        distortion={0.2}
                        distortionScale={0.3}
                        temporalDistortion={0.1}
                        color={"#a8c7ff"}
                    />
                </mesh>
            </Float>
            <Float speed={1.5} rotationIntensity={2} floatIntensity={0.5} position={[2, 1, -2]}>
                <mesh scale={0.5}>
                    <octahedronGeometry />
                    <MeshTransmissionMaterial
                        backside
                        resolution={512}
                        thickness={0.1}
                        roughness={0}
                        transmission={1}
                        ior={1.5}
                        chromaticAberration={0.2}
                        color={"#ffb8d9"}
                    />
                </mesh>
            </Float>
            <Float speed={1.8} rotationIntensity={1.5} floatIntensity={0.7} position={[-2, -1, -1]}>
                <mesh scale={0.6}>
                    <dodecahedronGeometry />
                    <MeshTransmissionMaterial
                        backside
                        resolution={512}
                        thickness={0.15}
                        roughness={0.1}
                        transmission={1}
                        ior={1.5}
                        chromaticAberration={0.1}
                        color={"#d9f99d"}
                    />
                </mesh>
            </Float>
        </group>
    );
};

const Hero3D = () => {
    const isMobile = useIsMobile();

    // Completely disable 3D Canvas on mobile to fix extreme lag.
    if (isMobile) return null;

    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ alpha: true }} dpr={[1, 2]}>
                <ambientLight intensity={0.5} />
                <Environment preset="city" />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Crystal />
            </Canvas>
        </div>
    );
};

export default Hero3D;
