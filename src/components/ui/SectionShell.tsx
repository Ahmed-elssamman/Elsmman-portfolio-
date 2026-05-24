"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { easing } from "@/lib/easing";
import { cn } from "@/lib/cn";

interface SectionShellProps {
  id: string;
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  tone?: "accent" | "violet" | "signal";
  children: ReactNode;
}

export function SectionShell({
  id,
  index,
  eyebrow,
  title,
  description,
  className,
  tone = "accent",
  children,
}: SectionShellProps) {
  const toneColor = {
    accent: "text-accent",
    violet: "text-violet",
    signal: "text-signal",
  }[tone];

  return (
    <section
      id={id}
      className={cn(
        "relative w-full py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-12 overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 grid-overlay opacity-[0.25] pointer-events-none" />

      <div className="relative mx-auto max-w-[1280px]">
        <SectionHeader
          index={index}
          eyebrow={eyebrow}
          title={title}
          description={description}
          toneColor={toneColor}
        />
        <div className="mt-10 sm:mt-14 md:mt-20">{children}</div>
      </div>
    </section>
  );
}

function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  toneColor,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  toneColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: easing.enter }}
      className="grid md:grid-cols-12 gap-6 md:gap-8"
    >
      <div className="md:col-span-3">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim">
          <span className={toneColor}>{index}</span>
          <span className="h-px w-8 bg-edge-strong" />
          <span>{eyebrow}</span>
        </div>
      </div>
      <div className="md:col-span-9">
        <h2 className="font-display font-semibold text-[clamp(1.8rem,4.6vw,3.4rem)] leading-[1.05] tracking-tighter text-balance">
          {title}
        </h2>
        {description && (
          <p className="mt-4 sm:mt-5 max-w-2xl text-ink-mute text-sm sm:text-base md:text-lg leading-relaxed text-balance">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
