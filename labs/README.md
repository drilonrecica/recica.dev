# Recica Labs

`labs/` is the standalone SvelteKit application for `https://labs.recica.dev`.

It is the experimental product layer of the Recica ecosystem:

- `recica.dev` is the flagship personal site
- `tools.recica.dev` is the stable utilities product
- `labs.recica.dev` is the public experimentation surface

This app is intentionally separate from both the flagship and the tools app because it solves a different problem. The goal is not polished portfolio storytelling and it is not stable utility hosting. The goal is to publish product and UX experiments in a form that is real enough to evaluate in public.

## Domain Role

`labs.recica.dev` owns:

- interactive prototypes
- public product explorations
- concept-led experiments that are not yet stable products
- reference-style UX labs that benefit from live interaction
- experiment-specific SEO, metadata, and operational endpoints

It does not own:

- flagship identity and case-study storytelling
- stable browser utilities
- user accounts, analytics dashboards, or persistent application state

That split is deliberate. Labs should stay interesting, focused, and lightweight.

## Current Public Scope

The current shipped MVP contains:

- `/` as the Labs landing page
- `/parental-gate-lab` as the first full interactive lab
- one homepage teaser for the privacy-first mobile analytics and crash-reporting concept
- operational endpoints for health, sitemap, and robots

The current homepage is intentionally selective. It is not a catalog of half-formed ideas.

## Route Inventory

| Route                | Purpose                              | Notes                               |
| -------------------- | ------------------------------------ | ----------------------------------- |
| `/`                  | Labs landing page                    | Gateway into current experiments    |
| `/parental-gate-lab` | Interactive UX/product reference lab | Full shipped experiment             |
| `/404`               | Branded not-found route              | Keeps the app visually consistent   |
| `/health`            | Health endpoint                      | Operational probe target            |
| `/robots.txt`        | Robots output                        | Built from runtime origin           |
| `/sitemap.xml`       | Sitemap output                       | Includes current public page routes |

The public route source of truth for indexing lives in [`src/lib/utils/site-indexing.ts`](./src/lib/utils/site-indexing.ts).

## Product Boundaries

### What belongs in `labs/`

- experiments that benefit from live interaction
- product and UX references that are too exploratory for `recica.dev`
- concept work that is meaningful enough to publish, but not mature enough for `tools.recica.dev`
- locally computed interactive decision helpers
- experiment-specific comparison logic and structured metadata

### What does not belong in `labs/`

- general-purpose browser tools
- resume or case-study content better suited to the flagship
- production account systems
- dashboards, persistence, or backend-heavy product infrastructure unless a specific experiment genuinely requires it
- planning docs masquerading as product UI

## Visual and UX Model

The current app uses a shared dark visual system across both the landing page and the shipped Parental Gate lab.

The homepage should read as:

- experimental
- editorial
- selective
- ecosystem-aware

The Parental Gate route should read as:

- denser
- more product-like
- more operational
- more decision-support oriented

The shared tokens and shell live in:

- [`src/routes/+layout.svelte`](./src/routes/+layout.svelte)
- [`src/routes/layout.css`](./src/routes/layout.css)

The implementation uses one visual system with route-aware emphasis rather than separate codebases or a user-facing theme toggle.

## Technology Stack

| Concern            | Implementation                                |
| ------------------ | --------------------------------------------- |
| Framework          | SvelteKit 2                                   |
| Component model    | Svelte 5                                      |
| Language           | TypeScript                                    |
| Styling            | Tailwind CSS v4 plus shared custom CSS tokens |
| Build runtime      | `@sveltejs/adapter-node`                      |
| Package manager    | `pnpm`                                        |
| Unit testing       | Vitest                                        |
| End-to-end testing | Playwright                                    |
| Formatting         | Prettier                                      |
| Linting            | ESLint                                        |

This app is intentionally boring in the right ways:

- no state library
- no data-fetching library
- no animation framework
- no backend dependency
- no database
- no user state persistence in the shipped MVP

## Folder Structure

```text
labs/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   ├── data/
│   │   ├── types/
│   │   └── utils/
│   └── routes/
├── static/
├── tests/
│   └── e2e/
├── LABS_PLAN.md
├── PLAN_PARENTAL_GATES.md
└── README.md
```

