# PLAN.md

# Merge plan for `recica.dev` + `drilon.recica.dev` into one flagship site

## 0. Executive summary

This monorepo currently contains three separate projects:

- `recica/` → current root personal site / hub
- `drilon/` → current detailed portfolio / CV site
- `tools/` → developer tools product site

The target state is:

- `recica.dev` becomes the single public personal flagship site
- `drilon.recica.dev` is retired as a standalone public site and permanently redirects to `recica.dev`
- `tools.recica.dev` remains a standalone product site
- `labs.recica.dev` is **not launched yet** and should not be prominently exposed until it exists
- blog is also **not launched yet** and should remain hidden until there is actual content

The new `recica.dev` should be a **single-page flagship website** built primarily for:

- hiring / recruiting
- consulting / freelance credibility
- personal brand positioning
- product showcase

The site should present **Drilon Reçica** as:

> **Senior Mobile & Product Engineer**
>
> Building polished mobile apps, practical developer tools, and modern digital products.

This new site must merge the strongest parts of the old `recica.dev` and `drilon.recica.dev`, remove overlap and identity drift, and create a single strong first impression.

---

## 1. Background and reasoning

### 1.1 What exists today

#### Current `recica.dev`
Current root site positions Drilon as a broad software / frontend / creative technologist profile and acts mostly like a directory pointing to subdomains.

Observed problems:
- too thin for a flagship site
- too vague in positioning
- acts more like a hallway than a destination
- creates identity drift versus the more specific mobile/Android/Flutter positioning on `drilon.recica.dev`
- exposes placeholder/soon-style destinations that weaken perceived completeness

#### Current `drilon.recica.dev`
Current subdomain has the strongest detailed professional content. It includes:
- name and role
- hiring signal
- experience highlights
- expertise
- tech stack
- professional links
- downloadable CV

Observed strengths:
- much clearer professional positioning
- stronger proof than the root site
- more recruiter-friendly
- more useful as a hiring page

Observed problems:
- too resume-like in places
- some terminology and taxonomy are inconsistent
- some stack labels and project descriptions need refinement
- overlaps with what the root site should really be doing
- causes split attention by existing as a separate main personal destination

#### Current `tools.recica.dev`
This is a strong standalone utility/product site and should remain separate.

Observed strengths:
- useful
- concrete
- productized
- can grow over time
- good support for personal brand as a builder

This merge plan is **not** about collapsing tools into the main site. Instead, the new main site should feature tools prominently and link out to it.

### 1.2 Strategic decision

The best structure is:

- keep **one** main public personal site: `recica.dev`
- keep **one** standalone product site: `tools.recica.dev`
- redirect `drilon.recica.dev` to `recica.dev`

This is cleaner because it:
- reduces duplication
- improves clarity
- concentrates authority/traffic/links onto one main personal domain
- removes confusion about which personal page is the “real” one
- creates a more modern and deliberate web presence

---

## 2. Project goals

## 2.1 Primary goals

The merged `recica.dev` must:

1. Present a strong and immediate first impression
2. Clearly communicate Drilon’s professional identity in under 10 seconds
3. Work for multiple audiences at once without feeling unfocused
4. Showcase selected work instead of dumping a full resume on the homepage
5. Establish credibility for both employment and consulting conversations
6. Show that Drilon builds both client/company products and his own tools/products
7. Act as the single canonical personal/professional web destination

## 2.2 Audiences

The site needs to work for all of the following:

- recruiters
- hiring managers
- CTOs / engineering leads
- founders
- potential consulting clients
- developers / peers
- general visitors who follow shared links

The site must therefore balance:
- professionalism
- personality
- clarity
- proof
- strong visual taste

## 2.3 Tone and aesthetic goals

Desired tone:
- slightly creative / indie
- bold / personal
- still attractive to recruiters and developers
- premium, modern, clean
- not overly corporate
- not goofy or gimmicky
- not too artsy or experimental

Translation into implementation:
- strong typography
- clean spacing
- subtle personality in copy and layout
- restrained visual creativity
- minimal but high-quality motion
- no clutter
- no novelty-for-novelty’s-sake

---

## 3. Final target architecture

## 3.1 Public web architecture

