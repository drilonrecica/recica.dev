# Recica Tools

`Recica Tools` is a standalone browser-utility product built for `https://tools.recica.dev`.

Its purpose is simple: provide fast, privacy-first, route-based tools for developers and technical users without accounts, uploads, or backend complexity. The app is intentionally not a SaaS platform, not a content site, and not a generic "AI toolbox." Each tool should solve one practical problem clearly and locally.

## Domain Role

Within the wider `recica.dev` repository, this app owns the utilities product surface.

It is responsible for:

- the tools catalog homepage
- route-level utility pages
- tool-specific metadata and structured data
- local-first interaction patterns
- crawler-facing machine endpoints
- operational deployment for a Node runtime

It is related to the flagship personal site, but it is not a subpage of the flagship. It is its own product with its own public behavior and SEO surface.

## Product Principles

The app is intentionally opinionated.

| Principle | Meaning in this codebase |
| --- | --- |
| Local-first | User input should be processed in the browser whenever practical |
| Privacy-first | No accounts, no tracking flow, no "upload your file to our server" pattern for built-in tools |
| Route-based | Each serious utility gets a dedicated URL and its own metadata |
| Small runtime surface | Runtime dependencies are kept intentionally minimal |
| No tool engine abstraction | Tool logic stays explicit and readable instead of disappearing into a generic framework |
| Searchable catalog | The homepage and quick-search model should make discovery fast |

## Public Surface

### Primary Routes

The homepage at `/` provides:

- brand/positioning
- search input
- featured tools
- category filtering
- full tool directory
- curated external resources

### Built-In Tool Routes

The current app ships 24 tool pages.

#### Format

| Route | Tool | Purpose |
| --- | --- | --- |
| `/json` | JSON Formatter / Validator | Format, validate, and minify JSON with readable parse feedback |
| `/sql` | SQL Formatter / Minifier | Format or minify SQL locally without executing queries |

#### Encoding

| Route | Tool | Purpose |
| --- | --- | --- |
| `/base64` | Base64 Encoder / Decoder | UTF-8 text encoding and decoding with validation |
| `/url` | URL Encoder / Decoder | Encode/decode full URLs or URL components |
| `/query` | Query String Parser / Builder | Parse and rebuild query strings while preserving repeated keys |

#### Share

| Route | Tool | Purpose |
| --- | --- | --- |
| `/qr` | QR Code Generator | Generate QR codes for text, URL, Wi-Fi, email, phone, and SMS with PNG/SVG export |
| `/barcode` | Barcode Generator | Generate Code 128, EAN-13, and UPC-A barcodes with local export |

#### Text

| Route | Tool | Purpose |
| --- | --- | --- |
| `/regex` | Regex Tester | Test ECMAScript patterns with flags, captures, and replace preview |
| `/slug` | Slug Generator | Normalize titles into predictable slugs |
| `/case` | Text Case Converter | Convert strings across common naming conventions |
| `/counter` | Word / Character Counter | Count words, characters, lines, paragraphs, and reading-time estimates |

#### Time

| Route | Tool | Purpose |
| --- | --- | --- |
| `/timestamp` | Timestamp Converter | Convert Unix timestamps to local time and UTC |

#### Security

| Route | Tool | Purpose |
| --- | --- | --- |
| `/password` | Password Generator | Generate passwords with secure browser randomness |
| `/hash` | Hash Generator | Create SHA-256, SHA-384, and SHA-512 digests locally |
| `/jwt` | JWT Inspector | Decode JWT headers and payloads locally for inspection |

#### Compare

| Route | Tool | Purpose |
| --- | --- | --- |
| `/diff` | Text Diff Checker | Compare two text blocks with line and inline change highlighting |

#### Config

| Route | Tool | Purpose |
| --- | --- | --- |
| `/env` | `.env` Parser / Viewer | Parse dotenv content and surface malformed rows and duplicates |

#### Identity

| Route | Tool | Purpose |
| --- | --- | --- |
| `/uuid` | UUID Generator | Generate UUID v4 or v7 values locally, individually or in bulk |

#### Design

| Route | Tool | Purpose |
| --- | --- | --- |
| `/color` | Color Converter | Convert between HEX, RGB(A), and HSL(A) with live swatches |

#### Inspect

| Route | Tool | Purpose |
| --- | --- | --- |
| `/device` | Device / Browser Info | Inspect browser environment, viewport, storage support, and related client details |
| `/robots` | `robots.txt` Parser / Validator | Parse pasted robots directives and flag malformed lines |
| `/sitemap` | Sitemap XML Parser / Validator | Validate pasted XML and extract listed URLs or child sitemaps |

