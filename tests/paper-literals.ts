// Expected values copied by hand from arXiv:2607.27595v1 (PDF). Tests compare
// the served pages against these literals, never against the facts module,
// so a wrong fact cannot pass by agreeing with itself.

export const TITLE =
  'Beyond Similarity: Grounded Agentic Extraction and Expert-Adjudicated Evaluation of Intertextuality in Classical Chinese Histories'

/** The short title, the site's name in the masthead and in link previews. */
export const SHORT_TITLE = 'Beyond Similarity'

export const AUTHORS = ['Zhaoji Wang', 'Wanyu Si', 'Jun Wang'] as const

/** The authors as "Family, Given", the form arXiv's own citation metadata uses. */
export const AUTHORS_FAMILY_FIRST = ['Wang, Zhaoji', 'Si, Wanyu', 'Wang, Jun'] as const

export const AFFILIATIONS = [
  'Department of Information Management, Peking University, Beijing, China',
  'Research Center for Digital Humanities, Peking University, Beijing, China',
] as const

/** The Chinese title, author names and affiliations, as the SPEC gives them for the Chinese page. */
export const TITLE_ZH = '超越相似度：古代中国史书互文的落地化智能体抽取与专家仲裁评测'
export const SHORT_TITLE_ZH = '超越相似度'
export const AUTHORS_ZH = ['王兆基', '司宛玉', '王军'] as const
export const AFFILIATIONS_ZH = ['北京大学信息管理系', '北京大学数字人文研究中心'] as const

/** The two language pages, as the SPEC places them, with the language each declares. */
export const PAGES = [
  { path: '/', lang: 'en' },
  { path: '/zh/', lang: 'zh-Hans' },
] as const
export type PageLanguage = (typeof PAGES)[number]['lang']

/** The sections of each language page in the SPEC's order, by the anchor both pages give them. */
export const SECTION_IDS = [
  'abstract',
  'gap',
  'method',
  'benchmark',
  'similarity',
  'models',
  'histories',
  'limitations',
  'using',
  'cite',
  'acknowledgments',
] as const
export type SectionId = (typeof SECTION_IDS)[number]

export const ABSTRACT =
  'Computational approaches to intertextuality have advanced from string matching to neural retrieval, yet their outputs, similarity scores and parallel-passage lists, identify where texts reuse one another without characterizing how or why. We recast fine-grained intertextuality extraction as an agentic task in which a large language model (LLM) reads two text units in full and, through a constrained tool interface, must ground each proposed reuse in exact character spans on both sides and label it under a five-dimension typology of reuse (form, aspect, source-marking, function, stance). We validate the approach on an exhaustive comparison of the Analects with the Book of Han, where three domain experts adjudicate a pooled multi-model candidate set into a benchmark of 2,533 intertextual pairs. Against this standard we study twelve LLMs, reporting precision (56%–93%), a 51× cost spread at comparable quality, and how well their confidence is calibrated. Expert agreement traces a reliability gradient: dimensions legible on the textual surface are annotated consistently, while those requiring inference of intent are contested, delimiting the claims such annotation supports. Scaling the validated extractor to the full Twenty-Four Histories (65,380 comparisons, 5,766 pairs) recovers corpus-level structure a similarity score cannot express. The interpretive composition of citation shows no systematic change across eighteen centuries, yet the same passage is quoted less and less literally. Stability in the aggregate with drift in the individual case is what a cultural-attraction account expects. We release the extraction protocol and the expert-adjudicated benchmark.'

/** First-screen figures copied from the paper, and the opening line of the BibTeX entry. */
export const BENCHMARK_PAIRS = '2,533'
export const PRECISION_RANGE = '55.9%–92.9%'
export const FIRST_HISTORY = '91 BCE'
export const LAST_HISTORY = '1739 CE'
/** The same figures as the SPEC writes them for the Chinese page. */
export const PRECISION_RANGE_ZH = '55.9%～92.9%'
export const COST_SPREAD_ZH = '51 倍'
export const FIRST_HISTORY_ZH = '公元前 91 年'
export const LAST_HISTORY_ZH = '1739 年'
export const BIBTEX_OPENING = '@misc{wang2026beyond,'

