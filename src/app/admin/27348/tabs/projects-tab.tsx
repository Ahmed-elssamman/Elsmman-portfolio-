"use client";

import { useState } from "react";
import type { Projects, Project } from "@/lib/data-schemas";
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
import { createProject, PROJECT_COLORS } from "./editor.control";
import { ProjectImageField } from "./project-image-field";
import { useResourceSave } from "./use-resource-save";

interface ProjectsTabProps {
  value: Projects;
  onChange: (value: Projects) => void;
}

export function ProjectsTab({ value, onChange }: ProjectsTabProps) {
  const editor = useResourceSave("projects", value);
  const [uploading, setUploading] = useState(false);

  function update(id: string, patch: Partial<Project>) {
    onChange(
      value.map((project) =>
        project.id === id ? { ...project, ...patch } : project,
      ),
    );
  }

  function add() {
    onChange([...value, createProject(value.length + 1)]);
  }

  return (
    <div className="space-y-5">
      <fieldset disabled={editor.saving || uploading} className="min-w-0">
        <Section
          title="Projects"
          description="Add your work, screenshots, and links. The first project is featured on the homepage. Save changes to publish your edits."
        >
          {value.map((project, index) => (
            <ListCard
              key={project.id}
              title={project.name || "New project"}
              onRemove={() =>
                onChange(value.filter((item) => item.id !== project.id))
              }
              {...(index > 0
                ? { onMoveUp: () => onChange(moveItem(value, index, -1)) }
                : {})}
              {...(index < value.length - 1
                ? { onMoveDown: () => onChange(moveItem(value, index, 1)) }
                : {})}
            >
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Project name">
                  <TextInput
                    value={project.name}
                    onChange={(name) => update(project.id, { name })}
                  />
                </Field>
                <Field label="Category">
                  <TextInput
                    value={project.category}
                    onChange={(category) => update(project.id, { category })}
                    placeholder="e.g. Learning platform"
                  />
                </Field>
                <Field label="Display number">
                  <TextInput
                    value={project.index}
                    onChange={(number) => update(project.id, { index: number })}
                  />
                </Field>
                <Field label="Preview color">
                  <select
                    value={project.capsuleHue}
                    onChange={(event) =>
                      update(project.id, {
                        capsuleHue: Number(event.target.value),
                      })
                    }
                    className="w-full border border-edge bg-bg-elev px-3 py-2 text-ink"
                  >
                    {PROJECT_COLORS.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Short summary">
                <TextArea
                  value={project.summary}
                  onChange={(summary) => update(project.id, { summary })}
                  rows={2}
                />
              </Field>
              <Field label="Project story">
                <TextArea
                  value={project.description}
                  onChange={(description) =>
                    update(project.id, { description })
                  }
                  rows={4}
                />
              </Field>
              <ProjectImageField
                image={project.image}
                name={project.name}
                onChange={(image) => update(project.id, { image })}
                onUploading={setUploading}
              />
              <Field
                label="Image description"
                hint="Describe the screenshot for people using screen readers."
              >
                <TextInput
                  value={project.imageAlt}
                  onChange={(imageAlt) => update(project.id, { imageAlt })}
                />
              </Field>
              <Field
                label="Preview note"
                hint="Optional context about a local preview, illustration, or demo limitation."
              >
                <TextArea
                  value={project.previewNote}
                  onChange={(previewNote) =>
                    update(project.id, { previewNote })
                  }
                  rows={2}
                />
              </Field>
              <fieldset className="min-w-0 space-y-2">
                <legend className="text-sm text-ink">Technologies</legend>
                <StringList
                  value={project.stack}
                  onChange={(stack) => update(project.id, { stack })}
                  placeholder="Add technology"
                />
              </fieldset>
              <fieldset className="min-w-0 space-y-2">
                <legend className="text-sm text-ink">
                  Engineering highlights
                </legend>
                <StringList
                  value={project.highlights}
                  onChange={(highlights) => update(project.id, { highlights })}
                  placeholder="Add highlight"
                />
              </fieldset>
              <fieldset className="min-w-0 space-y-3">
                <legend className="text-sm text-ink">Project links</legend>
                {project.links.map((link, linkIndex) => (
                  <div
                    key={linkIndex}
                    className="grid items-end gap-2 md:grid-cols-[1fr_2fr_auto]"
                  >
                    <Field label="Link label">
                      <TextInput
                        value={link.label}
                        onChange={(label) =>
                          update(project.id, {
                            links: project.links.map((item, itemIndex) =>
                              itemIndex === linkIndex
                                ? { ...item, label }
                                : item,
                            ),
                          })
                        }
                        placeholder="Source code or Live demo"
                      />
                    </Field>
                    <Field label="Link URL">
                      <TextInput
                        value={link.href}
                        type="url"
                        onChange={(href) =>
                          update(project.id, {
                            links: project.links.map((item, itemIndex) =>
                              itemIndex === linkIndex
                                ? { ...item, href }
                                : item,
                            ),
                          })
                        }
                        placeholder="https://…"
                      />
                    </Field>
                    <button
                      type="button"
                      onClick={() =>
                        update(project.id, {
                          links: project.links.filter(
                            (_, itemIndex) => itemIndex !== linkIndex,
                          ),
                        })
                      }
                      className="border border-edge px-3 py-2 text-sm text-ink"
                    >
                      Remove link
                    </button>
                  </div>
                ))}
                <AddButton
                  label="Add link"
                  onClick={() =>
                    update(project.id, {
                      links: [...project.links, { label: "", href: "" }],
                    })
                  }
                />
              </fieldset>
            </ListCard>
          ))}
          <AddButton label="Add project" onClick={add} />
        </Section>
      </fieldset>
      <SaveBar
        status={editor.status}
        error={editor.error}
        dirty={editor.dirty && !uploading}
        onSave={editor.save}
      />
    </div>
  );
}
