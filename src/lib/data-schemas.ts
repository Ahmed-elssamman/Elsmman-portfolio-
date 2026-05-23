import { z } from "zod";

export const KV = z.object({ k: z.string(), v: z.string() });
export const Metric = z.object({ label: z.string(), value: z.string() });

export const ProfileSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  tagline: z.string().min(1),
  location: z.string().min(1),
  status: z.string().min(1),
  shortBio: z.string().min(1),
  identityNarrative: z
    .array(z.object({ heading: z.string(), body: z.string() }))
    .default([]),
  achievements: z.array(z.string()).default([]),
  links: z.object({
    github: z.string().url().or(z.literal("")),
    linkedin: z.string().url().or(z.literal("")),
    email: z.string().min(1),
    phone: z.string().optional().default(""),
    resume: z.string().optional().default(""),
  }),
  telemetry: z.array(KV).default([]),
  languages: z
    .array(z.object({ name: z.string(), level: z.string() }))
    .default([]),
});

export const ExperienceItemSchema = z.object({
  id: z.string().min(1),
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().default(""),
  type: z.string().default(""),
  start: z.string().min(1),
  end: z.string().min(1),
  summary: z.string().default(""),
  bullets: z.array(z.string()).default([]),
  stack: z.array(z.string()).default([]),
});
export const ExperienceSchema = z.array(ExperienceItemSchema);

export const ProjectSchema = z.object({
  id: z.string().min(1),
  index: z.string().min(1),
  name: z.string().min(1),
  category: z.string().default(""),
  summary: z.string().default(""),
  description: z.string().default(""),
  metrics: z.array(Metric).default([]),
  stack: z.array(z.string()).default([]),
  architecture: z.array(z.string()).default([]),
  capsuleHue: z.number().min(0).max(360).default(210),
  highlights: z.array(z.string()).default([]),
  links: z
    .array(z.object({ label: z.string(), href: z.string() }))
    .default([]),
});
export const ProjectsSchema = z.array(ProjectSchema);

export const EcosystemNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  weight: z.number().min(0).max(1),
});
export const EcosystemClusterSchema = z.object({
  id: z.string(),
  name: z.string(),
  hue: z.number(),
  summary: z.string().default(""),
  nodes: z.array(EcosystemNodeSchema).default([]),
});
export const EcosystemSchema = z.array(EcosystemClusterSchema);

export const EducationItemSchema = z.object({
  id: z.string(),
  degree: z.string(),
  institution: z.string(),
  location: z.string().default(""),
  start: z.string(),
  end: z.string(),
});
export const EducationSchema = z.array(EducationItemSchema);

export const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  year: z.string(),
});
export const CertificationsSchema = z.array(CertificationSchema);

export const ArchNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  sub: z.string().default(""),
  col: z.number().int().min(0),
  row: z.number().int().min(0),
});
export const ArchFlowSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
});
export const ArchitectureSchema = z.object({
  nodes: z.array(ArchNodeSchema),
  flows: z.array(ArchFlowSchema),
});

export const TerminalLineSchema = z.object({
  cmd: z.string(),
  out: z.string(),
});
export const TerminalSchema = z.object({
  prompt: z.string(),
  cwd: z.string(),
  lines: z.array(TerminalLineSchema),
});

export const NavLinkSchema = z.object({ id: z.string(), label: z.string() });
export const NavSchema = z.array(NavLinkSchema);

export const RESOURCES = {
  profile: ProfileSchema,
  experience: ExperienceSchema,
  projects: ProjectsSchema,
  ecosystem: EcosystemSchema,
  education: EducationSchema,
  certifications: CertificationsSchema,
  architecture: ArchitectureSchema,
  terminal: TerminalSchema,
  nav: NavSchema,
} as const;

export type ResourceName = keyof typeof RESOURCES;
export const RESOURCE_NAMES = Object.keys(RESOURCES) as ResourceName[];

export type Profile = z.infer<typeof ProfileSchema>;
export type ExperienceItem = z.infer<typeof ExperienceItemSchema>;
export type Experience = z.infer<typeof ExperienceSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type Projects = z.infer<typeof ProjectsSchema>;
export type EcosystemNode = z.infer<typeof EcosystemNodeSchema>;
export type EcosystemCluster = z.infer<typeof EcosystemClusterSchema>;
export type Ecosystem = z.infer<typeof EcosystemSchema>;
export type EducationItem = z.infer<typeof EducationItemSchema>;
export type Education = z.infer<typeof EducationSchema>;
export type Certification = z.infer<typeof CertificationSchema>;
export type Certifications = z.infer<typeof CertificationsSchema>;
export type ArchNode = z.infer<typeof ArchNodeSchema>;
export type ArchFlow = z.infer<typeof ArchFlowSchema>;
export type Architecture = z.infer<typeof ArchitectureSchema>;
export type TerminalSession = z.infer<typeof TerminalSchema>;
export type NavLink = z.infer<typeof NavLinkSchema>;
export type Nav = z.infer<typeof NavSchema>;

export type SiteData = {
  profile: Profile;
  experience: Experience;
  projects: Projects;
  ecosystem: Ecosystem;
  education: Education;
  certifications: Certifications;
  architecture: Architecture;
  terminal: TerminalSession;
  nav: Nav;
};
