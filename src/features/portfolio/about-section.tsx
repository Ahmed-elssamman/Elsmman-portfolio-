import type { Profile } from "@/lib/data-schemas";
import { EXPERTISE } from "./portfolio.control";
import { IconName } from "./portfolio.enum";
import { PortfolioIcon } from "./portfolio-icon";

interface AboutSectionProps { profile: Profile; }

export function AboutSection({ profile }: AboutSectionProps) {
  return (
    <section id="about" className="about-section section-space" aria-labelledby="about-title">
      <div className="page-width">
        <div className="about-introduction">
          <div><p className="eyebrow section-index">02 / The person behind the pixels</p><h2 id="about-title">Thoughtful by design.<br /><span className="serif-accent">Engineer at heart.</span></h2><div className="about-monogram" aria-hidden="true">a<span>e</span>.<PortfolioIcon name={IconName.ArrowUpRight} /></div></div>
          <div className="about-story"><p className="about-lead">{profile.shortBio}</p>{profile.identityNarrative.map((paragraph) => <p key={paragraph.heading}>{paragraph.body}</p>)}<div className="about-details"><span><span className="status-dot" />{profile.location}</span>{profile.languages.map((language) => <span key={language.name}>{language.name} · {language.level}</span>)}</div></div>
        </div>
        <div className="expertise-grid">{EXPERTISE.map((item) => <article key={item.number} className="expertise-item"><span className="eyebrow">/{item.number}</span><h3>{item.title}</h3><p>{item.description}</p><ul className="expertise-tools" aria-label={`${item.title} tools`}>{item.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul></article>)}</div>
      </div>
    </section>
  );
}
