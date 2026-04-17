# Labs by Drilon Recica — `labs.recica.dev` Landing Page Plan

## Document Purpose

This document is the **complete implementation plan** for the `labs.recica.dev` website inside the monorepo. It is written for an AI coding editor or engineer that has **zero prior context**.

The goal is to define:

- what `labs.recica.dev` is
- what role it plays in the broader Recica ecosystem
- how it should look and feel
- how it should be structured
- what the MVP includes
- what routes and content models exist
- what copy direction and design system should be used
- how to support current and future lab projects
- how to make the site polished, interesting, useful, and scalable

This document is about the **Labs landing site and its architecture**, not the internal implementation details of the individual Parental Gate Lab project itself. The Parental Gate Lab has its own dedicated plan.

---

# 1. High-Level Product Definition

## 1.1 What is `labs.recica.dev`?

`labs.recica.dev` is the **experimental playground and incubation space** for Drilon Recica.

It is a curated place for:

- experiments
- prototypes
- concept demos
- product explorations
- early-stage ideas
- interactive references
- future product candidates

This is **not** the flagship personal portfolio, and it is **not** the stable tools product.

### Ecosystem roles

- `recica.dev` = flagship personal/professional site
- `tools.recica.dev` = practical stable tools
- `labs.recica.dev` = experimental, curious, visual, and exploratory work

Labs should feel like the place where ideas are tested, pushed, shaped, and sometimes graduate into bigger things.

---

## 1.2 Core positioning

Visible brand:

**Labs by Drilon Recica**

Labs should communicate:

- interesting experiments
- useful prototypes
- product curiosity
- technical taste
- playful but smart energy
- real exploration, not filler

Labs should feel **distinct from both `recica.dev` and `tools.recica.dev`**.

It should not feel like a portfolio clone and should not feel like a stable utility catalog.

---

## 1.3 Primary goals

Labs should optimize for a mix of:

- creativity and experimentation
- useful prototypes
- future product incubation
- recruiter/client/developer curiosity
- some discoverability / SEO
- long-term ecosystem expansion

The homepage should make visitors think:

- “These are interesting experiments.”
- “These are useful prototypes.”
- “This person builds thoughtfully.”
- “There is more coming.”
- “This feels alive.”

---

# 2. Product Philosophy

## 2.1 Labs is not a junk drawer

Labs must be curated.

Do **not** dump every unfinished idea into Labs.

Every visible entry should justify its existence by meeting at least one of these:

- shows product thinking
- shows interaction/UX thinking
- shows engineering taste
- explores an interesting constraint
- could evolve into a real tool/product
- is memorable enough to strengthen the brand

If an idea is weak, generic, ugly, or poorly framed, it should stay private.

---

## 2.2 Labs is allowed to be playful, but not childish

Desired personality:

- indie
- experimental
- clever
- playful
- expressive
- visually interesting
- high taste
- curious

Not desired:

- childish
- chaotic
- meme-heavy
- try-hard edgy
- hacker cliché
- overly academic
- over-corporate

Target tone:
**moderately to significantly more playful than `recica.dev`, but still sharp and intentional.**

---

## 2.3 Labs is route-based, not subdomain-per-project

Use:

- `labs.recica.dev/` → Labs homepage
- `labs.recica.dev/parental-gate-lab` → current experiment
- `labs.recica.dev/mobile-analytics-crash-reporting` → future concept page / project page
- future experiments follow the same pattern

Do **not** create a separate subdomain for each experiment.

### Why routes are better

- stronger brand cohesion
- simpler navigation
- cleaner internal linking
- easier shared layout/components
- easier SEO clustering
- easier monorepo maintenance
- easier scaling for many experiments

Only move an experiment to its own subdomain/domain **if it graduates into a standalone product** later.

---

# 3. MVP Scope

## 3.1 MVP1 must include

### Landing page
- polished homepage for Labs
- clear hero and positioning
- featured experiment area
- visible current live experiment: **Parental Gate Lab**
- visible “coming soon” concept card: **privacy-first mobile analytics + crash reporting**
- strong message that more experiments are coming
- clear route structure and navigation

### One live experiment route
- `/parental-gate-lab`

