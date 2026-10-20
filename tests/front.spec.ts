import { expect, test } from '@playwright/test'
import { AFFILIATIONS, ARXIV_ABS, ARXIV_PDF_V1, AUTHORS, EXPLORER, TITLE, normalize } from './paper-literals'

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
    expect(finding).toContain('2,533 expert-adjudicated pairs')
    expect(finding).toContain('no systematic change')
    expect(finding).not.toMatch(/\b(novel|powerful|significant(ly)?|robust(ly)?|comprehensive(ly)?|stable|stability)\b/i)
  })

  test('gives the numbers worth repeating with their objects', async ({ page }) => {
    await page.goto('/')
    const glance = page.locator('[data-glance]')
    await expect(glance.getByRole('heading', { name: 'At a glance' })).toBeVisible()
    const text = normalize(await glance.innerText())
    for (const expected of ['2,533', 'Analects', 'Book of Han', '55.9%–92.9%', 'twelve LLMs', '51×', '4.9 points', '5,766', '65,380', 'one in eight']) {
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
