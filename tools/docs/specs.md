# Recica Tools - Product and Technical Specification

## 1. Overview

**Project name:** Recica Tools  
**Type:** Dark-first web toolbox / personal developer lab  
**Primary goal:** Build a fast, lightweight, route-based toolbox of practical browser tools that mostly run locally in the client, with minimal infrastructure, no auth, no analytics, and no unnecessary complexity.  
**Primary audience:** Initially the owner for daily use, with public usefulness as a secondary outcome.  
**Tone:** Developer-ish, personal lab, slightly futuristic, clean, practical.

Recica Tools should feel like a personal developer lab with focused tools for real workflows. It must not feel like a spammy utility farm, a bloated SaaS dashboard, a neon gimmick, or a generic template app.

## 2. Product Principles

- Utility first
- Minimal overhead
- Fast interaction
- Readable UI
- Local execution when practical
- No unnecessary data collection
- No unnecessary dependencies
- No unnecessary backend
- No overengineering

## 3. Scope

### 3.1 Current built-in tools

The initial MVP baseline shipped with the first eight tools below. The current built-in route set now includes:

1. JSON Formatter / Validator
2. Base64 Encoder / Decoder
3. QR Code Generator
4. URL Encoder / Decoder
5. Regex Tester
6. Timestamp Converter
7. Password Generator
8. Text Diff Checker
9. SQL Formatter / Minifier
10. Hash Generator
11. UUID Generator
12. Query String Parser / Builder
13. .env Parser / Viewer
14. JWT Inspector
15. Markdown Previewer
16. HTML Previewer
17. Slug Generator
18. Text Case Converter
19. Word / Character Counter
20. Color Converter
21. Barcode Generator
22. Device / Browser Info
23. robots.txt Parser / Validator
24. Sitemap XML Parser / Validator

### 3.2 MVP platform features

- Homepage with tool catalog
- Route-based navigation
- Tool search
- External resource section for curated off-site links
- Fully implemented dark and light theme
- Responsive layout
- No auth
- No analytics
- No backend API
- Dockerized deployment for Hetzner VPS via Coolify

### 3.3 MVP persistence rules

- No saved tool history
- No saved tool presets
- No local draft persistence for tool inputs
- Theme preference is the only allowed persisted setting in MVP
- Theme preference is stored locally in `localStorage`

### 3.4 Explicitly out of scope for MVP

- User accounts
- Cloud sync
- Saved history
- Tool favorites
- PWA / installability
- Analytics
- Admin panel
- Heavy file processing
- AI integrations
- Server-side persistence
- Multi-tenant features
- SEO spam pages
- Rate-limited APIs
- Public submissions
- Community features

## 4. Product Positioning and Brand

### 4.1 Brand name

**Recica Tools**

### 4.2 Brand flavor

A personal developer lab under the Recica identity.

### 4.3 Tagline

Preferred tagline:

**Practical tools, built in the Recica Lab.**

### 4.4 Messaging hierarchy

1. Practical, fast, useful tools
2. Local-first and privacy-aware where practical
3. Personal developer lab identity

Privacy-aware messaging should support the product, not dominate the headline.

### 4.5 Desired feel

- Developer-ish
- Personal lab / playground
- Slightly futuristic
- Clean and premium
- Structured and modular
- Restrained, not loud

### 4.6 What to avoid

- Cheesy hacker aesthetics
- Neon overload
- Cartoonish icons
- Generic SaaS blandness
- Heavy glassmorphism
- Gradient overload
- Playful consumer-app styling

## 5. Design System

### 5.1 Theme direction

- Dark mode is the flagship presentation
- Light mode is fully implemented and polished
- Dark mode is the default on first visit
- MVP supports manual dark/light toggle only
- MVP does not support system-auto theme selection

### 5.2 Color palette

#### Dark theme

```css
:root.dark {
	--bg: #0b0f14;
	--bg-alt: #10161d;
	--surface: #151c24;
	--surface-elevated: #1b2530;
	--surface-strong: #22303d;

	--border-subtle: #263341;
	--border-strong: #324455;

	--text: #eaf2f8;
	--text-secondary: #a5b4c3;
	--text-muted: #748394;

	--primary: #1ec8a5;
	--primary-hover: #18b393;
	--primary-soft: #123b38;

	--secondary: #4da3ff;
	--secondary-hover: #2f8ef5;
	--secondary-soft: #132d47;

	--success: #2fd47a;
	--warning: #f0b34a;
	--error: #f05f6d;
}
```

