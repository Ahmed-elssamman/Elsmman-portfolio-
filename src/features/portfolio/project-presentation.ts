import type { Project } from "@/lib/data-schemas";
import type { ProjectPresentation } from "./portfolio.model";

export function getProjectPresentation(project: Project): ProjectPresentation {
  let theme = "sage";
  if (project.capsuleHue < 90) theme = "sand";
  if (project.capsuleHue > 180) theme = "lavender";
  return {
    image: project.image,
    alt: project.imageAlt || `${project.name} interface`,
    theme,
    label: project.category,
  };
}
