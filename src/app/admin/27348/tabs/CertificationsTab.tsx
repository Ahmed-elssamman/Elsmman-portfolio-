"use client";

import { useState } from "react";
import type { Certifications, Certification } from "@/lib/data-schemas";
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

export function CertificationsTab({
  value,
  onChange,
}: {
  value: Certifications;
  onChange: (v: Certifications) => void;
}) {
  const [original] = useState(value);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const dirty = JSON.stringify(original) !== JSON.stringify(value);

  function update(i: number, patch: Partial<Certification>) {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  async function save() {
    setStatus("saving");
    setError(null);
    const r = await saveResource("certifications", value);
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
      <Section title="Certifications">
        <div className="space-y-3">
          {value.map((c, i) => (
            <ListCard
              key={c.id || i}
              title={c.name || "(new)"}
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
                  value={c.id}
                  onChange={(v) => update(i, { id: v })}
                />
              </Field>
              <Field label="Certification name">
                <TextInput
                  value={c.name}
                  onChange={(v) => update(i, { name: v })}
                />
              </Field>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Issuer">
                  <TextInput
                    value={c.issuer}
                    onChange={(v) => update(i, { issuer: v })}
                  />
                </Field>
                <Field label="Year">
                  <TextInput
                    value={c.year}
                    onChange={(v) => update(i, { year: v })}
                  />
                </Field>
              </div>
            </ListCard>
          ))}
          <AddButton
            label="Add certification"
            onClick={() =>
              onChange([
                ...value,
                {
                  id: `cert-${Date.now()}`,
                  name: "",
                  issuer: "",
                  year: "",
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
