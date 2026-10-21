import type { PageCopy, SourceRef } from '../content/types'
import { pdfPageUrl } from '../data/paper'

export interface SourceLink {
  readonly label: string
  readonly href: string
}

/** A paragraph's source link: the part of the paper and its PDF pages, as in "Introduction · PDF p. 1", opening the first of those pages. */
export function sourceLink(copy: PageCopy, source: SourceRef): SourceLink {
  return {
    label: `${copy.sources.parts[source.part]} · ${copy.sources.pages(source.pages)}`,
    href: pdfPageUrl(source.pages[0]),
  }
}
