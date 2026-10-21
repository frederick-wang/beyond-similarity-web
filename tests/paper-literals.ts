// Expected values for the tests. Numbers and facts about the paper are copied
// by hand from arXiv:2607.27595v1 (PDF); the Chinese title, names and
// affiliations are taken from the SPEC; the phrases that bind numbers to what
// they count, and the page's own labels, are copied from the pages as served.
// No value here is derived from the facts module, so a wrong fact cannot pass
// by agreeing with itself.

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

/**
 * Each language page's Markdown version: index.md under the page's path,
 * where the llms.txt proposal (https://llmstxt.org/) puts the Markdown of a
 * URL without a file name. In "At a glance" the Markdown joins each quantity
 * to its text with `glanceJoin`, a space in English and a full-width colon in
 * Chinese.
 */
export const MARKDOWN_VERSIONS = [
  { page: '/', markdown: '/index.md', lang: 'en', glanceJoin: ' ' },
  { page: '/zh/', markdown: '/zh/index.md', lang: 'zh-Hans', glanceJoin: '：' },
] as const

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
  '/zh/': '2026-10-22',
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
export type FigureId = keyof typeof FIGURE_PAGES

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

/**
 * Every number that a section's headings (its question and its subheadings)
 * state, in words or digits, on each language page, as a phrase that occurs
 * once among them. The prose tests read answers and paragraphs only.
 */
export const HEADING_FIGURES = {
  en: { models: ['twelve LLMs'], histories: ['eighteen centuries', 'One passage, three kinds of reuse'] },
  'zh-Hans': { models: ['十二个大语言模型'], histories: ['十八个世纪', '一段原文，三种复用'] },
} as const satisfies Record<PageLanguage, Partial<Record<SectionId, readonly string[]>>>

/** Grant numbers in the acknowledgments, as printed on p. 8. */
export const GRANT_NUMBERS = ['2025YFC3309300', '72010107003'] as const

/** The sections whose answers and paragraphs the prose tests read: all but Cite, which holds the BibTeX entry, and the acknowledgments, whose grant numbers have their own test. */
export type ProseSectionId = Exclude<SectionId, 'cite' | 'acknowledgments'>

/**
 * Every number of two or more digits that the answers and paragraphs of each
 * section state, the abstract included, copied from the paper's text; the
 * test fails on a number missing from the page and on one the list lacks.
 * Tables and captions are checked separately. Digits read the same in both
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
  using: [],
} as const satisfies Record<ProseSectionId, readonly string[]>

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
 * Numbers that the prose of a section writes as words and that read on their
 * own (a quarter, ninefold), on each language page, the Chinese list giving
 * the Chinese wording of each English entry in the same position. Numbers
 * written as words that need their object to mean anything are in
 * SECTION_PHRASES. Each entry occurs once in its section.
 */
export const SECTION_WORD_FIGURES = {
  en: {
    abstract: ['three domain experts', 'twelve LLMs', 'eighteen centuries'],
    method: ['a quarter', 'two-thirds', 'ninefold', 'fivefold'],
    benchmark: ['factor of two', 'twelve models'],
    similarity: ['a quarter'],
    models: ['eight of the twelve', '51 times'],
    histories: ['one pair in eight', 'a third', 'three quarters', 'five dimensions', 'five distinct'],
  },
  'zh-Hans': {
    abstract: ['三位领域专家', '十二个大语言模型', '十八个世纪'],
    method: ['四分之一', '三分之二', '九倍', '五倍'],
    benchmark: ['两倍', '十二个模型各自单独运行'],
    similarity: ['四分之一'],
    models: ['十二个模型中有八个', '51 倍'],
    histories: ['八条中有一条', '三分之一', '四分之三', '五个维度', '五个不同'],
  },
} as const satisfies Record<PageLanguage, Partial<Record<ProseSectionId, readonly string[]>>>

/**
 * Phrases that bind numbers to what they count, copied from each page as
 * served: every number written in digits, which also catches a number swapped
 * with another or moved; every single digit, which the multi-digit check
 * skips; every pair of numbers in one place; and every number written as a
 * word that needs its object. Each phrase occurs once in its section. The
 * prose test checks mechanically that every number in digits lies inside a
 * phrase here or in SECTION_WORD_FIGURES; numbers written as words cannot be
 * found mechanically, so they were listed by reading every answer and
 * paragraph. Left out: words that state no quantity, such as articles,
 * pronouns and idioms ("one another", "first-class", 「一道诏书」, 「一致」),
 * "both" and its Chinese forms (两人, 两侧, 双向), vague amounts ("a few
 * chapters", 几十年) and names (Twenty-Four Histories, 《三国志》).
 */
