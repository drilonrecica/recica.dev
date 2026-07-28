# 02 — Target Architecture

## 1. Repository architecture

The repository remains a collection of three independent applications:

```text
recica.dev repository
├── recica/   Astro static flagship
├── tools/    SvelteKit static browser tools
├── labs/     SvelteKit static experiments
├── docs/     repository documentation
├── scripts/  cross-app validation helpers
└── Makefile  thin orchestration layer
```

There is no shared application runtime and no root package workspace.

Each app owns:

- its package manifest
- its pnpm lockfile
- its framework configuration
- its tests
- its deployment build context
- its application documentation

The repository owns common policy through:

- `AGENTS.md`
- modernization documents
- root scripts
- CI workflows
- aligned quality commands
- aligned Node and pnpm version requirements

---

## 2. Production topology

```text
User
  |
  v
Cloudflare proxy/CDN
  |
  v
Coolify Caddy reverse proxy on Hetzner
  |
  +---------------------+---------------------+
  |                     |                     |
  v                     v                     v
recica resource       tools resource        labs resource
Nixpacks static       Docker static         Docker static
generated server      unprivileged Nginx    unprivileged Nginx
  |                     |                     |
  v                     v                     v
Astro dist/            SvelteKit build/      SvelteKit build/
```

No public Node application process remains for Tools or Labs.

---

## 3. `recica` target

### Framework

Keep:

- Astro
- TypeScript strict mode
- Tailwind CSS 4 plus existing custom CSS
- self-hosted fonts
- static sitemap integration
- Playwright and axe checks

### Package manager

Change:

- remove `package-lock.json`
- add `pnpm-lock.yaml`
- pin pnpm 11 in `recica/package.json`
- add Node 24 engine policy
- update documentation and root Makefile commands

Do not add a runtime server.

### Deployment

Keep:

- Coolify Nixpacks
- base directory: `recica`
- static-site option: enabled
- build command: `pnpm build`
- publish directory: `dist`
- production domain: `https://recica.dev`

Set the Coolify build environment to Node 24 LTS.

### Canonical and preview behavior

Production canonical remains hardcoded to `https://recica.dev`.

Add a build-time indexing flag shared conceptually across all apps:

- production: indexing enabled
- preview: indexing disabled

Preview builds should still point canonicals to the production domain while emitting `noindex, nofollow`.

---

## 4. `tools` target

### Framework/runtime

Keep:

- SvelteKit
- Svelte 5
- TypeScript
- route-specific components
- explicit pure tool logic
- Vitest
- Playwright
- existing minimal runtime dependencies

Replace:

- `@sveltejs/adapter-node` with `@sveltejs/adapter-static`
- Node server output with static output
- `hooks.server.ts` response behavior with static CSP configuration plus web-server headers
- runtime request-origin logic with deterministic build-time canonical logic
- runtime health endpoint with static-server health behavior

### Static adapter

Target shape:

```js
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      strict: true
    })
  }
};

export default config;
```

The exact CSP configuration should be added to the same SvelteKit configuration after testing.

Do not set a SPA fallback.

Add a root layout module such as:

```ts
export const prerender = true;
```

All public routes and endpoints must be included in the generated build.

### Canonical and indexing model

Production origin:

```text
https://tools.recica.dev
```

Use a build-time public variable only where useful for local tests:

```text
PUBLIC_SITE_URL
PUBLIC_INDEXING_ENABLED
```

Rules:

- fallback origin is the fixed production origin, not request origin
- invalid build-time origins fail or fall back to the production origin
- production builds are indexable
- preview builds are noindex
- canonical links always resolve to the production domain
- Open Graph URLs and JSON-LD use the canonical domain

### Robots and sitemap

Keep route-generated machine endpoints if they can be prerendered deterministically.

Requirements:

- `robots.txt` must be static output
- `sitemap.xml` must be static output
- remove request-dependent generation
- do not write a deployment date as `lastmod` for every URL
- use a genuine per-page substantive modification date or omit `lastmod`
- use one URL per canonical page
- do not include health, preview, search-state, or non-public routes

Recommended sitemap content:

- `<loc>`
- optional truthful `<lastmod>`

`changefreq` and `priority` may be omitted; they are not a substitute for content quality.

### Static container

Use a two-stage Dockerfile:

1. Node 24 LTS builder
2. unprivileged static web-server runtime

The runtime image must contain:

- generated `build/`
- static web-server configuration
- no Node binary requirement for the app
- no application `node_modules`
- no pnpm
- no source files
- no build tools

Recommended runtime family:

```text
nginxinc/nginx-unprivileged:stable-alpine
```

Pin a tested immutable digest when operationally practical and let dependency automation propose updates.

Use port `8080` unless the chosen image/configuration uses a different unprivileged port.

### Static server behavior

The configuration must:

- serve generated assets
- resolve clean routes correctly
- return a real 404 status for unknown routes
- use a generated branded 404 document where available
- expose `/health` as plain text or configure Coolify to check `/`
- apply security headers
- apply cache policy
- avoid an SPA catch-all returning `200`

Conceptual routing:

```nginx
location / {
    try_files $uri $uri.html $uri/ =404;
}

error_page 404 /404.html;
```

Validate the exact generated path structure before finalizing `try_files`.

### Offline support

After the static migration:

