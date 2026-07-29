import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function expectNoViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();

  expect(
    results.violations,
    JSON.stringify(results.violations, null, 2),
  ).toEqual([]);
}

test("technical dossier homepage preserves public anchors without presentation scripts", async ({
  page,
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
    "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
  );
  await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
    "content",
    "recica.dev",
  );
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Drilon Reçica",
  );
  await expect(page.getByRole("link", { name: "Explore Labs" })).toBeVisible();

  for (const anchor of ["work", "experience", "about", "contact", "tools"]) {
    await expect(page.locator(`#${anchor}`)).toHaveCount(1);
  }

  await expect(
    page.locator('script:not([type="application/ld+json"])'),
  ).toHaveCount(0);
  await expectNoViolations(page);
});

test("about is a canonical, crawlable dossier page", async ({ page }) => {
  await page.goto("/about");

  await expect(
    page.getByRole("heading", { level: 1, name: "About Drilon Reçica" }),
  ).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://recica.dev/about",
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
  );
  await expect(page.locator('meta[http-equiv="refresh"]')).toHaveCount(0);
  await expectNoViolations(page);
});

for (const caseStudy of [
  {
    path: "/work/wohin-du-willst",
    title: "Deutsche Bahn – Wohin Du Willst",
  },
  { path: "/work/qisara", title: "Qisara" },
  { path: "/work/edeka-scan-and-go", title: "EDEKA – Scan & Go" },
]) {
  test(`${caseStudy.title} has a canonical case-study page`, async ({
    page,
  }) => {
    await page.goto(caseStudy.path);

    await expect(
      page.getByRole("heading", { level: 1, name: caseStudy.title }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Outcome" })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://recica.dev${caseStudy.path}`,
    );
    await expectNoViolations(page);
  });
}

test("branded 404 is generated and unknown routes retain 404 status", async ({
  page,
  request,
}) => {
  await page.goto("/404");
  await expect(
    page.getByRole("heading", { level: 1, name: "Dossier entry not found" }),
  ).toBeVisible();

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
  expect(sitemapXml).toContain("https://recica.dev/about");
  expect(sitemapXml).toContain("https://recica.dev/work/wohin-du-willst");
  expect(sitemapXml).toContain("https://recica.dev/work/qisara");
  expect(sitemapXml).toContain("https://recica.dev/work/edeka-scan-and-go");
  expect(sitemapXml).not.toContain("https://recica.dev/404");
});
