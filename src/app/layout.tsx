import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ExperienceProviders } from "@/components/system/ExperienceProviders";
import { readResource } from "@/lib/data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetBrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const profile = await readResource("profile");
    const title = `${profile.name} — ${profile.role}`;
    return {
      title,
      description: profile.tagline,
      metadataBase: new URL("https://ahmedelsamman.dev"),
      openGraph: {
        title,
        description: profile.tagline,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Portfolio",
      description: "",
    };
  }
}

export const viewport: Viewport = {
  themeColor: "#05060A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetBrains.variable}`}>
      <body className="bg-bg text-ink antialiased overflow-x-hidden">
        <ExperienceProviders>{children}</ExperienceProviders>
      </body>
    </html>
  );
}
