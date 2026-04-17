# recica.dev

`recica.dev` is the flagship personal site for Drilon Reçica. It is not a generic portfolio, not a blog hub, and not a multi-app dashboard. Its job is to present a clear professional identity, selected proof, curated work history, and a direct path to contact in one fast static site.

This app owns the personal brand surface of the repository:

- canonical identity
- flagship copy
- selected case studies
- CV access
- personal SEO and structured data

`tools.recica.dev` is related, but separate. The flagship links to it as proof of builder depth; it does not embed or proxy the tools app.

## Domain Role

The intended public role of this site is:

- primary personal domain: `https://recica.dev`
- flagship identity: `Drilon Reçica`
- professional positioning: `Senior Mobile & Product Engineer`
- audience: hiring managers, founders, product teams, and consulting leads
- output style: selective, senior, production-oriented

This app is deliberately narrow in scope. It should answer five questions quickly:

1. Who is Drilon Reçica?
2. What kind of engineering/product work does he do?
3. Which projects best prove that?
4. What else supports that story?
5. How can someone contact him or review the CV?

## Public Surface

### Routes

| Route | Purpose | Notes |
| --- | --- | --- |
| `/` | One-page flagship homepage | Main public entry point |
| `/about` | Compatibility redirect | Redirects to `/#about` |
| `/cv.pdf` | Public CV download | Static file in `public/` |

### Anchored Sections

The homepage is a single long-form page with stable anchor targets:

- `#work`
- `#tools`
- `#experience`
- `#about`
- `#contact`

These anchors are part of the public interface and should stay stable unless there is a strong reason to break inbound links.

### Static Assets and Metadata Surface

The app also publishes:

- favicon set at the public root
- `site.webmanifest`
- `robots.txt`
- generated sitemap via the Astro sitemap integration
- social preview image at `/og-image.png`

## Product Architecture

The site is intentionally content-driven rather than CMS-driven. There is no database, no admin UI, and no content pipeline. Most of the public story lives in one structured TypeScript file:

- [`src/lib/site-content.ts`](./src/lib/site-content.ts)

That file is the source of truth for:

- site identity and top-level metadata
- section copy
- navigation
- hero actions
- proof items
- case studies
- featured tools
- experience snapshot
- working principles
- contact links
- footer links

This makes content maintenance predictable. Changing the flagship story is usually a content edit, not a component rewrite.

### Section Order

The page is intentionally ordered as:

1. Hero
2. Proof strip
3. Selected work
4. Featured tools
5. Experience snapshot
6. How I work
7. Collaboration
8. Contact
9. Footer

That order is part of the product design. It puts identity and proof ahead of chronology.

### Content Model

| Export in `site-content.ts` | Responsibility |
| --- | --- |
| `siteConfig` | Name, role, title, description, email, CV path, OG image, social links |
| `sectionCopy` | Section kickers, titles, and intros |
| `navigation` | Header anchor navigation |
| `heroActions` | Hero CTA stack |
| `proofItems` | Short evidence statements for the proof strip |
| `caseStudies` | The three flagship work stories, including stacks and qualitative outcomes |
| `featuredTools` | Curated links into `tools.recica.dev` |
| `experienceItems` | Short timeline snapshot |
| `principles` | "How I Work" section content |
| `contactLinks` | Contact destinations and hierarchy |
| `footerLinks` | Footer utilities |

## Technical Architecture

### Framework and Runtime

`recica.dev` is built with Astro as a static site.

| Concern | Implementation |
| --- | --- |
| Framework | Astro 5 |
| Build output | Static `dist/` output |
| Styling | Tailwind CSS v4 via Vite plugin plus custom global CSS |
| Fonts | `@fontsource/inter` and `@fontsource/jetbrains-mono` |
| Type safety | `astro/tsconfigs/strict` |
| Sitemap generation | `@astrojs/sitemap` |
| Package manager | npm |

There is no React, no server runtime, no API layer, and no CMS dependency. That is intentional. The site does not need dynamic infrastructure.

### Astro Structure

| Path | Responsibility |
| --- | --- |
| [`src/pages/index.astro`](./src/pages/index.astro) | Homepage composition |
| [`src/pages/about.astro`](./src/pages/about.astro) | Static compatibility redirect to `/#about` |
| [`src/layouts/BaseLayout.astro`](./src/layouts/BaseLayout.astro) | Global document shell, fonts, skip link, header/footer |
| [`src/components/blocks/`](./src/components/blocks) | Page sections |
| [`src/components/site/`](./src/components/site) | Header and footer |
| [`src/components/seo/Meta.astro`](./src/components/seo/Meta.astro) | Canonical tags, social tags, JSON-LD |
| [`src/styles/global.css`](./src/styles/global.css) | Theme tokens and main visual system |
| [`src/styles/verbose.css`](./src/styles/verbose.css) | Verbose/debug styling |

