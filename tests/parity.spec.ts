import { expect, test, type Page } from '@playwright/test'
import { multiDigitNumbers } from './numbers'
import { BIBTEX_OPENING, SECTION_IDS, normalize } from './paper-literals'

// The Chinese page is a full counterpart of the English page (ADR 0004). Each
// test reads one structure from both pages as served and requires it to be
// the same: the sections, their order, kind and anchors (in the SPEC's order);
// the sequence of blocks in each section, a block known by its element, its
// id and whether it is the BibTeX block; the question numbers and the answer
// that opens each question; the page navigation; the subheading anchors; the
// figures and tables with their PDF pages; the PDF pages each paragraph links
// to; the classical quotations with their text and script; the BibTeX entry;
// the numbers in every table cell; and the multi-digit numbers of each
// figure's text alternative and caption, each table caption and the abstract.
// Only the words around them are compared by other tests, per language.

/** Reads a structure from a page as served. */
async function fromPage<T>(page: Page, path: string, read: (page: Page) => Promise<T>): Promise<T> {
  await page.goto(path)
  return read(page)
}

/** The same structure read from the English and the Chinese page. */
async function bothPages<T>(page: Page, read: (page: Page) => Promise<T>): Promise<{ readonly en: T; readonly zh: T }> {
  const en = await fromPage(page, '/', read)
  const zh = await fromPage(page, '/zh/', read)
  return { en, zh }
}

test('has the same sections in the same order, each of the same kind', async ({ page }) => {
  const { en, zh } = await bothPages(page, (page) =>
    page.locator('main section.section').evaluateAll((sections) =>
      sections.map((section) => ({ id: section.id, question: section.classList.contains('section-question') })),
    ),
  )
  expect(en.map((section) => section.id)).toEqual([...SECTION_IDS])
  expect(zh).toEqual(en)
})

test('has the same blocks in each section, in the same order', async ({ page }) => {
  const { en, zh } = await bothPages(page, (page) =>
    page.locator('main section.section').evaluateAll((sections) =>
      sections.map((section) => ({
        id: section.id,
        // The copy button's script sits inside the BibTeX section; it is code, not a block.
        blocks: Array.from(section.children)
          .filter((block) => block.localName !== 'script')
          .map((block) => ({ element: block.localName, id: block.id, bibtex: block.classList.contains('bibtex') })),
      })),
    ),
  )
  expect(en.find((section) => section.id === 'cite')?.blocks.some((block) => block.bibtex)).toBe(true)
  expect(zh).toEqual(en)
})

test('offers the same BibTeX entry, marked as English, on both pages', async ({ page }) => {
  const { en, zh } = await bothPages(page, async (page) => {
    const entry = page.locator('section#cite pre')
    // A missing entry fails within the 5 s assertion timeout, naming the element; innerText() would wait out the 30 s test timeout.
    await expect(entry).toHaveCount(1)
    return { text: await entry.innerText(), lang: await entry.getAttribute('lang') }
  })
  expect(en.text.startsWith(BIBTEX_OPENING)).toBe(true)
  expect(en.lang).toBe('en')
  expect(zh).toEqual(en)
})

test('numbers the same questions and answers each in its first sentence', async ({ page }) => {
  const read = (page: Page) =>
    page.locator('main section.section-question').evaluateAll((sections) =>
      sections.map((section) => ({
        id: section.id,
        numeral: section.querySelector('h2 .numeral')?.textContent?.trim() ?? null,
        answerFirst: section.querySelector(':scope > :not(h2)')?.hasAttribute('data-answer') ?? false,
      })),
    )
  const { en, zh } = await bothPages(page, read)
  expect(zh).toEqual(en)
  expect(zh.map((question) => question.numeral)).toEqual(zh.map((_, index) => String(index + 1)))
  expect(zh.every((question) => question.answerFirst)).toBe(true)
  // Chinese question headings are questions too, closed by a full-width question mark.
  await page.goto('/zh/')
  for (const heading of await page.locator('main section.section-question h2 .heading-text').allInnerTexts()) {
    expect(normalize(heading)).toMatch(/？$/)
  }
})

