// The single source of paper facts, following arXiv:2607.27595v1. Everything
// the page states as a fact outside long-form section prose reads from here:
// the title block, the finding, "At a glance", the meta description, the
// BibTeX entry, the citation tags, the structured data, the share card and the
// sitemap.

/** The language pages, as BCP 47 tags. */
export const pageLanguages = ['en'] as const
export type PageLanguage = (typeof pageLanguages)[number]

declare const isoDateBrand: unique symbol

/** A real calendar date written YYYY-MM-DD. Only isoDate() makes one. */
export type IsoDate = string & { readonly [isoDateBrand]: true }

function isIsoDate(value: string): value is IsoDate {
  const parsed = new Date(`${value}T00:00:00Z`)
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

/** The date, checked; anything that is not a real YYYY-MM-DD date stops the build. */
export function isoDate(value: string): IsoDate {
  if (!isIsoDate(value)) {
    throw new Error(`"${value}" is not a calendar date written YYYY-MM-DD`)
  }
  return value
}

/** Affiliation numbers as printed in the paper; the tuple fixes their order. */
export const affiliationIds = [1, 2] as const
export type AffiliationId = (typeof affiliationIds)[number]

export interface Affiliation {
  readonly nameEn: string
}

export interface Author {
  readonly nameEn: string
  readonly givenNameEn: string
  readonly familyNameEn: string
  readonly affiliations: readonly AffiliationId[]
  readonly corresponding: boolean
  readonly homepage: string | null
}

/** Numbers in "At a glance"; the tuple fixes their order on the page. */
export const glanceIds = ['benchmark', 'precision', 'costSpread', 'corpusRun'] as const
export type GlanceId = (typeof glanceIds)[number]

export type Quantity =
  | { readonly kind: 'count'; readonly value: number }
  | { readonly kind: 'percentRange'; readonly low: number; readonly high: number; readonly decimals: number }
  | { readonly kind: 'multiple'; readonly value: number }

export interface PageFacts {
  readonly path: string
  /**
   * The date of the page's last substantive change: new or corrected text,
   * numbers, figures or tables, not styling or code. sitemap.xml gives it as
   * the page's lastmod.
   */
  readonly updated: IsoDate
}

// A Record keyed by every AffiliationId, so dropping an affiliation that an
// author still cites fails the type check instead of rendering a dangling mark.
export const affiliations = {
  1: { nameEn: 'Department of Information Management, Peking University, Beijing, China' },
  2: { nameEn: 'Research Center for Digital Humanities, Peking University, Beijing, China' },
} as const satisfies Readonly<Record<AffiliationId, Affiliation>>

export const authors = [
  {
    nameEn: 'Zhaoji Wang',
    givenNameEn: 'Zhaoji',
    familyNameEn: 'Wang',
    affiliations: [1, 2],
    corresponding: false,
    homepage: 'https://www.zhaoji.ac.cn/',
  },
  {
    nameEn: 'Wanyu Si',
    givenNameEn: 'Wanyu',
    familyNameEn: 'Si',
    affiliations: [1, 2],
    corresponding: false,
    homepage: null,
  },
  {
    nameEn: 'Jun Wang',
    givenNameEn: 'Jun',
    familyNameEn: 'Wang',
    affiliations: [1, 2],
    corresponding: true,
    homepage: 'https://pkudh.org/member/wangjun2025.html',
  },
] as const satisfies readonly Author[]

/** The author who maintains this page. */
export const maintainer: Author = authors[0]

export const paper = {
  titleEn:
    'Beyond Similarity: Grounded Agentic Extraction and Expert-Adjudicated Evaluation of Intertextuality in Classical Chinese Histories',
  shortTitle: 'Beyond Similarity',
  arxivId: '2607.27595',
  arxivVersion: 'v1',
  primaryClass: 'cs.CL',
  doi: '10.48550/arXiv.2607.27595',
  /** arXiv v1 submission date. */
  published: isoDate('2026-07-30'),
  /** The language the paper is written in (BCP 47), the same on every language page. */
  language: 'en',
  bibtexKey: 'wang2026beyond',
} as const

/** The twelve models of the study, in the order of Table 2. */
export const modelNames = [
  'doubao-2.1-turbo',
  'deepseek-v4-pro',
  'glm-5-turbo',
  'deepseek-v4-flash',
  'doubao-2.1-pro',
  'qwen3.7-plus',
  'gemini-3.1-flash-lite',
  'glm-5.2',
  'qwen3.7-max',
  'gpt-5.4-mini',
  'gpt-5.5',
  'claude-haiku-4.5',
] as const
export type ModelName = (typeof modelNames)[number]

/** Figures quoted on the first screen beside the "At a glance" values. */
export const stats = {
  benchmarkPairs: 2533,
  models: 12,
  /** The most precise of the twelve models, and the most expensive per valid pair (Table 2). */
  mostPreciseModel: 'doubao-2.1-turbo' satisfies ModelName,
  deploymentModel: 'deepseek-v4-flash' satisfies ModelName,
  /** Precision gap, in percentage points, between the most precise model and the deployment model. */
  precisionGapPoints: 4.9,
  /** Deployment model precision on the Analects–Book of Han benchmark, in percent. */
  deploymentPrecision: 88.0,
  /** The paper's estimate (PDF p. 5): at that precision, roughly one corpus-run pair in eight is spurious. */
  expectedSpuriousOneIn: 8,
  corpusComparisons: 65380,
  corpusPairs: 5766,
  /** Composition years of the earliest and latest of the Twenty-Four Histories; negative years are BCE. */
  compositionYears: { first: -91, last: 1739 },
} as const

export const glance = {
  benchmark: { kind: 'count', value: stats.benchmarkPairs },
  precision: { kind: 'percentRange', low: 55.9, high: 92.9, decimals: 1 },
  costSpread: { kind: 'multiple', value: 51 },
  corpusRun: { kind: 'count', value: stats.corpusPairs },
} as const satisfies Readonly<Record<GlanceId, Quantity>>

export const links = {
  doi: `https://doi.org/${paper.doi}`,
  arxivAbs: `https://arxiv.org/abs/${paper.arxivId}`,
  pdf: `https://arxiv.org/pdf/${paper.arxivId}${paper.arxivVersion}`,
  explorer: 'https://analects-24histories-intertext.pkudh.net/',
  icpRegistry: 'https://beian.miit.gov.cn/',
} as const

/** A page of the arXiv v1 PDF, which has nine. */
export type PdfPage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/** The arXiv v1 PDF opened at a given page, for source links after a paragraph. */
export function pdfPageUrl(page: PdfPage): string {
  return `${links.pdf}#page=${page}`
}

export const icpNumber = '蜀ICP备19032431号-3'

export const copyrightYear = 2026

export const pages = {
  en: { path: '/', updated: isoDate('2026-10-21') },
} as const satisfies Readonly<Record<PageLanguage, PageFacts>>

/** Resolves a site path against `site` in astro.config.mjs, the only place the origin is written. */
export function absoluteUrl(path: string): string {
  const origin = import.meta.env.SITE
  if (origin === undefined || origin === '') {
    throw new Error('`site` must be set in astro.config.mjs')
  }
  return new URL(path, origin).href
}

/** "Family, Given", the order BibTeX and citation metadata both take. */
export function familyFirst(author: Author): string {
  return `${author.familyNameEn}, ${author.givenNameEn}`
}

export function bibtex(): string {
  const authorList = authors.map(familyFirst).join(' and ')
  const fields: readonly (readonly [string, string])[] = [
    ['title', paper.titleEn],
    ['author', authorList],
    ['year', paper.published.slice(0, 4)],
    ['eprint', paper.arxivId],
    ['archivePrefix', 'arXiv'],
    ['primaryClass', paper.primaryClass],
    ['doi', paper.doi],
    ['url', links.arxivAbs],
  ]
  const width = Math.max(...fields.map(([name]) => name.length))
  const body = fields.map(([name, value]) => `  ${name.padEnd(width)} = {${value}}`).join(',\n')
  return `@misc{${paper.bibtexKey},\n${body}\n}`
}

/** The words on the share card, in reading order. */
export interface ShareCardWords {
  readonly shortTitle: string
  readonly title: string
  readonly authors: readonly string[]
  readonly arxivId: string
}

/**
 * The one source of the share card's words: scripts/make-site-images.ts
 * renders them and records them in the image, and each page builds the
 * image's alt text from them, so the card and its text alternative agree.
 */
export function shareCardWords(): ShareCardWords {
  return {
    shortTitle: paper.shortTitle,
    title: paper.titleEn,
    authors: authors.map((author) => author.nameEn),
    arxivId: paper.arxivId,
  }
}
