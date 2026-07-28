# 03 — Implementation Roadmap

## 1. Delivery strategy

Implement the modernization as a sequence of small, reviewable pull requests.

Do not mix framework configuration, package-manager migration, SEO content rewrites, PWA behavior, and security hardening in one enormous change.

Each pull request must:

- have one dominant purpose
- update relevant tests
- keep all apps deployable
- document infrastructure changes
- include rollback instructions
- avoid unrelated visual redesign

Recommended pull-request sequence:

1. baseline and guardrails
2. pnpm/Node standardization
3. Tools static migration
4. Labs static migration
5. security/CSP hardening
6. CI and dependency automation
7. performance/accessibility/test gates
8. Tools SEO/content improvements
9. Tools offline caching
10. final audit and documentation cleanup

---

## 2. Phase 0 — Baseline and inventory

### Objective

Record the current behavior before changing architecture.

### Tasks

For all three public sites:

- record current production response headers with `curl -I`
- record redirects and status codes
- record canonical URLs
- record robots output
- record sitemap output
- record generated HTML for representative routes
- record current Lighthouse results
- record current built JS/CSS sizes
- record Docker image size for Tools and Labs
- record runtime memory/CPU for Tools and Labs
- list all external network requests
- list all public routes
- run all existing checks and tests
- record any pre-existing failures instead of silently fixing them inside another phase

For Tools:

- test every tool route manually or through existing E2E coverage
- record input behavior, clipboard/download behavior, and errors
- inspect localStorage/IndexedDB usage
- verify whether any input is persisted
- inspect the HTML preview sandbox behavior
- inspect QR/barcode export behavior

For Labs:

- test homepage, Parental Gate, 404, robots, sitemap, and health
- record current client-state behavior
- confirm no backend calls occur

### Deliverables

Add a dated baseline document or machine-readable report under:

```text
docs/modernization/baseline/
```

Do not commit large browser traces or screenshots unless they are intentionally useful.

### Acceptance criteria

- every existing quality command has a recorded result
- no architecture change has started
- known failures are clearly separated from migration regressions

---

## 3. Phase 1 — Standardize Node 24 and pnpm 11

### Objective

Use one supported toolchain while retaining independent apps and lockfiles.

### `recica`

Tasks:

- add exact `packageManager: pnpm@<stable-11-version>`
- add Node/pnpm engine constraints
- generate `recica/pnpm-lock.yaml`
- remove `recica/package-lock.json`
- update README commands from npm to pnpm
- verify Astro, sitemap, fonts, and Playwright under Node 24
- confirm Coolify Nixpacks detects pnpm
- set/confirm Node 24 in the Coolify build environment

### `tools` and `labs`

Tasks:

- upgrade `packageManager` from pnpm 10 to pinned pnpm 11
- add Node/pnpm engine constraints
- run the official pnpm 10-to-11 migration guidance
- regenerate and review lockfiles
- resolve configuration deprecations deliberately
- keep package manifests independent
- keep app-local `pnpm-workspace.yaml` only if pnpm requires it for current settings; remove redundant empty workspace files if safe

### Root

Tasks:

- update `Makefile` to invoke pnpm consistently for all three apps
- update or replace `scripts/run-pnpm.sh` if needed
- add `.node-version` or another single root Node-major indicator set to `24`
- update root README technology/deployment tables
- do not add a root lockfile or workspace

### Required checks

```bash
make install
make check
make build
make test
make audit
```

If root commands are not yet robust enough, run app-specific commands and fix root orchestration in this phase.

### Rollback

- restore prior lockfile and package-manager fields
- do not partially retain both npm and pnpm locks in `recica`

### Acceptance criteria

- all apps build and test on Node 24
- all apps pin the same exact pnpm 11 version
- no `package-lock.json` remains
- each app retains its own lockfile
- Coolify build instructions are updated

---

## 4. Phase 2 — Convert Tools to static SvelteKit

### Objective

Remove Tools' Node application runtime while preserving all behavior and SEO.

### Dependency/configuration changes

- remove `@sveltejs/adapter-node`
- add `@sveltejs/adapter-static`
- configure strict static output
- add root prerender configuration
- keep fallback undefined
- verify every route is included
- keep source maps disabled for production

### Site-origin migration

Current logic accepts `PUBLIC_SITE_URL` and falls back to request origin.

Replace it with deterministic build-time logic:

