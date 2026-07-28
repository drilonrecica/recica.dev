# AGENTS.md — recica.dev Engineering Instructions

This file is the primary operating guide for AI coding agents working in this repository.

The repository contains three separate public web products:

- `recica/` — the flagship personal site at `https://recica.dev`
- `tools/` — the browser tools product at `https://tools.recica.dev`
- `labs/` — the public experimentation surface at `https://labs.recica.dev`

The products share a repository and engineering standards, but they do **not** share product responsibility or a production runtime.

Before making changes, read these files in order:

1. This `AGENTS.md`
2. `docs/modernization/01_DECISIONS_AND_CONTEXT.md`
3. `docs/modernization/02_TARGET_ARCHITECTURE.md`
4. `docs/modernization/03_IMPLEMENTATION_ROADMAP.md`
5. `docs/modernization/04_QUALITY_STANDARD.md`
6. `docs/modernization/05_CI_CD_AND_MAINTENANCE.md`
7. `docs/modernization/06_COOLIFY_DEPLOYMENT_RUNBOOK.md`
8. `docs/modernization/07_ACCEPTANCE_CHECKLIST.md`
9. The existing root and app-specific `README.md` files

If repository reality conflicts with these documents because the code has changed since the documents were written, do not silently follow stale instructions. Re-inspect the code, preserve the decisions in `01_DECISIONS_AND_CONTEXT.md`, and update the affected documentation in the same change.

---

## 1. Non-negotiable product boundaries

### `recica/`

Owns:

- Drilon Reçica's canonical professional identity
- positioning and biography
- selected work and case studies
- CV and contact paths
- personal SEO and structured data
- curated links to Tools and Labs

It must remain:

- Astro
- static
- small
- content-driven
- free of a backend, database, authentication, or application server

Do not turn it into a blog engine, dashboard, tools host, lab host, React application, SvelteKit application, or Go server.

### `tools/`

Owns:

- stable, route-based browser utilities
- privacy-first local processing
- tool discovery and search
- tool-specific content, metadata, and structured data
- offline availability of static application assets

It must remain:

- SvelteKit + Svelte
- statically generated
- browser-local for built-in processing
- free of accounts, analytics, remote uploads, and server-side user-input processing

Do not migrate it to Go + HTMX. Do not turn it into a remote-processing service or generic SaaS platform.

### `labs/`

Owns:

- public interactive experiments
- product and UX prototypes
- local decision helpers
- selective reference-style explorations

It must remain:

- SvelteKit + Svelte by default
- statically generated while experiments are client-only
- selective rather than a graveyard of unfinished ideas

A future server-backed experiment is allowed only after a written architecture decision and human approval. A server need in one experiment does not automatically justify making all of Labs dynamic.

---

## 2. Target deployment model

The intended production model is:

| App | Build/deployment | Runtime |
|---|---|---|
| `recica` | Coolify Nixpacks, static-site option enabled, publish `dist/` | generated static web server |
| `tools` | Coolify Dockerfile build, static SvelteKit output copied to an unprivileged static web server image | no Node application runtime |
| `labs` | Coolify Dockerfile build, static SvelteKit output copied to an unprivileged static web server image | no Node application runtime |

Cloudflare proxies the public domains. Coolify's Caddy proxy routes to each independent resource on a Hetzner VPS.

`tools` and `labs` currently use `@sveltejs/adapter-node`, Node 20 Docker runtime stages, `node build`, server hooks, and runtime endpoints. The modernization must replace that architecture with `@sveltejs/adapter-static` and a static runtime container.

The correct optimization is **removing unnecessary application servers**, not rewriting browser applications as Go servers.

---

## 3. Toolchain decisions

- Use Node.js 24 LTS for development, CI, and build stages.
- Use the latest stable pnpm 11 release selected and pinned by the repository. At the time this plan was authored, the latest stable release was `pnpm@11.17.0`.
- All three JavaScript applications must use pnpm.
- Keep independent lockfiles and independent build contexts in `recica/`, `tools/`, and `labs/`.
- Do **not** create a root pnpm workspace during this modernization.
- Do not add Nx, Turborepo, Rush, Lage, or another monorepo orchestrator.
- The root `Makefile` may remain as the thin cross-app command surface.
- Add no runtime dependency unless the feature cannot be implemented safely and maintainably with the platform or existing dependencies.
- Avoid adding a shared component library. Share policies and validation behavior, not product UI.

The independent-lockfile decision is deliberate. The apps are separately deployed Coolify resources with app-specific build contexts. A single root lockfile would couple deployments and require wider build contexts without enough shared runtime code to justify it.

---

## 4. Mandatory agent workflow

For every non-trivial change:

1. Inspect the relevant app, existing tests, build configuration, and deployment files.
2. Identify which modernization phase the task belongs to.
3. Create a concise internal task checklist.
4. Make the smallest coherent change that satisfies the phase.
5. Update tests during the same change.
6. Update documentation when architecture, commands, deployment, routes, security behavior, or policies change.
7. Run the app-specific quality gates.
8. Run root verification where practical.
9. Review the diff for accidental cross-app coupling and generated artifacts.
10. Report:
   - files changed
   - decisions made
   - commands run
   - results
   - remaining risks or manual infrastructure actions

Do not claim a command passed unless it was executed successfully.

Do not suppress failures by:

- weakening tests
- lowering quality thresholds without an approved reason
- adding `|| true`
- disabling strict static-adapter checks
- converting failures into warnings
- using SPA fallbacks to hide missing prerendered routes
- excluding large areas from linting or type checking

