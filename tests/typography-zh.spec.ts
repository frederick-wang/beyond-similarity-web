import { expect, test } from '@playwright/test'
import { lintFor } from 'autocorrect-node'
import { FIGURE_PAGES, ICP_REGISTRY, QUOTATIONS } from './paper-literals'

// Chinese typography on /zh/ as served, per CODING_STANDARDS.md: corner
// brackets for quotation marks, no 「——」 dash, full-width punctuation with no
// space beside it, and AutoCorrect's spacing and punctuation rules.

test('uses no ——', async ({ request }) => {
  const html = await (await request.get('/zh/')).text()
  expect(html).not.toContain('——')
})

test('uses no curly double quotation marks in Chinese text, attributes included', async ({ page }) => {
  await page.goto('/zh/')
  const chinese = await page.evaluate(() => {
    const inChinese = (element: Element | null) => element?.closest('[lang]')?.getAttribute('lang')?.startsWith('zh') ?? false
    const texts: string[] = [document.title]
    // Text in the body, scripts aside: the JSON-LD and the copy button's
    // script are data and code, not Chinese text.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
      const parent = node.parentElement
      if (parent !== null && parent.closest('script, style') === null && inChinese(parent)) {
        texts.push(node.textContent ?? '')
      }
    }
    for (const element of document.querySelectorAll('[alt], [title], [aria-label], meta[content]')) {
      if (inChinese(element)) {
        for (const name of ['alt', 'title', 'aria-label', 'content']) {
          texts.push(element.getAttribute(name) ?? '')
        }
      }
    }
    return texts.join('\n')
  })
  expect(chinese).toContain('「')
  expect(chinese).not.toMatch(/[“”]/)
})

test('wraps every classical quotation in 「」', async ({ page }) => {
  await page.goto('/zh/')
  const marks = await page.locator('main [data-quotation]').evaluateAll((spans) =>
    spans.map((span) => ({
      before: (span.previousSibling?.textContent ?? '').slice(-1),
      after: (span.nextSibling?.textContent ?? '').slice(0, 1),
    })),
  )
  expect(marks.length).toBeGreaterThanOrEqual(QUOTATIONS.length)
  for (const mark of marks) {
    expect(mark).toEqual({ before: '「', after: '」' })
  }
})

test('labels figures and tables without a period and sets no space beside full-width punctuation', async ({ page }) => {
  await page.goto('/zh/')
  for (const [figure, number] of [
    ['framework', 1],
    ['models', 2],
    ['calibration', 3],
    ['fidelity', 4],
  ] as const) {
    const caption = page.locator(`figure[data-figure="${figure}"] figcaption`)
    await expect(caption.locator('.label')).toHaveText(`图 ${number}`)
    await expect(caption.getByRole('link', { name: `PDF 第 ${FIGURE_PAGES[figure]} 页` })).toHaveCount(1)
  }
  for (const [table, number] of [
    ['agreement', 1],
    ['models', 2],
    ['diachronic', 3],
  ] as const) {
    await expect(page.locator(`#table-${table} figcaption .label`)).toHaveText(`表 ${number}`)
  }
  // Every caption and every paragraph with sources ends its sentence with
  // full-width punctuation, and the links follow it directly. The footer's
  // copyright and maintainer sentences are joined by the same rule; the ICP
  // filing number is a registry identifier, not a sentence, and stays out.
  const joins = await page
    .locator(`main figcaption, main p:has([data-sources]), footer p:not(:has(a[href="${ICP_REGISTRY}"]))`)
    .evaluateAll((elements) => elements.map((element) => element.textContent ?? ''))
  expect(joins.length).toBeGreaterThan(20)
  expect(joins.filter((text) => text.startsWith('©') || text.startsWith('维护者'))).toHaveLength(2)
  for (const text of joins) {
    expect(text).not.toMatch(/[，。；：、？！）」》]\s|\s[，。；：、？！（「《]/)
  }
})

test('passes AutoCorrect on the visible text of main', async ({ page }) => {
  await page.goto('/zh/')
  // Affiliation marks are superscripts, set apart by their position rather
  // than by a space; flattened into text they would read as digits glued to
  // the name, so they are taken out before linting.
  await page.evaluate(() => {
    for (const mark of document.querySelectorAll('main sup')) {
      mark.remove()
    }
  })
  const text = await page.locator('main').innerText()
  expect(text.length).toBeGreaterThan(10_000)
  const result = lintFor(text, 'text')
  expect(result.error).toBe('')
  expect(result.lines.map((line) => `${line.l}:${line.c} ${line.old} → ${line.new}`)).toEqual([])
})
