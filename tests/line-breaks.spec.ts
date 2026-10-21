import { expect, test } from '@playwright/test'

// Lines must not break inside a label and its number, a statistic and its
// value, or a number and its unit. The page joins them with a no-break space;
// these are one example of each kind per page, copied from the served text.
const tied = {
  '/': ['Table\u00a01', 'p\u00a0<\u00a00.001', '521\u00a0s', 'PDF p.\u00a01'],
  '/zh/': ['表\u00a01', 'p\u00a0<\u00a00.001', '521\u00a0秒', 'PDF 第\u00a01\u00a0页'],
} as const

for (const [path, phrases] of Object.entries(tied)) {
  test(`${path} keeps labels, statistics and units on one line`, async ({ page }) => {
    await page.goto(path)
    const text = await page.locator('main').evaluate((main) => main.textContent ?? '')
    for (const phrase of phrases) {
      expect(text, phrase).toContain(phrase)
    }
    await expect(page.locator('main code', { hasText: 'BGE-M3' })).toHaveCount(1)
    const labelWrap = await page.locator('.caption .label').first().evaluate((label) => getComputedStyle(label).whiteSpace)
    expect(labelWrap).toBe('nowrap')
  })
}
