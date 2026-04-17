# CONTENT_MAP.md

# Detailed content migration map for merging `recica.dev` + `drilon.recica.dev` into one flagship homepage

> Companion document to `PLAN.md`.
>
> `PLAN.md` defines the strategy, architecture, and implementation direction.
> This file defines **exactly how existing content should be mapped, rewritten, merged, or removed** when building the new single-page `recica.dev`.

---

## 0. Purpose of this document

This document exists so an implementation agent or AI coding assistant can:

1. understand what content currently lives in `recica/` and `drilon/`
2. know what survives into the merged site
3. know what gets rewritten versus removed
4. know where every important piece of legacy content should go in the new homepage
5. avoid copying legacy content blindly into the new site
6. preserve the strongest professional proof while eliminating duplication and identity drift

This is **not** a generic inspiration document.
This is a **practical migration map**.

---

## 1. High-level migration rule

The new `recica.dev` homepage is **not** a concatenation of the old `recica.dev` and `drilon.recica.dev`.

It is a **distilled flagship page** built from the strongest elements of both.

### Core rule

- Old `recica.dev` contributes: **brand shell, cleaner visual tone, central-domain authority, tools visibility**
- Old `drilon.recica.dev` contributes: **professional identity, experience proof, project anchors, recruiter credibility, CV/contact depth**
- New `recica.dev` must feel like **one intentional site**, not two sites stitched together

---

## 2. Source inventory: what currently exists

This section captures the meaningful legacy content that should be considered during migration.

---

## 2.1 Current `recica.dev` content inventory

### Existing visible identity
- Name: `Drilon Recica`
- Headline: `Senior Software Engineer`
- Supporting role line: `Senior Frontend Engineer & Creative Technologist`
- Supporting description: `Specializing in performance, design systems, and minimalist web experiences.`
- Hiring signal: `Available for new opportunities`

### Existing destination links
- `drilon.recica.dev` → personal profile, CV, and detailed professional history
- `blog.recica.dev` → soon
- `labs.recica.dev` → soon
- `tools.recica.dev` → free developer utilities and micro-services

### Existing footer / utility links
- about
- LinkedIn
- X / Twitter
- source code / GitHub

### Interpretation

What is useful here:
- the domain authority of `recica.dev`
- the idea that this is the central online home
- the cleaner / more branded presentation style
- the explicit link to tools

What is **not** useful in the merged version:
- `Senior Frontend Engineer & Creative Technologist` as primary identity
- the current vague software/generalist wording
- the subdomain directory behavior as the main purpose of the homepage
- placeholder “soon” destinations in a primary context

---

## 2.2 Current `drilon.recica.dev` content inventory

### Existing hero / identity content
- Availability badge: `AVAILABLE FOR HIRE`
- Name: `Drilon Reçica`
- Role line: `Senior Android Developer · Flutter Engineer · Mobile Architecture`
- Supporting paragraph: `Specializing in robust Android-first solutions and cross-platform modernization. I build scalable mobile architectures that stand the test of time.`
- Primary links: Download CV, GitHub, LinkedIn

### Existing proof stats / summary points
- Android Dev since 2012
- 1M+ downloads on Play Store
- Legacy → Modern
- Java/XML to Kotlin/Compose
- Accessibility-led
- Complete UI rework according to WCAG
- Tech Lead
- Engineered End-to-end product (Qisara)

### Existing project / experience anchors
1. Deutsche Bahn – Wohin Du Willst
   - Senior Android Developer
   - Nov 2023 – Present
   - modernization, accessibility, modularization
   - Kotlin / Jetpack Compose / Coroutines / Accessibility

2. Qisara (DeenLabs)
   - Tech Lead & Product Architect
   - 2023 – 2024
   - 0-to-1 SaaS / full lifecycle / Flutter + Deno backend
   - Flutter / Deno.js / Cloud Architecture / SaaS / Golang / RevenueCat

3. Edeka – Scan & Go
   - Senior Flutter Engineer
   - 2021 – 2023
   - retail digital/physical shopping
   - but listed stack says Android / Kotlin / Jetpack Compose / Retail Tech
   - **this is inconsistent and must be normalized**

