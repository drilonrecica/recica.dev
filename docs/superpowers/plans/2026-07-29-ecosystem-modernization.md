# recica.dev Ecosystem Modernization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> `superpowers:subagent-driven-development` or `superpowers:executing-plans`
> to implement this plan task-by-task. Use test-driven development for every
> behavior change.

**Goal:** Modernize Recica, Tools, and Labs into three independent static
publications with distinct approved visual identities, stronger content,
privacy-preserving behavior, and production-grade delivery.

**Architecture:** Recica remains an Astro static site. Tools and Labs remain
SvelteKit/Svelte applications but replace adapter-node and Node production
runtimes with strict prerendering and an unprivileged Nginx static runtime.
Product UI remains independent; only repository policy, validation, CI, and
operational standards are aligned.

**Tech Stack:** Node.js 24 LTS, `pnpm@11.18.0`, Astro 5, SvelteKit 2, Svelte 5,
TypeScript, Tailwind CSS 4, Vitest, Playwright, axe-core, Nginx unprivileged,
Coolify, and Cloudflare.

## Global constraints

- Preserve the product boundaries and human approval gates in `AGENTS.md`.
- Keep an independent package manifest, lockfile, and deployment context in
  every app; do not add a root workspace or shared component library.
- Keep Recica static and backend-free.
- Keep all built-in Tools processing in browser memory with no user-data
  persistence, URL state, server request, logging, or service-worker caching.
- Keep Labs client-only and static; add no persistence, accounts, or backend.
- Use fixed production canonicals and make preview output noindex.
- Add no analytics, third-party JavaScript, remote fonts, wildcard CSP source,
  `unsafe-eval`, public production source map, or fabricated claim.
- Target WCAG 2.2 AA and the budgets in
  `docs/modernization/04_QUALITY_STANDARD.md`.
- Keep every phase deployable and update tests and documentation in the same
  phase.

---

### Task 1: Baseline and guardrails

- Record routes, builds, tests, headers, privacy, bundles, Lighthouse,
  containers, and known failures in `docs/modernization/baseline/`.
- Remove tracked generated browser artifacts and ensure ignore rules cover
  reports, traces, screenshots, and coverage.
- Verify the baseline document distinguishes unavailable Docker measurements
  from successful checks.

### Task 2: Node 24 and pnpm 11

- Pin exact pnpm and Node engine policy in every app.
- Replace Recica's npm lock with an independent pnpm lock.
- Update the Makefile, pnpm helper, Node-major file, READMEs, and frozen-install
  commands without adding a root workspace.
- Run all app checks under Node 24.

### Task 3: Tools static architecture

- Write failing tests for deterministic origin/indexing behavior, static
  machine endpoints, complete prerendering, and 404 handling.
- Replace adapter-node with strict adapter-static and remove server hooks and
  request-time behavior.
- Add the two-stage Node 24/Nginx image and static-server configuration.
- Verify all 24 routes, endpoints, generated HTML, cache rules, headers, health,
  and true 404 behavior.

### Task 4: Labs static architecture

- Apply the proven Tools adapter/container/indexing pattern.
- Preserve the homepage, Parental Gate, 404, robots, sitemap, and health
  behavior with complete generated HTML and no backend.

### Task 5: Security, CI, and quality gates

- Add hash CSP, authoritative response-header ownership, truthful sitemaps,
  preview noindex behavior, and public source-map checks.
- Add path-aware quality/E2E/security/scheduled workflows with immutable action
  SHAs and Dependabot-only maintenance.
- Add bundle budgets, network/storage checks, link/metadata validation,
  container checks, and representative Lighthouse diagnostics.

### Task 6: Recica Technical Dossier

- Write route/metadata/anchor tests before replacing the current presentation.
- Build the approved homepage, About page, three verified case studies, and
  branded 404.
- Remove Blueprint/verbose behavior and presentation JavaScript.
- Preserve CV, email, legacy anchors, fixed canonical, and static deployment.

### Task 7: Tools Utility Switchboard

- Write component/E2E tests for the shell, search, categories, theme, focus,
  privacy page, tool numbering, limit/status regions, and mobile behavior.
- Add the typed input policy and content contracts.
- Update tool logic and content in small route-family batches with red/green
  unit and E2E cycles.
- Keep every operation local and retain tested clipboard, download, QR/barcode,
  and sandboxed-preview behavior.

### Task 8: Labs Research Notebook

- Write manifest, route, decision-logic, and interaction tests first.
- Rebuild the index and split the Parental Gate route into focused components
  without changing its six patterns or helper decisions.
- Reduce global font loading and keep experiment-only code route-local.

### Task 9: Tools offline caching

- Write service-worker cache-policy tests before registration.
- Cache versioned application assets and public documents only.
- Verify offline routes, cache upgrades, excluded user data/query variants, and
  predictable update behavior.

### Task 10: Acceptance and rollout preparation

- Run the full repository and app-specific gates.
- Reconcile all README, modernization, deployment, rollback, and acceptance
  documentation with the final code.
- Record post-change metrics and compare them with the baseline.
- Stop before push, merge, Coolify, Cloudflare, branch-protection, or webmaster
  changes and present the verified Tools → Labs → Recica rollout steps.
