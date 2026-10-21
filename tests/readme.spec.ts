import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

// README.md keeps a copy of the BibTeX entry for readers of the repository.
// The copy is compared with what the page serves, so editing the entry in the
// facts module without updating the README fails here.
test('the README cites the paper with the BibTeX entry the page serves', async ({ page }) => {
  const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8')
  const entries = [...readme.matchAll(/^```bibtex\n([\s\S]*?)\n```$/gm)].map((match) => match[1])
  expect(entries).toHaveLength(1)
  await page.goto('/')
  expect(entries[0]).toBe(await page.locator('section#cite pre').innerText())
})
