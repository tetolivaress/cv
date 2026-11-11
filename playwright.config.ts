import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

/**
 * E2E + screenshot tests run against the static export in /out
 * (run `pnpm build` first). Screenshots land in /screenshots.
 */
export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: [["list"]],
  timeout: 60_000,
  // The 3D view runs on the software rasterizer in headless runs, which keeps the main thread busy.
  expect: { timeout: 15_000 },
  use: {
    baseURL: `http://localhost:${PORT}`,
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: `pnpm exec serve out -l ${PORT} --no-clipboard`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