### One coming-soon route or teaser destination
Recommended:
- create a route for the analytics/crash reporting idea, but mark it clearly as **Concept / Coming Soon**
- alternatively, if not ready, keep it as a homepage card only

For MVP1, the cleaner approach is:
- homepage card with “Coming Soon”
- optional lightweight concept page later

---

## 3.2 MVP1 should NOT include

- filters
- category/tag systems
- search
- public archive pages beyond homepage structure
- dozens of entries
- blog-like notes per experiment
- complex CMS
- user accounts
- comments
- overbuilt metadata systems

MVP1 should be **small but highly polished**.

---

# 4. Information Architecture

## 4.1 Recommended top-level routes

### Required
- `/` → Labs landing page
- `/parental-gate-lab` → current live experiment

### Recommended future
- `/mobile-analytics-crash-reporting` → future concept / coming soon page
- `/404`
- `/privacy` only if needed later
- `/imprint` only if needed later depending on shared legal structure

---

## 4.2 Route rules

### Home route
This is the discovery layer.
It introduces the Labs concept and features the visible projects.

### Experiment routes
Each experiment route should be a self-contained project page with consistent shared layout.

Each experiment page should support:
- title
- subtitle
- status
- experiment/category metadata
- overview
- why it exists
- live demo / entry CTA if applicable
- learnings / logic / implementation notes if applicable
- related experiment block
- back to Labs link

---

# 5. Main Navigation

Use a minimal top nav:

- **Home**
- **Experiments**
- **About**
- **Back to recica.dev**

Because MVP1 has a single homepage and one experiment, the nav can simply anchor-scroll on the homepage.

Recommended behavior:

- `Home` → top of homepage
- `Experiments` → homepage experiments section
- `About` → homepage “What is Labs?” section
- `Back to recica.dev` → external link to `https://recica.dev`

For experiment detail pages:
- keep the same top nav
- include a prominent **Back to Labs** action

---

# 6. Homepage Structure

The homepage should feel like an **experimental playground and curated launchpad**.

Use a single polished homepage with sections in this order.

---

## 6.1 Hero Section

### Purpose
Immediately explain what Labs is and why it exists.

### Content goals
- establish identity
- set tone
- feel distinct from `recica.dev`
- invite exploration
- communicate that this is active and growing

### Suggested content structure
- eyebrow: `Labs by Drilon Recica`
- main heading
- short supporting paragraph
- primary CTA
- secondary CTA
- optional small visual/status note

### Suggested heading directions
Do not lock to these exact lines, but use this style.

Possible heading direction:
**Interesting experiments. Useful prototypes.**
or
**Where product ideas get tested in public.**
or
**Experiments, prototypes, and strange-but-useful ideas.**

### Supporting paragraph direction
Should explain that Labs is where Drilon explores:
- UX patterns
- product concepts
- tooling ideas
- interactive references
- future products

Tone: curious, confident, concise.

### CTA recommendations
- Primary: `Explore experiments`
- Secondary: `Open Parental Gate Lab`

### Optional helper note
Examples:
- `1 live experiment · more in progress`
- `Launching with Parental Gate Lab`
- `New experiments will land here over time`

---

## 6.2 Intro / What Labs Is

### Purpose
Clarify the role of Labs for visitors who need a little context.

### Content goals
Explain that Labs is:
- a place for experiments and prototypes
- not a polished portfolio
- not a random dump
- where some ideas may stay small and some may become bigger

Keep this short. One strong paragraph plus 2–4 bullets or value chips is enough.

### Good concepts to communicate
- experiments with intent
- useful prototypes
- product and UX exploration
- future product incubation
- polished enough to explore, honest enough to evolve

---

## 6.3 Featured Experiments Section

### Purpose
This is the heart of the homepage.

### MVP entries
1. **Parental Gate Lab** — live
2. **Mobile Analytics + Crash Reporting** — coming soon / concept

### Optional third placeholder block
A generic “More experiments on the way” card can be used carefully, but should not feel lazy.

### Card design
Cards should be visually rich, expressive, and clearly state:
- project name
- one-line summary
- status badge
- short explanatory text
- CTA

### Required badges
- `Live`
- `Coming Soon`
- `Concept`
- `Prototype`
- `Archived` (future)
- `Shipped` (future)
- `In Progress` (future)

