import { execFile } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const projectDirectory = fileURLToPath(new URL("../", import.meta.url));
const reportDirectory = path.join(projectDirectory, "artifacts", "lighthouse");
const baseURL = process.env.QA_BASE_URL ?? "http://127.0.0.1:3100";
const minimumScore = Number(process.env.LIGHTHOUSE_MIN_SCORE ?? "0");
const chromeCandidates = [
  process.env.CHROME_PATH ?? "",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
];
const chromePath = chromeCandidates.find((candidate) => candidate && existsSync(candidate));
const environment = { ...process.env };
if (chromePath) environment.CHROME_PATH = chromePath;

try {
  const response = await fetch(baseURL);
  if (!response.ok) throw new Error(`The portfolio returned HTTP ${response.status}.`);
} catch (error) {
  process.stderr.write(`Start a production server before auditing: npm run start -- --port 3100\n${error.message}\n`);
  process.exitCode = 1;
}

if (!process.exitCode) {
  await mkdir(reportDirectory, { recursive: true });
  const results = [];

  for (const mode of ["mobile", "desktop"]) {
    const reportPath = path.join(reportDirectory, mode);
    const argumentsList = [
      path.join(projectDirectory, "node_modules", "lighthouse", "cli", "index.js"),
      baseURL,
      "--quiet",
      "--chrome-flags=--headless=new",
      "--only-categories=performance,accessibility,best-practices,seo",
      "--output=html",
      "--output=json",
      `--output-path=${reportPath}`,
    ];
    if (mode === "desktop") argumentsList.push("--preset=desktop");

    process.stdout.write(`Auditing ${mode}: ${baseURL}\n`);
    try {
      const auditStarted = Date.now();
      let cleanupWarning = "";
      try {
        await execFileAsync(process.execPath, argumentsList, {
          cwd: projectDirectory,
          env: environment,
          maxBuffer: 10 * 1024 * 1024,
          timeout: 180_000,
        });
      } catch (error) {
        const detail = String(error.stderr ?? error.message);
        if (!detail.includes("EPERM") || !detail.includes("Launcher.destroyTmp")) throw error;
        cleanupWarning = "Chrome finished the audit but Windows prevented temporary profile cleanup.";
      }
      const report = JSON.parse(await readFile(`${reportPath}.report.json`, "utf8"));
      if (report.runtimeError || Date.parse(report.fetchTime) < auditStarted) {
        throw new Error(report.runtimeError?.message || "Lighthouse did not produce a fresh completed report.");
      }
      if (cleanupWarning) process.stdout.write(`${cleanupWarning}\n`);
      const scores = Object.fromEntries(
        Object.values(report.categories).map((category) => [category.title, Math.round(category.score * 100)])
      );
      const failedAudits = Object.values(report.audits)
        .filter((audit) => audit.score !== null && audit.score < 1 && audit.scoreDisplayMode !== "informative")
        .map((audit) => ({ id: audit.id, title: audit.title, value: audit.displayValue ?? "", score: audit.score }));
      results.push({ mode, url: report.finalDisplayedUrl, scores, failedAudits, warnings: cleanupWarning ? [cleanupWarning] : [] });
      process.stdout.write(`${JSON.stringify(scores, null, 2)}\nReport: ${reportPath}.report.html\n`);
      if (Object.values(scores).some((score) => score < minimumScore)) process.exitCode = 1;
    } catch (error) {
      process.stderr.write(`Lighthouse ${mode} failed: ${error.stderr || error.message}\n`);
      process.exitCode = 1;
    }
  }

  await writeFile(path.join(reportDirectory, "summary.json"), `${JSON.stringify(results, null, 2)}\n`);
}
