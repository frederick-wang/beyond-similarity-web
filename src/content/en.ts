import { paper } from '../data/paper'
import type { PageCopy } from './types'

export const en: PageCopy = {
  lang: 'en',
  title: paper.titleEn,
  description:
    'An LLM agent grounds each reuse of the Analects in exact character spans and labels how it is reused, validated on 2,533 expert-adjudicated pairs.',
  skipLink: 'Skip to content',
  correspondingNote: 'Corresponding author',
  finding:
    'We make an LLM agent ground every reuse it proposes in exact character spans and label how the source is reused, and we validate it on 2,533 expert-adjudicated pairs from the *Analects* and the *Book of Han*. Across eighteen centuries of official histories we detect no systematic change in the mix of reuse types, while later-compiled histories tend to quote the same passage less literally.',
  glanceHeading: 'At a glance',
  glance: {
    benchmark: 'expert-adjudicated intertextual pairs between the *Analects* and the *Book of Han*',
    precision: 'precision of twelve LLMs against that benchmark',
    costSpread:
      'lower cost per valid pair for deepseek-v4-flash than for the most precise model, at 4.9 points lower precision',
    corpusRun:
      'intertextual pairs from 65,380 comparisons over the Twenty-Four Histories, of which about one in eight is expected to be spurious at the validated precision',
  },
  navHeading: 'On this page',
  links: {
    arxiv: `arXiv:${paper.arxivId}`,
    pdf: 'PDF',
    explorer: 'Explorer (in Chinese)',
    cite: 'Cite',
  },
  copy: {
    idle: 'Copy BibTeX',
    done: 'Copied',
    failed: 'Copy failed. Select the text above instead.',
  },
  sections: [
    {
      id: 'abstract',
      heading: 'Abstract',
      blocks: [
        {
          type: 'paragraph',
          text: 'Computational approaches to intertextuality have advanced from string matching to neural retrieval, yet their outputs, similarity scores and parallel-passage lists, identify where texts reuse one another without characterizing *how* or *why*. We recast fine-grained intertextuality extraction as an agentic task in which a large language model (LLM) reads two text units in full and, through a constrained tool interface, must ground each proposed reuse in exact character spans on both sides and label it under a five-dimension typology of reuse (form, aspect, source-marking, function, stance). We validate the approach on an exhaustive comparison of the *Analects* with the *Book of Han*, where three domain experts adjudicate a pooled multi-model candidate set into a benchmark of 2,533 intertextual pairs. Against this standard we study twelve LLMs, reporting precision (56%–93%), a 51× cost spread at comparable quality, and how well their confidence is calibrated. Expert agreement traces a *reliability gradient*: dimensions legible on the textual surface are annotated consistently, while those requiring inference of intent are contested, delimiting the claims such annotation supports. Scaling the validated extractor to the full Twenty-Four Histories (65,380 comparisons, 5,766 pairs) recovers corpus-level structure a similarity score cannot express. The interpretive composition of citation shows no systematic change across eighteen centuries, yet the same passage is quoted less and less literally. Stability in the aggregate with drift in the individual case is what a cultural-attraction account expects. We release the extraction protocol and the expert-adjudicated benchmark.',
        },
      ],
    },
    {
      id: 'cite',
      heading: 'Cite',
      blocks: [{ type: 'bibtex' }],
    },
  ],
  footer: {
    rights: 'Page text and figures: all rights reserved. Code: MIT License.',
    maintainedBy: 'Maintained by',
  },
}
