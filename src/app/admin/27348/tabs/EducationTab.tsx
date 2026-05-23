"use client";

import { useState } from "react";
import type { Education, EducationItem } from "@/lib/data-schemas";
import {
  Section,
  Field,
  TextInput,
  SaveBar,
  saveResource,
  type SaveStatus,
  ListCard,
  AddButton,
  moveItem,
} from "../_components/FormBits";

export function EducationTab({
  value,
  onChange,
}: {
  value: Education;
  onChange: (v: Education) => void;
}) {
  const [original] = useState(value);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const dirty = JSON.stringify(original) !== JSON.stringify(value);

  function update(i: number, patch: Partial<EducationItem>) {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  async function save() {
    setStatus("saving");
    setError(null);
    const r = await saveResource("education", value);
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
      <Section title="Education">
        <div className="space-y-3">
          {value.map((e, i) => (
            <ListCard
              key={e.id || i}
              title={e.degree || "(new)"}
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
              <Field label="ID">
                <TextInput
                  value={e.id}
                  onChange={(v) => update(i, { id: v })}
                />
              </Field>
              <Field label="Degree / program">
                <TextInput
                  value={e.degree}
                  onChange={(v) => update(i, { degree: v })}
                />
              </Field>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Institution">
                  <TextInput
                    value={e.institution}
                    onChange={(v) => update(i, { institution: v })}
                  />
                </Field>
                <Field label="Location">
                  <TextInput
                    value={e.location}
                    onChange={(v) => update(i, { location: v })}
                  />
                </Field>
                <Field label="Start">
                  <TextInput
                    value={e.start}
                    onChange={(v) => update(i, { start: v })}
                  />
                </Field>
                <Field label="End">
                  <TextInput
                    value={e.end}
                    onChange={(v) => update(i, { end: v })}
                  />
                </Field>
              </div>
            </ListCard>
          ))}
          <AddButton
            label="Add education entry"
            onClick={() =>
              onChange([
                ...value,
                {
                  id: `edu-${Date.now()}`,
                  degree: "",
                  institution: "",
                  location: "",
                  start: "",
                  end: "",
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
