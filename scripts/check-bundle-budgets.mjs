import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const defaultBudgetPath = path.join(
  repositoryRoot,
  "docs",
  "modernization",
  "bundle-budgets.json",
);

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
    }),
  );

  return files.flat();
}

export async function inspectBuild(directory) {
  const files = await listFiles(directory);
  const sourceMaps = files.filter((file) => file.endsWith(".map"));
  const assets = files.filter(
    (file) => file.endsWith(".js") || file.endsWith(".css"),
  );
  const gzipBytes = (
    await Promise.all(
      assets.map(async (file) => gzipSync(await readFile(file)).byteLength),
    )
  ).reduce((total, size) => total + size, 0);

  return {
    assetCount: assets.length,
    gzipBytes,
    sourceMaps: sourceMaps.map((file) => path.relative(directory, file)),
  };
}

export function validateBuild(app, result, maximumGzipBytes) {
  if (result.sourceMaps.length > 0) {
    throw new Error(
      `${app} contains public source map files: ${result.sourceMaps.join(", ")}`,
    );
  }

  if (result.gzipBytes > maximumGzipBytes) {
    throw new Error(
      `${app} compressed JS/CSS is ${result.gzipBytes} bytes; budget is ${maximumGzipBytes} bytes`,
    );
  }
}

async function main() {
  const budgetPath = process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : defaultBudgetPath;
  const config = JSON.parse(await readFile(budgetPath, "utf8"));

  for (const [app, budget] of Object.entries(config.apps)) {
    const buildDirectory = path.resolve(repositoryRoot, budget.output);
    const result = await inspectBuild(buildDirectory);
    validateBuild(app, result, budget.maxGzipBytes);
    const percent = ((result.gzipBytes / budget.maxGzipBytes) * 100).toFixed(1);

    console.log(
      `${app}: ${result.gzipBytes}/${budget.maxGzipBytes} gzip bytes (${percent}%, ${result.assetCount} assets)`,
    );
  }
}

const isDirectExecution =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
