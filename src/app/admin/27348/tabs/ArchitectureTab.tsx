"use client";

import { useState } from "react";
import type { Architecture, ArchNode, ArchFlow } from "@/lib/data-schemas";
import {
  Section,
  Field,
  TextInput,
  NumberInput,
  SaveBar,
  saveResource,
  type SaveStatus,
  ListCard,
  AddButton,
  moveItem,
} from "../_components/FormBits";

export function ArchitectureTab({
  value,
  onChange,
}: {
  value: Architecture;
  onChange: (v: Architecture) => void;
}) {
  const [original] = useState(value);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const dirty = JSON.stringify(original) !== JSON.stringify(value);

  function updateNode(i: number, patch: Partial<ArchNode>) {
    const nodes = [...value.nodes];
    nodes[i] = { ...nodes[i], ...patch };
    onChange({ ...value, nodes });
  }

  function updateFlow(i: number, patch: Partial<ArchFlow>) {
    const flows = [...value.flows];
    flows[i] = { ...flows[i], ...patch };
    onChange({ ...value, flows });
  }

  async function save() {
    setStatus("saving");
    setError(null);
    const r = await saveResource("architecture", value);
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
        title="Architecture diagram — nodes"
        description="Grid coordinates (col 0–4, row 0–2) for the topology SVG."
      >
        <div className="space-y-3">
          {value.nodes.map((n, i) => (
            <ListCard
              key={n.id || i}
              title={n.label || "(new)"}
              onRemove={() =>
                onChange({
                  ...value,
                  nodes: value.nodes.filter((_, j) => j !== i),
                })
              }
              onMoveUp={
                i > 0
                  ? () =>
                      onChange({
                        ...value,
                        nodes: moveItem(value.nodes, i, -1),
                      })
                  : undefined
              }
              onMoveDown={
                i < value.nodes.length - 1
                  ? () =>
                      onChange({
                        ...value,
                        nodes: moveItem(value.nodes, i, 1),
                      })
                  : undefined
              }
            >
              <div className="grid md:grid-cols-4 gap-3">
                <Field label="ID">
                  <TextInput
                    value={n.id}
                    onChange={(v) => updateNode(i, { id: v })}
                  />
                </Field>
                <Field label="Label">
                  <TextInput
                    value={n.label}
                    onChange={(v) => updateNode(i, { label: v })}
                  />
                </Field>
                <Field label="Col">
                  <NumberInput
                    value={n.col}
                    onChange={(v) => updateNode(i, { col: Math.round(v) })}
                    min={0}
                  />
                </Field>
                <Field label="Row">
                  <NumberInput
                    value={n.row}
                    onChange={(v) => updateNode(i, { row: Math.round(v) })}
                    min={0}
                  />
                </Field>
              </div>
              <Field label="Subtitle">
                <TextInput
                  value={n.sub}
                  onChange={(v) => updateNode(i, { sub: v })}
                />
              </Field>
            </ListCard>
          ))}
          <AddButton
            label="Add node"
            onClick={() =>
              onChange({
                ...value,
                nodes: [
                  ...value.nodes,
                  {
                    id: `node-${Date.now()}`,
                    label: "",
                    sub: "",
                    col: 0,
                    row: 0,
                  },
                ],
              })
            }
          />
        </div>
      </Section>

      <Section
        title="Flows"
        description="Edges between nodes by ID."
      >
        <div className="space-y-3">
          {value.flows.map((f, i) => (
            <ListCard
              key={i}
              title={`${f.from || "?"} → ${f.to || "?"}`}
              onRemove={() =>
                onChange({
                  ...value,
                  flows: value.flows.filter((_, j) => j !== i),
                })
              }
              onMoveUp={
                i > 0
                  ? () =>
                      onChange({
                        ...value,
                        flows: moveItem(value.flows, i, -1),
                      })
                  : undefined
              }
              onMoveDown={
                i < value.flows.length - 1
                  ? () =>
                      onChange({
                        ...value,
                        flows: moveItem(value.flows, i, 1),
                      })
                  : undefined
              }
            >
              <div className="grid md:grid-cols-3 gap-3">
                <Field label="From (node ID)">
                  <TextInput
                    value={f.from}
                    onChange={(v) => updateFlow(i, { from: v })}
                  />
                </Field>
                <Field label="To (node ID)">
                  <TextInput
                    value={f.to}
                    onChange={(v) => updateFlow(i, { to: v })}
                  />
                </Field>
                <Field label="Label (optional)">
                  <TextInput
                    value={f.label || ""}
                    onChange={(v) =>
                      updateFlow(i, { label: v || undefined })
                    }
                  />
                </Field>
              </div>
            </ListCard>
          ))}
          <AddButton
            label="Add flow"
            onClick={() =>
              onChange({
                ...value,
                flows: [...value.flows, { from: "", to: "" }],
              })
            }
          />
        </div>
      </Section>

      <SaveBar status={status} error={error} dirty={dirty} onSave={save} />
    </div>
  );
}
