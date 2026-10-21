import { expect, test } from '@playwright/test'
import { attributeValues, jsonLd, only } from './head'
import { ARXIV_ABS, ARXIV_PDF_V1, EXPLORER, PAGES, PAGE_TEXT, normalize } from './paper-literals'

for (const { path, lang } of PAGES) {
  const text = PAGE_TEXT[lang]

  test.describe(`${path} (${lang}), first screen`, () => {
    test('declares the language of the document and the title', async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('html')).toHaveAttribute('lang', lang)
      await expect(page).toHaveTitle(text.title)
    })

    test('shows the paper title as the only h1', async ({ page }) => {
      await page.goto(path)
      const h1 = page.locator('h1')
      await expect(h1).toHaveCount(1)
      expect(normalize(await h1.innerText())).toBe(text.title)
    })

    test('lists the three authors in order with affiliation marks and the corresponding author', async ({ page }) => {
      await page.goto(path)
      const names = await page.locator('[data-author-name]').allInnerTexts()
      expect(names.map(normalize)).toEqual([...text.authors])
      const marks = await page.locator('[data-author-affiliations]').allInnerTexts()
      expect(marks.map(normalize)).toEqual(['1,2', '1,2', '1,2'])
      await expect(page.locator('[data-author-corresponding]')).toHaveCount(1)
      await expect(page.locator('[data-author]').nth(2).locator('[data-author-corresponding]')).toHaveCount(1)
      const entries = await page.locator('[data-author]').allInnerTexts()
      expect(entries.map(normalize)).toEqual([...text.authorEntries])
    })

    test('names both affiliations', async ({ page }) => {
      await page.goto(path)
      const affiliations = await page.locator('[data-affiliation]').allInnerTexts()
      expect(affiliations.map((entry) => normalize(entry).replace(/^\d\s*/, ''))).toEqual([...text.affiliations])
    })

    test('links to the arXiv record, the v1 PDF, the Explorer and the citation', async ({ page }) => {
      await page.goto(path)
      const row = page.locator('[data-links]')
      await expect(row.locator(`a[href="${ARXIV_ABS}"]`)).toHaveCount(1)
      await expect(row.locator(`a[href="${ARXIV_PDF_V1}"]`)).toHaveCount(1)
      await expect(row.locator(`a[href="${EXPLORER}"]`)).toHaveCount(1)
      await expect(row.locator('a[href="#cite"]')).toHaveCount(1)
      await expect(row.locator('a')).toHaveCount(4)
    })

    test('states the finding without evaluative words and with the bounded result', async ({ page }) => {
      await page.goto(path)
      const finding = normalize(await page.locator('[data-finding]').innerText())
      for (const phrase of text.finding) {
        expect(finding).toContain(phrase)
      }
      // The raw text keeps no-break spaces inside each year and its era, so a
      // year never wraps away from them.
      const raw = await page.locator('[data-finding]').textContent()
      for (const year of text.findingYears) {
        expect(raw).toContain(year.replaceAll(' ', '\u00a0'))
      }
      expect(finding).not.toMatch(text.findingAvoids)
    })

    test('gives the numbers worth repeating with their objects', async ({ page }) => {
      await page.goto(path)
      const glance = page.locator('[data-glance]')
      await expect(glance.getByRole('heading', { name: text.glanceHeading })).toBeVisible()
      const stated = normalize(await glance.innerText())
      for (const expected of text.glance) {
        expect(stated).toContain(expected)
      }
    })

    test('keeps model names on one line', async ({ page }) => {
      await page.goto(path)
      const names = page.locator('[data-glance] code')
      await expect(names).toHaveText(['doubao-2.1-turbo', 'deepseek-v4-flash', 'deepseek-v4-flash'])
      for (const whiteSpace of await names.evaluateAll((elements) => elements.map((element) => getComputedStyle(element).whiteSpace))) {
        expect(whiteSpace).toBe('nowrap')
      }
    })

    test('lists the sections on this page', async ({ page }) => {
      await page.goto(path)
      const nav = page.getByRole('navigation', { name: text.navHeading })
      await expect(nav.getByRole('link', { name: text.abstractHeading, exact: true })).toHaveAttribute('href', '#abstract')
      await expect(nav.getByRole('link', { name: text.citeHeading, exact: true })).toHaveAttribute('href', '#cite')
    })

    test('gives one description to search results, link previews and the structured data', async ({ page }) => {
      await page.goto(path)
      const description = only(await attributeValues(page, 'meta[name="description"]', 'content'), 'description')
      expect(await attributeValues(page, 'meta[property="og:description"]', 'content')).toEqual([description])
      expect((await jsonLd(page))['description']).toBe(description)
    })
  })
}
