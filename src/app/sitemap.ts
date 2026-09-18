import type { MetadataRoute } from "next";
import { readResource } from "@/lib/data";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return [];
  const projects = await readResource("projects");
  return [
    { url: new URL("/", siteUrl).toString(), changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({ url: new URL(`/projects/${project.id}`, siteUrl).toString(), priority: 0.8 })),
  ];
}