For MVP1:
- Parental Gate Lab → `Live Prototype`
- Analytics project → `Coming Soon` or `Concept`

### Parental Gate Lab card content direction
- visually strongest card
- prominent CTA
- should feel interactive and ready
- should communicate it is both useful and unusual

### Analytics card content direction
- should communicate ambition
- should hint at the future roadmap
- should not oversell
- should feel like a real concept, not filler

Suggested angle:
**A privacy-first, self-hostable analytics and crash reporting tool for mobile teams.**
Badge: `Coming Soon`
CTA: `See concept` or `Coming Soon`

---

## 6.4 Process / How Labs Works

### Purpose
Explain how projects move through Labs.

This is helpful for setting expectations and making the site feel deliberate.

### Content idea
A simple 3-step or 4-step flow:
1. Idea
2. Prototype
3. Refine
4. Graduate / Archive

### Messaging goals
Communicate:
- some experiments stay experiments
- some evolve into tools/products
- some get archived
- Labs is intentionally honest

This section also makes future expansion easier.

---

## 6.5 About the Builder / Why These Experiments Exist

### Purpose
Lightly connect Labs back to Drilon without turning it into a second portfolio.

### Content goals
Explain that Labs reflects interests across:
- mobile UX
- product strategy
- tooling
- privacy
- interaction design
- real implementation constraints

Keep this short and human.

Suggested framing:
“Labs is where I test ideas that are too experimental for the flagship and too early for standalone products.”

This should feel personal, but not resume-like.

---

## 6.6 Future Direction / More Coming Soon

### Purpose
Make it explicit that Labs is alive and will grow.

### Content goals
Communicate:
- more experiments are planned
- future entries may include tools, product concepts, and interaction studies
- this is the beginning, not the full catalog

Do not create a giant roadmap list.
Just create anticipation.

Suggested ideas:
- “More experiments are already in motion.”
- “Some will stay prototypes. Some may become real products.”
- “This is just the first drop.”

---

## 6.7 Footer

Footer should be simple and aligned with the ecosystem.

Suggested links:
- `recica.dev`
- `tools.recica.dev`
- `Parental Gate Lab`
- GitHub
- LinkedIn
- Email

Optional footer note:
`Labs by Drilon Recica — experiments, prototypes, and product explorations.`

---

# 7. Experiment Card System

## 7.1 Card anatomy

Every homepage experiment card should include:

- visual header area / illustration / accent
- status badge
- title
- one-line descriptor
- short summary paragraph
- optional meta row
- CTA button / link

### Optional meta row fields
- status
- year
- type (prototype / concept / exploration)
- domain (UX / mobile / privacy / tooling)

For MVP1, keep meta simple:
- status
- short type label

---

## 7.2 Status logic

Use a clear project lifecycle language.

### Recommended statuses
- `Concept`
- `Coming Soon`
- `In Progress`
- `Prototype`
- `Live`
- `Shipped`
- `Archived`

### MVP1 mapping
- Parental Gate Lab → `Live Prototype`
- Mobile Analytics + Crash Reporting → `Coming Soon` or `Concept`

### Future rule
Every experiment must have exactly one primary status.

---

# 8. Design Direction

## 8.1 Visual identity

Labs should have a **distinct identity** from both `recica.dev` and `tools.recica.dev`.

### Core visual character
- brighter / lighter overall than Tools
- more playful than flagship
- more expressive and visual
- editorial + experimental + indie
- still high quality and modern

### General direction
Think:
- creative lab notebook meets polished product showcase
- playful intelligence
- soft experimentation
- premium but alive

Not:
- stark enterprise dashboard
- dark hacker neon
- childish toybox
- plain portfolio grid

---

## 8.2 Light vs dark

Recommendation:
**light-first** for Labs.

User leaned toward light because it feels more like a lab, and that is a good instinct here.

### Why light-first is right
- reinforces distinct identity from Tools
- feels more “workspace / paper / prototype / notebook”
- better supports expressive visuals and colored badges
- helps Labs feel open and exploratory
- avoids blending too much with dark, developer-centric aesthetics

### Dark mode
Optional later.
Do not prioritize for MVP1 unless trivial.

---

