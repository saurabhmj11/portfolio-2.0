import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader, extend, ReactThreeFiber } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

// -- Shader Material Definition --
const DistortionMaterial = shaderMaterial(
    {
        uTime: 0,
        uColorStart: new THREE.Color('#ffffff'),
        uColorEnd: new THREE.Color('#000000'),
        uTexture: new THREE.Texture(),
        uMouse: new THREE.Vector2(0, 0),
        uHover: 0,
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uHover;
    uniform vec2 uMouse;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // Distort position based on hover and sin wave
      float dist = distance(uv, uMouse);
      pos.z += sin(pos.x * 10.0 + uTime * 2.0) * 0.1 * uHover;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform sampler2D uTexture;
    uniform float uHover;
    uniform vec2 uMouse;
    varying vec2 vUv;

    void main() {
      // Liquid distortion math
      vec2 p = vUv;
      float dist = distance(p, uMouse);
      
      // Calculate distortion
      vec2 disp = normalize(p - uMouse) * uHover * 0.05 * (1.0 - smoothstep(0.0, 0.4, dist));
      
      vec4 textureColor = texture2D(uTexture, p - disp);
      gl_FragColor = textureColor;
    }
  `
);

extend({ DistortionMaterial });

declare global {
    namespace JSX {
        interface IntrinsicElements {
            distortionMaterial: ReactThreeFiber.Object3DNode<THREE.ShaderMaterial, typeof DistortionMaterial>;
        }
    }
}

interface SceneProps {
    image: string;
}

const Scene: React.FC<SceneProps> = ({ image }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null!);
    const texture = useLoader(THREE.TextureLoader, image);

    // Mouse tracking for the uniform
    useFrame((state) => {
        if (materialRef.current) {
            // Simple linear interpolation for hover state
            materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
                materialRef.current.uniforms.uHover.value,
                1, // Always hover for now when visible, or bind to interactive state
                0.1
            );
        }
    });

    return (
        <mesh>
            <planeGeometry args={[5, 4, 32, 32]} />
            {/* 
         // @ts-ignore - The shader material types are tricky with 'extend' 
      */}
            <distortionMaterial
                ref={materialRef}
                uTexture={texture}
                transparent={true}
            />
        </mesh>
    );
};

interface DistortionImageProps {
    image: string;
    className?: string;
}

const DistortionImage: React.FC<DistortionImageProps> = ({ image, className }) => {
    return (
        <div className={className}>
            <Canvas camera={{ position: [0, 0, 5] }}>
                <Scene image={image} />
            </Canvas>
        </div>
    );
};

export default DistortionImage;
