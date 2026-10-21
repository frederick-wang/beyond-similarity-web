import { defineConfig, devices } from '@playwright/test'

// One seam: the built site served over HTTP. Without BASE_URL the suite
// starts `astro preview` on this checkout's build; with BASE_URL it runs
// against that deployment (for example production after a deploy) and starts
// nothing.
const host = '127.0.0.1'
const defaultPort = 4321

function previewPort(): number {
  const raw = process.env['PREVIEW_PORT']
  if (raw === undefined) {
    return defaultPort
  }
  const port = /^\d+$/.test(raw) ? Number(raw) : Number.NaN
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`PREVIEW_PORT must be a TCP port number from 1 to 65535, got "${raw}"`)
  }
  return port
}

const port = previewPort()
const baseURL = process.env['BASE_URL'] ?? `http://${host}:${port}`
const external = process.env['BASE_URL'] !== undefined
const ci = process.env['CI'] !== undefined

export default defineConfig({
  testDir: 'tests',
  globalSetup: './tests/global-setup.ts',
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
    : [
        {
          // --ignore-lock keeps the server in the foreground, owned and stopped
          // by Playwright. Astro otherwise backgrounds `astro preview` when it
          // detects an AI coding agent (withastro/astro#17903): the command
          // exits at once and the detached server keeps the port.
          command: `pnpm exec astro preview --ignore-lock --host ${host} --port ${port}`,
          url: baseURL,
          // A server already on the port may belong to another worktree, and
          // reusing it would test the wrong build, so a busy port fails the run.
          // tests/global-setup.ts also checks that the server serves this build.
          reuseExistingServer: false,
        },
      ],
})
