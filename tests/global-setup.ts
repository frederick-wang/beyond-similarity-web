import { readFileSync } from 'node:fs'
import type { FullConfig } from '@playwright/test'

/**
 * Runs after the preview server is up and before any test, for local runs
 * only (playwright.config.ts skips it when BASE_URL targets a deployment). It
 * checks that the server serves this checkout's build: two worktrees started
 * on the same port at the same moment can both pass the free-port check, and
 * the later one would otherwise test the earlier one's build.
 */
export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use.baseURL
  if (baseURL === undefined) {
    throw new Error('playwright.config.ts must set use.baseURL')
  }
  const local = readFileSync(new URL('../dist/build.json', import.meta.url), 'utf8')
  const response = await fetch(new URL('build.json', baseURL))
  if (!response.ok) {
    throw new Error(`The server at ${baseURL} answered HTTP ${response.status} for build.json; it is not serving this checkout's dist/.`)
  }
  const served = await response.text()
  if (served !== local) {
    throw new Error(
      [
        `The server at ${baseURL} is serving a different build. Is another worktree using the same PREVIEW_PORT?`,
        `  this checkout: ${oneLine(local)}`,
        `  served:        ${oneLine(served)}`,
      ].join('\n'),
    )
  }
}

function oneLine(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}
