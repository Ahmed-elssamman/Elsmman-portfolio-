import { readFileSync } from "node:fs";
import type { Projects, Experience } from "../../src/lib/data-schemas";
import { loadEnvConfig } from "@next/env";
import { expect, test, type APIRequestContext } from "@playwright/test";
import { unlink } from "node:fs/promises";
import path from "node:path";

loadEnvConfig(process.cwd());

// APIRequestContext does not send Secure cookies over local HTTP; browser requests do.
// Forward the test session explicitly for API assertions, keeping production cookies secure.
async function authenticatedHeaders(
  request: APIRequestContext,
): Promise<Record<string, string>> {
  const state = await request.storageState();
  return {
    cookie: state.cookies
      .map((cookie) => cookie.name + "=" + cookie.value)
      .join("; "),
  };
}

interface ImageUploadResponse {
  ok: boolean;
  image: string;
}

const imageBuffer = readFileSync(path.join(process.cwd(), "public", "apple-icon.png"));

// Authentication must not be included in traces, screenshots, or saved browser state.
test.use({ trace: "off", screenshot: "off" });

test("the editor, content API, and image uploads require authentication", async ({
  page,
  request,
}) => {
  await page.goto("/admin/27348");
  await expect(page).toHaveURL(/\/admin\/27348\/login/);
  await expect(page.locator('input[type="password"]')).toBeVisible();

  const contentResponse = await request.get("/api/admin/projects");
  expect(contentResponse.status()).toBe(401);
  const uploadResponse = await request.post("/api/admin/uploads", {
    multipart: {
      file: {
        name: "qa-check.png",
        mimeType: "image/png",
        buffer: imageBuffer,
      },
    },
  });
  expect(uploadResponse.status()).toBe(401);
});

test("configured credentials open the editor and its saved content", async ({
  page,
}) => {
  const password = process.env.ADMIN_PASSWORD ?? "";
  test.skip(
    !password,
    "ADMIN_PASSWORD is required for the authenticated admin check.",
  );

  const loginResponse = await page.request.post("/api/admin/login", {
    data: { password },
  });
  expect(
    loginResponse.status(),
    "Configured admin credentials should authenticate",
  ).toBe(200);
  const headers = await authenticatedHeaders(page.request);
  await page.goto("/admin/27348");
  await expect(
    page.getByRole("heading", { name: "Portfolio editor", exact: true }),
  ).toBeVisible();

  for (const resource of ["profile", "experience", "projects"]) {
    const response = await page.request.get(`/api/admin/${resource}`, {
      headers,
    });
    expect(
      response.status(),
      `${resource} should be readable after login`,
    ).toBe(200);
  }

  await page
    .locator("nav")
    .getByRole("button", { name: "Projects", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: /add.*project/i }),
  ).toBeVisible();
  await page
    .locator("nav")
    .getByRole("button", { name: /^(Experience|Work experience|Jobs)$/i })
    .click();
  await expect(
    page.getByRole("button", { name: /add/i }).first(),
  ).toBeVisible();

  await page.request.post("/api/admin/logout");
  const protectedResponse = await page.request.get("/api/admin/projects");
  expect(protectedResponse.status()).toBe(401);
});

test("image upload validates input and produces a normalized WebP", async ({
  request,
}) => {
  const password = process.env.ADMIN_PASSWORD ?? "";
  test.skip(
    !password,
    "ADMIN_PASSWORD is required for the image upload check.",
  );
  const loginResponse = await request.post("/api/admin/login", {
    data: { password },
  });
  expect(loginResponse.status()).toBe(200);
  const headers = await authenticatedHeaders(request);

  const invalidResponse = await request.post("/api/admin/uploads", {
    headers,
    multipart: {
      file: {
        name: "invalid.png",
        mimeType: "image/png",
        buffer: Buffer.from("not an image"),
      },
    },
  });
  expect(invalidResponse.status()).toBeGreaterThanOrEqual(400);
  expect(invalidResponse.status()).toBeLessThan(500);

  const oversizedResponse = await request.post("/api/admin/uploads", {
    headers,
    multipart: {
      file: {
        name: "oversized.png",
        mimeType: "image/png",
        buffer: Buffer.alloc(5 * 1024 * 1024 + 1),
      },
    },
  });
  expect(oversizedResponse.status()).toBeGreaterThanOrEqual(400);
  expect(oversizedResponse.status()).toBeLessThan(500);

  const uploadResponse = await request.post("/api/admin/uploads", {
    headers,
    multipart: {
      file: {
        name: "qa-check.png",
        mimeType: "image/png",
        buffer: imageBuffer,
      },
    },
  });
  expect(uploadResponse.status()).toBe(200);
  const upload: ImageUploadResponse = await uploadResponse.json();
  expect(upload.ok).toBe(true);
  expect(upload.image).toMatch(/^\/images\/projects\/[a-f0-9-]{36}\.webp$/);

  const uploadDirectory = path.resolve(
    process.cwd(),
    "public",
    "images",
    "projects",
  );
  const generatedPath = path.resolve(
    process.cwd(),
    "public",
    upload.image.slice(1),
  );
  expect(path.dirname(generatedPath)).toBe(uploadDirectory);
  try {
    const imageResponse = await request.get(upload.image);
    expect(imageResponse.status()).toBe(200);
    expect(imageResponse.headers()["content-type"]).toContain("image/webp");
  } finally {
    await unlink(generatedPath);
    await request.post("/api/admin/logout");
  }
});

