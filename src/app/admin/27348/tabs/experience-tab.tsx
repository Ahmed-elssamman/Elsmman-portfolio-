"use client";

import type { Experience, ExperienceItem } from "@/lib/data-schemas";
import {
  Section,
  Field,
  TextInput,
  TextArea,
  StringList,
  SaveBar,
  ListCard,
  AddButton,
  moveItem,
} from "../_components/FormBits";

import { createExperience } from "./editor.control";
import { useResourceSave } from "./use-resource-save";

interface ExperienceTabProps {
  value: Experience;
  onChange: (value: Experience) => void;
}

export function ExperienceTab({ value, onChange }: ExperienceTabProps) {
  const editor = useResourceSave("experience", value);

  function update(i: number, patch: Partial<ExperienceItem>) {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  function add() {
    onChange([createExperience(), ...value]);
  }

  return (
    <div className="space-y-5">
      <fieldset disabled={editor.saving} className="min-w-0">
        <Section
          title="Experience"
          description="Roles ordered most recent first. Each role shows on the public Experience section."
        >
          <div className="space-y-3">
            {value.map((item, i) => (
              <ListCard
                key={item.id}
                title={`${item.company || "(new)"} — ${item.role || ""}`}
                onRemove={() => onChange(value.filter((_, j) => j !== i))}
                {...(i > 0
                  ? { onMoveUp: () => onChange(moveItem(value, i, -1)) }
                  : {})}
                {...(i < value.length - 1
                  ? { onMoveDown: () => onChange(moveItem(value, i, 1)) }
                  : {})}
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
                <Field label="Summary">
                  <TextArea
                    value={item.summary}
                    onChange={(v) => update(i, { summary: v })}
                    rows={2}
                  />
                </Field>
                <fieldset className="min-w-0">
                  <legend className="text-sm text-ink">Responsibilities</legend>
                  <StringList
                    value={item.bullets}
                    onChange={(v) => update(i, { bullets: v })}
                    placeholder="Add bullet"
                  />
                </fieldset>
                <fieldset className="min-w-0">
                  <legend className="text-sm text-ink">Technologies</legend>
                  <StringList
                    value={item.stack}
                    onChange={(v) => update(i, { stack: v })}
                    placeholder="Add tech"
                  />
                </fieldset>
              </ListCard>
            ))}
            <AddButton label="Add experience" onClick={add} />
          </div>
        </Section>
      </fieldset>

      <SaveBar
        status={editor.status}
        error={editor.error}
        dirty={editor.dirty}
        onSave={editor.save}
      />
    </div>
  );
}
