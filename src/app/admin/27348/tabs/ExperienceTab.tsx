"use client";

import { useState } from "react";
import type { Experience, ExperienceItem } from "@/lib/data-schemas";
import {
  Section,
  Field,
  TextInput,
  TextArea,
  StringList,
  SaveBar,
  saveResource,
  type SaveStatus,
  ListCard,
  AddButton,
  moveItem,
} from "../_components/FormBits";

export function ExperienceTab({
  value,
  onChange,
}: {
  value: Experience;
  onChange: (v: Experience) => void;
}) {
  const [original] = useState(value);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const dirty = JSON.stringify(original) !== JSON.stringify(value);

  function update(i: number, patch: Partial<ExperienceItem>) {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  async function save() {
    setStatus("saving");
    setError(null);
    const r = await saveResource("experience", value);
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
        title="Experience"
        description="Roles ordered most recent first. Each role shows on the public Experience section."
      >
        <div className="space-y-3">
          {value.map((item, i) => (
            <ListCard
              key={item.id || i}
              title={`${item.company || "(new)"} — ${item.role || ""}`}
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
                <Field label="Company">
                  <TextInput
                    value={item.company}
                    onChange={(v) => update(i, { company: v })}
                  />
                </Field>
                <Field label="Role">
                  <TextInput
                    value={item.role}
                    onChange={(v) => update(i, { role: v })}
                  />
                </Field>
                <Field label="Location">
                  <TextInput
                    value={item.location}
                    onChange={(v) => update(i, { location: v })}
                  />
                </Field>
                <Field label="Type (Full-time, Contract…)">
                  <TextInput
                    value={item.type}
                    onChange={(v) => update(i, { type: v })}
                  />
                </Field>
                <Field label="Start (e.g. Feb 2026)">
                  <TextInput
                    value={item.start}
                    onChange={(v) => update(i, { start: v })}
                  />
                </Field>
                <Field label="End (or 'Present')">
                  <TextInput
                    value={item.end}
                    onChange={(v) => update(i, { end: v })}
                  />
                </Field>
              </div>
              <Field label="ID slug (stable identifier)">
                <TextInput
                  value={item.id}
                  onChange={(v) => update(i, { id: v })}
                />
              </Field>
              <Field label="Summary">
                <TextArea
                  value={item.summary}
                  onChange={(v) => update(i, { summary: v })}
                  rows={2}
                />
              </Field>
              <Field label="Bullets / responsibilities">
                <StringList
                  value={item.bullets}
                  onChange={(v) => update(i, { bullets: v })}
                  placeholder="Add bullet"
                />
              </Field>
              <Field label="Stack chips">
                <StringList
                  value={item.stack}
                  onChange={(v) => update(i, { stack: v })}
                  placeholder="Add tech"
                />
              </Field>
            </ListCard>
          ))}
          <AddButton
            label="Add experience"
            onClick={() =>
              onChange([
                ...value,
                {
                  id: `role-${Date.now()}`,
                  company: "",
                  role: "",
                  location: "",
                  type: "",
                  start: "",
                  end: "",
                  summary: "",
                  bullets: [],
                  stack: [],
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
