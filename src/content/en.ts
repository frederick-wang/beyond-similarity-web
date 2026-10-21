import { paper, stats } from '../data/paper'
import { formatCount, formatYear } from '../lib/format'
import type { PageCopy } from './types'

// First-screen copy takes its numbers from the facts module; the verbatim
// abstract and long-form section prose state numbers as text, checked by the
// tests against the paper.
const benchmarkPairs = formatCount(stats.benchmarkPairs)
const corpusComparisons = formatCount(stats.corpusComparisons)
const firstHistory = formatYear(stats.compositionYears.first, 'en')
const lastHistory = formatYear(stats.compositionYears.last, 'en')

export const en: PageCopy = {
  lang: 'en',
  title: paper.titleEn,
  description: `An LLM agent grounds each reuse of the Analects in exact character spans and labels how it is reused, validated on ${benchmarkPairs} expert-adjudicated pairs.`,
  skipLink: 'Skip to content',
  correspondingNote: 'Corresponding author',
  finding: `We make an LLM agent ground every reuse it proposes in exact character spans and label how the source is reused, and we validate it on ${benchmarkPairs} expert-adjudicated pairs from the *Analects* and the *Book of Han*. Across official histories composed from ${firstHistory} to ${lastHistory} we detect no systematic change in the share of direct quotation or of unattributed reuse, while later-compiled histories tend to quote the same passage less literally.`,
  glanceHeading: 'At a glance',
  glance: {
    benchmark: 'expert-adjudicated intertextual pairs between the *Analects* and the *Book of Han*',
    precision: `precision of ${stats.models} LLMs against that benchmark`,
    costSpread: `cost per valid pair of the most precise model, ${stats.mostPreciseModel}, relative to ${stats.deploymentModel}, which is ${stats.precisionGapPoints} points less precise`,
    corpusRun: `intertextual pairs from ${corpusComparisons} comparisons over the Twenty-Four Histories. If the ${stats.deploymentPrecision.toFixed(1)}% precision measured on the *Book of Han* holds, about 1 in ${stats.expectedSpuriousOneIn} of them would be spurious.`,
  },
  navHeading: 'On this page',
  links: {
    arxiv: `arXiv:${paper.arxivId}`,
    pdf: 'PDF',
    explorer: 'Explorer (in Chinese)',
    cite: 'Cite',
  },
  copyButton: {
    idle: 'Copy BibTeX',
    done: 'Copied',
    failed: 'Copy failed. Select the entry above instead.',
  },
  bibtexLabel: 'BibTeX entry',
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
