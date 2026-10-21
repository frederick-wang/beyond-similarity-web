import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { attributeValues, only } from './head'
import { multiDigitNumbers } from './numbers'
import { ABSTRACT, MARKDOWN_VERSIONS, PAGE_TEXT, SITE, normalize } from './paper-literals'

// Each language page's Markdown version, read as served. Expected values come
// from the paper, the SPEC, or the HTML page the Markdown renders.

/** A Markdown document as served; anything other than a 200 Markdown response fails. */
async function fetchMarkdown(request: APIRequestContext, path: string): Promise<string> {
  const response = await request.get(path)
  expect(response.status(), path).toBe(200)
  expect(response.headers()['content-type'], path).toMatch(/^text\/markdown/)
  return response.text()
}

/** The document's blocks: runs of lines between blank lines, a fenced code block kept whole. */
function blocks(markdown: string): string[] {
  const found: string[] = []
  let current: string[] = []
  let fenced = false
  for (const line of markdown.split('\n')) {
    if (line.startsWith('```')) {
      fenced = !fenced
    }
    if (line === '' && !fenced) {
      if (current.length > 0) {
        found.push(current.join('\n'))
      }
      current = []
    } else {
      current.push(line)
    }
  }
  if (current.length > 0) {
    found.push(current.join('\n'))
  }
  return found
}

/** The block after the one that equals `block`, which must occur once. */
function blockAfter(all: readonly string[], block: string): string {
  const index = all.indexOf(block)
  const next = all[index + 1]
  if (index === -1 || all.indexOf(block, index + 1) !== -1 || next === undefined) {
    throw new Error(`Expected one block "${block}" followed by another`)
  }
  return next
}

/** The BibTeX entries in fenced bibtex blocks. */
function bibtexEntries(markdown: string): string[] {
  return [...markdown.matchAll(/^```bibtex\n([\s\S]*?)\n```$/gm)].map((match) => match[1] ?? '')
}

/** Each GFM table's rows, the delimiter row left out, as cell text without escapes, code spans or emphasis. */
function markdownTables(markdown: string): string[][][] {
  return blocks(markdown)
    .filter((block) => block.split('\n').every((line) => line.startsWith('|')))
    .map((table) =>
      table
        .split('\n')
        .map((line) =>
          line
            .replace(/^\|/, '')
            .replace(/\|$/, '')
            .split(/(?<!\\)\|/)
            .map((cell) =>
              cell
                .trim()
                .replaceAll('\\|', '|')
                .replace(/`([^`]+)`/g, '$1')
                .replace(/\*([^*]+)\*/g, '$1'),
            ),
        )
        .filter((cells) => !cells.every((cell) => /^:?-{3,}:?$/.test(cell))),
    )
}

/** Each table of the page's main content, row by row, as each cell's text. */
async function htmlTables(page: Page): Promise<string[][][]> {
  return page
    .locator('main table')
    .evaluateAll((tables) =>
      tables.map((table) =>
        Array.from(table.querySelectorAll('tr'), (row) => Array.from(row.querySelectorAll('th, td'), (cell) => (cell.textContent ?? '').replace(/\s+/g, ' ').trim())),
      ),
    )
}

/** Markdown with its link destinations, image addresses and autolinks taken out; fenced code stays as written. */
function withoutAddresses(markdown: string): string {
  return markdown.replace(/\]\([^)\s]*\)/g, ']').replace(/<https?:\/\/[^>\s]+>/g, '')
}

for (const { page: path, markdown: markdownPath, lang } of MARKDOWN_VERSIONS) {
  test.describe(`${markdownPath}, the Markdown version of ${path}`, () => {
    test('starts with the page title and names the page it renders', async ({ page, request }) => {
      const markdown = await fetchMarkdown(request, markdownPath)
      await page.goto(path)
      expect(markdown.split('\n')[0]).toBe(`# ${normalize(await page.locator('h1').innerText())}`)
      const canonical = only(await attributeValues(page, 'link[rel="canonical"]', 'href'), 'canonical link')
      expect(blocks(markdown)[1]).toContain(`<${canonical}>`)
    })

    test('carries the BibTeX entry the page serves', async ({ page, request }) => {
      const markdown = await fetchMarkdown(request, markdownPath)
      await page.goto(path)
      expect(bibtexEntries(markdown)).toEqual([await page.locator('section#cite pre').innerText()])
    })

    test('has the same tables as the page, cell for cell', async ({ page, request }) => {
      const markdown = await fetchMarkdown(request, markdownPath)
      await page.goto(path)
      const html = await htmlTables(page)
      expect(html).toHaveLength(3)
      expect(markdownTables(markdown)).toEqual(html)
    })

    test('states the same multi-digit numbers as the page', async ({ page, request }) => {
      const markdown = await fetchMarkdown(request, markdownPath)
      await page.goto(path)
      // The page's numbers are what main shows and its images' text
      // alternatives say. The Markdown also ends with the footer's copyright
      // line, so that line counts on the page's side too. The BibTeX entry is
      // text on both sides, its url field included.
      const shown = await page.locator('main').innerText()
      const alternatives = await page.locator('main img').evaluateAll((images) => images.map((image) => image.getAttribute('alt') ?? ''))
      const copyright = await page.locator('footer p').first().innerText()
      expect(normalize(copyright)).toBe(PAGE_TEXT[lang].footer[0])
      const served = multiDigitNumbers([shown, ...alternatives, copyright].join('\n'))
      expect(served.length).toBeGreaterThan(100)
      expect(multiDigitNumbers(withoutAddresses(markdown)).sort()).toEqual(served.sort())
    })
  })
}

test('/index.md gives the arXiv abstract word for word', async ({ request }) => {
  const markdown = await fetchMarkdown(request, '/index.md')
  const abstract = blockAfter(blocks(markdown), `## ${PAGE_TEXT.en.abstractHeading}`)
  expect(abstract.replace(/\*([^*]+)\*/g, '$1')).toBe(ABSTRACT)
})

for (const { page: path, markdown } of MARKDOWN_VERSIONS) {
  test(`${path} names its Markdown version in the head`, async ({ page, request }) => {
    await page.goto(path)
    const href = only(await attributeValues(page, 'link[rel="alternate"][type="text/markdown"]', 'href'), 'Markdown alternate link')
    expect(href).toBe(new URL(markdown, SITE).href)
    const response = await request.get(new URL(href).pathname)
    expect(response.status()).toBe(200)
  })
}

