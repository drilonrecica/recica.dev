import { expect, isAllowedBrowserRequest, test } from './fixtures';

test('browser request policy rejects arbitrary same-origin and cross-origin URLs', () => {
	expect(isAllowedBrowserRequest('http://127.0.0.1:4174/json', 'http://127.0.0.1:4174')).toBe(true);
	expect(
		isAllowedBrowserRequest('http://127.0.0.1:4174/private-input-marker', 'http://127.0.0.1:4174')
	).toBe(false);
	expect(isAllowedBrowserRequest('https://example.com/', 'http://127.0.0.1:4174')).toBe(false);
	expect(
		isAllowedBrowserRequest(
			'http://127.0.0.1:4174/json',
			'http://127.0.0.1:4174',
			'POST',
			'private-input'
		)
	).toBe(false);
});

test('homepage search and quick-open work', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Utility Switchboard', { exact: true })).toBeVisible();
	await expect(
		page.getByRole('heading', {
			name: /free browser tools for developers and everyday technical work/i
		})
	).toBeVisible();

	await page.getByLabel('Find a tool').fill('json');
	await expect(
		page.getByRole('link', { name: /json formatter \/ validator/i }).first()
	).toBeVisible();
	await page.getByLabel('Find a tool').fill('base64');
	await expect(page.getByRole('link', { name: /base64 encoder/i }).first()).toBeVisible();

	await page.getByRole('button', { name: /^search/i }).click();
	await expect(page.getByRole('dialog', { name: 'Tool search' })).toBeVisible();
	await page.getByLabel('Search tools').fill('timestamp');
	await page.keyboard.press('Enter');
	await expect(page).toHaveURL(/\/timestamp$/);
});

test('tool index lists every tool exactly once, grouped by category', async ({ page }) => {
	await page.goto('/');

	await expect(page.locator('[data-tool-number]')).toHaveCount(24);
	await expect(page.locator('.index__group h2').first()).toHaveText('Format');
	await expect(page.getByRole('link', { name: /json formatter \/ validator/i })).toHaveCount(1);
});

test('privacy route explains browser-memory processing and has a production canonical', async ({
	page
}) => {
	await page.goto('/privacy');

	await expect(
		page.getByRole('heading', { level: 1, name: 'Privacy by construction' })
	).toBeVisible();
	await expect(page.getByText(/input and output stay in browser memory/i)).toBeVisible();
	await expect(
		page.getByText(/only your theme override and the identifiers of favorite/i)
	).toBeVisible();
	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		'href',
		'https://tools.recica.dev/privacy'
	);
});

test('tool operation makes no network request and exposes its reference content', async ({
	page
}) => {
	await page.goto('/json');
	const operationRequests: string[] = [];
	// Self-hosted fonts and hashed assets may still stream in; only tool data matters.
	page.on('request', (request) => {
		if (!new URL(request.url()).pathname.startsWith('/_app/immutable/')) {
			operationRequests.push(request.url());
		}
	});

	await page.getByLabel('Raw JSON').fill('{"network":"none"}');
	await page.getByRole('button', { name: 'Format' }).click();
	await expect(page.getByText(/formatted output ready/i)).toBeVisible();
	await expect(page.getByText('When to use it', { exact: true })).toBeVisible();
	await expect(page.getByText('RFC 8259 — JSON', { exact: true })).toBeVisible();
	expect(operationRequests).toEqual([]);
});

test('switchboard remains usable at a narrow mobile viewport', async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 720 });
	await page.goto('/json');

	await expect(
		page.getByRole('heading', { level: 1, name: 'JSON Formatter / Validator' })
	).toBeVisible();
	await expect(page.getByLabel('Tool operating contract')).toBeVisible();
	const headerBox = await page.getByRole('banner').boundingBox();
	const headingBox = await page
		.getByRole('heading', { level: 1, name: 'JSON Formatter / Validator' })
		.boundingBox();
	expect(headingBox?.y).toBeGreaterThanOrEqual(headerBox?.height ?? 0);
	const hasHorizontalOverflow = await page.evaluate(
		() => document.documentElement.scrollWidth > document.documentElement.clientWidth
	);
	expect(hasHorizontalOverflow).toBe(false);
});