4. RMVGo
   - Senior Android Developer
   - 2020 – 2021
   - stabilization + modernization of transit apps
   - Android / Kotlin / RxJava / Mobility

5. easyCredit/Fymio & ErgoDirekt
   - Android Developer
   - 2018 – 2020
   - fintech / insurance apps
   - Android / Java / Kotlin / FinTech

### Existing expertise section
- Mobile Architecture
- Android & Flutter
- Kotlin & Dart
- Legacy Refactoring
- Backend Development
- Technical Leadership

### Existing tech stack section
Android:
- Kotlin
- Coroutines
- Flow
- MVVM
- Compose
- Retrofit
- Room
- MVI
- MVVM (duplicate)

Flutter:
- Dart
- go_router
- provider
- dio
- hive
- easy_localization
- revenuecat
- iOS
- android

Backend:
- Deno
- TypeScript
- Node.js
- Go
- PostgreSQL
- Redis
- SQLite
- Supabase
- Pocketbase

DevOps:
- GitHub Actions
- GitLab CI
- Docker
- Coolify
- VPS

### Existing connect section
- GitHub
- StackOverflow
- X / Twitter
- LinkedIn
- Email Me

### Interpretation

What is useful here:
- the clear mobile-centered professional identity
- the stronger role specificity
- the proof points and experience anchors
- the project names chosen by the user for the merged homepage
- the CV and professional links
- the expertise themes

What is less useful or should not be copied 1:1:
- full resume-style timeline density on the homepage
- duplicate or overly long stack dumps
- inconsistent taxonomy and capitalization
- some role/stack mismatch details
- “Available for hire” framing if too narrow for the new broader strategy

---

## 3. Locked target structure for the new merged homepage

The new `recica.dev` homepage should use the following section order.

1. Hero
2. Proof strip
3. Selected work
4. Featured tools
5. Experience snapshot
6. How I work
7. Open to work / collaboration
8. Contact
9. Footer

This order is locked unless there is a compelling UX reason to slightly adjust it.

---

## 4. Legacy-to-new mapping overview

The table below shows the big-picture mapping.

| Legacy source | Legacy content | New destination | Action |
|---|---|---|---|
| `recica` | Name / domain-home role | Hero | Rewrite |
| `recica` | Frontend / creative technologist copy | Remove / partially absorb into tone only | Remove as primary identity |
| `recica` | Available for new opportunities | Open to work section | Rewrite |
| `recica` | tools link | Featured tools section + nav CTA | Keep and elevate |
| `recica` | blog/labs “soon” links | Hide for now | Remove from main nav |
| `drilon` | Name and mobile-centered role | Hero | Rewrite and unify |
| `drilon` | proof stats | Proof strip | Keep, tighten |
| `drilon` | experience highlights | Selected work + Experience snapshot | Split and compress |
| `drilon` | expertise section | How I work | Transform |
| `drilon` | tech stack section | Optional compressed capability references | Compress heavily |
| `drilon` | connect section | Contact | Keep |
| `drilon` | Download CV | Hero CTA + Contact | Keep |

---

## 5. Exact section-by-section content migration map

This is the most important part of the file.

---

## 5.1 Hero section

## Goal

The hero must establish:
- name
- role
- value proposition
- broad but coherent relevance
- immediate professional clarity

It must fix the old identity drift between:
- generic software/frontend/creative language on `recica.dev`
- mobile/Android/Flutter depth on `drilon.recica.dev`

## Final hero content direction

### Keep from legacy
From `drilon`:
- `Drilon Reçica`
- the strong mobile/product professional identity
- the idea that the work spans robust solutions and modernization

From `recica`:
- the cleaner branding-first feel of the root domain
- the centrality of `recica.dev` as the main home

### Rewrite into the new hero

#### New locked headline
**Drilon Reçica**

#### New locked role line
**Senior Mobile & Product Engineer**

#### New locked supporting line
**Building polished mobile apps, practical developer tools, and modern digital products.**

### Optional short paragraph under hero
This can incorporate transformed ideas from both legacy sites:

Suggested direction:
- mobile and product engineering depth
- architecture modernization
- user experience quality
- tools/products angle

