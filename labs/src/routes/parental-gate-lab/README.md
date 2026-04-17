# Parental Gate Lab

This document covers the live Parental Gate experiment shipped inside the Labs app.

Public route:

- `https://labs.recica.dev/parental-gate-lab`

Source route:

- [`+page.svelte`](./+page.svelte)

This is not a standalone app. It is a feature route inside the `labs/` SvelteKit application.

## Product Purpose

Parental Gate Lab is a public reference for teams building adult-only gates inside kids and family apps.

It exists to make tradeoffs visible in one place:

- resistance versus parent friction
- accessibility versus implementation complexity
- low-literacy support versus stronger intent signals
- broad reuse versus narrow high-risk protection

The point is not to declare one universal best pattern. The point is to let a team compare viable patterns, try simplified live demos, and get a grounded starting recommendation.

## Domain and Canonical Contract

The route is part of `labs.recica.dev`, not a separate hostname.

Canonical behavior is inherited from the Labs app:

- production canonical base should be `https://labs.recica.dev`
- previews and local runs fall back to the request origin

SEO metadata for this route is set in [`+page.svelte`](./+page.svelte) via the shared Labs SEO helpers.

Current title:

- `Parental Gate Lab — Compare UX Patterns for Kids & Family Apps`

## Scope of the Shipped Route

The current route deliberately stays within 5 practical blocks:

1. hero
2. overview
3. demos
4. fit finder
5. practical guidance

Anchors that are part of the public contract:

- `#overview`
- `#demos`
- `#compare`
- `#recommendation`
- `#guidance`
- `#faq`

Do not rename or remove these casually. They are used by the header navigation and are part of the route’s public structure.

## What the Route Ships Today

### 6 live patterns

The shipped pattern set is fixed at 6:

1. Math Gate
2. Hold-to-Confirm Gate
3. Drag-and-Drop Gate
4. Shape / Color Recognition Gate
5. Text Challenge Gate
6. Pattern Matching Gate

These patterns are defined in:

- [`../../lib/data/parental-gate/patterns.ts`](../../lib/data/parental-gate/patterns.ts)

### Comparison table

The route includes a sortable side-by-side comparison matrix.

It compares every pattern across 6 criteria:

- child resistance
- parent friction
- accessibility
- implementation complexity
- parent speed
- context breadth

### Recommendation helper

The route includes a deterministic 6-question recommendation flow.

It returns:

- one primary fit
- one backup fit
- rationale points
- watch-outs

### Guidance section

The lower section compresses implementation guidance without turning the route into a long article.

It includes:

- compact pattern rows
- implementation themes
- accessibility / anti-pattern notes
- FAQ
- minimal closing CTA

## UX and Interaction Model

### Demo grid

The demo grid is intentionally compact.

Each card shows:

- pattern name
- one-line summary
- short best-for tag
- two quick score chips
- `Try it` button

The card is only a chooser. The actual interaction happens in the shared demo panel.

### Shared demo panel

The route uses one shared inline demo panel instead of giving each card its own full interaction surface.

Reasons:

- less duplicated UI
- easier to keep interaction states consistent
- simpler mobile behavior
- easier testing

The active pattern is controlled by `activePatternId` inside [`+page.svelte`](./+page.svelte).

### Demo state model

The panel uses a small explicit state machine:

- `idle`
- `in-progress`
- `success`
- `failure`

That state is stored locally in the route and reflected through:

- `activeStatus`
- `activeMessage`

Reset behavior is explicit and manual through `resetActiveDemo()`.

### Mobile behavior

On mobile, the demo panel remains inline and stacked under the grid.

It is intentionally not a modal.

That keeps:

- scroll position understandable
- keyboard and focus flow simpler
- interaction behavior consistent across devices

This is covered by Playwright.

## Data Architecture

Feature-specific data is split into small modules under:

- [`../../lib/data/parental-gate/`](../../lib/data/parental-gate)

### `patterns.ts`

Owns the 6 pattern definitions and the pattern map.

Each `ParentalGatePattern` includes:

- id
- slug
- name
- summary
- bestFor
- description
- strengths
- weaknesses
- accessibilityNotes
- implementationNotes
- criteriaScores
- demoType
- recommendationTags
- riskFit
- frequencyFit
- interactionConstraints

This is the main content source of truth for the experiment.

### `criteria.ts`

Owns metadata for the comparison criteria.

Each criterion defines:

- key
- label
- description
- `highIsBetter`
- shortLabel

This is what lets the compare logic sort correctly for both positive and inverse metrics.

### `recommendationRules.ts`

Owns:

- the 6 recommendation questions
- answer options
- weight tables
- rule collection helpers
- risk and frequency fit helpers

Current question ids:

- `risk`
- `frequency`
- `literacy`
- `accessibility`
- `touch`
- `surface`

### `copy.ts`

Owns the route-level section copy used by the page shell.

### `faq.ts`

Owns the FAQ entries rendered near the bottom of the route.

## Type Contracts

Shared feature contracts live in:

- [`../../lib/types/parental-gate.ts`](../../lib/types/parental-gate.ts)

Key types:

- `CriterionKey`
- `CriteriaScores`
- `ParentalGateDemoType`
- `ParentalGatePattern`
- `RecommendationQuestion`
- `RecommendationAnswers`
- `RecommendationResult`

If you expand the feature, change the types first, then the data and UI.

## Logic Architecture

Feature logic lives in:

- [`../../lib/utils/parental-gate/compare.ts`](../../lib/utils/parental-gate/compare.ts)
- [`../../lib/utils/parental-gate/recommendation.ts`](../../lib/utils/parental-gate/recommendation.ts)

### Compare logic

`sortPatternsByCriterion()` sorts patterns using:

- criterion metadata from `criteria.ts`
- direct score comparison
- inverse sorting when `highIsBetter === false`
- alphabetical tie-break by pattern name

This keeps the compare table deterministic and easy to reason about.

### Recommendation logic

The recommendation helper is local and deterministic.

Core steps:

1. verify all 6 answers are present with `isRecommendationComplete()`
2. create base scores for all patterns
3. collect weighted rule entries from the answer set
4. apply rule-based answer weights
5. apply bonus and penalty logic for risk, frequency, accessibility, touch, and purchase context
6. sort descending
7. choose primary and backup
8. generate rationale and watch-out lists

Important characteristics:

- no backend
- no persistence
- no AI or LLM logic
- no hidden remote scoring

That is a deliberate design choice. The helper should be inspectable and stable.

## Route-Level Derived Presentation

Not all presentation content is stored directly in the data files.

The route derives some compact view models in [`+page.svelte`](./+page.svelte):

- `patternTags` for shorter demo-card labels
- `compactPatternRows` for condensed guidance rows

That is intentional. The data files stay rich enough for future expansion, while the route is free to compress the presentation layer.

## Demo Implementations

All 6 demos are implemented directly in the route component today.

Current handlers include:

- `submitMathGate()`
- `startHold()` / `stopHold()`
- `handleDrop()` / `submitDragFallback()`
- `chooseShape()`
- `submitTextGate()`
- `choosePattern()`

This is acceptable for the current scope because:

- the route is still one feature
- all state is local
- the demos share one panel and one state model
- the logic remains readable

If the route grows substantially or a second lab copies this pattern, then extraction into dedicated components becomes worth considering.

## Accessibility Rules

The route is explicitly not allowed to collapse into visual-only puzzle design.

Current accessibility requirements:

- all key interactions must be keyboard operable
- drag-like behavior must have a fallback path
- color-only cues are not acceptable
- success and failure feedback must be explicit
- focus order must remain intact

These rules are reflected in both:

- content data
- route implementation

Do not “improve” the UI by making it visually clever at the expense of clearer access paths.

## Simplification Rules

This route was intentionally simplified after its first implementation pass.

Current maintenance rule:

- keep it as a product tool with supporting guidance
- do not let it drift back into a long reference article

Specifically:

- keep the demo cards compact
- keep compare and recommendation visually grouped as one decision zone
- keep lower guidance compressed
- avoid repeating the same explanation in overview, compare, and guidance copy

## Testing

### Unit tests

Unit coverage lives in:

- [`../../lib/data/parental-gate/patterns.test.ts`](../../lib/data/parental-gate/patterns.test.ts)
- [`../../lib/utils/parental-gate/compare.test.ts`](../../lib/utils/parental-gate/compare.test.ts)
- [`../../lib/utils/parental-gate/recommendation.test.ts`](../../lib/utils/parental-gate/recommendation.test.ts)

Current unit coverage focuses on:

- pattern data sanity
- comparison sorting
- recommendation scoring and deterministic outputs

### End-to-end tests

Browser coverage lives in:

- [`../../../tests/e2e/parental-gate.e2e.ts`](../../../tests/e2e/parental-gate.e2e.ts)

Current E2E coverage verifies:

- route load and canonical metadata
- all 6 demos
- success and failure states
- compare sorting
- recommendation determinism
- mobile stacked-panel behavior
- guidance structure presence

If you change interaction behavior, update this suite in the same commit.

## Editing Guidance

### If you are changing pattern content

Edit:

- `patterns.ts`
- `copy.ts`
- `faq.ts`

### If you are changing recommendation behavior

Edit:

- `recommendationRules.ts`
- `recommendation.ts`
- related tests

### If you are changing comparison behavior

Edit:

- `criteria.ts`
- `compare.ts`
- related tests

### If you are changing page composition or interaction flow

Edit:

- [`+page.svelte`](./+page.svelte)
- shared styles in [`../../routes/layout.css`](../../routes/layout.css)

## Change Checklist

Before shipping meaningful changes to this route, verify:

- anchors still exist
- all 6 demos still open and reset cleanly
- compare sorting still makes sense for inverse criteria
- recommendation still returns exactly one primary and one backup
- guidance remains compressed and readable
- mobile still uses the inline stacked demo panel

## Non-Goals

This route is not trying to become:

- a design-system package
- a reusable SDK
- a parental-control product
- a content-heavy essay page
- a multi-lab platform of its own

It is one well-scoped interactive reference. Keep it that way.