#### Light theme

```css
:root {
	--bg: #f4f7fa;
	--bg-alt: #edf2f7;
	--surface: #ffffff;
	--surface-elevated: #f8fbfd;
	--surface-strong: #e8eff5;

	--border-subtle: #d7e1ea;
	--border-strong: #c3d0db;

	--text: #13202c;
	--text-secondary: #516273;
	--text-muted: #738395;

	--primary: #109c84;
	--primary-hover: #0e866f;
	--primary-soft: #ddf5ef;

	--secondary: #2f7de1;
	--secondary-hover: #246ac4;
	--secondary-soft: #e2eeff;

	--success: #1fa968;
	--warning: #e0a43a;
	--error: #d95360;
}
```

### 5.3 Color usage rules

- Primary teal is used for main actions, active states, focus accents, and toggles
- Secondary blue is used for links, secondary actions, and info states
- Success, warning, and error colors are reserved for semantic feedback
- Most visual weight comes from neutrals and surfaces
- Components must not hardcode arbitrary colors outside the token system

### 5.4 Typography

- Primary UI font: Inter
- Monospace font: JetBrains Mono
- Use JetBrains Mono for generated values, JSON output, timestamps, encoded output, slugs, and technical badges

### 5.5 Shape and depth

- Cards: `16px` radius
- Inputs: `12px` radius
- Buttons: `12px` radius
- Pills and badges: `999px` radius
- Use borders and tonal layering before shadows
- Use subtle shadows only
- Glow is allowed for focus, active cards, selected navigation, selected toggles, and important button hover

### 5.6 Motion

- Motion is restrained
- Motion must never block interaction
- Reduced-motion preferences must be respected

## 6. UX Guidelines

### 6.1 Core goals

- Immediate clarity
- Zero confusion
- Fast input/output cycles
- Strong keyboard and mouse usability
- Strong mobile support
- Minimal clutter

### 6.2 Layout philosophy

Use a single SvelteKit app with route-based tools:

- `/`
- `/json`
- `/base64`
- `/qr`
- `/url`
- `/regex`
- `/timestamp`
- `/password`
- `/diff`
- `/sql`
- `/hash`
- `/uuid`
- `/query`
- `/env`
- `/jwt`
- `/markdown`
- `/html`
- `/slug`
- `/case`
- `/counter`
- `/color`
- `/barcode`
- `/device`
- `/robots`
- `/sitemap`

### 6.3 Global navigation

The global navigation includes:

- Brand / logo
- Home link
- Search access
- Theme toggle

Navigation stays compact and simple.

### 6.4 Homepage structure

The homepage includes:

1. Hero with product name, tagline, short description, and search field
2. Quick-access featured tools
3. Full tool grid
4. Separate external resources section for curated off-site links
5. Small local-first / practical-use note in supporting copy

The homepage should feel like a launcher for a personal toolbox.

### 6.5 Shared tool page contract

Every tool page follows the same baseline structure:

1. Title
2. One-line description
3. Local-execution note when the tool runs entirely in the browser
4. Input area
5. Action controls
6. Validation or status message area
7. Output area
8. Copy affordance where relevant
9. Empty state when no result exists yet

### 6.6 Interaction model

The MVP uses a hybrid interaction model:

- Lightweight tools use debounced live updates when that improves speed and clarity
- Heavy or error-prone tools use explicit actions
- Errors must be inline, specific, and non-destructive

### 6.7 Search

- Search scope is limited to tools
- Search indexes tool `name`, `description`, and `keywords`
- Search is keyboard accessible
- Search works on desktop and mobile
- Search is fast enough for instant filtering across the MVP tool set

## 7. Accessibility and Usability

### 7.1 Accessibility requirements

- Semantic HTML
- Accessible labels for all controls
- Full keyboard navigation
- Visible focus states
- Sufficient contrast in both themes
- No color-only meaning for critical states
- Screen-reader sensible structure
- Responsive layout from mobile to desktop

### 7.2 Usability requirements

- Copy buttons where relevant
- Clear validation messages
- Instant feedback where the tool interaction model allows it
- No unnecessary modals
- No forced animation

## 8. Technical Stack

### 8.1 Chosen stack

