# 07 — Final Acceptance Checklist

Use this checklist before declaring the modernization complete.

A checked item means it has been verified, not merely implemented.

---

## A. Product boundaries

- [ ] `recica` remains the flagship identity site.
- [ ] `tools` remains the stable browser-utilities product.
- [ ] `labs` remains the selective experimentation product.
- [ ] No app has absorbed another app's product responsibility.
- [ ] No shared design system has created unnecessary coupling.
- [ ] No framework rewrite occurred.

---

## B. Toolchain

- [ ] All three apps use Node 24 LTS for builds and CI.
- [ ] All three apps pin the same exact stable pnpm 11 version.
- [ ] `recica/package-lock.json` is removed.
- [ ] `recica/pnpm-lock.yaml` exists.
- [ ] `tools/pnpm-lock.yaml` is current.
- [ ] `labs/pnpm-lock.yaml` is current.
- [ ] Each app has Node and pnpm engine constraints.
- [ ] Frozen installs pass.
- [ ] No root pnpm workspace was added.
- [ ] Root Makefile commands use pnpm consistently.
- [ ] Documentation no longer instructs users to use npm.

---

## C. Recica architecture/deployment

- [ ] Astro remains.
- [ ] Static `dist/` output remains.
- [ ] No server adapter exists.
- [ ] Coolify Nixpacks remains configured.
- [ ] Static-site option remains enabled.
- [ ] Publish directory is `dist`.
- [ ] Production canonical is `https://recica.dev`.
- [ ] Preview builds are noindex.
- [ ] Existing stable anchors still work.
- [ ] CV and contact links work.
- [ ] Sitemap and robots are valid.
- [ ] Production headers were audited.

---

## D. Tools static migration

- [ ] `@sveltejs/adapter-node` is removed.
- [ ] `@sveltejs/adapter-static` is installed.
- [ ] Static adapter strict mode is enabled.
- [ ] All public routes prerender.
- [ ] No SPA fallback exists.
- [ ] `hooks.server.ts` is removed or no longer relied upon.
- [ ] Request-origin canonical fallback is removed.
- [ ] Production canonical is `https://tools.recica.dev`.
- [ ] Preview build is noindex.
- [ ] `robots.txt` is generated statically.
- [ ] `sitemap.xml` is generated statically.
- [ ] Sitemap does not assign today's date to unchanged pages.
- [ ] Health behavior no longer requires SvelteKit server code.
- [ ] Docker runtime is a static web server.
- [ ] Docker runtime is non-root.
- [ ] Final image does not require Node.
- [ ] Final image does not contain app `node_modules`.
- [ ] Final image health check passes.
- [ ] Coolify port/health configuration is updated.
- [ ] Unknown route returns 404.
- [ ] Branded 404 renders.
- [ ] All 24 tool routes return 200.
- [ ] All existing tool behavior passes E2E.
- [ ] No tool input is sent over network.
- [ ] No tool input is persisted.
- [ ] Runtime memory is lower than Node baseline.
- [ ] Image size is recorded and acceptable.

---

## E. Labs static migration

- [ ] `@sveltejs/adapter-node` is removed.
- [ ] `@sveltejs/adapter-static` is installed.
- [ ] Static adapter strict mode is enabled.
- [ ] Landing page prerenders.
- [ ] Parental Gate route prerenders.
- [ ] 404 behavior is correct.
- [ ] Robots and sitemap are static.
- [ ] Production canonical is `https://labs.recica.dev`.
- [ ] Preview is noindex.
- [ ] Docker runtime is static and non-root.
- [ ] No Node application runtime remains.
- [ ] Current experiment behavior passes.
- [ ] No persistence/backend was introduced.
- [ ] Runtime resource usage is lower than baseline.

---

## F. Security

