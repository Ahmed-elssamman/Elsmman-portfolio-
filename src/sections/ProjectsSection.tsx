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
      title="Each project is a system. Open one to see its architecture."
      description="Selected work across full-stack commerce, storefronts, and search-driven UIs."
    >
      <div className="grid md:grid-cols-12 gap-6 lg:gap-10">
        <div className="md:col-span-5 space-y-4">
          {data.map((p) => (
            <CapsuleCard
              key={p.id}
              project={p}
              active={p.id === activeId}
              onSelect={() => setActiveId(p.id)}
            />
          ))}
        </div>

        <div className="md:col-span-7">
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
      transition={{ duration: 0.7, ease: easing.enter }}
      className={cn(
        "group relative w-full text-left glass-panel hairline rounded-sm p-5 transition",
        "border-edge hover:border-accent/40",
        active && "border-accent/60"
      )}
      style={
        active
          ? {
              boxShadow: `0 0 0 1px hsla(${hue}, 70%, 65%, 0.25), 0 20px 60px -20px hsla(${hue}, 80%, 50%, 0.18)`,
            }
          : undefined
      }
    >
      <div
        className="absolute left-0 top-0 h-full w-px transition"
        style={{
          background: `linear-gradient(to bottom, transparent, hsla(${hue}, 80%, 65%, ${
            active ? 0.8 : 0.25
          }), transparent)`,
        }}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim">
            {project.index} · {project.category}
          </div>
          <div className="mt-2 font-display text-lg md:text-2xl tracking-tight text-ink">
            {project.name}
          </div>
          <div className="mt-1.5 text-ink-mute text-sm leading-relaxed">
            {project.summary}
          </div>
        </div>
        <div
          className="h-10 w-10 shrink-0 rounded-full border flex items-center justify-center"
          style={{
            borderColor: `hsla(${hue}, 70%, 65%, 0.5)`,
            background: `radial-gradient(circle at center, hsla(${hue}, 80%, 60%, 0.15), transparent 70%)`,
          }}
        >
          <span className="text-base" style={{ color: `hsl(${hue}, 80%, 75%)` }}>
            ◇
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
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
    <div className="md:sticky md:top-24 glass-panel hairline rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-edge font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim">
        <span className="text-accent">▶ {project.index}.system</span>
        <span className="truncate ml-3">{project.name}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: easing.enter }}
          className="p-5 md:p-6"
        >
          {project.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {project.metrics.slice(0, 3).map((m) => (
                <div key={m.label}>
                  <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
                    {m.label}
                  </div>
                  <div className="mt-1 font-display text-xl md:text-2xl tracking-tight text-ink">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="mt-6 text-ink-mute leading-relaxed text-balance">
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
                      className="px-2.5 py-1 border text-xs font-mono"
                      style={{
                        borderColor: `hsla(${project.capsuleHue}, 70%, 65%, 0.4)`,
                        background: `hsla(${project.capsuleHue}, 80%, 60%, 0.05)`,
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
                    <span className="text-accent mt-1">›</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