test('lists the same sections in the page navigation, with the same numbers', async ({ page }) => {
  const { en, zh } = await bothPages(page, async (page) => {
    const nav = page.locator('nav.page-nav .wide')
    return {
      hrefs: await nav.locator('a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))),
      numerals: await nav.locator('.numeral').allInnerTexts(),
    }
  })
  expect(zh).toEqual(en)
})

test('has the same subheading anchors', async ({ page }) => {
  const { en, zh } = await bothPages(page, (page) => page.locator('main h3[id]').evaluateAll((headings) => headings.map((heading) => heading.id)))
  expect(en.length).toBeGreaterThan(0)
  expect(zh).toEqual(en)
})

test('has the same figures and tables in the same order, with the same PDF pages', async ({ page }) => {
  const { en, zh } = await bothPages(page, (page) =>
    page.locator('main figure[id]').evaluateAll((figures) =>
      figures.map((figure) => ({
        id: figure.id,
        pdf: Array.from(figure.querySelectorAll('figcaption a[href*="#page="]'), (link) => link.getAttribute('href')),
      })),
    ),
  )
  expect(en.map((figure) => figure.id)).toEqual([
    'figure-framework',
    'table-agreement',
    'table-models',
    'figure-models',
    'figure-calibration',
    'table-diachronic',
    'figure-fidelity',
  ])
  expect(zh).toEqual(en)
})

test('links each paragraph to the same PDF pages', async ({ page }) => {
  const { en, zh } = await bothPages(page, (page) =>
    page.locator('main section.section').evaluateAll((sections) =>
      sections.map((section) => ({
        id: section.id,
        paragraphs: Array.from(section.querySelectorAll(':scope > p'), (paragraph) =>
          Array.from(paragraph.querySelectorAll('[data-sources] a'), (link) => link.getAttribute('href')),
        ),
      })),
    ),
  )
  expect(zh).toEqual(en)
})

test('quotes the same classical Chinese passages, with the same text and script', async ({ page }) => {
  const { en, zh } = await bothPages(page, (page) =>
    page.locator('main [data-quotation]').evaluateAll((spans) =>
      spans.map((span) => ({ id: span.getAttribute('data-quotation'), text: span.textContent, lang: span.getAttribute('lang') })),
    ),
  )
  expect(en.length).toBeGreaterThan(0)
  expect(zh).toEqual(en)
})

test('gives every table the same numbers, under headers in its own language', async ({ page }) => {
  const read = (page: Page) =>
    page.locator('main table').evaluateAll((tables) =>
      tables.map((table) => {
        const text = (cell: Element) => (cell.textContent ?? '').replace(/\s+/g, ' ').trim()
        return {
          headers: Array.from(table.querySelectorAll('thead th'), text),
          // Row labels name a dimension in the page's language or a model by
          // its identifier; category cells are words. Every other cell is a number.
          rowLabels: Array.from(table.querySelectorAll('tbody th[scope="row"]'), text),
          numbers: Array.from(table.querySelectorAll('tbody td:not(.category), tfoot td:not(:first-child)'), text),
          words: Array.from(table.querySelectorAll('tbody td.category, tfoot td:first-child'), text),
        }
      }),
    )
  const { en, zh } = await bothPages(page, read)
  expect(zh.length).toBe(3)
  for (const [index, table] of zh.entries()) {
    const english = en[index]
    if (english === undefined) {
      throw new Error(`The English page has no table ${index + 1}`)
    }
    expect(table.numbers).toEqual(english.numbers)
    expect(table.headers).toHaveLength(english.headers.length)
    expect(table.headers).not.toEqual(english.headers)
    expect(table.headers.join('')).toMatch(/\p{Script=Han}/u)
    expect(table.words).toHaveLength(english.words.length)
    for (const word of table.words) {
      expect(word).toMatch(/\p{Script=Han}/u)
    }
  }
  // Model names are identifiers, the same in both languages; dimension names are translated.
  const [agreement, models, diachronic] = zh
  expect(models?.rowLabels).toEqual(en[1]?.rowLabels)
  for (const table of [agreement, diachronic]) {
    for (const label of table?.rowLabels ?? []) {
      expect(label).toMatch(/\p{Script=Han}/u)
    }
  }
})

test('states the same multi-digit numbers in figure text alternatives, captions and the abstract', async ({ page }) => {
  // Years, labels and figures share their digits across the two languages:
  // 「659 年」 and "659 CE", 「表 2」 and "Table 2", 「51 倍」 and "51×". Model
  // names count too, written the same in both. Links in figure captions are
  // navigation ("Open full size", "PDF p. 2") and are left out.
  const { en, zh } = await bothPages(page, (page) =>
    page.evaluate(() => {
      const required = <T,>(value: T | null | undefined, what: string): T => {
        if (value === null || value === undefined) {
          throw new Error(`Missing ${what}`)
        }
        return value
      }
      const withoutLinks = (element: Element): string => {
        const copy = element.cloneNode(true)
        if (!(copy instanceof Element)) {
          throw new Error('A caption did not clone as an element')
        }
        for (const link of copy.querySelectorAll('a')) {
          link.remove()
        }
        return required(copy.textContent, 'caption text')
      }
      const places: { readonly place: string; readonly text: string }[] = []
      for (const figure of document.querySelectorAll('main figure[data-figure]')) {
        places.push({ place: `${figure.id} text alternative`, text: required(figure.querySelector('img')?.getAttribute('alt'), `${figure.id} alt`) })
        places.push({ place: `${figure.id} caption`, text: withoutLinks(required(figure.querySelector('figcaption'), `${figure.id} caption`)) })
      }
      for (const table of document.querySelectorAll('main figure[data-table]')) {
        places.push({ place: `${table.id} caption`, text: required(table.querySelector('figcaption')?.textContent, `${table.id} caption`) })
      }
      places.push({ place: 'abstract', text: required(document.querySelector('section#abstract')?.textContent, 'abstract') })
      return places
    }),
  )
  const numbers = (places: readonly { readonly place: string; readonly text: string }[]) =>
    places.map(({ place, text }) => ({ place, numbers: multiDigitNumbers(text).sort() }))
  const english = numbers(en)
  expect(english.map(({ place }) => place)).toEqual([
    'figure-framework text alternative',
    'figure-framework caption',
    'figure-models text alternative',
    'figure-models caption',
    'figure-calibration text alternative',
    'figure-calibration caption',
    'figure-fidelity text alternative',
    'figure-fidelity caption',
    'table-agreement caption',
    'table-models caption',
    'table-diachronic caption',
    'abstract',
  ])
  expect(numbers(zh)).toEqual(english)
})
