import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readResource } from "@/lib/data";
import { getSiteUrl } from "@/lib/site-url";
import { ContactSection } from "@/features/portfolio/contact-section";
import { IconName } from "@/features/portfolio/portfolio.enum";
import { PortfolioIcon } from "@/features/portfolio/portfolio-icon";
import { ProjectVisual } from "@/features/portfolio/project-visual";
import { SiteHeader } from "@/features/portfolio/site-header";

export const revalidate = 60;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await readResource("projects");
  return projects.map((project) => ({ slug: project.id }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const projects = await readResource("projects");
  const project = projects.find((item) => item.id === slug);
  if (!project) notFound();
  const metadata: Metadata = {
    title: project.name,
    description: project.summary,
    openGraph: {
      title: `${project.name} — Ahmed ElSamman`,
      description: project.summary,
      type: "article",
      images: [{ url: "/images/og-portfolio.png", width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: project.name, description: project.summary, images: ["/images/og-portfolio.png"] },
  };
  if (getSiteUrl()) metadata.alternates = { canonical: `/projects/${project.id}` };
  return metadata;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [projects, profile] = await Promise.all([readResource("projects"), readResource("profile")]);
  const projectIndex = projects.findIndex((item) => item.id === slug);
  const project = projects[projectIndex];
  if (!project) notFound();
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <div className="portfolio" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader home={false} />
      <main id="main-content">
        <article className="case-study page-width">
          <Link className="text-link case-back" href="/#work"><PortfolioIcon name={IconName.ArrowLeft} />All selected work</Link>
          <div className="case-heading"><p className="eyebrow">Selected work / {project.index} / {project.category}</p><h1>{project.name}</h1><p>{project.summary}</p></div>
          <ProjectVisual project={project} priority />
          {project.previewNote && <p className="preview-note">{project.previewNote}</p>}
          <div className="case-details">
            <aside className="case-sidebar" aria-label="Project technologies and links"><p className="eyebrow">Built with</p><ul className="tag-list">{project.stack.map((technology) => <li key={technology}>{technology}</li>)}</ul><p className="eyebrow">Explore the project</p>{project.links.map((link) => <a className="text-link" key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<PortfolioIcon name={IconName.ArrowUpRight} /><span className="sr-only"> (opens in a new tab)</span></a>)}</aside>
            <div className="case-story"><h2>The project</h2><p>{project.description}</p><h2>A closer look</h2><ul className="case-highlights">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div>
          </div>
          {nextProject && nextProject.id !== project.id && <div className="case-next"><div><p className="eyebrow">Up next</p><h2>{nextProject.name}</h2></div><Link className="button button-primary" href={`/projects/${nextProject.id}`}>Next project <PortfolioIcon name={IconName.ArrowRight} /></Link></div>}
        </article>
        <ContactSection profile={profile} />
      </main>
    </div>
  );
}
