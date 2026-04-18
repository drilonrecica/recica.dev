import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

async function expectNoViolations(page: Page) {
	const results = await new AxeBuilder({ page })
		.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
		.analyze();

	expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

test('labs homepage passes axe and keeps a keyboard skip link', async ({ page }) => {
	await page.goto('/');

	await expect(page.getByRole('link', { name: 'Skip to content' })).toBeVisible();
	await expectNoViolations(page);
});

test('parental gate lab passes axe after interactive state changes', async ({ page }) => {
	await page.goto('/parental-gate-lab');
	await page.getByTestId('open-demo-hold-to-confirm').click();
	await page.getByTestId('answer-risk-high').click();
	await page.getByTestId('answer-frequency-rare').click();
	await page.getByTestId('answer-literacy-yes').click();
	await page.getByTestId('answer-accessibility-important').click();
	await page.getByTestId('answer-touch-avoid').click();
	await page.getByTestId('answer-surface-purchase').click();
	await page.getByRole('button', { name: 'Recommend a pattern' }).click();

	await expect(page.getByTestId('recommendation-panel')).toContainText('Text Challenge Gate');
	await expectNoViolations(page);
});
