"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SectionShell } from "@/components/ui/SectionShell";
import { easing } from "@/lib/easing";
import type { Ecosystem, EcosystemCluster } from "@/lib/data-schemas";

export function EcosystemSection({ data }: { data: Ecosystem }) {
  const [activeId, setActiveId] = useState<string>(data[0]?.id ?? "");
  const active = data.find((c) => c.id === activeId) ?? data[0];

  if (!active) return null;

  return (
    <SectionShell
      id="ecosystem"
      index="05"
      eyebrow="Ecosystem"
      tone="violet"
      title={
        <>
          A <span className="gradient-text">galaxy of tools</span>, not a list of skills.
        </>
      }
      description="The technology surface I work across — clustered by purpose, weighted by depth."
    >
      <div className="grid md:grid-cols-12 gap-5 md:gap-8">
        <div className="md:col-span-4 space-y-3">
          {data.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={
                "group w-full text-left glass-panel hairline rounded-sm p-4 sm:p-5 transition-all border " +
                (c.id === activeId
                  ? "border-accent/50"
                  : "border-edge hover:border-edge-strong")
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: `hsl(${200 + c.hue}, 70%, 65%)`, boxShadow: `0 0 12px hsl(${200 + c.hue}, 80%, 60%)` }}
                />
                <span className="font-display text-base sm:text-lg tracking-tight">
                  {c.name}
                </span>
              </div>
              <p className="mt-2 text-ink-mute text-xs sm:text-sm">{c.summary}</p>
            </button>
          ))}
        </div>

        <div className="md:col-span-8">
          <Galaxy cluster={active} />
        </div>
      </div>
    </SectionShell>
  );
}

function Galaxy({ cluster }: { cluster: EcosystemCluster }) {
  const cx = 50;
  const cy = 50;
  const baseHue = 200 + cluster.hue;
  const nodes = cluster.nodes;

  return (
    <div className="relative glass-panel hairline rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-edge font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim">
        <span className="text-accent">▶ {cluster.id}.cluster</span>
        <span>{nodes.length} nodes</span>
      </div>

      <div className="relative aspect-[16/12] sm:aspect-[16/11] bg-bg-elev/40">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
        >
          {[28, 38, 46].map((r, i) => (
            <ellipse
              key={r}
              cx={cx}
              cy={cy}
              rx={r}
              ry={r * 0.6}
              fill="none"
              stroke={`hsla(${baseHue}, 70%, 65%, ${0.15 - i * 0.03})`}
              strokeWidth={0.15}
            />
          ))}
          <circle
            cx={cx}
            cy={cy}
            r={2.2}
            fill={`hsl(${baseHue}, 80%, 70%)`}
            style={{ filter: `drop-shadow(0 0 6px hsl(${baseHue}, 80%, 60%))` }}
          />
        </svg>

        {nodes.map((n, i) => {
          const angle = (i / Math.max(1, nodes.length)) * Math.PI * 2;
          const radius = 28 + (1 - n.weight) * 18;
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius * 0.6;
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.05,
                ease: easing.enter,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div
                className="relative font-mono text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.18em] px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 border whitespace-nowrap"
                style={{
                  borderColor: `hsla(${baseHue}, 70%, 65%, ${
                    0.4 + n.weight * 0.4
                  })`,
                  background: `hsla(${baseHue}, 60%, 50%, ${
                    0.08 + n.weight * 0.1
                  })`,
                  color: "#ECEEF5",
                  boxShadow: `0 0 ${
                    8 + n.weight * 20
                  }px hsla(${baseHue}, 80%, 60%, ${0.18 + n.weight * 0.2})`,
                }}
              >
                {n.label}
                <span
                  className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full"
                  style={{ background: `hsl(${baseHue}, 80%, 70%)` }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
