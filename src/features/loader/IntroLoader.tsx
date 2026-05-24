"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "@/stores/experience.store";
import { easing } from "@/lib/easing";

/**
 * Minimal boot reveal. ~500ms — just enough for a polished entrance,
 * never blocks content. Skips entirely on reduced-motion.
 */
export function IntroLoader({
  name,
  role,
}: {
  name: string;
  role: string;
}) {
  const phase = useExperience((s) => s.phase);
  const setPhase = useExperience((s) => s.setPhase);
  const reducedMotion = useExperience((s) => s.reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setPhase("ready");
      return;
    }
    setPhase("loading");
    const t = window.setTimeout(() => setPhase("ready"), 600);
    return () => window.clearTimeout(t);
  }, [setPhase, reducedMotion]);

  const show = phase === "boot" || phase === "loading";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-deep"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: easing.exit }}
          aria-hidden
        >
          <div className="absolute inset-0 bg-mesh-1 opacity-60" />
          <div className="absolute inset-0 grid-overlay opacity-30" />

          <div className="relative flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-2 border-accent/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-accent border-r-violet rounded-full animate-spin" />
              <div className="absolute inset-2 border border-violet/30 rounded-full animate-spin-rev" />
            </div>
            <div className="text-center">
              <div className="font-display text-xl tracking-tight text-ink">
                {name}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-mute mt-1">
                {role}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
