import { expect, test } from '@playwright/test'
import { SECTION_FIGURES, SECTION_WORD_FIGURES, normalize } from './paper-literals'

// Section prose states the paper's numbers as text rather than reading them
// from the facts module. This test holds every one of them to the literals
// copied from the paper.

for (const [section, figures] of Object.entries(SECTION_FIGURES)) {
  test(`states the paper's figures in the ${section} section`, async ({ page }) => {
    await page.goto('/')
    const text = normalize(await page.locator(`section#${section}`).innerText())
    for (const figure of figures) {
      expect(text, `figure ${figure}`).toContain(figure)
    }
    const words: readonly string[] = section in SECTION_WORD_FIGURES ? SECTION_WORD_FIGURES[section as keyof typeof SECTION_WORD_FIGURES] : []
    for (const word of words) {
      expect(text, `figure ${word}`).toContain(word)
    }
  })
}
