import { Lexer, marked, type Token } from 'marked'
import type { InlineMarkdown } from '../content/types'
import type { PageLanguage } from '../data/paper'
import { quotationIds, quotations, type Quotation, type QuotationId } from '../data/quotations'
import { tieUnits } from './typography'

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
    tieUnits(text),
    lang,
    (id, quotation) => `<span class="classical" lang="zh-${quotation.script}" data-quotation="${id}">${quotation.text}</span>`,
  )
  return marked.parseInline(html, { async: false })
}

/**
 * The same inline Markdown for the Markdown version of the page. Emphasis,
 * links and code spans stay as written; a quotation becomes its text in the
 * page language's quotation marks, as on the page. A quotation that Markdown
 * would read as syntax stops the build.
 */
export function markdownText(text: InlineMarkdown, lang: PageLanguage): string {
  return replaceQuotations(text, lang, (id, quotation) => markdownLiteral(quotation.text, `Quotation "${id}"`))
}

// What Markdown can read as syntax inside a line of text: a backslash escape,
// a code span, emphasis or strikethrough (an underscore only at a word
// boundary: between two letters or digits it cannot open or close emphasis,
// as in find_position), a link or image, raw HTML or an autolink, an entity
// reference, or a line break, which ends a heading or a table row and can
// start a new block.
const markdownSyntax =
  /[\\`*~[\]\r\n]|(?<![\p{L}\p{N}])_|_(?![\p{L}\p{N}])|<(?=[A-Za-z/!?])|&(?:#\d+|#[Xx][\dA-Fa-f]+|[A-Za-z][A-Za-z\d]*);/u

/**
 * Text that goes into Markdown as it stands, such as a quotation, a label or a
 * figure's text alternative, returned unchanged. Text that Markdown would read
 * as syntax throws, naming `what`, so the Markdown never renders other words
 * than the page.
 */
export function markdownLiteral(text: string, what: string): string {
  const syntax = markdownSyntax.exec(text)
  if (syntax !== null) {
    throw new Error(`${what} contains ${JSON.stringify(syntax[0])}, which Markdown would read as syntax: ${text}`)
  }
  return text
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