test("projects and jobs can be added, saved, and published from the editor", async ({
  page,
  request,
}) => {
  const password = process.env.ADMIN_PASSWORD ?? "";
  test.skip(!password, "ADMIN_PASSWORD is required for the editor save check.");
  expect(
    (
      await page.request.post("/api/admin/login", { data: { password } })
    ).status(),
  ).toBe(200);
  const headers = await authenticatedHeaders(page.request);
  const projectsResponse: { data: Projects } = await (
    await page.request.get("/api/admin/projects", { headers })
  ).json();
  const experienceResponse: { data: Experience } = await (
    await page.request.get("/api/admin/experience", { headers })
  ).json();
  let uploadedPath = "";

  try {
    await page.goto("/admin/27348");
    await page
      .locator("nav")
      .getByRole("button", { name: "Projects", exact: true })
      .click();
    await page
      .getByRole("button", { name: "+ Add project", exact: true })
      .click();
    await page
      .getByLabel("Project name", { exact: true })
      .last()
      .fill("QA portfolio project");
    await page
      .getByLabel("Short summary", { exact: true })
      .last()
      .fill("A temporary project used to verify publishing.");
    await page
      .getByLabel("Project story", { exact: true })
      .last()
      .fill("This entry is removed after the editor check.");

    const uploadResponsePromise = page.waitForResponse(
      (response) =>
        response.url().endsWith("/api/admin/uploads") &&
        response.request().method() === "POST",
    );
    await page
      .getByLabel("Project screenshot", { exact: true })
      .last()
      .setInputFiles({
        name: "qa-editor.png",
        mimeType: "image/png",
        buffer: imageBuffer,
      });
    const uploadResponse = await uploadResponsePromise;
    const upload: ImageUploadResponse = await uploadResponse.json();
    expect(uploadResponse.status()).toBe(200);
    expect(upload.image).toMatch(/^\/images\/projects\/[a-f0-9-]{36}\.webp$/);
    uploadedPath = upload.image;
    await page
      .getByLabel("Image description", { exact: false })
      .last()
      .fill("Temporary editor test image.");
    await page
      .getByRole("button", { name: "+ Add link", exact: true })
      .last()
      .click();
    await page
      .getByLabel("Link label", { exact: true })
      .last()
      .fill("Source code");
    await page
      .getByLabel("Link URL", { exact: true })
      .last()
      .fill("https://github.com/Ahmed-elssamman");

    await page
      .locator("nav")
      .getByRole("button", { name: "Experience", exact: true })
      .click();
    await page
      .locator("nav")
      .getByRole("button", { name: "Projects", exact: true })
      .click();
    await expect(
      page.getByLabel("Project name", { exact: true }).last(),
    ).toHaveValue("QA portfolio project");

    await page
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await expect(
      page.getByRole("status").filter({ hasText: "Saved" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Save changes", exact: true }),
    ).toBeDisabled();
    expect(await (await request.get("/")).text()).toContain(
      "QA portfolio project",
    );
    const savedProjects: { data: Projects } = await (
      await page.request.get("/api/admin/projects", { headers })
    ).json();
    const addedProject = savedProjects.data.find(
      (project) => project.name === "QA portfolio project",
    );
    expect(addedProject).toBeTruthy();
    if (!addedProject) throw new Error("Saved project was not returned.");
    expect(addedProject.image).toBe(upload.image);
    const caseStudy = await request.get("/projects/" + addedProject.id);
    expect(caseStudy.status()).toBe(200);
    expect(await caseStudy.text()).toContain(
      "This entry is removed after the editor check.",
    );

    await page
      .locator("nav")
      .getByRole("button", { name: "Experience", exact: true })
      .click();
    await page
      .getByRole("button", { name: "+ Add experience", exact: true })
      .click();
    await page
      .getByLabel("Company", { exact: true })
      .first()
      .fill("QA company");
    await page
      .getByLabel("Role", { exact: true })
      .first()
      .fill("Frontend Engineer");
    await page
      .getByLabel("Start (e.g. Feb 2026)", { exact: true })
      .first()
      .fill("Sep 2026");
    await page
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await expect(
      page.getByRole("status").filter({ hasText: "Saved" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Save changes", exact: true }),
    ).toBeDisabled();
    expect(await (await request.get("/")).text()).toContain("QA company");
  } finally {
    test.setTimeout(test.info().timeout + 15_000);
    const restoreProjects = await page.request.put("/api/admin/projects", {
      headers,
      data: projectsResponse.data,
    });
    const restoreExperience = await page.request.put("/api/admin/experience", {
      headers,
      data: experienceResponse.data,
    });
    expect(restoreProjects.status()).toBe(200);
    expect(restoreExperience.status()).toBe(200);
    if (uploadedPath) {
      const directory = path.resolve(
        process.cwd(),
        "public",
        "images",
        "projects",
      );
      const file = path.resolve(process.cwd(), "public", uploadedPath.slice(1));
      expect(path.dirname(file)).toBe(directory);
      await unlink(file);
    }
    await page.request.post("/api/admin/logout");
  }
});
