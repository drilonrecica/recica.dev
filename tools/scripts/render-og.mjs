// Renders static/og-default.png (1200x630) with the installed Playwright
// browser and the self-hosted fonts. Run `pnpm og` after changing the brand.
import { writeFile, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('..', import.meta.url));
const fontDir = (pkg) =>
	pathToFileURL(path.join(root, 'node_modules', '@fontsource', pkg, 'files')).href;
const inter = fontDir('inter');
const mono = fontDir('jetbrains-mono');

const html = `<!doctype html><html><head><style>
  @font-face { font-family: Inter; font-weight: 600; src: url(${inter}/inter-latin-600-normal.woff2) format("woff2"); }
  @font-face { font-family: Mono; font-weight: 700; src: url(${mono}/jetbrains-mono-latin-700-normal.woff2) format("woff2"); }
  @font-face { font-family: Mono; font-weight: 400; src: url(${mono}/jetbrains-mono-latin-400-normal.woff2) format("woff2"); }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; }
  body { background: #0c0f0e; color: #edf0ec; font-family: Inter, sans-serif; position: relative;
    background-image: linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px); background-size: 100% 32px; }
  .frame { position: absolute; inset: 40px; border: 2px solid #3e4a43; padding: 56px 64px; display: grid; grid-template-rows: auto 1fr auto; gap: 24px; }
  .kicker { font-family: Mono, monospace; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 20px; color: #7fe0b0; }
  .title { font-weight: 600; letter-spacing: -0.04em; line-height: 1.02; font-size: 84px; max-width: 980px; }
  .sub { margin-top: 22px; font-size: 30px; color: #a7b0ab; line-height: 1.3; max-width: 900px; }
  .tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
  .tags span { border: 1.5px solid #3e4a43; padding: 8px 12px; font-family: Mono; font-size: 18px; text-transform: uppercase; color: #a7b0ab; letter-spacing: 0.04em; }
  .foot { display: flex; justify-content: space-between; font-family: Mono; font-size: 20px; color: #8b948f; letter-spacing: 0.08em; text-transform: uppercase; }
  .foot b { color: #7fe0b0; }
  .mark { position: absolute; right: 64px; top: 56px; width: 72px; height: 72px; border: 2px solid #3e4a43; display: grid; place-items: center; color: #7fe0b0; font-family: Mono; font-weight: 700; font-size: 30px; letter-spacing: -0.06em; }
</style></head><body><div class="frame">
  <div class="kicker">Private browser utilities</div>
  <div><div class="title">Paste anything. The right tool is one keystroke away.</div>
    <div class="sub">24 local-first tools for JSON, JWTs, Base64, URLs, regex, hashes, timestamps, diffs, and more. No accounts, no uploads, no tracking.</div>
    <div class="tags"><span>JSON</span><span>JWT</span><span>Base64</span><span>Regex</span><span>Diff</span><span>QR</span><span>Hash</span><span>Timestamp</span></div></div>
  <div class="foot"><span><b>tools.recica.dev</b></span><span>Runs in your browser</span></div>
  <div class="mark">RT</div>
</div></body></html>`;

const outDir = path.join(root, 'static');
const tmp = path.join(outDir, '.og.html');
await writeFile(tmp, html);
const browser = await chromium.launch();
try {
	const page = await browser.newPage({
		viewport: { width: 1200, height: 630 },
		deviceScaleFactor: 1
	});
	await page.goto(pathToFileURL(tmp).href);
	await page.evaluate(() => document.fonts.ready);
	const png = await page.screenshot({
		type: 'png',
		clip: { x: 0, y: 0, width: 1200, height: 630 }
	});
	await writeFile(path.join(outDir, 'og-default.png'), png);
	process.stdout.write(`rendered static/og-default.png (${(png.length / 1024).toFixed(0)} KB)\n`);
} finally {
	await browser.close();
	await rm(tmp);
}
