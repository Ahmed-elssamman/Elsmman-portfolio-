"use client";

import { motion } from "framer-motion";
import { SectionShell } from "@/components/ui/SectionShell";
import { easing } from "@/lib/easing";
import type { Education, Certifications } from "@/lib/data-schemas";

export function EducationSection({
  education,
  certifications,
}: {
  education: Education;
  certifications: Certifications;
}) {
  return (
    <SectionShell
      id="education"
      index="06"
      eyebrow="Education"
      tone="signal"
      title={
        <>
          <span className="gradient-text">Foundations</span> and continued training.
        </>
      }
      description="Formal degree, a focused MEARN Stack Development program at ITI, plus self-driven coursework."
    >
      <div className="grid md:grid-cols-12 gap-5 md:gap-8">
        <div className="md:col-span-7 space-y-4">
          {education.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease: easing.enter, delay: i * 0.05 }}
              className="glass-panel hairline rounded-sm p-5 md:p-6 hover:border-signal/30 transition-colors"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-signal">
                {e.start} — {e.end}
              </div>
              <div className="mt-2 font-display text-base sm:text-lg md:text-xl tracking-tight text-ink">
                {e.degree}
              </div>
              <div className="text-ink-mute text-sm">
                {[e.institution, e.location].filter(Boolean).join(" · ")}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="md:col-span-5">
          <div className="glass-panel hairline rounded-sm p-5 md:p-6 h-full">
            <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-violet">
              Certifications
            </div>
            <ul className="mt-4 space-y-3">
              {certifications.map((c, i) => (
                <motion.li
                  key={c.id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease: easing.enter, delay: i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-violet mt-1 shrink-0">◇</span>
                  <div>
                    <div className="text-ink text-sm md:text-base leading-snug">
                      {c.name}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim mt-0.5">
                      {c.issuer} · {c.year}
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
