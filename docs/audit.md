# recica.dev Repository Audit

Date: 2026-04-18  
Targets: `recica`, `tools`, `labs`, root repository structure, dependency posture, and live public deployments  
Audit scope: source review, local verification, dependency/supply-chain review, and live black-box checks against `https://recica.dev`, `https://tools.recica.dev`, `https://labs.recica.dev`, and `https://labs.recica.dev/parental-gate-lab`

## Executive Summary

This repository is in materially better shape than a typical personal multi-app setup. The public surfaces are coherent, the route-level SEO/indexing work is mostly in place, and the local verification baseline is strong for `tools` and `labs`.

No critical findings were confirmed.

The main risk concentration is not in obvious application bugs. It is in:

1. inconsistent production hardening across the three public domains,
2. supply-chain and container hygiene gaps,
3. release/verification fragmentation across the repo,
4. thinner quality controls on `recica` than on the other two apps.

Positive observations:

- All three projects expose `robots.txt` and sitemap endpoints in production.
- `tools` and `labs` return consistent security headers in live black-box checks.
- `tools` and `labs` production dependency graphs are clean at `moderate+` severity.
- No material accessibility blockers were found in the current automated checks.
- Local verification is strong overall: `recica` build and e2e passed; `tools` check, unit, build, and e2e passed; `labs` check, lint, unit, build, and e2e passed.

Important context:

- This audit reflects the current workspace snapshot, not a clean tagged release.
- One local gate is currently red: `tools` fails `npm run lint` because two files are not formatting-clean.
- Infrastructure conclusions are black-box only unless directly supported by repo code/config.

## Methodology and Evidence Sources

### Evidence layers used

1. Static repo review of app configs, metadata components, Dockerfiles, routing, server hooks, and selected risk surfaces.
2. Local verification through the project’s existing checks.
3. Dependency review via lockfiles, package manifests, `audit`, and `outdated` results.
4. Live black-box checks for headers, canonicals, indexing, and error-route behavior.

### Local verification run

- `recica`
  - `npm run build` — passed
  - `npm run test:e2e` — passed (`3/3`)
- `tools`
  - `npm run check` — passed
  - `npm run lint` — failed on formatting in `src/routes/json/+page.svelte` and `tests/e2e/app.e2e.ts`
  - `npm run test:unit:run` — passed (`25` files, `73` tests)
  - `npm run build` — passed
  - `npm run test:e2e` — passed (`31/31`)
- `labs`
  - `npm run check` — passed
  - `npm run lint` — passed
  - `npm run test:unit:run` — passed (`3` files, `7` tests)
  - `npm run build` — passed
  - `npm run test:e2e` — passed (`13/13`)

### Dependency review run

- `recica`
  - `npm audit --omit=dev --json`
  - `npm outdated --json`
- `tools`
  - `npx --yes pnpm@10.33.0 audit --prod --json`
  - `npx --yes pnpm@10.33.0 audit --json`
  - `npx --yes pnpm@10.33.0 outdated --format json`
- `labs`
  - `npx --yes pnpm@10.33.0 audit --prod --json`
  - `npx --yes pnpm@10.33.0 audit --json`
  - `npx --yes pnpm@10.33.0 outdated --format json`

### Live black-box checks

- Header checks with `curl -I` on the four public routes plus error paths
- Live HTML inspection for:
  - canonical tags
  - robots directives
  - structured-data presence
  - error-page behavior
  - visible head artifacts such as favicons
- Live robots/sitemap fetches for all three public domains

## Scoring and Ranking Model

### Severity

- `Critical`: directly exploitable or materially unsafe in current production use
- `High`: strong production risk with a realistic exploitation or operational impact path
- `Medium`: meaningful weakness or governance gap that should be fixed in normal engineering priority
- `Low`: low-impact defect, polish issue, or narrow-scope hygiene gap
- `Informational`: notable observation with no immediate remediation need

### Importance

- `Portfolio`: affects the overall public estate, cross-app posture, or release governance
- `App`: materially affects one deployed app
- `Local`: currently limited to the working tree or developer workflow

### Priority

- `P0`: immediate stop-the-line remediation
- `P1`: next planned engineering batch
- `P2`: near-term hygiene and governance work
- `P3`: backlog / polish

### Confidence

- `High`: directly observed in source, local verification, or live runtime
- `Medium`: strongly inferred from source/config behavior
- `Low`: possible issue with incomplete evidence

## Findings Table

Sorted by severity, importance, and priority.

