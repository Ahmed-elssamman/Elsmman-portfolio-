"use client";

import { motion } from "framer-motion";
import { SectionShell } from "@/components/ui/SectionShell";
import { easing } from "@/lib/easing";
import type { Profile } from "@/lib/data-schemas";

export function IdentitySection({ profile }: { profile: Profile }) {
  return (
    <SectionShell
      id="identity"
      index="01"
      eyebrow="Identity"
      title={
        <>
          <span className="text-ink/60">From</span> business systems{" "}
          <span className="text-ink/60">to</span> scalable frontend{" "}
          <span className="text-ink/60">engineering.</span>
        </>
      }
      description={profile.shortBio}
    >
      <div className="grid md:grid-cols-12 gap-8 md:gap-10">
        <div className="md:col-span-4">
          <ProfilePanel profile={profile} />
        </div>
        <div className="md:col-span-8 space-y-10 md:space-y-12">
          {profile.identityNarrative.map((n, i) => (
            <NarrativeBlock key={n.heading + i} n={n} i={i} />
          ))}

          {profile.achievements.length > 0 && (
            <AchievementsBlock items={profile.achievements} />
          )}
        </div>
      </div>
    </SectionShell>
  );
}

function ProfilePanel({ profile }: { profile: Profile }) {
  const detailRows: [string, string][] = [
    ["Location", profile.location],
    ["Status", profile.status],
    ["Role", profile.role],
    ["Email", profile.links.email],
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease: easing.enter }}
      className="glass-panel hairline rounded-sm p-6 md:sticky md:top-24"
    >
      <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim">
        Operator
      </div>
      <div className="mt-4 font-display text-2xl tracking-tight">
        {profile.name}
      </div>
      <div className="text-ink-mute text-sm">{profile.role}</div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 font-mono text-[11px]">
        {detailRows.map(([k, v]) => (
          <div key={k} className="flex flex-col min-w-0">
            <span className="text-ink-dim uppercase tracking-[0.24em] text-[9px]">
              {k}
            </span>
            <span className="text-ink mt-0.5 truncate">{v}</span>
          </div>
        ))}
      </div>

      {profile.languages.length > 0 && (
        <div className="mt-6 pt-5 border-t border-edge">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim mb-2">
            Languages
          </div>
          <ul className="space-y-1.5 font-mono text-[11px]">
            {profile.languages.map((l) => (
              <li
                key={l.name}
                className="flex items-baseline justify-between gap-3"
              >
                <span className="text-ink">{l.name}</span>
                <span className="text-ink-dim text-[10px] uppercase tracking-[0.24em]">
                  {l.level}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 pt-5 border-t border-edge font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim flex items-center justify-between">
        <span>signal</span>
        <span className="flex items-center gap-2 text-signal">
          <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
          operational
        </span>
      </div>
    </motion.div>
  );
}

function NarrativeBlock({
  n,
  i,
}: {
  n: { heading: string; body: string };
  i: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: easing.enter, delay: i * 0.08 }}
      className="relative pl-7 sm:pl-8"
    >
      <div className="absolute left-0 top-1 font-mono text-[10px] text-accent">
        ▸ {String(i + 1).padStart(2, "0")}
      </div>
      <h3 className="font-display text-xl md:text-2xl tracking-tight">
        {n.heading}
      </h3>
      <p className="mt-3 text-ink-mute leading-relaxed max-w-2xl text-balance">
        {n.body}
      </p>
    </motion.div>
  );
}

function AchievementsBlock({ items }: { items: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: easing.enter }}
      className="relative pl-7 sm:pl-8"
    >
      <div className="absolute left-0 top-1 font-mono text-[10px] text-accent">
        ◇ KPI
      </div>
      <h3 className="font-display text-xl md:text-2xl tracking-tight">
        Quantified impact
      </h3>
      <ul className="mt-3 space-y-2 max-w-2xl">
        {items.map((a, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-ink-mute leading-relaxed"
          >
            <span className="text-signal mt-1 shrink-0">›</span>
            <span>{a}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