- fixed production fallback: `https://tools.recica.dev`
- optional validated build-time override for E2E/local use
- no request URL parameter
- invalid production configuration should be visible during build
- preview indexing is controlled separately

Update:

- canonical generation
- Open Graph URLs
- JSON-LD
- robots
- sitemap
- tests

### Machine endpoint migration

`robots.txt`:

- prerender it
- use canonical sitemap URL
- default to normal crawling in production
- disallow preview indexing
- do not add speculative crawler-specific blocks

`sitemap.xml`:

- prerender it
- source routes from the tool registry
- ensure unique canonical URLs
- omit fake build-date `lastmod`
- use per-tool substantive dates only if maintained accurately
- exclude `/health`

`/health`:

Preferred options, in order:

1. Nginx exact route returning plain text `OK`
2. static `health.txt` with Coolify check updated
3. a prerendered endpoint if generated file serving is verified

Do not retain a Node runtime just for health checks.

### Docker migration

Replace the current Node runtime Dockerfile with:

- Node 24 builder
- pinned pnpm
- frozen install
- static build
- unprivileged Nginx runtime
- app build copied to web root
- version-controlled Nginx config
- non-root runtime
- health check
- no production dependencies
- no source files

Preserve the app-directory build context.

### Nginx configuration

Implement:

- clean route resolution
- true 404 status
- branded 404 document
- `/health`
- immutable cache for `/_app/immutable/`
- revalidation for HTML
- security headers
- compression through Nginx and/or Cloudflare
- correct MIME types
- no directory listing

### Playwright migration

Replace Node-server startup:

```text
vite build && node build
```

with production-static preview startup, for example:

```text
pnpm build && pnpm preview --host 127.0.0.1 --port 4174
```

Validate the exact supported command.

Add tests proving:

- every registry route returns 200
- every route contains an H1
- every route contains canonical metadata
- production HTML is present without client JavaScript execution
- unknown routes return 404
- robots and sitemap are generated
- all current tool operations still work
- no tool input is transmitted

### Coolify changes

- keep Dockerfile build pack
- expose static-server port, likely 8080
- update health path/port
- remove obsolete `PORT=3000` Node configuration
- keep domain and Cloudflare proxy unchanged
- deploy to preview first

### Rollback

Maintain the old deployment configuration until the static preview is verified.

Rollback path:

- restore adapter-node dependency/config
- restore old Dockerfile
- restore port 3000 and `/health`
- redeploy previous commit in Coolify

### Acceptance criteria

- no `adapter-node`
- no production Node runtime
- no `node build`
- no server hook dependency
- all 24 tools pass
- complete HTML is generated
- 404 behavior is correct
- sitemap/robots are correct
- final headers are present
- runtime resource use is lower than baseline
- production deploy succeeds

---

## 5. Phase 3 — Convert Labs to static SvelteKit

### Objective

Apply the validated Tools pattern to Labs.

### Tasks

- swap adapter-node for adapter-static
- add strict full prerendering
- migrate canonical/indexing logic to build time
- prerender robots and sitemap
- remove Node health endpoint
- replace Dockerfile runtime with static unprivileged server
- add Labs-specific Nginx configuration
- update Playwright preview startup
- verify homepage, experiment, 404, metadata, robots, and sitemap
- confirm current experiment logic remains entirely client-side

### Labs-specific constraint

Do not make the current experiment generic merely to support static generation.

If a route cannot prerender, determine why and fix the route. Do not disable strictness or add an SPA fallback.

### Acceptance criteria

Same static-runtime criteria as Tools, plus:

- Parental Gate behavior remains correct
- homepage remains selective
- no dormant server scaffolding remains

---

## 6. Phase 4 — Security and CSP hardening

### Objective

Replace server-hook security with a tested static-site security model.

### Tasks

- remove obsolete `hooks.server.ts`
- add SvelteKit CSP configuration using hash mode where supported
- eliminate `unsafe-inline` from scripts
- preserve only tested style exceptions
- add Nginx `frame-ancestors 'none'` CSP header
- add defense-in-depth headers
- audit all third-party origins
- verify zero unexpected external requests
- audit iframe sandbox behavior
- audit download/blob/data URL behavior
- verify service-worker-compatible directives before Phase 8
- add production header smoke tests
- verify Recica's final headers through Cloudflare/Coolify and document the authoritative layer

### Rollout strategy

1. build/test locally
2. deploy a preview
3. inspect browser console for CSP violations
4. use report-only policy if a reporting endpoint exists
5. enforce only after all routes pass

