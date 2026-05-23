"use client";

import { useState } from "react";
import type { TerminalSession } from "@/lib/data-schemas";
import {
  Section,
  Field,
  TextInput,
  TextArea,
  SaveBar,
  saveResource,
  type SaveStatus,
  ListCard,
  AddButton,
  moveItem,
} from "../_components/FormBits";

export function TerminalTab({
  value,
  onChange,
}: {
  value: TerminalSession;
  onChange: (v: TerminalSession) => void;
}) {
  const [original] = useState(value);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const dirty = JSON.stringify(original) !== JSON.stringify(value);

  async function save() {
    setStatus("saving");
    setError(null);
    const r = await saveResource("terminal", value);
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
      <Section title="Terminal session">
        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Prompt (e.g. ahmed@systems)">
            <TextInput
              value={value.prompt}
              onChange={(v) => onChange({ ...value, prompt: v })}
            />
          </Field>
          <Field label="Working dir (e.g. ~/engineering)">
            <TextInput
              value={value.cwd}
              onChange={(v) => onChange({ ...value, cwd: v })}
            />
          </Field>
        </div>
        <Field label="Script lines (cmd + output)">
          <div className="space-y-3">
            {value.lines.map((l, i) => (
              <ListCard
                key={i}
                title={`Line ${i + 1}`}
                onRemove={() =>
                  onChange({
                    ...value,
                    lines: value.lines.filter((_, j) => j !== i),
                  })
                }
                onMoveUp={
                  i > 0
                    ? () =>
                        onChange({
                          ...value,
                          lines: moveItem(value.lines, i, -1),
                        })
                    : undefined
                }
                onMoveDown={
                  i < value.lines.length - 1
                    ? () =>
                        onChange({
                          ...value,
                          lines: moveItem(value.lines, i, 1),
                        })
                    : undefined
                }
              >
                <Field label="Command typed">
                  <TextInput
                    value={l.cmd}
                    onChange={(v) => {
                      const lines = [...value.lines];
                      lines[i] = { ...l, cmd: v };
                      onChange({ ...value, lines });
                    }}
                  />
                </Field>
                <Field label="Output (use \\n for newlines)">
                  <TextArea
                    value={l.out}
                    onChange={(v) => {
                      const lines = [...value.lines];
                      lines[i] = { ...l, out: v };
                      onChange({ ...value, lines });
                    }}
                    rows={3}
                  />
                </Field>
              </ListCard>
            ))}
            <AddButton
              label="Add line"
              onClick={() =>
                onChange({
                  ...value,
                  lines: [...value.lines, { cmd: "", out: "" }],
                })
              }
            />
          </div>
        </Field>
      </Section>

      <SaveBar status={status} error={error} dirty={dirty} onSave={save} />
    </div>
  );
}