### Runtime Code

- [`src/routes/`](./src/routes) owns public pages and endpoints.
- [`src/lib/components/`](./src/lib/components) owns shared page chrome, experiment cards, and SEO helpers.
- [`src/lib/data/`](./src/lib/data) owns experiment definitions and feature-specific content data.
- [`src/lib/types/`](./src/lib/types) owns shared TypeScript contracts.
- [`src/lib/utils/`](./src/lib/utils) owns pure logic, SEO helpers, indexing helpers, and experiment computation.

### Planning / Reference Documents

These files are reference material, not runtime code:

- [`LABS_PLAN.md`](./LABS_PLAN.md)
- [`PLAN_PARENTAL_GATES.md`](./PLAN_PARENTAL_GATES.md)

There are also older top-level folders such as `labs/analytics/` and `labs/parental-gates/`. They are not deployable apps in the current architecture. The live application is the SvelteKit app rooted directly at `labs/`.

## App Architecture

### Shared shell

The app shell is defined in [`src/routes/+layout.svelte`](./src/routes/+layout.svelte).

It is responsible for:

- loading the global stylesheet
- applying the app shell class
- deciding whether the current route is the homepage
- rendering the shared Labs header and footer

The shell stays thin on purpose. Route-specific behavior remains in the page routes instead of getting pushed into layout-level abstractions.

### Header and footer

- [`src/lib/components/layout/LabsHeader.svelte`](./src/lib/components/layout/LabsHeader.svelte)
- [`src/lib/components/layout/LabsFooter.svelte`](./src/lib/components/layout/LabsFooter.svelte)

The header swaps behavior based on route:

- homepage gets ecosystem navigation
- Parental Gate gets anchor navigation for the lab sections

The footer keeps ecosystem cross-linking visible:

- `recica.dev`
- `tools.recica.dev`
- the live Parental Gate lab
- GitHub / LinkedIn / email

### Homepage

[`src/routes/+page.svelte`](./src/routes/+page.svelte) is intentionally small now.

It has 3 main content blocks:

1. hero
2. featured experiments
3. short about / what is next

That simplification is intentional. The homepage is not supposed to explain the philosophy of experimentation in five different ways.

### Experiment cards

[`src/lib/components/experiments/ExperimentCard.svelte`](./src/lib/components/experiments/ExperimentCard.svelte) is the reusable homepage card surface.

It renders:

- live or coming-soon state
- year
- title
- one-liner
- summary
- one supporting note
- CTA

It is intentionally restrained. The card is there to route attention, not to carry the full experiment.

## Experiment Metadata Model

The experiment source of truth lives in [`src/lib/data/experiments.ts`](./src/lib/data/experiments.ts).

The contract lives in [`src/lib/types/experiments.ts`](./src/lib/types/experiments.ts).

Current status values:

- `concept`
- `coming-soon`
- `in-progress`
- `prototype`
- `live`
- `shipped`
- `archived`

The shared `ExperimentDefinition` shape includes:

- slug and title
- status and type
- one-liner and summary
- visual theme hint
- CTA metadata
- homepage visibility
- optional longer descriptive metadata

This keeps the homepage extensible without introducing CMS complexity.

## Parental Gate Feature

The first shipped experiment is the Parental Gate lab at `/parental-gate-lab`.

Its feature-specific documentation lives at:

- [`src/routes/parental-gate-lab/README.md`](./src/routes/parental-gate-lab/README.md)

Its route implementation is:

- [`src/routes/parental-gate-lab/+page.svelte`](./src/routes/parental-gate-lab/+page.svelte)

Its data and logic are split cleanly:

- `src/lib/data/parental-gate/`
- `src/lib/utils/parental-gate/`
- `src/lib/types/parental-gate.ts`

## SEO, Canonical, and Indexing

Canonical origin is environment-aware.

In production, set:

```bash
PUBLIC_SITE_URL=https://labs.recica.dev
```

At runtime the app resolves origin like this:

1. use `PUBLIC_SITE_URL` if it is a valid `http` or `https` URL
2. otherwise fall back to the current request origin