Do not create a CSP reporting backend solely for these sites.

### Acceptance criteria

- no `unsafe-eval`
- no third-party scripts
- no wildcard sources
- script policy uses hashes/self
- HTML preview works
- QR/barcode exports work
- all apps have documented final headers
- no duplicate contradictory CSP policies

---

## 7. Phase 5 — GitHub Actions and maintenance automation

See `05_CI_CD_AND_MAINTENANCE.md` for the full design.

Implement:

- PR quality workflow
- E2E/accessibility workflow
- security workflow
- scheduled cross-browser/performance workflow
- dependency update configuration
- branch-protection documentation
- action SHA pinning
- artifact retention policy

Do not add GitHub deployment jobs that duplicate Coolify.

Acceptance:

- a failing check blocks merge
- a clean PR passes without production deployment
- merge to master remains the Coolify trigger

---

## 8. Phase 6 — Quality gates

### Unit testing

Tools:

- pure logic for every tool
- invalid input
- boundaries
- Unicode
- empty input
- size-limit behavior
- security-sensitive edge cases

Labs:

- pure decision logic
- route metadata/indexing helpers
- boundary cases

### End-to-end testing

- happy and invalid path for every tool
- keyboard behavior
- clipboard/download behavior where applicable
- no console errors
- no unexpected network
- metadata
- 404
- robots
- sitemap
- reduced motion
- forced colors
- mobile viewport

### Performance

- baseline compressed route assets
- create budget-check script
- Lighthouse CI on representative routes
- fail meaningful regressions
- record approved exceptions

### Accessibility

- axe
- keyboard
- focus trap/restoration
- status/error announcements
- zoom/reflow smoke tests
- mobile
- cross-browser scheduled run

Acceptance criteria are in `04_QUALITY_STANDARD.md`.

---

## 9. Phase 7 — Tools SEO and AI-discoverability content

### Objective

Make every tool page genuinely useful to humans, search engines, and answer systems.

### Content structure per tool

Keep the interactive tool near the top.

Add:

1. direct answer
2. what it does
3. how it works
4. real example
5. privacy behavior
6. supported formats
7. input limits
8. common errors
9. relevant standards/references
10. related tools
11. genuine review/update date where maintained

### Data architecture

Do not turn the app into a generic content engine.

Recommended patterns:

- keep catalog metadata in the existing tool registry
- keep detailed explanatory content route-local or in explicit per-tool content modules
- use a typed content contract where it reduces inconsistency
- do not create one giant unreviewable SEO object

### Structured data

Audit existing:

- `WebSite`
- publisher/author identity
- `CollectionPage`
- `ItemList`
- `SoftwareApplication`
- `BreadcrumbList`

Ensure:

- visible content matches JSON-LD
- no unsupported claims
- no fake ratings
- canonical URLs are correct
- application category and operating-system data are truthful
- dates are substantive

### Webmaster tooling

Manual owner tasks:

- verify all domains in Google Search Console
- verify all domains in Bing Webmaster Tools
- submit sitemaps
- monitor crawl/indexing
- use Bing AI Performance
- use Google generative-AI/Search reports where available

No client analytics are added.

---

## 10. Phase 8 — Tools offline caching

### Objective

Allow repeat use without network while preserving privacy and update correctness.

### Implementation

Use SvelteKit's native service-worker integration.

Cache:

- fingerprinted build assets
- public static files
- route documents required for built-in tools

Do not cache:

- user input
- user output
- clipboard content
- POST requests
- third-party requests
- arbitrary query-string variants
- error pages indefinitely

Strategy:

- cache-first for immutable assets
- network-first or stale-while-revalidate for HTML
- versioned cache names
- delete old caches on activation
- claim clients only after safe activation
- provide predictable update behavior

### Tests

- first online visit populates cache
- representative tools load offline
- old cache is removed after version change
- no input appears in Cache Storage
- no install banner is forced
- service worker does not break development or E2E

---

## 11. Phase 9 — Final cleanup

Tasks:

- update all README files
- remove obsolete Node runtime documentation
- remove obsolete health/server-hook files
- remove unused environment variables
- remove generated test artifacts accidentally committed
- run dependency audit
- run link checker
- run full acceptance checklist
- record before/after bundle, image, and runtime metrics
- verify production manually after deployment
- keep rollback commit references

Do not publish quality scores on the public sites unless the owner explicitly requests it.
