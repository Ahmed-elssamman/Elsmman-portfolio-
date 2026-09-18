import { loadAll } from "@/lib/data";
import { getPersonSchema } from "@/lib/person-schema";
import { AboutSection } from "@/features/portfolio/about-section";
import { ContactSection } from "@/features/portfolio/contact-section";
import { ExperienceSection } from "@/features/portfolio/experience-section";
import { HeroSection } from "@/features/portfolio/hero-section";
import { SiteHeader } from "@/features/portfolio/site-header";
import { WorkSection } from "@/features/portfolio/work-section";

export const revalidate = 60;

export default async function Home() {
  const data = await loadAll();
  const personSchema = getPersonSchema(data.profile);

  return (
    <div className="portfolio" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader links={data.nav} />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: personSchema }} />
        <HeroSection profile={data.profile} />
        <WorkSection projects={data.projects} github={data.profile.links.github} />
        <AboutSection profile={data.profile} />
        <ExperienceSection experience={data.experience} education={data.education} certifications={data.certifications} resume={data.profile.links.resume} />
        <ContactSection profile={data.profile} />
      </main>
    </div>
  );
}
