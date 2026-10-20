import type { PageLanguage } from '../content/types'
import type { Quantity } from '../data/paper'

// Number formatting follows each language's typography: an en dash for
// English ranges, a wave dash for Chinese ones, "×" against "倍".
const rangeSeparator: Readonly<Record<PageLanguage, string>> = { en: '–' }
const multipleSuffix: Readonly<Record<PageLanguage, string>> = { en: '×' }
const listLocale: Readonly<Record<PageLanguage, string>> = { en: 'en' }

export function formatQuantity(quantity: Quantity, lang: PageLanguage): string {
  switch (quantity.kind) {
    case 'count':
      return quantity.value.toLocaleString('en-US')
    case 'percentRange':
      return `${quantity.low.toFixed(quantity.decimals)}%${rangeSeparator[lang]}${quantity.high.toFixed(quantity.decimals)}%`
    case 'multiple':
      return `${quantity.value}${multipleSuffix[lang]}`
  }
}

export function formatList(items: readonly string[], lang: PageLanguage): string {
  return new Intl.ListFormat(listLocale[lang], { type: 'conjunction' }).format(items)
}
