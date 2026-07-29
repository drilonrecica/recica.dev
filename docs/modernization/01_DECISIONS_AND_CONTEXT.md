# 01 — Decisions and Context

## 1. Purpose

This document records the architectural and engineering decisions that AI coding agents must implement in the `recica.dev` repository.

The objective is to maximize:

- architecture quality
- security
- browser and server performance
- runtime resource efficiency
- maintainability
- test quality
- SEO
- visibility in generative/answer search experiences
- accessibility
- privacy
- deployment reliability

The goal is not to force all products onto one framework. The goal is to give each product the lightest architecture that fits its actual responsibilities.

---

## 2. Inspected repository baseline

At the time this plan was authored, the repository contained three independent applications.

### `recica/`

Observed characteristics:

- Astro 5
- TypeScript
- Tailwind CSS 4 plus custom CSS
- static `dist/` output
- npm and `package-lock.json`
- Playwright and axe-core
- `@astrojs/sitemap`
- self-hosted Fontsource assets
- no backend, database, accounts, or server runtime
- one-page flagship composition with stable anchors
- canonical site fixed to `https://recica.dev`

Deployment fact supplied by the owner:

- Coolify Nixpacks
- static-site option enabled
- separately deployed resource

### `tools/`

Observed characteristics:

- SvelteKit 2
- Svelte 5
- TypeScript
- Tailwind CSS 4
- pnpm 10.33.0
- `@sveltejs/adapter-node`
- Dockerfile based on Node 20 Alpine
- production command `node build`
- runtime `/health`, `/robots.txt`, and `/sitemap.xml`
- runtime canonical-origin resolution via `PUBLIC_SITE_URL` or request origin
- response headers in `src/hooks.server.ts`
- 24 browser tools
- local-first processing
- no accounts, analytics, or uploads
- Vitest and Playwright
- runtime dependencies intentionally limited to `diff` and `qrcode`

Deployment fact supplied by the owner:

- Coolify Dockerfile build
- separately deployed resource

### `labs/`

Observed characteristics:

- SvelteKit 2
- Svelte 5
- TypeScript
- Tailwind CSS 4
- pnpm 10.33.0
- `@sveltejs/adapter-node`
- Dockerfile based on Node 20 Alpine
- production command `node build`
- runtime health/indexing endpoints
- runtime canonical-origin resolution
- response headers in `src/hooks.server.ts`
- no database, accounts, analytics, uploads, or persistence
- current main experiment is client-side
- Vitest and Playwright

Deployment fact supplied by the owner:

- Coolify Dockerfile build
- separately deployed resource

### Root repository

Observed characteristics:

- thin `Makefile`
- a helper script for invoking pnpm
- no visible GitHub Actions workflow directory
- app-specific package managers and lockfiles
- app-specific documentation
- deliberate product boundaries

---

## 3. Core decisions

### D-01 — Preserve three separate products

Decision:

- keep `recica`, `tools`, and `labs` independently deployable
- keep them as separate Coolify resources
- share engineering standards but not product responsibility

Reasoning:

- failures remain isolated
- deployments remain independently reversible
- product identities stay clear
- Labs can experiment without destabilizing Tools or the flagship
- the repository remains easy to understand

### D-02 — Keep the current frameworks

Decision:

- `recica`: keep Astro
- `tools`: keep SvelteKit/Svelte
- `labs`: keep SvelteKit/Svelte
- Siftail, which is a separate repository, remains Go + templates + HTMX

Reasoning:

- Astro is near-optimal for a static flagship
- Svelte is appropriate for browser-local interactive tools
- Svelte is appropriate for rich client-side experiments
- Go + HTMX excels when the server owns data and workflows, as in Siftail
- a framework rewrite would add risk without solving the actual problems

### D-03 — Convert Tools and Labs to static output

Decision:

- replace `@sveltejs/adapter-node` with `@sveltejs/adapter-static`
- remove the Node production runtime
- serve generated files through an unprivileged static web-server container
- retain Dockerfile-based Coolify deployment for Tools and Labs

Reasoning:

- neither app currently needs runtime server logic
- static output is more resource-efficient than both Node and Go servers
- static output reduces patching and attack surface
- full HTML remains available for SEO
- Svelte interactivity remains in the browser
- the Dockerfile preserves version-controlled headers, cache policy, 404 behavior, and portability

### D-04 — Keep Recica's existing static deployment

Decision:

- keep Astro static generation
- keep Coolify Nixpacks
- keep the static-site option enabled
- keep `dist/` as the publish directory

Reasoning:

- the deployment model already matches the product
- changing build packs provides no meaningful user-facing improvement
- there is no application runtime to remove

### D-05 — Standardize pnpm and Node without a root workspace

Decision:

- use Node 24 LTS for all development, CI, and build stages
- use pinned pnpm 11 in all three apps
- convert `recica` from npm to pnpm
- retain per-app `pnpm-lock.yaml` files
- retain per-app build contexts
- do not create a root workspace

Reasoning:

- standardization improves reproducibility
- per-app locks preserve deployment independence
- Coolify resources currently build from app directories
- a root workspace would couple unrelated deployments and require wider build contexts
- there is not enough shared runtime code to justify workspace coupling

### D-06 — No analytics

Decision:

- do not add analytics, telemetry, session replay, tracking pixels, or client-side performance beacons

Allowed:

- Google Search Console
- Bing Webmaster Tools
- build-time and CI performance testing
- uptime checks
- infrastructure logs that do not capture tool input

Reasoning:

- this is an explicit product requirement
- privacy is part of the Tools positioning
- the sites are small enough to improve through audits and webmaster tools

### D-07 — Browser-local Tools processing

Decision:

- built-in tool input and output remain in browser memory
- no automatic persistence
- no network transmission
- no service-worker caching of user data

Reasoning:

- privacy is a differentiator
- local operations avoid network latency
- local processing is better suited to the tool set than HTMX round trips

### D-08 — No computation Web Workers in the first pass

Decision:

- do not introduce Web Workers for tool algorithms during this modernization
- use explicit, conservative per-tool input limits
- benchmark and revisit later only if a real tool requires larger inputs

Reasoning:

- the owner prefers a simpler implementation
- most tools do not need worker complexity
- bounded synchronous work is predictable and maintainable

This does not prohibit a service worker for offline static assets.

### D-09 — Tools offline cache, without an install campaign

Decision:

- add conservative offline caching after static migration stabilizes
- no aggressive install prompt
- cache only public static resources and route documents
- never cache input/output

Reasoning:

- offline use aligns with local-first tools
- a native service worker can add value without a framework dependency
- delaying it until after the static conversion isolates risk

### D-10 — WCAG 2.2 AA target

Decision:

- target WCAG 2.2 AA
- automated axe tests are required
- keyboard tests are required
- occasional manual screen-reader checks remain recommended

Reasoning:

- AA is measurable and realistic
- automated tests alone cannot validate focus flow, announcements, or comprehension
- accessibility is an implementation discipline, not a framework choice

### D-11 — Aggressive but practical performance budgets

Decision:

- establish baselines first
- enforce meaningful regressions in CI
- do not fail CI for negligible size changes
- require explicit review for route-specific exceptions

Reasoning:

- budgets prevent drift
- arbitrary micro-optimization can damage maintainability
- browser performance matters more than framework benchmark claims

### D-12 — Content-led SEO and AI discoverability

Decision:

- use normal technical SEO and high-value original content
- optimize pages for clear answer extraction and citation
- use supported structured data that matches visible content
- do not create thin synonym pages
- do not use hidden text
- do not mass-generate pages
- do not add `llms.txt` as a required optimization

Reasoning:

- Google's current official guidance says generative search relies on normal search quality systems
- Google explicitly says it does not use `llms.txt` as special markup
- clear, original, authoritative content helps both traditional search and answer systems
- Bing Webmaster Tools can report AI citations without site analytics

### D-13 — Separate indexing from training policy

Decision:

- allow normal search crawling and indexing
- do not add crawler-specific training blocks without owner review
- document any future crawler policy explicitly
- re-verify bot names against official documentation before editing `robots.txt`

Reasoning:

- answer retrieval, search indexing, and model training are distinct
- crawler identities change
- an accidental blanket block would undermine discoverability goals

### D-14 — CI checks before merge; Coolify deploys after merge

Decision:

- GitHub Actions validates pull requests
- `master` requires green checks
- merging to `master` triggers the existing Coolify deployment flow
- GitHub Actions does not need to duplicate Coolify deployment

Reasoning:

- the production server should not be the first place code is tested
- the existing deployment platform remains the deployment authority
- branch protection is enough for a solo maintainer; a second reviewer is not required

### D-15 — Shared policies, not a shared design system

Decision:

Share:

- Node/pnpm policy
- CI conventions
- quality thresholds
- security requirements
- accessibility requirements
- SEO rules
- documentation style

Do not force:

- shared navigation
- shared layouts
- shared components
- shared visual tokens
- shared runtime state

Reasoning:

- the products deliberately have distinct identities
- a shared component package would create coupling without enough reuse

---

## 4. Non-goals

This modernization will not:

- rewrite any app in Go, React, Next.js, HTMX, Qwik, Vue, or another framework
- add a backend to Tools or Labs
- add accounts
- add a database
- add analytics
- add remote uploads
- build a generic tools engine
- create a root monorepo workspace
- add Turborepo or Nx
- redesign all three products
- invent new portfolio claims
- create a content farm
- chase a literal permanent "10/10" score
- guarantee WCAG conformance solely through automated tools
- treat Lighthouse scores as the only performance evidence

---

## 5. Quality target

The intended end state is approximately:

| Area               |                          Target confidence |
| ------------------ | -----------------------------------------: |
| Architecture       |                                    9.5+/10 |
| Resource usage     |                                    9.7+/10 |
| Performance        |                                    9.4+/10 |
| Security           |                                    9.2+/10 |
| Maintainability    |                                    9.3+/10 |
| Testing            |                                    9.2+/10 |
| SEO                |                                    9.3+/10 |
| AI discoverability |                                    9.0+/10 |
| Accessibility      | 8.9 automated-only; 9.3 with manual checks |

These are directional quality targets, not marketing claims.

---

## 6. Authoritative external references

Agents should use current official documentation and re-verify details at implementation time.

- Node release status: `https://nodejs.org/en/about/previous-releases`
- pnpm installation/version pinning: `https://pnpm.io/installation`
- pnpm 11 migration: `https://pnpm.io/migration`
- SvelteKit static adapter: `https://svelte.dev/docs/kit/adapter-static`
- SvelteKit CSP configuration: `https://svelte.dev/docs/kit/configuration`
- Coolify Nixpacks: `https://coolify.io/docs/applications/build-packs/nixpacks`
- Coolify Dockerfile build pack: `https://coolify.io/docs/applications/build-packs/dockerfile`
- Google SEO starter guide: `https://developers.google.com/search/docs/fundamentals/seo-starter-guide`
- Google generative AI optimization guide: `https://developers.google.com/search/docs/fundamentals/ai-optimization-guide`
- Google structured-data guidelines: `https://developers.google.com/search/docs/appearance/structured-data/sd-policies`
- Bing AI Performance: `https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview`
- WCAG 2.2 quick reference: `https://www.w3.org/WAI/WCAG22/quickref/`
