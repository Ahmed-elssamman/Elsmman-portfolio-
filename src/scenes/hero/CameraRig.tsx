"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useExperience } from "@/stores/experience.store";

// Cinematic camera glide driven by pointer position and a slow ambient orbit.
export function CameraRig() {
  const { camera } = useThree();
  const pointer = useExperience((s) => s.pointer);
  const reducedMotion = useExperience((s) => s.reducedMotion);

  const tgt = useRef(new THREE.Vector3(0, 0.2, 0));
  const tmp = useRef(new THREE.Vector3());

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Base target — gentle ambient drift.
    const baseX = Math.sin(t * 0.12) * 0.15;
    const baseY = 0.4 + Math.sin(t * 0.18) * 0.08;
    const baseZ = 6.5 + Math.cos(t * 0.1) * 0.1;

    // Pointer parallax.
    const px = reducedMotion ? 0 : pointer.x * 0.9;
    const py = reducedMotion ? 0 : -pointer.y * 0.45;

    tmp.current.set(baseX + px, baseY + py, baseZ);
    camera.position.lerp(tmp.current, 0.05);

    // Always look at the floating core.
    tgt.current.set(0, 0.2, 0);
    camera.lookAt(tgt.current);
  });

  return null;
}
