import type { PageCopy } from '../content/types'
import { copyrightYear } from '../data/paper'
import { authorList } from './authors'
import { punctuationFor } from './format'

/** The copyright line in the page's language: the year, the authors as holders, and what the rights cover. */
export function copyrightLine(copy: PageCopy): string {
  const marks = punctuationFor(copy.lang)
  return `© ${copyrightYear} ${authorList(copy.lang)}${marks.fullStop}${marks.join}${copy.footer.rights}`
}
