"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteData } from "@/lib/data-schemas";
import { ProfileTab } from "./tabs/ProfileTab";
import { ExperienceTab } from "./tabs/ExperienceTab";
import { ProjectsTab } from "./tabs/ProjectsTab";
import { EcosystemTab } from "./tabs/EcosystemTab";
import { EducationTab } from "./tabs/EducationTab";
import { CertificationsTab } from "./tabs/CertificationsTab";
import { ArchitectureTab } from "./tabs/ArchitectureTab";
import { TerminalTab } from "./tabs/TerminalTab";
import { NavTab } from "./tabs/NavTab";
import { cn } from "@/lib/cn";

type TabId =
  | "profile"
  | "experience"
  | "projects"
  | "ecosystem"
  | "education"
  | "certifications"
  | "architecture"
  | "terminal"
  | "nav";

const TABS: { id: TabId; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "ecosystem", label: "Skills / Ecosystem" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "architecture", label: "Architecture" },
  { id: "terminal", label: "Terminal" },
  { id: "nav", label: "Navigation" },
];

export function AdminShell({ initialData }: { initialData: SiteData }) {
  const router = useRouter();
  const [active, setActive] = useState<TabId>("profile");
  const [data, setData] = useState<SiteData>(initialData);
  const [loggingOut, setLoggingOut] = useState(false);

  function update<K extends keyof SiteData>(key: K, value: SiteData[K]) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function logout() {
    if (loggingOut) return;
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/27348/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-ink-dim">
            ◇ Admin Console
          </div>
          <h1 className="mt-1 font-display text-2xl md:text-3xl tracking-tight text-ink">
            Portfolio editor
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-edge-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute hover:text-ink hover:border-ink-mute transition"
          >
            View site ↗
          </a>
          <button
            onClick={logout}
            disabled={loggingOut}
            className="inline-flex items-center gap-2 border border-edge-strong px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-mute hover:text-ink hover:border-ink-mute transition disabled:opacity-50"
          >
            {loggingOut ? "Logging out…" : "Logout"}
          </button>
        </div>
      </header>

      {/* Layout */}
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <nav className="glass-panel hairline rounded-sm p-2 self-start lg:sticky lg:top-6 max-h-[calc(100vh-3rem)] overflow-auto">
          <ul className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {TABS.map((t) => (
              <li key={t.id} className="shrink-0 lg:shrink">
                <button
                  onClick={() => setActive(t.id)}
                  className={cn(
                    "w-full text-left font-mono text-[11px] uppercase tracking-[0.2em] px-3 py-2 transition whitespace-nowrap",
                    active === t.id
                      ? "bg-accent/10 text-ink border-l-2 border-accent"
                      : "text-ink-dim hover:text-ink hover:bg-edge/40 border-l-2 border-transparent"
                  )}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Content */}
        <section className="min-w-0">
          {active === "profile" && (
            <ProfileTab
              value={data.profile}
              onChange={(v) => update("profile", v)}
            />
          )}
          {active === "experience" && (
            <ExperienceTab
              value={data.experience}
              onChange={(v) => update("experience", v)}
            />
          )}
          {active === "projects" && (
            <ProjectsTab
              value={data.projects}
              onChange={(v) => update("projects", v)}
            />
          )}
          {active === "ecosystem" && (
            <EcosystemTab
              value={data.ecosystem}
              onChange={(v) => update("ecosystem", v)}
            />
          )}
          {active === "education" && (
            <EducationTab
              value={data.education}
              onChange={(v) => update("education", v)}
            />
          )}
          {active === "certifications" && (
            <CertificationsTab
              value={data.certifications}
              onChange={(v) => update("certifications", v)}
            />
          )}
          {active === "architecture" && (
            <ArchitectureTab
              value={data.architecture}
              onChange={(v) => update("architecture", v)}
            />
          )}
          {active === "terminal" && (
            <TerminalTab
              value={data.terminal}
              onChange={(v) => update("terminal", v)}
            />
          )}
          {active === "nav" && (
            <NavTab value={data.nav} onChange={(v) => update("nav", v)} />
          )}
        </section>
      </div>
    </div>
  );
}
