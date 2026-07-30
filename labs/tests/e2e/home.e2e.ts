import { expect, test } from '@playwright/test';

test('renders the Labs homepage hero and featured experiments', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByText('Research Notebook', { exact: true }).first()).toBeVisible();
	await expect(
		page.getByRole('heading', { level: 1, name: 'Product questions, tested in public.' })
	).toBeVisible();
	await expect(page.getByTestId('labs-home-hero')).toBeVisible();
	await expect(page.getByTestId('labs-home-section-hero')).toBeVisible();
	await expect(page.getByTestId('labs-home-section-featured')).toBeVisible();
	await expect(page.getByTestId('labs-home-section-bridge')).toBeVisible();
	await expect(page.getByTestId('experiment-card-parental-gate-lab')).toBeVisible();
	await expect(page.getByTestId('experiment-card-mobile-analytics-crash-reporting')).toBeVisible();
	await expect(page.getByText('How Labs works')).toHaveCount(0);
	await expect(page.getByText('What Labs is')).toHaveCount(0);
	await expect(page.getByText('Study 01', { exact: true })).toBeVisible();
	await expect(page.getByText('Note 02', { exact: true })).toBeVisible();
	await expect(page.getByText('In progress', { exact: true })).toBeVisible();
	await expect(
		page.getByTestId('experiment-card-mobile-analytics-crash-reporting').getByRole('link')
	).toHaveCount(0);
	await expect(page.locator('.app-shell')).not.toHaveClass(/theme-lab-dark/);
	await expect(page.locator('meta[name="color-scheme"]')).toHaveAttribute('content', 'light');
	expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(
		'light'
	);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		'content',
		'noindex, nofollow, noarchive'
	);
	await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
		'content',
		'Labs by Drilon Recica homepage preview'
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://labs.recica.dev/'
	);
});

test('serves robots and sitemap endpoints', async ({ page }) => {
	await page.goto('/robots.txt');
	await expect(page.locator('body')).toContainText('Sitemap: https://labs.recica.dev/sitemap.xml');
	await expect(page.locator('body')).toContainText('Disallow: /');
	await expect(page.locator('body')).toContainText('Host: labs.recica.dev');

	await page.goto('/sitemap.xml');
	await expect(page.locator('body')).toContainText('https://labs.recica.dev/');
	await expect(page.locator('body')).toContainText('https://labs.recica.dev/parental-gate-lab');
	await expect(page.locator('body')).not.toContainText('<changefreq>');
});
