# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro + TypeScript, dependencies managed with pnpm, built to static files.

## Users

- **NLP and digital-humanities researchers** arriving from arXiv, Google Scholar, social media, or a colleague's link. Their job is to decide whether to read, cite, or build on the work.
- **Scholars of classical Chinese texts** (philology, historiography, the history of classical scholarship), who mostly search in Chinese and care about the findings, the examples, and how far the evidence can be trusted.
- **Search engines and generative AI assistants**, which find, summarise, and quote the paper on behalf of the first two groups.

## Product Purpose

Explain the paper *Beyond Similarity* to its readers: what it did, how reliable its results are, what it found across the Twenty-Four Histories, where to read the full text and check each intertextual pair, and how to cite it. Success means a reader who sees only the first screen knows what the paper did, its key numbers, and where to go next; a reader can copy a citation within thirty seconds; and an AI assistant asked about intertextuality detection in classical Chinese, or about how the histories quote the *Analects*, can quote this page's exact numbers.

## Positioning

The only page that carries the paper's full set of key numbers, its classical Chinese examples, and complete versions in both English and Chinese, and that links straight to the explorer where every intertextual pair can be checked against its source. The arXiv page offers an abstract and a PDF; this page turns the PDF's tables, numbers, and quotations into text that can be searched and quoted.

## Operating Context

- Readers arrive from the arXiv abstract page, Google Scholar, the first author's publication list, social-media links, and citations inside AI assistants.
- On the page they read the abstract and key numbers, study the framework figure, compare the twelve-model results, read the classical Chinese examples, copy the BibTeX, open the PDF on arXiv, and jump to the explorer to verify individual pairs.
- The page is also a source for machines: citation metadata, JSON-LD, `llms.txt`, and Markdown mirrors are generated from the same paper facts as the visible text.

## Capabilities and Constraints

- Two reading pages: English at `/` and Chinese at `/zh/`, with identical sections, figures, tables, and numbers, linked to each other through hreflang.
- The paper is described only as an arXiv preprint (arXiv:2607.27595); publication details come from the arXiv record.
- No code or data download links, and no "coming soon" notice, until the authors publish a release.
- No analytics scripts and no cookies. The only client-side script copies the BibTeX entry; without it the entry can still be selected and copied.
- Page text and figures remain under the authors' copyright; the repository's code is MIT-licensed.
- `robots.txt` admits every crawler, including crawlers that collect model-training data.
- The footer shows the ICP filing number 蜀ICP备19032431号-3.
- Terminology follows `GLOSSARY.md` in both languages.

## Brand Commitments

- Inherit the visual identity of the explorer (《论语》×二十四史互文图谱): its collation palette of white paper, indigo annotation, and vermilion marks; Songti for classical Chinese quotations and the system sans-serif for interface text; the vermilion scroll seal as the mark; light and dark themes.
- Anti-references inherited from the explorer: no marketing rhetoric (gradients, oversized slogans, stacks of cards), no false-precision numbers, and colour only where it carries meaning.

## Evidence on Hand

- The full text of arXiv:2607.27595 v1, with four figures (framework overview, twelve-model precision against cost, confidence calibration, decline in literal fidelity), three tables (annotator agreement, twelve-model results, diachronic stability), and fifteen classical Chinese quotations in their source editions' script.
- The public explorer at <https://analects-24histories-intertext.pkudh.net/>.
- The vermilion scroll seal, as raster artwork taken from the explorer.
- Absent and not to be fabricated: a public code or data release, photographs, videos, testimonials, or press coverage.

## Product Principles

1. The reader's questions set the order: findings and numbers first, then method and evidence, then citation.
2. Numbers, tables, and quotations are text, so people and machines can quote them directly.
3. Every number traces back to the paper, and every example traces back to the explorer.
4. The two languages are two versions of the same content; neither is a summary of the other.
5. The page says only what readers need; process, plans, and internal discussion stay off it.

## Accessibility & Inclusion

WCAG 2.2 AA: body and secondary text meet contrast requirements; figures have text alternatives and their data is available as text; everything is keyboard-operable; the page respects `prefers-reduced-motion` and `prefers-color-scheme`; English and Chinese passages carry their own `lang` attributes.
