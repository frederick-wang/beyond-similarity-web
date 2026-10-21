import type { InlineMarkdown } from '../content/types'

// A line may not break inside a unit the reader takes in at once: a figure or
// table label and its number, a statistic and its value, a number and its
// unit, a panel label and its text. Each such space becomes a no-break space.
// Only the HTML pages apply this; the Markdown bodies and the structured data
// keep the copy's plain spaces.
const ties: readonly (readonly [RegExp, string])[] = [
  [/\b(Figures?|Tables?) (\d)/g, '$1\u00a0$2'],
  [/([图表]) (\d)/g, '$1\u00a0$2'],
  [/(?<![\p{L}\p{N}])([pρkn]) ([<=>≤≥]) (?=[−\d.])/gu, '$1\u00a0$2\u00a0'],
  [/(\d) (s)(?=[\s),.;:])/g, '$1\u00a0$2'],
  [/(\d) (?=\p{Script=Han})/gu, '$1\u00a0'],
  [/第 (\d)/g, '第\u00a0$1'],
  [/\(([a-d])\) /g, '($1)\u00a0'],
]

/** The copy with the spaces inside such units made no-break. */
export function tieUnits(text: InlineMarkdown): InlineMarkdown {
  return ties.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), text)
}
