import { expect, test } from '@playwright/test'
import { multiDigitNumbers, numbersOutside, occurrences } from './numbers'
import {
  GRANT_NUMBERS,
  HEADING_FIGURES,
  PAGES,
  SECTION_FIGURES,
  SECTION_FIGURES_ZH_OVERRIDES,
  SECTION_PHRASES,
  SECTION_WORD_FIGURES,
  normalize,
  type PageLanguage,
  type ProseSectionId,
  type SectionId,
} from './paper-literals'

// Section prose states the paper's numbers as text rather than reading them
// from the facts module. For each section, the abstract included, the numbers
// in its answer and paragraphs (tables and captions are tested elsewhere) must
// be exactly the literals copied from the paper: a wrong number fails, and so
// does a number added to the prose without being checked against the paper.
// Both language pages are held to the same lists. Numbers written as words,
// single digits and paired numbers are checked as the phrases
// tests/paper-literals.ts lists, and every number written in digits must lie
// inside one of them, so a number cannot change or move unnoticed.

type Section = ProseSectionId

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
        const wordFigures: Readonly<Partial<Record<ProseSectionId, readonly string[]>>> = SECTION_WORD_FIGURES[lang]
        const sectionPhrases: Readonly<Partial<Record<ProseSectionId, readonly string[]>>> = SECTION_PHRASES[lang]
        const phrases = (wordFigures[section] ?? []).concat(sectionPhrases[section] ?? [])
        // Once each: a phrase found twice would let one of its places change unnoticed.
        for (const phrase of phrases) {
          expect(occurrences(text, phrase), `phrase ${phrase}`).toHaveLength(1)
        }
        expect(numbersOutside(text, phrases), 'numbers outside every listed phrase').toEqual([])
      })
    }

    const headingFigures: Readonly<Partial<Record<SectionId, readonly string[]>>> = HEADING_FIGURES[lang]
    for (const [section, figures] of Object.entries(headingFigures)) {
      test(`states the paper's figures in the ${section} headings`, async ({ page }) => {
        await page.goto(path)
        const headings = normalize((await page.locator(`section#${section} > h2, section#${section} > h3`).allInnerTexts()).join(' '))
        for (const figure of figures) {
          expect(occurrences(headings, figure), `heading figure ${figure}`).toHaveLength(1)
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