- add a native SvelteKit service worker
- precache fingerprinted application assets
- cache public route documents conservatively
- remove obsolete caches on activation
- never cache tool input/output
- do not cache non-GET requests
- do not create an install-prompt campaign

---

## 5. `labs` target

Labs uses the same static deployment pattern as Tools, except:

- offline support is not required by default
- performance budgets may allow larger route-specific experiment bundles
- each experiment may use a different internal client architecture
- a future server-backed experiment requires a new decision record

Production origin:

```text
https://labs.recica.dev
```

The Labs landing page and current experiments must be fully prerendered.

A future experiment needing a server should normally become:

- a separately deployed service
- a separately routed subdomain or reverse-proxy path
- or a deliberate Labs runtime migration documented by an ADR

Do not add a dormant backend "for future flexibility."

---

## 6. Security-header architecture

### Why the current server hook cannot remain authoritative

`tools/src/hooks.server.ts` and `labs/src/hooks.server.ts` execute only in a SvelteKit server runtime.

After static conversion:

- no SvelteKit server handles requests
- server hooks cannot attach response headers
- security policy must be split between build output and the static web server/proxy

### Target CSP approach

Use SvelteKit CSP hash mode for generated inline script/style content where compatible.

SvelteKit can place CSP into prerendered pages using a `<meta http-equiv>` policy and add hashes for generated inline content.

Important limitation:

- `frame-ancestors` is ignored in meta CSP
- reporting directives are also ineffective in meta CSP

Therefore:

1. use SvelteKit hash-based CSP for fetch/script/style directives
2. use the static server's HTTP header for `frame-ancestors 'none'`
3. add defense-in-depth headers at the static server
4. test every tool and experiment

Target principles:

- no `unsafe-eval`
- remove `unsafe-inline` from `script-src`
- keep only narrowly required style exceptions
- `default-src 'self'`
- `base-uri 'self'`
- `object-src 'none'`
- `form-action 'self'`
- `img-src 'self' data: blob:`
- `font-src 'self' data:`
- `connect-src 'self'`
- `worker-src 'self'` for the Tools service worker
- no third-party frame origins
- `frame-ancestors 'none'` as an HTTP header

The HTML preview tool and any Svelte transitions must be explicitly tested before tightening style/frame directives.

### Additional headers

Static server:

- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` as legacy defense in depth
- `Permissions-Policy` denying unused powerful features
- `Cross-Origin-Opener-Policy: same-origin` if validated against all features
- `Strict-Transport-Security` only after confirming all relevant domains are HTTPS and deciding which layer owns HSTS

Avoid setting contradictory duplicate policies across Nginx, Caddy, and Cloudflare.

Pick one authoritative layer per header and verify the final production response.

---

## 7. Caching architecture

### Fingerprinted SvelteKit assets

For `/_app/immutable/`:

```text
Cache-Control: public, max-age=31536000, immutable
```

### HTML and machine endpoints

Use revalidation-friendly caching:

```text
Cache-Control: public, max-age=0, must-revalidate
```

A small edge TTL is acceptable if deployment purging is reliable, but HTML must not be cached permanently.

### Other static assets

- hashed assets: long immutable cache
- stable named assets: shorter cache with revalidation
- `robots.txt`, `sitemap.xml`, manifest: short cache or revalidation
- health endpoint: no store or very short cache

Cloudflare should respect or deliberately override origin policy. Avoid blanket "cache everything" rules without tested purge behavior.

---

## 8. Privacy and data flow

### Tools

```text
user input
   |
   v
browser memory
   |
   v
local TypeScript/JavaScript operation
   |
   v
browser-rendered result
```

No server or third-party hop exists.

Permitted storage:

- theme
- favorites
- harmless display preferences

Forbidden storage:

- input
- output
- decoded JWTs
- environment variables
- hashes or hash inputs
- generated passwords
- clipboard history
- recent files

### Labs

Current experiments use local deterministic state.

Any future data persistence requires:

- data classification
- retention policy
- threat model
- privacy disclosure
- architecture decision
- human approval

---

## 9. Resource model

After migration, Tools and Labs runtime resource usage should be dominated by the static web server rather than a Node application.

Suggested initial Coolify runtime limits for each static app:

- memory reservation/limit: begin around 64–128 MiB
- CPU: begin around 0.25 core
- no persistent volume
- no database
- no runtime secret
- one replica unless availability requirements change

Measure actual usage before enforcing very tight limits.

Build resource requirements are separate from runtime resource requirements.

---

## 10. Package and dependency architecture

Each app's `package.json` should include:

```json
{
  "packageManager": "pnpm@11.17.0",
  "engines": {
    "node": ">=24 <25",
    "pnpm": ">=11 <12"
  }
}
```

Re-verify the exact latest stable pnpm 11 release before implementation. If a newer stable pnpm 11 exists, pin that exact version consistently.

Rules:

- no caret for `packageManager`
- lockfiles committed
- `pnpm install --frozen-lockfile` in CI/builds
- dependency updates through one automation system
- major framework upgrades reviewed separately
- no duplicate dependency automation systems
- no production dependency for a build-time-only concern

---

## 11. Architecture decision trigger for future changes

Create a new ADR before:

- adding a server to Labs
- adding remote processing to Tools
- adding authentication
- adding a database
- adding third-party analytics
- introducing shared packages/workspace coupling
- adding external scripts
- changing canonical domains
- changing the privacy guarantee
- exceeding performance budgets permanently
