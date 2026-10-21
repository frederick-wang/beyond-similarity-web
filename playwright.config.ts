import { defineConfig, devices } from '@playwright/test'

// One seam: the built site served over HTTP. Without BASE_URL the suite
// starts `astro preview` on this checkout's build; with BASE_URL it runs
// against that deployment (for example production after a deploy) and starts
// nothing.
//
// The preview server is never reused: in parallel worktrees a server already
// listening on the port belongs to another checkout, and reusing it would test
// the wrong site. Give each worktree its own PREVIEW_PORT; a port in use makes
// the run fail instead.
//
// `--ignore-lock` keeps the server in the foreground so Playwright owns and
// stops it. Without it, Astro 7.3 moves `astro preview` to the background when
// it detects an AI coding agent (the `am-i-vibing` check in astro/dist/cli):
// the parent exits at once, Playwright reports "exited early", and the
// detached server keeps the port. CI has no agent, which is why it never
// showed there.
const port = process.env['PREVIEW_PORT'] ?? '4321'
if (!/^\d{2,5}$/.test(port) || Number(port) > 65535) {
  throw new Error(`PREVIEW_PORT must be a TCP port number, got "${port}"`)
}
const baseURL = process.env['BASE_URL'] ?? `http://127.0.0.1:${port}`
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
    : [{ command: `pnpm exec astro preview --ignore-lock --host 127.0.0.1 --port ${port}`, url: baseURL, reuseExistingServer: false }],
})
