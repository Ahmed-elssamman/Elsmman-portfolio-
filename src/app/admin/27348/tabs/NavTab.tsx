"use client";

import { useState } from "react";
import type { Nav } from "@/lib/data-schemas";
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

export function NavTab({
  value,
  onChange,
}: {
  value: Nav;
  onChange: (v: Nav) => void;
}) {
  const [original] = useState(value);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const dirty = JSON.stringify(original) !== JSON.stringify(value);

  async function save() {
    setStatus("saving");
    setError(null);
    const r = await saveResource("nav", value);
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
        title="Navigation"
        description="ID = section anchor (must match an existing section's id), Label = visible nav text."
      >
        <div className="space-y-3">
          {value.map((l, i) => (
            <ListCard
              key={i}
              title={l.label || "(unnamed)"}
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
              <div className="grid grid-cols-2 gap-3">
                <Field label="Section ID (anchor)">
                  <TextInput
                    value={l.id}
                    onChange={(v) => {
                      const next = [...value];
                      next[i] = { ...l, id: v };
                      onChange(next);
                    }}
                  />
                </Field>
                <Field label="Label">
                  <TextInput
                    value={l.label}
                    onChange={(v) => {
                      const next = [...value];
                      next[i] = { ...l, label: v };
                      onChange(next);
                    }}
                  />
                </Field>
              </div>
            </ListCard>
          ))}
          <AddButton
            label="Add nav item"
            onClick={() => onChange([...value, { id: "", label: "" }])}
          />
        </div>
      </Section>

      <SaveBar status={status} error={error} dirty={dirty} onSave={save} />
    </div>
  );
}
