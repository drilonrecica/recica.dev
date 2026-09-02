import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const SAMPLE_JWT =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiUmVjaWNhIiwiZXhwIjo0MTAyNDQ0ODAwfQ.signature';

async function expectAccessible(page: Page) {
	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
		// The diagnostics overlay is aria-hidden, pointer-inert, and renders its text
		// transparent purely to position the error marker under the textarea.
		.exclude('.codefield__overlay')
		.analyze();
	expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
	// Gradients, background images, or translucency make axe skip contrast checks.
	// Treat those as failures; symbol-only glyphs (carets, markers) are fine.
	const unresolved = results.incomplete
		.filter((item) => item.id === 'color-contrast')
		.flatMap((item) => item.nodes)
		.filter((node) =>
			/gradient|background image|could not be determined|pseudo|overlap/i.test(
				node.failureSummary ?? ''
			)
		);
	expect(unresolved, JSON.stringify(unresolved, null, 2)).toEqual([]);
}

test('smart paste detects a JWT and opens the inspector prefilled', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('Paste anything').fill(SAMPLE_JWT);
	const topChip = page.locator('.suggest__chip--top');
	await expect(topChip).toContainText(/inspect as a jwt/i);
	await topChip.click();

	await expect(page).toHaveURL(/\/jwt$/);
	await expect(page.getByLabel('JWT')).toHaveValue(SAMPLE_JWT);
	await expect(page.getByRole('status')).toContainText(/jwt decoded locally/i);
	await expect(page.getByText(/"sub": "123"/)).toBeVisible();
	// The hand-off never touches the URL or storage.
	expect(page.url()).not.toContain('eyJ');
	expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('eyJ');
});

test('send-to hands the JWT payload to the JSON formatter in memory', async ({ page }) => {
	await page.goto('/jwt');
	await expect(page.getByText(/"sub": "123"/)).toBeVisible();
	await page
		.getByRole('button', { name: /send to/i })
		.first()
		.click();
	await page.getByRole('menuitem', { name: /format the payload/i }).click();

	await expect(page).toHaveURL(/\/json$/);
	await expect(page.getByLabel('Raw JSON')).toHaveValue(/"sub": "123"/);
	await expect(page.getByRole('status')).toContainText(/formatted output ready/i);
	expect(page.url()).not.toContain('sub');
});

test('file drop loads a file locally and refuses oversized files before reading', async ({
	page
}) => {
	await page.goto('/json');
	const fileInput = page.locator('[data-file-input="json-input"]');

	await fileInput.setInputFiles({
		name: 'sample.json',
		mimeType: 'application/json',
		buffer: Buffer.from('{"dropped":true}')
	});
	await expect(page.getByLabel('Raw JSON')).toHaveValue('{"dropped":true}');
	await expect(page.getByText(/loaded sample\.json/i)).toBeVisible();
	await expect(page.getByText(/"dropped": true/)).toBeVisible();

	await fileInput.setInputFiles({
		name: 'huge.json',
		mimeType: 'application/json',
		buffer: Buffer.alloc(3 * 1024 * 1024 + 1, 0x20)
	});
	await expect(page.getByRole('alert')).toContainText(/the file was not read/i);
	await expect(page.getByLabel('Raw JSON')).toHaveValue('{"dropped":true}');
});

test('keyboard shortcuts run, copy, and open the shortcuts sheet', async ({ context, page }) => {
	await context.grantPermissions(['clipboard-read', 'clipboard-write']);
	await page.goto('/json');
	const input = page.getByLabel('Raw JSON');
	await input.fill('{"keys":[1,2]}');
	await input.press('Control+Enter');
	await expect(page.getByText(/"keys": \[/)).toBeVisible();

	await input.press('Control+Shift+C');
	const clipboard = await page.evaluate(() => navigator.clipboard.readText());
	expect(clipboard).toContain('"keys": [');

	await page.getByRole('heading', { level: 1 }).click();
	await page.keyboard.press('?');
	const sheet = page.getByRole('dialog', { name: /keyboard shortcuts/i });
	await expect(sheet).toBeVisible();
	await expect(sheet.getByText('Run the current mode')).toBeVisible();
	await page.keyboard.press('Escape');
	await expect(sheet).toBeHidden();
});

test('favorites persist tool ids only and surface on the homepage', async ({ page }) => {
	await page.goto('/diff');
	await page.getByRole('button', { name: 'Favorite this tool' }).click();
	await page.goto('/');
	const yourTools = page.getByRole('region', { name: 'Your tools' });
	await expect(yourTools.getByRole('link', { name: /text diff checker/i })).toBeVisible();
	const stored = await page.evaluate(() => localStorage.getItem('recica-tools-prefs'));
	expect(JSON.parse(stored ?? '{}')).toMatchObject({ favorites: ['diff'] });
});

for (const colorScheme of ['light', 'dark'] as const) {
	test(`workbench routes pass axe with computable contrast in ${colorScheme} scheme`, async ({
		page
	}) => {
		await page.emulateMedia({ colorScheme });
		for (const route of ['/', '/json', '/qr', '/diff', '/regex']) {
			await page.goto(route);
			await expectAccessible(page);
		}
		await page.goto('/json');
		await page.getByLabel('Raw JSON').fill('{"lab":}');
		await expect(page.locator('.codefield__overlay mark')).toHaveCount(1);
		await expectAccessible(page);
	});
}
