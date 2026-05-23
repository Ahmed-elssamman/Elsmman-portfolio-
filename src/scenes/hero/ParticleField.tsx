"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience } from "@/stores/experience.store";

/**
 * GPU-cheap particle field built from a single Points object.
 * Particles drift through a bounded volume and respond subtly to pointer.
 */
export function ParticleField({ count = 220 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const pointer = useExperience((s) => s.pointer);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    return { positions, seeds };
  }, [count]);

  useFrame((state) => {
    const geo = points.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const t = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const s = seeds[i];
      arr[ix + 0] += Math.sin(t * 0.25 + s) * 0.0006;
      arr[ix + 1] += Math.cos(t * 0.3 + s * 1.3) * 0.0008;
      arr[ix + 2] += Math.sin(t * 0.22 + s * 0.7) * 0.0006;
    }
    pos.needsUpdate = true;

    if (points.current) {
      points.current.rotation.y += 0.0008;
      // Gentle parallax shift on pointer.
      points.current.position.x = -pointer.x * 0.6;
      points.current.position.y = pointer.y * 0.3;
    }
  });

  if (count === 0) return null;

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#9FD0FF"
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
