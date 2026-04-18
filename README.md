# recica.dev Repository

This repository contains the active public web properties for Drilon Reçica.

It is intentionally split into 3 independent apps:

- `recica/` for the flagship personal site at `https://recica.dev`
- `tools/` for the standalone browser toolbox at `https://tools.recica.dev`
- `labs/` for the experimental product layer at `https://labs.recica.dev`

There is now a minimal root orchestration layer via [`Makefile`](./Makefile) for cross-app install, check, build, test, and audit commands.

There is still no shared root package manager flow. Each app keeps its own package manager and lockfile because each one has a different product role and a different runtime profile.

## Domain Model

### `recica.dev`

`recica.dev` is the flagship personal domain.

It owns:

- professional identity
- role positioning
- selected case studies
- contact paths
- CV access
- personal SEO and structured data

It is intentionally curated, static, and small.

### `tools.recica.dev`

`tools.recica.dev` is the standalone tools product.

It owns:

- privacy-first browser utilities
- tool-specific route pages
- search and tool discovery
- utility SEO
- operational endpoints such as `robots.txt`, `sitemap.xml`, and `health`

It is intentionally separate from the flagship so the product can behave like a tools surface instead of a portfolio appendix.

### `labs.recica.dev`

`labs.recica.dev` is the experimental layer.

It owns:

- public prototypes
- interaction experiments
- reference-style product labs
- concept work that is too exploratory for the flagship and too early for `tools`
- experiment-specific SEO and operational endpoints

It should stay selective. Labs is not a dumping ground for unfinished ideas.

### Historical Note

This repository no longer contains a separate `drilon/` application. The old personal-site codebase was retired from the repo.

The active public model is now:

- one flagship personal domain: `recica.dev`
- one stable tools product: `tools.recica.dev`
- one experimental product layer: `labs.recica.dev`

If legacy hostnames still exist at infrastructure level, they should be treated as aliases or redirects, not separate products.

## Repository Layout

| Path                  | Responsibility                                      | Runtime Model                           |
| --------------------- | --------------------------------------------------- | --------------------------------------- |
| [`recica/`](./recica) | Flagship personal site                              | Static Astro build                      |
| [`tools/`](./tools)   | Stable browser tools product                        | SvelteKit server build via adapter-node |
| [`labs/`](./labs)     | Experiments, prototypes, and interactive references | SvelteKit server build via adapter-node |
| [`docs/`](./docs)     | Repo-level documentation area                       | No runtime role currently               |

## Product Boundaries

The most important repository rule is to keep the product boundaries clean.

### What belongs in `recica/`

- identity and positioning
- selected work
- curated supporting proof
- personal contact and CV
- links out to the other product surfaces

### What belongs in `tools/`

- route-based utilities
- searchable tool catalog
- privacy and local-processing guarantees
- utility-specific SEO
- machine endpoints and operational server behavior

### What belongs in `labs/`

- public product experiments
- live interaction references
- concept-led explorations
- local decision helpers and comparison flows
- product ideas that are meaningful enough to publish, but not stable products yet

### What should not happen

- `recica/` should not become a tools or experiment host shell
- `tools/` should not become a portfolio or lab surface
- `labs/` should not become a second flagship site or a backlog graveyard

Shared branding is fine. Shared product responsibility is not.

## Technology Summary

| App       | Framework              | Styling                                | Language   | Package Manager | Build Output              | Automated Tests              |
| --------- | ---------------------- | -------------------------------------- | ---------- | --------------- | ------------------------- | ---------------------------- |
| `recica/` | Astro 5                | Tailwind CSS v4 + custom CSS           | TypeScript | npm             | Static `dist/`            | Astro check + Prettier + Playwright |
| `tools/`  | SvelteKit 2 + Svelte 5 | Tailwind CSS v4 + custom CSS variables | TypeScript | pnpm            | Adapter-node server build | Vitest + Playwright          |
| `labs/`   | SvelteKit 2 + Svelte 5 | Tailwind CSS v4 + custom CSS variables | TypeScript | pnpm            | Adapter-node server build | Vitest + Playwright          |

