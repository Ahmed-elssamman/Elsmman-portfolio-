import type { Profile } from "@/lib/data-schemas";
import { CopyEmail } from "./copy-email";
import { IconName } from "./portfolio.enum";
import { PortfolioIcon } from "./portfolio-icon";

interface ContactSectionProps { profile: Profile; }

export function ContactSection({ profile }: ContactSectionProps) {
  const emailHref = `mailto:${profile.links.email}`;
  const year = new Date().getFullYear();
  return (
    <>
      <section id="contact" className="contact-section section-space" aria-labelledby="contact-title">
        <div className="page-width"><div className="contact-topline"><p className="eyebrow">04 / Make something worthwhile</p><p className="eyebrow"><span className="status-dot" />{profile.status}</p></div><div className="contact-main"><div><h2 id="contact-title">Have something<br />in <span className="serif-accent">mind?</span></h2><p>A product to build, a team to join, or just a good conversation.<br className="desktop-break" /> I’d like to hear from you.</p></div><a className="contact-circle" href={emailHref} aria-label={`Email ${profile.name}`}><PortfolioIcon name={IconName.ArrowUpRight} /></a></div><div className="contact-bottom"><div className="contact-email-group"><a className="contact-email" href={emailHref}>{profile.links.email}</a><CopyEmail email={profile.links.email} /></div><div className="contact-socials"><a className="text-link" href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub <PortfolioIcon name={IconName.ArrowUpRight} /><span className="sr-only"> (opens in a new tab)</span></a>{profile.links.linkedin && <a className="text-link" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <PortfolioIcon name={IconName.ArrowUpRight} /><span className="sr-only"> (opens in a new tab)</span></a>}<a className="text-link" href={profile.links.resume} download>Résumé <PortfolioIcon name={IconName.Download} /></a></div></div></div>
      </section>
      <footer className="site-footer page-width"><a className="footer-name" href="/#top">Ahmed ElSamman<span aria-hidden="true">✳</span></a><p>Made with care, in Cairo. © {year}</p><a className="text-link" href="#top">Back to top <span className="back-to-top-icon"><PortfolioIcon name={IconName.ArrowRight} /></span></a></footer>
    </>
  );
}