export const ARXIV_ID = '2607.27595'
export const ARXIV_ABS = 'https://arxiv.org/abs/2607.27595'
export const ARXIV_PDF_V1 = 'https://arxiv.org/pdf/2607.27595v1'
export const DOI = '10.48550/arXiv.2607.27595'
export const DOI_URL = 'https://doi.org/10.48550/arXiv.2607.27595'
/** arXiv v1 submission date, as ISO 8601 and in the slash form citation_publication_date takes. */
export const PUBLISHED = '2026-07-30'
export const PUBLISHED_SLASHED = '2026/07/30'
export const EXPLORER = 'https://analects-24histories-intertext.pkudh.net/'
export const SITE = 'https://beyond-similarity.zhaoji.ac.cn/'

/**
 * The date of each page's last substantive change, by path, as the sitemap
 * gives it in lastmod. Each language page adds its entry here.
 */
export const PAGE_UPDATED = {
  '/': '2026-10-21',
  '/zh/': '2026-10-21',
} as const
export const ICP_NUMBER = '蜀ICP备19032431号-3'
export const ICP_REGISTRY = 'https://beian.miit.gov.cn/'

/** What a test that runs on both language pages expects each page to say. */
export interface PageText {
  readonly title: string
  readonly shortTitle: string
  readonly authors: readonly string[]
  /** Each author entry of the title block as read: name, affiliation marks, and the separator after it. */
  readonly authorEntries: readonly string[]
  readonly affiliations: readonly string[]
  /** Phrases the finding states, with its bounded result. */
  readonly finding: readonly string[]
  /** The first and last composition years with their era, kept on one line by no-break spaces. */
  readonly findingYears: readonly string[]
  /** Evaluative words, and the claim of stability the evidence does not support. */
  readonly findingAvoids: RegExp
  readonly glanceHeading: string
  /** Numbers of "At a glance" with the objects and qualifiers that go with them. */
  readonly glance: readonly string[]
  /** The precision range of the twelve models, as the page writes a range. */
  readonly precisionRange: string
  readonly navHeading: string
  readonly abstractHeading: string
  readonly citeHeading: string
  readonly abstractOpening: string
  readonly copyButton: string
  readonly copied: string
  /** The footer's copyright and maintainer sentences, in full. */
  readonly footer: readonly [string, string]
}

/**
 * Each language page's text for the tests that run on both pages. Titles,
 * names, affiliations and figures are the paper's and the SPEC's; headings
 * and button labels are the page's own.
 */