- Framework: SvelteKit
- Language: TypeScript
- Styling: Tailwind CSS with CSS variables for theme tokens
- Deployment: Docker container on Hetzner VPS via Coolify
- SvelteKit adapter: `@sveltejs/adapter-node`
- Persistence: none beyond theme preference in `localStorage`
- Backend API: none in MVP
- Analytics: none
- Auth: none
- PWA: none

### 8.2 Runtime and rendering model

- The app keeps SvelteKit's SSR-capable shell
- Public shell routes may be prerendered when that improves delivery without changing behavior
- Tool logic runs in the browser
- The app is not implemented as an SPA-only client app
- Browser-only APIs are guarded correctly
- The runtime target is a Node server inside the deployment container

### 8.3 Architecture principles

- Tools are isolated from each other where practical
- Shared layout, components, and utilities stay lean
- Business logic stays close to each tool unless reuse is obvious
- Design tokens are centralized
- Tool metadata comes from one source of truth
- Avoid generic tool engines, deep abstraction layers, and unnecessary global state

### 8.4 Proposed structure

```txt
src/
  app.html
  lib/
    components/
      layout/
      tools/
      ui/
    constants/
    search/
    theme/
    types/
    utils/
  routes/
    +layout.svelte
    +page.svelte
    barcode/
      +page.svelte
    base64/
      +page.svelte
    case/
      +page.svelte
    color/
      +page.svelte
    counter/
      +page.svelte
    device/
      +page.svelte
    diff/
      +page.svelte
    env/
      +page.svelte
    hash/
      +page.svelte
    html/
      +page.svelte
    json/
      +page.svelte
    jwt/
      +page.svelte
    markdown/
      +page.svelte
    password/
      +page.svelte
    qr/
      +page.svelte
    query/
      +page.svelte
    regex/
      +page.svelte
    robots/
      +page.svelte
    sitemap/
      +page.svelte
    slug/
      +page.svelte
    sql/
      +page.svelte
    timestamp/
      +page.svelte
    url/
      +page.svelte
    uuid/
      +page.svelte
```

### 8.5 Tool metadata model

Use a single `ToolDefinition` model as the source of truth for homepage cards, search, badges, and route metadata.

```ts
type ToolDefinition = {
	id: string;
	name: string;
	route: string;
	description: string;
	category: string;
	localOnly: boolean;
	keywords: string[];
	status?: 'mvp' | 'planned';
};
```

### 8.6 Theming implementation rules

- Theme tokens are implemented with CSS variables
- Tailwind is used for layout, spacing, typography, and responsive structure
- `app.html` includes a small theme bootstrap script to prevent flash of the wrong theme
- Theme preference is read from and written to `localStorage`
- The default theme is dark when no stored preference exists

## 9. Tool Specifications

### 9.1 QR Code Generator

**Purpose:** Generate practical QR codes quickly from typed presets and export them locally.

**Input**

- Preset selector with these payload types:
  - `Text`
  - `URL`
  - `Wi-Fi`
  - `Email`
  - `Phone`
  - `SMS`
- Structured fields for the active preset
- Render controls:
  - Export size: `256`, `384`, `512`
  - Quiet zone margin: `0`, `1`, `2`, `4`
  - Error correction: `L`, `M`, `Q`, `H`

**Behavior**

- Debounced live preview
- No preview is shown until the active preset has valid required fields
- Presets build payloads for:
  - free text
  - normalized absolute URLs
  - Wi-Fi credentials using `WIFI:T:...;S:...;P:...;H:...;;`
  - `mailto:` links with optional subject and body
  - `tel:` links
  - `SMSTO:` payloads with optional message text
- Raw payload is shown alongside the QR preview
- Tool runs locally in the browser
- Custom colors, logo overlays, scanners, and visual styling controls are out of scope

**Output**

- QR code preview
- PNG download action
- SVG download action
- Copyable raw payload block

**Implementation rules**

- One focused, well-maintained QR library is allowed
- Library choice must be justified by size, maintenance quality, and local rendering support
- Payload construction and validation live in a dedicated QR helper module

**Errors**

- Required-field validation is inline and preset-specific
- Invalid preset state suppresses stale preview output
- Oversized payloads show a clear inline generation error
- Failures show a clear inline message

### 9.2 JSON Formatter / Validator

**Purpose:** Format and validate JSON input safely.

**Input**

- Large textarea for raw JSON input

**Behavior**

- Explicit `Validate`, `Format`, and `Minify` actions
- Use native `JSON.parse` and `JSON.stringify`
- Do not support JSON5
- Do not support comments
- Do not support schema validation
- Do not support tree-view rendering

