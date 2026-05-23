"use client";

import { useRef } from "react";
import { Float, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Floating holographic data panels orbiting the central core.
 * Each panel uses drei <Html> projected into 3D space so the content stays
 * crisp at any zoom and benefits from text rendering.
 */
const panels = [
  {
    id: "system",
    pos: [-2.8, 1.0, -0.4] as [number, number, number],
    rot: [0.05, 0.3, -0.05] as [number, number, number],
    title: "system.realtime",
    rows: [
      ["channels", "3"],
      ["latency", "42ms"],
      ["throughput", "1.2k/s"],
    ],
  },
  {
    id: "build",
    pos: [2.7, 0.8, -0.2] as [number, number, number],
    rot: [0.03, -0.32, 0.04] as [number, number, number],
    title: "nx.workspace",
    rows: [
      ["apps", "4"],
      ["libs", "32"],
      ["graph", "ok"],
    ],
  },
  {
    id: "perf",
    pos: [-2.3, -0.9, 0.3] as [number, number, number],
    rot: [-0.1, 0.28, 0.02] as [number, number, number],
    title: "perf.budget",
    rows: [
      ["frame", "<16ms"],
      ["lcp", "1.1s"],
      ["cls", "0.01"],
    ],
  },
  {
    id: "deploy",
    pos: [2.2, -0.95, 0.2] as [number, number, number],
    rot: [-0.08, -0.28, -0.02] as [number, number, number],
    title: "deploy.edge",
    rows: [
      ["regions", "12"],
      ["ssr", "on"],
      ["isr", "active"],
    ],
  },
];

export function HoloPanels() {
  return (
    <>
      {panels.map((p) => (
        <Float
          key={p.id}
          speed={1.1}
          rotationIntensity={0.1}
          floatIntensity={0.7}
        >
          <Panel data={p} />
        </Float>
      ))}
    </>
  );
}

function Panel({ data }: { data: (typeof panels)[number] }) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    // Gentle independent yaw.
    ref.current.rotation.y = data.rot[1] + Math.sin(t * 0.4) * 0.04;
  });

  return (
    <group ref={ref} position={data.pos} rotation={data.rot}>
      <Html
        center
        distanceFactor={4.2}
        transform
        zIndexRange={[10, 0]}
        style={{ pointerEvents: "none" }}
      >
        <PanelBody data={data} />
      </Html>
    </group>
  );
}

function PanelBody({ data }: { data: (typeof panels)[number] }) {
  return (
    <div
      style={{
        width: 220,
        background:
          "linear-gradient(180deg, rgba(14,17,24,0.78), rgba(10,12,18,0.55))",
        border: "1px solid rgba(122,182,255,0.25)",
        boxShadow:
          "0 0 0 1px rgba(122,182,255,0.05) inset, 0 0 40px rgba(122,182,255,0.08)",
        backdropFilter: "blur(6px)",
        padding: "10px 12px",
        fontFamily: "var(--font-mono)",
        color: "#E6E8EE",
        userSelect: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 9,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "#9FD0FF",
          opacity: 0.85,
        }}
      >
        <span>{data.title}</span>
        <span style={{ color: "#5EE7C3" }}>●</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 11, lineHeight: 1.7 }}>
        {data.rows.map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "#8A92A6",
            }}
          >
            <span>{k}</span>
            <span style={{ color: "#E6E8EE" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
