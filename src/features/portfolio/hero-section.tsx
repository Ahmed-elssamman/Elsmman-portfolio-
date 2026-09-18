import Image from "next/image";
import type { Profile } from "@/lib/data-schemas";
import { HERO } from "./portfolio.control";
import { IconName } from "./portfolio.enum";
import { PortfolioIcon } from "./portfolio-icon";

interface HeroSectionProps { profile: Profile; }

export function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section className="hero-section page-width" aria-labelledby="hero-title">
      <div className="hero-topline">
        <p className="eyebrow"><span className="status-dot" />{profile.status}</p>
        <p className="eyebrow hero-location">{profile.location}<span aria-hidden="true">↗</span></p>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="hero-introduction">{HERO.introduction}</p>
          <h1 id="hero-title">{HERO.headline}<br /><span className="serif-accent">{HERO.headlineAccent}</span><span className="hero-asterisk" aria-hidden="true">✳</span></h1>
          <p className="hero-description">{HERO.description}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore my work <PortfolioIcon name={IconName.ArrowDown} /></a>
            <a className="text-link" href={profile.links.resume} download>Download CV <PortfolioIcon name={IconName.Download} /></a>
          </div>
        </div>
        <figure className="hero-portrait">
          <div className="portrait-frame">
            <span className="portrait-coordinate" aria-hidden="true">30.0444° N / 31.2357° E</span>
            <div className="portrait-image"><Image src="/images/ahmed-avatar.jpg" alt="Ahmed ElSamman" width={460} height={540} priority fetchPriority="high" sizes="(max-width: 767px) 240px, 340px" /></div>
            <div className="portrait-sticker" aria-hidden="true"><PortfolioIcon name={IconName.Code} /><span>From Cairo,<br />with care.</span></div>
            <div className="portrait-caption"><span>{profile.name}</span><span className="portrait-signature" aria-hidden="true">Ahmed.</span></div>
          </div>
          <figcaption>{HERO.note}</figcaption>
        </figure>
      </div>
      <div className="hero-bottom">
        <span className="eyebrow hero-bottom-label">A few of my everyday tools</span>
        <ul className="specialties" aria-label="Specialties">{HERO.specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}</ul>
        <a className="hero-scroll" href="#work" aria-label="Scroll to selected work"><PortfolioIcon name={IconName.ArrowDown} /></a>
      </div>
    </section>
  );
}
