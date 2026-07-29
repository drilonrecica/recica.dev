# recica.dev

The flagship personal publication for `https://recica.dev`.

Recica owns Drilon Reçica’s professional identity, selected work, experience,
working principles, CV, and contact paths. It is intentionally independent from
the Tools utility product and the Labs experiment publication.

## Publication model

The current visual direction is the **Technical Dossier**:

- dark-only editorial interface
- compact labels, numbered records, and strong typographic hierarchy
- no theme toggle or presentation JavaScript
- real About and case-study documents rather than a single oversized homepage
- restrained links to Tools and Labs as independent publications

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
| `/work/wohin-du-willst`   | Deutsche Bahn case study                   |
| `/work/qisara`            | Qisara case study                          |
| `/work/edeka-scan-and-go` | EDEKA case study                           |
| `/404`                    | Generated branded not-found document       |
| `/robots.txt`             | Fixed-origin crawler policy                |
| `/sitemap-index.xml`      | Astro-generated sitemap index              |
| `/sitemap-0.xml`          | Crawlable flagship routes; excludes `/404` |
| `/cv.pdf`                 | Existing downloadable CV contract          |

The canonical origin is fixed in `astro.config.mjs` as
`https://recica.dev`. Public routes are indexable; the 404 document is noindex.

## Architecture

| Concern         | Implementation                               |
| --------------- | -------------------------------------------- |
| Framework       | Astro 7, static output                       |
| Styling         | Tailwind CSS v4 plus `src/styles/global.css` |
| Fonts           | Self-hosted Inter and JetBrains Mono         |
| Content source  | Typed records in `src/lib/site-content.ts`   |
| Metadata        | `src/components/seo/Meta.astro`              |
| Sitemap         | `@astrojs/sitemap`                           |
| Tests           | Playwright and axe-core                      |
| Package manager | `pnpm@11.18.0` with an independent lockfile  |

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
```

The browser suite checks all public pages, fixed canonical metadata, stable
anchors, sitemap membership, no presentation scripts, genuine 404 behavior,
and automated WCAG 2.2 A/AA rules on the homepage, About, and every case study.

## Deployment

Recica remains a separate Coolify Nixpacks resource:

- build with Node 24 and the pinned pnpm release
- enable the Coolify static-site option
- publish `dist/`
- keep `https://recica.dev` as the canonical production origin

No Node process is required after the build. Cloudflare and Coolify remain the
authoritative production infrastructure layers.
