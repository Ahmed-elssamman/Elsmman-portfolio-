"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionShell } from "@/components/ui/SectionShell";
import { easing } from "@/lib/easing";
import { cn } from "@/lib/cn";
import type { Projects, Project } from "@/lib/data-schemas";

export function ProjectsSection({ data }: { data: Projects }) {
  const [activeId, setActiveId] = useState<string>(data[0]?.id ?? "");
  const active = data.find((p) => p.id === activeId) ?? data[0];

  if (!active) {
    return (
      <SectionShell
        id="projects"
        index="03"
        eyebrow="Project Universe"
        title="Projects coming soon."
      >
        <div className="text-ink-mute">No projects yet.</div>
      </SectionShell>
    );
  }

  return (
    <SectionShell
      id="projects"
      index="03"
      eyebrow="Project Universe"
      tone="signal"
      title={
        <>
          Each project is a <span className="gradient-text">system.</span>{" "}
          Open one to see its architecture.
        </>
      }
      description="Selected work across enterprise LMS platforms, driver SaaS analytics, full-stack commerce, and storefronts."
    >
      <div className="grid lg:grid-cols-12 gap-5 lg:gap-10">
        <div className="lg:col-span-5 space-y-4">
          {data.map((p) => (
            <CapsuleCard
              key={p.id}
              project={p}
              active={p.id === activeId}
              onSelect={() => setActiveId(p.id)}
            />
          ))}
        </div>

        <div className="lg:col-span-7">
          <ProjectConsole project={active} />
        </div>
      </div>
    </SectionShell>
  );
}

function CapsuleCard({
  project,
  active,
  onSelect,
}: {
  project: Project;
  active: boolean;
  onSelect: () => void;
}) {
  const hue = project.capsuleHue;
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: easing.enter }}
      className={cn(
        "group relative w-full text-left glass-panel hairline rounded-sm p-4 sm:p-5 transition-all overflow-hidden",
        "border-edge hover:border-accent/40",
        active && "border-accent/60"
      )}
      style={
        active
          ? {
              boxShadow: `0 0 0 1px hsla(${hue}, 70%, 65%, 0.3), 0 24px 70px -22px hsla(${hue}, 80%, 50%, 0.25)`,
            }
          : undefined
      }
    >
      <div
        className="absolute left-0 top-0 h-full w-px transition"
        style={{
          background: `linear-gradient(to bottom, transparent, hsla(${hue}, 80%, 65%, ${
            active ? 0.9 : 0.3
          }), transparent)`,
        }}
      />
      {active && (
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 70% at 0% 50%, hsla(${hue}, 90%, 60%, 0.18), transparent 60%)`,
          }}
        />
      )}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim">
            {project.index} · {project.category}
          </div>
          <div className="mt-2 font-display text-base sm:text-lg md:text-xl tracking-tight text-ink">
            {project.name}
          </div>
          <div className="mt-1.5 text-ink-mute text-xs sm:text-sm leading-relaxed">
            {project.summary}
          </div>
        </div>
        <div
          className="h-9 w-9 sm:h-10 sm:w-10 shrink-0 rounded-full border flex items-center justify-center"
          style={{
            borderColor: `hsla(${hue}, 70%, 65%, 0.5)`,
            background: `radial-gradient(circle at center, hsla(${hue}, 80%, 60%, 0.18), transparent 70%)`,
          }}
        >
          <span className="text-base" style={{ color: `hsl(${hue}, 80%, 75%)` }}>
            ◇
          </span>
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap gap-1.5">
        {project.stack.slice(0, 5).map((s) => (
          <span
            key={s}
            className="font-mono text-[10px] uppercase tracking-wider text-ink-mute border border-edge px-2 py-0.5"
          >
            {s}
          </span>
        ))}
      </div>
    </motion.button>
  );
}

function ProjectConsole({ project }: { project: Project }) {
  return (
    <div className="lg:sticky lg:top-24 glass-panel hairline rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-edge font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim">
        <span className="text-accent">▶ {project.index}.system</span>
        <span className="truncate ml-3">{project.name}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: easing.enter }}
          className="p-5 md:p-6"
        >
          {project.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {project.metrics.slice(0, 3).map((m) => (
                <div
                  key={m.label}
                  className="border-l-2 pl-3"
                  style={{
                    borderColor: `hsla(${project.capsuleHue}, 70%, 65%, 0.6)`,
                  }}
                >
                  <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-ink-dim">
                    {m.label}
                  </div>
                  <div className="mt-1 font-display text-lg sm:text-xl md:text-2xl tracking-tight text-ink">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mt-6 text-ink-mute text-sm sm:text-base leading-relaxed text-balance">
            {project.description}
          </p>

          {project.architecture.length > 0 && (
            <div className="mt-7">
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim mb-3">
                System nodes
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {project.architecture.map((node, i) => (
                  <div key={node + i} className="flex items-center gap-2">
                    <div
                      className="px-2.5 py-1 border text-[11px] font-mono"
                      style={{
                        borderColor: `hsla(${project.capsuleHue}, 70%, 65%, 0.4)`,
                        background: `hsla(${project.capsuleHue}, 80%, 60%, 0.06)`,
                        color: "#E6E8EE",
                      }}
                    >
                      {node}
                    </div>
                    {i < project.architecture.length - 1 && (
                      <span
                        className="text-xs"
                        style={{
                          color: `hsla(${project.capsuleHue}, 70%, 65%, 0.7)`,
                        }}
                      >
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.highlights.length > 0 && (
            <div className="mt-7">
              <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim mb-3">
                Engineering highlights
              </div>
              <ul className="space-y-2">
                {project.highlights.map((h, hi) => (
                  <li
                    key={hi}
                    className="flex items-start gap-3 text-sm text-ink-mute leading-relaxed"
                  >
                    <span className="text-signal mt-1">›</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-accent/40 bg-accent/5 hover:bg-accent/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition"
                >
                  {l.label}
                  <span className="text-accent">↗</span>
                </a>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