## 8.3 Color direction

Use a custom Labs palette distinct from the flagship and tools.

### Suggested palette principles
- off-white or very soft warm background
- high-contrast dark text
- saturated accent colors for badges and highlights
- subtle color variation per project/status
- playful but controlled

### Example palette direction
Not exact locked values, but this kind of feel:
- background: warm white / soft gray
- primary text: near-black
- secondary text: slate / muted neutral
- accent 1: vivid blue
- accent 2: warm orange
- accent 3: fresh green
- accent 4: coral / pinkish red for playful energy
- accent 5: purple for future/experimental tone

Use color intentionally:
- Live = green/teal accent
- Coming Soon = amber/orange accent
- Concept = purple/indigo accent
- Archived = muted gray accent

---

## 8.4 Typography

Typography should carry personality.

### Direction
- strong headline type with character
- readable body type
- slightly editorial feel
- clear hierarchy
- enough contrast between headings and body

### Style goals
- bold, expressive headlines
- calm readable paragraphs
- strong card titles
- compact but legible metadata/badges

Avoid:
- overly playful fonts
- novelty type
- weak default-looking typography

---

## 8.5 Shape language

Labs should be more playful and expressive than flagship.

Suggested shape system:
- rounded cards
- soft corners (large radius)
- layered panels
- subtle sticker-like badge feeling
- controlled asymmetry in some visuals
- occasional outlined or skewed decorative elements

Not too much. The layout should still feel premium and intentional.

---

## 8.6 Visual motifs

Use one or two recurring motifs to build identity.

Possible motifs:
- sticky-note / card-stack cues
- blueprint/grid overlays
- playful dotted paths / connectors
- tape-like corner accents
- experiment stamps / labels
- orbit lines / prototype markers

Do **not** overdo all of them.
Pick a restrained combination.

Recommended:
- soft grid texture in hero backgrounds
- playful status badges
- subtle layered card visuals
- occasional “prototype stamp” treatment

---

# 9. Interaction and Motion

## 9.1 Motion goals
Motion should reinforce:
- experimentation
- tactility
- polish
- curiosity

### Good motion style
- subtle hover lift
- tiny tilt/parallax on cards
- soft fade/slide section reveal
- status badge transitions
- CTA microinteraction
- slightly playful route transitions if framework allows

### Avoid
- flashy bounces everywhere
- noisy motion
- overcomplicated page transitions
- gimmick animations

---

## 9.2 Card interactions
Experiment cards should feel alive.

Recommended:
- hover elevation
- slight scale/tilt
- animated accent border or background glow
- richer interaction on the featured live card
- clear clickability

---

## 9.3 Hero interactions
Hero can include:
- moving accent shapes
- subtle animated grid/dots
- light motion in decorative elements
- maybe a playful experimental cursor effect if tasteful

Only if it stays smooth and premium.

---

# 10. Copy Strategy

## 10.1 Tone rules

Copy should be:
- confident
- clever
- concise
- slightly playful
- not childish
- not vague
- not over-hyped

### Good tone
- “interesting experiments”
- “useful prototypes”
- “ideas being tested in public”
- “some may stay small, some may grow up”

### Avoid
- overexplaining architecture
- internal planning language
- startup-bro hype
- pseudo-philosophical fluff
- “look how quirky this is” energy

---

## 10.2 Copy style principles
- short punchy headlines
- one clear idea per paragraph
- concrete language over abstract branding language
- visible status language
- communicate intent and honesty

---

## 10.3 Example homepage copy directions

### Hero
Possible direction:
**Interesting experiments. Useful prototypes.**
**Labs by Drilon Recica**
A place for product experiments, interaction studies, and ideas that are too early for products but too interesting to keep private.

### Labs intro
This is where ideas get tested in public. Some stay prototypes. Some turn into real tools. All of them exist for a reason.

### Future teaser
More experiments are already in motion.

These are direction examples, not mandatory final copy.

---

# 11. SEO and Discoverability

## 11.1 SEO strategy for MVP1

Labs should be **SEO-aware but not SEO-dominated**.

This means:
- clean titles
- solid descriptions
- semantic headings
- strong internal linking
- descriptive slugs
- clear summaries
- useful content on each experiment page

