import { expect, test } from '@playwright/test';

test('renders the Labs homepage hero and featured experiments', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByTestId('labs-home-hero')).toBeVisible();
	await expect(page.getByTestId('labs-home-section-hero')).toBeVisible();
	await expect(page.getByTestId('labs-home-section-featured')).toBeVisible();
	await expect(page.getByTestId('labs-home-section-bridge')).toBeVisible();
	await expect(page.getByTestId('experiment-card-parental-gate-lab')).toBeVisible();
	await expect(page.getByTestId('experiment-card-mobile-analytics-crash-reporting')).toBeVisible();
	await expect(page.getByText('How Labs works')).toHaveCount(0);
	await expect(page.getByText('What Labs is')).toHaveCount(0);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		'content',
		'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
	);
	await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
		'content',
		'Labs by Drilon Recica homepage preview'
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'http://127.0.0.1:4173/'
	);
});

test('serves robots and sitemap endpoints', async ({ page }) => {
	await page.goto('/robots.txt');
	await expect(page.locator('body')).toContainText('Sitemap: http://127.0.0.1:4173/sitemap.xml');
	await expect(page.locator('body')).toContainText('Disallow: /404');
	await expect(page.locator('body')).toContainText('Host: 127.0.0.1:4173');

	await page.goto('/sitemap.xml');
	await expect(page.locator('body')).toContainText('http://127.0.0.1:4173/');
	await expect(page.locator('body')).toContainText('http://127.0.0.1:4173/parental-gate-lab');
	await expect(page.locator('body')).toContainText('<changefreq>weekly</changefreq>');
});
