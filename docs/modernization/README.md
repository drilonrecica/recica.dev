# recica.dev Modernization Documentation

This directory is a self-contained implementation specification for modernizing the `drilonrecica/recica.dev` repository.

It was prepared from an inspection of the public repository and the following deployment facts:

- `recica.dev` is deployed as a Coolify Nixpacks static site.
- `tools.recica.dev` is deployed from `tools/Dockerfile`.
- `labs.recica.dev` is deployed from `labs/Dockerfile`.
- Cloudflare proxies the domains.
- Coolify uses Caddy as the outer reverse proxy.
- The resources run separately on a Hetzner VPS.
- Built-in Tools operations must remain browser-local.
- No analytics are wanted in the foreseeable future.
- AI coding agents will implement most changes, with human review.

## Document order

1. `01_DECISIONS_AND_CONTEXT.md`
2. `02_TARGET_ARCHITECTURE.md`
3. `03_IMPLEMENTATION_ROADMAP.md`
4. `04_QUALITY_STANDARD.md`
5. `05_CI_CD_AND_MAINTENANCE.md`
6. `06_COOLIFY_DEPLOYMENT_RUNBOOK.md`
7. `07_ACCEPTANCE_CHECKLIST.md`

Implementation evidence and remaining owner actions are recorded in
[`final/2026-07-29.md`](./final/2026-07-29.md). The dated baseline remains an
unchanged record of the pre-modernization architecture.

The root `AGENTS.md` turns these documents into enforceable operating instructions for coding agents.

## Placement

Extract the ZIP at the repository root so that:

- `AGENTS.md` is at the root.
- these files appear under `docs/modernization/`.

Review existing repository instructions before overwriting a future `AGENTS.md`. At the repository state inspected for this plan, no root `AGENTS.md` was visible.

## Important refinement

All three JavaScript applications should standardize on Node 24 LTS and pnpm 11, but they should retain independent lockfiles and app-specific build contexts.

A root pnpm workspace was deliberately rejected for this modernization because the apps:

- have independent Coolify resources
- use different build/deployment models
- share little runtime code
- benefit from isolated dependency upgrades and build caches

Revisit a root workspace only when real shared packages or repeated cross-app build problems justify the coupling.

## Current-reference note

Software versions and crawler identities change. Agents must verify current official documentation before pinning exact Docker digests, GitHub Action SHAs, or crawler-specific rules.

The architectural decisions in this directory are stable. Exact patch versions are maintenance details.

## Post-modernization: flagship redesign (2026-09)

`recica/` was redesigned for hiring managers: narrative case studies with
decision logs, a facts strip (location, languages, availability), an HTML CV at
`/cv`, a CSS-only light scheme, per-page social images, and a contrast gate that
treats axe "incomplete" results as failures. See `recica/README.md`.

Deferred to the next MVP: real case-study screenshots. The content model and
templates already carry the slot.