---

## 5. Required implementation sequence

Do not combine the entire modernization into one uncontrolled rewrite.

Recommended sequence:

1. Baseline and inventory
2. pnpm/Node standardization
3. Tools static conversion
4. Labs static conversion
5. security-header and CSP hardening
6. CI/CD and dependency maintenance
7. testing, performance, and accessibility gates
8. Tools content/SEO/AI-discoverability improvements
9. Tools offline caching
10. final audit and documentation cleanup

Each phase must leave the repository deployable.

Tools should be migrated and validated before applying the same deployment pattern to Labs.

---

## 6. Static-generation rules for Tools and Labs

The following are mandatory:

- use `@sveltejs/adapter-static`
- keep adapter strictness enabled
- prerender all public pages and machine endpoints
- do not use an SPA fallback
- do not retain `node build` as the production command
- do not retain production `node_modules`
- do not retain `@sveltejs/adapter-node`
- do not use request-origin fallback for canonical URLs
- do not rely on `hooks.server.ts` after static conversion
- preserve real 404 status behavior
- generate complete HTML for every public route
- keep interactivity in hydrated Svelte components
- keep built-in tool processing inside the browser

Canonical production origins are fixed:

- `https://recica.dev`
- `https://tools.recica.dev`
- `https://labs.recica.dev`

A build-time override may exist for local tests, but production canonicals must never be derived from arbitrary request hostnames.

Preview builds must use:

- production canonical URLs
- `noindex, nofollow`
- a robots policy that prevents preview indexing

---

## 7. Security and privacy rules

### Global

- no analytics
- no tracking pixels
- no session replay
- no advertising scripts
- no third-party JavaScript by default
- self-host fonts and assets
- no public production source maps
- no wildcard CSP sources
- no `unsafe-eval`
- no secrets in client bundles
- no fabricated security claims

### Tools

User input and output must not be:

- sent to the server
- sent to third parties
- persisted to local storage
- persisted to IndexedDB
- added to URLs
- logged
- cached by the service worker
- included in error telemetry

Only harmless preferences may persist, such as theme or favorite tools.

A new network-dependent tool requires:

- explicit human approval
- clear UI disclosure
- a privacy review
- a separate threat model
- tests proving what is transmitted

### Labs

Do not add persistence, accounts, backend APIs, uploads, or protected API credentials without an approved architecture decision.

---

## 8. SEO and AI-discoverability rules

Optimize for useful, authoritative, crawlable content—not keyword volume or AI-targeted hacks.

Mandatory principles:

- one canonical page per real user intent
- unique, helpful content on every serious tool page
- concise direct answer near the top
- visible content must match structured data
- use genuine examples and limitations
- use genuine authorship and provenance
- update `dateModified`/`lastmod` only after substantive changes
- do not create fake ratings, reviews, FAQs, usage counts, or testimonials
- do not generate multiple thin pages for synonyms
- do not hide keyword text
- do not mass-generate low-value pages
- do not add `llms.txt` as a ranking tactic

Google's current official guidance states that normal SEO fundamentals apply to generative AI search and that Google does not use `llms.txt` as special markup. Therefore `llms.txt` is not part of the required implementation.

Search Console and Bing Webmaster Tools are allowed and encouraged. They are webmaster products, not client-side analytics.

---

## 9. Accessibility rules

Target WCAG 2.2 AA.

Automated checks are mandatory, but automated checks alone are not treated as proof of full conformance.

Every interactive change must consider:

- semantic HTML
- keyboard operation
- visible focus
- focus movement and restoration
- accessible names and descriptions
- error association and announcement
- reduced motion
- zoom and reflow
- touch target size
- contrast
- forced-colors/high-contrast mode
- screen-reader reading order
- dynamic status announcements

Do not replace native controls with custom controls unless there is a clear product need and equivalent semantics are fully implemented.

---

## 10. Performance and resource rules

- static output is preferred over a Go or Node server when no server is needed
- no tool-computation Web Workers in the first modernization pass
- enforce conservative input limits instead of allowing the main thread to freeze
- no silent truncation
- lazy-load route-specific heavy code
- ship no unexpected third-party request
- keep fonts and font weights minimal
- use immutable caching only for fingerprinted assets
- do not cache HTML forever
- preserve genuine 404 responses
- collect a baseline before tightening budgets
- do not lower an established budget without documentation and human approval

The Tools offline service worker may be added only after static migration is stable. It may cache application assets and public route documents, but never user-entered or generated data.

---

## 11. Human approval gates

Stop and request review before:

- changing a public domain, route, or anchor contract
- introducing a backend or database
- adding authentication
- adding analytics or telemetry
- adding a new runtime dependency with broad impact
- weakening CSP
- adding a third-party origin
- changing crawler-training policy
- adding a server-backed Tools feature
- creating a generic cross-app design system
- changing the visual identity of an app
- deleting user-facing content
- publishing factual claims about Drilon Reçica not already supported by repository content
- changing Coolify or Cloudflare settings that can cause production downtime
- merging multiple modernization phases into one large change

---

## 12. Definition of done

A task is not complete until:

- implementation matches the target architecture
- formatting passes
- linting passes
- type/framework checks pass
- relevant unit tests pass
- relevant Playwright tests pass
- accessibility checks pass
- production build passes
- static routes and metadata are verified
- documentation is current
- no secrets or generated test artifacts are committed
- the final diff has been reviewed for unrelated changes

The complete final audit lives in `docs/modernization/07_ACCEPTANCE_CHECKLIST.md`.