test('homepage category pills filter the tool grid', async ({ page }) => {
	await page.goto('/');
	const toolIndexSection = page
		.locator('section')
		.filter({ has: page.getByRole('heading', { name: 'Browse all tools' }) })
		.last();

	await expect(page.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');

	await page.getByRole('button', { name: 'Security' }).click();
	await expect(
		toolIndexSection.getByRole('link', { name: /password generator/i }).first()
	).toBeVisible();
	await expect(
		toolIndexSection.getByRole('link', { name: /hash generator/i }).first()
	).toBeVisible();
	await expect(
		toolIndexSection.getByRole('link', { name: /jwt inspector/i }).first()
	).toBeVisible();
	await expect(
		toolIndexSection.getByRole('link', { name: /json formatter \/ validator/i })
	).toHaveCount(0);

	await page.getByRole('button', { name: 'All' }).click();
	await expect(page.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
	await expect(
		toolIndexSection.getByRole('link', { name: /json formatter \/ validator/i }).first()
	).toBeVisible();
});

test('theme follows the system until the toggle stores an override', async ({ page }) => {
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/');
	await expect(page.locator('html')).not.toHaveAttribute('data-theme', /./);
	expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
		'rgb(12, 15, 14)'
	);

	await page.getByRole('button', { name: /toggle theme/i }).click();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	await page.reload();
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
	expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
		'rgb(246, 247, 245)'
	);
	expect(await page.evaluate(() => localStorage.getItem('recica-theme'))).toBe('light');
});

