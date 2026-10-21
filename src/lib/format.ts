// Node runs this module unbundled for scripts/make-site-images.ts; a CI step imports the image scripts to check it.

import type { PageLanguage, Quantity } from '../data/paper'

// Per-language number typography. English ranges take an en dash and
// multiples take "×". Counts group thousands with a comma in every language,
// which is also the Chinese convention for numbers of five digits or more.
const rangeSeparator: Readonly<Record<PageLanguage, string>> = { en: '–' }
const multipleSuffix: Readonly<Record<PageLanguage, string>> = { en: '×' }
const listLocale: Readonly<Record<PageLanguage, string>> = { en: 'en' }
// Year formats differ in shape, not only in suffix (Chinese puts the era
// first), so each language supplies a function. A no-break space keeps an
// English year and its era on one line.
const yearFormat: Readonly<Record<PageLanguage, (year: number) => string>> = {
  en: (year) => (year < 0 ? `${-year}\u00a0BCE` : `${year}\u00a0CE`),
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

/** A calendar year with its era, as in "91 BCE" or "1739 CE"; negative years are BCE. */
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
