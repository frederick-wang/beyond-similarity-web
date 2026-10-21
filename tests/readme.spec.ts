import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'
import { attributeValues, only } from './head'
import { normalize } from './paper-literals'

// README.md restates the paper's title, authors, links, numbers and BibTeX
// entry for readers of the repository. It cannot import the facts module, so
// each restated fact is compared with what the page serves.
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8')

/** The README and the page's link row use the same label for the Explorer. */
const explorerLabel = 'Explorer (in Chinese)'

/** The README up to a level-2 heading. */
function readmeBefore(heading: string): string {
  const end = readme.indexOf(`\n## ${heading}\n`)
  if (end === -1) {
    throw new Error(`README.md has no "## ${heading}" section`)
  }
  return readme.slice(0, end)
}

/** The address in the README's link list item that starts with the label. */
function readmeLink(label: string): string {
  const item = readme.split('\n').find((line) => line.startsWith(`- ${label}`))
  const address = item === undefined ? undefined : /<(https?:\/\/[^>]+)>$/.exec(item)?.[1]
  if (address === undefined) {
    throw new Error(`README.md lists no "${label}" link`)
  }
  return address
}

/** Numbers as prose writes them: 12, 2,533, 55.9%. */
function numbers(text: string): string[] {
  return text.match(/\d+(?:[.,]\d+)*%?/g) ?? []
}

test.describe('README', () => {
  test('carries the title the page shows', async ({ page }) => {
    await page.goto('/')
    expect(/^# (.+)$/m.exec(readme)?.[1]).toBe(normalize(await page.locator('h1').innerText()))
  })

  test('names the authors the page lists, in their order', async ({ page }) => {
    await page.goto('/')
    const names = (await page.locator('[data-author-name]').allInnerTexts()).map(normalize)
    const list = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(names)
    expect(readmeBefore('The paper')).toContain(`by ${list}.`)
  })

  test('gives the site address the page declares as canonical', async ({ page }) => {
    await page.goto('/')
    expect(readmeLink('Paper page')).toBe(only(await attributeValues(page, 'link[rel="canonical"]', 'href'), 'canonical link'))
  })

  test('gives the address the Chinese page declares as canonical', async ({ page }) => {
    await page.goto('/zh/')
    expect(readmeLink('中文页 / Chinese page')).toBe(only(await attributeValues(page, 'link[rel="canonical"]', 'href'), 'canonical link'))
  })

  test('links to the arXiv record the page links to', async ({ page }) => {
    await page.goto('/')
    const served = await page.locator('[data-links] a[href^="https://arxiv.org/abs/"]').getAttribute('href')
    expect(readmeLink('arXiv record')).toBe(served)
  })

  test('links to the Explorer the page links to', async ({ page }) => {
    await page.goto('/')
    const served = await page.locator('[data-links]').getByRole('link', { name: explorerLabel }).getAttribute('href')
    expect(readmeLink(explorerLabel)).toBe(served)
  })

  test('states only numbers that the page states', async ({ page }) => {
    await page.goto('/')
    const served = new Set(numbers(await page.locator('main').innerText()))
    // Everything before the Cite section is prose about the paper; link
    // targets carry digits that are not stated numbers.
    const stated = numbers(readmeBefore('Cite').replace(/<https?:\/\/[^>]+>/g, ''))
    expect(stated.length).toBeGreaterThan(0)
    expect(stated.filter((number) => !served.has(number))).toEqual([])
  })

  test('cites the paper with the BibTeX entry the page serves', async ({ page }) => {
    const entries = [...readme.matchAll(/^```bibtex\n([\s\S]*?)\n```$/gm)].map((match) => match[1])
    expect(entries).toHaveLength(1)
    await page.goto('/')
    expect(entries[0]).toBe(await page.locator('section#cite pre').innerText())
  })
})