**Output**

- Formatted or minified JSON in a monospace output area
- Copy output action

**Errors**

- Show parse errors inline
- Extract line and column on a best-effort basis
- Preserve the original input when validation fails

### 9.3 Password Generator

**Purpose:** Generate strong passwords quickly.

**Input**

- Length control
- Uppercase toggle
- Lowercase toggle
- Numbers toggle
- Symbols toggle

**Behavior**

- Default length is `20`
- Uppercase, lowercase, numbers, and symbols are enabled by default
- At least one character set must remain enabled
- Auto-generate on first load
- Auto-generate when settings change
- Provide explicit `Regenerate` action
- Use `crypto.getRandomValues`
- Guarantee at least one character from each enabled set
- Strength meter is out of scope for MVP

**Output**

- Generated password in a monospace field
- Copy output action

**Errors**

- Show inline validation when the selected settings are invalid

### 9.4 URL Encoder / Decoder

**Purpose:** Encode and decode URL strings safely.

**Input**

- Textarea for source input
- Mode toggle: `Full URL` or `Component`

**Behavior**

- Explicit `Encode` and `Decode` actions
- `Full URL` mode uses `encodeURI` and `decodeURI`
- `Component` mode uses `encodeURIComponent` and `decodeURIComponent`
- Input is never overwritten on failure

**Output**

- Encoded or decoded result
- Copy output action

**Errors**

- Malformed decode input shows an inline error
- Error state does not destroy the source input

### 9.5 Base64 Encoder / Decoder

**Purpose:** Encode UTF-8 text into standard Base64 and decode standard Base64 back into UTF-8 text safely.

**Input**

- Textarea for source input

**Behavior**

- Explicit `Encode` and `Decode` actions
- Encode uses UTF-8 text input and outputs standard single-line Base64
- Decode accepts plain Base64 text only
- Decode ignores ASCII whitespace around wrapped Base64 input
- Decode restores missing padding when the input length makes the correction unambiguous
- Decode rejects URL-safe Base64 characters such as `-` and `_`
- Decode rejects `data:*;base64,...` input
- Decoded bytes must be valid UTF-8 text
- Input is never overwritten on failure

**Output**

- Encoded or decoded result
- Copy output action

**Errors**

- Malformed Base64 input shows an inline error
- Invalid UTF-8 decoded bytes show a distinct inline error
- Error state does not destroy the source input

### 9.6 Slug Generator

**Purpose:** Generate slugs from text input.

**Input**

- Single text input

**Behavior**

- Debounced live output
- Unicode normalize input
- Strip diacritics
- Lowercase output
- Convert separators and spaces to hyphens
- Collapse repeated hyphens
- Trim leading and trailing hyphens
- Preserve numbers by default
- Custom separators are out of scope for MVP
- Perfect multilingual transliteration is out of scope for MVP

**Output**

- Generated slug in a monospace output field
- Copy output action

**Errors**

- Empty input shows an empty state

### 9.7 Timestamp Converter

**Purpose:** Convert between Unix timestamps and human-readable dates.

**Modes**

- `Timestamp -> Date`
- `Date -> Timestamp`

**Input**

- Timestamp mode accepts numeric input
- Timestamp mode auto-detects seconds vs milliseconds
- Timestamp mode includes a manual unit override
- Date mode uses a controlled date/time input
- Date mode includes explicit timezone selection

**Behavior**

- Include `Now` action to fill current time
- Make timezone context explicit in labels and result sections
- Show both interpreted and canonical output forms

**Output**

- Local date/time output
- UTC / ISO output with copy action
- Unix seconds output with copy action
- Unix milliseconds output with copy action

**Errors**

- Invalid numeric input shows inline validation
- Invalid date input shows inline validation
- Ambiguous timezone context is not allowed in the UI

### 9.8 Text Diff Checker

**Purpose:** Compare two text blocks.

**Input**

- Two textareas

**Behavior**

- Debounced compare
- Side-by-side layout on desktop
- Stacked layout on mobile
- Line-first diff presentation
- Inline highlighting inside changed lines
- No patch export
- No merge workflow
- No git-style complexity

**Output**

- Readable diff result with clear added, removed, and changed sections

**Implementation rules**

- One focused, well-maintained diff library is allowed
- Library choice must be justified by bundle size and readability of output

**Errors**

- Empty state is shown when both inputs are empty

### 9.9 Expanded route set after the initial MVP baseline

