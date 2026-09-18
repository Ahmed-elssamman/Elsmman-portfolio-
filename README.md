# Ahmed ElSamman — Portfolio

A responsive frontend engineering portfolio built with Next.js 15, React 18, TypeScript, and Tailwind CSS. The public site includes selected projects, individual project pages, experience, education, contact links, a downloadable CV, and light/dark themes.

## Run locally

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Copy `.env.local.example` to `.env.local` if needed, then set `ADMIN_PASSWORD` and a long random `ADMIN_SECRET`. Keep that file private.

## Edit jobs and projects

Open http://localhost:3000/admin/27348 and sign in with your configured password.

- **Experience:** add a role, fill the company/title/dates, add responsibilities and technologies, then save.
- **Projects:** add a project, fill its summary and story, upload a screenshot, add HTTPS links and technologies, then save.
- Use the arrow controls to reorder entries. The first project is featured on the homepage.
- Project and experience drafts survive switching between editor tabs. Leaving the page with unsaved changes prompts a browser warning.

Saves update `data/*.json`, create backups in `data/.backup/`, and refresh public page caches. Screenshots are converted to WebP and saved in `public/images/projects/`. New projects receive their own page automatically.

See [the editing guide](docs/editing-content.md) for details.

## Project structure

```text
data/                         Editable content
public/                       CV, icons, portrait, project captures
src/features/portfolio/       Public sections, typed models, controls, CSS
src/app/projects/[slug]/       Project pages
src/app/admin/27348/           Private content editor
src/app/api/admin/             Authentication, content saves, image uploads
src/app/images/projects/      Serving newly uploaded images
src/lib/                      Content schemas, loading, authentication, metadata
tests/browser/                Production browser and accessibility checks
scripts/lighthouse-audit.mjs   Mobile and desktop Lighthouse reports
notes/                        CV and project source notes
```

## Verification

```sh
npm run lint
npm run type-check
npm run build
npm run test:browser
npm audit
```

Run Lighthouse against a production server:

```sh
npm run start -- --hostname 127.0.0.1 --port 3100
npm run audit:lighthouse
```

Browser checks use installed Google Chrome. Reports and screenshots are saved under `artifacts/`. See [quality checks](docs/quality-checks.md) for configuration and measured results.

## Hosting

A purchased domain is optional. On Vercel, metadata uses the hosting address automatically. For other hosts, set `NEXT_PUBLIC_SITE_URL` to the final HTTPS address.

The file-backed editor requires a persistent, writable Node.js host. On Vercel or other read-only/serverless hosts, use the editor locally and redeploy the updated `data/` and `public/` folders. Online editing on those platforms requires persistent storage such as a database and image storage.

Performance scores are measurements from a particular environment. Re-run Lighthouse on the deployed HTTPS address.