### Canonical public destinations
- `https://recica.dev/` → only main personal site
- `https://tools.recica.dev/` → standalone tools product site

### Redirects
- `https://drilon.recica.dev/` → `301` permanent redirect to `https://recica.dev/`

### Not yet launched
- `https://labs.recica.dev/` → not linked prominently until real
- `https://blog.recica.dev/` → not linked prominently until real

## 3.2 Monorepo architecture

Suggested monorepo folder structure:

```txt
/
  recica/
    app or src...
    public/
    components/
    content/
    ...

  drilon/
    # legacy site kept only temporarily during migration or for reference
    # after migration this may either:
    # - become a tiny redirect app, or
    # - be archived/removed from deployment

  tools/
    # separate product app/site

  PLAN.md
```

### Recommendation for `drilon/` folder after migration
Prefer one of these:

#### Option A — keep only as redirect app
`drilon/` becomes a minimal redirect project that returns HTTP 301 to `https://recica.dev/`

#### Option B — archive and redirect at infrastructure level
If hosting/provider supports redirects cleanly, keep the old folder only as archived reference or remove it entirely and handle redirect in deployment config.

**Preferred:** infrastructure-level redirect + archive/remove legacy app code once migration is done.

---

## 4. Positioning and messaging

## 4.1 Final identity

Use the following consistently across the site:

### Visible name
**Drilon Reçica**

### Primary role
**Senior Mobile & Product Engineer**

### Supporting value proposition
**Building polished mobile apps, practical developer tools, and modern digital products.**

This is the main identity. It should replace older positioning that leaned too hard into:
- frontend-first identity
- creative technologist vagueness
- generic software-engineer wording

## 4.2 Why this positioning

This identity works because it covers:
- Android expertise
- Flutter expertise
- mobile architecture
- product building
- backend/product systems where relevant
- personal tools/products

It is broad enough to support multiple goals, but specific enough to be believable.

## 4.3 Messaging principles

All homepage messaging should follow these rules:

1. **Specific over generic**
   - avoid vague buzzword language
2. **Selected proof over exhaustive lists**
   - show what matters most
3. **Product-minded over resume-minded**
   - show outcomes and thinking, not just technologies
4. **Confident, not inflated**
   - no fake grandiosity
5. **Readable at speed**
   - skim-friendly for recruiters
6. **Memorable, not quirky**
   - slight edge, but no weirdness

---

## 5. Information architecture for the new `recica.dev`

The new site should be a **single-page site with anchor navigation**, not a multi-page content maze.

## 5.1 Recommended top-level sections

1. Hero
2. Proof strip
3. Selected work
4. Featured tools
5. Experience snapshot
6. How I work
7. Open to work / collaboration
8. Contact
9. Footer

## 5.2 Why one page is the right choice

A one-page flagship is ideal because:
- it reduces decision friction
- it keeps the site focused
- it works better for recruiters scanning quickly
- it avoids recreating the old split between “main site” and “CV site”
- it allows strong narrative flow

Possible future additions can still exist later if needed:
- `/cv.pdf`
- `/resume` (optional, only if needed later)
- `/uses` (optional, not necessary now)
- `/labs` later once real

For now, the homepage must do the heavy lifting.

---

## 6. Navigation plan

## 6.1 Main nav

Recommended navigation:

- Work
- Tools
- Experience
- About
- Contact

Right-side / utility actions:
- CV
- Email

### Notes
- `Work`, `Tools`, `Experience`, `About`, `Contact` should be anchor links to sections on the same page
- `CV` can link directly to the downloadable PDF
- `Email` should be a mailto link or equivalent direct contact CTA

## 6.2 Items that should NOT be in main nav yet

Do **not** include the following in the main nav right now:
- Blog
- Labs
- Writing
- Uses
- Playground

Reason: do not expose empty or weak destinations.

---

## 7. Section-by-section content plan

# 7.1 Hero section

## Purpose
The hero must explain who Drilon is and what he does within seconds.

## Must contain
- visible name: **Drilon Reçica**
- primary role: **Senior Mobile & Product Engineer**
- supporting line describing the scope of work
- 2 strong primary CTAs
- 1 secondary CTA

## Recommended content structure

### Heading
**Drilon Reçica**

### Subheading / role
**Senior Mobile & Product Engineer**

