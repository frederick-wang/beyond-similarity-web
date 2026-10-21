import { absoluteUrl, pageLanguages, pages, type PageLanguage } from '../data/paper'

export interface LanguageAlternate {
  readonly hreflang: PageLanguage | 'x-default'
  readonly href: string
}

/**
 * The hreflang alternates that every language page declares in its head and
 * in its sitemap entry: each language version, itself included, and
 * x-default, which sends readers whose language has no page to the English
 * page. With a single language there is nothing to declare, and the list is
 * empty.
 */
export function languageAlternates(): readonly LanguageAlternate[] {
  if (pageLanguages.length < 2) {
    return []
  }
  return pageLanguages
    .map((lang): LanguageAlternate => ({ hreflang: lang, href: absoluteUrl(pages[lang].path) }))
    .concat([{ hreflang: 'x-default', href: absoluteUrl(pages.en.path) }])
}
