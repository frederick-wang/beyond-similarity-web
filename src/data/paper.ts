// The single source of paper facts. Pages, metadata, structured data and
// machine-readable text read these values; nothing else may restate them.
// Values follow arXiv:2607.27595v1.

export type AffiliationId = 1 | 2

export interface Affiliation {
  readonly id: AffiliationId
  readonly nameEn: string
  readonly nameZh: string
  readonly url: string
}

export interface Author {
  readonly nameEn: string
  readonly nameZh: string
  readonly givenNameEn: string
  readonly familyNameEn: string
  readonly affiliations: readonly AffiliationId[]
  readonly corresponding: boolean
  readonly homepage: string | null
}

export type GlanceId = 'benchmark' | 'precision' | 'costSpread' | 'corpusRun'

export type Quantity =
  | { readonly kind: 'count'; readonly value: number }
  | { readonly kind: 'percentRange'; readonly low: number; readonly high: number; readonly decimals: number }
  | { readonly kind: 'multiple'; readonly value: number }

export interface GlanceEntry {
  readonly id: GlanceId
  readonly quantity: Quantity
}

export interface PageFacts {
  readonly path: string
  /** Date of the last substantive content change (YYYY-MM-DD), for sitemap and structured data. */
  readonly updated: string
}

export const affiliations: readonly Affiliation[] = [
  {
    id: 1,
    nameEn: 'Department of Information Management, Peking University, Beijing, China',
    nameZh: '北京大学信息管理系',
    url: 'https://im.pku.edu.cn/',
  },
  {
    id: 2,
    nameEn: 'Research Center for Digital Humanities, Peking University, Beijing, China',
    nameZh: '北京大学数字人文研究中心',
    url: 'https://pkudh.org/',
  },
]

export const authors = [
  {
    nameEn: 'Zhaoji Wang',
    nameZh: '王兆基',
    givenNameEn: 'Zhaoji',
    familyNameEn: 'Wang',
    affiliations: [1, 2],
    corresponding: false,
    homepage: 'https://www.zhaoji.ac.cn/',
  },
  {
    nameEn: 'Wanyu Si',
    nameZh: '司宛玉',
    givenNameEn: 'Wanyu',
    familyNameEn: 'Si',
    affiliations: [1, 2],
    corresponding: false,
    homepage: null,
  },
  {
    nameEn: 'Jun Wang',
    nameZh: '王军',
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
  titleZh: '超越相似度：古代中国史书互文的落地化智能体抽取与专家仲裁评测',
  shortTitle: 'Beyond Similarity',
  arxivId: '2607.27595',
  arxivVersion: 'v1',
  primaryClass: 'cs.CL',
  categories: ['cs.CL', 'cs.AI', 'cs.DL'],
  doi: '10.48550/arXiv.2607.27595',
  /** arXiv v1 submission date (YYYY-MM-DD). */
  published: '2026-07-30',
  bibtexKey: 'wang2026beyond',
} as const

export const links = {
  arxivAbs: `https://arxiv.org/abs/${paper.arxivId}`,
  pdf: `https://arxiv.org/pdf/${paper.arxivId}${paper.arxivVersion}`,
  doi: `https://doi.org/${paper.doi}`,
  explorer: 'https://analects-24histories-intertext.pkudh.net/',
  icpRegistry: 'https://beian.miit.gov.cn/',
} as const

export const icpNumber = '蜀ICP备19032431号-3'

export const site = {
  origin: 'https://beyond-similarity.zhaoji.ac.cn',
  copyrightYear: 2026,
} as const

export const pages = {
  en: { path: '/', updated: '2026-10-21' },
} as const satisfies Record<string, PageFacts>

export const glance: readonly GlanceEntry[] = [
  { id: 'benchmark', quantity: { kind: 'count', value: 2533 } },
  { id: 'precision', quantity: { kind: 'percentRange', low: 55.9, high: 92.9, decimals: 1 } },
  { id: 'costSpread', quantity: { kind: 'multiple', value: 51 } },
  { id: 'corpusRun', quantity: { kind: 'count', value: 5766 } },
]

export function absoluteUrl(path: string): string {
  return new URL(path, site.origin).href
}

/** The arXiv v1 PDF opened at a given page, for source links. */
export function pdfPageUrl(page: number): string {
  return `${links.pdf}#page=${page}`
}

export function bibtex(): string {
  const authorList = authors.map((author) => `${author.familyNameEn}, ${author.givenNameEn}`).join(' and ')
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
