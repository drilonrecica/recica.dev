# 04 — Quality Standard

## 1. Purpose

This document defines the measurable engineering standard for `recica`, `tools`, and `labs`.

A perfect Lighthouse score is not sufficient. Quality is evaluated across:

- architecture
- correctness
- privacy
- security
- performance
- accessibility
- SEO
- AI/search discoverability
- operational reliability
- maintainability

---

## 2. Architecture standard

### Required

- each product has one clear responsibility
- no unnecessary server runtime
- no speculative backend
- no framework rewrite without a demonstrated product need
- independent deployment remains possible
- app-specific dependencies remain isolated
- static adapter strictness stays enabled
- unknown routes produce real 404 responses
- public routes are deterministic and documented

### Forbidden

- SPA fallback used to hide prerender failures
- root monorepo tooling added without a real need
- shared component system that homogenizes products
- server runtime retained only for headers, sitemap, robots, or health
- runtime environment behavior that makes canonical URLs depend on arbitrary hosts

---

## 3. Privacy standard

### Tools guarantee

For built-in tools:

- input remains in browser memory
- output remains in browser memory
- no network request contains input/output
- no persistent storage contains input/output
- no URL contains input/output
- no error log contains input/output
- no service-worker cache contains input/output

Tests should monitor browser requests during representative operations.

### Persistence policy

Permitted:

- theme
- favorite tool identifiers
- non-sensitive UI preferences

Forbidden:

- editor contents
- previous conversions
- decoded tokens
- generated credentials
- environment data
- recent files
- clipboard history

### Analytics

Forbidden:

- Google Analytics
- Plausible
- Umami
- PostHog
- Mixpanel
- Sentry replay
- Hotjar
- Meta Pixel
- custom fingerprinting
- any equivalent client tracking

Webmaster consoles and uptime monitoring are allowed.

---

## 4. Security standard

### Static runtime

Tools and Labs final runtime images must:

- run as non-root
- contain no application Node runtime requirement
- contain no production `node_modules`
- contain no source code beyond generated public files
- expose only the static-server port
- have no writable persistent volume
- use a health check
- receive automated vulnerability scanning
- be rebuildable from committed source and lockfile

### Dependency security

- exact package-manager version pinned
- lockfiles committed
- frozen installs in CI/build
- one dependency updater
- high/critical vulnerabilities block release unless documented
- moderate vulnerabilities are reviewed
- GitHub Actions pinned to immutable SHAs
- secrets never stored in repository files
- generate an SBOM in scheduled/security workflows if practical

### CSP target

SvelteKit prerendered pages:

- hash-based CSP for generated inline content
- `script-src` without `unsafe-inline`
- no `unsafe-eval`
- no third-party script origins
- no wildcard source
- narrow image/font/connect policies
- `object-src 'none'`
- `base-uri 'self'`

Static HTTP layer:

- `frame-ancestors 'none'`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- strict referrer policy
- restrictive permissions policy

Any exception must include:

- exact feature requiring it
- exact source/directive
- why a safer alternative failed
- tests covering the feature
- approval in the pull request

### HTML preview threat model

The HTML preview tool must:

- sanitize untrusted HTML
- use an iframe sandbox
- not grant `allow-same-origin` and `allow-scripts` together unless explicitly justified
- block top navigation
- block downloads unless intentionally required
- block forms/network access where practical
- be tested against script injection and event-handler payloads
- not relax the entire site's CSP to support preview behavior

---

## 5. Performance standard

### Core Web Vitals targets

Use the standard good thresholds as targets:

- LCP: under 2.5 seconds
- INP: under 200 milliseconds
- CLS: under 0.1

Evaluate on representative mobile and desktop profiles.

Without client analytics, use:

- Lighthouse CI
- PageSpeed Insights
- Search Console field data when available
- manual browser profiling
- bundle/image reports

### Lighthouse CI targets

Representative pages should target:

| Category | Target |
|---|---:|
| Performance | 95+ |
| Accessibility | 98+, preferably 100 |
| Best Practices | 95+ |
| SEO | 100 |