| ID | Project | Category | Severity | Importance | Priority | Confidence | Title |
| --- | --- | --- | --- | --- | --- | --- | --- |
| AUD-001 | cross-app | security | Medium | Portfolio | P1 | High | No public domain currently sends `Strict-Transport-Security` |
| AUD-002 | recica | security | Medium | Portfolio | P1 | High | `recica.dev` is deployed without the hardening headers already present on `tools` and `labs` |
| AUD-003 | cross-app | security | Medium | Portfolio | P1 | High | `tools` and `labs` production CSPs still allow inline script and style execution |
| AUD-004 | cross-app | security / performance | Medium | App | P1 | High | `tools` and `labs` runtime Docker images copy the full build-stage `node_modules` tree into production |
| AUD-005 | recica | security | Medium | App | P1 | High | `recica` is pinned below patched Astro/toolchain versions with known advisories in the current production dependency graph |
| AUD-006 | root | quality / maintainability | Medium | Portfolio | P2 | High | Cross-app verification is fragmented by design and has no root orchestration point |
| AUD-007 | recica | quality / maintainability | Medium | App | P2 | High | `recica` has materially thinner quality gates than the other two apps, and the root docs are stale about that posture |
| AUD-008 | tools | quality | Low | Local | P2 | High | The current `tools` snapshot is not lint-clean |
| AUD-009 | tools | quality / maintainability | Low | App | P3 | High | `tools` still ships a Svelte-branded default favicon artifact in production |
| AUD-010 | cross-app | quality | Low | App | P3 | High | Error-route canonical metadata is inconsistent and non-ideal on `tools` and `labs` |

## Detailed Findings

### AUD-001

- `ID`: AUD-001
- `Project`: cross-app
- `Category`: security
- `Severity`: Medium
- `Importance`: Portfolio
- `Priority`: P1
- `Confidence`: High
- `Evidence`:
  - Live `curl -I` checks on `https://recica.dev/`, `https://tools.recica.dev/`, `https://labs.recica.dev/`, and `https://labs.recica.dev/parental-gate-lab` returned no `Strict-Transport-Security` header.
- `Risk / impact`:
  - This leaves HTTPS enforcement entirely to redirect behavior and client defaults.
  - It is not an immediate application exploit, but it is below the expected security baseline for a public multi-domain estate.
- `Recommendation`:
  - Add `Strict-Transport-Security` at the edge/proxy layer for all three domains.
  - Start with a conservative max-age, then move to `includeSubDomains` and `preload` only after validating the full hostname estate.

### AUD-002

