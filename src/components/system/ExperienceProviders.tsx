"use client";

import { ReactNode } from "react";
import { useLenisSmoothScroll } from "@/hooks/useLenis";
import { useReducedMotionSync } from "@/hooks/useReducedMotion";
import { usePointerSync } from "@/hooks/usePointer";

export function ExperienceProviders({ children }: { children: ReactNode }) {
  useLenisSmoothScroll();
  useReducedMotionSync();
  usePointerSync();
  return <>{children}</>;
}
