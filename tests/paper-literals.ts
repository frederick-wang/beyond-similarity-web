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
