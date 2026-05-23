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
  children: ReactNode;
}

export function SectionShell({
  id,
  index,
  eyebrow,
  title,
  description,
  className,
  children,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full py-28 md:py-36 px-6 md:px-12 overflow-hidden",
        className
      )}
    >
      {/* Subtle grid backdrop */}
      <div className="absolute inset-0 grid-overlay opacity-[0.35] pointer-events-none" />

      <div className="relative mx-auto max-w-[1240px]">
        <SectionHeader
          index={index}
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div className="mt-16 md:mt-20">{children}</div>
      </div>
    </section>
  );
}

function SectionHeader({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: easing.enter }}
      className="grid md:grid-cols-12 gap-8"
    >
      <div className="md:col-span-3">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim">
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-edge-strong" />
          <span>{eyebrow}</span>
        </div>
      </div>
      <div className="md:col-span-9">
        <h2 className="font-display text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] tracking-tighter text-balance">
          {title}
        </h2>
        {description && (
          <p className="mt-5 max-w-2xl text-ink-mute text-base md:text-lg leading-relaxed text-balance">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
