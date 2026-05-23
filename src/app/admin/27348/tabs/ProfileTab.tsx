"use client";

import { useState } from "react";
import type { Profile } from "@/lib/data-schemas";
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

export function ProfileTab({
  value,
  onChange,
}: {
  value: Profile;
  onChange: (v: Profile) => void;
}) {
  const [original] = useState(value);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const dirty = JSON.stringify(original) !== JSON.stringify(value);

  function set<K extends keyof Profile>(k: K, v: Profile[K]) {
    onChange({ ...value, [k]: v });
  }

  async function save() {
    setStatus("saving");
    setError(null);
    const r = await saveResource("profile", value);
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
      <Section title="Identity" description="Name, role, location, status.">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Name">
            <TextInput value={value.name} onChange={(v) => set("name", v)} />
          </Field>
          <Field label="Role / title">
            <TextInput value={value.role} onChange={(v) => set("role", v)} />
          </Field>
          <Field label="Location">
            <TextInput
              value={value.location}
              onChange={(v) => set("location", v)}
            />
          </Field>
          <Field label="Status">
            <TextInput
              value={value.status}
              onChange={(v) => set("status", v)}
            />
          </Field>
        </div>
        <Field label="Tagline (hero)">
          <TextArea
            value={value.tagline}
            onChange={(v) => set("tagline", v)}
            rows={2}
          />
        </Field>
        <Field label="Short bio (identity section)">
          <TextArea
            value={value.shortBio}
            onChange={(v) => set("shortBio", v)}
            rows={3}
          />
        </Field>
      </Section>

      <Section
        title="Narrative blocks"
        description="3 narrative blocks shown in the Identity section."
      >
        <div className="space-y-3">
          {value.identityNarrative.map((n, i) => (
            <ListCard
              key={i}
              title={`Block ${i + 1}`}
              onRemove={() =>
                set(
                  "identityNarrative",
                  value.identityNarrative.filter((_, j) => j !== i)
                )
              }
              onMoveUp={
                i > 0
                  ? () =>
                      set(
                        "identityNarrative",
                        moveItem(value.identityNarrative, i, -1)
                      )
                  : undefined
              }
              onMoveDown={
                i < value.identityNarrative.length - 1
                  ? () =>
                      set(
                        "identityNarrative",
                        moveItem(value.identityNarrative, i, 1)
                      )
                  : undefined
              }
            >
              <Field label="Heading">
                <TextInput
                  value={n.heading}
                  onChange={(v) => {
                    const next = [...value.identityNarrative];
                    next[i] = { ...n, heading: v };
                    set("identityNarrative", next);
                  }}
                />
              </Field>
              <Field label="Body">
                <TextArea
                  value={n.body}
                  onChange={(v) => {
                    const next = [...value.identityNarrative];
                    next[i] = { ...n, body: v };
                    set("identityNarrative", next);
                  }}
                  rows={3}
                />
              </Field>
            </ListCard>
          ))}
          <AddButton
            label="Add narrative block"
            onClick={() =>
              set("identityNarrative", [
                ...value.identityNarrative,
                { heading: "", body: "" },
              ])
            }
          />
        </div>
      </Section>

      <Section title="Achievements">
        <StringList
          value={value.achievements}
          onChange={(v) => set("achievements", v)}
          placeholder="Add achievement"
        />
      </Section>

      <Section title="Links">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Email">
            <TextInput
              value={value.links.email}
              onChange={(v) =>
                set("links", { ...value.links, email: v })
              }
            />
          </Field>
          <Field label="Phone">
            <TextInput
              value={value.links.phone || ""}
              onChange={(v) =>
                set("links", { ...value.links, phone: v })
              }
            />
          </Field>
          <Field label="GitHub URL">
            <TextInput
              value={value.links.github}
              onChange={(v) =>
                set("links", { ...value.links, github: v })
              }
            />
          </Field>
          <Field label="LinkedIn URL">
            <TextInput
              value={value.links.linkedin}
              onChange={(v) =>
                set("links", { ...value.links, linkedin: v })
              }
            />
          </Field>
          <Field label="Résumé URL or path">
            <TextInput
              value={value.links.resume || ""}
              onChange={(v) =>
                set("links", { ...value.links, resume: v })
              }
            />
          </Field>
        </div>
      </Section>

      <Section
        title="Hero telemetry strip"
        description="Bottom-of-hero key/value pills (max ~5)."
      >
        <div className="space-y-3">
          {value.telemetry.map((t, i) => (
            <ListCard
              key={i}
              title={`Item ${i + 1}`}
              onRemove={() =>
                set(
                  "telemetry",
                  value.telemetry.filter((_, j) => j !== i)
                )
              }
              onMoveUp={
                i > 0
                  ? () => set("telemetry", moveItem(value.telemetry, i, -1))
                  : undefined
              }
              onMoveDown={
                i < value.telemetry.length - 1
                  ? () => set("telemetry", moveItem(value.telemetry, i, 1))
                  : undefined
              }
            >
              <div className="grid grid-cols-2 gap-3">
                <Field label="Key">
                  <TextInput
                    value={t.k}
                    onChange={(v) => {
                      const next = [...value.telemetry];
                      next[i] = { ...t, k: v };
                      set("telemetry", next);
                    }}
                  />
                </Field>
                <Field label="Value">
                  <TextInput
                    value={t.v}
                    onChange={(v) => {
                      const next = [...value.telemetry];
                      next[i] = { ...t, v: v };
                      set("telemetry", next);
                    }}
                  />
                </Field>
              </div>
            </ListCard>
          ))}
          <AddButton
            label="Add telemetry item"
            onClick={() =>
              set("telemetry", [...value.telemetry, { k: "", v: "" }])
            }
          />
        </div>
      </Section>

      <Section title="Languages">
        <div className="space-y-3">
          {value.languages.map((l, i) => (
            <ListCard
              key={i}
              title={`Language ${i + 1}`}
              onRemove={() =>
                set(
                  "languages",
                  value.languages.filter((_, j) => j !== i)
                )
              }
            >
              <div className="grid grid-cols-2 gap-3">
                <Field label="Name">
                  <TextInput
                    value={l.name}
                    onChange={(v) => {
                      const next = [...value.languages];
                      next[i] = { ...l, name: v };
                      set("languages", next);
                    }}
                  />
                </Field>
                <Field label="Level">
                  <TextInput
                    value={l.level}
                    onChange={(v) => {
                      const next = [...value.languages];
                      next[i] = { ...l, level: v };
                      set("languages", next);
                    }}
                  />
                </Field>
              </div>
            </ListCard>
          ))}
          <AddButton
            label="Add language"
            onClick={() =>
              set("languages", [
                ...value.languages,
                { name: "", level: "" },
              ])
            }
          />
        </div>
      </Section>

      <SaveBar
        status={status}
        error={error}
        dirty={dirty}
        onSave={save}
      />
    </div>
  );
}
