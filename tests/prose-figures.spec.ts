import { expect, test } from '@playwright/test'
import { SECTION_FIGURES, SECTION_WORD_FIGURES, normalize } from './paper-literals'

// Section prose states the paper's numbers as text rather than reading them
// from the facts module. For each section, the numbers in its answer and
// paragraphs (tables and captions are tested elsewhere) must be exactly the
// literals copied from the paper: a wrong number fails, and so does a number
// added to the prose without being checked against the paper.

// A number token: digits with optional thousands separators and decimals, or a
// decimal without a leading zero (".12"), with an optional minus sign, percent
// sign and superscript exponent ("10⁻³").
const numberToken = /[−]?(?:\d+(?:,\d{3})*(?:\.\d+)?|(?<!\d)\.\d+)%?[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*/g

function multiDigitNumbers(text: string): string[] {
  const tokens = text.match(numberToken) ?? []
  return [...new Set(tokens.filter((token) => token.replace(/\D/g, '').length >= 2))]
}

for (const [section, figures] of Object.entries(SECTION_FIGURES)) {
  test(`states exactly the paper's figures in the ${section} section`, async ({ page }) => {
    await page.goto('/')
    // Source links ("PDF p. 4") are navigation and model names are
    // identifiers ("doubao-2.1-turbo"); neither states a figure.
    const parts = await page
      .locator(`section#${section} > [data-answer], section#${section} > p`)
      .evaluateAll((elements) =>
        elements.map((element) => {
          const copy = element.cloneNode(true) as HTMLElement
          for (const skipped of copy.querySelectorAll('[data-sources], code')) {
            skipped.remove()
          }
          return copy.textContent ?? ''
        }),
      )
    const text = normalize(parts.join(' '))
    expect(multiDigitNumbers(text).sort()).toEqual([...figures].sort())
    const words: readonly string[] = section in SECTION_WORD_FIGURES ? SECTION_WORD_FIGURES[section as keyof typeof SECTION_WORD_FIGURES] : []
    for (const word of words) {
      expect(text, `figure ${word}`).toContain(word)
    }
  })
}
