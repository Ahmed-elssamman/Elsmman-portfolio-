import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("portfolio is readable, stable, and has working local destinations", async ({ page, request }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") pageErrors.push(message.text()); });

  await page.goto("/");
  await expect(page.locator("main#main-content")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);

  for (const section of ["work", "about", "experience", "contact"]) {
    await expect(page.locator(`#${section}`)).toBeAttached();
  }

  const projectLinks = page.locator('main a[href^="/projects/"]');
  expect(await projectLinks.count()).toBeGreaterThan(0);
  const projectPaths = await projectLinks.evaluateAll((links) =>
    [...new Set(links.map((link) => link.getAttribute("href") ?? ""))]
  );

  for (const path of projectPaths) {
    const response = await request.get(path);
    expect(response.ok(), `Project page ${path} should load`).toBeTruthy();
    const html = await response.text();
    expect(html).toContain("<h1");
  }

  const resumeResponse = await request.get("/ahmed-elsamman-cv.pdf");
  expect(resumeResponse.ok()).toBeTruthy();
  expect(resumeResponse.headers()["content-type"]).toContain("application/pdf");
  expect((await resumeResponse.body()).subarray(0, 4).toString()).toBe("%PDF");

  const externalLinks = await page.locator('a[target="_blank"]').evaluateAll((links) =>
    links.map((link) => ({
      href: link.getAttribute("href") ?? "",
      rel: link.getAttribute("rel") ?? "",
    }))
  );
  for (const link of externalLinks) {
    expect(link.href).toMatch(/^https:\/\//);
    expect(link.rel).toMatch(/noopener|noreferrer/);
  }

  await page.screenshot({ path: `artifacts/screenshots/home-${test.info().project.name}.png`, fullPage: true });
  expect(pageErrors).toEqual([]);
});

test("layout fits narrow phones, tablets, and desktops", async ({ page }) => {
  await page.goto("/");
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    expect(dimensions.document, `Document overflows at ${width}px`).toBeLessThanOrEqual(dimensions.viewport + 1);
    expect(dimensions.body, `Body overflows at ${width}px`).toBeLessThanOrEqual(dimensions.viewport + 1);
  }
});

test("light and dark themes pass automated accessibility checks", async ({ page }) => {
  await page.goto("/");
  for (const theme of ["light", "dark"]) {
    const switchTheme = page.getByRole("button", { name: `Switch to ${theme} theme`, exact: true });
    if (await switchTheme.isVisible()) await switchTheme.click();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  }
});

test("mobile navigation works with the keyboard and restores focus", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menuButton = page.getByRole("button", { name: "Open navigation", exact: true });
  await menuButton.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Close navigation", exact: true })).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#mobile-navigation")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menuButton).toBeFocused();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");

  await menuButton.press("Enter");
  await page.locator('#mobile-navigation a[href="#work"]').click();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#work$/);
});

test("case studies expose meaningful content and return navigation", async ({ page }) => {
  await page.goto("/");
  const projectLink = page.locator('main a[href^="/projects/"]').first();
  await projectLink.click();
  await expect(page).toHaveURL(/\/projects\//);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("main")).toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  await expect(page.locator('a[href="/"]').first()).toBeVisible();
});

test("essential content is available without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator("#work")).toBeVisible();
    await expect(page.locator('main a[href^="/projects/"]').first()).toBeVisible();
    await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
    expect(await page.locator("main").innerText()).toContain("Ahmed");
  } finally {
    await context.close();
  }
});
