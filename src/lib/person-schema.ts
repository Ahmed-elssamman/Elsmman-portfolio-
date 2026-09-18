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
  };
  const siteUrl = getSiteUrl();
  if (siteUrl) schema.url = siteUrl;
  return JSON.stringify(schema).replace(/</g, "\\u003c");
}
