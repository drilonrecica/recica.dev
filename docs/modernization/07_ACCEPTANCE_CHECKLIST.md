# 07 — Final Acceptance Checklist

Use this checklist before declaring the modernization complete.

A checked item means it has been verified, not merely implemented.
Unchecked items in this dated implementation audit require owner,
infrastructure, scheduled-browser, or manual assistive-technology validation.
See [`final/2026-07-29.md`](./final/2026-07-29.md) for evidence and handoff.

---

## A. Product boundaries

- [x] `recica` remains the flagship identity site.
- [x] `tools` remains the stable browser-utilities product.
- [x] `labs` remains the selective experimentation product.
- [x] No app has absorbed another app's product responsibility.
- [x] No shared design system has created unnecessary coupling.
- [x] No framework rewrite occurred.

---

## B. Toolchain

- [x] All three apps use Node 24 LTS for builds and CI.
- [x] All three apps pin the same exact stable pnpm 11 version.
- [x] `recica/package-lock.json` is removed.
- [x] `recica/pnpm-lock.yaml` exists.
- [x] `tools/pnpm-lock.yaml` is current.
- [x] `labs/pnpm-lock.yaml` is current.
- [x] Each app has Node and pnpm engine constraints.
- [x] Frozen installs pass.
- [x] No root pnpm workspace was added.
- [x] Root Makefile commands use pnpm consistently.
- [x] Documentation no longer instructs users to use npm.

---

## C. Recica architecture/deployment

- [x] Astro remains.
- [x] Static `dist/` output remains.
- [x] No server adapter exists.
- [ ] Coolify Nixpacks remains configured.
- [ ] Static-site option remains enabled.
- [x] Publish directory is `dist`.
- [x] Production canonical is `https://recica.dev`.
- [x] Preview builds are noindex.
- [x] Existing stable anchors still work.
- [x] CV and contact links work.
- [x] Sitemap and robots are valid.
- [ ] Production headers were audited.

---

## D. Tools static migration

- [x] `@sveltejs/adapter-node` is removed.
- [x] `@sveltejs/adapter-static` is installed.
- [x] Static adapter strict mode is enabled.
- [x] All public routes prerender.
- [x] No SPA fallback exists.
- [x] `hooks.server.ts` is removed or no longer relied upon.
- [x] Request-origin canonical fallback is removed.
- [x] Production canonical is `https://tools.recica.dev`.
- [x] Preview build is noindex.
- [x] `robots.txt` is generated statically.
- [x] `sitemap.xml` is generated statically.
- [x] Sitemap does not assign today's date to unchanged pages.
- [x] Health behavior no longer requires SvelteKit server code.
- [x] Docker runtime is a static web server.
- [x] Docker runtime is non-root.
- [x] Final image does not require Node.
- [x] Final image does not contain app `node_modules`.
- [ ] Final image health check passes.
- [ ] Coolify port/health configuration is updated.
- [x] Unknown route returns 404.
- [x] Branded 404 renders.
- [x] All 24 tool routes return 200.
- [x] All existing tool behavior passes E2E.
- [x] No tool input is sent over network.
- [x] No tool input is persisted.
- [ ] Runtime memory is lower than Node baseline.
- [ ] Image size is recorded and acceptable.

---

## E. Labs static migration

- [x] `@sveltejs/adapter-node` is removed.
- [x] `@sveltejs/adapter-static` is installed.
- [x] Static adapter strict mode is enabled.
- [x] Landing page prerenders.
- [x] Parental Gate route prerenders.
- [x] 404 behavior is correct.
- [x] Robots and sitemap are static.
- [x] Production canonical is `https://labs.recica.dev`.
- [x] Preview is noindex.
- [x] Docker runtime is static and non-root.
- [x] No Node application runtime remains.
- [x] Current experiment behavior passes.
- [x] No persistence/backend was introduced.
- [ ] Runtime resource usage is lower than baseline.

---

## F. Security

- [x] No `unsafe-eval` exists.
- [x] `script-src` no longer depends on `unsafe-inline`.
- [x] CSP hashes work on prerendered pages.
- [x] `frame-ancestors 'none'` is delivered as an HTTP header.
- [x] `X-Frame-Options: DENY` is present.
- [x] `X-Content-Type-Options: nosniff` is present.
- [x] Referrer policy is present.
- [x] Permissions policy is present.
- [x] HSTS ownership is documented.
- [x] No contradictory duplicate CSP headers exist.
- [x] No unexpected third-party request exists.
- [x] Fonts are self-hosted.
- [x] Production source maps are not public.
- [x] Tools HTML preview remains sandboxed and sanitized.
- [x] QR/barcode/blob/download behavior works under CSP.
- [ ] Container scan has no unresolved critical/high runtime issue.
- [ ] Secret scan passes.
- [x] GitHub Actions are SHA-pinned.

---

## G. Privacy

- [x] No analytics package exists.
- [x] No analytics network request occurs.
- [x] No session replay exists.
- [x] Tools input stays in browser memory.
- [x] Tools output stays in browser memory.
- [x] Inputs are not stored in localStorage.
- [x] Inputs are not stored in IndexedDB.
- [x] Inputs are not placed in URLs.
- [x] Inputs are not logged.
- [x] Service worker never caches input/output.
- [x] Privacy statements match actual implementation.

---

## H. Performance

- [x] Baseline metrics are recorded.
- [x] Post-migration metrics are recorded.
- [x] Bundle-budget script exists.
- [x] Meaningful bundle regressions fail CI.
- [x] No global loading of route-only heavy libraries.
- [x] Immutable assets use long immutable caching.
- [x] HTML uses revalidation-friendly caching.
- [x] Unknown routes are not served by an SPA fallback.
- [x] Fonts include only needed weights/subsets.
- [x] Public source maps are absent.
- [x] Representative Lighthouse Performance score is 95+ or exceptions are documented.
- [x] LCP/INP/CLS diagnostics are acceptable.
- [ ] Tools/Labs runtime CPU and memory are documented.

