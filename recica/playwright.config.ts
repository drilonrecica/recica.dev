import { fileURLToPath } from "node:url";

import { defineConfig } from "@playwright/test";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: "**/*.e2e.ts",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
  },
  webServer: {
    command:
      "./node_modules/.bin/astro build && ./node_modules/.bin/astro preview --host 127.0.0.1 --port 4173",
    cwd: projectRoot,
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