export const PAGE_TEXT = {
  en: {
    title: TITLE,
    shortTitle: SHORT_TITLE,
    authors: AUTHORS,
    authorEntries: ['Zhaoji Wang1,2,', 'Wanyu Si1,2,', 'Jun Wang1,2*'],
    affiliations: AFFILIATIONS,
    finding: [`${BENCHMARK_PAIRS} expert-adjudicated pairs`, 'no systematic change', `from ${FIRST_HISTORY} to ${LAST_HISTORY}`],
    findingYears: [FIRST_HISTORY, LAST_HISTORY],
    findingAvoids: /\b(novel|powerful|significant(ly)?|robust(ly)?|comprehensive(ly)?|stable|stability)\b/i,
    glanceHeading: 'At a glance',
    // The cost ratio names its base, and the 1-in-8 estimate keeps its premise.
    glance: [
      BENCHMARK_PAIRS,
      'Analects',
      'Book of Han',
      PRECISION_RANGE,
      '12 LLMs',
      '51×',
      'doubao-2.1-turbo, relative to deepseek-v4-flash',
      '4.9 points less precise',
      '5,766',
      'deepseek-v4-flash extracted',
      '65,380',
      '88.0% precision on the Book of Han',
      'about 1 in 8',
    ],
    precisionRange: PRECISION_RANGE,
    navHeading: 'On this page',
    abstractHeading: 'Abstract',
    citeHeading: 'Cite',
    abstractOpening: 'Computational approaches',
    copyButton: 'Copy BibTeX',
    copied: 'Copied',
    footer: ['© 2026 Zhaoji Wang, Wanyu Si, and Jun Wang. Page text and figures: all rights reserved. Code: MIT License.', 'Maintained by Zhaoji Wang.'],
  },
  'zh-Hans': {
    title: TITLE_ZH,
    shortTitle: SHORT_TITLE_ZH,
    authors: AUTHORS_ZH,
    // Chinese separates the names with 、, not with an English comma.
    authorEntries: ['王兆基1,2、', '司宛玉1,2、', '王军1,2*'],
    affiliations: AFFILIATIONS_ZH,
    finding: [`${BENCHMARK_PAIRS} 条专家仲裁互文对`, '未检出系统性变化', '同一原文在较晚成书的史书中字面忠实度总体较低', `成书于${FIRST_HISTORY_ZH}至 ${LAST_HISTORY_ZH}`],
    findingYears: [FIRST_HISTORY_ZH, LAST_HISTORY_ZH],
    findingAvoids: /保持稳定|显著|强大|全面|巧妙/,
    glanceHeading: '一览',
    glance: [
      BENCHMARK_PAIRS,
      '《论语》',
      '《汉书》',
      PRECISION_RANGE_ZH,
      '12 个大语言模型',
      COST_SPREAD_ZH,
      'doubao-2.1-turbo 与 deepseek-v4-flash 每个有效互文对的成本之比',
      '4.9 个百分点',
      '5,766',
      'deepseek-v4-flash 在二十四史上经 65,380 次比对抽取',
      '《汉书》上 88.0% 的精确率',
      '约每 8 条就有 1 条',
    ],
    precisionRange: PRECISION_RANGE_ZH,
    navHeading: '本页内容',
    abstractHeading: '摘要',
    citeHeading: '引用',
    abstractOpening: '互文性的计算方法',
    copyButton: '复制 BibTeX',
    copied: '已复制',
    footer: ['© 2026 王兆基、司宛玉和王军。页面文字与插图保留所有权利。代码采用 MIT 许可证。', '维护者：王兆基。'],
  },
} as const satisfies Record<PageLanguage, PageText>

/** Collapses whitespace so rendered text can be compared with a literal. */
export function normalize(text: string): string {
  return text.replace(/\s+/g, ' ').trim()
}

/** Table 1 cells after the dimension label, as printed (arXiv v1, p. 5). */
export const TABLE_1 = [
  ['87.3%', '56.1%', '0.71'],
  ['98.9%', '96.1%', '0.70'],
  ['85.9%', '39.8%', '0.77'],
  ['58.9%', '39.5%', '0.32'],
  ['77.0%', '68.4%', '0.27'],
] as const

/** Table 2 rows (model, candidates, valid, precision, cost, cost per valid pair, latency) and its total row (p. 6). */
export const TABLE_2 = [
  ['doubao-2.1-turbo', '367', '341', '92.9%', '853', '2.501', '521'],
  ['deepseek-v4-pro', '426', '394', '92.5%', '42', '0.107', '101'],
  ['glm-5-turbo', '460', '410', '89.1%', '215', '0.525', '126'],
  ['deepseek-v4-flash', '443', '390', '88.0%', '19', '0.049', '131'],
  ['doubao-2.1-pro', '495', '426', '86.1%', '241', '0.566', '183'],
  ['qwen3.7-plus', '492', '416', '84.6%', '68', '0.163', '178'],
  ['gemini-3.1-flash-lite', '384', '324', '84.4%', '115', '0.355', '37'],
  ['glm-5.2', '583', '478', '82.0%', '98', '0.205', '162'],
  ['qwen3.7-max', '520', '414', '79.6%', '122', '0.294', '194'],
  ['gpt-5.4-mini', '455', '350', '76.9%', '227', '0.648', '39'],
  ['gpt-5.5', '815', '572', '70.2%', '1,029', '1.799', '38'],
  ['claude-haiku-4.5', '578', '323', '55.9%', '647', '2.003', '163'],
] as const
export const TABLE_2_TOTAL = ['6,018', '4,838', '', '3,676', '', ''] as const

