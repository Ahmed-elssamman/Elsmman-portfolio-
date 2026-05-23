"use client";

import { create } from "zustand";

export type ExperiencePhase =
  | "boot" // initial paint, loader hidden but mounting
  | "loading" // assets/timeline running
  | "ready" // loader complete, page revealed
  | "explore"; // user has scrolled past hero

interface ExperienceState {
  phase: ExperiencePhase;
  progress: number; // 0..1
  reducedMotion: boolean;
  pointer: { x: number; y: number }; // -0.5..0.5 normalized
  setPhase: (phase: ExperiencePhase) => void;
  setProgress: (n: number) => void;
  setReducedMotion: (v: boolean) => void;
  setPointer: (x: number, y: number) => void;
}

export const useExperience = create<ExperienceState>((set) => ({
  phase: "boot",
  progress: 0,
  reducedMotion: false,
  pointer: { x: 0, y: 0 },
  setPhase: (phase) => set({ phase }),
  setProgress: (progress) => set({ progress: Math.max(0, Math.min(1, progress)) }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setPointer: (x, y) => set({ pointer: { x, y } }),
}));
