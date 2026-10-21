import { marked } from 'marked'
import type { InlineMarkdown } from '../content/types'
import type { PageLanguage } from '../data/paper'
import { quotationIds, quotations, type QuotationId } from '../data/quotations'

// Quotation marks around a classical Chinese quotation follow the language of
// the page it sits in: curly quotes in English prose, as the paper prints
// them, corner brackets in Chinese prose.
const quotationMarks: Readonly<Record<PageLanguage, { readonly open: string; readonly close: string }>> = {
  en: { open: '“', close: '”' },
}

const quotationToken = /\{\{([A-Za-z]+)\}\}/g

function isQuotationId(id: string): id is QuotationId {
  return (quotationIds as readonly string[]).includes(id)
}

/**
 * Replaces each `{{quotationId}}` with the quotation as an HTML span carrying
 * the language and script of its source edition. An unknown id fails the
 * build, so a typo cannot ship as literal braces.
 */
function expandQuotations(text: InlineMarkdown, lang: PageLanguage): string {
  const marks = quotationMarks[lang]
  return text.replace(quotationToken, (_token, id: string) => {
    if (!isQuotationId(id)) {
      throw new Error(`Unknown quotation id "${id}" in page copy`)
    }
    const quotation = quotations[id]
    return `${marks.open}<span class="classical" lang="zh-${quotation.script}" data-quotation="${id}">${quotation.text}</span>${marks.close}`
  })
}

/** Renders the inline Markdown used in page copy to HTML. */
export function renderInline(text: InlineMarkdown, lang: PageLanguage): string {
  return marked.parseInline(expandQuotations(text, lang), { async: false })
}
