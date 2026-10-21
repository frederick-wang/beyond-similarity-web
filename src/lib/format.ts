import type { PageLanguage, Quantity } from '../data/paper'

// Per-language number typography. English ranges take an en dash and
// multiples take "×". Counts group thousands with a comma in every language,
// which is also the Chinese convention for numbers of five digits or more.
const rangeSeparator: Readonly<Record<PageLanguage, string>> = { en: '–' }
const multipleSuffix: Readonly<Record<PageLanguage, string>> = { en: '×' }
const listLocale: Readonly<Record<PageLanguage, string>> = { en: 'en' }
const eraSuffix: Readonly<Record<PageLanguage, { readonly bce: string; readonly ce: string }>> = {
  en: { bce: ' BCE', ce: ' CE' },
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
  return year < 0 ? `${-year}${eraSuffix[lang].bce}` : `${year}${eraSuffix[lang].ce}`
}

export function formatList(items: readonly string[], lang: PageLanguage): string {
  return new Intl.ListFormat(listLocale[lang], { type: 'conjunction' }).format(items)
}
