import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const INDEXABLE_ROBOTS =
  "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

const publicRoutes = [
  { path: "/", h1: "Drilon Reçica" },
  { path: "/about", h1: "About Drilon Reçica" },
  { path: "/cv", h1: "Drilon Reçica" },
  { path: "/work/wohin-du-willst", h1: "Deutsche Bahn – Wohin Du Willst" },
  { path: "/work/qisara", h1: "Qisara" },
  { path: "/work/edeka-scan-and-go", h1: "EDEKA – Scan & Go" },
];

async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(
    results.violations,
    JSON.stringify(results.violations, null, 2),
  ).toEqual([]);

  // A gradient or translucent background makes axe skip contrast checks and
  // report them as "incomplete" instead of failing. Treat that as a failure
  // so the contrast gate cannot silently go blind again.
  const unresolvedContrast = results.incomplete.filter(
    (item) => item.id === "color-contrast",
  );
  expect(
    unresolvedContrast,
    JSON.stringify(unresolvedContrast, null, 2),
  ).toEqual([]);
}

async function expectNoPresentationScripts(page: Page) {
  await expect(
    page.locator('script:not([type="application/ld+json"])'),
  ).toHaveCount(0);
}

test("homepage keeps public anchors, metadata, and zero presentation scripts", async ({
  page,
  request,
}) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Drilon Reçica/);
  await expect(page.locator("body")).toHaveAttribute(
    "data-publication",
    "technical-dossier",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://recica.dev/",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    INDEXABLE_ROBOTS,
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    "content",
    "recica.dev",
  );
  await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute(
    "content",
    "dark light",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Drilon Reçica",
  );
  await expect(page.getByText("Prishtina, Kosovo").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Explore Labs" })).toBeVisible();

  for (const anchor of ["work", "experience", "about", "contact", "tools"]) {
    await expect(page.locator(`#${anchor}`)).toHaveCount(1);
  }

  // The header must not rely on a disclosure widget that can stay open over content.
  await expect(page.locator("header details")).toHaveCount(0);

  const ogImage = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(ogImage).toBe("https://recica.dev/og/home.png");
  const ogResponse = await request.get("/og/home.png");
  expect(ogResponse.ok()).toBeTruthy();

  await expectNoPresentationScripts(page);
  await expectAccessible(page);
});

test("homepage stays accessible in the light color scheme", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");

  const background = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(background).toBe("rgb(243, 245, 242)");
  await expectAccessible(page);
});

test("header navigation works from a subpage and marks the current page", async ({
  page,
}) => {
  await page.goto("/cv");

  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav.getByRole("link", { name: "CV" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await expect(nav.getByRole("link", { name: "Work" })).toHaveAttribute(
    "href",
    "/#work",
  );
});

for (const route of publicRoutes) {
  test(`${route.path} is a canonical, crawlable, accessible page`, async ({
    page,
    request,
  }) => {
    await page.goto(route.path);

    await expect(
      page.getByRole("heading", { level: 1, name: route.h1 }),
    ).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://recica.dev${route.path}`,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      INDEXABLE_ROBOTS,
    );
    await expect(page.locator('meta[http-equiv="refresh"]')).toHaveCount(0);

    const ogImage = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(ogImage).toMatch(/^https:\/\/recica\.dev\/og\/[a-z-]+\.png$/);
    const ogResponse = await request.get(new URL(ogImage!).pathname);
    expect(ogResponse.ok()).toBeTruthy();

    await expectNoPresentationScripts(page);
    await expectAccessible(page);
  });
}

test("case studies carry a decision log, breadcrumbs, and pager", async ({
  page,
}) => {
  await page.goto("/work/wohin-du-willst");

  await expect(
    page.getByRole("heading", { name: /decision log|calls that shaped/i }),
  ).toBeVisible();
  await expect(page.locator(".decision")).toHaveCount(3);
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Next/ })).toHaveAttribute(
    "href",
    "/work/qisara",
  );

  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  expect(jsonLd).toContain('"BreadcrumbList"');
  expect(jsonLd).toContain('"CreativeWork"');
});

test("cv page is printable and links to the PDF", async ({ page }) => {
  await page.goto("/cv");

  await expect(
    page.getByRole("link", { name: "Download PDF" }),
  ).toHaveAttribute("href", "/cv.pdf");
  await expect(page.getByRole("heading", { name: "Experience" })).toBeVisible();
  await expect(page.getByText("AppDev GmbH").first()).toBeVisible();

  await page.emulateMedia({ media: "print" });
  await expect(page.locator("header.site-header")).toBeHidden();
});

test("person structured data carries location, languages, and a portrait", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const jsonLd = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  const graph = JSON.parse(jsonLd!)["@graph"] as Array<Record<string, unknown>>;
  const person = graph.find((node) => node["@type"] === "Person")!;

  expect(person.knowsLanguage).toEqual(["Albanian", "German", "English"]);
  expect(person.address).toMatchObject({ addressLocality: "Prishtina" });
  expect(person.image).toBe("https://recica.dev/og/portrait.png");
  const portrait = await request.get("/og/portrait.png");
  expect(portrait.ok()).toBeTruthy();
});

test("favicon is a small vector and the old raster wrapper is gone", async ({
  request,
}) => {
  const favicon = await request.get("/favicon.svg");
  expect(favicon.ok()).toBeTruthy();
  expect((await favicon.body()).length).toBeLessThan(4096);
  expect(await favicon.text()).not.toContain("data:image/png");
});

test("branded 404 is generated and unknown routes retain 404 status", async ({
  page,
  request,
}) => {
  await page.goto("/404");
  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow, noarchive",
  );

  const missing = await request.get("/this-route-does-not-exist");
  expect(missing.status()).toBe(404);
});

test("robots and sitemap index stay aligned with every flagship route", async ({
  request,
}) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain(
    "Sitemap: https://recica.dev/sitemap-index.xml",
  );

  const sitemap = await request.get("/sitemap-0.xml");
  expect(sitemap.ok()).toBeTruthy();
  const sitemapXml = await sitemap.text();
  for (const route of publicRoutes) {
    expect(sitemapXml).toContain(`https://recica.dev${route.path}`);
  }
  expect(sitemapXml).not.toContain("https://recica.dev/404");
});
