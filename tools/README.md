# Recica Tools

Recica Tools is a dark-first SvelteKit toolbox for fast, practical browser utilities. The app stays route-based, local-first, and intentionally avoids auth, analytics, and backend API complexity.

## Built-In Routes

The current app ships these built-in tools:

- `/json` JSON formatter, validator, and minifier
- `/base64` Base64 encoder and decoder for UTF-8 text
- `/qr` QR code generator with typed presets, local preview, raw payload output, and PNG/SVG export
- `/url` URL encoder and decoder for full URLs and components
- `/regex` ECMAScript regex tester with flags, match output, and replace preview
- `/timestamp` Unix timestamp and date conversion for Local and UTC
- `/password` password generator using `crypto.getRandomValues`
- `/diff` text diff checker with line-first and inline change highlighting
- `/sql` SQL formatter and minifier
- `/hash` SHA-256, SHA-384, and SHA-512 text hashing
- `/uuid` UUID v4 and v7 generator with bulk output
- `/query` query string parser and builder with repeated key support
- `/env` `.env` parser and viewer for comments, duplicates, and malformed rows
- `/jwt` JWT inspector for local header and payload decoding
- `/markdown` sanitized Markdown previewer
- `/html` sandboxed HTML previewer
- `/slug` slug generator with Unicode normalization
- `/case` text case converter for common naming styles
- `/counter` word, character, line, paragraph, and reading-time counter
- `/color` color converter for HEX, RGB(A), and HSL(A)
- `/barcode` barcode generator for Code 128, EAN-13, and UPC-A
- `/device` device and browser info page
- `/robots` `robots.txt` parser and validator
- `/sitemap` sitemap XML parser and validator

The homepage at `/` provides inline search, featured tools, the full tool index, and a separate external resources section.

## External Resource

- `Albania Ipsum` is linked from the homepage as a curated off-site resource, not as a built-in route.

## Stack

- SvelteKit + Svelte 5
- TypeScript
- Tailwind CSS v4 with CSS variable theme tokens
- `@sveltejs/adapter-node`
- pnpm
- Vitest for unit tests
- Playwright for end-to-end coverage
- Docker for deployment to Coolify / Hetzner

Runtime dependencies stay intentionally small:

- `qrcode` for QR generation
- `diff` for text diffing

## Development

### Requirements

- Node 20+
- pnpm 10+

### Install

```bash
pnpm install
```

### Run locally

```bash
pnpm dev
```

### Quality checks

```bash
pnpm check
pnpm lint
pnpm test:unit:run
```

### End-to-end tests

Install the Playwright browser once:

```bash
pnpm test:e2e:install
```

Then run:

```bash
pnpm test:e2e
```

Or run the combined suite:

```bash
pnpm test
```

## Production Build

Build the app:

```bash
pnpm build
```

Preview the production bundle locally:

```bash
pnpm preview
```

## Docker

Build the production image:

```bash
docker build -t recica-tools .
```

Run it:

```bash
docker run --rm -p 3000:3000 -e PORT=3000 recica-tools
```

The container uses a multi-stage Node 20 Alpine build and starts the adapter-node server with:

```bash
node build
```

## Project Layout

```text
src/
  lib/
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
docs/
  specs.md
```

## Product Notes

- Dark mode is the default presentation.
- Theme preference is the only persisted client-side setting.
- Tool logic stays route-local unless shared reuse is obvious.
- The app avoids a generic tool engine and keeps dependencies intentionally small.
- Network-dependent utilities are either excluded or converted into paste-only client-side parsers and validators.

## Status

The current repo contains the implemented app shell, 24 built-in tool routes, shared search and metadata, unit tests for tool logic, Playwright coverage, Docker deployment setup, and one curated external resource link on the homepage.