- [ ] No `unsafe-eval` exists.
- [ ] `script-src` no longer depends on `unsafe-inline`.
- [ ] CSP hashes work on prerendered pages.
- [ ] `frame-ancestors 'none'` is delivered as an HTTP header.
- [ ] `X-Frame-Options: DENY` is present.
- [ ] `X-Content-Type-Options: nosniff` is present.
- [ ] Referrer policy is present.
- [ ] Permissions policy is present.
- [ ] HSTS ownership is documented.
- [ ] No contradictory duplicate CSP headers exist.
- [ ] No unexpected third-party request exists.
- [ ] Fonts are self-hosted.
- [ ] Production source maps are not public.
- [ ] Tools HTML preview remains sandboxed and sanitized.
- [ ] QR/barcode/blob/download behavior works under CSP.
- [ ] Container scan has no unresolved critical/high runtime issue.
- [ ] Secret scan passes.
- [ ] GitHub Actions are SHA-pinned.

---

## G. Privacy

- [ ] No analytics package exists.
- [ ] No analytics network request occurs.
- [ ] No session replay exists.
- [ ] Tools input stays in browser memory.
- [ ] Tools output stays in browser memory.
- [ ] Inputs are not stored in localStorage.
- [ ] Inputs are not stored in IndexedDB.
- [ ] Inputs are not placed in URLs.
- [ ] Inputs are not logged.
- [ ] Service worker never caches input/output.
- [ ] Privacy statements match actual implementation.

---

## H. Performance

- [ ] Baseline metrics are recorded.
- [ ] Post-migration metrics are recorded.
- [ ] Bundle-budget script exists.
- [ ] Meaningful bundle regressions fail CI.
- [ ] No global loading of route-only heavy libraries.
- [ ] Immutable assets use long immutable caching.
- [ ] HTML uses revalidation-friendly caching.
- [ ] Unknown routes are not served by an SPA fallback.
- [ ] Fonts include only needed weights/subsets.
- [ ] Public source maps are absent.
- [ ] Representative Lighthouse Performance score is 95+ or exceptions are documented.
- [ ] LCP/INP/CLS diagnostics are acceptable.
- [ ] Tools/Labs runtime CPU and memory are documented.

---

## I. Tools input limits

- [ ] Central or consistent input-limit policy exists.
- [ ] Limits use UTF-8 byte size where relevant.
- [ ] Diff has a conservative combined limit.
- [ ] JSON/XML/SQL/Markdown/HTML have explicit limits.
- [ ] Bulk generation has count limits.
- [ ] QR/barcode constraints are validated.
- [ ] Limit errors show actual and maximum sizes.
- [ ] Limit errors state processing is local.
- [ ] No input is silently truncated.
- [ ] Representative low/mid-range device testing was performed or documented as pending.

---

## J. Testing

- [ ] Formatting passes.
- [ ] Lint passes.
- [ ] Type/framework checks pass.
- [ ] Production builds pass.
- [ ] Tools unit tests cover every core tool.
- [ ] Labs pure logic tests pass.
- [ ] Coverage thresholds are configured.
- [ ] Every tool has happy-path E2E.
- [ ] Every tool has invalid-input E2E.
- [ ] Clipboard/download behavior is tested where applicable.
- [ ] Search/filter/theme E2E passes.
- [ ] Robots/sitemap E2E passes.
- [ ] 404 E2E passes.
- [ ] No console errors occur.
- [ ] Unexpected network requests fail tests.
- [ ] Chromium PR suite passes.
- [ ] Scheduled Firefox/WebKit suite passes.

---

## K. Accessibility

- [ ] Target WCAG 2.2 AA is documented.
- [ ] Axe tests cover representative routes.
- [ ] Skip links work.
- [ ] Heading hierarchy is valid.
- [ ] Keyboard navigation works.
- [ ] Focus is visible.
- [ ] Search/modal focus is trapped correctly.
- [ ] Focus restores after closing overlays.
- [ ] Errors are associated with fields.
- [ ] Dynamic statuses are announced.
- [ ] Reduced motion is respected.
- [ ] Forced-colors mode is usable.
- [ ] 200% zoom/reflow smoke test passes.
- [ ] Mobile touch targets are adequate.
- [ ] No keyboard trap exists.
- [ ] Manual screen-reader test is completed or explicitly recorded as pending.