The product also ships these additional client-first routes beyond the original eight-tool baseline.

- **Regex Tester**
  - ECMAScript regex only
  - Pattern, flags, replacement, and source text inputs
  - Live match evaluation, capture groups, and replace preview
  - Invalid patterns fail inline without mutating source text
- **UUID Generator**
  - Supports UUID `v4` and `v7`
  - Bulk generation is allowed with a bounded count
  - Copy individual values or the full batch
- **Hash Generator**
  - Supports `SHA-256`, `SHA-384`, and `SHA-512`
  - Uses Web Crypto locally
  - Output is lowercase hexadecimal
- **Query String Parser / Builder**
  - Parses pasted query strings into editable key/value rows
  - Preserves repeated keys
  - Rebuilds output with standard URL component encoding
  - Malformed percent-encoding shows a non-destructive inline error
- **Text Case Converter**
  - Supports camelCase, PascalCase, snake_case, kebab-case, Title Case, uppercase, and lowercase
  - Output is generated from normalized words rather than copied punctuation
- **Word / Character Counter**
  - Tracks characters, characters without spaces, words, lines, paragraphs, and estimated reading time
  - Updates immediately as text changes
- **.env Parser / Viewer**
  - Parses pasted dotenv content only
  - Shows comments, quoted and unquoted values, duplicates, and malformed rows
  - No persistence or remote loading
- **Color Converter**
  - Accepts `HEX`, `RGB(A)`, and `HSL(A)` input
  - Shows a live swatch plus copy-ready converted outputs
  - Stops intentionally at common web color formats
- **JWT Inspector**
  - Decode-only in this version
  - Header and payload must be valid Base64URL-encoded UTF-8 JSON
  - Show claims and practical timestamp interpretation
  - No signature verification claims in UI or behavior
- **Markdown Previewer**
  - Split editor and preview layout
  - Preview is sanitized and sandboxed
  - Raw HTML is escaped rather than executed
- **HTML Previewer**
  - Split source and preview layout
  - Preview runs in a sandboxed iframe
  - Script tags, inline event handlers, and `javascript:` URLs are stripped
- **Device / Browser Info**
  - Reads practical browser-side environment details only from local APIs
  - Includes viewport, screen, platform, language, timezone, storage support, and theme preference
- **Barcode Generator**
  - Supports `Code 128`, `EAN-13`, and `UPC-A`
  - Generates local SVG preview plus SVG and PNG export
  - Numeric formats accept values with or without the final check digit
- **SQL Formatter / Minifier**
  - Formats and minifies SQL text only
  - No execution, linting, or dialect validation in this version
  - Formatting is intentionally practical rather than fully dialect-aware
- **robots.txt Parser / Validator**
  - Paste-only validation
  - Parses common directives, preserves comments, and flags malformed or unknown lines
  - No remote URL fetch or crawler simulation
- **Sitemap XML Parser / Validator**
  - Paste-only validation
  - Supports `urlset` and `sitemapindex`
  - Extracts `<loc>` values and reports practical structural errors
  - No remote URL fetch or schema download

## 10. Performance, Security, and Dependency Policy

### 10.1 Performance rules

- Fast initial load
- Lean client bundles
- No heavy UI library
- No unnecessary animation
- No unused code shipped in MVP
- Keep components simple
- Avoid fragmenting the UI into micro-components without clear value

### 10.2 Dependency policy

- Prefer browser and platform APIs first
- Every dependency must have a specific reason to exist
- Avoid obscure, broad, or weakly maintained packages
- Avoid packages with suspicious install behavior
- Keep the dependency tree intentionally small
- A targeted library is allowed for QR generation
- A targeted library is allowed for diff rendering
- Native implementations are preferred for the rest of the MVP tools

### 10.3 Runtime safety rules

- Treat all user input as untrusted
- No `eval`
- No unsafe HTML injection
- No `{@html}`
- Guard browser-only APIs during SSR
- Do not assume `window`, `document`, or clipboard APIs exist during SSR
- Large input handling must fail gracefully
- Output is always rendered as text, never as executable markup

### 10.4 HTTP and browser security defaults

- Apply a practical Content Security Policy
- Set `X-Content-Type-Options: nosniff`
- Set `Referrer-Policy: strict-origin-when-cross-origin` or stricter
- Disable framing unless embedding is intentionally required
- Use a sensible Permissions Policy

## 11. Deployment

### 11.1 Target

