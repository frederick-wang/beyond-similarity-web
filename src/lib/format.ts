// Node runs this module unbundled for scripts/make-site-images.ts; a CI step imports the image scripts to check it.

import type { PageLanguage, Quantity } from '../data/paper'

// Per-language number typography. English ranges take an en dash and
// multiples take "×"; Chinese ranges take a full-width tilde and multiples
// 倍 after a space, as in 「51 倍」. Counts group thousands with a comma in
// every language, which is also the Chinese convention for numbers of five
// digits or more.
const rangeSeparator: Readonly<Record<PageLanguage, string>> = { en: '–', 'zh-Hans': '～' }
const multipleSuffix: Readonly<Record<PageLanguage, string>> = { en: '×', 'zh-Hans': '\u00a0倍' }
const listLocale: Readonly<Record<PageLanguage, string>> = { en: 'en', 'zh-Hans': 'zh' }
// Year formats differ in shape, not only in suffix (Chinese puts the era
// first), so each language supplies a function. No-break spaces keep a year
// and its era on one line, and in Chinese keep 公元前 and 年 with the number.
const yearFormat: Readonly<Record<PageLanguage, (year: number) => string>> = {
  en: (year) => (year < 0 ? `${-year}\u00a0BCE` : `${year}\u00a0CE`),
  'zh-Hans': (year) => (year < 0 ? `公元前\u00a0${-year}\u00a0年` : `${year}\u00a0年`),
}

/** Punctuation that a component places between pieces of copy. */
export interface Punctuation {
  /** Ends a sentence the component completes, as in "Maintained by Zhaoji Wang." */
  readonly fullStop: string
  /**
   * Joins a sentence, or a lead such as "Source:", to the text after it: a
   * space in English, nothing in Chinese, whose full-width punctuation at the
   * end of the first piece carries its own spacing.
   */
  readonly join: string
  /** Separates the author names in the title block. */
  readonly authorSeparator: string
  /** Separates two source links after a paragraph. */
  readonly sourceSeparator: string
  /** Closes the label of a figure or table caption, as the period in "Figure 1.". */
  readonly labelEnd: string
  /**
   * Joins a quantity of "At a glance" to its text in the Markdown version,
   * where no layout sets them apart: a space in English, and a full-width
   * colon in Chinese, which does not separate characters with spaces.
   */
  readonly glanceJoin: string
}

const punctuation: Readonly<Record<PageLanguage, Punctuation>> = {
  en: { fullStop: '.', join: ' ', authorSeparator: ', ', sourceSeparator: '; ', labelEnd: '.', glanceJoin: ' ' },
  'zh-Hans': { fullStop: '。', join: '', authorSeparator: '、', sourceSeparator: '；', labelEnd: '', glanceJoin: '：' },
}

export function punctuationFor(lang: PageLanguage): Punctuation {
  return punctuation[lang]
}

export function formatCount(value: number): string {
  return value.toLocaleString('en-US')
}

/** An identifier such as a model name, as a Markdown code span; the page keeps it on one line. */
export function formatIdentifier(name: string): string {
  return `\`${name}\``
}

export function formatQuantity(quantity: Quantity, lang: PageLanguage): string {
  switch (quantity.kind) {
    case 'count':
      return formatCount(quantity.value)
    case 'percentRange':
      return `${quantity.low.toFixed(quantity.decimals)}%${rangeSeparator[lang]}${quantity.high.toFixed(quantity.decimals)}%`
    case 'multiple':
      return `${quantity.value}${multipleSuffix[lang]}`
  }
}

/** A calendar year with its era, as in "91 BCE" or "1739 CE", 「公元前 91 年」 or 「1739 年」; negative years are BCE. */
export function formatYear(year: number, lang: PageLanguage): string {
  return yearFormat[lang](year)
}

export function formatList(items: readonly string[], lang: PageLanguage): string {
  return new Intl.ListFormat(listLocale[lang], { type: 'conjunction' }).format(items)
}

/**
 * The share card's author line, an English list such as "A, B, and C": the
 * card is in English on every page. scripts/make-site-images.ts renders it,
 * and each page's alt text for the card uses it too.
 */
export function shareCardByline(authors: readonly string[]): string {
  return formatList(authors, 'en')
}

// Table cells follow the paper's typesetting in both languages: a true minus
// sign (U+2212) for negative values and p-values without a leading zero.

/** A percentage with one decimal, as in "87.3%". */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

/** A number with a fixed count of decimals and a true minus sign, as in "0.71" or "−0.07". */
export function formatDecimal(value: number, decimals: number): string {
  const text = Math.abs(value).toFixed(decimals)
  return value < 0 ? `−${text}` : text
}

/** A p-value with two decimals and no leading zero, as in ".73". */
export function formatPValue(value: number): string {
  if (value <= 0 || value >= 1) {
    throw new Error(`p-value out of range: ${value}`)
  }
  return value.toFixed(2).slice(1)
}
