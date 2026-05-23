"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useExperience } from "@/stores/experience.store";
import { easing } from "@/lib/easing";
import type { Profile } from "@/lib/data-schemas";

// Lazy-load the heavy R3F canvas client-side only.
const HeroScene = dynamic(
  () => import("@/scenes/hero/HeroScene").then((m) => m.HeroScene),
  { ssr: false }
);

export function HeroSection({ profile }: { profile: Profile }) {
  const phase = useExperience((s) => s.phase);
  const ready = phase === "ready" || phase === "explore";

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: easing.enter } },
  };

  const [firstName, ...rest] = profile.name.split(" ");
  const lastName = rest.join(" ");

  return (
    <section
      id="hero"
      className="relative w-full h-[100svh] min-h-[640px] overflow-hidden"
    >
      <HeroScene />
      <HudFrame role={profile.role} />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end md:justify-center pointer-events-none">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
          className="w-full max-w-[1240px] px-6 md:px-12 pb-16 md:pb-0"
        >
          <motion.div
            variants={item}
            className="font-mono text-[10px] uppercase tracking-[0.36em] text-accent/80"
          >
            ◇ Live · Engineering Console
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 font-display text-[clamp(2.4rem,7vw,6.2rem)] leading-[0.95] tracking-tighter text-balance"
          >
            <span className="text-ink">{firstName}</span>{" "}
            {lastName && <span className="text-ink/80">{lastName}</span>}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-2xl text-ink-mute text-base md:text-lg leading-relaxed text-balance"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-3 pointer-events-auto"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 border border-accent/40 bg-accent/5 px-5 py-2.5 text-sm tracking-wide text-ink hover:bg-accent/10 transition"
            >
              <span>Enter the System</span>
              <span className="text-accent transition group-hover:translate-x-0.5">
                →
              </span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-edge-strong px-5 py-2.5 text-sm tracking-wide text-ink-mute hover:text-ink hover:border-ink-mute transition"
            >
              Open Console
            </a>
          </motion.div>
        </motion.div>
      </div>

      <BottomTelemetry ready={ready} items={profile.telemetry} />
    </section>
  );
}

function HudFrame({ role }: { role: string }) {
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
          className={`absolute h-5 w-5 border-accent/30 pointer-events-none z-20 ${cls}`}
        />
      ))}

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 hidden sm:flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim pointer-events-none">
        <span className="text-accent">● link</span>
        <span>sys.ready</span>
        <span className="text-ink-mute">v0.21.0</span>
      </div>

      <div className="hidden md:block absolute top-1/2 right-6 -translate-y-1/2 z-20 rotate-90 origin-right font-mono text-[10px] uppercase tracking-[0.36em] text-ink-dim pointer-events-none whitespace-nowrap">
        {role} · 2026
      </div>
    </>
  );
}

function BottomTelemetry({
  ready,
  items,
}: {
  ready: boolean;
  items: { k: string; v: string }[];
}) {
  if (items.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 1, ease: easing.enter, delay: 0.6 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex items-center gap-6 lg:gap-8 px-5 py-2 glass-panel hairline rounded-sm pointer-events-none"
    >
      {items.map((it) => (
        <div
          key={it.k}
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]"
        >
          <span className="text-ink-dim">{it.k}</span>
          <span className="text-ink">{it.v}</span>
        </div>
      ))}
    </motion.div>
  );
}