### Short intro paragraph
Suggested direction:
- builds polished mobile apps
- modernizes legacy systems
- creates practical tools and digital products
- works across Android, Flutter, product engineering, and architecture

### CTA buttons
Primary CTA options:
- **View selected work**
- **Get in touch**

Secondary CTA:
- **Explore tools**

## Tone guidance
The hero should feel:
- confident
- direct
- modern
- slightly personal
- not resume-stiff

## Do not
- mention too many technologies in the hero
- make the hero overly wordy
- use generic fluffy copy like “crafting exceptional digital experiences”
- over-index on “frontend” identity

---

# 7.2 Proof strip

## Purpose
Give credibility immediately after the hero before the user commits to deeper reading.

## Recommended items
Use 4 concise proof points. Current candidate ideas based on the old content:

- **13+ years building software**
- **Android since 2012**
- **Legacy → modern migrations**
- **0→1 product delivery & technical leadership**

Alternative/additional proof points if accurate and public-safe:
- accessibility-led product work
- enterprise/public-scale mobile products
- 1M+ Play Store downloads (only if this claim is accurate, safe, and contextually defensible)

## Format
This should be short and skimmable:
- 2x2 grid on mobile/desktop adaptation
- no long paragraphs

## Goal
A recruiter should instantly understand:
- this is not junior/mid-level work
- this person has both depth and delivery experience

---

# 7.3 Selected work section

## Purpose
This is the most important section after the hero. It must prove capability through selected case studies, not through a giant work history dump.

## Featured projects to include
The homepage should prominently feature exactly these 3 anchor projects:

1. **Deutsche Bahn – Wohin Du Willst**
2. **Qisara**
3. **EDEKA – Scan & Go**

These were explicitly chosen and should anchor the homepage.

## Why exactly 3
Three is enough to show breadth without clutter:
- one enterprise/public-scale mobility product
- one founder/product-builder case
- one retail / cross-platform / consumer product case

## Card structure for each case study
Each case study card should include:

- project title
- role
- time period
- short context sentence
- 3 concise bullets:
  - problem/challenge
  - what Drilon did
  - outcome/result/impact
- relevant tech tags (short)

## Detailed case study guidance

### Case study 1 — Deutsche Bahn – Wohin Du Willst
Use the strongest elements from the old `drilon.recica.dev` site:
- role: Senior Android Developer
- timeframe: Nov 2023 – Present (verify/update if needed)
- context: modernizing a mobility application with accessibility and scalability requirements

Potential emphasis:
- architecture migration
- accessibility / WCAG implementation
- modularization / maintainability
- public-scale reliability / modern Android practices

This should demonstrate:
- enterprise/mobile depth
- modernization skill
- architecture thinking
- accessibility maturity

### Case study 2 — Qisara
Use this as the founder / builder / product-owner case.

Potential emphasis:
- tech lead / product architect role
- 0-to-1 product thinking
- end-to-end ownership
- Flutter frontend + backend architecture
- delivery across product, architecture, business decisions

This should demonstrate:
- product engineering
- leadership
- founder-style execution
- full lifecycle ownership

### Case study 3 — EDEKA – Scan & Go
Use this as the retail / cross-platform / app experience case.

Potential emphasis:
- consumer-facing retail experience
- mobile product feature design and implementation
- barcode / payment / loyalty / physical-digital flows
- bridging user experience with operational/product constraints

This should demonstrate:
- practical product delivery
- mobile feature execution
- consumer retail app problem-solving

## Presentation approach
The homepage should show **summary cards**, not full essays.

Each card should be compact but substantive enough to say:
- what it was
- what problem mattered
- what role Drilon played
- what kind of engineering/product value he added

## If detail expansion is desired
Possible enhancement:
- cards can expand/collapse to reveal a little more detail
- but initial homepage must stay concise

## Important constraint for NDA work
Where details are confidential:
- speak in domains and constraints
- do not fabricate metrics
- do not overshare proprietary details
- keep claims concrete but safe

---

# 7.4 Featured tools section

## Purpose
Show that Drilon is not only an employee/contractor but also a builder of real products.

This section should feature `tools.recica.dev` prominently.