Example direction only:
> I design and build mobile products, modernize legacy systems, and create developer-facing tools with a focus on clarity, maintainability, and user experience.

## Legacy content that must NOT be copied directly

Do **not** use as-is:
- `Senior Frontend Engineer & Creative Technologist`
- `Senior Software Engineer`
- the old `recica.dev` sentence about design systems and minimalist web experiences as the main identity
- `Senior Android Developer · Flutter Engineer · Mobile Architecture` as-is

Reason:
- it is either too vague or too fragmented
- the new site needs one cleaner umbrella identity

## CTA mapping

### Keep / transform from legacy
From `drilon`:
- Download CV
- GitHub
- LinkedIn

From `recica`:
- tools visibility

### New CTA recommendation
Primary:
- `View selected work`
- `Get in touch`

Secondary:
- `Download CV`
- `Explore tools`

### Important note
GitHub and LinkedIn should still be present, but they do not both need to be huge hero CTAs if that crowds the layout.
At least one may be moved to the Contact section or utility nav.

---

## 5.2 Proof strip

## Goal

This section should preserve the strongest quick-scan proof points from `drilon.recica.dev` without copying the old stat grid verbatim.

## Keep from legacy
Use these as source material:
- Android Dev since 2012
- 1M+ downloads on Play Store
- Legacy → Modern
- Java/XML to Kotlin/Compose
- Accessibility-led
- Complete UI rework according to WCAG
- Tech Lead
- Engineered End-to-end product (Qisara)

## Rewrite and condense into 4–6 short proof items

### Recommended final proof items
Use something in this shape:
- Android since 2012
- Cross-platform delivery with Flutter
- Legacy systems modernized to Kotlin / Compose / modern architecture
- Accessibility-first work for large public-facing products
- Product leadership from 0-to-1
- Enterprise + startup experience

### Important rule
The proof strip should read like **evidence**, not a hype banner.
Keep each item short.
Avoid long explanatory text here.

## Remove from legacy
Remove:
- raw arrow-style phrasing like `Legacy → Modern` unless visually refined
- stat-card feel if it becomes too resume-ish
- overly promotional microcopy

---

## 5.3 Selected work

## Goal

This section replaces the old long “Experience Highlights” block as the real center of the homepage.

## Locked featured projects
These 3 projects are locked because the user explicitly chose them:
- Deutsche Bahn – Wohin Du Willst
- Qisara
- EDEKA – Scan & Go

## Mapping rule

The old `Experience Highlights` section from `drilon` must be split into:
- **Selected work** → only the 3 strongest featured stories
- **Experience snapshot** → compressed historical career overview

## Card structure for each project
Each project card should include:
- project / company name
- role
- time period
- concise context sentence
- 2–4 contribution bullets
- technologies or capabilities used
- optional result or outcome summary

## Project-specific mapping guidance

### 1. Deutsche Bahn – Wohin Du Willst

#### Keep from legacy
- name: Deutsche Bahn – Wohin Du Willst
- role: Senior Android Developer
- date: Nov 2023 – Present
- themes:
  - architecture migration
  - accessibility-first implementation
  - modularization
  - public-scale mobile platform modernization

#### Rewrite direction
Position this as:
- large-scale mobile modernization
- public-facing mobility product
- accessibility and maintainability leadership

#### Recommended angle
Emphasize:
- migration away from legacy architecture
- better team velocity through modularization
- accessibility work for a broad public user base

#### Good bullets to preserve/adapt
- Led migration from legacy MVP/RxJava patterns toward MVVM, Coroutines, and Flow
- Improved accessibility implementation according to WCAG expectations
- Decoupled core features to improve build times and delivery speed

#### Technologies to keep
- Kotlin
- Jetpack Compose
- Coroutines
- Flow
- Accessibility

### 2. Qisara

#### Keep from legacy
- name: Qisara (or Qisara / Deen Labs if desired)
- role: Tech Lead & Product Architect
- date: 2023 – 2024
- themes:
  - 0-to-1 product
  - full lifecycle ownership
  - Flutter frontend + Deno backend
  - product/architecture leadership

