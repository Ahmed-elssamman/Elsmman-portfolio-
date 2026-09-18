# Portfolio quality checks

Run audits against a production build. Development mode includes tooling and compilation overhead that distorts performance results.

```sh
npm ci
npm run lint
npm run type-check
npm run build
npm run test:browser
```

The browser suite starts the production server on port 3100 and uses installed Google Chrome. Set `PLAYWRIGHT_CHANNEL=msedge` to use Microsoft Edge. On a machine without either browser, run `npx playwright install chrome` once. Browser installation is a separate machine setup step.

Checks cover 320, 375, 768, and 1440 pixel widths; keyboard navigation; accessible light and dark themes; case-study destinations; downloadable PDF; browser exceptions; and essential content with JavaScript disabled. Accessibility checks use axe's WCAG 2.0 and 2.1 A/AA rules. Automated tests supplement a manual review with a keyboard, screen reader, and real mobile device.

Screenshots, failure traces, and the HTML test report are written to `artifacts/`. Open the browser report with `npm run test:browser:report`.

## Google Lighthouse

Start a production server in one terminal:

```sh
npm run start -- --port 3100
```

In another terminal:

```sh
npm run audit:lighthouse
```

This runs Lighthouse with its standard mobile profile and desktop preset, saving HTML, JSON, and a score summary under `artifacts/lighthouse/`. Set `QA_BASE_URL` to audit a deployed URL, `CHROME_PATH` to select a browser executable, or `LIGHTHOUSE_MIN_SCORE=100` to fail the command when any category scores below 100. Environment variable syntax depends on the shell; in PowerShell, for example, use `$env:QA_BASE_URL = 'https://your-domain.example'`.

Scores depend on hardware, browser version, network conditions, hosting, and third-party services. A local result does not guarantee the same PageSpeed Insights result after deployment. Re-run on the final HTTPS domain, check both mobile and desktop, and use Search Console to monitor real-user Core Web Vitals when sufficient traffic is available.
