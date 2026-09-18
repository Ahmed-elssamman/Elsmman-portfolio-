import Link from "next/link";
import type { Project, Projects } from "@/lib/data-schemas";
import { IconName } from "./portfolio.enum";
import { PortfolioIcon } from "./portfolio-icon";
import { ProjectVisual } from "./project-visual";

interface WorkSectionProps { projects: Projects; github: string; }
interface ProjectCardProps { project: Project; featured: boolean; }

function ProjectCard({ project, featured }: ProjectCardProps) {
  const className = featured ? "project-card project-card-featured" : "project-card";
  const stack = project.stack.slice(0, 4);
  const href = `/projects/${project.id}`;
  return (
    <article className={className}>
      <Link href={href} className="project-image-link"><ProjectVisual project={project} /></Link>
      <div className="project-card-content">
        <p className="eyebrow project-category"><span>{project.index}</span>{project.category}</p>
        <div className="project-title-row"><h3><Link href={href}>{project.name}</Link></h3><Link href={href} className="project-arrow" aria-label={`Explore ${project.name}`}><PortfolioIcon name={IconName.ArrowUpRight} /></Link></div>
        <p className="project-summary">{project.summary}</p>
        <ul className="tag-list" aria-label={`${project.name} technologies`}>{stack.map((technology) => <li key={technology}>{technology}</li>)}</ul>
        <div className="project-links">
          <Link href={href} className="text-link">Inside the project <PortfolioIcon name={IconName.ArrowRight} /></Link>
          {project.links.map((link) => <a key={link.href} href={link.href} className="subtle-link" target="_blank" rel="noopener noreferrer">{link.label}<PortfolioIcon name={IconName.ArrowUpRight} /><span className="sr-only"> (opens in a new tab)</span></a>)}
        </div>
      </div>
    </article>
  );
}

export function WorkSection({ projects, github }: WorkSectionProps) {
  return (
    <section id="work" className="work-section section-space page-width" aria-labelledby="work-title">
      <div className="section-heading">
        <div><p className="eyebrow section-index">01 / Selected work</p><h2 id="work-title">A few things<br />I’ve <span className="serif-accent">built.</span></h2></div>
        <div className="section-heading-aside"><p>Different problems. The same care<br className="desktop-break" /> for the person on the other side of the screen.</p><a href={github} className="text-link" target="_blank" rel="noopener noreferrer">More on GitHub <PortfolioIcon name={IconName.ArrowUpRight} /><span className="sr-only"> (opens in a new tab)</span></a></div>
      </div>
      {projects.length > 0 ? <div className="projects-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} featured={index === 0} />)}</div> : <p className="empty-state">I’m putting together my latest work. In the meantime, you can explore my projects on GitHub.</p>}
    </section>
  );
}
