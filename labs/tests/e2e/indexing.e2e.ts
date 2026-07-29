import { expect, test } from '@playwright/test';

test('core experiment content is available before hydration', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();

	await page.goto('/parental-gate-lab');
	await expect(
		page.getByRole('heading', {
			level: 1,
			name: /Parental Gate/
		})
	).toBeVisible();
	await expect(page.getByRole('link', { name: 'Compare tradeoffs' })).toBeVisible();

	await context.close();
});

test('generated pages use a hash-based script policy', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('meta[http-equiv="content-security-policy"]')).toHaveAttribute(
		'content',
		/script-src 'self' 'sha256-/
	);
	await expect(page.locator('meta[http-equiv="content-security-policy"]')).not.toHaveAttribute(
		'content',
		/unsafe-eval/
	);
});

test('a generated branded document is available for real 404 responses', async ({ page }) => {
	await page.goto('/404');
	await expect(
		page.getByRole('heading', { name: 'That experiment route does not exist.' })
	).toBeVisible();

	const response = await page.goto('/this-route-does-not-exist');
	expect(response?.status()).toBe(404);
});
