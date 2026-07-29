import AxeBuilder from '@axe-core/playwright';
import type { Locator, Page } from '@playwright/test';
import { expect, test } from './fixtures';

async function expectNoViolations(page: Page) {
	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
		.analyze();

	expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

async function expectLinkedFieldError(input: Locator, page: Page) {
	await expect(input).toHaveAttribute('aria-invalid', 'true');
	const errorId = await input.getAttribute('aria-describedby');
	expect(errorId).toBeTruthy();
	await expect(page.locator(`#${errorId}`)).toHaveAttribute('role', 'alert');
}

test('homepage and representative tool routes pass axe', async ({ page }) => {
	for (const route of ['/', '/privacy', '/json', '/qr', '/regex', '/robots', '/sitemap']) {
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

test('tool errors are announced and associated with representative input types', async ({
	page
}) => {
	await page.goto('/json');
	const jsonInput = page.getByLabel('Raw JSON');
	await jsonInput.fill('{invalid');
	await page.getByRole('button', { name: 'Validate' }).click();
	await expectLinkedFieldError(jsonInput, page);
	await expect(page.getByRole('status')).toContainText(/expected|property|json/i);

	await page.goto('/url');
	const urlInput = page.getByLabel('Source');
	await urlInput.fill('%E0%A4%A');
	await page.getByRole('button', { name: 'Decode' }).click();
	await expectLinkedFieldError(urlInput, page);

	await page.goto('/base64');
	const base64Input = page.getByLabel('Source');
	await base64Input.fill('%%%');
	await page.getByRole('button', { name: 'Decode' }).click();
	await expectLinkedFieldError(base64Input, page);

	await page.goto('/barcode');
	const barcodeInput = page.getByLabel('Value');
	await page.getByRole('button', { name: 'EAN-13' }).click();
	await barcodeInput.fill('123');
	await page.getByRole('button', { name: 'Generate' }).click();
	await expectLinkedFieldError(barcodeInput, page);
});
