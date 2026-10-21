import { defineConfig, devices } from '@playwright/test'

// One seam: the built site served over HTTP. Without BASE_URL the suite
// starts `astro preview` on the local build; with BASE_URL it runs against
// that deployment (for example production after a deploy) and starts nothing.
const baseURL = process.env['BASE_URL'] ?? 'http://127.0.0.1:4321'
const external = process.env['BASE_URL'] !== undefined
const ci = process.env['CI'] !== undefined

export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  forbidOnly: ci,
  reporter: ci ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
  webServer: external
    ? []
    : [{ command: 'pnpm preview', url: baseURL, reuseExistingServer: !ci }],
})
