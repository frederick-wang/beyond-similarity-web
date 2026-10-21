// Not in format.ts: Node runs format.ts unbundled for the image scripts, and
// it imports only types from the facts module.

import { authorName, authors, type PageLanguage } from '../data/paper'
import { formatList } from './format'

/** The authors in order as a list in the language's form, as in "A, B, and C" or 「A、B和C」. */
export function authorList(lang: PageLanguage): string {
  return formatList(
    authors.map((author) => authorName(author, lang)),
    lang,
  )
}
