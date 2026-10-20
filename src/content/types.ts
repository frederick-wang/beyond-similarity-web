import type { GlanceId } from '../data/paper'

export type PageLanguage = 'en'

/**
 * Inline Markdown: emphasis (`*Analects*`) and links (`[text](url)`) only.
 * Kept as Markdown so the same string can feed both the HTML page and the
 * Markdown mirror without a second copy of the prose.
 */
export type InlineMarkdown = string

export type SectionId = 'abstract' | 'cite'

export type Block =
  | { readonly type: 'paragraph'; readonly text: InlineMarkdown }
  | { readonly type: 'bibtex' }

export interface Section {
  readonly id: SectionId
  readonly heading: string
  readonly blocks: readonly Block[]
}

export interface LinkLabels {
  readonly arxiv: string
  readonly pdf: string
  readonly explorer: string
  readonly cite: string
}

export interface CopyLabels {
  readonly idle: string
  readonly done: string
  readonly failed: string
}

export interface FooterCopy {
  readonly rights: string
  readonly maintainedBy: string
}

export interface PageCopy {
  readonly lang: PageLanguage
  readonly title: string
  readonly description: string
  readonly skipLink: string
  readonly correspondingNote: string
  readonly finding: InlineMarkdown
  readonly glanceHeading: string
  readonly glance: Readonly<Record<GlanceId, InlineMarkdown>>
  readonly navHeading: string
  readonly links: LinkLabels
  readonly copy: CopyLabels
  readonly sections: readonly Section[]
  readonly footer: FooterCopy
}
