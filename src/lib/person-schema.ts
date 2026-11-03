import "server-only";
import type { Profile } from "./data-schemas";
import { getSiteUrl } from "./site-url";

interface PersonSchema {
  "@context": string;
  "@type": string;
  name: string;
  jobTitle: string;
  description: string;
  sameAs: string[];
  knowsAbout: string[];
  url?: string;
}

export function getPersonSchema(profile: Profile): string {
  const schema: PersonSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    description: profile.shortBio,
    sameAs: [profile.links.github, profile.links.linkedin].filter(Boolean),
    knowsAbout: [
      "Frontend engineering",
      "Angular",
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Nx",
      "Server-side rendering",
      "Angular Signals",
      "RxJS",
      "REST API integration",
      "Real-time web applications",
      "Responsive web design",
      "Web accessibility",
      "Arabic and English localization",
      "Right-to-left user interfaces",
    ],
  };
  const siteUrl = getSiteUrl();
  if (siteUrl) schema.url = siteUrl;
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
