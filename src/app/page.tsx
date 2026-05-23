import { IntroLoader } from "@/features/loader/IntroLoader";
import { Nav } from "@/components/ui/Nav";
import { HeroSection } from "@/sections/HeroSection";
import { IdentitySection } from "@/sections/IdentitySection";
import { ExperienceSection } from "@/sections/ExperienceSection";
import { ProjectsSection } from "@/sections/ProjectsSection";
import { ArchitectureSection } from "@/sections/ArchitectureSection";
import { EcosystemSection } from "@/sections/EcosystemSection";
import { EducationSection } from "@/sections/EducationSection";
import { TerminalSection } from "@/sections/TerminalSection";
import { ContactSection } from "@/sections/ContactSection";
import { loadAll } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await loadAll();

  return (
    <>
      <IntroLoader name={data.profile.name} role={data.profile.role} />
      <Nav links={data.nav} />
      <main className="relative">
        <HeroSection profile={data.profile} />
        <IdentitySection profile={data.profile} />
        <ExperienceSection data={data.experience} />
        <ProjectsSection data={data.projects} />
        <ArchitectureSection data={data.architecture} />
        <EcosystemSection data={data.ecosystem} />
        <EducationSection
          education={data.education}
          certifications={data.certifications}
        />
        <TerminalSection data={data.terminal} />
        <ContactSection profile={data.profile} />
      </main>
    </>
  );
}