export const SECTION_PHRASES = {
  en: {
    abstract: [
      'reads two text units in full',
      'a five-dimension typology of reuse',
      'into a benchmark of 2,533 intertextual pairs',
      'reporting precision (56%–93%), a 51× cost spread at comparable quality',
      '(65,380 comparisons, 5,766 pairs)',
    ],
    gap: [
      'how much two passages overlap',
      'In the Book of Han (first century CE)',
      'the second-person pronoun quietly rewritten into the first',
      'By the 260s',
      'all three resemble the Analects',
      'the first is a faithful citation, the second an appropriation of authority, the third a dead formula',
      'proceed one book at a time',
      'through one similarity value',
    ],
    method: [
      'carries labels on five dimensions',
      'one book of the Analects and one scroll of a history',
      'labeled on five dimensions',
      'returns offsets with 30 characters of context on each side',
      'In the twelve-model run, agents made 319,465 positioning calls, about 11 per task attempt',
      'the checks rejected 39% of attempts to commit a pair, about a quarter of all attempts at the re-slice and 15% at the check of labels and spans',
      'the least precise model drew two-thirds of the re-slice rejections, yet 81% of task attempts that hit any rejection',
      'multiplies the rejection rate ninefold and output tokens fivefold',
      'refuses a second copy of a pair already committed',
      'the same model name served by two providers',
      'a match needs at least one committed pair, and a declaration of no match needs none',
    ],
    benchmark: [
      'Rescoring against the stricter of the two experts',
      'the experts agree on those two labels',
      'the Analects (20 books, 22,919 characters) with the Book of Han (120 scrolls, 942,693 characters) exhaustively, 2,400 chunk-pair tasks',
      'Twelve LLMs each ran all 2,400 tasks and proposed 6,018 pairs, 3,489 of them distinct',
      'Pooling all twelve',
      '68% came from a single model',
      'Two experts independently judged every candidate, first its validity and then, for valid pairs, the five labels, and a third expert adjudicated every disagreement',
      'The result is 2,533 intertextual pairs, 72.6% of the pool',
      'Two philological surveys counted Analects quotations in the Book of Han and arrived at 237 and 447',
      'confirm 954 marked pairs on this source pair alone, and each of the twelve models on its own commits between 323 and 572 adjudicated-valid pairs',
      'On validity the two experts differ in strictness',
      'One accepted 55.3% of candidates and the other 99.4%',
      'Both accepted 1,930 candidates',
      'The arbiter resolved the 1,539 between the two thresholds item by item, siding with the stricter expert on 59.9% and accepting 617',
      'overturned 14 of the 1,214 doubly accepted candidates',
      '1,930 − 14 + 617 = 2,533',
      'drops by 9 to 23 points',
      '(Spearman ρ = 0.94, no model moving more than two places)',
      'Agreement on the five labels, computed over the 1,930 candidates both experts accepted',
      'follows a reliability gradient (Table 1)',
      'Aspect agrees 98.9% of the time, but 97% of pairs reuse content, so chance alone predicts 96.1%',
      'label accuracy rises by 18 to 37 points on form and 25 to 43 on source-marking, by 12 to 25 on function, and by at most 2 on aspect and 9 on stance',
      '345 items in the pool share the shape',
    ],
    similarity: [
      'About a quarter of the expert-adjudicated pairs share no three-character sequence',
      'ranks an overlapping source sentence in its top ten only 61.0% of the time',
      'Of the 2,533 expert-adjudicated pairs, 25.8% share no character trigram between their fragments and 40.8% share no 4-gram',
      'sharing not one character with the teaching it invokes',
      '(Analects 13)',
      'the ford encounter of Analects 18',
      'recluse and disciple each reduced to a single name-character',
      'in its top ten for 61.0% of the trigram-free pairs (top one: 33.0%), against 91.7% for verbatim-anchored pairs',
      'puts the sources of the edict and the rhapsody at 232nd and 470th among 1,470 Analects sentence units',
      'The median rank in the trigram-free stratum is 4, against 1 for verbatim-anchored pairs',
      'dense and sparse embedding prefilters can discard only 2.5% and 1.1% of chunk pairs, 0.3% combined',
    ],
    models: [
      'Precision against the benchmark ranges from 55.9% to 92.9%, and eight of the twelve models reach at least 82%',
      'costs 51 times as much per valid pair as',
      'which is 4.9 points less precise',
      'is also the slowest model (median 521 s per task), while the fastest models, at 37 to 39 s, span a wide range of precision (Table 2)',
      'Pooled over the twelve models, it separates valid from invalid candidates with an AUC of 0.85, and candidates stated at 0.9 or higher are 96.6% valid',
      'alone: AUC 0.84, 96.1%',
      'Below 0.9 the models are systematically over-confident (Figure 3)',
      'Candidates proposed by two or more models are 88.5% valid, against 65.1% for those proposed by one',
    ],
    histories: [
      'across histories composed from 91 BCE to 1739 CE',
      '65,380 chunk-pair tasks over about 28.5 million characters, with no failed tasks, yielding 5,766 intertextual pairs',
      'forms one merged-fragment cluster of 85 extracted pairs across 22 histories',
      'labeled quotation, explicit, support, with a literal fidelity of 0.87',
      'labeled quotation, unmarked, application (0.37)',
      'labeled paraphrase, unmarked, application (0.25)',
      'within this one cluster',
      'Comparing histories composed by 659 CE with those from 945 CE onward, the share of reuse that leaves its source unmarked is 77.5% against 77.6%',
      'at permutation p < 0.05 (Table 3; function and stance remain exploratory)',
      'the Jensen–Shannon divergence between two histories is uncorrelated with the years between them (permutation p = .12 to .28)',
      'sixth-century poetics',
      'Citations that name their source have higher literal fidelity than unmarked ones (median 0.78 against 0.38, Kruskal–Wallis p < 10⁻³), and the gap survives within direct quotation (0.85 against 0.50)',
      'Citations labeled support quote the canon more literally (mean literal fidelity 0.50) than citations labeled application (0.42)',
      'leave the source unmarked 93% of the time',
      'Function is a low-agreement dimension (Table 1)',
      'tend to quote it less literally (Figure 4)',
      'Across 283 merged-fragment clusters spanning at least five distinct composition years, the mean per-cluster Spearman correlation between literal fidelity and composition year is −0.15 (69.3% of clusters negative; cluster-bootstrap 95% CI [−0.19, −0.12]; permutation p < 0.001)',
      'The decline is steeper for direct quotation (−0.18) than for paraphrase (−0.08) and strengthens among pairs with confidence of 0.9 or higher (172 clusters, ρ = −0.19, p < 0.001)',
      'recovers reuse whose two sides differ in extent',
      'a single clause praising Emperor Cheng’s bearing',
      'draws on two separate passages of the Analects chapter',
      'pick one Analects sentence or split its score between the two',
      'The corpus run contains 117 groups in which one history span answers to two or more disjoint Analects passages',
    ],
    limitations: [
      'The corpus run uses a single model',
      'among pairs with confidence of 0.9 or higher, which make up 55.3% of the run',
      'candidates at that confidence are 96.1% valid',
      'with a single composition date',
      'a controlled evaluation setting for one source pair',
    ],
    using: ['Two resources are public'],
  },
  'zh-Hans': {
    abstract: [
      '完整读入两个文本单元',
      '并按五维复用类型学',
      '仲裁为 2,533 条互文对构成的基准',
      '报告精确率（56%～93%）、可比质量下 51 倍的成本跨度',
      '（65,380 次比对、5,766 对）',
    ],
    gap: [
      '分数只记下两段文字重合多少',
      '《汉书》（公元一世纪）',
      '第二人称代词悄悄换成了第一人称',
      '到 260 年代',
      '这三处都与《论语》相似',
      '第一处是忠实的称引，第二处是对权威的挪用，第三处是僵死的套语',
      '一部书一部书地做下去',
      '归结为一个相似度值',
    ],
    method: [
      '并带有五个维度的标签',
      '即《论语》的一篇和史书的一卷',
      '并在五个维度上标注',
      '返回偏移和两侧各 30 个字符的上下文',
      '在十二个模型的运行中，智能体共调用定位工具 319,465 次，每次任务尝试约 11 次',
      '校验拒绝了 39% 的提交尝试，按全部尝试计，约四分之一拒在逐字回切，15% 拒在标签与区间检查',
      '独占了逐字回切拒绝的三分之二，而遇到过拒绝的任务尝试中，81% 最后仍提交了一条被接受的互文对',
      '拒绝率增至九倍，输出 token 数增至五倍',
      '同名模型由两家供应商提供时',
      '声明匹配至少要有一条已提交的互文对，声明无匹配则一条也不能有',
    ],
    benchmark: [
      '只按两位专家中较严的一位重新计分',
      '两位专家在这两个标签上的判断也基本一致',
      '把《论语》（20 篇，22,919 字符）与《汉书》（120 卷，942,693 字符）穷尽配对，共 2,400 个文本块对任务',
      '十二个大语言模型各自跑完全部 2,400 个任务，提出 6,018 条互文对，把相同偏移上的相同片段合并后，得到 3,489 条互异候选',
      '汇集全部十二个模型',
      '68% 只由一个模型提出',
      '两位专家独立判断每条候选，先判断是否有效，再为有效的互文对标注五个标签，第三位专家仲裁所有分歧',
      '最终得到 2,533 条互文对，占候选池的 72.6%',
      '两项文献学调查统计《汉书》引用《论语》的次数，分别得到 237 和 447',
      '仅在这一对来源上，专家就确认了 954 条有标记的互文对',
      '十二个模型各自单独运行，提交的经仲裁有效的互文对都在 323～572 条之间',
      '在有效性判断上，两位专家宽严不同',
      '一位接受了 55.3% 的候选，另一位接受了 99.4%',
      '两人都接受的候选有 1,930 条',
      '落在两人阈值之间的 1,539 条，由仲裁人逐条裁定：其中 59.9% 与较严的专家一致，共接受 617 条',
      '标签冲突另把 1,214 条双方都接受的候选送去仲裁，仲裁人把其中 14 条改判为无效',
      '1,930 − 14 + 617 = 2,533',
      '下降 9～23 个百分点',
      '（Spearman 相关系数 ρ = 0.94，没有模型移动超过两位）',
      '在两位专家都接受的 1,930 条候选上，按仲裁前的标注计算五个标签的一致性',
      '结果呈现一条信度梯度（表 1）',
      '复用层面的一致率是 98.9%，但 97% 的互文对复用的是内容，按机会推算的一致率已有 96.1%',
      '标签准确率在复用形式上提高 18～37 个百分点，来源标记上 25～43 个，互文功能上 12～25 个，复用层面和立场上分别至多 2 个和 9 个',
      '候选池中有 345 条与它形态相同',
    ],
    similarity: [
      '约四分之一的专家仲裁互文对没有一处相同的连续三字',
      '也只在 61.0% 的情况下把有重叠的源句排进前十',
      '在 2,533 条专家仲裁互文对中，25.8% 的两侧片段没有一处相同的连续三字，40.8% 没有相同的连续四字',
      '（《论语》第 13 篇）没有一个字相同',
      '《论语》第 18 篇的问津一事',
      '隐者与弟子各只剩名字里的一个字',
      '对没有相同连续三字的互文对，它只在 61.0% 的情况下把有重叠的源句排进前十（排在第一：33.0%），逐字锚定的互文对则为 91.7%',
      '在 1,470 个《论语》句子单元中，那道诏书和那篇赋的来源分别排在第 232 位和第 470 位',
      '无连续三字重合的这一层，中位排名是 4，逐字锚定的互文对是 1',
      '稠密与稀疏嵌入预过滤分别只能剔除 2.5% 和 1.1% 的文本块对，两者合用只有 0.3%',
    ],
    models: [
      '精确率在 55.9%～92.9% 之间，十二个模型中有八个不低于 82%',
      '的 51 倍，后者精确率低 4.9 个百分点',
      '同时是最慢的模型（每个任务的中位时延为 521 秒），而最快的几个模型（37～39 秒）精确率跨度很大（表 2）',
      '汇集十二个模型，置信度区分有效与无效候选的曲线下面积（AUC, Area Under the Curve）为 0.85',
      '自报置信度不低于 0.9 的候选，96.6% 有效',
      'AUC 0.84，96.1%',
      '低于 0.9 时，各模型系统地过度自信（图 3）',
      '由两个或更多模型共同提出的候选有 88.5% 有效，只由一个模型提出的为 65.1%',
    ],
    histories: [
      '在成书于公元前 91 年至 1739 年的各部史书之间',
      '共 65,380 个文本块对任务，涉及约 2,850 万字符，没有失败的任务，得到 5,766 条互文对',
      '禅让册命构成一个合并片段簇，包含从 22 部史书中抽取的 85 条互文对',
      '标注为直接引用、显性、支持，字面忠实度 0.87',
      '标注为直接引用、无标记、应用（0.37）',
      '标注为转述、无标记、应用（0.25）',
      '而仅在这一个簇里',
      '比较 659 年及以前成书的史书与 945 年起成书的史书，无标记复用的占比分别为 77.5% 和 77.6%',
      '在置换检验中达到 p < 0.05（表 3；互文功能和立场仍属探索性）',
      '两部史书之间的 Jensen–Shannon 散度与相隔年数不相关（置换检验 p = .12～.28）',
      '刘勰六世纪的诗学',
      '点名来源的引用比无标记的引用字面忠实度更高（中位数 0.78 对 0.38，Kruskal–Wallis 检验 p < 10⁻³），在直接引用内部这一差距依然存在（0.85 对 0.50）',
      '标为支持的引用比标为应用的引用更贴近经典的字面（字面忠实度均值 0.50 对 0.42）',
      '应用型引用把经典改用于治理与政策，93% 不标来源',
      '互文功能是专家一致性较低的维度（表 1）',
      '较晚成书的史书引用它时往往不那么贴近字面（图 4）',
      '在 283 个合并片段簇上（每簇至少涉及五个不同的成书年份），簇内字面忠实度与成书年份的 Spearman 相关系数平均为 −0.15（69.3% 的簇为负；簇级自助法 95% 置信区间 [−0.19, −0.12]；置换检验 p < 0.001）',
      '直接引用的下降比转述更陡（−0.18 对 −0.08），在置信度不低于 0.9 的互文对中，这一趋势更强（172 个簇，ρ = −0.19，p < 0.001）',
      '还能找回两侧长短不一的复用',
      '《汉书》称赞汉成帝仪容的一句',
      '取材于《论语·乡党》两处分开的记述',
      '只能选中其中一句《论语》，或者把分数摊到两句上',
      '全量运行中共有 117 组这样的复用：一个史书侧字符区间对应两处及以上互不重叠的《论语》段落',
    ],
    limitations: [
      '全量运行只用了一个模型',
      '在置信度不低于 0.9 的互文对中依然成立',
      '这部分互文对占全量运行的 55.3%',
      '置信度达到这一水平的候选 96.1% 有效',
      '每部史书都只以一个成书年份进入历时分析',
      '针对一对来源的受控评测场景',
    ],
    using: ['目前公开的资源有两项'],
  },
} as const satisfies Record<PageLanguage, Partial<Record<ProseSectionId, readonly string[]>>>

/**
 * Phrases of the same kind in the figures' text alternatives, by figure: the
 * single digits, and the numbers whose order carries the meaning, such as the
 * two strata of Figure 4 and the five confidence buckets of Figure 3. Each
 * occurs once in its text alternative.
 */
export const FIGURE_ALT_PHRASES = {
  en: {
    framework: ['Book of Han scroll 6'],
    calibration: ['41% below 0.7, 56% for 0.7 to 0.8, 74% for 0.8 to 0.9, 91% for 0.9 to 0.95, and 99% at 0.95 or above'],
    fidelity: ['Direct quotation: mean −0.18 over 123 clusters', 'Paraphrase: mean −0.08 over 170 clusters'],
  },
  'zh-Hans': {
    framework: ['《汉书》第 6 卷'],
    calibration: ['低于 0.7 为 41%，0.7～0.8 为 56%，0.8～0.9 为 74%，0.9～0.95 为 91%，0.95 及以上为 99%'],
    fidelity: ['直接引用：123 个簇，均值 −0.18', '转述：170 个簇，均值 −0.08'],
  },
} as const satisfies Record<PageLanguage, Partial<Record<FigureId, readonly string[]>>>
