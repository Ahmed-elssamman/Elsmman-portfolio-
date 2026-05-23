# Ahmed ElSamman — Portfolio

Cinematic, immersive portfolio for a Mid Frontend Developer.
Built as a futuristic engineering control center, not a marketing page.
All public content is editable through a private admin panel — no code changes needed.

## Tech

- **Next.js 14** App Router · **React 18** · **TypeScript**
- **TailwindCSS** for the design system
- **React Three Fiber + drei + postprocessing** for the 3D hero
- **Framer Motion** for motion
- **Zustand** for global experience state
- **Lenis** for smooth scroll
- **Zod** for runtime data validation

## Run

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

> **First-time setup:** Edit `.env.local` and set a strong `ADMIN_PASSWORD`. The file already has a random `ADMIN_SECRET`; replace it with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` if you want.

## Editing your content

There are two ways to update the public site:

### Option 1 — Admin editor (recommended)

1. Open <http://localhost:3000/admin/27348>
2. Enter the password from `.env.local`
3. Use the tabs to edit Profile, Experience, Projects, Skills, Education, Certifications, Architecture, Terminal, Navigation
4. Click **Save changes** in each tab; the public site updates immediately

The admin editor writes JSON files in `/data/`. Each save makes a timestamped backup in `data/.backup/` so nothing is ever lost.

### Option 2 — Edit JSON directly

Open any file in `/data/` and edit it. The schema is enforced by Zod on every read/write (see [src/lib/data-schemas.ts](src/lib/data-schemas.ts)).

## Routing

This is a single-page experience plus a hidden admin area.

| Route | What it does |
| --- | --- |
| `/` | Public portfolio. All sections (Hero, Identity, Experience, Projects, Architecture, Ecosystem, Education, Terminal, Contact) on one page. Nav scrolls to in-page anchors (`#hero`, `#identity`, …) with IntersectionObserver tracking the active one. |
| `/admin/27348` | Admin editor. Protected by middleware ([src/middleware.ts](src/middleware.ts)); redirects to login if no valid session cookie. |
| `/admin/27348/login` | Password form. POSTs to `/api/admin/login`. |
| `/api/admin/login` | Validates the password and sets an HttpOnly HMAC-signed cookie (12h). |
| `/api/admin/logout` | Clears the session cookie. |
| `/api/admin/[resource]` | `GET` reads, `PUT` writes the JSON file. Resources: `profile`, `experience`, `projects`, `ecosystem`, `education`, `certifications`, `architecture`, `terminal`, `nav`. Gated by middleware. |

Anything not under `/admin/*` or `/api/admin/*` is public.

## Project structure

```
data/                     # ← all editable content (JSON)
  profile.json
  experience.json
  projects.json
  ecosystem.json
  education.json
  certifications.json
  architecture.json
  terminal.json
  nav.json

src/
  app/
    page.tsx              # server component, reads /data and passes to sections
    layout.tsx
    globals.css
    admin/27348/          # admin shell + login + tabs
    api/admin/             # login, logout, [resource] CRUD
  components/
    system/               # Lenis, pointer, reduced-motion providers
    ui/                   # Nav, SectionShell
  features/loader/        # Cinematic intro loader
  scenes/hero/            # The deep 3D hero (Canvas, particles, panels, grid)
  sections/               # Hero, Identity, Experience, Projects, Architecture,
                          # Ecosystem, Education, Terminal, Contact
  lib/
    data.ts               # server-only JSON loader (Zod-validated)
    data-schemas.ts       # Zod schemas + types for every resource
    admin-auth.ts         # password check + HMAC session helpers
  middleware.ts           # gates /admin/* and /api/admin/*
  stores/                 # Zustand stores
  hooks/                  # useLenis, usePointer, useReducedMotion
```

## Scripts

```
npm run dev          # dev server (http://localhost:3000)
npm run build        # production build
npm start            # serve production build
npm run lint         # ESLint
npm run type-check   # tsc --noEmit
```

## Performance

- The 3D hero is lazy-loaded client-side only (`ssr: false`).
- All public content is loaded server-side from JSON — no client fetch waterfalls.
- Reduced-motion preference is respected: the loader shortens, particle motion calms.
- Fonts (Inter + JetBrains Mono) are loaded with `display: swap`.

## Deployment notes

- **Local / VPS / self-hosted Node** — admin edits persist in `/data/*.json` on disk. Works out of the box.
- **Vercel / Netlify (serverless)** — the file-system is read-only at runtime, so admin saves will fail. The public site still renders fine because content is bundled at build time. To enable runtime edits on those hosts, swap the file writer in [src/lib/data.ts](src/lib/data.ts) for a DB (Vercel KV, Supabase, Postgres, etc.).

## Customizing the admin URL

The hidden route is `/admin/27348`. To change it, rename the directory at [src/app/admin/27348/](src/app/admin/27348) and update the matching `ADMIN_ROOT` constant in [src/middleware.ts](src/middleware.ts) plus the `matcher` config.
