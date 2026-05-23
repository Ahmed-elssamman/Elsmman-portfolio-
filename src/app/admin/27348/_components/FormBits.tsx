"use client";

import { ReactNode, useState } from "react";

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="glass-panel hairline rounded-sm p-5 md:p-6">
      <div className="mb-5">
        <h2 className="font-display text-lg md:text-xl tracking-tight text-ink">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-ink-mute">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim mb-1.5">
        {label}
      </div>
      {children}
      {hint && (
        <div className="mt-1 font-mono text-[10px] text-ink-dim">{hint}</div>
      )}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-bg-elev/60 border border-edge focus:border-accent/60 px-3 py-2 text-ink placeholder:text-ink-dim font-mono text-sm outline-none transition"
    />
  );
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : 0}
      min={min}
      max={max}
      step={step}
      onChange={(e) => {
        const n = e.target.value === "" ? 0 : Number(e.target.value);
        onChange(Number.isFinite(n) ? n : 0);
      }}
      className="w-full bg-bg-elev/60 border border-edge focus:border-accent/60 px-3 py-2 text-ink font-mono text-sm outline-none transition"
    />
  );
}

export function TextArea({
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-bg-elev/60 border border-edge focus:border-accent/60 px-3 py-2 text-ink placeholder:text-ink-dim font-mono text-sm outline-none transition resize-y"
    />
  );
}

export function StringList({
  value,
  onChange,
  placeholder = "Add item",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  function add() {
    const v = draft.trim();
    if (!v) return;
    onChange([...value, v]);
    setDraft("");
  }
  return (
    <div className="space-y-2">
      {value.map((s, i) => (
        <div key={i} className="flex items-start gap-2">
          <TextArea
            value={s}
            onChange={(v) => {
              const next = [...value];
              next[i] = v;
              onChange(next);
            }}
            rows={2}
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="shrink-0 mt-0.5 border border-edge px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim hover:text-signal-warm hover:border-signal-warm/60 transition"
          >
            Remove
          </button>
        </div>
      ))}
      <div className="flex items-start gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder={placeholder}
          className="w-full bg-bg-elev/60 border border-edge focus:border-accent/60 px-3 py-2 text-ink placeholder:text-ink-dim font-mono text-sm outline-none transition"
        />
        <button
          type="button"
          onClick={add}
          className="shrink-0 border border-accent/40 bg-accent/5 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink hover:bg-accent/10 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function SaveBar({
  status,
  error,
  onSave,
  dirty,
}: {
  status: SaveStatus;
  error?: string | null;
  onSave: () => void;
  dirty: boolean;
}) {
  return (
    <div className="sticky bottom-0 mt-6 -mx-5 md:-mx-6 px-5 md:px-6 py-3 bg-bg/95 backdrop-blur border-t border-edge flex flex-wrap items-center gap-3 justify-between">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-dim">
        {status === "saving" && "Saving…"}
        {status === "saved" && (
          <span className="text-signal">● Saved</span>
        )}
        {status === "error" && (
          <span className="text-signal-warm">● {error || "Error"}</span>
        )}
        {status === "idle" && (dirty ? "Unsaved changes" : "Up to date")}
      </div>
      <button
        type="button"
        onClick={onSave}
        disabled={status === "saving" || !dirty}
        className="inline-flex items-center gap-2 border border-accent/40 bg-accent/5 px-4 py-2 text-sm tracking-wide text-ink hover:bg-accent/10 transition disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : "Save changes"}
        <span className="text-accent">→</span>
      </button>
    </div>
  );
}

export function ListCard({
  title,
  onRemove,
  onMoveUp,
  onMoveDown,
  children,
}: {
  title: string;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border border-edge rounded-sm p-4 bg-bg-elev/40">
      <div className="flex items-center justify-between mb-3">
        <div className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink">
          {title}
        </div>
        <div className="flex items-center gap-2">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              className="font-mono text-[10px] text-ink-dim hover:text-ink px-2 py-1 border border-transparent hover:border-edge"
              title="Move up"
            >
              ↑
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              className="font-mono text-[10px] text-ink-dim hover:text-ink px-2 py-1 border border-transparent hover:border-edge"
              title="Move down"
            >
              ↓
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="border border-edge px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim hover:text-signal-warm hover:border-signal-warm/60 transition"
          >
            Remove
          </button>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function AddButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border border-dashed border-edge-strong hover:border-accent/60 text-ink-dim hover:text-ink font-mono text-[11px] uppercase tracking-[0.24em] py-3 transition"
    >
      + {label}
    </button>
  );
}

export function moveItem<T>(arr: T[], i: number, delta: number): T[] {
  const j = i + delta;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(i, 1);
  next.splice(j, 0, item);
  return next;
}

export async function saveResource<T>(
  resource: string,
  value: T
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/admin/${resource}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(value),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      return { ok: false, error: j?.error || `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
