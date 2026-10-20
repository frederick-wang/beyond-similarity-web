---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: ["src/pages/zh/index.astro"]
---

# Paper page (English `/`, Chinese `/zh/`)

Visitor mode: Read. The two language pages are one surface with identical structure.

Audience and job: researchers deciding whether to read, cite, or build on the paper; scholars of classical Chinese texts checking findings and examples; search engines and AI assistants quoting it. The reader's task is to understand what the paper did, how far its evidence goes, and to reach the PDF, the Explorer, and the citation.

Proof on hand: the paper's text, four figures, three tables, and the classical Chinese quotations; the Explorer for every intertextual pair. No code or data release exists yet, so the page offers none.

Structure: the page follows the paper's argument as a sequence of reader questions, each answered in its first sentence. A concrete example opens the first question, the gap comes before the method, and the reliability of the expert labels comes before every later claim. Section length follows the evidence. Source links ("Table 2 · PDF p. 6") follow the paragraph they support and point to the pinned v1 PDF page. Abstract, Limitations, and Cite keep plain headings; a short closing section, Using this work, replaces an FAQ.

Memorable moment: the abdication charge from the *Analects* traced through three histories, set as real text with its labels, showing what a similarity score cannot say.

Unresolved: none at the brief level; copy is written per the repository's writing standards.

## Direction contract

THESIS: The page is the paper's argument told as the questions a reader asks, each answered in its first sentence; it refuses the stock project-page template (hero, teaser, button row, abstract, BibTeX) and FAQ padding.

OWN-WORLD: The Explorer's collation world: white paper, ink text, indigo (#1c50a7) for links and the reader's position, vermilion (#b2392b) reserved for the scroll seal and question numerals, hairline rules, Songti for classical Chinese, the system sans for reading, scholarly tables with hairline rules and tabular figures, and the Explorer's dark theme.

STORY: The first screen tells the reader what the paper did and the numbers worth repeating; the questions then carry them from the gap, to the method, to how far the labels can be trusted, to the model choice, to what eighteen centuries of histories show; source links let them check any number, and the Cite section ends the visit.

FIRST VIEWPORT: Masthead with the seal, "Beyond Similarity", and the language switch. A 720 px reading column holds the h1 title, authors, affiliations, the link row (arXiv, PDF, Explorer, BibTeX), and the one-sentence finding; a 300 px right margin holds "At a glance" with qualified numbers; the "On this page" question list follows the finding, and the first question starts at the fold. At 390 px everything is one column, the numbers follow the finding, and the question list sits in a closed details element.

FORM: Question spine, the dealt lead and position 4 on the ordered list of seven structures. seed:c650c8044f526116

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
