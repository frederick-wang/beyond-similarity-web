import { readFileSync } from 'node:fs'
import type { FullConfig } from '@playwright/test'

/**
 * Runs after the preview server is up and before any test. It checks that the
 * server serves this checkout's build: two worktrees started on the same port
 * at the same moment can both pass the free-port check, and the later one
 * would otherwise test the earlier one's build. With BASE_URL set the suite
 * tests a deployment on purpose, so the check does not apply.
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
  if (process.env['BASE_URL'] !== undefined) {
    return
  }
  const baseURL = config.projects[0]?.use.baseURL
  if (baseURL === undefined) {
    throw new Error('playwright.config.ts must set use.baseURL')
  }
  const local = readFileSync(new URL('../dist/build.json', import.meta.url), 'utf8')
  const response = await fetch(new URL('build.json', baseURL))
  const served = response.ok ? await response.text() : `HTTP ${response.status}`
  if (served !== local) {
    throw new Error(`The server at ${baseURL} is not serving this checkout's dist/ (build.json differs). Is another worktree using the same PREVIEW_PORT?`)
  }
}
