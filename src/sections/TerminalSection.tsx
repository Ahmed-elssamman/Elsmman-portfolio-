"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SectionShell } from "@/components/ui/SectionShell";
import type { TerminalSession } from "@/lib/data-schemas";

type Step =
  | { kind: "prompt"; text: string }
  | { kind: "output"; text: string };

function buildScript(session: TerminalSession): Step[] {
  const steps: Step[] = [];
  for (const l of session.lines) {
    steps.push({ kind: "prompt", text: l.cmd });
    steps.push({ kind: "output", text: l.out });
  }
  return steps;
}

export function TerminalSection({ data }: { data: TerminalSession }) {
  return (
    <SectionShell
      id="terminal"
      index="07"
      eyebrow="Console"
      title="Direct line to the engineer."
      description="A live snapshot of role, specialization, and current focus — straight from the shell."
    >
      <Terminal session={data} />
    </SectionShell>
  );
}

function Terminal({ session }: { session: TerminalSession }) {
  const script = useRef<Step[] | null>(null);
  if (script.current === null) script.current = buildScript(session);

  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  const [stepIndex, setStepIndex] = useState(0);
  const [typed, setTyped] = useState<string>("");

  useEffect(() => {
    const s = script.current!;
    if (!inView) return;
    if (stepIndex >= s.length) return;

    const step = s[stepIndex];
    const isPrompt = step.kind === "prompt";
    const charDelay = isPrompt ? 35 : 6;
    let i = 0;
    setTyped("");

    const id = window.setInterval(() => {
      i++;
      setTyped(step.text.slice(0, i));
      if (i >= step.text.length) {
        window.clearInterval(id);
        window.setTimeout(
          () => setStepIndex((s2) => s2 + 1),
          isPrompt ? 250 : 350
        );
      }
    }, charDelay);

    return () => window.clearInterval(id);
  }, [stepIndex, inView]);

  const s = script.current!;
  const rendered: Step[] = [];
  for (let i = 0; i < stepIndex; i++) rendered.push(s[i]);
  const current = stepIndex < s.length ? s[stepIndex] : null;

  return (
    <div
      ref={containerRef}
      className="glass-panel hairline rounded-sm overflow-hidden"
    >
      <div className="flex items-center gap-3 px-5 py-2.5 border-b border-edge bg-bg-elev/40">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-edge-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-edge-strong" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/60" />
        </div>
        <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim truncate">
          {session.prompt}:{session.cwd} — zsh
        </div>
        <div className="ml-auto font-mono text-[10px] uppercase tracking-[0.32em] text-signal shrink-0">
          ● live
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 font-mono text-[12px] sm:text-[13px] leading-relaxed min-h-[300px] sm:min-h-[360px] overflow-x-auto">
        {rendered.map((step, i) =>
          step.kind === "prompt" ? (
            <Prompt key={i} text={step.text} prompt={session.prompt} />
          ) : (
            <Output key={i} text={step.text} />
          )
        )}
        {current &&
          (current.kind === "prompt" ? (
            <Prompt text={typed} caret prompt={session.prompt} />
          ) : (
            <Output text={typed} caret />
          ))}
        {!current && (
          <div className="text-ink-mute flex items-center gap-2">
            <span className="text-accent">{session.prompt} ›</span>
            <motion.span
              className="inline-block h-[1em] w-[0.5em] bg-accent"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, times: [0, 0.5, 1] }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Prompt({
  text,
  caret = false,
  prompt,
}: {
  text: string;
  caret?: boolean;
  prompt: string;
}) {
  return (
    <div className="text-ink break-words">
      <span className="text-accent">{prompt}</span>
      <span className="text-ink-dim"> › </span>
      <span>{text}</span>
      {caret && <Caret />}
    </div>
  );
}

function Output({ text, caret = false }: { text: string; caret?: boolean }) {
  return (
    <div className="text-ink-mute whitespace-pre-wrap pl-4 border-l border-edge-strong/40 ml-1.5 mb-3 break-words">
      {text}
      {caret && <Caret />}
    </div>
  );
}

function Caret() {
  return (
    <motion.span
      className="inline-block ml-0.5 h-[1em] w-[0.5em] align-text-bottom bg-accent"
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 1] }}
    />
  );
}
