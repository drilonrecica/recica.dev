import { expect, test } from '@playwright/test';

test('homepage search and quick-open work', async ({ page }) => {
	await page.goto('/');
	await expect(
		page.getByRole('heading', {
			name: /free browser tools for developers and everyday technical work/i
		})
	).toBeVisible();

	const featuredSection = page
		.locator('section.surface-panel')
		.filter({ has: page.getByText('Featured Tools') });
	await expect(featuredSection.locator('a').nth(0)).toContainText('JSON Formatter / Validator');
	await expect(featuredSection.locator('a').nth(1)).toContainText('Base64 Encoder / Decoder');
	await expect(featuredSection.locator('a').nth(2)).toContainText('QR Code Generator');

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

test('theme toggle persists a theme change', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: /toggle theme/i }).click();
	await page.reload();
	await expect(page.locator('html')).not.toHaveClass(/dark/);
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
	await expect(page.locator('.status-pill.status-error')).toContainText(
		/(invalid json|unexpected token)/i
	);
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
	await expect(page.getByText('json%20formatter')).toBeVisible();

	await page.getByLabel('Source').fill('%E0%A4%A');
	await page.getByRole('button', { name: 'Decode' }).click();
	await expect(page.getByText(/could not decode this value/i)).toBeVisible();
});

test('base64 route encodes text and rejects malformed decode input', async ({ page }) => {
	await page.goto('/base64');
	await page.getByLabel('Source').fill('Recica Tools');
	await page.getByRole('button', { name: 'Encode' }).click();
	await expect(page.getByText('UmVjaWNhIFRvb2xz')).toBeVisible();

	await page.getByLabel('Source').fill('abc_def');
	await page.getByRole('button', { name: 'Decode' }).click();
	await expect(page.getByText(/use standard base64 text only/i)).toBeVisible();
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
	await expect(page.getByText('2024-05-10T12:00:00.000Z')).toBeVisible();

	await page.getByLabel('Unix timestamp').fill('abc');
	await page.getByRole('button', { name: 'Convert' }).click();
	await expect(page.getByText(/enter a whole unix timestamp/i)).toBeVisible();
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
	expect(robotsText).toContain('Allow: /');
	expect(robotsText).toMatch(/Sitemap: https?:\/\/[^\n]+\/sitemap\.xml/);

	const sitemap = await request.get('/sitemap.xml');
	expect(sitemap.ok()).toBeTruthy();
	const sitemapXml = await sitemap.text();
	expect(sitemapXml).toContain('<urlset');
	expect(sitemapXml).toMatch(/<loc>https?:\/\/[^<]+\/<\/loc>/);
	expect(sitemapXml).toContain('/json</loc>');
	expect(sitemapXml).toContain('/robots</loc>');
});

test('regex route previews matches and reports invalid patterns', async ({ page }) => {
	await page.goto('/regex');
	await page.locator('#regex-pattern').fill('(json)');
	await page.locator('#regex-source').fill('json\njson tools');
	await expect(page.getByText(/2 matches found/i)).toBeVisible();
	await expect(page.getByText('Match 1 · 0-4')).toBeVisible();

	await page.locator('#regex-pattern').fill('[');
	await expect(page.getByText(/invalid regular expression/i)).toBeVisible();
});

test('uuid route generates batches and validates count bounds', async ({ page }) => {
	await page.goto('/uuid');
	await page.getByLabel('Count').fill('3');
	await page.getByRole('button', { name: 'Generate' }).click();
	await expect(page.getByText(/3 uuids ready/i)).toBeVisible();

	await page.getByLabel('Count').fill('0');
	await page.getByRole('button', { name: 'Generate' }).click();
	await expect(page.locator('.status-pill.status-error')).toContainText('between 1 and 50');
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
	await expect(page.getByText('?tag=json&tag=tools')).toBeVisible();

	await page.getByLabel('Raw query string').fill('?bad=%E0%A4%A');
	await page.getByRole('button', { name: 'Parse' }).click();
	await expect(page.getByText(/could not parse this query string/i)).toBeVisible();
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
	await expect(page.locator('.surface-panel', { hasText: 'Words' }).first()).toContainText('3');
	await expect(page.locator('.surface-panel', { hasText: 'Paragraphs' }).first()).toContainText(
		'2'
	);
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
	await expect(page.getByText(/could not parse this color/i)).toBeVisible();
});

test('jwt route decodes payloads and rejects malformed tokens', async ({ page }) => {
	await page.goto('/jwt');
	await page.getByRole('button', { name: 'Inspect' }).click();
	await expect(page.getByText(/jwt decoded locally/i)).toBeVisible();
	await expect(page.getByText(/"sub": "123"/)).toBeVisible();

	await page.getByLabel('JWT').fill('abc');
	await page.getByRole('button', { name: 'Inspect' }).click();
	await expect(page.getByText(/must contain header, payload, and signature/i)).toBeVisible();
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
	await expect(preview.getByRole('heading', { name: 'Recica Preview' })).toBeVisible();

	await page
		.getByLabel('HTML')
		.fill('<button onclick="alert(1)">Safe</button><script>document.body.append("owned")</script>');
	await expect(preview.getByRole('button', { name: 'Safe' })).toBeVisible();
	await expect(preview.locator('body')).not.toContainText('owned');
});

test('device route reports browser-side information', async ({ page }) => {
	await page.goto('/device');
	await expect(page.getByText('userAgent')).toBeVisible();
	await expect(page.getByText('viewport', { exact: true })).toBeVisible();
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
	await expect(page.getByText(/ean-13 accepts 12 digits/i)).toBeVisible();
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
	await expect(page.getByText(/must contain a <urlset> or <sitemapindex>/i)).toBeVisible();
});
