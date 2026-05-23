"use client";

import { useState } from "react";
import type { Projects, Project } from "@/lib/data-schemas";
import {
  Section,
  Field,
  TextInput,
  TextArea,
  NumberInput,
  StringList,
  SaveBar,
  saveResource,
  type SaveStatus,
  ListCard,
  AddButton,
  moveItem,
} from "../_components/FormBits";

export function ProjectsTab({
  value,
  onChange,
}: {
  value: Projects;
  onChange: (v: Projects) => void;
}) {
  const [original] = useState(value);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const dirty = JSON.stringify(original) !== JSON.stringify(value);

  function update(i: number, patch: Partial<Project>) {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  async function save() {
    setStatus("saving");
    setError(null);
    const r = await saveResource("projects", value);
    if (r.ok) {
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
    } else {
      setStatus("error");
      setError(r.error || null);
    }
  }

  return (
    <div className="space-y-5">
      <Section
        title="Projects"
        description="Capsules in the Project Universe section."
      >
        <div className="space-y-3">
          {value.map((p, i) => (
            <ListCard
              key={p.id || i}
              title={`${p.index || "?"} — ${p.name || "(untitled)"}`}
              onRemove={() => onChange(value.filter((_, j) => j !== i))}
              onMoveUp={
                i > 0 ? () => onChange(moveItem(value, i, -1)) : undefined
              }
              onMoveDown={
                i < value.length - 1
                  ? () => onChange(moveItem(value, i, 1))
                  : undefined
              }
            >
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Index (e.g. 01)">
                  <TextInput
                    value={p.index}
                    onChange={(v) => update(i, { index: v })}
                  />
                </Field>
                <Field label="ID slug">
                  <TextInput
                    value={p.id}
                    onChange={(v) => update(i, { id: v })}
                  />
                </Field>
                <Field label="Name">
                  <TextInput
                    value={p.name}
                    onChange={(v) => update(i, { name: v })}
                  />
                </Field>
                <Field label="Category">
                  <TextInput
                    value={p.category}
                    onChange={(v) => update(i, { category: v })}
                  />
                </Field>
                <Field label="Capsule hue (0–360)">
                  <NumberInput
                    value={p.capsuleHue}
                    onChange={(v) => update(i, { capsuleHue: v })}
                    min={0}
                    max={360}
                  />
                </Field>
              </div>
              <Field label="Summary (capsule preview)">
                <TextArea
                  value={p.summary}
                  onChange={(v) => update(i, { summary: v })}
                  rows={2}
                />
              </Field>
              <Field label="Description (detail console)">
                <TextArea
                  value={p.description}
                  onChange={(v) => update(i, { description: v })}
                  rows={4}
                />
              </Field>

              <Field label="Metrics (label / value pairs, max 3 visible)">
                <div className="space-y-2">
                  {p.metrics.map((m, mi) => (
                    <div key={mi} className="flex items-start gap-2">
                      <input
                        type="text"
                        value={m.label}
                        placeholder="Label"
                        onChange={(e) => {
                          const next = [...p.metrics];
                          next[mi] = { ...m, label: e.target.value };
                          update(i, { metrics: next });
                        }}
                        className="w-1/2 bg-bg-elev/60 border border-edge focus:border-accent/60 px-3 py-2 text-ink font-mono text-sm outline-none"
                      />
                      <input
                        type="text"
                        value={m.value}
                        placeholder="Value"
                        onChange={(e) => {
                          const next = [...p.metrics];
                          next[mi] = { ...m, value: e.target.value };
                          update(i, { metrics: next });
                        }}
                        className="w-1/2 bg-bg-elev/60 border border-edge focus:border-accent/60 px-3 py-2 text-ink font-mono text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          update(i, {
                            metrics: p.metrics.filter((_, j) => j !== mi),
                          })
                        }
                        className="shrink-0 border border-edge px-2 py-1 font-mono text-[10px] text-ink-dim hover:text-signal-warm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      update(i, {
                        metrics: [...p.metrics, { label: "", value: "" }],
                      })
                    }
                    className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim hover:text-ink"
                  >
                    + Add metric
                  </button>
                </div>
              </Field>

              <Field label="Stack chips">
                <StringList
                  value={p.stack}
                  onChange={(v) => update(i, { stack: v })}
                  placeholder="Add tech"
                />
              </Field>

              <Field label="Architecture nodes (system flow)">
                <StringList
                  value={p.architecture}
                  onChange={(v) => update(i, { architecture: v })}
                  placeholder="Add node"
                />
              </Field>

              <Field label="Engineering highlights">
                <StringList
                  value={p.highlights}
                  onChange={(v) => update(i, { highlights: v })}
                  placeholder="Add highlight"
                />
              </Field>
            </ListCard>
          ))}
          <AddButton
            label="Add project"
            onClick={() =>
              onChange([
                ...value,
                {
                  id: `project-${Date.now()}`,
                  index: String(value.length + 1).padStart(2, "0"),
                  name: "",
                  category: "",
                  summary: "",
                  description: "",
                  metrics: [],
                  stack: [],
                  architecture: [],
                  capsuleHue: 210,
                  highlights: [],
                  links: [],
                },
              ])
            }
          />
        </div>
      </Section>

      <SaveBar status={status} error={error} dirty={dirty} onSave={save} />
    </div>
  );
}