test('qr route switches presets, renders output, and handles an oversized value', async ({
	page
}) => {
	await page.goto('/qr');
	await expect(page.locator('canvas')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Download PNG' })).toBeEnabled();
	await expect(page.getByRole('button', { name: 'Download SVG' })).toBeEnabled();

	await page.getByRole('button', { name: 'Wi-Fi' }).click();
	await expect(page.getByLabel('SSID')).toBeVisible();
	await expect(page.getByRole('button', { name: 'Download PNG' })).toBeDisabled();
	await page.getByLabel('SSID').fill('Recica Lab');
	await page.getByLabel('Password').fill('secret123');
	await expect(page.locator('canvas')).toBeVisible();
	await expect(page.getByText('WIFI:T:WPA;S:Recica Lab;P:secret123;;')).toBeVisible();

	await page.getByRole('button', { name: 'Text' }).click();
	await page.getByLabel('Text').fill('x'.repeat(8000));
	await expect(page.getByText(/too large for a qr code/i).first()).toBeVisible();
});

test('json route formats valid input and reports invalid input', async ({ page }) => {
	await page.goto('/json');
	await page.getByLabel('Raw JSON').fill('{"lab":true}');
	await page.getByRole('button', { name: 'Format' }).click();
	await expect(page.getByText(/formatted output ready/i)).toBeVisible();
	await expect(page.getByText(/"lab": true/)).toBeVisible();

	await page.getByLabel('Raw JSON').fill('{"lab":}');
	await page.getByRole('button', { name: 'Validate' }).click();
	await expect(page.getByRole('status')).toContainText(/(invalid json|unexpected token)/i);
	// The gutter marks the failing line and the overlay marks the column.
	await expect(page.locator('.codefield__gutter [data-mark]')).toHaveCount(1);
	await expect(page.locator('.codefield__overlay mark')).toHaveCount(1);
});

test('json route rejects oversized input before parsing without truncating it', async ({
	page
}) => {
	await page.goto('/json');
	const oversizedInput = `"${'x'.repeat(3 * 1024 * 1024)}"`;
	await page.getByLabel('Raw JSON').fill(oversizedInput);
	await page.getByRole('button', { name: 'Format' }).click();

	await expect(page.getByRole('status')).toContainText(/local processing limit is 3 MiB/i);
	await expect(page.getByRole('status')).toContainText(/nothing was uploaded or truncated/i);
	await expect(page.getByLabel('Raw JSON')).toHaveValue(oversizedInput);
	await expect(page.getByText('Formatted output ready.')).toHaveCount(0);
});

test('password route regenerates and blocks empty charset selection', async ({ page }) => {
	await page.goto('/password');
	await expect(page.getByText('Generated Password', { exact: true })).toBeVisible();

	await page.getByRole('button', { name: /Uppercase/i }).click();
	await page.getByRole('button', { name: /Lowercase/i }).click();
	await page.getByRole('button', { name: /Numbers/i }).click();
	await page.getByRole('button', { name: /Symbols/i }).click();
	await expect(page.getByText(/enable at least one character set/i)).toBeVisible();
});

test('url route encodes values and shows malformed decode errors', async ({ page }) => {
	await page.goto('/url');
	await page.getByLabel('Source').fill('json formatter');
	await page.getByRole('button', { name: 'Component' }).click();
	await page.getByRole('button', { name: 'Encode' }).click();
	await expect(page.getByText('json%20formatter', { exact: true })).toBeVisible();

	await page.getByLabel('Source').fill('%E0%A4%A');
	await page.getByRole('button', { name: 'Decode' }).click();
	await expect(page.getByRole('status')).toContainText(/could not decode this value/i);
});

test('base64 route encodes text and rejects malformed decode input', async ({ page }) => {
	await page.goto('/base64');
	await page.getByLabel('Source').fill('Recica Tools');
	await page.getByRole('button', { name: 'Encode' }).click();
	await expect(page.getByText('UmVjaWNhIFRvb2xz', { exact: true })).toBeVisible();

	await page.getByLabel('Source').fill('abc_def');
	await page.getByRole('button', { name: 'Decode' }).click();
	await expect(page.getByRole('status')).toContainText(/use standard base64 text only/i);
});

test('slug route generates output and clears to empty state', async ({ page }) => {
	await page.goto('/slug');
	await page.getByLabel('Source title').fill('Recica Dév: JSON Validator');
	await expect(page.getByText('recica-dev-json-validator')).toBeVisible();

	await page.getByLabel('Source title').fill('');
	await expect(page.getByText(/enter a title to generate a slug/i)).toBeVisible();
});

test('timestamp route converts values and reports invalid input', async ({ page }) => {
	await page.goto('/timestamp');
	await page.getByLabel('Unix timestamp').fill('1715342400');
	await page.getByRole('button', { name: 'Convert' }).click();
	await expect(page.getByText('2024-05-10T12:00:00.000Z', { exact: true })).toBeVisible();

	await page.getByLabel('Unix timestamp').fill('abc');
	await page.getByRole('button', { name: 'Convert' }).click();
	await expect(page.getByRole('status')).toContainText(/enter a whole unix timestamp/i);
});

test('diff route highlights changed lines', async ({ page }) => {
	await page.goto('/diff');
	await page.getByLabel('Original').fill('alpha\nbeta');
	await page.getByLabel('Changed').fill('alpha\nbravo\ncharlie');
	await expect(
		page.getByText(/changed lines detected/i).or(page.getByText(/changed line detected/i))
	).toBeVisible();
	await expect(page.getByText('charlie')).toBeVisible();
});

test('homepage shows new routes and the external resource section', async ({ page }) => {
	await page.goto('/');
	await page.getByLabel('Find a tool').fill('regex');
	await expect(page.getByRole('link', { name: /regex tester/i }).first()).toBeVisible();
	await expect(page.getByRole('link', { name: /albania ipsum/i })).toBeVisible();
});

test('robots.txt and sitemap.xml expose crawlable public urls', async ({ request }) => {
	const robots = await request.get('/robots.txt');
	expect(robots.ok()).toBeTruthy();
	const robotsText = await robots.text();
	expect(robotsText).toContain('User-agent: *');
	expect(robotsText).toContain('Disallow: /');
	expect(robotsText).toMatch(/Sitemap: https?:\/\/[^\n]+\/sitemap\.xml/);

	const sitemap = await request.get('/sitemap.xml');
	expect(sitemap.ok()).toBeTruthy();
	const sitemapXml = await sitemap.text();
	expect(sitemapXml).toContain('<urlset');
	expect(sitemapXml).toMatch(/<loc>https?:\/\/[^<]+\/<\/loc>/);
	expect(sitemapXml).toContain('/json</loc>');
	expect(sitemapXml).toContain('/robots</loc>');
	expect(sitemapXml).toContain('/privacy</loc>');
});

test('regex route previews matches and reports invalid patterns', async ({ page }) => {
	await page.goto('/regex');
	await page.locator('#regex-pattern').fill('(json)');
	await page.locator('#regex-source').fill('json\njson tools');
	await expect(page.getByText(/2 matches found/i)).toBeVisible();
	await expect(page.getByText('Match 1 · 0-4')).toBeVisible();

	await page.locator('#regex-pattern').fill('[');
	await expect(page.getByRole('status')).toContainText(/invalid regular expression/i);
});

test('uuid route generates batches and validates count bounds', async ({ page }) => {
	await page.goto('/uuid');
	await page.getByLabel('Count').fill('3');
	await page.getByRole('button', { name: 'Generate' }).click();
	await expect(page.getByText(/3 uuids ready/i)).toBeVisible();

	await page.getByLabel('Count').fill('0');
	await page.getByRole('button', { name: 'Generate' }).click();
	await expect(page.getByRole('status')).toContainText('between 1 and 50');
});

test('hash route generates digests locally', async ({ page }) => {
	await page.goto('/hash');
	await page.getByLabel('Source').fill('abc');
	await page.getByRole('button', { name: 'Hash' }).click();
	await expect(
		page.getByText('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
	).toBeVisible();
});

test('query route parses values and reports malformed encoding', async ({ page }) => {
	await page.goto('/query');
	await page.getByLabel('Raw query string').fill('?tag=json&tag=tools');
	await page.getByRole('button', { name: 'Parse' }).click();
	await expect(page.getByText('?tag=json&tag=tools', { exact: true })).toBeVisible();

	await page.getByLabel('Raw query string').fill('?bad=%E0%A4%A');
	await page.getByRole('button', { name: 'Parse' }).click();
	await expect(page.getByRole('status')).toContainText(/could not parse this query string/i);
});

test('case route converts text and clears to empty outputs', async ({ page }) => {
	await page.goto('/case');
	await page.getByLabel('Source text').fill('Recica Tools');
	await expect(page.locator('pre').getByText('recicaTools', { exact: true })).toBeVisible();
	await expect(page.locator('pre').getByText('recica_tools', { exact: true })).toBeVisible();

	await page.getByLabel('Source text').fill('');
	await expect(page.getByText(/enter text to convert it/i).first()).toBeVisible();
});

test('counter route updates practical text metrics', async ({ page }) => {
	await page.goto('/counter');
	await page.getByLabel('Source text').fill('One two\n\nThree');
	await expect(page.locator('[data-metric="words"]')).toContainText('3');
	await expect(page.locator('[data-metric="paragraphs"]')).toContainText('2');
});

test('env route parses entries and flags malformed rows', async ({ page }) => {
	await page.goto('/env');
	await page.getByLabel('dotenv text').fill('API_URL=https://recica.dev\nBROKEN LINE');
	await expect(page.getByText(/1 entries .* 1 errors/i)).toBeVisible();
	await expect(page.getByText(/missing "=" separator/i)).toBeVisible();
});

test('color route converts valid values and rejects invalid ones', async ({ page }) => {
	await page.goto('/color');
	await page.getByLabel('Color value').fill('#ffffff');
	await expect(page.getByText('RGB', { exact: true })).toBeVisible();
	await expect(page.getByText('rgb(255, 255, 255)')).toBeVisible();

	await page.getByLabel('Color value').fill('wat');
	await expect(page.getByRole('status')).toContainText(/could not parse this color/i);
});

test('jwt route decodes payloads and rejects malformed tokens', async ({ page }) => {
	await page.goto('/jwt');
	await page.getByRole('button', { name: 'Inspect' }).click();
	await expect(page.getByText(/jwt decoded locally/i)).toBeVisible();
	await expect(page.getByText(/"sub": "123"/)).toBeVisible();

	await page.getByLabel('JWT').fill('abc');
	await page.getByRole('button', { name: 'Inspect' }).click();
	await expect(page.getByRole('status')).toContainText(
		/must contain header, payload, and signature/i
	);
});

test('markdown route renders safe preview output', async ({ page }) => {
	await page.goto('/markdown');
	const preview = page.frameLocator('iframe[title="Markdown preview"]');
	await expect(preview.getByRole('heading', { name: 'Recica Lab' })).toBeVisible();

	await page.getByLabel('Markdown').fill('# Preview\n\n<script>alert(1)</script>');
	await expect(preview.locator('body')).toContainText('<script>alert(1)</script>');
});

test('html route previews markup without executing scripts', async ({ page }) => {
	await page.goto('/html');
	const preview = page.frameLocator('iframe[title="HTML preview"]');
	const previewRequests: string[] = [];
	page.on('request', (request) => {
		if (request.url().includes('private-preview-marker')) previewRequests.push(request.url());
	});
	await expect(preview.getByRole('heading', { name: 'Recica Preview' })).toBeVisible();

	await page
		.getByLabel('HTML')
		.fill(
			'<button onclick="alert(1)">Safe</button>' +
				'<script>document.body.append("owned")</script>' +
				'<img src="/private-preview-marker-image">' +
				'<link rel="stylesheet" href="/private-preview-marker-style">' +
				'<iframe src="/private-preview-marker-frame"></iframe>' +
				'<video src="/private-preview-marker-media"></video>'
		);
	await expect(preview.getByRole('button', { name: 'Safe' })).toBeVisible();
	await expect(preview.locator('body')).not.toContainText('owned');
	await page.waitForTimeout(250);
	expect(previewRequests).toEqual([]);
});

test('device route reports browser-side information', async ({ page }) => {
	await page.goto('/device');
	await expect(page.locator('dt', { hasText: 'userAgent' })).toBeVisible();
	await expect(page.locator('dt', { hasText: 'viewport' })).toBeVisible();
	await expect(page.getByRole('button', { name: 'Copy JSON' })).toBeEnabled();
});

test('barcode route generates previews and validates invalid numeric input', async ({ page }) => {
	await page.goto('/barcode');
	await page.getByRole('button', { name: 'Generate' }).click();
	await expect(page.getByText(/barcode preview ready/i)).toBeVisible();
	await expect(page.locator('img[alt^="Preview of"]')).toBeVisible();

	await page.getByRole('button', { name: 'EAN-13' }).click();
	await page.getByLabel('Value').fill('123');
	await page.getByRole('button', { name: 'Generate' }).click();
	await expect(page.getByRole('status')).toContainText(/ean-13 accepts 12 digits/i);
});

test('sql route formats and minifies source text', async ({ page }) => {
	await page.goto('/sql');
	await page.getByLabel('SQL source').fill('select id, name from users where active = 1');
	await page.getByRole('button', { name: 'Format' }).click();
	await expect(page.getByText(/formatted sql ready/i)).toBeVisible();
	await expect(page.locator('pre').first()).toContainText('FROM users');

	await page.getByRole('button', { name: 'Minify' }).click();
	await expect(page.getByText(/minified sql ready/i)).toBeVisible();
});

test('robots route parses directives and flags malformed lines', async ({ page }) => {
	await page.goto('/robots');
	await page.getByLabel('robots.txt content').fill('User-agent: *\nDisallow: /admin\nBad line');
	await expect(page.getByText(/2 directives .* 1 errors/i)).toBeVisible();
	await expect(page.getByText(/missing ":" separator/i)).toBeVisible();
});

test('sitemap route extracts URLs and reports invalid roots', async ({ page }) => {
	await page.goto('/sitemap');
	await expect(page.getByText(/urlset with 2 urls/i)).toBeVisible();
	await expect(page.getByText('https://recica.dev/tools')).toBeVisible();

	await page.getByLabel('Sitemap XML').fill('<xml></xml>');
	await expect(page.getByRole('status')).toContainText(
		/must contain a <urlset> or <sitemapindex>/i
	);
});