## What this section should do
- introduce the tools platform briefly
- show 2–3 representative tools/cards
- link clearly to `tools.recica.dev`

## Why this matters
This section gives the homepage:
- tangible product credibility
- independent builder energy
- something useful and current
- a bridge to the separate product ecosystem

## Content guidance
Suggested short intro idea:
- Practical browser-based developer tools built with a focus on speed, privacy, and usefulness.

Potential structure:
- section title: **Featured Tools**
- short sentence about local-first/privacy-first/browser-based utility approach
- three sample tool cards or examples
- CTA: **Explore all tools**

## Important note
Do not overbuild this section. It is not the main purpose of the homepage. It is a featured supporting section.

---

# 7.5 Experience snapshot section

## Purpose
Give enough career timeline context for recruiters without turning the homepage into a resume dump.

## Strategy
Use a compressed experience timeline with selected roles only.

## Recommended entries
Start with the strongest entries from the old detailed site:

- Deutsche Bahn – Wohin Du Willst
- Qisara / Deen Labs
- EDEKA – Scan & Go
- RMVGo
- easyCredit/Fymio & ErgoDirekt

Potentially also include an “Earlier experience” line if needed.

## Format per entry
- company/product
- title
- year range
- one-sentence summary

## Include links/actions
- **Download CV**
- maybe **LinkedIn**

## Important rule
This is not where the full skill matrix belongs.
This is not where dozens of bullets belong.
This section is for quick scanning.

---

# 7.6 How I work section

## Purpose
Differentiate Drilon beyond title and technology stack.

This section explains style, approach, and engineering philosophy.

## Suggested themes
Possible 4 pillars:

1. **Product-minded engineering**
   - build for actual users and business goals
2. **Modernization without overengineering**
   - move legacy systems forward pragmatically
3. **Quality through clarity**
   - maintainable architecture, readable code, scalable systems
4. **UX and developer experience both matter**
   - good products and good internal engineering are both important

## Why this section matters
It helps:
- recruiters understand seniority
- clients understand how Drilon thinks
- developers recognize maturity and taste

## Tone
Short, direct, not preachy.

---

# 7.7 Open to work / collaboration section

## Purpose
Support mixed goals without sounding unfocused.

## Recommended copy direction
Use a statement like:

> Open to senior roles, consulting, and selected product collaborations.

This covers:
- employment
- freelance/consulting
- product/building opportunities

## Secondary text ideas
Mention openness to:
- senior/staff mobile roles
- architecture modernization
- mobile product delivery
- selected consulting engagements

## Important constraint
Do not sound desperate or overly broad.
This section should feel selective and professional.

---

# 7.8 Contact section

## Purpose
Make next steps frictionless.

## Recommended contact priority
Primary contact route:
- **Email**

Secondary contact routes:
- **LinkedIn**
- **GitHub**

Optional additional links:
- X/Twitter
- Stack Overflow (only if it still adds value)

## Recommended structure
- simple heading
- short invitation sentence
- links/buttons for primary contact channels
- CV download link

## Do not
- add an unnecessary contact form unless there is a strong reason
- bury the email link
- overload the section with too many social networks

---

# 7.9 Footer

## Purpose
Simple closure and utility links.

## Recommended footer contents
- Drilon Reçica / Recica
- email
- GitHub
- LinkedIn
- tools
- CV
- copyright

Optional later:
- Labs (only when live)
- Blog (only when live)

---

## 8. Content migration plan

## 8.1 What to keep from old `drilon.recica.dev`

Keep and rewrite/adapt the following:

- name: Drilon Reçica
- role and mobile/product focus
- selected experience highlights
- strongest project summaries
- professional links
- CV download
- proof signals like Android since 2012, modernization, accessibility, technical leadership
- expertise areas, but compressed and rewritten

## 8.2 What to discard from old `drilon.recica.dev`

Remove or compress these patterns:

- overly long or repetitive tech lists
- duplicated concepts like repeated architecture terms
- generic buzzword-heavy copy
- sections that read like a resume export instead of curated positioning
- any inconsistent project/technology labeling
- overly exhaustive skill matrix content on the homepage

## 8.3 What to keep from old `recica.dev`

Keep conceptually:
- root domain as canonical flagship
- cleaner branded feel
- stronger visual identity / more editorial/main-brand energy
- explicit path to tools

