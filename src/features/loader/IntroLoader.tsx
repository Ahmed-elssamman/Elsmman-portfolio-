"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useExperience } from "@/stores/experience.store";
import { easing } from "@/lib/easing";

// Boot lines that print sequentially.
const BOOT_LINES = [
  "init kernel ........................ ok",
  "mount graphics pipeline ............ ok",
  "compile shaders .................... ok",
  "stream realtime channel ............ ok",
  "calibrate experience ............... ok",
];

/**
 * Cinematic boot sequence.
 *
 * Sequence:
 *  - phase "boot": pre-paint, mounted invisible
 *  - phase "loading": animates a system-initialization timeline (~2.6s)
 *  - phase "ready": fades the loader out, reveals the page
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
  const setProgress = useExperience((s) => s.setProgress);
  const progress = useExperience((s) => s.progress);
  const reducedMotion = useExperience((s) => s.reducedMotion);

  const [visibleLines, setVisibleLines] = useState<number>(0);
  const lines = BOOT_LINES;

  // Kick off the loader timeline. Cleanup cancels the raf/timer so React
  // StrictMode's double-invoke in dev is safe — the second mount just
  // re-runs the timeline from zero and reaches "ready" normally.
  useEffect(() => {
    setPhase("loading");

    const total = reducedMotion ? 600 : 2600;
    const start = performance.now();
    const lineCount = BOOT_LINES.length;
    let raf = 0;
    let revealTimer = 0;
    // Hard safety net — if anything stalls the rAF loop (tab backgrounded,
    // dev hot-reload, etc.), force the page to reveal after a worst-case.
    const failsafe = window.setTimeout(() => setPhase("ready"), total + 1500);

    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / total);
      // ease-out curve so it feels weighted at the end
      const eased = 1 - Math.pow(1 - k, 3);
      setProgress(eased);

      const linesToShow = Math.min(
        lineCount,
        Math.floor(eased * lineCount + 0.0001)
      );
      setVisibleLines(linesToShow);

      if (k < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setVisibleLines(lineCount);
        // Hold a beat, then reveal.
        revealTimer = window.setTimeout(
          () => setPhase("ready"),
          reducedMotion ? 60 : 320
        );
      }
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(revealTimer);
      window.clearTimeout(failsafe);
    };
  }, [setPhase, setProgress, reducedMotion]);

  const show = phase === "boot" || phase === "loading";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: easing.exit }}
          aria-hidden
        >
          {/* Background grid + radial */}
          <div className="absolute inset-0 grid-overlay opacity-60" />
          <div className="absolute inset-0 bg-radial-glow opacity-50" />

          {/* Scanline */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
            initial={{ top: "0%", opacity: 0 }}
            animate={{ top: "100%", opacity: 0.6 }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "linear",
              repeatType: "loop",
            }}
          />

          {/* Center panel */}
          <div className="relative w-[min(540px,86vw)] glass-panel hairline rounded-sm px-6 py-7">
            {/* Header */}
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-ink-dim">
              <span>System / Boot</span>
              <span className="text-accent">v0.21.0</span>
            </div>

            {/* Identity */}
            <div className="mt-5">
              <div className="text-[11px] uppercase tracking-[0.32em] text-ink-mute">
                Initializing
              </div>
              <div className="mt-1 font-display text-2xl md:text-3xl tracking-tight">
                {name}
              </div>
              <div className="text-ink-mute text-sm">{role}</div>
            </div>

            {/* Log */}
            <div className="mt-6 font-mono text-[12px] leading-relaxed text-ink-mute min-h-[7.5em]">
              {lines.map((l, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -6 }}
                  animate={
                    i < visibleLines
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0, x: -6 }
                  }
                  transition={{ duration: 0.35, ease: easing.enter }}
                >
                  <span className="text-accent">›</span>
                  <span>{l}</span>
                </motion.div>
              ))}
            </div>

            {/* Progress */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-ink-dim">
                <span>Boot Progress</span>
                <span className="text-accent">{Math.round(progress * 100)}%</span>
              </div>
              <div className="mt-2 h-px w-full bg-edge overflow-hidden">
                <motion.div
                  className="h-full bg-accent"
                  style={{ width: `${progress * 100}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>
            </div>
          </div>

          {/* Corner brackets */}
          <Brackets />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Brackets() {
  return (
    <>
      {[
        "top-6 left-6 border-t border-l",
        "top-6 right-6 border-t border-r",
        "bottom-6 left-6 border-b border-l",
        "bottom-6 right-6 border-b border-r",
      ].map((cls) => (
        <div
          key={cls}
          className={`absolute h-6 w-6 border-accent/40 ${cls}`}
        />
      ))}
    </>
  );
}
