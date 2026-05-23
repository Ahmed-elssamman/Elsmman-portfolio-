"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { SectionShell } from "@/components/ui/SectionShell";
import { easing } from "@/lib/easing";
import type { Profile } from "@/lib/data-schemas";

type Status = "idle" | "sending" | "sent";

export function ContactSection({ profile }: { profile: Profile }) {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    // Open the user's mail client with a pre-filled message — works without a backend.
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`);
    const body = encodeURIComponent(
      `From: ${form.name} <${form.email}>\n\n${form.message}`
    );
    window.setTimeout(() => {
      window.location.href = `mailto:${profile.links.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
    }, 600);
  }

  const channels: { label: string; value: string; href: string }[] = [
    {
      label: "Email",
      value: profile.links.email,
      href: `mailto:${profile.links.email}`,
    },
  ];
  if (profile.links.phone) {
    channels.push({
      label: "Phone",
      value: profile.links.phone,
      href: `tel:${profile.links.phone.replace(/\s+/g, "")}`,
    });
  }
  if (profile.links.github) {
    channels.push({
      label: "GitHub",
      value: profile.links.github.replace(/^https?:\/\//, ""),
      href: profile.links.github,
    });
  }
  if (profile.links.linkedin) {
    channels.push({
      label: "LinkedIn",
      value: profile.links.linkedin.replace(/^https?:\/\//, ""),
      href: profile.links.linkedin,
    });
  }
  if (profile.links.resume) {
    channels.push({
      label: "Résumé",
      value: profile.links.resume.split("/").pop() || "resume.pdf",
      href: profile.links.resume,
    });
  }

  return (
    <SectionShell
      id="contact"
      index="08"
      eyebrow="Contact"
      title="Open a channel."
      description="Use the console below to start a conversation, or take a direct line through any of the channels."
    >
      <div className="grid md:grid-cols-12 gap-6 md:gap-8">
        <div className="md:col-span-7">
          <div className="glass-panel hairline rounded-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-edge font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim">
              <span className="text-accent">▶ comms.console</span>
              <span className="flex items-center gap-2 text-signal">
                <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
                channel open
              </span>
            </div>

            <form onSubmit={onSubmit} className="p-5 md:p-6 space-y-5">
              <ConsoleField
                label="Identifier"
                placeholder="your name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                required
              />
              <ConsoleField
                label="Return path"
                placeholder="you@domain.com"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                type="email"
                required
              />
              <ConsoleField
                label="Transmission"
                placeholder="What are you building?"
                value={form.message}
                onChange={(v) => setForm({ ...form, message: v })}
                multiline
                required
              />

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-dim">
                  opens mail client · no tracking
                </div>
                <button
                  type="submit"
                  disabled={status !== "idle"}
                  className="group inline-flex items-center gap-2 border border-accent/40 bg-accent/5 px-5 py-2.5 text-sm tracking-wide text-ink hover:bg-accent/10 transition disabled:opacity-60"
                >
                  <span>
                    {status === "idle" && "Transmit"}
                    {status === "sending" && "Transmitting…"}
                    {status === "sent" && "Sent"}
                  </span>
                  <span className="text-accent transition group-hover:translate-x-0.5">
                    {status === "sent" ? "✓" : "→"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="md:col-span-5 space-y-4">
          {channels.map((c) => (
            <ChannelCard key={c.label} {...c} />
          ))}
        </div>
      </div>

      <Footer name={profile.name} role={profile.role} />
    </SectionShell>
  );
}

function ConsoleField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  multiline = false,
  required = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim mb-2">
        ▸ {label}
      </div>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          required={required}
          className="w-full bg-bg-elev/60 border border-edge focus:border-accent/60 px-3 py-2.5 text-ink placeholder:text-ink-dim font-mono text-sm outline-none transition resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="w-full bg-bg-elev/60 border border-edge focus:border-accent/60 px-3 py-2.5 text-ink placeholder:text-ink-dim font-mono text-sm outline-none transition"
        />
      )}
    </label>
  );
}

function ChannelCard({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href: string;
}) {
  return (
    <motion.a
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: easing.enter }}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="group block glass-panel hairline rounded-sm p-5 transition border border-edge hover:border-accent/40"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim">
            {label}
          </div>
          <div className="mt-1.5 font-display text-base md:text-lg tracking-tight text-ink truncate">
            {value}
          </div>
        </div>
        <span className="text-accent text-lg transition group-hover:translate-x-0.5 shrink-0">
          ↗
        </span>
      </div>
    </motion.a>
  );
}

function Footer({ name, role }: { name: string; role: string }) {
  return (
    <div className="mt-16 md:mt-20 pt-8 border-t border-edge flex flex-col md:flex-row items-start md:items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim">
      <span>© 2026 {name} · {role}</span>
      <span>Built with Next.js · R3F · Framer · Lenis</span>
    </div>
  );
}
