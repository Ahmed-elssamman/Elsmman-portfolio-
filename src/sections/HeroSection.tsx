"use client";

import { motion } from "framer-motion";
import { useExperience } from "@/stores/experience.store";
import { easing } from "@/lib/easing";
import type { Profile } from "@/lib/data-schemas";
import { AuroraBackground } from "@/components/hero/AuroraBackground";
import { StarField } from "@/components/hero/StarField";

export function HeroSection({ profile }: { profile: Profile }) {
  const phase = useExperience((s) => s.phase);
  const ready = phase === "ready" || phase === "explore" || phase === "boot";

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easing.enter },
    },
  };

  const [firstName, ...rest] = profile.name.split(" ");
  const lastName = rest.join(" ");

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100svh] overflow-hidden flex items-center"
    >
      <AuroraBackground />
      <StarField density={90} />

      {/* Architectural grid overlay */}
      <div className="absolute inset-0 grid-overlay opacity-[0.35] pointer-events-none" />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(7,8,17,0.85) 100%)",
        }}
      />

      <HudFrame role={profile.role} />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-5 sm:px-8 md:px-12 py-24 sm:py-28">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={ready ? "show" : "hidden"}
          className="flex flex-col"
        >
          <motion.div
            variants={item}
            className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.36em] text-accent/90 flex items-center gap-3"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
            Live · Engineering Console
            <span className="hidden sm:inline text-ink-dim">·</span>
            <span className="hidden sm:inline text-ink-dim">v1.0.0</span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 font-display font-semibold text-[clamp(2.6rem,8.5vw,7rem)] leading-[0.95] tracking-tighter text-balance"
          >
            <span className="gradient-text">{firstName}</span>
            {lastName && (
              <>
                {" "}
                <span className="stroke-text">{lastName}</span>
              </>
            )}
          </motion.h1>

          <motion.div
            variants={item}
            className="mt-5 sm:mt-7 flex flex-wrap items-center gap-2 sm:gap-3"
          >
            <RoleTag>{profile.role}</RoleTag>
            <span className="text-ink-dim text-xs">·</span>
            <RoleTag tone="violet">Angular Specialist</RoleTag>
            <span className="text-ink-dim text-xs hidden sm:inline">·</span>
            <RoleTag tone="signal">Enterprise Applications</RoleTag>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-6 sm:mt-8 max-w-2xl text-ink-mute text-base sm:text-lg leading-relaxed text-balance"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="group relative inline-flex items-center gap-2 overflow-hidden border border-accent/50 bg-accent/10 px-5 py-3 text-sm tracking-wide text-ink hover:bg-accent/20 transition-colors"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/30 to-transparent group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative">Explore the System</span>
              <span className="relative text-accent transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-edge-strong px-5 py-3 text-sm tracking-wide text-ink-mute hover:text-ink hover:border-violet/40 transition"
            >
              Open Console
              <span className="text-violet">↗</span>
            </a>
          </motion.div>

          <motion.div variants={item} className="mt-10 sm:mt-14">
            <TelemetryRow items={profile.telemetry} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function RoleTag({
  children,
  tone = "accent",
}: {
  children: React.ReactNode;
  tone?: "accent" | "violet" | "signal";
}) {
  const tones = {
    accent: "border-accent/40 text-accent bg-accent/5",
    violet: "border-violet/40 text-violet bg-violet/5",
    signal: "border-signal/40 text-signal bg-signal/5",
  } as const;
  return (
    <span
      className={`font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.22em] border px-2.5 py-1 ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function HudFrame({ role }: { role: string }) {
  return (
    <>
      {[
        "top-5 left-5 sm:top-6 sm:left-6 border-t border-l",
        "top-5 right-5 sm:top-6 sm:right-6 border-t border-r",
        "bottom-5 left-5 sm:bottom-6 sm:left-6 border-b border-l",
        "bottom-5 right-5 sm:bottom-6 sm:right-6 border-b border-r",
      ].map((cls) => (
        <div
          key={cls}
          className={`absolute h-5 w-5 sm:h-6 sm:w-6 border-accent/40 pointer-events-none z-20 ${cls}`}
        />
      ))}

      <div className="hidden md:block absolute top-1/2 right-6 -translate-y-1/2 z-20 rotate-90 origin-right font-mono text-[10px] uppercase tracking-[0.36em] text-ink-dim pointer-events-none whitespace-nowrap">
        {role} · 2026
      </div>
    </>
  );
}

function TelemetryRow({ items }: { items: { k: string; v: string }[] }) {
  if (!items?.length) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-edge-strong/40 rounded-sm overflow-hidden glass-panel hairline">
      {items.map((it) => (
        <div
          key={it.k}
          className="px-4 py-3 bg-bg-panel/60"
        >
          <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-ink-dim">
            {it.k}
          </div>
          <div className="mt-1 font-mono text-[12px] sm:text-[13px] text-ink truncate">
            {it.v}
          </div>
        </div>
      ))}
    </div>
  );
}
