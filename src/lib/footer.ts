import type { PageCopy } from '../content/types'
import { authorName, authors, copyrightYear } from '../data/paper'
import { formatList, punctuationFor } from './format'

/** The copyright line in the page's language: the year, the authors as holders, and what the rights cover. */
export function copyrightLine(copy: PageCopy): string {
  const marks = punctuationFor(copy.lang)
  const holders = formatList(
    authors.map((author) => authorName(author, copy.lang)),
    copy.lang,
  )
  return `© ${copyrightYear} ${holders}${marks.fullStop}${marks.join}${copy.footer.rights}`
}
