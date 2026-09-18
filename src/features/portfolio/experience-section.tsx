import type { Certifications, Education, Experience } from "@/lib/data-schemas";
import { IconName } from "./portfolio.enum";
import { PortfolioIcon } from "./portfolio-icon";

interface ExperienceSectionProps { experience: Experience; education: Education; certifications: Certifications; resume: string; }

export function ExperienceSection({ experience, education, certifications, resume }: ExperienceSectionProps) {
  return (
    <section id="experience" className="experience-section section-space page-width" aria-labelledby="experience-title">
      <div className="section-heading"><div><p className="eyebrow section-index">03 / Experience & learning</p><h2 id="experience-title">Built over time.<br /><span className="serif-accent">Still building.</span></h2></div><a className="text-link" href={resume} download>The full story, in my CV <PortfolioIcon name={IconName.Download} /></a></div>
      <div className="experience-list">{experience.map((item, index) => <article key={item.id} className="experience-row"><div className="experience-date"><span>{item.start} — {item.end}</span>{item.type && <span>{item.type}</span>}</div><div className="experience-company"><h3>{item.company}</h3><p>{item.role}</p><span className="experience-location">{item.location}</span></div><div className="experience-content"><p>{item.summary}</p><details className="experience-details" open={index === 0}><summary>What I worked on <span aria-hidden="true">+</span></summary><ul>{item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul><ul className="tag-list" aria-label={`${item.company} technologies`}>{item.stack.map((technology) => <li key={technology}>{technology}</li>)}</ul></details></div></article>)}</div>
      <div className="learning-grid"><div><p className="eyebrow learning-label">The foundation</p>{education.map((item) => <article key={item.id} className="learning-item"><h3>{item.degree}</h3><p>{item.institution}</p><span>{item.start} — {item.end}</span></article>)}</div><div><p className="eyebrow learning-label">Always a student</p>{certifications.map((item) => <article key={item.id} className="learning-item"><h3>{item.name}</h3><p>{item.issuer} · {item.year}</p></article>)}</div></div>
    </section>
  );
}
