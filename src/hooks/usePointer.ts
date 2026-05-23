"use client";

import { useEffect } from "react";
import { useExperience } from "@/stores/experience.store";

// Global normalized pointer (-0.5..0.5). Used by 3D scenes and parallax layers.
export function usePointerSync() {
  const setPointer = useExperience((s) => s.setPointer);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      setPointer(cx, cy);
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [setPointer]);
}
