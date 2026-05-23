"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";
import type { Nav as NavLinks } from "@/lib/data-schemas";

export function Nav({ links }: { links: NavLinks }) {
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 120], [0, 0.85]);
  const borderOpacity = useTransform(scrollY, [0, 120], [0, 1]);
  const bgColor = useTransform(bgOpacity, (o) => `rgba(5,6,10,${o})`);

  const [activeId, setActiveId] = useState<string>(links[0]?.id ?? "hero");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.5, 1] }
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [links]);

  // Close mobile menu when user navigates.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, [open]);

  return (
    <>
      {/* Top nav */}
      <motion.header
        className="fixed top-0 inset-x-0 z-50"
        style={{ backgroundColor: bgColor }}
      >
        <motion.div
          className="absolute inset-x-0 bottom-0 h-px bg-edge"
          style={{ opacity: borderOpacity }}
        />
        <div className="mx-auto max-w-[1240px] flex items-center justify-between px-4 sm:px-6 md:px-12 h-16">
          <a
            href="#hero"
            className="font-mono text-[11px] uppercase tracking-[0.32em] text-ink"
          >
            <span className="text-accent">◇</span> AE.Systems
          </a>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                className={cn(
                  "relative px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] transition",
                  activeId === l.id ? "text-ink" : "text-ink-dim hover:text-ink"
                )}
              >
                {l.label}
                {activeId === l.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-px bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 border border-accent/40 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:bg-accent/10 transition"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
              Contact
            </a>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center h-9 w-9 border border-edge-strong text-ink"
              aria-label="Toggle navigation"
              aria-expanded={open}
            >
              <span className="sr-only">Menu</span>
              <div className="flex flex-col gap-1">
                <span className="block h-px w-4 bg-ink" />
                <span className="block h-px w-4 bg-ink" />
                <span className="block h-px w-4 bg-ink" />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="lg:hidden border-t border-edge bg-bg/95 backdrop-blur">
            <nav className="px-4 sm:px-6 py-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {links.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "py-2 font-mono text-[12px] uppercase tracking-[0.2em] transition",
                    activeId === l.id ? "text-ink" : "text-ink-dim hover:text-ink"
                  )}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </motion.header>

      {/* Side rail (large screens only): section indicator */}
      <aside className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
        {links.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className="group relative flex items-center gap-3"
            aria-label={l.label}
          >
            <span
              className={cn(
                "block h-px transition-all",
                activeId === l.id
                  ? "w-8 bg-accent"
                  : "w-4 bg-edge-strong group-hover:bg-ink-dim"
              )}
            />
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.32em] transition",
                activeId === l.id
                  ? "text-ink opacity-100"
                  : "text-ink-dim opacity-0 group-hover:opacity-100"
              )}
            >
              {l.label}
            </span>
          </a>
        ))}
      </aside>
    </>
  );
}
