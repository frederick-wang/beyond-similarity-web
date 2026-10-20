import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

for (const width of [390, 1440]) {
  test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(0)
  })
}

for (const colorScheme of ['light', 'dark'] as const) {
  test(`passes axe without serious or critical issues in the ${colorScheme} theme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme })
    await page.goto('/')
    const results = await new AxeBuilder({ page }).analyze()
    const blocking = results.violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
    expect(blocking.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([])
  })
}