That logic lives in [`src/lib/utils/site-indexing.ts`](./src/lib/utils/site-indexing.ts).

This same module also builds:

- `robots.txt`
- `sitemap.xml`
- the public route index used for sitemap generation

The pages themselves use [`src/lib/components/seo/SeoHead.svelte`](./src/lib/components/seo/SeoHead.svelte) plus helpers in [`src/lib/utils/seo.ts`](./src/lib/utils/seo.ts) for:

- titles
- descriptions
- canonical URLs
- OG/Twitter metadata
- JSON-LD

## Security Posture

The app is intentionally low-risk by architecture:

- no accounts
- no database
- no third-party analytics in the shipped product
- no remote uploads
- no persistence in the Parental Gate helper flows

Security headers are set centrally in [`src/hooks.server.ts`](./src/hooks.server.ts):

- Content-Security-Policy
- Referrer-Policy
- X-Content-Type-Options
- X-Frame-Options
- Permissions-Policy

Because this is an interactive public app, keeping this file current matters more than styling polish.

## Local Development

Install and run the app from the `labs/` directory.

```bash
cd labs
pnpm install
pnpm dev
```

Default scripts:

```bash
pnpm run dev
pnpm run check
pnpm run lint
pnpm run test:unit:run
pnpm run test:e2e
pnpm run build
pnpm run preview
```

## Verification and Test Strategy

### Type and Svelte checks

```bash
pnpm run check
```

This runs:

- SvelteKit sync
- `svelte-check`

### Lint and formatting

```bash
pnpm run lint
pnpm run format
```

Notes:

- ESLint is configured in [`eslint.config.js`](./eslint.config.js)
- `@typescript-eslint/no-unused-vars` is disabled only for `.svelte` files because the upstream rule currently crashes on some Svelte AST shapes in this app
- Type-level correctness for those files is still covered by `svelte-check`

### Unit tests

```bash
pnpm run test:unit:run
```

Current unit coverage focuses on deterministic logic:

- parental gate pattern data sanity
- compare sorting behavior
- recommendation scoring and result generation

### End-to-end tests

```bash
pnpm run test:e2e
```

Playwright coverage currently verifies:

- homepage hero and featured experiments
- parental gate route load and canonical metadata
- demo interactions across all 6 patterns
- comparison sorting
- recommendation determinism
- mobile stacked demo behavior
- robots and sitemap endpoints

The Playwright config lives in [`playwright.config.ts`](./playwright.config.ts).

It starts a local built server on `127.0.0.1:4173` before running the browser tests.

## Build and Deployment

The app uses `@sveltejs/adapter-node`.

Build output is generated with:

```bash
pnpm run build
```

Production runtime is the generated Node server:

```bash
node build
```

Operational assumptions:

- canonical origin should be provided with `PUBLIC_SITE_URL`
- a reverse proxy or platform should handle external TLS and host routing
- `/health` can be used for basic uptime checks

## Editing Guidance

If you are changing Labs, start by deciding what layer you are actually touching.

### Edit homepage copy or experiment positioning

Use:

- [`src/routes/+page.svelte`](./src/routes/+page.svelte)
- [`src/lib/data/experiments.ts`](./src/lib/data/experiments.ts)

### Edit shared styling or shell behavior

Use:

- [`src/routes/layout.css`](./src/routes/layout.css)
- [`src/routes/+layout.svelte`](./src/routes/+layout.svelte)
- header/footer components

### Edit Parental Gate content or decision logic

Use:

- `src/lib/data/parental-gate/`
- `src/lib/utils/parental-gate/`
- `src/routes/parental-gate-lab/+page.svelte`

### Do not do this

- do not turn Labs into a second flagship site
- do not move stable tools into Labs
- do not introduce backend complexity unless an experiment truly requires it
- do not grow the homepage into a catalogue of ideas

## Practical Maintenance Rules

Keep the app simple:

- prefer local data and pure functions
- keep route files readable
- do not add state libraries just to move a few values around
- keep experiments self-contained
- add tests for deterministic logic before expanding surface area

If an experiment becomes stable, repeat-usage oriented, and productized, it probably belongs in `tools/`, not in Labs anymore.
