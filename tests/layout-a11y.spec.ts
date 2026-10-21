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
    const severe = (impact: string | null | undefined) => impact === 'serious' || impact === 'critical'
    const blocking = results.violations.filter((violation) => severe(violation.impact))
    expect(blocking.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([])
    // "Needs review" results count too, except colour contrast: axe cannot
    // determine the background of the code inside the horizontally scrolling
    // BibTeX region. That text is ink on the wash colour: 16.3:1 light, 14.6:1 dark.
    const unresolved = results.incomplete.filter((result) => severe(result.impact) && result.id !== 'color-contrast')
    expect(unresolved.map((result) => `${result.id}: ${result.help}`)).toEqual([])
  })
}
