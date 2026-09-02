# recica.dev

The flagship personal publication for `https://recica.dev`.

Recica owns Drilon Reçica’s professional identity, selected work, experience,
working principles, CV, and contact paths. It is intentionally independent from
the Tools utility product and the Labs experiment publication.

## Publication model

The current visual direction is the **Technical Dossier**, evolved for its
primary reader, a hiring manager deciding whether to interview:

- dark by default with a CSS-only light scheme that follows the system
  preference (`prefers-color-scheme`); no toggle, no presentation JavaScript
- mono labels, hairline rules, and one accent color; numbering appears only
  where order carries meaning (the case-study decision logs)
- solid backgrounds everywhere so automated contrast checks can never go
  blind; every text/background pair meets WCAG AA
- a hero that states location, time zone, languages, and availability
- case studies as narratives: context, constraints, approach, a numbered
  decision log pairing each choice with its trade-off, and a reflection
- an HTML CV at `/cv` rendered from the same content file as the site, with a
  print stylesheet; `/cv.pdf` remains the download
- per-page social images in `public/og/`, rendered once by `pnpm og`
- restrained links to Tools and Labs as independent publications

### Next iteration

- Case-study screenshots. The content model already reserves a `screenshots`
  slot per case study and the templates render a gallery when it is filled.
  Ship real captures (store listings or own captures in device frames) as the
  next MVP.
- Portrait. Drop `src/assets/portrait.jpg` (or `.png`/`.webp`) into place and
  rerun `pnpm og`; until then the hero shows the monogram plate.

The homepage retains the stable public anchors:

- `#work`
- `#experience`
- `#about`
- `#contact`
- `#tools`

## Public routes

| Route                     | Responsibility                             |
| ------------------------- | ------------------------------------------ |
| `/`                       | Flagship dossier and all stable anchors    |
| `/about`                  | Canonical professional profile             |
| `/cv`                     | HTML CV from the content file, printable   |
| `/work/wohin-du-willst`   | Deutsche Bahn case study                   |
| `/work/qisara`            | Qisara case study                          |
| `/work/edeka-scan-and-go` | EDEKA case study                           |
| `/404`                    | Generated branded not-found document       |
| `/robots.txt`             | Fixed-origin crawler policy                |
| `/sitemap-index.xml`      | Astro-generated sitemap index              |
| `/sitemap-0.xml`          | Crawlable flagship routes; excludes `/404` |
| `/cv.pdf`                 | Existing downloadable CV contract          |

The canonical origin is fixed in `astro.config.mjs` as
`https://recica.dev`. Builds default to `noindex, nofollow`; the production
resource must set `PUBLIC_INDEXING_ENABLED=true`. The 404 document remains
noindex in every environment.

## Architecture

| Concern         | Implementation                                        |
| --------------- | ----------------------------------------------------- |
| Framework       | Astro 7, static output                                |
| Styling         | Tailwind CSS v4 plus `src/styles/global.css`          |
| Fonts           | Self-hosted Inter and JetBrains Mono                  |
| Content source  | Typed records in `src/lib/site-content.ts`            |
| Metadata        | `src/components/seo/Meta.astro`                       |
| Sitemap         | `@astrojs/sitemap`                                    |
| Social images   | `public/og/*.png` rendered by `scripts/render-og.mjs` |
| Tests           | Playwright and axe-core                               |
| Package manager | `pnpm@11.18.0` with an independent lockfile           |

There is no backend, database, authentication layer, CMS, client framework, or
application server. Astro emits the complete publication into `dist/`.

### Main source areas

```text
src/
  components/
    blocks/       Homepage dossier sections
    seo/          Canonical metadata and structured data
    site/         Shared header and footer
  layouts/        Shared static document shell
  lib/            Typed site content
  pages/
    work/         Generated case-study routes
    404.astro
    about.astro
    cv.astro
    index.astro
    robots.txt.ts
  styles/         Technical Dossier visual system
```

Case-study pages are generated from the same `caseStudies` records used by the
homepage. This keeps titles, roles, periods, outcomes, stacks, and source links
aligned without creating a shared runtime abstraction.

## Development

Requirements:

- Node.js 24 LTS
- pnpm 11.18.0

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Quality gates:

```bash
pnpm check
pnpm lint
pnpm build
pnpm test:e2e
pnpm og   # after changing names, roles, or case studies
```

The browser suite checks all public pages, fixed canonical metadata, stable
anchors, sitemap membership, no presentation scripts, genuine 404 behavior,
per-page social images, structured data, and automated WCAG 2.2 A/AA rules on
every public route in both color schemes. It also fails when axe reports a
contrast check as _incomplete_, so a gradient or translucent background can
never hide a contrast failure again.

## Deployment

Recica remains a separate Coolify Nixpacks resource:

- build with Node 24 and the pinned pnpm release
- enable the Coolify static-site option
- publish `dist/`
- keep `https://recica.dev` as the canonical production origin

No Node process is required after the build. Cloudflare and Coolify remain the
authoritative production infrastructure layers.
