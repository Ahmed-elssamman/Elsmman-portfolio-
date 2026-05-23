import "server-only";
import { promises as fs } from "fs";
import path from "path";
import {
  RESOURCES,
  type ResourceName,
  type SiteData,
} from "./data-schemas";

const DATA_DIR = path.join(process.cwd(), "data");
const BACKUP_DIR = path.join(DATA_DIR, ".backup");

function fileFor(name: ResourceName) {
  return path.join(DATA_DIR, `${name}.json`);
}

export async function readResource<K extends ResourceName>(
  name: K
): Promise<SiteData[K]> {
  const raw = await fs.readFile(fileFor(name), "utf-8");
  const json = JSON.parse(raw);
  const schema = RESOURCES[name];
  return schema.parse(json) as SiteData[K];
}

export async function writeResource<K extends ResourceName>(
  name: K,
  value: unknown
): Promise<SiteData[K]> {
  const schema = RESOURCES[name];
  const parsed = schema.parse(value) as SiteData[K];

  const target = fileFor(name);
  const tmp = `${target}.tmp`;
  const serialized = JSON.stringify(parsed, null, 2) + "\n";

  await fs.mkdir(BACKUP_DIR, { recursive: true });
  try {
    const existing = await fs.readFile(target, "utf-8");
    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    await fs.writeFile(
      path.join(BACKUP_DIR, `${name}.${ts}.json`),
      existing,
      "utf-8"
    );
  } catch {
    /* no existing file, ignore */
  }

  await fs.writeFile(tmp, serialized, "utf-8");
  await fs.rename(tmp, target);

  return parsed;
}

export async function loadAll(): Promise<SiteData> {
  const [
    profile,
    experience,
    projects,
    ecosystem,
    education,
    certifications,
    architecture,
    terminal,
    nav,
  ] = await Promise.all([
    readResource("profile"),
    readResource("experience"),
    readResource("projects"),
    readResource("ecosystem"),
    readResource("education"),
    readResource("certifications"),
    readResource("architecture"),
    readResource("terminal"),
    readResource("nav"),
  ]);

  return {
    profile,
    experience,
    projects,
    ecosystem,
    education,
    certifications,
    architecture,
    terminal,
    nav,
  };
}

export type { SiteData } from "./data-schemas";