A score is diagnostic, not a waiver for a known defect.

### Initial compressed transfer budgets

Record the actual baseline before enforcing.

Starting targets:

#### `recica`

- initial JS: at or below 80 KiB gzip; ideally much lower
- CSS: at or below 60 KiB gzip
- no third-party JavaScript
- no unexpected network origin

#### `tools`

- shared initial JS on a normal route: at or below 150 KiB gzip
- route-specific incremental JS: at or below 100 KiB gzip
- total route JS: at or below 250 KiB gzip without an exception
- CSS: at or below 80 KiB gzip
- heavy libraries loaded only on routes that need them

#### `labs`

- homepage total JS: at or below 180 KiB gzip
- normal experiment total JS: at or below 300 KiB gzip
- larger experiments require an ADR/budget exception
- no global loading of experiment-only dependencies

### Regression policy

CI should fail when:

- an absolute route limit is exceeded
- a representative route grows by more than 10% and at least 15 KiB gzip
- a new external origin appears
- an unapproved large dependency enters a shared chunk
- a source map becomes public
- a route introduces a console error

Do not fail solely for a 1–2 KiB fluctuation.

### Fonts and images

- self-host all fonts
- import only used weights/subsets
- use modern image formats where appropriate
- set explicit image dimensions
- avoid lazy-loading the likely LCP image
- lazy-load below-the-fold images
- do not add decorative media that harms the flagship's fast-reading goal

---

## 6. Tools synchronous-input limits

These are conservative initial limits because computation Web Workers are intentionally out of scope.

Measure UTF-8 byte size, not JavaScript string length.

Suggested starting hard limits:

| Operation | Initial limit |
|---|---:|
| Base64 encode/decode | 5 MiB input |
| URL/query encode/decode | 5 MiB input |
| JSON format/validate | 3 MiB |
| XML/sitemap parse | 3 MiB |
| SQL format/minify | 2 MiB |
| Markdown render | 2 MiB |
| HTML preview | 1 MiB |
| Text diff | 512 KiB combined |
| Regex test text | 1 MiB |
| `.env` parsing | 1 MiB |
| Bulk UUID generation | 1,000 per action |
| Bulk password generation | 500 per action |
| QR text | 2,000 characters default; 4,000 hard ceiling subject to library validation |

Format-specific limits remain required for:

- EAN-13
- UPC-A
- Code 128
- JWT structure
- color formats
- timestamp ranges

Behavior:

- validate before expensive processing
- explain actual size and limit
- explain that the limit protects responsiveness
- explain that processing remains local
- never silently truncate
- never partially process while presenting the result as complete

Benchmark representative low/mid-range Android hardware before raising limits.

---

## 7. Testing standard

### Unit tests

Tools must test:

- every pure tool function
- success behavior
- invalid behavior
- Unicode
- empty input
- boundaries
- maximum size
- deterministic output where expected
- cryptographic API failure behavior where applicable
- parser ambiguity
- security-sensitive payloads

Labs must test:

- pure experiment logic
- decision rules
- metadata/indexing helpers
- boundary conditions

### Coverage

Starting global minimum for Tools:

- statements: 80%
- lines: 80%
- functions: 80%
- branches: 70%

Critical parser/sanitizer/security logic should exceed the global minimum.

Do not write meaningless tests solely to inflate coverage.

### End-to-end tests

Every tool route should have:

- route load assertion
- main happy path
- invalid-input path
- clear/reset behavior where present
- keyboard operation
- clipboard/download behavior where present
- no console errors
- no unexpected network request
- metadata/canonical smoke assertion

Site-level tests:

- homepage search
- category filtering
- quick-open dialog
- theme behavior
- focus trap
- focus restoration
- robots
- sitemap
- 404
- preview noindex
- production indexability
- static HTML before JavaScript
- offline mode for Tools after Phase 8

### Browser matrix

Pull requests:

- Chromium desktop
- one mobile Chromium viewport

