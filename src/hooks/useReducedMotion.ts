"use client";

import { useEffect } from "react";
import { useExperience } from "@/stores/experience.store";

export function useReducedMotionSync() {
  const setReducedMotion = useExperience((s) => s.setReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [setReducedMotion]);
}
