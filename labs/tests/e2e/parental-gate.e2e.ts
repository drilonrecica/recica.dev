import { expect, test } from '@playwright/test';

test('loads the parental gate route with canonical metadata', async ({ page }) => {
	await page.goto('/parental-gate-lab');

	await expect(page.getByRole('heading', { name: 'Parental Gate Lab' })).toBeVisible();
	await expect(page.getByTestId('fit-finder-section')).toBeVisible();
	await expect(page.getByTestId('guidance-section')).toBeVisible();
	await expect(page.getByTestId('pattern-rows')).toBeVisible();
	await expect(page.locator('[data-testid^="pattern-row-"]')).toHaveCount(6);
	await expect(page.getByText('Live prototype')).toHaveCount(0);
	await expect(page.getByRole('link', { name: 'Try patterns' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Compare tradeoffs' })).toBeVisible();
	await expect(page.getByRole('link', { name: 'Get a recommendation' })).toBeVisible();
	await expect(page.locator('[data-testid="demo-grid"] article').first()).toContainText(
		'Active pattern'
	);
	await expect(page.getByTestId('demo-panel')).toContainText('Math Gate is active.');
	await expect(page.locator('.compact-faq__item')).toHaveCount(4);
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		'content',
		'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
	);
	await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute(
		'content',
		'Parental Gate Lab social preview'
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'http://127.0.0.1:4175/parental-gate-lab'
	);
});

test('math gate reaches failure and success states', async ({ page }) => {
	await page.goto('/parental-gate-lab');

	await page.getByTestId('open-demo-math-gate').click();
	await page.getByTestId('math-answer').fill('11');
	await page.getByRole('button', { name: 'Submit' }).click();
	await expect(page.getByTestId('demo-status')).toContainText('Incorrect answer');

	await page.getByRole('button', { name: 'Reset demo' }).click();
	await page.getByTestId('math-answer').fill('12');
	await page.getByRole('button', { name: 'Submit' }).click();
	await expect(page.getByTestId('demo-status')).toContainText('Correct.');
});

test('hold-to-confirm works with keyboard interaction', async ({ page }) => {
	await page.goto('/parental-gate-lab');

	await page.getByTestId('open-demo-hold-to-confirm').click();

	const trigger = page.getByTestId('hold-trigger');
	await trigger.focus();
	await page.keyboard.down('Space');
	await page.waitForTimeout(1400);
	await page.keyboard.up('Space');

	await expect(page.getByTestId('demo-status')).toContainText('Completed.');
});

test('drag-and-drop fallback supports failure and success', async ({ page }) => {
	await page.goto('/parental-gate-lab');

	await page.getByTestId('open-demo-drag-and-drop').click();
	await page.getByTestId('fallback-select-ticket').click();
	await page.getByTestId('drag-fallback-submit').click();
	await expect(page.getByTestId('demo-status')).toContainText('Wrong item');

	await page.getByRole('button', { name: 'Reset demo' }).click();
	await page.getByTestId('fallback-select-key').click();
	await page.getByTestId('drag-fallback-submit').click();
	await expect(page.getByTestId('demo-status')).toContainText('Correct.');
});

test('shape, text, and pattern demos all resolve cleanly', async ({ page }) => {
	await page.goto('/parental-gate-lab');

	await page.getByTestId('open-demo-shape-color-recognition').click();
	await page.getByTestId('shape-option-blue-circle').click();
	await expect(page.getByTestId('demo-status')).toContainText('Not quite');
	await page.getByRole('button', { name: 'Reset demo' }).click();
	await page.getByTestId('shape-option-amber-square').click();
	await expect(page.getByTestId('demo-status')).toContainText('Correct.');

	await page.getByTestId('open-demo-text-challenge').click();
	await page.getByTestId('text-answer').fill('unlock');
	await page.getByRole('button', { name: 'Submit' }).click();
	await expect(page.getByTestId('demo-status')).toContainText('Correct.');

	await page.getByTestId('open-demo-pattern-matching').click();
	await page.getByTestId('pattern-option-option-c').click();
	await expect(page.getByTestId('demo-status')).toContainText('Not the matching pattern');
	await page.getByRole('button', { name: 'Reset demo' }).click();
	await page.getByTestId('pattern-option-option-a').click();
	await expect(page.getByTestId('demo-status')).toContainText('Correct.');
});

test('comparison sorting updates the first ranked row', async ({ page }) => {
	await page.goto('/parental-gate-lab');

	await page.getByTestId('compare-sort').selectOption('parentFriction');
	await expect(page.locator('[data-testid^="compare-row-"]').first()).toHaveAttribute(
		'data-testid',
		'compare-row-hold-to-confirm'
	);
});

test('recommendation helper returns a deterministic result', async ({ page }) => {
	await page.goto('/parental-gate-lab');

	await page.getByTestId('answer-risk-high').click();
	await page.getByTestId('answer-frequency-rare').click();
	await page.getByTestId('answer-literacy-yes').click();
	await page.getByTestId('answer-accessibility-important').click();
	await page.getByTestId('answer-touch-avoid').click();
	await page.getByTestId('answer-surface-purchase').click();
	await page.getByRole('button', { name: 'Recommend a pattern' }).click();

	await expect(page.getByTestId('recommendation-panel')).toContainText('Text Challenge Gate');
	await expect(page.getByTestId('recommendation-panel')).toContainText('Math Gate');
	await expect(page.getByTestId('recommendation-panel')).toContainText('Accessibility note');
	await expect(page.getByTestId('recommendation-panel')).toContainText('Implementation note');
	await expect(page.getByTestId('recommendation-panel')).toContainText('Score breakdown');
});

test.describe('mobile behavior', () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test('keeps the demo panel stacked below the grid instead of using a modal', async ({ page }) => {
		await page.goto('/parental-gate-lab');

		await page.getByTestId('open-demo-math-gate').click();

		const gridBox = await page.getByTestId('demo-grid').boundingBox();
		const panelBox = await page.getByTestId('demo-panel').boundingBox();

		expect(gridBox).not.toBeNull();
		expect(panelBox).not.toBeNull();

		if (!gridBox || !panelBox) {
			throw new Error('Expected grid and panel bounding boxes.');
		}

		expect(panelBox.y).toBeGreaterThan(gridBox.y + gridBox.height - 1);
	});

	test('uses stacked comparison cards on mobile', async ({ page }) => {
		await page.goto('/parental-gate-lab');

		await expect(page.locator('[data-testid^="compare-card-"]')).toHaveCount(6);
		await expect(page.getByTestId('compare-table')).toBeHidden();
	});
});
