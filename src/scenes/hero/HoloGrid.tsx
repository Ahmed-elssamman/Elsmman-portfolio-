"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Architectural ground grid that fades from center.
 * Uses a custom shader on a plane — no heavy geometry, sharp lines at any scale.
 */
export function HoloGrid() {
  const ref = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#7AB6FF") },
      uFade: { value: 0.0 },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.6, 0]}
    >
      <planeGeometry args={[40, 40, 1, 1]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={vert}
        fragmentShader={frag}
      />
    </mesh>
  );
}

const vert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const frag = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3  uColor;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  // Anti-aliased grid line based on screen-space derivatives.
  float gridLine(vec2 p, float spacing, float thickness) {
    vec2 g = abs(fract(p / spacing - 0.5) - 0.5) / fwidth(p / spacing);
    float l = min(g.x, g.y);
    return 1.0 - smoothstep(0.0, thickness, l);
  }

  void main() {
    vec2 p = vWorldPos.xz;

    float fine = gridLine(p, 0.6, 1.4);
    float major = gridLine(p, 3.0, 1.6);

    // Distance from center — radial fade.
    float d = length(p);
    float radial = 1.0 - smoothstep(4.0, 14.0, d);

    // Slow scan pulse moving outward.
    float pulse = smoothstep(0.0, 0.06, sin(d * 0.6 - uTime * 0.6));
    pulse *= smoothstep(14.0, 6.0, d);

    float intensity = (fine * 0.18 + major * 0.55) * radial + pulse * 0.08;

    vec3 col = uColor * intensity;
    float alpha = intensity * 0.9;
    gl_FragColor = vec4(col, alpha);
  }
`;
