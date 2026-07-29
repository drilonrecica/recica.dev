import { expect, test } from './fixtures';

test('a representative tool remains available and functional offline', async ({
	context,
	page
}) => {
	await page.goto('/json');
	await page.evaluate(() => navigator.serviceWorker.ready);

	await context.setOffline(true);
	await page.reload();

	await expect(
		page.getByRole('heading', { level: 1, name: 'JSON Formatter / Validator' })
	).toBeVisible();
	await page.getByLabel('Raw JSON').fill('{"offline":true}');
	await page.getByRole('button', { name: 'Format' }).click();
	await expect(page.getByText(/"offline": true/)).toBeVisible();

	await page.goto('/base64');
	await page.getByLabel('Source').fill('offline');
	await page.getByRole('button', { name: 'Encode' }).click();
	await expect(page.getByText('b2ZmbGluZQ==', { exact: true })).toBeVisible();
});

test('cache storage excludes input, query variants, and unrelated caches', async ({ page }) => {
	const privateMarker = `private-${crypto.randomUUID()}`;
	await page.goto('/json');
	await page.evaluate(() => navigator.serviceWorker.ready);

	await page.getByLabel('Raw JSON').fill(`{"secret":"${privateMarker}"}`);
	await page.getByRole('button', { name: 'Format' }).click();
	await page.evaluate(async (marker) => {
		await fetch(`/json?input=${encodeURIComponent(marker)}`);
	}, privateMarker);

	const cacheSnapshot = await page.evaluate(async () => {
		const names = await caches.keys();
		const entries = await Promise.all(
			names.map(async (name) => {
				const cache = await caches.open(name);
				const requests = await cache.keys();
				const bodies = await Promise.all(
					requests.map(async (request) => {
						const response = await cache.match(request);
						return response?.text() ?? '';
					})
				);

				return {
					name,
					urls: requests.map((request) => request.url),
					bodies
				};
			})
		);

		return entries;
	});

	expect(cacheSnapshot.length).toBeGreaterThan(0);
	expect(cacheSnapshot.every(({ name }) => name.startsWith('recica-tools-'))).toBe(true);
	expect(cacheSnapshot.flatMap(({ urls }) => urls).every((url) => !new URL(url).search)).toBe(true);
	expect(JSON.stringify(cacheSnapshot)).not.toContain(privateMarker);
});
