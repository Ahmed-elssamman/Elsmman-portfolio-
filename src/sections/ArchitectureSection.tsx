"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { SectionShell } from "@/components/ui/SectionShell";
import { easing } from "@/lib/easing";
import type { Architecture } from "@/lib/data-schemas";

const COL_W = 220;
const ROW_H = 130;
const PAD = 40;

function nodeCenter(col: number, row: number) {
  return {
    x: PAD + col * COL_W + COL_W / 2,
    y: PAD + row * ROW_H + ROW_H / 2,
  };
}

export function ArchitectureSection({ data }: { data: Architecture }) {
  const gradId = useId();

  const maxCol = Math.max(0, ...data.nodes.map((n) => n.col));
  const maxRow = Math.max(0, ...data.nodes.map((n) => n.row));
  const W = (maxCol + 1) * COL_W + PAD * 2;
  const H = (maxRow + 1) * ROW_H + PAD * 2;

  return (
    <SectionShell
      id="architecture"
      index="04"
      eyebrow="Architecture"
      tone="accent"
      title={
        <>
          The <span className="gradient-text">system</span> underneath the surface.
        </>
      }
      description="A reference architecture I bring to enterprise frontends — modular, observable, tuned for realtime data flow."
    >
      <div className="relative glass-panel hairline rounded-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-edge font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim">
          <span className="text-accent">▶ system.topology</span>
          <span className="flex items-center gap-2 text-signal">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
            realtime
          </span>
        </div>

        <div className="relative overflow-x-auto">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="block w-full min-w-[760px]"
            style={{ height: H }}
            role="img"
            aria-label="System architecture diagram"
          >
            <defs>
              <linearGradient id={`${gradId}-flow`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7AB6FF" stopOpacity="0" />
                <stop offset="50%" stopColor="#A9D1FF" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#5EE7C3" stopOpacity="0" />
              </linearGradient>
              <radialGradient id={`${gradId}-node`}>
                <stop offset="0%" stopColor="#7AB6FF" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#7AB6FF" stopOpacity="0" />
              </radialGradient>
            </defs>

            {data.flows.map((f, i) => {
              const a = data.nodes.find((n) => n.id === f.from);
              const b = data.nodes.find((n) => n.id === f.to);
              if (!a || !b) return null;
              const A = nodeCenter(a.col, a.row);
              const B = nodeCenter(b.col, b.row);
              return (
                <g key={`${f.from}-${f.to}-${i}`}>
                  <line
                    x1={A.x}
                    y1={A.y}
                    x2={B.x}
                    y2={B.y}
                    stroke="rgba(122,182,255,0.25)"
                    strokeWidth={1}
                  />
                  <motion.circle
                    r={3}
                    fill="#A9D1FF"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    animate={{ cx: [A.x, B.x], cy: [A.y, B.y] }}
                    transition={{
                      duration: 2.4,
                      delay: i * 0.2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{ filter: "drop-shadow(0 0 6px #A9D1FF)" }}
                  />
                </g>
              );
            })}

            {data.nodes.map((n, i) => {
              const c = nodeCenter(n.col, n.row);
              return (
                <motion.g
                  key={n.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.06,
                    ease: easing.enter,
                  }}
                >
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={64}
                    fill={`url(#${gradId}-node)`}
                  />
                  <rect
                    x={c.x - 84}
                    y={c.y - 30}
                    width={168}
                    height={60}
                    fill="rgba(14,17,24,0.92)"
                    stroke="rgba(122,182,255,0.4)"
                    strokeWidth={1}
                  />
                  <text
                    x={c.x}
                    y={c.y - 6}
                    textAnchor="middle"
                    fill="#ECEEF5"
                    fontSize="13"
                    fontFamily="var(--font-sans)"
                    fontWeight={500}
                  >
                    {n.label}
                  </text>
                  <text
                    x={c.x}
                    y={c.y + 14}
                    textAnchor="middle"
                    fill="#9098AE"
                    fontSize="10"
                    fontFamily="var(--font-mono)"
                    letterSpacing="1"
                  >
                    {n.sub}
                  </text>
                </motion.g>
              );
            })}
          </svg>
        </div>

        <div className="px-4 sm:px-5 py-3 border-t border-edge flex flex-wrap items-center gap-3 sm:gap-6 font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-ink-dim">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            data-flow
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            realtime
          </span>
          <span className="sm:ml-auto text-ink-mute">
            Frontend → Domain → API / Stream → Persistence
          </span>
        </div>
      </div>
    </SectionShell>
  );
}
