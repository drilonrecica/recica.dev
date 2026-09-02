// Renders the social preview images into public/og/ using the already
// installed Playwright browser and the self-hosted fonts. Run after changing
// titles, roles, or case studies:
//
//   pnpm og
//
// Output is committed, so the production build has no font or browser dependency.
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = path.join(root, "public", "og");
const fontDir = (pkg) =>
  pathToFileURL(path.join(root, "node_modules", "@fontsource", pkg, "files"))
    .href;

const inter = fontDir("inter");
const mono = fontDir("jetbrains-mono");

// Node 22.18+ and Node 24 strip TypeScript types natively, so the content
// module is imported directly. No build step, no duplicate content.
const site = await import(
  pathToFileURL(path.join(root, "src", "lib", "site-content.ts")).href
);

const { siteConfig, caseStudies, languages } = site;

const assets = await readdir(path.join(root, "src", "assets")).catch(() => []);
const portraitFile = assets.find((file) =>
  /^portrait\.(jpe?g|png|webp)$/i.test(file),
);
const portraitUrl = portraitFile
  ? pathToFileURL(path.join(root, "src", "assets", portraitFile)).href
  : null;

const css = `
  @font-face { font-family: Inter; font-weight: 400; src: url(${inter}/inter-latin-400-normal.woff2) format("woff2"); }
  @font-face { font-family: Inter; font-weight: 500; src: url(${inter}/inter-latin-500-normal.woff2) format("woff2"); }
  @font-face { font-family: Inter; font-weight: 800; src: url(${inter}/inter-latin-800-normal.woff2) format("woff2"); }
  @font-face { font-family: Mono; font-weight: 700; src: url(${mono}/jetbrains-mono-latin-700-normal.woff2) format("woff2"); }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; }
  body {
    background: #090b0d;
    color: #f0f2ef;
    font-family: Inter, sans-serif;
    background-image: linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px);
    background-size: 100% 32px;
    position: relative;
  }
  .frame {
    position: absolute; inset: 40px;
    border: 2px solid #465057;
    padding: 56px 64px;
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: 24px;
  }
  .kicker, .foot, .facts {
    font-family: Mono, monospace; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; font-size: 20px; color: #a8f0c8;
  }
  .foot { display: flex; justify-content: space-between; color: #8a9496; }
  .foot b { color: #a8f0c8; }
  .title { font-weight: 800; letter-spacing: -0.05em; line-height: 0.98; text-wrap: balance; }
  .title.xl { font-size: 116px; }
  .title.lg { font-size: 84px; }
  .sub { margin-top: 22px; font-size: 34px; font-weight: 500; letter-spacing: -0.02em; color: #a3acab; line-height: 1.25; max-width: 900px; }
  .facts { margin-top: 26px; color: #8a9496; font-size: 18px; letter-spacing: 0.06em; }
  .body { display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: end; }
  .portrait { width: 250px; height: 312px; border: 2px solid #465057; object-fit: cover; background: #0f1316; }
  .mark { width: 250px; height: 312px; border: 2px solid #465057; display: grid; place-items: center; color: #a8f0c8; font-family: Mono; font-weight: 700; font-size: 96px; letter-spacing: -0.08em; }
  .tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
  .tags span { border: 1.5px solid #465057; padding: 8px 12px; font-family: Mono; font-size: 18px; text-transform: uppercase; color: #a3acab; letter-spacing: 0.04em; }
`;

const portraitCss = `
  html, body { width: 1200px; height: 1200px; }
  .frame { grid-template-rows: auto 1fr auto; }
  .portrait, .mark { width: 100%; height: 100%; }
  .body { grid-template-columns: 1fr; align-items: stretch; height: 100%; }
`;

const visual = portraitUrl
  ? `<img class="portrait" src="${portraitUrl}" alt="" />`
  : `<div class="mark">DR</div>`;

const page = (
  kicker,
  main,
  extra = "",
) => `<!doctype html><html><head><style>${css}${extra}</style></head>
<body><div class="frame"><div class="kicker">${kicker}</div>${main}
<div class="foot"><span><b>${siteConfig.domain}</b></span><span>${siteConfig.location}</span></div></div></body></html>`;

const documents = [
  {
    name: "home",
    html: page(
      siteConfig.role,
      `<div class="body"><div><div class="title xl">${siteConfig.name}</div>
        <div class="sub">${siteConfig.pitch}</div>
        <div class="facts">${siteConfig.location} · ${languages.map((l) => l.name).join(" · ")} · ${siteConfig.workStyle}</div></div>${visual}</div>`,
    ),
  },
  {
    name: "about",
    html: page(
      "About",
      `<div class="body"><div><div class="title lg">Engineering with product context intact.</div>
        <div class="sub">${siteConfig.name} · ${siteConfig.role}</div></div>${visual}</div>`,
    ),
  },
  {
    name: "cv",
    html: page(
      "Curriculum vitae",
      `<div class="body"><div><div class="title xl">${siteConfig.name}</div>
        <div class="sub">${siteConfig.role} · Android since ${siteConfig.yearsSince}</div>
        <div class="facts">${siteConfig.location} · ${siteConfig.workStyle}</div></div>${visual}</div>`,
    ),
  },
  ...caseStudies.map((study) => ({
    name: study.slug,
    html: page(
      `Case study · ${study.client}`,
      `<div class="body"><div><div class="title lg">${study.title}</div>
        <div class="sub">${study.role} · ${study.period}</div>
        <div class="tags">${study.stack.map((tag) => `<span>${tag}</span>`).join("")}</div></div></div>`,
    ),
  })),
  {
    name: "portrait",
    square: true,
    html: page(
      siteConfig.role,
      `<div class="body">${visual}</div>`,
      portraitCss,
    ),
  },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const doc of documents) {
    const size = doc.square
      ? { width: 1200, height: 1200 }
      : { width: 1200, height: 630 };
    const tab = await browser.newPage({ viewport: size, deviceScaleFactor: 1 });
    const tmp = path.join(outDir, `.${doc.name}.html`);
    await writeFile(tmp, doc.html);
    await tab.goto(pathToFileURL(tmp).href);
    await tab.evaluate(() => document.fonts.ready);
    const png = await tab.screenshot({
      type: "png",
      clip: { x: 0, y: 0, ...size },
    });
    await writeFile(path.join(outDir, `${doc.name}.png`), png);
    await tab.close();
    await rm(tmp);
    console.log(
      `rendered og/${doc.name}.png (${(png.length / 1024).toFixed(0)} KB)`,
    );
  }
} finally {
  await browser.close();
}