/** Table 3 cells after the dimension label: dominant category, early, late, rho, p (p. 6). */
export const TABLE_3 = [
  ['quotation', '40.9%', '42.4%', '−0.07', '.73'],
  ['content', '98.1%', '98.2%', '−0.28', '.18'],
  ['unmarked', '77.5%', '77.6%', '0.11', '.60'],
  ['support', '67.8%', '70.8%', '−0.11', '.61'],
  ['positive', '73.8%', '79.8%', '0.16', '.44'],
] as const

/**
 * Classical Chinese quotations as printed in arXiv v1. 逺 (U+903A) in the edict
 * of Emperor Wu is the Book of Han's variant graph, not 遠. The Records of the
 * Three Kingdoms line is printed twice: traditional in the introduction
 * (JIN_INTRO), simplified as in the source edition in the worked example
 * (JIN_EDITION).
 */
export const JIN_INTRO = '天祿永終，歷數在晉'
export const JIN_EDITION = '天禄永终，历数在晋'
export const QUOTATIONS = [
  { text: '咨爾舜，天之歷數在爾躬', lang: 'zh-Hant' },
  { text: '歷數在于予躬', lang: 'zh-Hant' },
  { text: JIN_INTRO, lang: 'zh-Hant' },
  { text: JIN_EDITION, lang: 'zh-Hans' },
  { text: '往悉爾心，統辟元戎，折衝綏遠，匡正庶事，允執其中。', lang: 'zh-Hant' },
  { text: '敏而好學', lang: 'zh-Hant' },
  { text: '近者說，遠者來', lang: 'zh-Hant' },
  { text: '孔子對定公以徠逺', lang: 'zh-Hant' },
  { text: '溺招路以從己兮', lang: 'zh-Hant' },
  { text: '升車正立，不內顧，不疾言，不親指', lang: 'zh-Hant' },
  { text: '升車，必正立，執綏', lang: 'zh-Hant' },
  { text: '車中，不內顧，不疾言，不親指', lang: 'zh-Hant' },
  { text: '著作之體，援引古義，襲用成文，不標所出，非為掠美', lang: 'zh-Hant' },
  { text: '司馬遷點竄尚書左國之文，班固點竄司馬遷之文，非好異也，理勢之不得不然也', lang: 'zh-Hant' },
] as const

/** The arXiv v1 PDF page on which each figure is printed. */
export const FIGURE_PAGES = { framework: 2, models: 5, calibration: 6, fidelity: 7 } as const

/** Dimension labels of Table 1 as printed (p. 5). */
export const TABLE_1_DIMENSIONS = [
  'Form (quotation/paraphrase)',
  'Aspect (content/structure)',
  'Source-marking (explicit/marked/unmarked)',
  'Function (background/support/…)',
  'Stance (positive/neutral/…)',
] as const

/** Dimension names of Table 3 as printed (p. 6). */
export const TABLE_3_DIMENSIONS = ['Form', 'Aspect', 'Source-marking', 'Function', 'Stance'] as const

/** Numbers that section headings state, in words or digits (the prose test reads answers and paragraphs only), on each language page. */
export const HEADING_FIGURES = {
  en: { models: ['twelve LLMs'], histories: ['eighteen centuries'] },
  'zh-Hans': { models: ['十二个大语言模型'], histories: ['十八个世纪'] },
} as const satisfies Record<PageLanguage, Partial<Record<SectionId, readonly string[]>>>

/** Grant numbers in the acknowledgments, as printed on p. 8. */
export const GRANT_NUMBERS = ['2025YFC3309300', '72010107003'] as const

