import type { PageCopy, SourceRef } from '../content/types'
import { pdfPageUrl, type PdfPage } from '../data/paper'

export interface SourceLink {
  readonly label: string
  readonly href: string
}

/** A link to one page of the arXiv v1 PDF, labelled as the page writes it, as in "PDF p. 2". */
export function pageLink(copy: PageCopy, page: PdfPage): SourceLink {
  return { label: copy.sources.pages([page]), href: pdfPageUrl(page) }
}

/** A paragraph's source link: the part of the paper and its PDF pages, as in "Introduction · PDF p. 1", opening the first of those pages. */
export function sourceLink(copy: PageCopy, source: SourceRef): SourceLink {
  return {
    label: `${copy.sources.parts[source.part]} · ${copy.sources.pages(source.pages)}`,
    href: pdfPageUrl(source.pages[0]),
  }
}