Do **not** force keyword stuffing.

---

## 11.2 Metadata guidance

### Homepage title example
`Labs by Drilon Recica — Experiments, Prototypes, and Product Ideas`

### Homepage meta description example
`A curated playground of experiments, prototypes, and product explorations by Drilon Recica. Launching with Parental Gate Lab and more to come.`

### Experiment page title example
`Parental Gate Lab — Interactive Parental Gate Pattern Playground`

### Experiment meta description example
`Explore and compare parental gate patterns for apps used by children and parents. Live demos, reasoning, tradeoffs, and implementation notes.`

---

## 11.3 Social preview guidance
Every route should have:
- title
- description
- OG image later
- social-safe project summary

Even if SEO is not the main focus, this helps polish and sharing.

---

# 12. Content Model / Data Model

Even if MVP1 is small, structure content so scaling later is easy.

## 12.1 Suggested experiment data shape

Each experiment should have data like:

- `slug`
- `title`
- `shortTitle` optional
- `status`
- `type`
- `oneLiner`
- `summary`
- `featured` boolean
- `year`
- `ctaLabel`
- `ctaHref`
- `visualTheme`
- `isLive`
- `isComingSoon`
- `sortOrder`
- `homeVisibility`
- `descriptionLong` optional
- `whyItExists` optional
- `futurePotential` optional

### MVP1 experiment entries
- parental-gate-lab
- mobile-analytics-crash-reporting (teaser / concept)

---

## 12.2 Suggested status enum
Use one enum source of truth:

- `concept`
- `coming-soon`
- `in-progress`
- `prototype`
- `live`
- `shipped`
- `archived`

And map to display labels centrally.

---

# 13. Recommended Monorepo Structure

Because the user already has a monorepo with project folders, Labs should be one site under `labs/`.

## 13.1 High-level recommendation

Use:
- `labs/` as the site root for `labs.recica.dev`
- route-based structure inside that project

### Example conceptual structure
- `labs/`
  - main app/site
  - shared layout
  - homepage
  - project routes
  - content/data config
  - components
  - styles/theme
  - assets

### Project route recommendation
- homepage route
- route folder for `parental-gate-lab`
- route folder for `mobile-analytics-crash-reporting` later if desired

Do **not** create a separate deployable app per experiment at this stage.

---

## 13.2 Recommended internal organization
Suggested conceptual areas:
- app routing
- shared components
- page sections
- experiment card components
- status badge system
- homepage content config
- experiments data config
- theme tokens
- assets/illustrations

Keep the experiment metadata centralized so the homepage and route pages can both use it.

---

# 14. Homepage Section-by-Section Implementation Notes

## 14.1 Hero implementation
Must feel premium and alive.

Needs:
- strong headline hierarchy
- playful yet crisp visual treatment
- immediate CTA to Parental Gate Lab
- one secondary CTA to explore experiments
- subtle hero art or lab-like decorative system

---

## 14.2 Featured experiment implementation
Parental Gate Lab should visually dominate the section.

Suggested layout:
- one larger featured card
- one medium secondary card for coming soon analytics
- optional tiny “more coming” teaser note beneath

This makes the homepage feel active even with limited content.

---

## 14.3 About/process sections
Keep them concise and stylish.
Do not overwhelm the homepage with too much explanation.

These are support sections, not the main attraction.

---

# 15. Recommendation for Coming Soon Handling

The user wants:
- Parental Gate Lab live
- analytics/crashlytics idea visible as coming soon
- explicit signal that more is coming later

Best implementation:

### Homepage card for coming soon analytics
Show:
- strong title
- one-line value proposition
- coming soon badge
- short teaser paragraph
- disabled or soft CTA like `Coming Soon`

### Optional extra note
Use a small supportive block:
`More experiments are already in development.`

### Do not add many fake placeholders
One real live experiment + one meaningful upcoming concept is enough for MVP1.

This feels honest and polished.

---

# 16. About Section Strategy

Use a compact About/Why Labs section.

## Content it should cover
- why Labs exists
- what kinds of things belong here
- how Labs differs from portfolio and tools
- how experiments may evolve

Keep it short, visually light, and highly readable.

---

# 17. Future Scaling Strategy