Deploy with Docker to a Hetzner VPS through Coolify.

### 11.2 Container requirements

- Production-ready Dockerfile
- Multi-stage build
- Minimal runtime image
- Non-root runtime user
- Respect the `PORT` environment variable
- No unnecessary OS packages in the final image
- Do not include build-only files in the runtime image

### 11.3 Operational model

- No database
- No persistent volume
- No external services required for MVP
- Easy redeploy
- Easy rollback

## 12. Code Quality Rules

- Use TypeScript for shared models and non-trivial tool logic
- Keep naming clear and conventional
- Avoid dead code
- Avoid commented-out code
- Reuse patterns only when reuse is real
- Prefer clarity over cleverness
- Avoid giant utility files
- Avoid giant god-components
- Avoid unnecessary stores

## 13. Suggested Implementation Order

1. Project setup
2. Tailwind and theme token system
3. Global layout and navigation
4. Homepage tool catalog
5. Tool metadata and search
6. QR Code Generator
7. JSON Formatter / Validator
8. Password Generator
9. URL Encoder / Decoder
10. Base64 Encoder / Decoder
11. Slug Generator
12. Timestamp Converter
13. Text Diff Checker
14. Regex Tester
15. UUID Generator
16. Hash Generator
17. Query String Parser / Builder
18. Text Case Converter
19. Word / Character Counter
20. .env Parser / Viewer
21. Color Converter
22. JWT Inspector
23. Markdown Previewer
24. HTML Previewer
25. Device / Browser Info
26. Barcode Generator
27. SQL Formatter / Minifier
28. robots.txt Parser / Validator
29. Sitemap XML Parser / Validator
30. External resources section
31. Light theme refinement
32. Accessibility and responsive pass
33. Dockerization and deployment prep

## 14. Acceptance Criteria

The shipped baseline is complete when all of the following are true:

- The app is a single SvelteKit application
- The deployment target uses `@sveltejs/adapter-node`
- The app runs as a Node server inside Docker on Coolify
- All 24 built-in tool routes exist
- The homepage lists all built-in tools from the central `ToolDefinition` source of truth
- Tool search uses tool `name`, `description`, and `keywords`
- Curated external resources are rendered separately from the built-in tool grid
- Dark theme is the default on first visit
- Dark and light themes both work and persist correctly
- No system-auto theme mode exists in MVP
- Every tool route has clear empty, error, and success states
- QR supports preset-driven payload generation, live preview, raw payload copy, and PNG / SVG export
- JSON supports validate, format, and minify actions
- Password generation uses `crypto.getRandomValues`
- URL encode and decode modes are explicit
- Base64 supports explicit encode and decode actions for UTF-8 text
- Regex supports live evaluation, replace preview, and inline compile errors
- UUID supports local v4 and v7 generation with bulk copy
- Hashing supports SHA-256, SHA-384, and SHA-512 locally
- Query parsing preserves repeated keys and handles malformed percent-encoding safely
- Markdown and HTML previews are sandboxed
- JWT inspection is decode-only
- robots.txt and sitemap tools operate on pasted input only
- Timestamp results show local time, UTC / ISO, seconds, and milliseconds
- Diff results are readable on desktop and mobile
- No auth exists
- No analytics exists
- No PWA exists
- No tool history or tool setting persistence exists beyond theme preference
- No backend API exists
- Docker image builds successfully
- Container listens on `PORT`

## 15. Future Roadmap

Potential future tools:

- CSV / TSV ↔ JSON
- Cron parser / explainer
- Semver comparator
- Optional OKLCH support in Color Converter
- Timezone planner improvements
- VAT / margin calculator

Potential future platform features:

- Command palette
- Favorites
- Local saved presets
- Import and export for selected tool settings
- Richer homepage categorization
- Public sharing links for selected tools

Still avoid by default:

- Accounts
- Analytics
- Complex backend
- Heavy data storage
- Overengineered platformization
- CORS header testing without a backend or proxy

## 16. Final Product Summary

Recica Tools is a dark-first, route-based SvelteKit toolbox for practical browser tools, designed as a personal developer lab under the Recica identity.

It should be:

- Fast
- Clean
- Low-resource
- Dependency-light
- Security-conscious
- Local-first in spirit
- Simple to deploy on Hetzner with Docker and Coolify

The current product includes the original MVP routes plus a broader set of local text, encoding, inspection, preview, and formatting tools, while still keeping the operational model deliberately boring.