#### Rewrite direction
Position this as:
- entrepreneurial product leadership
- end-to-end product engineering
- full-stack product execution

#### Good bullets to preserve/adapt
- Led the product from concept to deployable experience
- Designed a multi-platform Flutter application architecture
- Built or shaped a scalable backend foundation using Deno.js and cloud infrastructure
- Owned technical direction across product, architecture, and delivery

#### Technologies to keep
- Flutter
- Deno.js
- TypeScript
- Cloud / backend architecture
- RevenueCat (only if relevant in the public narrative)

#### Important note
This project is strategically important because it proves:
- leadership
- independent product thinking
- beyond-client-work capability

That makes it ideal for the merged flagship.

### 3. EDEKA – Scan & Go

#### Keep from legacy
- name: EDEKA – Scan & Go
- date: 2021 – 2023
- themes:
  - retail product
  - physical + digital experience
  - scanning / checkout / loyalty / product interaction

#### Legacy inconsistency that MUST be fixed
The current legacy site says:
- role: Senior Flutter Engineer
but the listed tech stack says:
- Android / Kotlin / Jetpack Compose / Retail Tech

This mismatch must be resolved before implementation.

#### Implementation rule
Do **not** blindly copy the existing role/tech metadata.
The implementing agent must confirm which is accurate from source content/assets/CV.

If exact truth is uncertain, write in a neutral but accurate way such as:
- Senior Mobile Engineer
- Mobile Engineer
- Senior Engineer

until the final factual role/stack is validated.

#### Rewrite direction
Position this as:
- retail mobility / digital shopping UX
- real-world feature engineering
- user-facing product innovation in a retail context

#### Good bullets to preserve/adapt
- Helped build mobile shopping flows that bridge in-store and digital interactions
- Worked on scan-based user flows, checkout-adjacent interactions, and customer-facing retail functionality
- Contributed to product quality and usability in a high-practicality environment

#### Technologies to keep
Only keep technologies that are confirmed.
Do not keep conflicting data without validation.

## Remove from old experience section
Remove from Selected Work:
- RMVGo
- easyCredit/Fymio & ErgoDirekt

These are not removed from the site entirely.
They move to Experience snapshot.

---

## 5.4 Featured tools

## Goal

This section elevates `tools.recica.dev` from a simple link into a real proof-of-building section.

## Keep from legacy
From `recica`:
- the existence of a tools destination
- the idea that it offers free developer utilities and micro-services

## Rewrite into a stronger section

### New section job
This section must communicate:
- Drilon does not only work on employer/client products
- he also builds useful developer-facing products
- tools are part of the broader builder identity

### Suggested content elements
- short section intro
- 3 highlighted tools or categories
- one CTA: `Explore Recica Tools`
- a brief statement about utility / privacy / local-first / practical use, if accurate

### What NOT to do
- do not iframe the entire tools site into the homepage
- do not overwhelm the homepage with too many individual tools
- do not make this section visually louder than Selected Work

## Legacy items to remove
- old one-line `tools.recica.dev` link-card treatment as the only representation

---

## 5.5 Experience snapshot

## Goal

This section preserves career depth without turning the homepage back into a full CV page.

## Source material
Use from `drilon`:
- RMVGo
- easyCredit/Fymio & ErgoDirekt
- any additional role history that supports credibility
- possibly Deutsche Bahn / Qisara / EDEKA as compressed entries too, if the timeline includes all key roles

## Recommended format
Compressed timeline or list.
Each entry should include:
- company/project name
- title
- years
- one-line summary

## Recommended entries
1. Deutsche Bahn – Wohin Du Willst
2. Qisara
3. EDEKA – Scan & Go
4. RMVGo
5. easyCredit/Fymio & ErgoDirekt

If earlier experience exists and is relevant, it may be included only if it strengthens the narrative.
Do not make this section too long.

## Keep from legacy
- dates
- job titles
- company/project names
- one-sentence role summaries

## Remove / compress from legacy
- long bullet lists per role
- repeated technology chips for every entry
- resume-density detail

## Important rule
The homepage timeline is a **credibility overview**, not a complete historical record.
The full CV PDF handles complete chronological detail.

---

