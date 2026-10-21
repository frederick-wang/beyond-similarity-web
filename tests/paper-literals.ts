// Expected values copied by hand from arXiv:2607.27595v1 (PDF). Tests compare
// the served pages against these literals, never against the facts module,
// so a wrong fact cannot pass by agreeing with itself.

export const TITLE =
  'Beyond Similarity: Grounded Agentic Extraction and Expert-Adjudicated Evaluation of Intertextuality in Classical Chinese Histories'

export const AUTHORS = ['Zhaoji Wang', 'Wanyu Si', 'Jun Wang'] as const

export const AFFILIATIONS = [
  'Department of Information Management, Peking University, Beijing, China',
  'Research Center for Digital Humanities, Peking University, Beijing, China',
] as const

export const ABSTRACT =
  'Computational approaches to intertextuality have advanced from string matching to neural retrieval, yet their outputs, similarity scores and parallel-passage lists, identify where texts reuse one another without characterizing how or why. We recast fine-grained intertextuality extraction as an agentic task in which a large language model (LLM) reads two text units in full and, through a constrained tool interface, must ground each proposed reuse in exact character spans on both sides and label it under a five-dimension typology of reuse (form, aspect, source-marking, function, stance). We validate the approach on an exhaustive comparison of the Analects with the Book of Han, where three domain experts adjudicate a pooled multi-model candidate set into a benchmark of 2,533 intertextual pairs. Against this standard we study twelve LLMs, reporting precision (56%–93%), a 51× cost spread at comparable quality, and how well their confidence is calibrated. Expert agreement traces a reliability gradient: dimensions legible on the textual surface are annotated consistently, while those requiring inference of intent are contested, delimiting the claims such annotation supports. Scaling the validated extractor to the full Twenty-Four Histories (65,380 comparisons, 5,766 pairs) recovers corpus-level structure a similarity score cannot express. The interpretive composition of citation shows no systematic change across eighteen centuries, yet the same passage is quoted less and less literally. Stability in the aggregate with drift in the individual case is what a cultural-attraction account expects. We release the extraction protocol and the expert-adjudicated benchmark.'

/** First-screen figures copied from the paper, and the opening line of the BibTeX entry. */
export const BENCHMARK_PAIRS = '2,533'
export const PRECISION_RANGE = '55.9%–92.9%'
export const FIRST_HISTORY = '91 BCE'
export const LAST_HISTORY = '1739 CE'
export const BIBTEX_OPENING = '@misc{wang2026beyond,'

export const ARXIV_ABS = 'https://arxiv.org/abs/2607.27595'
export const ARXIV_PDF_V1 = 'https://arxiv.org/pdf/2607.27595v1'
export const DOI = '10.48550/arXiv.2607.27595'
export const EXPLORER = 'https://analects-24histories-intertext.pkudh.net/'
export const SITE = 'https://beyond-similarity.zhaoji.ac.cn/'
export const ICP_NUMBER = '蜀ICP备19032431号-3'
export const ICP_REGISTRY = 'https://beian.miit.gov.cn/'

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