## 8.4 What to discard from old `recica.dev`

Remove:
- thin directory/hub behavior
- placeholder-like subdomain exposure
- frontend/creative-technologist-heavy positioning that conflicts with the final identity
- “soon” style messaging in primary navigation/hero context

---

## 9. Visual and UX direction

## 9.1 Desired visual character

The new `recica.dev` should look like:
- premium personal portfolio
- modern product engineer site
- slightly editorial
- bold but controlled
- personal without being chaotic

## 9.2 Avoid these traps

Do not make it feel like:
- a generic developer template
- a Behance-style art portfolio
- a corporate consulting landing page
- a hacker gimmick page
- a massive resume dump

## 9.3 UX principles

1. Important content must be above the fold
2. All key sections should be obvious while scrolling
3. Mobile must feel first-class, not compressed desktop leftovers
4. CTAs should be clear and limited
5. Motion should be subtle and tasteful
6. Typography should carry much of the visual identity

## 9.4 Accessibility requirements

The site should be accessible and production-grade:
- semantic HTML
- keyboard navigable
- strong color contrast
- visible focus states
- reduced motion support if animations exist
- proper heading hierarchy
- aria labels where needed

Given Drilon’s own public accessibility experience, the site should reflect that standard.

---

## 10. Detailed component plan

This section exists so an AI coding tool can implement the page with minimal ambiguity.

## 10.1 Global layout components

- `SiteShell`
- `TopNav`
- `MobileNav`
- `SectionContainer`
- `Footer`

## 10.2 Hero components

- `HeroSection`
- `HeroHeading`
- `HeroSubheading`
- `HeroIntro`
- `HeroActions`
- `HeroMeta` (optional if needed)

## 10.3 Proof strip components

- `ProofStrip`
- `ProofItem`

## 10.4 Work section components

- `SelectedWorkSection`
- `CaseStudyGrid`
- `CaseStudyCard`
- optional `CaseStudyTagList`
- optional `CaseStudyExpandButton`

## 10.5 Tools section components

- `FeaturedToolsSection`
- `ToolPreviewCard`
- `ExternalLinkCTA`

## 10.6 Experience section components

- `ExperienceSection`
- `ExperienceList`
- `ExperienceItem`
- `DownloadCvButton`

## 10.7 About / philosophy section components

- `HowIWorkSection`
- `PrincipleCard`

## 10.8 Availability / collaboration components

- `AvailabilitySection`
- `AvailabilityCard` or `AvailabilityCallout`

## 10.9 Contact components

- `ContactSection`
- `ContactActionList`
- `SocialLinkRow`

---

## 11. Suggested homepage copy structure

This section is not final copy, but a strong implementation direction.

## 11.1 Hero copy direction

**Drilon Reçica**

**Senior Mobile & Product Engineer**

Builds polished mobile apps, modernizes legacy systems, and ships practical tools and digital products with a strong focus on quality, maintainability, and real-world use.

CTA:
- View selected work
- Get in touch
- Explore tools

## 11.2 Selected work copy direction

### Deutsche Bahn – Wohin Du Willst
Modern Android engineering for a large mobility product, focused on accessibility, architecture modernization, and long-term maintainability.

### Qisara
End-to-end product architecture and delivery for a 0-to-1 platform, spanning product decisions, Flutter implementation, and backend architecture.

### EDEKA – Scan & Go
Consumer retail app work bridging physical and digital shopping flows through fast, practical mobile experiences.

## 11.3 How I work copy direction

- Product-minded engineering over feature factory output
- Modernization without unnecessary complexity
- Maintainable architecture over trendy architecture theater
- Good UX and good developer experience should coexist

---

## 12. SEO and metadata plan

## 12.1 Canonical strategy

The canonical personal site must be:
- `https://recica.dev/`

All old `drilon.recica.dev` pages should resolve to that destination via permanent redirect.

## 12.2 Suggested homepage metadata

### Title
`Drilon Reçica — Senior Mobile & Product Engineer`

### Meta description
A concise description including:
- Android
- Flutter
- product engineering
- architecture modernization
- tools/products

Example direction:
> Drilon Reçica is a Senior Mobile & Product Engineer specializing in Android, Flutter, modern app architecture, and practical digital products.