## 5.6 How I work

## Goal

This section replaces the old `Expertise` section and absorbs the useful part of the legacy tech stack framing without becoming a checklist.

## Source material
From `drilon` expertise section:
- Mobile Architecture
- Android & Flutter
- Kotlin & Dart
- Legacy Refactoring
- Backend Development
- Technical Leadership

## Transformation rule
Do **not** recreate the old expertise cards as-is.
Instead, convert them into a more personal and differentiated “working philosophy” section.

## Recommended themes
Use 3–5 themes, such as:
- Product-minded engineering
- Modernization without unnecessary complexity
- Strong mobile foundations
- Accessibility and UX quality
- Practical full-stack/product ownership

## Example translation from old to new

### Old
`Mobile Architecture — Scalable, modular codebases designed for longevity.`

### New direction
`I build systems that can evolve: clear architecture, maintainable boundaries, and delivery speed without long-term chaos.`

### Old
`Legacy Refactoring — Transforming technical debt into modern assets.`

### New direction
`I enjoy modernizing legacy systems carefully — improving architecture, delivery confidence, and developer experience without reckless rewrites.`

### Old
`Technical Leadership — Mentoring teams and driving technical strategy.`

### New direction
`I like operating where product decisions, technical tradeoffs, and execution meet — not just shipping code, but moving the whole product forward.`

## What to remove from legacy
Remove:
- generic expertise-card boilerplate
- stack labels pretending to be insight
- repetitive engineering cliches

---

## 5.7 Open to work / collaboration

## Goal

This section replaces both:
- `Available for new opportunities` from `recica`
- `AVAILABLE FOR HIRE` from `drilon`

with a broader and more strategically useful message.

## New direction
Because the site serves multiple goals, the message should cover:
- full-time roles
- consulting
- selective collaborations

## Recommended wording direction
Use something in the shape of:

> Open to senior roles, consulting engagements, and selected product collaborations.

Possible supporting line:

> Especially interested in mobile product engineering, architecture modernization, and practical product work.

## Important rule
Avoid:
- desperate-sounding availability language
- narrow “for hire” wording if it excludes the broader brand goals

## Legacy content to remove
Remove as-is:
- `Available for new opportunities`
- `AVAILABLE FOR HIRE`

These should be transformed, not copied.

---

## 5.8 Contact

## Goal

Consolidate all meaningful public-contact actions from both legacy sites.

## Source material
From `drilon`:
- Download CV
- GitHub
- LinkedIn
- StackOverflow
- X / Twitter
- Email Me

From `recica`:
- LinkedIn
- X
- GitHub / source_code

## Recommended priority
1. Email
2. LinkedIn
3. GitHub
4. CV
5. optional: StackOverflow
6. optional: X / Twitter

## Mapping rule
Not every old link needs equal visual weight.
The new page should be deliberate.

### Keep prominently
- Email
- LinkedIn
- GitHub
- Download CV

### Optional / lower prominence
- StackOverflow
- X / Twitter

## Important UX note
The contact area should feel like:
- professional
- easy to act on
- not like a social link dump

---

## 5.9 Footer

## Goal

Create a cleaner footer than either legacy site currently has.

## Keep
- copyright
- name
- a few useful links

## Recommended footer links
- Tools
- CV
- GitHub
- LinkedIn
- Email

## Do not include yet
- Blog, unless launched
- Labs, unless launched
- dead / placeholder destinations

---

## 6. Legacy section deconstruction: exact keep / rewrite / remove decisions

This section is intentionally blunt so the coding agent does not guess.

---

## 6.1 Old `recica.dev` deconstruction

### `Drilon Recica — Senior Software Engineer`
**Decision:** remove as-is

Reason:
- too generic
- weaker than the new locked positioning

### `Senior Frontend Engineer & Creative Technologist`
**Decision:** remove as primary identity

Reason:
- conflicts with the user’s chosen positioning
- can subtly influence tone, but must not define the homepage

### `Specializing in performance, design systems, and minimalist web experiences.`
**Decision:** remove as core positioning; optionally absorb “clarity / polish / minimalism” into writing style only

Reason:
- too web/front-end specific
- underrepresents mobile/product depth

