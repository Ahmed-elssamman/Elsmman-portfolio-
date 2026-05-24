"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight Canvas2D star field. ~120 particles, ~0.5ms/frame budget.
 * Pauses when the tab is hidden or when prefers-reduced-motion is set.
 */
export function StarField({ density = 90 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Star = { x: number; y: number; r: number; v: number; tw: number; phase: number; hue: number };
    let stars: Star[] = [];

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seed() {
      const count = Math.min(density, Math.floor((width * height) / 18000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.5 + Math.random() * 1.4,
        v: 0.02 + Math.random() * 0.06,
        tw: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.7 ? 210 : Math.random() < 0.5 ? 270 : 160,
      }));
    }

    let last = performance.now();
    function tick(now: number) {
      if (!ctx) return;
      const dt = Math.min(50, now - last);
      last = now;
      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        s.phase += dt * 0.001;
        s.y -= s.v * dt * 0.06;
        if (s.y < -2) {
          s.y = height + 2;
          s.x = Math.random() * width;
        }
        const a = 0.35 + Math.sin(s.phase) * s.tw * 0.4;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${s.hue}, 85%, 75%, ${Math.max(0, a)})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = reduce ? 0 : requestAnimationFrame(tick);
    }

    resize();
    seed();

    if (reduce) {
      // Draw once, no animation loop
      tick(performance.now());
    } else {
      raf = requestAnimationFrame(tick);
    }

    const onResize = () => {
      resize();
      seed();
    };
    window.addEventListener("resize", onResize);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!reduce && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [density]);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
    />
  );
}
