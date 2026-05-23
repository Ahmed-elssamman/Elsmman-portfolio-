"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(
          j?.error === "invalid_password"
            ? "Incorrect password."
            : "Login failed. Try again."
        );
        setStatus("error");
        return;
      }
      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim mb-2">
          ▸ Password
        </div>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full bg-bg-elev/60 border border-edge focus:border-accent/60 px-3 py-2.5 text-ink placeholder:text-ink-dim font-mono text-sm outline-none transition"
          placeholder="••••••••"
        />
      </label>
      {error && (
        <div className="text-xs text-signal-warm font-mono">{error}</div>
      )}
      <button
        type="submit"
        disabled={status === "sending" || !password}
        className="w-full inline-flex items-center justify-center gap-2 border border-accent/40 bg-accent/5 px-4 py-2.5 text-sm tracking-wide text-ink hover:bg-accent/10 transition disabled:opacity-60"
      >
        {status === "sending" ? "Verifying…" : "Unlock"}
        <span className="text-accent">→</span>
      </button>
    </form>
  );
}
