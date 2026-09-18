import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { readResource } from "@/lib/data";
import { getSiteUrl } from "@/lib/site-url";
import { THEME_BOOTSTRAP } from "@/features/portfolio/portfolio.control";
import "./globals.css";
import "@/features/portfolio/portfolio.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await readResource("profile");
  const siteUrl = getSiteUrl();
  const title = `${profile.name} — Frontend Engineer`;
  const description = "Frontend engineer in Cairo building thoughtful Angular and React applications. Explore Ahmed ElSamman's selected projects, experience, and approach to accessible web interfaces.";
  const metadata: Metadata = {
    title: { default: title, template: `%s | ${profile.name}` },
    description,
    applicationName: "Ahmed ElSamman Portfolio",
    authors: [{ name: profile.name }],
    keywords: ["Ahmed ElSamman", "Frontend Engineer", "Angular Developer", "React", "TypeScript", "Cairo"],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      siteName: profile.name,
      images: [{ url: "/images/og-portfolio.png", width: 1200, height: 630, alt: "Ahmed ElSamman — Frontend Engineer. Good interfaces. Great care." }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/images/og-portfolio.png"] },
    robots: { index: true, follow: true },
    icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
  };
  if (siteUrl) {
    metadata.metadataBase = new URL(siteUrl);
    metadata.alternates = { canonical: "/" };
  }
  return metadata;
}

export const viewport: Viewport = {
  themeColor: "#f7f7f0",
  width: "device-width",
  initialScale: 1,
};

interface RootLayoutProps { children: React.ReactNode; }

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} /></head>
      <body>{children}</body>
    </html>
  );
}
