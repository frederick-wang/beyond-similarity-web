import { expect, test } from '@playwright/test'
import {
  GRANT_NUMBERS,
  HEADING_FIGURES,
  PAGES,
  SECTION_FIGURES,
  SECTION_FIGURES_ZH_OVERRIDES,
  SECTION_WORD_FIGURES,
  normalize,
  type PageLanguage,
} from './paper-literals'

// Section prose states the paper's numbers as text rather than reading them
// from the facts module. For each section, the numbers in its answer and
// paragraphs (tables and captions are tested elsewhere) must be exactly the
// literals copied from the paper: a wrong number fails, and so does a number
// added to the prose without being checked against the paper. Both language
// pages are held to the same lists.

// A number token: digits with optional thousands separators and decimals, or a
// decimal without a leading zero (".12"), with an optional minus sign, percent
// sign and superscript exponent ("10⁻³").
const numberToken = /[−]?(?:\d+(?:,\d{3})*(?:\.\d+)?|(?<!\d)\.\d+)%?[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*/g

function multiDigitNumbers(text: string): string[] {
  const tokens = text.match(numberToken) ?? []
  return [...new Set(tokens.filter((token) => token.replace(/\D/g, '').length >= 2))]
}

type Section = keyof typeof SECTION_FIGURES

/** The figures a section states on the page in `lang`: the paper's, with the Chinese page's one declared change of form. */
function expectedFigures(section: Section, lang: PageLanguage): readonly string[] {
  const figures: readonly string[] = SECTION_FIGURES[section]
  if (lang === 'en') {
    return figures
  }
  const overrides = SECTION_FIGURES_ZH_OVERRIDES[section]
  if (overrides === undefined) {
    return figures
  }
  for (const figure of Object.keys(overrides)) {
    if (!figures.includes(figure)) {
      throw new Error(`SECTION_FIGURES_ZH_OVERRIDES replaces ${figure}, which the ${section} section does not state`)
    }
  }
  return figures.map((figure) => overrides[figure] ?? figure)
}

function isSection(key: string): key is Section {
  return key in SECTION_FIGURES
}

const sections = Object.keys(SECTION_FIGURES).filter(isSection)

for (const { path, lang } of PAGES) {
  test.describe(`${path} (${lang})`, () => {
    for (const section of sections) {
      test(`states exactly the paper's figures in the ${section} section`, async ({ page }) => {
        await page.goto(path)
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
        expect(multiDigitNumbers(text).sort()).toEqual([...expectedFigures(section, lang)].sort())
        const wordFigures: Readonly<Partial<Record<Section, readonly string[]>>> = SECTION_WORD_FIGURES[lang]
        for (const word of wordFigures[section] ?? []) {
          expect(text, `figure ${word}`).toContain(word)
        }
      })
    }

    const headingFigures: Readonly<Record<string, readonly string[]>> = HEADING_FIGURES[lang]
    for (const [section, figures] of Object.entries(headingFigures)) {
      test(`states the paper's figures in the ${section} heading`, async ({ page }) => {
        await page.goto(path)
        const heading = normalize(await page.locator(`section#${section} > h2`).innerText())
        for (const figure of figures) {
          expect(heading).toContain(figure)
        }
      })
    }
  })
}

test('names the grants as the paper prints them', async ({ page }) => {
  await page.goto('/')
  const text = normalize(await page.locator('section#acknowledgments').innerText())
  for (const grant of GRANT_NUMBERS) {
    expect(text).toContain(`No. ${grant}`)
  }
})

// The Chinese acknowledgment follows the funders' own Chinese statements, which
// print the two numbers differently, so only the numbers themselves are checked.
test('names both grant numbers on the Chinese page', async ({ page }) => {
  await page.goto('/zh/')
  const text = normalize(await page.locator('section#acknowledgments').innerText())
  for (const grant of GRANT_NUMBERS) {
    expect(text).toContain(grant)
  }
})
