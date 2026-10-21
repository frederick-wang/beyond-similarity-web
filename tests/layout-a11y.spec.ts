import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { PAGES } from './paper-literals'

for (const { path } of PAGES) {
  test.describe(path, () => {
    // The widths around 68rem (1088 px) matter: there the page switches to two
    // columns while the gutters still leave less room than column, gap and margin.
    for (const width of [360, 390, 768, 1024, 1088, 1100, 1280, 1440, 1920]) {
      test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 })
        await page.goto(path)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
        expect(overflow).toBeLessThanOrEqual(0)
      })
    }

    for (const colorScheme of ['light', 'dark'] as const) {
      test(`passes axe without serious or critical issues in the ${colorScheme} theme`, async ({ page }) => {
        // axe walks the whole page twice; under heavy machine load that alone can pass 30 s.
        test.slow()
        await page.emulateMedia({ colorScheme })
        await page.goto(path)
        const results = await new AxeBuilder({ page }).analyze()
        const severe = (impact: (typeof results.violations)[number]['impact']) => impact === 'serious' || impact === 'critical'
        const blocking = results.violations.filter((violation) => severe(violation.impact))
        expect(blocking.map((violation) => `${violation.id}: ${violation.help}`)).toEqual([])
        // "Needs review" results count too.
        const reviewable = await new AxeBuilder({ page }).analyze()
        const unresolved = reviewable.incomplete.filter((result) => severe(result.impact))
        expect(unresolved.map((result) => `${result.id}: ${result.help}`)).toEqual([])
      })
    }
  })
}