/**
 * Every number of two or more digits that the answers and paragraphs of each
 * section state, the abstract included, copied from the paper's text. Tables
 * and captions are checked separately. Digits read the same in both
 * languages, so the Chinese page is held to the same lists, except for the one
 * figure in SECTION_FIGURES_ZH_OVERRIDES.
 */
export const SECTION_FIGURES = {
  abstract: ['2,533', '56%', '93%', '51', '65,380', '5,766'],
  gap: ['260'],
  method: ['30', '319,465', '11', '39%', '15%', '81%'],
  benchmark: [
    '20',
    '22,919',
    '120',
    '942,693',
    '2,400',
    '6,018',
    '3,489',
    '68%',
    '2,533',
    '72.6%',
    '237',
    '447',
    '954',
    '323',
    '572',
    '55.3%',
    '99.4%',
    '1,930',
    '1,539',
    '59.9%',
    '617',
    '14',
    '1,214',
    '23',
    '0.94',
    '98.9%',
    '97%',
    '96.1%',
    '18',
    '37',
    '25',
    '43',
    '12',
    '345',
  ],
  similarity: ['61.0%', '2,533', '25.8%', '40.8%', '13', '18', '33.0%', '91.7%', '232', '470', '1,470', '2.5%', '1.1%', '0.3%'],
  models: ['55.9%', '92.9%', '82%', '51', '4.9', '521', '37', '39', '0.85', '0.9', '96.6%', '0.84', '96.1%', '88.5%', '65.1%'],
  histories: [
    '91',
    '1739',
    '65,380',
    '28.5',
    '5,766',
    '85',
    '22',
    '0.87',
    '0.37',
    '0.25',
    '659',
    '945',
    '77.5%',
    '77.6%',
    '0.05',
    '.12',
    '.28',
    '0.78',
    '0.38',
    '10⁻³',
    '0.85',
    '0.50',
    '0.42',
    '93%',
    '283',
    '−0.15',
    '69.3%',
    '95%',
    '−0.19',
    '−0.12',
    '0.001',
    '−0.18',
    '−0.08',
    '0.9',
    '172',
    '117',
  ],
  limitations: ['0.9', '55.3%', '96.1%'],
} as const satisfies Partial<Record<SectionId, readonly string[]>>

/**
 * The figures of SECTION_FIGURES that the Chinese page writes in another form,
 * by section. The English "about 28.5 million characters" is 「约 2,850 万字符」
 * in Chinese, which counts large numbers in 万 (ten thousand) rather than in
 * millions. No other figure is converted.
 */
export const SECTION_FIGURES_ZH_OVERRIDES: Readonly<Partial<Record<SectionId, Readonly<Record<string, string>>>>> = {
  histories: { '28.5': '2,850' },
}

/**
 * Numbers the prose writes as words, on each language page. They cannot be
 * found mechanically, so the lists are kept by hand, the Chinese list giving
 * the Chinese page's wording of each English entry in the same position.
 */
export const SECTION_WORD_FIGURES = {
  en: {
    abstract: ['three domain experts', 'twelve LLMs', 'eighteen centuries'],
    method: ['a quarter', 'two-thirds', 'ninefold', 'fivefold', 'five dimensions'],
    benchmark: ['factor of two', 'twelve models'],
    similarity: ['a quarter', 'top ten'],
    models: ['eight of the twelve', '51 times'],
    histories: ['one pair in eight', 'a third', 'three quarters', 'five dimensions', 'five distinct'],
  },
  'zh-Hans': {
    abstract: ['三位领域专家', '十二个大语言模型', '十八个世纪'],
    method: ['四分之一', '三分之二', '九倍', '五倍', '五个维度'],
    benchmark: ['两倍', '十二个模型'],
    similarity: ['四分之一', '前十'],
    models: ['十二个模型中有八个', '51 倍'],
    histories: ['八条中有一条', '三分之一', '四分之三', '五个维度', '五个不同'],
  },
} as const satisfies Record<PageLanguage, Partial<Record<SectionId, readonly string[]>>>
