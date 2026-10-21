import { expect, test } from '@playwright/test'
import {
  AFFILIATIONS,
  ARXIV_ABS,
  ARXIV_PDF_V1,
  AUTHORS,
  BENCHMARK_PAIRS,
  EXPLORER,
  FIRST_HISTORY,
  LAST_HISTORY,
  PRECISION_RANGE,
  TITLE,
  normalize,
} from './paper-literals'

test.describe('English page, first screen', () => {
  test('shows the paper title as the only h1', async ({ page }) => {
    await page.goto('/')
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    expect(normalize(await h1.innerText())).toBe(TITLE)
  })

  test('lists the three authors in order with affiliation marks and the corresponding author', async ({ page }) => {
    await page.goto('/')
    const names = await page.locator('[data-author-name]').allInnerTexts()
    expect(names.map(normalize)).toEqual([...AUTHORS])
    const marks = await page.locator('[data-author-affiliations]').allInnerTexts()
    expect(marks.map(normalize)).toEqual(['1,2', '1,2', '1,2'])
    await expect(page.locator('[data-author-corresponding]')).toHaveCount(1)
    await expect(page.locator('[data-author]').nth(2).locator('[data-author-corresponding]')).toHaveCount(1)
  })

  test('names both affiliations', async ({ page }) => {
    await page.goto('/')
    const affiliations = await page.locator('[data-affiliation]').allInnerTexts()
    expect(affiliations.map((text) => normalize(text).replace(/^\d\s*/, ''))).toEqual([...AFFILIATIONS])
  })

  test('links to the arXiv record, the v1 PDF, the Explorer and the citation', async ({ page }) => {
    await page.goto('/')
    const row = page.locator('[data-links]')
    await expect(row.locator(`a[href="${ARXIV_ABS}"]`)).toHaveCount(1)
    await expect(row.locator(`a[href="${ARXIV_PDF_V1}"]`)).toHaveCount(1)
    await expect(row.locator(`a[href="${EXPLORER}"]`)).toHaveCount(1)
    await expect(row.locator('a[href="#cite"]')).toHaveCount(1)
  })

  test('states the finding without evaluative words and with the bounded result', async ({ page }) => {
    await page.goto('/')
    const finding = normalize(await page.locator('[data-finding]').innerText())
    expect(finding).toContain(`${BENCHMARK_PAIRS} expert-adjudicated pairs`)
    expect(finding).toContain('no systematic change')
    expect(finding).toContain(`from ${FIRST_HISTORY} to ${LAST_HISTORY}`)
    // The raw text keeps a no-break space between each year and its era, so a
    // year never wraps away from "BCE" or "CE".
    const raw = await page.locator('[data-finding]').textContent()
    expect(raw).toContain(FIRST_HISTORY.replace(' ', '\u00a0'))
    expect(raw).toContain(LAST_HISTORY.replace(' ', '\u00a0'))
    expect(finding).not.toMatch(/\b(novel|powerful|significant(ly)?|robust(ly)?|comprehensive(ly)?|stable|stability)\b/i)
  })

  test('gives the numbers worth repeating with their objects', async ({ page }) => {
    await page.goto('/')
    const glance = page.locator('[data-glance]')
    await expect(glance.getByRole('heading', { name: 'At a glance' })).toBeVisible()
    const text = normalize(await glance.innerText())
    for (const expected of [BENCHMARK_PAIRS, 'Analects', 'Book of Han', PRECISION_RANGE, '12 LLMs', '51×', 'doubao-2.1-turbo', 'deepseek-v4-flash', '4.9 points less precise', '5,766', '65,380', 'If the 88.0% precision measured on the Book of Han holds', 'about 1 in 8']) {
      expect(text).toContain(expected)
    }
  })

  test('lists the sections on this page', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation', { name: 'On this page' })
    await expect(nav.getByRole('link', { name: 'Abstract' })).toHaveAttribute('href', '#abstract')
    await expect(nav.getByRole('link', { name: 'Cite' })).toHaveAttribute('href', '#cite')
  })
})
