# 05 — CI/CD and Maintenance

## 1. CI/CD model

GitHub Actions validates code.

Coolify deploys code.

Do not make GitHub Actions deploy the same resources unless the owner intentionally replaces the existing Coolify flow.

```text
pull request
   |
   v
GitHub Actions checks
   |
   v
protected merge to master
   |
   v
Coolify detects master update
   |
   v
independent app deployment
```

---

## 2. Required workflow files

Recommended structure:

```text
.github/
├── workflows/
│   ├── quality.yml
│   ├── e2e.yml
│   ├── security.yml
│   └── scheduled.yml
└── dependabot.yml
```

Pin every third-party GitHub Action to an immutable commit SHA and add a comment with the human-readable version.

Do not use floating `@master` or `@latest` action references.

---

## 3. `quality.yml`

Trigger:

- pull requests
- pushes to `master`

Use path-aware jobs for:

- `recica/**`
- `tools/**`
- `labs/**`
- root scripts/docs/config that affect all apps

Per-app steps:

1. checkout
2. setup Node 24
3. setup pinned pnpm 11
4. restore pnpm cache
5. `pnpm --dir <app> install --frozen-lockfile`
6. formatting/lint
7. framework/type check
8. unit tests where applicable
9. production build
10. upload relevant failure artifacts only

Root documentation-only changes should not unnecessarily run all browsers, but changes to shared scripts, `AGENTS.md`, or CI should run broad validation.

### Expected commands after standardization

`recica`:

```bash
pnpm --dir recica check
pnpm --dir recica lint
pnpm --dir recica build
```

`tools`:

```bash
pnpm --dir tools check
pnpm --dir tools lint
pnpm --dir tools test:unit:run
pnpm --dir tools build
```

`labs`:

```bash
pnpm --dir labs check
pnpm --dir labs lint
pnpm --dir labs test:unit:run
pnpm --dir labs build
```

---

## 4. `e2e.yml`

Trigger:

- pull requests affecting runtime code
- pushes to `master`

Jobs:

- Recica Chromium E2E
- Tools Chromium E2E
- Labs Chromium E2E

Install only required browsers on PR jobs.

Retain on failure:

- traces
- screenshots
- HTML report

Do not commit generated test artifacts.

### Network assertions

Tools E2E should fail if tool operation requests unexpected external origins.

Maintain an explicit allowlist containing only required same-origin development/preview requests.

### Accessibility

Run axe as part of E2E and add explicit keyboard/focus tests.

---

## 5. `security.yml`

Trigger:

- pull requests
- pushes to `master`
- monthly schedule
- manual dispatch

Checks:

- production dependency audit
- secret scan
- CodeQL for JavaScript/TypeScript
- Docker build for Tools and Labs
- container vulnerability scan
- optional SBOM generation
- public source-map check
- external-origin scan
- header/config lint where practical

Policy:

- critical/high vulnerability: block
- moderate: report and review
- low: report only unless exploitable in context

Do not blindly fail on a vulnerable development-only package that is provably absent from production without documenting the reasoning.

### Docker verification

Assert that final Tools/Labs images:

- do not run `node build`
- do not include app `node_modules`
- run as non-root
- expose the expected port
- pass health check
- contain generated static files
- have no critical/high runtime vulnerability

---

## 6. `scheduled.yml`

Frequency:

- monthly for full maintenance
- optionally weekly for cross-browser smoke checks if runtime cost is acceptable

Tasks:

- full Chromium/Firefox/WebKit E2E
- Lighthouse CI on representative routes
- broken-link check
- dependency audit
- package outdated report
- container scan
- sitemap/robots validation
- canonical validation
- structured-data validation where automatable
- production header smoke test
- production status-code/redirect smoke test

Do not send user content or production data to test services.

---

## 7. Performance CI

Add a repository script that inspects generated files and gzip-compressed sizes.

Suggested files:

```text
scripts/check-bundle-budgets.mjs
docs/modernization/bundle-budgets.json
```

The script should:

- read app build output
- gzip JS/CSS in memory
- calculate route/shared totals where feasible
- compare against absolute budgets
- compare against committed baseline
- print actionable differences
- exit non-zero only for meaningful regressions

Do not use source-map sizes.

Lighthouse CI should run against built local static previews.

Representative pages:

- `recica/`: `/`
- `tools/`: `/`, `/json`, `/diff`, `/qr`, `/html`
- `labs/`: `/`, `/parental-gate-lab`

---

## 8. Link and metadata validation

Validate:

- internal links
- canonical URLs
- one title/H1 per page
- meta descriptions
- robots directives
- sitemap URLs
- duplicate routes
- JSON-LD parseability
- preview noindex
- production indexability
- no localhost URL in production build

Use existing Playwright where possible rather than adding a large parser dependency.

A dedicated link-check action is acceptable if pinned to a SHA.

---

## 9. Dependency automation

Default choice: Dependabot.

Do not add both Dependabot and Renovate.

Configure:

- one npm ecosystem entry per app directory
- GitHub Actions updates
- monthly schedule
- grouped patch/minor updates
- majors separated for explicit review
- security updates enabled
- reasonable PR limit

Automerge policy:

- no automatic major merges
- security patches may be auto-merged only after all checks pass and owner enables it
- routine patch automation is optional
- framework and build-tool updates require review

The exact dependency updater may be changed to Renovate later through a documented decision.

---

## 10. Branch protection

Manual GitHub repository setting:

- protect `master`
- require status checks
- require branch to be up to date before merge if practical
- block force pushes
- block deletion
- no mandatory second reviewer for this solo-maintained repository
- allow owner override only for emergencies
- document emergency overrides in the following fix

Required checks should use stable job names.

---

## 11. Preview deployments

Use Coolify preview deployments where supported.

Preview requirements:

- unique preview URL
- build-time `PUBLIC_INDEXING_ENABLED=false`
- `noindex, nofollow`
- robots disallow
- production canonical URL
- no production secrets
- no public permanent caching
- same static runtime as production
- security headers enabled

Do not use the preview hostname as canonical.

---

## 12. Deployment and rollback

### Deployment

- merge only after checks pass
- Coolify builds the changed resource
- health check must pass before traffic switches where supported
- previous deployment remains available for rollback
- smoke-check production after deployment

### Rollback

Use Coolify's previous-deployment rollback or redeploy a known-good commit.

Rollback triggers:

- 5xx or health failure
- routes returning wrong status
- missing static assets
- CSP breaks core behavior
- canonical/robots error
- major accessibility regression
- tool calculation regression

Do not debug a broken production release for an extended period when a safe rollback exists.

---

## 13. Maintenance cadence

### Monthly automated

- dependency updates
- audits
- container scans
- cross-browser tests
- link checks
- Lighthouse checks
- production header checks

### Quarterly manual

- accessibility screen-reader smoke test
- mobile browser review
- content accuracy/freshness
- Search Console review
- Bing Webmaster/AI Performance review
- crawler-policy review
- input-limit review
- Coolify resource usage review
- Cloudflare cache/security review

### Annual

- architecture decision review
- dependency/runtime major-version plan
- public content and CV review
- domain/canonical inventory
- disaster-recovery and rollback review

---

## 14. CI anti-patterns

Do not:

- use `continue-on-error` for required quality gates
- hide test failures with retries alone
- run E2E only against dev mode
- install unpinned action branches
- expose secrets to fork pull requests
- make production deployment a prerequisite for testing
- depend on client analytics for performance gates
- upload public source maps
- retain sensitive traces indefinitely
