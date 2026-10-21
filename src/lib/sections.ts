import type { Section } from '../content/types'

export interface NumberedSection {
  readonly section: Section
  /** Position among the question sections, from 1; null for plain sections. */
  readonly number: number | null
}

/** Numbers the question sections in reading order; the page body and the navigation share these numbers. */
export function numberQuestions(sections: readonly Section[]): readonly NumberedSection[] {
  let count = 0
  return sections.map((section) => {
    if (section.kind === 'question') {
      count += 1
      return { section, number: count }
    }
    return { section, number: null }
  })
}
