# recica.dev Repository

This repository contains the active public web properties for Drilon Reçica.

It is intentionally split into two independent apps:

- `recica/` for the flagship personal site at `https://recica.dev`
- `tools/` for the standalone browser toolbox at `https://tools.recica.dev`

There is no root workspace runner, no shared monorepo build command, and no single root package manager setup. Each app is built, tested, and deployed independently because they solve different product problems and have different runtime needs.

## Domain Model

### `recica.dev`

`recica.dev` is the flagship personal domain.

It owns:

- professional identity
- positioning
- selected case studies
- contact paths
- CV access
- personal SEO and structured data

It is intentionally small, curated, and static.

### `tools.recica.dev`

`tools.recica.dev` is a standalone product surface.

It owns:

- privacy-first browser utilities
- tool-specific route pages
- tool discovery/search
- product SEO for utility pages
- dynamic `robots.txt`, `sitemap.xml`, and health checks

It is intentionally separate from the flagship so the portfolio story and the utilities product do not blur into one another.

### Historical Note

This repository no longer contains a separate `drilon/` application. The old personal-site codebase was retired from the repo. The active public strategy is:

- one flagship personal domain: `recica.dev`
- one standalone tools domain: `tools.recica.dev`

If legacy hostnames still exist at infrastructure level, they should be treated as aliases or redirects, not as separate products.

## Repository Layout

| Path | Responsibility | Runtime Model |
| --- | --- | --- |
| [`recica/`](./recica) | Flagship personal site | Static Astro build |
| [`tools/`](./tools) | Browser-based tools product | SvelteKit server build via adapter-node |
| [`docs/`](./docs) | Reserved repo documentation area | No runtime role currently |

## Product Boundaries

The most important repository rule is to keep the product boundaries clean.

### What belongs in `recica/`

- professional positioning
- selected work
- curated supporting proof
- personal contact and CV
- links out to `tools.recica.dev`

### What belongs in `tools/`

- route-based utilities
- searchable tool catalog
- privacy and local-processing guarantees
- utility-specific SEO
- machine endpoints like `/health`, `/robots.txt`, and `/sitemap.xml`

### What should not happen

- `recica/` should not become a tools host shell
- `tools/` should not become a portfolio or resume site
- shared brand consistency is good, but the product responsibilities stay separate

## Technology Summary

| App | Framework | Styling | Language | Package Manager | Build Output | Automated Tests |
| --- | --- | --- | --- | --- | --- | --- |
| `recica/` | Astro 5 | Tailwind CSS v4 + custom CSS | TypeScript | npm | Static `dist/` | No dedicated suite currently |
| `tools/` | SvelteKit 2 + Svelte 5 | Tailwind CSS v4 + custom CSS variables | TypeScript | pnpm | Adapter-node server build | Vitest + Playwright |

## Why the Apps Are Separate

This split is deliberate, not accidental.

`recica.dev` is optimized for:

- clear identity
- fast reading
- SEO around a person and professional role
- very small static footprint

`tools.recica.dev` is optimized for:

- repeat usage
- utility landing pages
- route-level discoverability
- richer client interactivity
- operational endpoints and server-style deployment

Trying to force both concerns into one runtime would create unnecessary coupling.

## Local Development

There is no root install command. Work inside the app you are changing.

### `recica/`

```bash
cd recica
npm install
npm run dev
```

### `tools/`

```bash
cd tools
pnpm install
pnpm dev
```

## Build and Quality Commands

### `recica/`

```bash
cd recica
npm run build
npm run preview
```

`recica` currently relies mainly on a successful build as its quality gate.

### `tools/`

```bash
cd tools
pnpm check
pnpm lint
pnpm test:unit:run
pnpm test:e2e
pnpm build
pnpm preview
```

## Deployment Model

### `recica/`

- static Astro site
- canonical site configured directly in `astro.config.mjs`
- deploy the built `dist/` output to static hosting
- no runtime server needed

### `tools/`

- SvelteKit app built with `@sveltejs/adapter-node`
- runs as a Node server with `node build`
- can be deployed directly or through Docker
- exposes `/health` for uptime probes
- canonical origin is environment-aware via `PUBLIC_SITE_URL`

## Domain and Canonical Strategy

### Personal domain

`recica/` is hardwired to `https://recica.dev` as the canonical personal site. That covers:

- Astro site configuration
- canonical links
- social metadata
- `Person` and `WebSite` structured data

### Tools domain

`tools/` is operationally more flexible. It resolves its public origin like this:

1. use `PUBLIC_SITE_URL` if set to a valid `http` or `https` URL
2. otherwise fall back to the current request origin

That strategy supports:

- production on `tools.recica.dev`
- preview deployments
- self-hosted internal environments
- accurate `robots.txt` and `sitemap.xml` generation per environment

## Security and Privacy Posture

### `recica/`

The flagship is mostly static and has a small attack surface by design.

- no auth
- no forms
- no backend
- no database
- no runtime secrets required for basic operation

### `tools/`

The tools app takes privacy and operational hardening more seriously because it is an interactive utility surface.

- local-first tool behavior wherever possible
- no account model
- no analytics or tracking flow in the implemented app
- no remote uploads for the built-in utilities
- security headers in `src/hooks.server.ts`
- CSP, referrer policy, X-Frame-Options, X-Content-Type-Options, Permissions-Policy

## Editing Guidance

Choose the right app first.

- if the change is about identity, story, selected work, contact, or CV, edit `recica/`
- if the change is about utilities, route tooling, search, tool SEO, or product mechanics, edit `tools/`

Keep changes scoped. This repository works best when each app remains boring in the right way:

- clear ownership
- minimal dependency surface
- simple build story
- predictable deployment behavior

## App-Specific Documentation

- [`recica/README.md`](./recica/README.md)
- [`tools/README.md`](./tools/README.md)
