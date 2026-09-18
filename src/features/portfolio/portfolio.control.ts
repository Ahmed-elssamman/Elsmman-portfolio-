import { IconName } from "./portfolio.enum";
import type { Expertise, NavigationItem } from "./portfolio.model";

export const NAVIGATION: NavigationItem[] = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export const HERO = {
  introduction: "Hi, I’m Ahmed. A frontend engineer.",
  headline: "Good interfaces.",
  headlineAccent: "Great care.",
  description: "I turn complex requirements into clear, responsive web experiences. Specializing in Angular, with a soft spot for the details that make a product feel right.",
  note: "A little structure. A lot of attention to detail.",
  specialties: ["Angular & TypeScript", "React & Next.js", "Accessible interfaces", "Arabic & English"],
};

export const EXPERTISE: Expertise[] = [
  {
    number: "01",
    title: "Interfaces with intent",
    description: "Responsive layouts, accessible interactions, and Arabic / English experiences that feel considered on every screen.",
    tools: ["Angular", "React", "TypeScript", "Tailwind CSS"],
  },
  {
    number: "02",
    title: "Room to grow",
    description: "Reusable components and clear feature boundaries. A foundation that makes the next change easier for the whole team.",
    tools: ["Nx", "Signals", "RxJS", "PrimeNG"],
  },
  {
    number: "03",
    title: "The whole experience",
    description: "API integration, real-time updates, and careful loading states. Because the work goes beyond the first screen.",
    tools: ["REST APIs", "SignalR", "SSR", "Git"],
  },
];

export const ICON_PATHS: Record<IconName, string[]> = {
  [IconName.ArrowUpRight]: ["M7 17 17 7M7 7h10v10"],
  [IconName.ArrowRight]: ["M4 12h16m-6-6 6 6-6 6"],
  [IconName.ArrowLeft]: ["M20 12H4m6-6-6 6 6 6"],
  [IconName.ArrowDown]: ["M12 4v16m-6-6 6 6 6-6"],
  [IconName.Download]: ["M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4"],
  [IconName.Copy]: ["M9 9h11v11H9zM15 9V4H4v11h5"],
  [IconName.Check]: ["m5 12 4 4L19 6"],
  [IconName.Sun]: ["M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"],
  [IconName.Moon]: ["M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z"],
  [IconName.Menu]: ["M4 8h16M4 16h16"],
  [IconName.Close]: ["m6 6 12 12M6 18 18 6"],
  [IconName.Github]: ["M9 19c-4 1-4-2-6-2m12 5v-3.5c0-1 .1-1.4-.5-2 3-.3 6-1.5 6-6A4.7 4.7 0 0 0 19 7c.2-1 .2-2-.1-3 0 0-1-.3-3.4 1.3a12 12 0 0 0-7 0C6 3.7 5 4 5 4c-.3 1-.3 2-.1 3A4.7 4.7 0 0 0 3.5 10.5c0 4.5 3 5.7 6 6-.6.6-.6 1.2-.5 2V22"],
  [IconName.Linkedin]: ["M5 9v11M5 4v.1M10 20V9h4v2c2-4 6-2 6 1v8M14 12v8"],
  [IconName.Code]: ["m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16"],
  [IconName.Globe]: ["M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z"],
};

export const THEME_STORAGE_KEY = "ahmed-portfolio-theme";

export const THEME_BOOTSTRAP = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;
