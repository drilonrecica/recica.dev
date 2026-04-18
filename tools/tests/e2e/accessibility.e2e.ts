import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function expectNoViolations(page: Page) {
	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
		.analyze();

	expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

test('homepage and representative tool routes pass axe', async ({ page }) => {
	for (const route of ['/', '/json', '/qr', '/regex', '/robots', '/sitemap']) {
		await page.goto(route);
		await expectNoViolations(page);
	}
});

test('search dialog traps focus and passes axe while open', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: /^search/i }).click();

	const dialog = page.getByRole('dialog', { name: 'Tool Search' });
	await expect(dialog).toBeVisible();
	await expect(page.locator('div[inert]')).toHaveCount(1);
	await expect(dialog.getByLabel('Search tools')).toBeFocused();

	await page.keyboard.press('Shift+Tab');
	await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();

	await page.keyboard.press('Shift+Tab');
	await expect(dialog.locator('ul button').last()).toBeFocused();

	await page.keyboard.press('Tab');
	await expect(dialog.getByRole('button', { name: 'Close' })).toBeFocused();

	await expectNoViolations(page);

	await page.keyboard.press('Escape');
	await expect(page.getByRole('button', { name: /^search/i })).toBeFocused();
});