### TypeScript Configuration

The app uses Astro strict TypeScript settings and local import aliases:

- `@/components/*`
- `@/layouts/*`
- `@/assets/*`
- `@/lib/*`
- `@/scripts/*`

Those aliases are defined in [`tsconfig.json`](./tsconfig.json).

## SEO, Canonical, and Structured Data

This app is intentionally opinionated about canonical identity.

- Astro `site` is fixed to `https://recica.dev`
- canonical URLs are built from `Astro.site` and `Astro.url.pathname`
- the `Person` schema points to `https://recica.dev`
- the `WebSite` schema also points to `https://recica.dev`
- the public role used in schema is `Senior Mobile & Product Engineer`

Relevant files:

- [`astro.config.mjs`](./astro.config.mjs)
- [`src/components/seo/Meta.astro`](./src/components/seo/Meta.astro)
- [`public/site.webmanifest`](./public/site.webmanifest)

This means the repository treats `recica.dev` as the only personal-site canonical. If infrastructure serves the app on any alias hostname, the metadata should still reinforce `recica.dev`.

## Visual System

The site uses a dark graphite flagship theme with restrained petrol-teal accents. The design goal is:

- premium rather than flashy
- technical rather than "cyber"
- editorial hierarchy rather than tile overload
- serious, but not cold

The main theme logic lives in:

- [`src/styles/global.css`](./src/styles/global.css)

Typography is intentionally narrow:

- Inter for headings and body copy
- JetBrains Mono for labels, metadata, and utility accents

## Verbose / Blueprint Inspection Mode

The app includes an internal debug mode for visually inspecting rendered components. This is not part of the public product, but it is useful during design and layout work.

Relevant files:

- [`src/lib/verbose.ts`](./src/lib/verbose.ts)
- [`src/scripts/BlueprintLabel.ts`](./src/scripts/BlueprintLabel.ts)
- [`src/styles/verbose.css`](./src/styles/verbose.css)

Behavior:

- state is stored in `localStorage` under `recica.verbose`
- when enabled, the document gets `data-mode="verbose"`
- a blueprint overlay can inspect hovered/clicked elements
- component labels can come from `data-blueprint` attributes

If you need to force it on locally:

```js
localStorage.setItem('recica.verbose', 'true');
location.reload();
```

Disable it with:

```js
localStorage.setItem('recica.verbose', 'false');
location.reload();
```

## File Layout

```text
recica/
  astro.config.mjs
  package.json
  tsconfig.json
  public/
    cv.pdf
    og-image.png
    favicon.svg
    favicon.ico
    favicon-96x96.png
    apple-touch-icon.png
    site.webmanifest
    robots.txt
  src/
    components/
      blocks/
      seo/
      site/
    layouts/
      BaseLayout.astro
    lib/
      site-content.ts
      verbose.ts
    pages/
      about.astro
      index.astro
    scripts/
      BlueprintLabel.ts
    styles/
      global.css
      verbose.css
```

## Development

### Requirements

- Node.js 20 or newer
- npm

### Install

```bash
npm install
```

### Start the local dev server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Operational Notes

- There is currently no dedicated automated test suite for `recica`.
- The primary automated quality gate is a successful Astro build.
- Content changes usually belong in `site-content.ts`.
- Layout or presentation changes usually belong in block components or `global.css`.
- SEO changes usually belong in `Meta.astro` and `astro.config.mjs`.

## Deployment Model

This app is suitable for static hosting. The expected deployment model is:

1. install dependencies
2. run `npm run build`
3. deploy the generated `dist/` directory

Because this is a static Astro site:

- there is no application server to keep running
- there is no database migration step
- there are no server-side secrets required for basic operation

## Editing Guidance

Use the smallest change that matches the concern:

- change story/copy/data in `src/lib/site-content.ts`
- change section structure in `src/components/blocks/*`
- change document-wide metadata in `src/components/seo/Meta.astro`
- change canonical site configuration in `astro.config.mjs`
- change visual language in `src/styles/global.css`

Avoid turning this app into:

- a blog engine
- a dashboard
- a multi-page content maze
- a dynamic app shell for `tools`

Its strength is clarity and restraint.