Scheduled:

- Chromium
- Firefox
- WebKit
- mobile Chrome profile
- mobile Safari profile

---

## 8. Accessibility standard

Target: WCAG 2.2 AA.

### Automated

Use axe-core with tags covering WCAG 2.0/2.1/2.2 A and AA.

Add explicit Playwright tests for:

- skip link
- logical heading hierarchy
- keyboard navigation
- visible focus
- dialog focus trap
- focus restoration
- Escape handling
- error association
- live status announcements
- reduced-motion preference
- forced-colors mode
- 200% zoom/reflow smoke behavior
- touch-target sizing on mobile
- no keyboard trap
- consistent help/error identification

### Manual quarterly smoke test

Recommended minimum:

- NVDA + Firefox or Chromium
- VoiceOver + Safari
- keyboard-only
- one simple tool
- one complex tool
- search dialog
- flagship navigation
- Labs main experiment

Record findings and dates. Do not claim formal conformance from automation alone.

### Motion

- respect `prefers-reduced-motion`
- avoid autoplay
- avoid essential information conveyed only through animation
- avoid rapid flashes
- preserve usability when transitions are disabled

---

## 9. SEO standard

### Technical requirements

Every indexable page must have:

- unique title
- unique meta description
- canonical URL
- one clear H1
- crawlable HTML
- valid status code
- descriptive internal links
- social metadata
- appropriate structured data
- inclusion in sitemap where public
- no accidental `noindex`
- no duplicate canonical variants

### Tool-page content model

The interactive tool remains near the top.

Required content:

1. direct answer in one or two sentences
2. what the tool does
3. when to use it
4. how it works
5. a real example
6. privacy statement
7. supported formats
8. input limits
9. common errors
10. relevant authoritative references
11. related tools
12. substantive review date if maintained

Content must be:

- specific to the tool
- technically correct
- concise enough to scan
- detailed enough to answer real questions
- free of filler and keyword repetition

### URL strategy

- one page per distinct tool intent
- no synonym clones
- stable routes
- redirects for intentionally changed routes
- no tracking parameters in canonicals
- lowercase, concise slugs

### Sitemap quality

- canonical URLs only
- truthful last modification dates
- no health or preview routes
- no duplicate entries
- no automatic "today" date for unchanged pages

### Structured data

Rules:

- match visible content
- validate syntax
- use supported schema types truthfully
- do not fake ratings, reviews, price, availability, or usage
- do not mark hidden content
- do not over-nest meaningless entities

---

## 10. Generative/answer search standard

Treat AI visibility as a consequence of strong search fundamentals and authoritative content.

Required:

- clear self-contained sections
- direct factual answers
- explicit definitions
- real examples
- transparent limitations
- author/publisher identity
- standards references where relevant
- stable canonical URLs
- crawlable text
- no client-only content dependency for core explanations

Forbidden:

- "GEO" keyword stuffing
- hidden AI prompts
- fabricated citations
- fake expert quotes
- mass-produced near-duplicate pages
- unnecessary Markdown mirrors
- reliance on `llms.txt`
- content designed primarily to manipulate ranking

Measurement without analytics:

- Google Search Console
- Bing Webmaster Tools
- Bing AI Performance
- crawl and indexing reports
- manual citation checks used cautiously

---

## 11. Documentation standard

Update documentation when changing:

- runtime
- build commands
- package manager
- environment variables
- routes
- privacy guarantees
- CSP/headers
- Coolify settings
- input limits
- tests
- indexing behavior

Documentation must describe actual behavior, not intended behavior that has not shipped.

---

## 12. Definition of a quality regression

A change is a regression if it:

- adds a server where static output suffices
- transmits or persists Tools input
- weakens headers without review
- introduces an external request
- breaks keyboard use
- creates a false sitemap date
- makes a page client-only for core content
- returns 200 for unknown routes
- increases bundle size beyond budget
- adds a dependency for trivial functionality
- duplicates product responsibility
- adds unsupported factual claims