---

## L. SEO

- [ ] Every indexable page has a unique title.
- [ ] Every indexable page has a useful description.
- [ ] Every indexable page has one clear H1.
- [ ] Canonicals are correct.
- [ ] Production pages are indexable.
- [ ] Preview pages are noindex.
- [ ] Internal links are descriptive.
- [ ] Broken-link check passes.
- [ ] Sitemap contains only canonical public URLs.
- [ ] Sitemap dates are truthful.
- [ ] Robots references the correct sitemap.
- [ ] JSON-LD parses.
- [ ] Structured data matches visible content.
- [ ] No fake review/rating data exists.
- [ ] No synonym/doorway pages were created.
- [ ] No hidden keyword content exists.

---

## M. Tool content and AI discoverability

For every serious tool page:

- [ ] Direct answer exists near the top.
- [ ] What-it-does section exists.
- [ ] How-it-works section exists.
- [ ] Real example exists.
- [ ] Privacy behavior is explicit.
- [ ] Supported formats are explicit.
- [ ] Input limits are explicit.
- [ ] Common errors are explained.
- [ ] Relevant standards/reference links exist where useful.
- [ ] Related tools are linked.
- [ ] Review/update date is genuine or omitted.
- [ ] Content is unique and non-commodity.
- [ ] Core explanatory text exists in generated HTML.
- [ ] No `llms.txt` dependency or claim exists.
- [ ] Google Search Console verification is documented as a manual owner task.
- [ ] Bing Webmaster Tools verification is documented as a manual owner task.
- [ ] Bing AI Performance review is documented.

---

## N. Offline Tools

- [ ] Service worker added only after static migration.
- [ ] Fingerprinted assets cache offline.
- [ ] Representative tool routes work offline after first visit.
- [ ] HTML update strategy is documented.
- [ ] Old cache versions are removed.
- [ ] No user input/output enters Cache Storage.
- [ ] No third-party request is cached.
- [ ] No forced install prompt exists.
- [ ] Service worker update does not leave app permanently stale.
- [ ] Offline E2E passes.

---

## O. CI/CD and operations

- [ ] `quality.yml` exists.
- [ ] `e2e.yml` exists.
- [ ] `security.yml` exists.
- [ ] `scheduled.yml` exists.
- [ ] Dependabot or Renovate exists, but not both.
- [ ] Branch protection is configured.
- [ ] Required checks block merge.
- [ ] Coolify remains deployment authority.
- [ ] Preview deployment is noindex.
- [ ] Failed deployment preserves a rollback path.
- [ ] Production smoke checks are documented.
- [ ] Coolify resource limits are reviewed.
- [ ] Cloudflare SSL mode is Full (strict).
- [ ] Cloudflare does not inject scripts that violate CSP.
- [ ] Cache rules match the origin policy.

---

## P. Documentation and cleanup

- [ ] Root README reflects final architecture.
- [ ] Recica README uses pnpm and current deployment details.
- [ ] Tools README describes static deployment.
- [ ] Labs README describes static deployment.
- [ ] Node server commands are removed.
- [ ] Obsolete environment variables are removed.
- [ ] Obsolete health/server-hook files are removed.
- [ ] No generated test artifact is committed.
- [ ] No stale planning document contradicts the final architecture.
- [ ] Architecture decisions are preserved.
- [ ] Before/after measurements are recorded.
- [ ] Rollback instructions are current.

---

## Final sign-off

Modernization is complete only when:

- all required checklist items are checked
- exceptions are written and approved
- production smoke tests pass
- owner review is complete
- the repository remains understandable to a new coding agent with no conversation history
