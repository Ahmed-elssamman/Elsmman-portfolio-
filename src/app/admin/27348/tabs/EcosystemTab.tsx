"use client";

import { useState } from "react";
import type { Ecosystem, EcosystemCluster } from "@/lib/data-schemas";
import {
  Section,
  Field,
  TextInput,
  TextArea,
  NumberInput,
  SaveBar,
  saveResource,
  type SaveStatus,
  ListCard,
  AddButton,
  moveItem,
} from "../_components/FormBits";

export function EcosystemTab({
  value,
  onChange,
}: {
  value: Ecosystem;
  onChange: (v: Ecosystem) => void;
}) {
  const [original] = useState(value);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const dirty = JSON.stringify(original) !== JSON.stringify(value);

  function updateCluster(i: number, patch: Partial<EcosystemCluster>) {
    const next = [...value];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  async function save() {
    setStatus("saving");
    setError(null);
    const r = await saveResource("ecosystem", value);
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
        title="Skills / Ecosystem"
        description="Clusters of skills shown in the Ecosystem galaxy."
      >
        <div className="space-y-3">
          {value.map((cluster, i) => (
            <ListCard
              key={cluster.id || i}
              title={cluster.name || "(unnamed cluster)"}
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
              <div className="grid md:grid-cols-3 gap-3">
                <Field label="ID">
                  <TextInput
                    value={cluster.id}
                    onChange={(v) => updateCluster(i, { id: v })}
                  />
                </Field>
                <Field label="Name">
                  <TextInput
                    value={cluster.name}
                    onChange={(v) => updateCluster(i, { name: v })}
                  />
                </Field>
                <Field label="Hue offset">
                  <NumberInput
                    value={cluster.hue}
                    onChange={(v) => updateCluster(i, { hue: v })}
                    min={0}
                    max={360}
                  />
                </Field>
              </div>
              <Field label="Summary">
                <TextArea
                  value={cluster.summary}
                  onChange={(v) => updateCluster(i, { summary: v })}
                  rows={2}
                />
              </Field>

              <Field label="Nodes (label + weight 0–1)">
                <div className="space-y-2">
                  {cluster.nodes.map((n, ni) => (
                    <div key={ni} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={n.id}
                        placeholder="id"
                        onChange={(e) => {
                          const next = [...cluster.nodes];
                          next[ni] = { ...n, id: e.target.value };
                          updateCluster(i, { nodes: next });
                        }}
                        className="w-1/4 bg-bg-elev/60 border border-edge focus:border-accent/60 px-3 py-2 text-ink font-mono text-sm outline-none"
                      />
                      <input
                        type="text"
                        value={n.label}
                        placeholder="Label"
                        onChange={(e) => {
                          const next = [...cluster.nodes];
                          next[ni] = { ...n, label: e.target.value };
                          updateCluster(i, { nodes: next });
                        }}
                        className="flex-1 bg-bg-elev/60 border border-edge focus:border-accent/60 px-3 py-2 text-ink font-mono text-sm outline-none"
                      />
                      <input
                        type="number"
                        value={n.weight}
                        min={0}
                        max={1}
                        step={0.05}
                        onChange={(e) => {
                          const next = [...cluster.nodes];
                          next[ni] = {
                            ...n,
                            weight: Math.max(
                              0,
                              Math.min(1, Number(e.target.value) || 0)
                            ),
                          };
                          updateCluster(i, { nodes: next });
                        }}
                        className="w-20 bg-bg-elev/60 border border-edge focus:border-accent/60 px-2 py-2 text-ink font-mono text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateCluster(i, {
                            nodes: cluster.nodes.filter((_, j) => j !== ni),
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
                      updateCluster(i, {
                        nodes: [
                          ...cluster.nodes,
                          {
                            id: `node-${Date.now()}`,
                            label: "",
                            weight: 0.7,
                          },
                        ],
                      })
                    }
                    className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim hover:text-ink"
                  >
                    + Add node
                  </button>
                </div>
              </Field>
            </ListCard>
          ))}
          <AddButton
            label="Add cluster"
            onClick={() =>
              onChange([
                ...value,
                {
                  id: `cluster-${Date.now()}`,
                  name: "",
                  hue: 0,
                  summary: "",
                  nodes: [],
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
