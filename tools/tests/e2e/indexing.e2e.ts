import { expect, test } from '@playwright/test';

test('default preview output is noindex with production canonicals', async ({ page, request }) => {
	await page.goto('/json');

	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://tools.recica.dev/json'
	);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		'content',
		'noindex, nofollow, noarchive'
	);

	const robots = await request.get('/robots.txt');
	expect(await robots.text()).toContain('Disallow: /');

	const sitemap = await request.get('/sitemap.xml');
	const sitemapXml = await sitemap.text();
	expect(sitemapXml).toContain('<loc>https://tools.recica.dev/json</loc>');
	expect(sitemapXml).not.toContain('<lastmod>');
});

test.use({ javaScriptEnabled: false });

test('tool explanations and controls are present before hydration', async ({ page }) => {
	await page.goto('/json');

	await expect(
		page.getByRole('heading', { level: 1, name: 'JSON Formatter / Validator' })
	).toBeVisible();
	await expect(page.getByLabel('Raw JSON')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Format' })).toBeVisible();
});

test('a generated branded document is available for real 404 responses', async ({
	page,
	request
}) => {
	const brandedDocument = await request.get('/404');
	expect(brandedDocument.status()).toBe(200);

	await page.goto('/404');
	await expect(page.getByRole('heading', { level: 1, name: 'Route not found' })).toBeVisible();
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		'content',
		'noindex, nofollow, noarchive'
	);

	const missing = await request.get('/this-route-does-not-exist');
	expect(missing.status()).toBe(404);
});
