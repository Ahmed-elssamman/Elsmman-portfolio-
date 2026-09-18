import type { ExperienceItem, Project } from "@/lib/data-schemas";

export const PROJECT_COLORS = [
  { label: "Sage", value: 145 },
  { label: "Lavender", value: 225 },
  { label: "Sand", value: 30 },
];
export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function createProject(index: number): Project {
  return {
    id: "project-" + crypto.randomUUID(),
    index: String(index).padStart(2, "0"),
    name: "",
    category: "",
    summary: "",
    description: "",
    image: "",
    imageAlt: "",
    previewNote: "",
    metrics: [],
    stack: [],
    architecture: [],
    capsuleHue: 145,
    highlights: [],
    links: [],
  };
}

export function createExperience(): ExperienceItem {
  return {
    id: "role-" + crypto.randomUUID(),
    company: "",
    role: "",
    location: "",
    type: "",
    start: "",
    end: "Present",
    summary: "",
    bullets: [],
    stack: [],
  };
}
