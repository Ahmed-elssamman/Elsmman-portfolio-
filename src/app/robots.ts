import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const result: MetadataRoute.Robots = {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
  };
  const siteUrl = getSiteUrl();
  if (siteUrl) result.sitemap = new URL("/sitemap.xml", siteUrl).toString();
  return result;
}