### `Available for new opportunities`
**Decision:** rewrite into broader collaboration/availability section

### `drilon.recica.dev` link card
**Decision:** remove completely from homepage structure

Reason:
- the site is being merged
- there should no longer be a separate public personal profile destination

### `blog.recica.dev soon`
**Decision:** remove from nav/homepage for now

### `labs.recica.dev soon`
**Decision:** remove from primary nav for now
May optionally appear as a subtle “coming soon” line lower on the page, but not as a main destination.

### `tools.recica.dev`
**Decision:** keep and upgrade from simple link to a real featured section

### Footer links
**Decision:** preserve relevant links, but rebuild the footer cleanly

---

## 6.2 Old `drilon.recica.dev` deconstruction

### `AVAILABLE FOR HIRE`
**Decision:** remove as-is, replace with broader collaboration wording

### `Senior Android Developer · Flutter Engineer · Mobile Architecture`
**Decision:** rewrite into `Senior Mobile & Product Engineer`

Reason:
- new role is cleaner and more commercially flexible
- still consistent with old strengths

### Supporting paragraph about Android-first solutions and cross-platform modernization
**Decision:** partially keep concept, fully rewrite copy

Reason:
- good substance
- legacy phrasing is serviceable but not distinctive enough for the new flagship

### Old proof stats
**Decision:** keep concept, rewrite presentation

### `Experience Highlights`
**Decision:** split into:
- Selected Work
- Experience Snapshot

### `Expertise`
**Decision:** transform into `How I work`

### `Tech Stack I Use`
**Decision:** compress aggressively; do not recreate as a large homepage section

Possible destinations:
- subtle technology references in case studies
- optional tiny capabilities block
- full stack detail can live in CV PDF or future dedicated resume page

### `Let's Connect`
**Decision:** keep concept, redesign layout and link priority

---

## 7. Recommended rewrite rules by content type

This section helps the implementation agent rewrite content consistently.

---

## 7.1 Identity copy rewrite rules

### Old pattern to avoid
- fragmented role labels
- generic software-title inflation
- frontend-heavy copy that undercuts the chosen positioning

### New rule
Always prefer:
- mobile + product framing
- architecture + delivery framing
- clarity and specificity over buzzwords

### Example conversion
Old:
> Senior Android Developer · Flutter Engineer · Mobile Architecture

New:
> Senior Mobile & Product Engineer

---

## 7.2 Experience rewrite rules

### Old pattern to avoid
- resume bullets that simply restate duties
- giant stacks per project
- buzzword-heavy summaries

### New rule
Each project summary should emphasize:
1. context
2. challenge
3. contribution
4. result or value

### Example structure
- Built / modernized / led…
- in the context of…
- by doing…
- resulting in…

---

## 7.3 Technology rewrite rules

### Old pattern to avoid
- laundry lists
- duplicate technologies
- inconsistent capitalization
- weak taxonomies

### New rule
- mention technology only when it supports the story
- prefer capabilities over giant lists
- validate inconsistencies before publication

### Example
Instead of:
`Kotlin  Coroutines  Flow  MVVM  Compose  Retrofit  Room  MVI  MVVM`

Use:
`Kotlin, modern Android architecture, Jetpack Compose, and asynchronous data flows.`

---

## 7.4 Contact rewrite rules

### Old pattern to avoid
A link dump with every social platform equally emphasized.

### New rule
Structure contact options by professional usefulness:
- email
- LinkedIn
- GitHub
- CV
- optional extras

---

## 8. Suggested final content allocation by source file/folder

This section is for monorepo implementation.

---

## 8.1 Content likely sourced from `drilon/`

Use `drilon/` as the main reference for:
- project names
- role names
- dates
- proof points
- existing CV link/path
- existing professional URLs
- experience summaries

## 8.2 Content likely sourced from `recica/`

Use `recica/` as the main reference for:
- current root-domain branding shell
- visual tone cues
- current footer/external links
- tools cross-linking patterns

## 8.3 Content that should be newly authored in `recica/`

These parts should be freshly written, not copied:
- final hero paragraph
- proof strip phrasing
- case study summaries
- How I work section
- Open to work / collaboration section
- Tools section intro
- overall section headings if the old ones feel generic

