import { marked } from 'marked'
import type { InlineMarkdown } from '../content/types'

/** Renders the inline Markdown used in page copy (emphasis and links) to HTML. */
export function renderInline(text: InlineMarkdown): string {
  return marked.parseInline(text, { async: false })
}
