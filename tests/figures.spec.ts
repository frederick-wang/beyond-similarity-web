import { expect, test } from '@playwright/test'
import { ARXIV_PDF_V1, FIGURE_ALT_PHRASES, FIGURE_PAGES, PAGES, type FigureId } from './paper-literals'

const figures = [
  ['framework', 'Figure 1.'],
  ['models', 'Figure 2.'],
  ['calibration', 'Figure 3.'],
  ['fidelity', 'Figure 4.'],
] as const

for (const [figure, label] of figures) {
  test(`shows ${label} with text alternative, caption, dimensions and links`, async ({ page, request }) => {
    await page.goto('/')
    const element = page.locator(`figure[data-figure="${figure}"]`)
    const image = element.locator('img')
    expect((await image.getAttribute('alt'))?.length ?? 0).toBeGreaterThan(80)
    await expect(image).toHaveAttribute('width', /^\d+$/)
    await expect(image).toHaveAttribute('height', /^\d+$/)
    await expect(image).toHaveAttribute('loading', 'lazy')
    await expect(element.locator('figcaption .label')).toHaveText(label)
    await expect(element.locator('figcaption').getByRole('link', { name: `PDF p. ${FIGURE_PAGES[figure]}` })).toHaveAttribute(
      'href',
      `${ARXIV_PDF_V1}#page=${FIGURE_PAGES[figure]}`,
    )
    const full = await element.locator('figcaption').getByRole('link', { name: 'Open full size' }).getAttribute('href')
    expect(full).not.toBeNull()
    const response = await request.get(full ?? '')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toBe('image/webp')
  })
}

for (const { path, lang } of PAGES) {
  // Phrases pin what the number checks cannot: single digits, and numbers
  // whose order carries the meaning, such as the two strata of Figure 4.
  test(`${path} ties single digits and paired numbers to their objects in the text alternatives`, async ({ page }) => {
    await page.goto(path)
    const phrases: Readonly<Partial<Record<FigureId, readonly string[]>>> = FIGURE_ALT_PHRASES[lang]
    for (const [figure, expected] of Object.entries(phrases)) {
      const image = page.locator(`figure[data-figure="${figure}"] img`)
      await expect(image).toHaveCount(1)
      const alt = await image.getAttribute('alt')
      for (const phrase of expected) {
        expect(alt, `${figure}: ${phrase}`).toContain(phrase)
      }
    }
  })

  test(`${path} reports the calibration bars in the text alternative of Figure 3`, async ({ page }) => {
    await page.goto(path)
    const alt = await page.locator('figure[data-figure="calibration"] img').getAttribute('alt')
    for (const value of ['41%', '56%', '74%', '91%', '99%']) {
      expect(alt).toContain(value)
    }
  })
}