- `ID`: AUD-002
- `Project`: recica
- `Category`: security
- `Severity`: Medium
- `Importance`: Portfolio
- `Priority`: P1
- `Confidence`: High
- `Evidence`:
  - Live `curl -I https://recica.dev/` and `curl -I https://recica.dev/about/` returned no `Content-Security-Policy`, `Referrer-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, or `Permissions-Policy`.
  - By contrast, `tools` and `labs` set all of those headers in `tools/src/hooks.server.ts:3-23` and `labs/src/hooks.server.ts:3-23`.
- `Risk / impact`:
  - The flagship is the weakest-hardened public surface despite being the main personal domain.
  - Missing browser hardening headers increase the blast radius of any future content/script injection or framing issue and create an inconsistent security baseline across the estate.
- `Recommendation`:
  - Add the same baseline security headers to the `recica` deployment path at the CDN/proxy layer or host configuration.
  - This is infrastructure work, not Astro component work.

### AUD-003

- `ID`: AUD-003
- `Project`: cross-app
- `Category`: security
- `Severity`: Medium
- `Importance`: Portfolio
- `Priority`: P1
- `Confidence`: High
- `Evidence`:
  - `tools/src/hooks.server.ts:3-13` and `labs/src/hooks.server.ts:3-13` explicitly set:
    - `style-src 'self' 'unsafe-inline'`
    - `script-src 'self' 'unsafe-inline'`
  - The same policy is visible in live header checks for both domains.
  - `tools/src/app.html:12-20` contains an inline theme bootstrap script, which explains at least part of the current CSP relaxation.
  - `labs/src/app.html:1-11` contains no comparable inline script, so the `script-src 'unsafe-inline'` allowance there appears easier to remove.
- `Risk / impact`:
  - The CSP is present, but it is materially weakened against inline script/style injection.
  - This matters more on `tools` and `labs` than on a simple brochure site because both apps process untrusted user input across many routes.
- `Recommendation`:
  - Remove inline bootstrap scripts where possible and move initialization to external modules.
  - Replace blanket `unsafe-inline` with hashes or nonces where inline code is unavoidable.
  - Treat `labs` as the easiest first win because its current template does not appear to need inline JS.

### AUD-004

- `ID`: AUD-004
- `Project`: cross-app
- `Category`: security / performance
- `Severity`: Medium
- `Importance`: App
- `Priority`: P1
- `Confidence`: High
- `Evidence`:
  - `tools/Dockerfile:23-25` copies `/app/node_modules` from the build stage into the runtime image.
  - `labs/Dockerfile:23-25` does the same.
  - Both Dockerfiles install the full dependency graph in the build pipeline before that copy.
- `Risk / impact`:
  - Production images inherit unnecessary dev/build packages, increasing:
    - image size
    - SBOM noise
    - attack surface
    - patching burden
  - This is a classic multi-stage Docker anti-pattern for Node services.
- `Recommendation`:
  - Switch to a production-only deployment step such as `pnpm deploy --prod`, `pnpm prune --prod`, or an equivalent runtime-only install/copy flow.
  - Keep only the built server output plus runtime dependencies in the final image.

### AUD-005

- `ID`: AUD-005
- `Project`: recica
- `Category`: security
- `Severity`: Medium
- `Importance`: App
- `Priority`: P1
- `Confidence`: High
- `Evidence`:
  - `recica/package.json:15-25` pins:
    - `astro` at `^5.17.1`
    - `@tailwindcss/vite` at `^4.1.18`
    - `tailwindcss` at `^4.1.18`
  - `npm outdated --json` shows Astro wanted version `5.18.1`, which is the first patched version for the current advisory range.
  - `npm audit --omit=dev --json` reported `9` advisories in the current production graph, including:
    - Astro allowlist bypass advisory `GHSA-g735-7g2w-hh3f`
    - transitive `rollup`, `vite`, `svgo`, `h3`, `picomatch`, `defu`, and `smol-toml` issues
- `Risk / impact`:
  - Because `recica` deploys as a static site, current runtime exposure is lower than the raw advisory list suggests.
  - The real risk is concentrated in local development, CI/build environments, and future maintenance drift if the toolchain remains behind patched versions.
- `Recommendation`:
  - Upgrade `astro` to at least `5.18.1` immediately, then refresh the lockfile and re-run the audit.
  - Reassess the remaining transitive advisories after that update before escalating further.
- `Status`:
  - Done by Codex on 2026-04-19.
  - Upgraded `recica` from `astro@^5.17.1` to `astro@^5.18.1` and refreshed related package versions:
    - `@astrojs/sitemap` to `^3.7.2`
    - `@tailwindcss/vite` to `^4.2.2`
    - `tailwindcss` to `^4.2.2`
  - Local verification: `recica` build passed after the upgrade.
  - Reassessment: the original unpatched Astro condition is resolved; `npm audit --omit=dev` still reports 7 transitive build-time advisories in the current Astro 5/Tailwind graph, which is a narrower residual maintenance issue than the original version-floor finding.

### AUD-006

- `ID`: AUD-006
- `Project`: root
- `Category`: quality / maintainability
- `Severity`: Medium
- `Importance`: Portfolio
- `Priority`: P2
- `Confidence`: High
- `Evidence`:
  - `README.md:11` explicitly states there is no root workspace runner and no single monorepo build command.
  - `README.md:153-213` documents app-by-app manual verification.
  - Package management is mixed by design:
    - `recica/package.json:1-26` uses npm
    - `tools/package.json:6` uses pnpm
    - `labs/package.json:6` uses pnpm
- `Risk / impact`:
  - This makes cross-app verification manual and easy to partially skip.
  - It raises the cost of CI standardization, release discipline, and security auditing across the full estate.
- `Recommendation`:
  - Add a minimal root orchestration layer.
  - This does not require a full workspace rewrite; a root `Makefile`, task runner, or thin script wrapper is enough if it standardizes:
    - install
    - build
    - test
    - audit
- `Status`:
  - Done by Codex on 2026-04-19.
  - Added a root `Makefile` with standardized cross-app targets for:
    - `install`
    - `check`
    - `build`
    - `test`
    - `audit`
  - Added `scripts/run-pnpm.sh` so the root orchestration can resolve `pnpm` consistently without forcing a workspace rewrite.
  - Updated the root README to document the new top-level verification entrypoints.
  - Hardened `recica/playwright.config.ts` and the root `recica-test` target so the flagship Playwright suite runs correctly from the root orchestrator instead of only from the app directory.
  - Local verification:
    - `make check` passed
    - `make build` passed
    - `make test` passed

### AUD-007

- `ID`: AUD-007
- `Project`: recica
- `Category`: quality / maintainability
- `Severity`: Medium
- `Importance`: App
- `Priority`: P2
- `Confidence`: High
- `Evidence`:
  - `recica/package.json:7-13` exposes build, preview, and Playwright e2e only.
  - There is no lint script, no type-check script, and no unit-test layer.
  - `README.md:117-121` and `README.md:189` still describe `recica` as having no dedicated suite and relying mainly on build success, which is no longer fully true because e2e exists.
- `Risk / impact`:
  - The flagship has weaker static analysis and weaker gate symmetry than the other two apps.
  - Documentation drift increases the chance that the real verification baseline is misunderstood or skipped.
- `Recommendation`:
  - Add at least:
    - `astro check`
    - a lint step
  - Then update the root docs so the flagship’s real quality gate is accurately documented.
- `Status`:
  - Done by Codex on 2026-04-19.
  - Added `recica` quality-gate scripts:
    - `npm run check`
    - `npm run lint`
    - `npm run format`
  - Added the required dev tooling for those gates:
    - `@astrojs/check`
    - `typescript`
    - `prettier`
    - `prettier-plugin-astro`
  - Added `recica/.prettierignore` and cleaned the app to a passing formatting baseline.
  - Updated the root and app READMEs so the flagship verification posture is documented accurately.
  - Local verification:
    - `recica`: `npm run check` passed
    - `recica`: `npm run lint` passed
    - `recica`: `npm run build` passed
    - `recica`: `npm run test:e2e` passed

### AUD-008

- `ID`: AUD-008
- `Project`: tools
- `Category`: quality
- `Severity`: Low
- `Importance`: Local
- `Priority`: P2
- `Confidence`: High
- `Evidence`:
  - `npm run lint` currently fails in `tools` with Prettier drift in:
    - `src/routes/json/+page.svelte`
    - `tests/e2e/app.e2e.ts`
- `Risk / impact`:
  - The current worktree is not release-clean.
  - This is low risk functionally, but it weakens confidence in the local hygiene baseline.
- `Recommendation`:
  - Format the two files and keep the lint gate green before the next release or merge.
- `Status`:
  - Done by Codex on 2026-04-19.
  - `tools/src/routes/json/+page.svelte` and `tools/tests/e2e/app.e2e.ts` were formatted.
  - Local verification: `tools` lint now passes.

### AUD-009

- `ID`: AUD-009
- `Project`: tools
- `Category`: quality / maintainability
- `Severity`: Low
- `Importance`: App
- `Priority`: P3
- `Confidence`: High
- `Evidence`:
  - `tools/src/lib/assets/favicon.svg:1` is the default Svelte logo asset.
  - Live homepage and error-page HTML still emit that Svelte favicon artifact in the `<head>`.
- `Risk / impact`:
  - This is not a security bug, but it is visible framework residue on a public product surface.
  - It undermines polish and suggests incomplete template cleanup.
- `Recommendation`:
  - Replace the remaining Svelte default favicon asset with branded Recica Tools assets and verify both normal and error routes.
- `Status`:
  - Done by Codex on 2026-04-19.
  - Removed the layout-level Svelte starter favicon override so production now uses the branded static favicon set defined in `tools/src/app.html`.
  - Deleted the unused starter asset at `tools/src/lib/assets/favicon.svg`.
  - Local verification: `tools` build passed.

### AUD-010

- `ID`: AUD-010
- `Project`: cross-app
- `Category`: quality
- `Severity`: Low
- `Importance`: App
- `Priority`: P3
- `Confidence`: High
- `Evidence`:
  - Live `tools` 404s return `noindex`, but also canonicalize to the requested bad URL.
  - `labs/src/routes/+error.svelte:20` hard-codes `path="/404"`, and live 404s canonicalize to `/404`.
- `Risk / impact`:
  - Because `noindex` is present, crawler impact is limited.
  - Even so, error-route canonicals are noisy and semantically weaker than canonicalizing back to the primary surface or omitting canonicals on error pages.
- `Recommendation`:
  - Normalize error metadata strategy:
    - either omit canonicals on error routes,
    - or canonicalize them consistently to the app root or a dedicated non-indexable error endpoint.
- `Status`:
  - Done by Codex on 2026-04-19.
  - Added `omitCanonical` support to the shared Svelte SEO components and applied it to `tools` and `labs` error surfaces.
  - `tools` and `labs` no longer intentionally emit canonical links for error pages.
  - Local verification: `tools` build and check passed; `labs` build and check passed.

## Remediation Roadmap

### Immediate (`P1`)

1. Add HSTS on all three public domains.
2. Bring `recica.dev` up to the same hardening baseline as `tools` and `labs`.
3. Remove or minimize CSP `unsafe-inline` allowances, starting with `labs`, then `tools`.
4. Upgrade `recica` to at least Astro `5.18.1` and re-audit the dependency graph.
5. Prune production Docker images for `tools` and `labs` down to runtime-only dependencies.

### Near-term (`P2`)

1. Add a root orchestration layer for build/test/audit so the repo can be verified end to end.
2. Add `astro check` and linting to `recica`.
3. Update the root docs so the actual verification posture is accurate.
4. Clear the current `tools` lint failure before treating the snapshot as release-ready.

### Backlog (`P3`)

1. Replace the remaining Svelte favicon artifact in `tools`.
2. Normalize canonical handling on error routes.

## Execution Ownership

This split is based on what is realistically controllable from the repository versus what must be changed in deployment or platform configuration.

### Should be done by Codex

These are repo-local engineering tasks that can be implemented, tested, and verified directly in this codebase.

- `AUD-003` repo-side CSP hardening work:
  - remove unnecessary inline scripts/styles,
  - move bootstrap logic out of inline templates where possible,
  - tighten CSP generation in `tools` and `labs` to reduce or remove `unsafe-inline`
- `AUD-004` runtime image hardening for `tools` and `labs`:
  - refactor Dockerfiles to ship runtime-only dependencies
- [x] `AUD-005` `recica` dependency remediation:
  - upgrade Astro and related packages,
  - refresh lockfile,
  - re-run build and audit checks
- [x] `AUD-006` root verification orchestration:
  - add a minimal root-level task runner, script wrapper, or Makefile for install/build/test/audit
- [x] `AUD-007` `recica` quality-gate improvements:
  - add `astro check`,
  - add linting,
  - align root documentation with the real verification posture
- [x] `AUD-008` local hygiene fix in `tools`:
  - format the two failing files and return the lint gate to green
- [x] `AUD-009` replace the remaining Svelte favicon artifact in `tools`
- [x] `AUD-010` normalize error-route canonical strategy in `tools` and `labs`

### Should be done by the developer

These tasks are deployment, platform, or estate-level controls that cannot be fully or safely completed from repository code alone.

- `AUD-001` edge-level HSTS rollout for:
  - `recica.dev`
  - `tools.recica.dev`
  - `labs.recica.dev`
- `AUD-002` `recica.dev` response-header hardening at the CDN, reverse proxy, or hosting layer:
  - `Content-Security-Policy`
  - `Referrer-Policy`
  - `X-Content-Type-Options`
  - `X-Frame-Options` or equivalent `frame-ancestors` policy
  - `Permissions-Policy`
- final rollout approval for any production header changes that could affect caching, embedding, or browser compatibility

### Shared / coordinated

These items are best treated as Codex-plus-developer work because implementation is repo-local but final correctness depends on deployment behavior.

- `AUD-003` final CSP rollout:
  - Codex can remove inline dependencies and tighten app-side policy generation
  - Developer should validate production delivery, CDN interaction, and any regressions after deployment
- `AUD-004` container hardening rollout:
  - Codex can fix the Dockerfiles
  - Developer should confirm the actual production platform is using these images and not a separate build path
- `AUD-005` dependency/security updates:
  - Codex can implement and verify the package updates
  - Developer should control deployment timing and monitor post-release behavior

## Residual Risks and Limitations

- Infrastructure findings are based on black-box behavior and repo-visible config only. Cloudflare and deployment platform settings were not directly inspected.
- Performance conclusions were based on build output, container composition, and live headers. No synthetic lab run or real-user telemetry was available.
- The audit intentionally avoids speculative exploit claims where current sandboxing or runtime behavior reduces confidence.
- The current workspace is not a clean release snapshot, so the lint finding reflects the present working state rather than a tagged deployment artifact.
- Accessibility was reviewed as part of quality, and no material blockers were observed in the automated checks, but this report is not a formal WCAG certification.