#### Preview

| Route | Tool | Purpose |
| --- | --- | --- |
| `/markdown` | Markdown Previewer | Render sanitized Markdown locally |
| `/html` | HTML Previewer | Render sanitized HTML in a sandboxed iframe |

### Machine and Platform Routes

| Route | Purpose | Notes |
| --- | --- | --- |
| `/health` | Operational health check | Plain text `OK` response |
| `/robots.txt` | Crawl directives | Built dynamically from the resolved site origin |
| `/sitemap.xml` | Public sitemap | Built dynamically from the tool registry |

### External Resources

The homepage also includes curated off-site resources. At the moment that means:

- `Albania Ipsum`

That link is intentionally treated as an external recommendation, not as a built-in product route.

## Canonical URL and Origin Strategy

This app is more deployment-flexible than the flagship site.

The intended public production origin is:

- `https://tools.recica.dev`

However, the app does not hardcode that origin in every route. Instead, SEO and indexing infrastructure resolve the origin like this:

1. use `PUBLIC_SITE_URL` if it is present and valid
2. otherwise fall back to the current request origin

That logic lives in:

- [`src/lib/utils/site-indexing.ts`](./src/lib/utils/site-indexing.ts)

It is used by:

- canonical tags
- Open Graph URLs
- JSON-LD schema
- `robots.txt`
- `sitemap.xml`

This design supports:

- production deployment on `tools.recica.dev`
- preview environments
- local development
- alternative self-hosted environments

## Technical Architecture

### Stack

| Concern | Implementation |
| --- | --- |
| Framework | SvelteKit 2 |
| Component model | Svelte 5 |
| Runtime adapter | `@sveltejs/adapter-node` |
| Styling | Tailwind CSS v4 plus app-level CSS variables |
| Language | TypeScript |
| Package manager | pnpm |
| Unit tests | Vitest |
| E2E tests | Playwright |
| Container deployment | Docker |

Runtime dependencies stay intentionally small:

| Package | Why it exists |
| --- | --- |
| `qrcode` | QR generation |
| `diff` | Text diff generation |

Everything else is dev/build infrastructure.

### Architecture by Responsibility

| Path | Responsibility |
| --- | --- |
| [`src/routes/+page.svelte`](./src/routes/+page.svelte) | Homepage, featured tools, search/filter UI, supporting sections |
| [`src/routes/<tool>/+page.svelte`](./src/routes) | Dedicated route per tool |
| [`src/routes/+layout.svelte`](./src/routes/+layout.svelte) | Global shell, theme initialization, search modal wiring, global background |
| [`src/lib/constants/tools.ts`](./src/lib/constants/tools.ts) | Tool registry used for navigation, search, sitemap, and structured data |
| [`src/lib/search/tools.ts`](./src/lib/search/tools.ts) | Search indexing/search behavior |
| [`src/lib/tools/`](./src/lib/tools) | Pure logic for tool behavior plus colocated unit tests |
| [`src/lib/components/`](./src/lib/components) | Shared layout, SEO, UI, and tool-shell components |
| [`src/lib/utils/seo.ts`](./src/lib/utils/seo.ts) | JSON-LD and metadata helpers |
| [`src/lib/utils/site-indexing.ts`](./src/lib/utils/site-indexing.ts) | Canonical origin, robots, and sitemap generation |
| [`src/hooks.server.ts`](./src/hooks.server.ts) | Response security headers |

### Why the Tool Registry Matters

The app centralizes tool definitions in [`src/lib/constants/tools.ts`](./src/lib/constants/tools.ts). That registry drives:

- homepage listing
- featured tool selection
- category filtering
- quick-search results
- route metadata
- sitemap generation
- tool list schema generation

That keeps the public catalog synchronized without duplicating route metadata in multiple places.

## Theme and Interaction Model

The tools app is dark-first but not dark-only.

- default stored preference: `dark`
- theme persistence key: `recica-theme`
- alternate mode: `light`
- theme bootstrapping runs in the root layout on mount

Relevant file:

- [`src/lib/theme/theme.ts`](./src/lib/theme/theme.ts)

The root layout also wires the quick-search behavior:

- pressing `/` opens the search panel
- `Escape` closes it
- search is suppressed when typing in an input/textarea/contenteditable element

## SEO and Structured Data

The app treats every serious utility route as indexable product surface.

Metadata and schema helpers live in:

- [`src/lib/components/seo/SeoHead.svelte`](./src/lib/components/seo/SeoHead.svelte)
- [`src/lib/utils/seo.ts`](./src/lib/utils/seo.ts)

