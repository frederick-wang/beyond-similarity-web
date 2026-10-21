import type { ImageMetadata } from 'astro'
import type { FigureId } from '../data/figures'
import type { GlanceId, PageLanguage, PdfPage } from '../data/paper'
import type { DimensionId, DominantCategoryId, TableId } from '../data/tables'

/**
 * Inline Markdown: emphasis (`*Analects*`), links (`[text](url)`), code spans
 * for identifiers such as model names, and `{{quotationId}}` for a classical
 * Chinese quotation from src/data/quotations.ts. Kept as Markdown so the same
 * string can feed both the HTML page and the Markdown mirror without a second
 * copy of the prose.
 */
export type InlineMarkdown = string

export type QuestionSectionId = 'gap' | 'method' | 'benchmark' | 'similarity' | 'models' | 'histories'
export type PlainSectionId = 'abstract' | 'limitations' | 'using' | 'cite' | 'acknowledgments'
export type SectionId = QuestionSectionId | PlainSectionId

/** Sections of the paper a source link can point to; each language names them. */
export type PaperPart = 'introduction' | 'protocol' | 'evaluation' | 'scaling' | 'discussion'

/** A link to the pages of the arXiv v1 PDF that support a paragraph: one page, or a first and last page. */
export interface SourceRef {
  readonly part: PaperPart
  readonly pages: readonly [PdfPage] | readonly [PdfPage, PdfPage]
}

export type SubsectionId = 'worked-example' | 'mix' | 'marking' | 'function' | 'fidelity' | 'asymmetric'

export type Block =
  | { readonly type: 'abstract' }
  | { readonly type: 'paragraph'; readonly text: InlineMarkdown; readonly sources: readonly SourceRef[] }
  | { readonly type: 'subheading'; readonly id: SubsectionId; readonly text: InlineMarkdown }
  | { readonly type: 'figure'; readonly figure: FigureId }
  | { readonly type: 'table'; readonly table: TableId }
  | { readonly type: 'bibtex' }

/** A question section's heading is the question, and its first sentence is the answer. */
export interface QuestionSection {
  readonly kind: 'question'
  readonly id: QuestionSectionId
  readonly heading: InlineMarkdown
  readonly answer: InlineMarkdown
  readonly blocks: readonly Block[]
}

export interface PlainSection {
  readonly kind: 'plain'
  readonly id: PlainSectionId
  readonly heading: InlineMarkdown
  readonly blocks: readonly Block[]
}

export type Section = QuestionSection | PlainSection

export interface LinkLabels {
  readonly arxiv: string
  readonly pdf: string
  readonly explorer: string
  readonly cite: string
}

export interface CopyButtonLabels {
  readonly idle: string
  readonly done: string
  readonly failed: string
}

export interface FooterCopy {
  readonly rights: string
  readonly maintainedBy: string
}

export interface SourceCopy {
  /** Introduces a paragraph's source links, as in "Source:". */
  readonly lead: string
  readonly parts: Readonly<Record<PaperPart, string>>
  /** Formats a PDF page reference, as in "PDF p. 4" or "PDF pp. 4–5". */
  readonly pages: (pages: SourceRef['pages']) => string
}

export interface FigureCopy {
  readonly label: string
  readonly alt: string
  readonly caption: InlineMarkdown
}

export interface FiguresCopy {
  /** Text of the link that opens a figure at full size. */
  readonly openFull: string
  readonly items: Readonly<Record<FigureId, FigureCopy>>
}

export interface AgreementTableCopy {
  readonly label: string
  readonly caption: InlineMarkdown
  readonly headers: { readonly dimension: string; readonly observed: string; readonly chance: string; readonly kappa: string }
  readonly dimensions: Readonly<Record<DimensionId, string>>
}

export interface ModelsTableCopy {
  readonly label: string
  readonly caption: InlineMarkdown
  readonly headers: {
    readonly model: string
    readonly candidates: string
    readonly valid: string
    readonly precision: string
    readonly cost: string
    readonly costPerValid: string
    readonly latency: string
  }
  readonly total: string
}

export interface DiachronicTableCopy {
  readonly label: string
  readonly caption: InlineMarkdown
  readonly headers: {
    readonly dimension: string
    readonly dominant: string
    readonly early: string
    readonly late: string
    readonly rho: string
    readonly p: string
  }
  readonly dimensions: Readonly<Record<DimensionId, string>>
  readonly dominant: Readonly<Record<DominantCategoryId, string>>
}

export interface TablesCopy {
  /** Accessible name suffix for a table's horizontally scrolling region, as in "Table 2, scrolls horizontally". */
  readonly scrollRegion: (label: string) => string
  readonly agreement: AgreementTableCopy
  readonly models: ModelsTableCopy
  readonly diachronic: DiachronicTableCopy
}

/** A locale as Open Graph writes it, language_TERRITORY, such as en_US. */
export type OpenGraphLocale = `${Lowercase<string>}_${Uppercase<string>}`

/** The card that link previews show for the page (og:image), made by scripts/make-site-images.ts. */
export interface ShareImage {
  readonly image: ImageMetadata
  /** The words on the card, for readers who cannot see it. */
  readonly alt: string
}

export interface PageCopy {
  readonly lang: PageLanguage
  readonly title: string
  readonly description: string
  /** The site's name in the page's language, for link previews (og:site_name). */
  readonly siteName: string
  readonly openGraphLocale: OpenGraphLocale
  readonly shareImage: ShareImage
  readonly skipLink: string
  readonly correspondingNote: string
  readonly finding: InlineMarkdown
  /** The arXiv abstract, verbatim. */
  readonly abstract: InlineMarkdown
  readonly glanceHeading: string
  readonly glance: Readonly<Record<GlanceId, InlineMarkdown>>
  readonly navHeading: string
  readonly links: LinkLabels
  readonly copyButton: CopyButtonLabels
  readonly bibtexLabel: string
  readonly sources: SourceCopy
  readonly figures: FiguresCopy
  readonly tables: TablesCopy
  readonly sections: readonly Section[]
  readonly footer: FooterCopy
}
