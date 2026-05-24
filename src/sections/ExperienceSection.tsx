"use client";

import { motion } from "framer-motion";
import { SectionShell } from "@/components/ui/SectionShell";
import { easing } from "@/lib/easing";
import type { Experience, ExperienceItem } from "@/lib/data-schemas";

export function ExperienceSection({ data }: { data: Experience }) {
  return (
    <SectionShell
      id="experience"
      index="02"
      eyebrow="Experience"
      tone="violet"
      title={
        <>
          Where the <span className="gradient-text">systems thinking</span> has shipped.
        </>
      }
      description="Roles across enterprise frontend, ERP engineering, and frontend mentoring — ordered most recent first."
    >
      <ol className="relative space-y-5 md:space-y-7">
        <div className="hidden md:block absolute left-[6rem] top-0 bottom-0 w-px bg-gradient-to-b from-violet/30 via-accent/20 to-transparent" />
        {data.map((role, i) => (
          <RoleCard key={role.id} role={role} i={i} />
        ))}
      </ol>
    </SectionShell>
  );
}

function RoleCard({ role, i }: { role: ExperienceItem; i: number }) {
  const current = role.end.toLowerCase() === "present";
  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: easing.enter, delay: i * 0.05 }}
      className="relative glass-panel hairline rounded-sm p-5 md:p-6 hover:border-violet/30 transition-colors"
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
        <div className="md:w-52 md:shrink-0 space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim flex items-center gap-2">
            <span className="text-violet">▸ {String(i + 1).padStart(2, "0")}</span>
            {current && (
              <span className="flex items-center gap-1.5 text-signal">
                <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
                current
              </span>
            )}
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute">
            {role.start} — {role.end}
          </div>
          <div className="font-mono text-[11px] text-ink-dim">
            {[role.type, role.location].filter(Boolean).join(" · ")}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-display text-lg sm:text-xl md:text-2xl tracking-tight text-ink">
              {role.role}
            </h3>
            <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.2em] text-violet">
              @ {role.company}
            </span>
          </div>
          {role.summary && (
            <p className="mt-2 text-ink-mute text-sm md:text-base leading-relaxed text-balance">
              {role.summary}
            </p>
          )}

          {role.bullets.length > 0 && (
            <ul className="mt-4 space-y-2">
              {role.bullets.map((b, bi) => (
                <li
                  key={bi}
                  className="flex items-start gap-3 text-sm text-ink-mute leading-relaxed"
                >
                  <span className="text-accent mt-1 shrink-0">›</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {role.stack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {role.stack.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[10px] uppercase tracking-wider text-ink-mute border border-edge hover:border-accent/40 hover:text-ink px-2 py-0.5 transition-colors"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.li>
  );
}