Structured data currently supports:

- `WebSite`
- `Organization`
- `CollectionPage`
- `ItemList`
- `SoftwareApplication`
- `BreadcrumbList`

The organization/founder metadata points back to:

- `Drilon Reçica`
- `Senior Mobile & Product Engineer`
- `https://recica.dev`

That reinforces the relationship between the tools product and the flagship domain without turning the tools site into a profile page.

## Security Posture

This app is interactive, so the server layer sets security headers centrally in [`src/hooks.server.ts`](./src/hooks.server.ts).

Current response headers include:

- `Content-Security-Policy`
- `Referrer-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Permissions-Policy`

The CSP intentionally keeps the app tight:

- default source restricted to self
- no third-party frames
- no object embeds
- images only from self, `data:`, or `blob:`
- connect target restricted to self

This matches the product goal: local-first tools with minimal external exposure.

## Testing Strategy

`tools/` has both unit coverage and end-to-end coverage.

### Unit tests

Unit tests live next to tool logic and utility logic:

- `src/lib/tools/*.test.ts`
- `src/lib/utils/*.test.ts`

These cover parser behavior, transformations, validation paths, and edge cases for the core utilities.

### End-to-end tests

The main E2E spec is:

- [`tests/e2e/app.e2e.ts`](./tests/e2e/app.e2e.ts)

It covers:

- homepage search
- quick-open search panel
- category filtering
- theme persistence
- route-level behavior for multiple tools
- `robots.txt`
- `sitemap.xml`

Playwright runs against a built server started from:

- `vite build`
- `HOST=127.0.0.1 PORT=4173 node build`

That means the E2E tests validate the production-style adapter-node output, not only dev-mode behavior.

## Development

### Requirements

- Node.js 20 or newer
- pnpm 10 or newer

### Install

```bash
pnpm install
```

### Start the dev server

```bash
pnpm dev
```

### Type-check and lint

```bash
pnpm check
pnpm lint
```

### Unit tests

```bash
pnpm test:unit:run
```

### Install Playwright browser

```bash
pnpm test:e2e:install
```

### End-to-end tests

```bash
pnpm test:e2e
```

### Combined test run

```bash
pnpm test
```

### Production build

```bash
pnpm build
```

### Preview build

```bash
pnpm preview
```

## Deployment

### Direct Node deployment

The adapter-node build is started with:

```bash
node build
```

Operational variables to care about:

| Variable | Purpose |
| --- | --- |
| `PORT` | Server port |
| `HOST` | Bind host when starting manually |
| `PUBLIC_SITE_URL` | Canonical public origin for metadata, robots, and sitemap |

### Docker deployment

The provided [`Dockerfile`](./Dockerfile) uses a multi-stage Node 20 Alpine build:

1. enable corepack
2. install with `pnpm --frozen-lockfile`
3. build the app
4. copy the built server and production dependencies into a runtime image
5. expose port `3000`
6. healthcheck `http://localhost:3000/health`
7. start with `node build`

Build image:

```bash
docker build -t recica-tools .
```

Run image:

```bash
docker run --rm -p 3000:3000 -e PORT=3000 recica-tools
```

## File Layout

```text
tools/
  Dockerfile
  package.json
  playwright.config.ts
  pnpm-lock.yaml
  svelte.config.js
  tsconfig.json
  vite.config.ts
  static/
    favicons/
    manifest.json
    og-default.svg
  src/
    hooks.server.ts
    lib/
      assets/
      components/
      constants/
      search/
      theme/
      tools/
      types/
      utils/
    routes/
      +layout.svelte
      +page.svelte
      health/
      robots.txt/
      sitemap.xml/
      barcode/
      base64/
      case/
      color/
      counter/
      device/
      diff/
      env/
      hash/
      html/
      json/
      jwt/
      markdown/
      password/
      qr/
      query/
      regex/
      robots/
      sitemap/
      slug/
      sql/
      timestamp/
      url/
      uuid/
  tests/
    e2e/
```

## Editing Guidance

Use the smallest abstraction that fits the tool.

- add or edit route-specific UI in `src/routes/<tool>/+page.svelte`
- add or edit pure logic in `src/lib/tools/*`
- update the registry in `src/lib/constants/tools.ts`
- update metadata/schema helpers in `src/lib/utils/seo.ts`
- update site-origin/indexing behavior in `src/lib/utils/site-indexing.ts`

Avoid turning this app into:

- a remote-processing service
- an auth-heavy product
- a catch-all generic tool engine
- a dependency-heavy frontend demo

Its quality comes from directness: one route, one job, one predictable behavior.
