"use client";

import { ReactNode } from "react";
import { useReducedMotionSync } from "@/hooks/useReducedMotion";

export function ExperienceProviders({ children }: { children: ReactNode }) {
  useReducedMotionSync();
  return <>{children}</>;
}
