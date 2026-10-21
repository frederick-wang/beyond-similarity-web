import { Lexer, marked, type Token } from 'marked'
import type { InlineMarkdown } from '../content/types'
import type { PageLanguage } from '../data/paper'
import { quotationIds, quotations, type Quotation, type QuotationId } from '../data/quotations'

// Quotation marks around a classical Chinese quotation follow the language of
// the page it sits in: curly quotes in English prose, as the paper prints
// them, corner brackets in Chinese prose.
const quotationMarks: Readonly<Record<PageLanguage, { readonly open: string; readonly close: string }>> = {
  en: { open: '“', close: '”' },
  'zh-Hans': { open: '「', close: '」' },
}

const quotationToken = /\{\{([A-Za-z]+)\}\}/g

function isQuotationId(id: string): id is QuotationId {
  return quotationIds.some((candidate) => candidate === id)
}

/**
 * Replaces each `{{quotationId}}` with what `render` makes of that quotation,
 * wrapped in the page language's quotation marks. An unknown id fails the
 * build, so a typo cannot ship as literal braces.
 */
function replaceQuotations(
  text: InlineMarkdown,
  lang: PageLanguage,
  render: (id: QuotationId, quotation: Quotation) => string,
): string {
  const marks = quotationMarks[lang]
  return text.replace(quotationToken, (_token, id: string) => {
    if (!isQuotationId(id)) {
      throw new Error(`Unknown quotation id "${id}" in page copy`)
    }
    return `${marks.open}${render(id, quotations[id])}${marks.close}`
  })
}

/**
 * Renders the inline Markdown used in page copy to HTML. A quotation becomes a
 * span carrying the language and script of its source edition.
 */
export function renderInline(text: InlineMarkdown, lang: PageLanguage): string {
  const html = replaceQuotations(
    text,
    lang,
    (id, quotation) => `<span class="classical" lang="zh-${quotation.script}" data-quotation="${id}">${quotation.text}</span>`,
  )
  return marked.parseInline(html, { async: false })
}

/**
 * The same inline Markdown as plain text, for places that cannot carry markup,
 * such as the abstract in the structured data. Emphasis and link markup drop
 * away and their text stays; a quotation becomes its text in quotation marks,
 * as on the page. Markup with no plain-text form (raw HTML, images) throws, so
 * copy never loses words silently.
 */
export function plainText(text: InlineMarkdown, lang: PageLanguage): string {
  return Lexer.lexInline(replaceQuotations(text, lang, (_id, quotation) => quotation.text))
    .map(tokenText)
    .join('')
}

function tokenText(token: Token): string {
  switch (token.type) {
    case 'text':
    case 'codespan':
    case 'escape':
      return token.text
    case 'em':
    case 'strong':
    case 'del':
    case 'link': {
      // marked types every token as possibly an extension token without
      // children, though its own emphasis and link tokens always have them.
      const children = token.tokens
      if (children === undefined) {
        throw new Error(`Inline Markdown "${token.raw}" has no child tokens`)
      }
      return children.map(tokenText).join('')
    }
    default:
      throw new Error(`Inline Markdown "${token.raw}" has no plain-text form`)
  }
}