---

## I. Tools input limits

- [x] Central or consistent input-limit policy exists.
- [x] Limits use UTF-8 byte size where relevant.
- [x] Diff has a conservative combined limit.
- [x] JSON/XML/SQL/Markdown/HTML have explicit limits.
- [x] Bulk generation has count limits.
- [x] QR/barcode constraints are validated.
- [x] Limit errors show actual and maximum sizes.
- [x] Limit errors state processing is local.
- [x] No input is silently truncated.
- [x] Representative low/mid-range device testing was performed or documented as pending.

---

## J. Testing

- [x] Formatting passes.
- [x] Lint passes.
- [x] Type/framework checks pass.
- [x] Production builds pass.
- [x] Tools unit tests cover every core tool.
- [x] Labs pure logic tests pass.
- [x] Coverage thresholds are configured.
- [x] Every tool has happy-path E2E.
- [x] Every tool has invalid-input E2E.
- [x] Clipboard/download behavior is tested where applicable.
- [x] Search/filter/theme E2E passes.
- [x] Robots/sitemap E2E passes.
- [x] 404 E2E passes.
- [x] No console errors occur.
- [x] Unexpected network requests fail tests.
- [x] Chromium PR suite passes.
- [ ] Scheduled Firefox/WebKit suite passes.

---

## K. Accessibility

- [x] Target WCAG 2.2 AA is documented.
- [x] Axe tests cover representative routes.
- [x] Skip links work.
- [x] Heading hierarchy is valid.
- [x] Keyboard navigation works.
- [x] Focus is visible.
- [x] Search/modal focus is trapped correctly.
- [x] Focus restores after closing overlays.
- [x] Errors are associated with fields.
- [x] Dynamic statuses are announced.
- [x] Reduced motion is respected.
- [x] Forced-colors mode is usable.
- [ ] 200% zoom/reflow smoke test passes.
- [x] Mobile touch targets are adequate.
- [x] No keyboard trap exists.
- [x] Manual screen-reader test is completed or explicitly recorded as pending.

---

## L. SEO

- [x] Every indexable page has a unique title.
- [x] Every indexable page has a useful description.
- [x] Every indexable page has one clear H1.
- [x] Canonicals are correct.
- [x] Production pages are indexable.
- [x] Preview pages are noindex.
- [x] Internal links are descriptive.
- [x] Broken-link check passes.
- [x] Sitemap contains only canonical public URLs.
- [x] Sitemap dates are truthful.
- [x] Robots references the correct sitemap.
- [x] JSON-LD parses.
- [x] Structured data matches visible content.
- [x] No fake review/rating data exists.
- [x] No synonym/doorway pages were created.
- [x] No hidden keyword content exists.

---

## M. Tool content and AI discoverability

For every serious tool page:

- [x] Direct answer exists near the top.
- [x] What-it-does section exists.
- [x] How-it-works section exists.
- [x] Real example exists.
- [x] Privacy behavior is explicit.
- [x] Supported formats are explicit.
- [x] Input limits are explicit.
- [x] Common errors are explained.
- [x] Relevant standards/reference links exist where useful.
- [x] Related tools are linked.
- [x] Review/update date is genuine or omitted.
- [x] Content is unique and non-commodity.
- [x] Core explanatory text exists in generated HTML.
- [x] No `llms.txt` dependency or claim exists.
- [x] Google Search Console verification is documented as a manual owner task.
- [x] Bing Webmaster Tools verification is documented as a manual owner task.
- [x] Bing AI Performance review is documented.

---

## N. Offline Tools

- [x] Service worker added only after static migration.
- [x] Fingerprinted assets cache offline.
- [x] Representative tool routes work offline after first visit.
- [x] HTML update strategy is documented.
- [x] Old cache versions are removed.
- [x] No user input/output enters Cache Storage.
- [x] No third-party request is cached.
- [x] No forced install prompt exists.
- [x] Service worker update does not leave app permanently stale.
- [x] Offline E2E passes.

---

## O. CI/CD and operations

- [x] `quality.yml` exists.
- [x] `e2e.yml` exists.
- [x] `security.yml` exists.
- [x] `scheduled.yml` exists.
- [x] Dependabot or Renovate exists, but not both.
- [ ] Branch protection is configured.
- [ ] Required checks block merge.
- [x] Coolify remains deployment authority.
- [x] Preview deployment is noindex.
- [x] Failed deployment preserves a rollback path.
- [x] Production smoke checks are documented.
- [ ] Coolify resource limits are reviewed.
- [ ] Cloudflare SSL mode is Full (strict).
- [ ] Cloudflare does not inject scripts that violate CSP.
- [ ] Cache rules match the origin policy.

---

## P. Documentation and cleanup

- [x] Root README reflects final architecture.
- [x] Recica README uses pnpm and current deployment details.
- [x] Tools README describes static deployment.
- [x] Labs README describes static deployment.
- [x] Node server commands are removed.
- [x] Obsolete environment variables are removed.
- [x] Obsolete health/server-hook files are removed.
- [x] No generated test artifact is committed.
- [x] No stale planning document contradicts the final architecture.
- [x] Architecture decisions are preserved.
- [x] Before/after measurements are recorded.
- [x] Rollback instructions are current.

---

## Final sign-off

Modernization is complete only when:

- all required checklist items are checked
- exceptions are written and approved
- production smoke tests pass
- owner review is complete
- the repository remains understandable to a new coding agent with no conversation history
