"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, Stars } from "@react-three/drei";
import * as THREE from "three";

function FloatingShapes() {
  const torusRef = useRef<THREE.Mesh>(null);
  const icosahedronRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (torusRef.current) {
      torusRef.current.rotation.x += 0.002;
      torusRef.current.rotation.y += 0.003;
    }
    if (icosahedronRef.current) {
      icosahedronRef.current.rotation.x -= 0.001;
      icosahedronRef.current.rotation.y -= 0.002;
    }
  });

  return (
    <>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
        <mesh ref={torusRef} position={[-3, 1, -5]}>
          <torusGeometry args={[1.5, 0.4, 16, 64]} />
          <meshStandardMaterial
            color="#22c55e"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
        <mesh ref={icosahedronRef} position={[4, -2, -6]}>
          <icosahedronGeometry args={[2, 0]} />
          <meshStandardMaterial
            color="#ec4899"
            wireframe
            transparent
            opacity={0.2}
          />
        </mesh>
      </Float>

      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <mesh position={[0, -5, -4]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#4ade80"
            emissive="#22c55e"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      </Float>
    </>
  );
}

export default function Scene() {
  return (
    <div className="absolute inset-0 z-[-1] bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        <FloatingShapes />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
