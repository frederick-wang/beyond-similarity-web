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