## 17.1 When to add more experiments
Add more experiments only when they are good enough.

Do not publish filler to make the page look busy.

## 17.2 When to add filters/tags
Only add filters when there are enough experiments to justify them.
Recommended threshold:
- 6+ visible experiments

## 17.3 When to add archive support
Add archive support when at least one experiment becomes inactive or superseded.

## 17.4 When to add per-experiment notes/blog content
Only if Labs starts accumulating enough learning-based content.
Until then, keep experiment pages concise and project-focused.

---

# 18. Graduation Rules for Future Projects

Some Labs ideas may eventually outgrow Labs.

## Recommended policy
If a project becomes a real product:

- keep its original Labs entry as historical context
- add a clear banner or note: `This experiment evolved into X`
- link out to the new standalone destination
- do not hard-delete the Labs history unless there is a very good reason

This preserves the story of experimentation and reinforces authenticity.

---

# 19. Accessibility and Quality Requirements

Even though Labs is playful, it must still be high quality.

## Required standards
- strong color contrast
- clear button/link states
- keyboard navigable primary interactions
- semantic section structure
- accessible badges/status labels
- alt text for meaningful visuals
- reduced motion respect if animations are used
- responsive design across mobile, tablet, desktop

Labs should never feel sloppy or inaccessible just because it is experimental.

---

# 20. Responsiveness

## Mobile
The homepage must still feel rich and expressive on mobile.

Requirements:
- hero remains punchy
- cards stack cleanly
- badges remain visible
- no cluttered decorative elements
- CTA hierarchy stays obvious

## Desktop
Desktop can carry more playful layout energy:
- asymmetric compositions
- stronger visual hierarchy
- richer hover interactions
- layered card effects

---

# 21. Suggested MVP Build Order

## Phase 1 — Foundations
- set up Labs site shell
- create theme tokens and layout rules
- create nav/footer
- create homepage section skeletons
- create experiment status badge component
- create experiment card component
- establish data config for experiments

## Phase 2 — Homepage polish
- implement hero
- implement intro section
- implement featured experiments
- implement Labs process/about sections
- implement future teaser
- implement footer
- polish visuals and motion

## Phase 3 — Parental Gate Lab route integration
- link live experiment card to `/parental-gate-lab`
- ensure consistent layout/nav/back behavior

## Phase 4 — Coming soon analytics teaser
- add strong coming soon card
- optionally prepare empty concept route later

## Phase 5 — Final polish
- metadata
- social tags
- responsive QA
- interaction polish
- accessibility pass

---

# 22. MVP Success Criteria

The Labs landing page is successful if:

- it immediately feels distinct from `recica.dev` and `tools.recica.dev`
- it feels more playful/experimental without becoming messy
- Parental Gate Lab feels like a meaningful first experiment
- the coming-soon analytics idea creates anticipation, not disappointment
- the homepage looks polished even with only 1 live experiment
- visitors understand that Labs is curated and growing
- the route architecture scales cleanly

---

# 23. Anti-Goals

Do not let Labs become:

- a second portfolio
- a clone of tools
- a dark developer dashboard
- a generic project archive
- a half-empty shell with too many coming-soon cards
- an overbuilt content platform too early

Keep it:
- curated
- polished
- route-based
- expressive
- deliberate

---

# 24. Final Recommendation Summary

## Product decision
Use **one Labs site with route-based experiments**.

## Brand decision
Use **Labs by Drilon Recica** as the visible brand.

## Design decision
Make Labs **light-first**, visually expressive, playful, and distinct.

## MVP content decision
Launch with:
- one live experiment: **Parental Gate Lab**
- one visible coming-soon concept: **privacy-first mobile analytics + crash reporting**
- clear messaging that more is coming

## Structure decision
Use:
- homepage as discovery + context
- experiment routes for actual project pages

## Tone decision
Indie, playful, experimental, clever, polished.

---

# 25. Suggested Final One-Sentence Internal Brief

**Build `labs.recica.dev` as a polished, light-first, route-based experimental playground called “Labs by Drilon Recica,” launching with Parental Gate Lab as the first live prototype and a privacy-first mobile analytics + crash reporting concept as coming soon, with a playful but high-taste identity that clearly differs from both the flagship site and the tools site.**
