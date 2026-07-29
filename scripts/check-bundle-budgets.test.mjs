import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import { inspectBuild, validateBuild } from "./check-bundle-budgets.mjs";

test("inspectBuild counts gzip-compressed JavaScript and CSS only", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "bundle-budget-"));
  await mkdir(path.join(root, "assets"));
  await writeFile(
    path.join(root, "assets", "app.js"),
    "export const value = 1;\n".repeat(20),
  );
  await writeFile(
    path.join(root, "assets", "app.css"),
    ".example { color: red; }\n".repeat(20),
  );
  await writeFile(
    path.join(root, "index.html"),
    "<h1>Ignored by the bundle budget</h1>",
  );

  const result = await inspectBuild(root);

  assert.equal(result.assetCount, 2);
  assert.ok(result.gzipBytes > 0);
  assert.deepEqual(result.sourceMaps, []);
});

test("validateBuild rejects source maps and meaningful budget regressions", () => {
  assert.throws(
    () =>
      validateBuild(
        "tools",
        { gzipBytes: 90, assetCount: 2, sourceMaps: ["app.js.map"] },
        100,
      ),
    /tools.*source map/,
  );
  assert.throws(
    () =>
      validateBuild(
        "tools",
        { gzipBytes: 101, assetCount: 2, sourceMaps: [] },
        100,
      ),
    /tools.*101.*100/,
  );
  assert.doesNotThrow(() =>
    validateBuild(
      "tools",
      { gzipBytes: 100, assetCount: 2, sourceMaps: [] },
      100,
    ),
  );
});
