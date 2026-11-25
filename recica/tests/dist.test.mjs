/**
 * Post-build checks of dist/ against the Caddyfile that serves it in
 * production. Run after a build: `pnpm build && pnpm test:dist`.
 *
 * The important one keeps the Content-Security-Policy in sync with the build:
 * script-src must list exactly the SHA-256 hashes of the inline scripts Astro
 * emits. When it does not, the failure message prints the list to paste.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const caddyfile = readFileSync(path.join(root, "Caddyfile"), "utf8");

// Self-hosted GoatCounter: PUBLIC_ANALYTICS_HOST in the production resource.
const ANALYTICS_ORIGIN = "https://gc.recica.dev";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const file = path.join(dir, name);
    return statSync(file).isDirectory() ? walk(file) : [file];
  });
}

const htmlFiles = () => walk(dist).filter((file) => file.endsWith(".html"));

function csp() {
  const value = caddyfile.match(/Content-Security-Policy "([^"]+)"/)?.[1];
  assert.ok(value, "Caddyfile sets Content-Security-Policy");
  const directives = Object.fromEntries(
    value
      .split(";")
      .map((directive) => directive.trim().split(/\s+/))
      .filter((parts) => parts[0])
      .map(([name, ...sources]) => [name, sources]),
  );
  return { value, directives };
}

test("dist/ exists (run `pnpm build` first)", () => {
  assert.ok(existsSync(path.join(dist, "index.html")), "dist/index.html");
  assert.ok(existsSync(path.join(dist, "404.html")), "dist/404.html");
});

test("Caddyfile: security headers apply to pages and to error responses", () => {
  const expected = [
    'X-Content-Type-Options "nosniff"',
    'X-Frame-Options "DENY"',
    'Referrer-Policy "strict-origin-when-cross-origin"',
    'Cross-Origin-Opener-Policy "same-origin"',
    'Strict-Transport-Security "max-age=31536000"',
    "Permissions-Policy",
    "-Server",
  ];
  for (const header of expected) {
    assert.ok(caddyfile.includes(header), `Caddyfile sets ${header}`);
  }
  // A year, without includeSubDomains or preload: both are hard to undo.
  const hsts = caddyfile.match(/Strict-Transport-Security "([^"]+)"/)?.[1];
  assert.equal(hsts, "max-age=31536000");
  // The snippet is imported once in the main route and once in handle_errors.
  assert.equal((caddyfile.match(/^\s*import security$/gm) ?? []).length, 2);
});

test("Caddyfile CSP: first party plus the GoatCounter origin only", () => {
  const { value, directives } = csp();
  assert.deepEqual(directives["default-src"], ["'self'"]);
  assert.deepEqual(directives["style-src"], ["'self'", "'unsafe-inline'"]);
  assert.deepEqual(directives["img-src"], [
    "'self'",
    "data:",
    ANALYTICS_ORIGIN,
  ]);
  assert.deepEqual(directives["font-src"], ["'self'"]);
  assert.deepEqual(directives["connect-src"], ["'self'", ANALYTICS_ORIGIN]);
  assert.deepEqual(directives["object-src"], ["'none'"]);
  assert.deepEqual(directives["base-uri"], ["'self'"]);
  assert.deepEqual(directives["form-action"], ["'none'"]);
  assert.deepEqual(directives["frame-ancestors"], ["'none'"]);
  assert.ok("upgrade-insecure-requests" in directives);
  const origins = new Set(value.match(/https?:\/\/[^\s;]+/g) ?? []);
  assert.deepEqual([...origins], [ANALYTICS_ORIGIN], "no other origins");
  assert.doesNotMatch(value, /\*/, "no wildcards");
});

test("Caddyfile CSP: script-src is 'self', GoatCounter and exactly the built inline scripts by hash", () => {
  const scriptSrc = csp().directives["script-src"];
  assert.ok(scriptSrc, "script-src present");
  assert.ok(
    !scriptSrc.includes("'unsafe-inline'"),
    "no 'unsafe-inline' for scripts",
  );
  // Every executable inline script on every page (JSON-LD is data, not script).
  const hashes = new Set();
  for (const file of htmlFiles()) {
    const html = readFileSync(file, "utf8");
    for (const [, tag, body] of html.matchAll(
      /<script\b([^>]*)>([\s\S]*?)<\/script>/g,
    )) {
      if (/\bsrc=|type="application\/ld\+json"/.test(tag)) continue;
      const digest = createHash("sha256").update(body, "utf8").digest("base64");
      hashes.add(`'sha256-${digest}'`);
    }
  }
  const expected = ["'self'", ANALYTICS_ORIGIN, ...[...hashes].sort()];
  assert.deepEqual(
    [...scriptSrc].sort(),
    [...expected].sort(),
    `Caddyfile script-src should be: ${expected.join(" ")}`,
  );
});

test("every script, stylesheet and image in dist/ is first party or GoatCounter", () => {
  const { directives } = csp();
  for (const file of htmlFiles()) {
    const html = readFileSync(file, "utf8");
    const name = path.relative(dist, file);
    for (const [, src] of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) {
      if (src.startsWith("/")) continue;
      assert.equal(
        new URL(src).origin,
        ANALYTICS_ORIGIN,
        `${name}: script ${src}`,
      );
      assert.ok(directives["script-src"].includes(ANALYTICS_ORIGIN));
    }
    for (const [, endpoint] of html.matchAll(/data-goatcounter="([^"]+)"/g)) {
      assert.equal(
        new URL(endpoint).origin,
        ANALYTICS_ORIGIN,
        `${name}: count endpoint`,
      );
    }
    for (const [, href] of html.matchAll(/<link\b[^>]*\bhref="([^"]+)"/g)) {
      assert.ok(
        !/^https?:/.test(href) || href.startsWith("https://recica.dev"),
        `${name}: link ${href}`,
      );
    }
    for (const [, src] of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
      assert.ok(!/^https?:/.test(src), `${name}: external image ${src}`);
    }
    assert.doesNotMatch(
      html,
      /rel="preconnect"|rel="dns-prefetch"/,
      `${name}: no preconnects`,
    );
  }
});