## 12.3 Open Graph / social cards

Include:
- proper title
- proper description
- branded preview image
- canonical URL

## 12.4 Structured data

At minimum:
- `Person` schema
- social profile links
- job title
- website URL

## 12.5 Redirect SEO notes

Make sure the old `drilon.recica.dev` is not left as a duplicate accessible site.
Use proper permanent redirects.
Update all social/profile links to `recica.dev`.

---

## 13. Redirect and deployment plan

## 13.1 Redirect requirement

`drilon.recica.dev` must permanently redirect to `https://recica.dev/`.

### Why permanent redirect
Because:
- this is a permanent structural change
- link equity / references should consolidate
- users should not remain split between two personal URLs

## 13.2 Redirect options

Depending on hosting platform, implement via one of:
- provider routing config
- reverse proxy config
- platform-specific redirect rule
- minimal redirect site/app

## 13.3 Preserve CV URL if it exists publicly

If the old site linked a CV PDF, make sure the new site exposes a stable equivalent, ideally:
- `https://recica.dev/cv.pdf`

Update any references accordingly.

## 13.4 Link update checklist

After deployment, update:
- GitHub profile link
- LinkedIn website link
- X/Twitter website link
- CV/resume links
- email signature
- any public bios
- app/store/public profiles that reference the old site

---

## 14. Monorepo implementation plan

## 14.1 High-level tasks

### Task group A — content extraction
- review existing `drilon/` content
- extract strongest project summaries
- extract all public links
- extract current CV asset path
- identify inconsistent/duplicative content to drop

### Task group B — site architecture
- redesign `recica/` as flagship single-page site
- define sections, navigation, CTA layout
- remove old hub/directory behavior

### Task group C — content rewriting
- rewrite hero
- rewrite proof strip
- rewrite case studies
- compress experience section
- write “How I work” section
- rewrite availability/contact section

### Task group D — visual implementation
- update layout
- improve typography hierarchy
- ensure mobile-first responsiveness
- add subtle, tasteful motion if desired
- preserve performance and clarity

### Task group E — integration
- add strong `tools.recica.dev` section
- remove or hide blog/labs until live

### Task group F — redirect and cleanup
- redirect old subdomain
- move/retain CV asset
- update metadata and canonical
- archive/remove legacy duplicate project

---

## 15. File/content inventory checklist

The implementation agent should explicitly locate and review all of the following in the monorepo before coding the final page:

### In `drilon/`
- homepage/landing content
- project descriptions
- experience timeline
- expertise sections
- tech stack sections
- social links
- downloadable CV asset and URL
- metadata/open graph assets if reusable

### In `recica/`
- current homepage structure
- current design system/tokens/components
- typography rules
- current navigation/footer
- any current OG assets/logo marks

### In `tools/`
- public branding patterns worth matching lightly
- possible logo/color references only if useful
- do **not** tightly couple the branding if it weakens the flagship site

---

## 16. Content decisions the implementation should treat as locked

The following decisions are already made and should not be second-guessed by the AI code editor:

1. `recica.dev` is the main site
2. `drilon.recica.dev` redirects to `recica.dev`
3. `tools.recica.dev` stays separate
4. visible name should be **Drilon Reçica**
5. primary role should be **Senior Mobile & Product Engineer**
6. the site should be one main page with anchor sections
7. blog should not be launched yet
8. labs should not be prominently exposed yet
9. the featured homepage case studies should be:
   - Deutsche Bahn – Wohin Du Willst
   - Qisara
   - EDEKA – Scan & Go
10. no public headshot/photo is needed
11. primary contact route should be direct and simple; email should be prominent

---

## 17. Things the implementation should decide intelligently

The implementation agent **can** make tasteful design decisions around:
- exact spacing
- exact section backgrounds/dividers
- typography scale
- animation details
- card layout and responsiveness
- whether to use subtle gradients or editorial accents
- exact CTA styling

As long as it remains within the direction:
- premium
- bold but controlled
- modern
- slightly creative/indie
- recruiter-safe

---

## 18. Non-goals

The following are explicitly **not** goals for this phase:

- launching a blog
- launching labs publicly
- turning the site into a multi-page content platform
- exposing every project ever worked on
- publishing NDA-sensitive details
- building a massive searchable resume database
- rebuilding `tools.recica.dev`
- adding unnecessary complexity like contact forms, dark/light gimmicks, or playful easter eggs

---

## 19. Suggested rollout phases

## Phase 1 — Content + structure
Goal: get the information architecture and copy direction correct.

Deliverables:
- section order finalized
- project summaries drafted
- experience compressed
- navigation defined
- CTA structure defined

## Phase 2 — Visual redesign in `recica/`
Goal: build the real flagship homepage.

Deliverables:
- full one-page design
- responsive implementation
- polished interactions
- production-ready content hierarchy

## Phase 3 — Migration and integration
Goal: make `recica.dev` the real destination.

Deliverables:
- CV linked
- tools featured
- metadata updated
- old hub behavior removed

## Phase 4 — Redirect and cleanup
Goal: retire the old split structure.

Deliverables:
- `drilon.recica.dev` permanently redirects
- legacy references updated
- duplicate content removed or archived

## Phase 5 — Post-launch polish
Goal: sharpen trust and maintainability.

Deliverables:
- final copy polishing
- SEO cleanup
- social previews verified
- broken link pass
- accessibility pass

---

## 20. Acceptance criteria

The project is done when all of the following are true:

### Structural acceptance
- `recica.dev` is the only main personal/professional website
- `drilon.recica.dev` permanently redirects to `recica.dev`
- `tools.recica.dev` remains separate and linked from the new homepage

### Content acceptance
- the homepage clearly presents Drilon as a Senior Mobile & Product Engineer
- the homepage includes the three selected case studies
- the homepage includes a featured tools section
- the homepage includes a compressed experience section
- the homepage includes prominent contact and CV access
- blog/labs are not prominently linked unless live

### UX/design acceptance
- the site feels premium, modern, and personal without being messy
- mobile layout is first-class
- scrolling narrative feels deliberate
- the page is readable for recruiters in under 2 minutes

### Technical acceptance
- old subdomain redirects correctly
- canonical/meta data are correct
- CV link works
- links to GitHub/LinkedIn/email work
- no duplicate live personal site remains

### Quality acceptance
- no obvious buzzword spam
- no inconsistent project labeling
- no resume-dump energy on the homepage
- no placeholder/coming-soon clutter in primary experience

---

## 21. Practical implementation notes for the coding agent

1. Treat the old `drilon/` site as a **content source**, not as something to recreate pixel-for-pixel.
2. Treat the old `recica/` site as a **branding/design source**, not as the final content structure.
3. Build a **new flagship page** in `recica/` by merging and rewriting content, not by concatenating both sites.
4. Prefer **curation** over completeness.
5. Preserve all working public links and the CV.
6. Avoid adding new destinations that do not yet exist.
7. Keep the implementation maintainable and content-editable where possible.

---

## 22. Optional nice-to-haves (only after core scope is complete)

These are allowed only if the core scope is already done well:

- subtle section transitions
- tasteful motion on load/scroll
- case study micro-interactions
- downloadable PDF CV button with nice affordance
- simple “currently exploring / labs coming soon” note near footer
- lightweight command-menu feel for navigation only if it genuinely improves UX

Do not let nice-to-haves distract from core clarity.

---

## 23. Final summary for the implementation agent

Build a new `recica.dev` as a **single-page flagship personal/professional site** for **Drilon Reçica**, positioned as a **Senior Mobile & Product Engineer**.

Merge the strongest content from the old `drilon.recica.dev` and the old `recica.dev`, but do **not** preserve their old structures. The new site should be more curated, more product-minded, more visually confident, and more coherent.

The final homepage must include:
- a strong hero
- immediate proof of experience
- three selected case studies:
  - Deutsche Bahn – Wohin Du Willst
  - Qisara
  - EDEKA – Scan & Go
- a featured tools section pointing to `tools.recica.dev`
- a compressed experience snapshot
- a short “How I work”/approach section
- a selective availability/collaboration section
- clear contact methods and CV access

Then retire `drilon.recica.dev` as a public site and redirect it permanently to `recica.dev`.

The final result should feel like one confident, modern, premium personal flagship site with a clear professional identity and no split-brand confusion.