## Why the Apps Are Separate

This split is deliberate.

`recica.dev` is optimized for:

- identity clarity
- fast reading
- curated proof
- static delivery

`tools.recica.dev` is optimized for:

- repeat usage
- utility landing pages
- route-level discoverability
- richer client interactivity
- operational endpoints

`labs.recica.dev` is optimized for:

- interactive experimentation
- concept validation in public
- reference-style product thinking
- self-contained exploratory experiences

Trying to force all 3 concerns into one runtime would create unnecessary coupling and muddy the product story.

## Local Development

There is now a root install command for convenience:

```bash
make install
```

For day-to-day development, it is still usually better to work inside the app you are changing.

## Root Verification Commands

The root orchestration layer is intentionally thin. It standardizes cross-app verification without pretending the apps share one runtime or one package manager.

```bash
make check
make build
make test
make audit
```

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

### `labs/`

```bash
cd labs
pnpm install
pnpm dev
```

## Build and Quality Commands

### `recica/`

```bash
cd recica
npm run check
npm run lint
npm run build
npm run test:e2e
npm run preview
```

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

### `labs/`

```bash
cd labs
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
- canonical site configured directly in Astro
- deploy the built `dist/` output to static hosting
- no runtime server needed

### `tools/`

- SvelteKit app built with `@sveltejs/adapter-node`
- runs as a Node server with `node build`
- exposes `/health` for uptime probes
- canonical origin is environment-aware via `PUBLIC_SITE_URL`

### `labs/`

- SvelteKit app built with `@sveltejs/adapter-node`
- runs as a Node server with `node build`
- exposes `/health`, `robots.txt`, and `sitemap.xml`
- canonical origin is environment-aware via `PUBLIC_SITE_URL`
- current live experiment routing stays inside the single Labs app

## Domain and Canonical Strategy

### Personal domain

`recica/` is hardwired to `https://recica.dev` as the canonical personal site. That covers:

- Astro site configuration
- canonical links
- social metadata
- `Person` and `WebSite` structured data

### Tools domain

`tools/` resolves public origin like this:

1. use `PUBLIC_SITE_URL` if set to a valid `http` or `https` URL
2. otherwise fall back to the current request origin

That supports production, previews, and self-hosted environments.

### Labs domain

`labs/` uses the same operational pattern as `tools/`:

1. use `PUBLIC_SITE_URL` if set and valid
2. otherwise fall back to the request origin

That origin feeds:

- canonical page URLs
- `robots.txt`
- `sitemap.xml`

## Security and Privacy Posture

### `recica/`

The flagship is mostly static and has a deliberately small attack surface.

- no auth
- no forms
- no backend
- no database
- no runtime secrets required for basic operation

### `tools/`

The tools app is interactive, so it needs stronger runtime hardening.

- local-first tool behavior wherever possible
- no account model
- no analytics or tracking flow in the implemented app
- no remote uploads for the built-in utilities
- security headers in `src/hooks.server.ts`

### `labs/`

The labs app is also interactive, but it still stays intentionally light:

- no accounts
- no persistence in the shipped experiment
- no analytics in the shipped MVP
- no remote uploads
- security headers in `src/hooks.server.ts`
- deterministic client-side logic where possible

## Editing Guidance

Choose the right app first.

- if the change is about identity, selected work, contact, or CV, edit `recica/`
- if the change is about stable utilities, tool SEO, tool routing, or search, edit `tools/`
- if the change is about experiments, prototypes, interactive references, or concept validation, edit `labs/`

Keep changes scoped. This repository works best when each app remains boring in the right way:

- clear ownership
- small dependency surfaces
- simple build stories
- predictable deployment behavior

## App-Specific Documentation

- [`recica/README.md`](./recica/README.md)
- [`tools/README.md`](./tools/README.md)
- [`labs/README.md`](./labs/README.md)
- [`labs/src/routes/parental-gate-lab/README.md`](./labs/src/routes/parental-gate-lab/README.md)