---

## 9. Explicit content decisions for the AI coding/editor agent

These decisions should be treated as hard requirements.

1. `drilon.recica.dev` is no longer a parallel personal site.
2. The new homepage must not contain a card linking to a separate personal-profile subdomain.
3. The old frontend/creative-technologist identity must not survive as the main public positioning.
4. `Senior Mobile & Product Engineer` is the locked public role.
5. `Drilon Reçica` is the locked visible name.
6. The 3 homepage case studies are locked:
   - Deutsche Bahn – Wohin Du Willst
   - Qisara
   - EDEKA – Scan & Go
7. `tools.recica.dev` must remain visibly featured on the homepage.
8. Blog and Labs must not appear as normal navigation destinations until they actually exist.
9. The homepage must not become a giant resume dump.
10. Old content should be rewritten wherever necessary to produce one coherent voice.

---

## 10. Migration checklist by section

Use this as the actual execution checklist.

---

## Hero checklist
- [ ] replace old root-site title/role copy
- [ ] merge in stronger identity from old `drilon`
- [ ] set final visible name to `Drilon Reçica`
- [ ] set final role to `Senior Mobile & Product Engineer`
- [ ] write one strong supporting line
- [ ] add hero CTAs
- [ ] remove any link to the legacy personal subdomain

## Proof strip checklist
- [ ] extract strongest proof items from `drilon`
- [ ] condense to 4–6 items
- [ ] remove resume-card visual tone if too stiff

## Selected work checklist
- [ ] create 3 cards/blocks for locked projects
- [ ] verify role/tech truth for EDEKA
- [ ] rewrite every project summary for consistency
- [ ] ensure project cards do not read like copied CV bullets

## Tools checklist
- [ ] add dedicated tools section on homepage
- [ ] link to `tools.recica.dev`
- [ ] optionally show featured tools/categories
- [ ] remove old one-link-only representation

## Experience snapshot checklist
- [ ] compress remaining career history into concise entries
- [ ] keep dates/titles factual
- [ ] avoid long bullet lists

## How I work checklist
- [ ] transform old expertise themes into personal working-philosophy copy
- [ ] do not recreate generic expertise cards verbatim

## Collaboration checklist
- [ ] replace old availability banners with broader collaboration language
- [ ] cover full-time + consulting + product collaboration

## Contact checklist
- [ ] preserve CV link
- [ ] preserve GitHub / LinkedIn / email
- [ ] choose contact priority hierarchy
- [ ] demote optional social links

## Footer checklist
- [ ] keep only relevant active destinations
- [ ] remove placeholder destinations

---

## 11. Optional “before vs after” content examples

These examples are not mandatory final copy, but they show the intended transformation quality.

---

## Example 1: identity

### Before
`Senior Frontend Engineer & Creative Technologist`

### After
`Senior Mobile & Product Engineer`

---

## Example 2: availability

### Before
`Available for new opportunities`

### After
`Open to senior roles, consulting engagements, and selected product collaborations.`

---

## Example 3: expertise

### Before
`Legacy Refactoring — Transforming technical debt into modern assets.`

### After
`I modernize legacy systems carefully, improving architecture, delivery confidence, and developer experience without defaulting to reckless rewrites.`

---

## Example 4: project summary tone

### Before
`Architecture Migration: Lead transition from legacy MVP/RxJava to MVVM/Coroutines/Flow.`

### After
`Led architectural modernization of a large mobile codebase, moving critical flows toward a more maintainable Kotlin-first stack and improving delivery confidence.`

---

## 12. Final summary for the implementation agent

When merging `recica.dev` and `drilon.recica.dev`:

- treat old `recica` as the shell and domain home
- treat old `drilon` as the main source of professional proof
- do not preserve both site identities
- do not copy old copy blindly
- do not reproduce the legacy site structure
- build one flagship homepage with a clear mobile/product identity
- feature tools as part of the builder story
- compress experience, expand selected work, and elevate clarity

The correct result is:
- one stronger site
- one clearer identity
- one better first impression
- one easier thing to maintain

