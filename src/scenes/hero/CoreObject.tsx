"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

/**
 * Central architectural object — a transmissive icosahedron framed by
 * two slowly counter-rotating wireframe shells.
 *
 * Communicates: layered systems, transparency, precision engineering.
 */
export function CoreObject() {
  const groupRef = useRef<THREE.Group>(null);
  const shellA = useRef<THREE.Mesh>(null);
  const shellB = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.12;
    }
    if (shellA.current) {
      shellA.current.rotation.x = t * 0.18;
      shellA.current.rotation.y = -t * 0.22;
    }
    if (shellB.current) {
      shellB.current.rotation.x = -t * 0.1;
      shellB.current.rotation.z = t * 0.16;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.2, 0]} scale={1.05}>
      {/* Inner transmissive crystal */}
      <mesh>
        <icosahedronGeometry args={[0.62, 4]} />
        <MeshTransmissionMaterial
          color="#9FD0FF"
          thickness={0.6}
          roughness={0.05}
          transmission={1}
          ior={1.4}
          chromaticAberration={0.06}
          backside
          backsideThickness={0.4}
          distortion={0.15}
          distortionScale={0.3}
          temporalDistortion={0.1}
          anisotropicBlur={0.2}
        />
      </mesh>

      {/* Wireframe shell A */}
      <mesh ref={shellA}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshBasicMaterial
          color="#7AB6FF"
          wireframe
          transparent
          opacity={0.28}
        />
      </mesh>

      {/* Wireframe shell B */}
      <mesh ref={shellB}>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshBasicMaterial
          color="#7AB6FF"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Soft inner glow point */}
      <pointLight position={[0, 0, 0]} intensity={0.9} color="#9FD0FF" distance={3} />
    </group>
  );
}
