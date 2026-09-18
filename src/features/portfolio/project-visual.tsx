import Image from "next/image";
import type { Project } from "@/lib/data-schemas";
import { getProjectPresentation } from "./project-presentation";

interface ProjectVisualProps { project: Project; priority?: boolean; }

export function ProjectVisual({ project, priority = false }: ProjectVisualProps) {
  const presentation = getProjectPresentation(project);
  return (
    <div className={`project-visual project-visual-${presentation.theme}`}>
      <div className="project-visual-topline"><span>{presentation.label}</span><span aria-hidden="true">↗</span></div>
      {presentation.image ? (
        <div className="project-screen">
          <div className="browser-chrome" aria-hidden="true"><span /><span /><span /><div>{project.name}</div></div>
          <Image src={presentation.image} alt={presentation.alt} width={1440} height={1000} sizes="(max-width: 767px) 90vw, (max-width: 1200px) 50vw, 640px" priority={priority} className="project-screenshot" />
        </div>
      ) : <div className="project-cover"><span>{project.index}</span><strong>{project.name}</strong><p>{project.category}</p></div>}
    </div>
  );
}
