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
    const severe = (impact: (typeof results.violations)[number]['impact']) => impact === 'serious' || impact === 'critical'
    const blocking = results.violations.filter((violation) => severe(violation.impact))
    expect(blocking.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([])
    // "Needs review" results count too. The one region left out is the
    // horizontally scrolling BibTeX block: axe cannot determine the background
    // behind its code, which is ink on the wash colour (16.3:1 light, 14.6:1 dark).
    const reviewable = await new AxeBuilder({ page }).exclude('#cite [role="region"]').analyze()
    const unresolved = reviewable.incomplete.filter((result) => severe(result.impact))
    expect(unresolved.map((result) => `${result.id}: ${result.help}`)).toEqual([])
  })
}
