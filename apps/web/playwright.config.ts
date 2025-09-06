import type { PlaywrightTestConfig } from "@playwright/test"

const PORT = Number(process.env.PORT ?? 3001)
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  timeout: 60_000,
  expect: { timeout: 5_000 },
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: BASE_URL,
    viewport: { width: 1280, height: 800 },
    trace: "on-first-retry",
  },
  webServer: {
    command: "pnpm dev",
    cwd: "..\\..", // repo root has a dev script that filters to web
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
    env: { PORT: String(PORT) },
  },
  reporter: process.env.CI
    ? [["html", { outputFolder: "./playwright-report", open: "never" }], ["list"]]
    : [["list"]],
}

export default config
