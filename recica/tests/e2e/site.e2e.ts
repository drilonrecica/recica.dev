import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function expectNoViolations(page: Page) {
	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
		.analyze();

	expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

test('flagship homepage exposes canonical SEO metadata and passes axe', async ({ page }) => {
	await page.goto('/');

	await expect(page).toHaveTitle(/Drilon Reçica/);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://recica.dev/'
	);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		'content',
		'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
	);
	await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
		'content',
		'recica.dev'
	);
	await expect(page.getByRole('link', { name: 'Explore Labs' })).toBeVisible();

	await expectNoViolations(page);
});

test('about compatibility page stays noindex and canonical-safe', async ({ request }) => {
	const response = await request.get('/about/');
	expect(response.ok()).toBeTruthy();

	const html = await response.text();
	expect(html).toContain('noindex, nofollow, noarchive');
	expect(html).toContain('https://recica.dev/#about');
	expect(html).toContain('meta http-equiv="refresh" content="0;url=/#about"');
});

test('robots and sitemap index stay aligned with the flagship origin', async ({ request }) => {
	const robots = await request.get('/robots.txt');
	expect(robots.ok()).toBeTruthy();
	expect(await robots.text()).toContain('Sitemap: https://recica.dev/sitemap-index.xml');

	const sitemap = await request.get('/sitemap-index.xml');
	expect(sitemap.ok()).toBeTruthy();
	const sitemapXml = await sitemap.text();
	expect(sitemapXml).toContain('https://recica.dev/sitemap-0.xml');
	expect(sitemapXml).not.toContain('/about');
});
