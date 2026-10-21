import { links, paper, stats } from '../data/paper'
import { formatCount, formatIdentifier, formatYear } from '../lib/format'
import type { PageCopy } from './types'

// First-screen copy takes its numbers from the facts module. The verbatim
// abstract and the section prose state numbers as text; tests/prose-figures.spec.ts
// checks every number of two or more digits against literals copied from the paper.
const benchmarkPairs = formatCount(stats.benchmarkPairs)
const corpusComparisons = formatCount(stats.corpusComparisons)
const mostPreciseModel = formatIdentifier(stats.mostPreciseModel)
const deploymentModel = formatIdentifier(stats.deploymentModel)
const firstHistory = formatYear(stats.compositionYears.first, 'en')
const lastHistory = formatYear(stats.compositionYears.last, 'en')

export const en: PageCopy = {
  lang: 'en',
  title: paper.titleEn,
  description: `An LLM agent grounds each reuse of the Analects in exact character spans and labels how it is reused, validated on ${benchmarkPairs} expert-adjudicated pairs.`,
  skipLink: 'Skip to content',
  correspondingNote: 'Corresponding author',
  finding: `We make an LLM agent ground every reuse it proposes in exact character spans and label how the source is reused, and we validate it on ${benchmarkPairs} expert-adjudicated pairs from the *Analects* and the *Book of Han*. Across official histories composed from ${firstHistory} to ${lastHistory} we detect no systematic change in the share of direct quotation or of reuse that leaves its source unmarked, while later-compiled histories tend to quote the same passage less literally.`,
  abstract:
    'Computational approaches to intertextuality have advanced from string matching to neural retrieval, yet their outputs, similarity scores and parallel-passage lists, identify where texts reuse one another without characterizing *how* or *why*. We recast fine-grained intertextuality extraction as an agentic task in which a large language model (LLM) reads two text units in full and, through a constrained tool interface, must ground each proposed reuse in exact character spans on both sides and label it under a five-dimension typology of reuse (form, aspect, source-marking, function, stance). We validate the approach on an exhaustive comparison of the *Analects* with the *Book of Han*, where three domain experts adjudicate a pooled multi-model candidate set into a benchmark of 2,533 intertextual pairs. Against this standard we study twelve LLMs, reporting precision (56%–93%), a 51× cost spread at comparable quality, and how well their confidence is calibrated. Expert agreement traces a *reliability gradient*: dimensions legible on the textual surface are annotated consistently, while those requiring inference of intent are contested, delimiting the claims such annotation supports. Scaling the validated extractor to the full Twenty-Four Histories (65,380 comparisons, 5,766 pairs) recovers corpus-level structure a similarity score cannot express. The interpretive composition of citation shows no systematic change across eighteen centuries, yet the same passage is quoted less and less literally. Stability in the aggregate with drift in the individual case is what a cultural-attraction account expects. We release the extraction protocol and the expert-adjudicated benchmark.',
  glanceHeading: 'At a glance',
  glance: {
    benchmark: 'expert-adjudicated intertextual pairs between the *Analects* and the *Book of Han*',
    precision: `precision of ${stats.models} LLMs against that benchmark`,
    costSpread: `cost per valid pair of the most precise model, ${mostPreciseModel}, relative to ${deploymentModel}, which is ${stats.precisionGapPoints} points less precise`,
    corpusRun: `intertextual pairs that ${deploymentModel} extracted from ${corpusComparisons} comparisons over the Twenty-Four Histories. If its ${stats.deploymentPrecision.toFixed(1)}% precision on the *Book of Han* holds, about 1 in ${stats.expectedSpuriousOneIn} of them would be spurious.`,
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
  sources: {
    lead: 'Source:',
    parts: {
      introduction: 'Introduction',
      protocol: 'Task and Agentic Extraction Protocol',
      evaluation: 'Expert-Adjudicated Evaluation',
      scaling: 'Scaling to the Twenty-Four Histories',
      discussion: 'Discussion and Limitations',
    },
    pages: (pages) => (pages.length === 1 ? `PDF p. ${pages[0]}` : `PDF pp. ${pages[0]}–${pages[1]}`),
  },
  figures: {
    openFull: 'Open full size',
    items: {
      framework: {
        label: 'Figure 1',
        alt: 'Diagram in four panels. (a) An LLM agent reads an Analects book and a history scroll in full, locates wording with a find_position tool that returns exact start and end offsets, and proposes pairs to an add_pair tool that checks the format of labels and spans, re-slices the text at the stated offsets, and refuses duplicates. List and remove tools let it revise committed pairs. (b) A committed pair from Analects Book 13 and Book of Han scroll 6 whose fragments share no characters, labeled paraphrase, content, marked, application, positive, with medium evidence and confidence 0.72. (c) Three comic panels: a run ends with some number of committed pairs, a stop guard blocks every exit except submit, and submit routes the task to match or no match, with any other end recorded as failed. (d) The pipeline: 2,400 chunk-pair tasks times 12 LLMs, 6,018 proposed and 3,489 pooled candidate pairs, two experts and an arbiter yielding 2,533 expert-adjudicated pairs, extractor selection by precision, cost and calibration, and a run over 24 histories with 65,380 tasks and 5,766 pairs.',
        caption:
          'Framework overview. (a) The extraction agent for one chunk pair and its task tools: `find_position` grounds candidate wordings in exact offsets, `list` and `remove` support revision, and `add_pair` commits a pair only past the three checks shown. (b) The committed pair shown is real and shares no characters across its fragments: an edict of Emperor Wu invoking *Analects* 13 by the sage’s name alone. (c) A task can end only through `submit`, which checks the declared status against the committed set; any other end is recorded as failed. (d) The validate-then-scale pipeline.',
      },
      models: {
        label: 'Figure 2',
        alt: 'Scatter plot of precision against cost per valid pair on a logarithmic axis for twelve LLMs. A dashed efficient frontier runs through deepseek-v4-flash, which is outlined in green as the selected model, deepseek-v4-pro and doubao-2.1-turbo. claude-haiku-4.5 sits lowest, near 56% precision.',
        caption:
          'Twelve LLMs on the 2,533-pair benchmark: precision against cost per valid pair (log scale). The selected deployment model, `deepseek-v4-flash`, attains the best precision per cost; counts are in Table 2.',
      },
      calibration: {
        label: 'Figure 3',
        alt: 'Bar chart of the share of candidates judged valid in each confidence bucket, pooled over twelve models: 41% below 0.7, 56% for 0.7 to 0.8, 74% for 0.8 to 0.9, 91% for 0.9 to 0.95, and 99% at 0.95 or above. Gray bands mark each bucket’s nominal range, and the bars below 0.9 fall short of their bands.',
        caption:
          'Calibration of the confidence the models state, pooled over the twelve models: share of candidates judged valid per confidence bucket. A bar short of its gray band means the models were over-confident in that bucket.',
      },
      fidelity: {
        label: 'Figure 4',
        alt: 'Box plots of per-cluster Spearman correlations between literal fidelity and composition year. All pairs: mean −0.15 over 283 clusters. Direct quotation: mean −0.18 over 123 clusters. Paraphrase: mean −0.08 over 170 clusters. All three means sit left of zero and carry an asterisk for a permutation p below 0.05.',
        caption:
          'Literal fidelity tends to decline with the citing history’s composition date, holding the passage fixed: distribution of per-cluster Spearman correlations of fidelity against year. Boxes show the interquartile range, diamonds the mean of each stratum, an asterisk a permutation p below 0.05, and *k* the number of qualifying clusters.',
      },
    },
  },
  tables: {
    scrollRegion: (label) => `${label}, scrolls horizontally`,
    agreement: {
      label: 'Table 1',
      caption:
        'Agreement between the two experts on the five labels, over the 1,930 candidates both accepted, before adjudication. Chance is the agreement expected from each expert’s label frequencies, which Cohen’s κ corrects for.',
      headers: { dimension: 'Dimension', observed: 'Observed agreement', chance: 'Chance', kappa: 'Cohen’s κ' },
      dimensions: {
        form: 'Form (quotation/paraphrase)',
        aspect: 'Aspect (content/structure)',
        sourceMarking: 'Source-marking (explicit/marked/unmarked)',
        function: 'Function (background/support/…)',
        stance: 'Stance (positive/neutral/…)',
      },
    },
    models: {
      label: 'Table 2',
      caption:
        'Twelve models on the 2,400 evaluation tasks: candidates, valid pairs, precision (the share of committed pairs judged valid in expert adjudication), total cost, cost per valid pair, and median latency per task.',
      headers: {
        model: 'Model',
        candidates: 'Candidates',
        valid: 'Valid',
        precision: 'Precision',
        cost: 'Cost (USD)',
        costPerValid: 'USD per valid pair',
        latency: 'Median latency (s)',
      },
      total: 'Total',
    },
    diachronic: {
      label: 'Table 3',
      caption:
        'The mix of reuse types across the Twenty-Four Histories. Early and late are pooled shares over histories composed by 659 CE and from 945 CE onward. ρ is the Spearman correlation of the dominant category’s per-history share with composition year over the 24 histories, and p a permutation p-value from 2,000 permutations. No trend has p below 0.05.',
      headers: {
        dimension: 'Dimension',
        dominant: 'Dominant category',
        early: 'Early',
        late: 'Late',
        rho: 'ρ',
        p: 'p',
      },
      dimensions: {
        form: 'Form',
        aspect: 'Aspect',
        sourceMarking: 'Source-marking',
        function: 'Function',
        stance: 'Stance',
      },
      dominant: {
        quotation: 'quotation',
        content: 'content',
        unmarked: 'unmarked',
        support: 'support',
        positive: 'positive',
      },
    },
  },
  sections: [
    {
      id: 'abstract',
      kind: 'plain',
      heading: 'Abstract',
      blocks: [{ type: 'abstract' }],
    },
    {
      id: 'gap',
      kind: 'question',
      heading: 'What does a similarity score leave out?',
      answer:
        'The kind of reuse. A score records how much two passages overlap, while historians ask whether a passage is cited faithfully, borrowed for its authority, or worn down to a formula.',
      blocks: [
        {
          type: 'paragraph',
          text: 'In the *Book of Han* (first century CE), the abdication charge from the *Analects* is transcribed almost verbatim: {{charge}} (the heaven-ordained succession rests upon your person). A few chapters later, in the biography of the usurper Wang Mang, the same line reappears as {{wangMang}}, the second-person pronoun quietly rewritten into the first. By the 260s, in the abdication documents of the *Records of the Three Kingdoms*, only a formulaic skeleton survives, {{jinAbdication}}, detached from the *Analects* and fused into the standard script of dynastic transfer. A text-reuse detector can find that all three resemble the *Analects*. It cannot say that the first is a faithful citation, the second an appropriation of authority, the third a dead formula.',
          sources: [{ part: 'introduction', pages: [1] }],
        },
        {
          type: 'paragraph',
          text: 'Tracing such reuse by hand is the labor of concordance scholarship. Gu Jiegang dated the strata of the legendary past by setting text against text, and his thesis that each age extended the history it received launched the Doubting Antiquity movement. Comparison of this kind is bounded by sustained expert attention, and Gu himself planned to proceed one book at a time. The standard computational substitutes do not remove that limit: they route every comparison through one similarity value, which keeps the degree of reuse and discards its kind. We therefore treat intertextuality as span-grounded relation extraction: a model locates each reused fragment on both sides as an exact character span and labels the resulting pair by the kind of reuse.',
          sources: [{ part: 'introduction', pages: [1] }],
        },
      ],
    },
    {
      id: 'method',
      kind: 'question',
      heading: 'How does grounded agentic extraction work?',
      answer:
        'An LLM agent reads a whole book of the *Analects* against a whole scroll of a history and can record a reuse only through tools that check it against the text, so every committed pair points to exact character spans on both sides and carries labels on five dimensions.',
      blocks: [
        { type: 'figure', figure: 'framework' },
        {
          type: 'paragraph',
          text: 'Each task takes a chunk pair, one book of the *Analects* and one scroll of a history, and asks for every intertextual pair in it: a fragment on each side given as a character span [start, end), labeled on five dimensions. Form separates direct quotation from paraphrase. Aspect separates reuse of content from reuse of structure. Source-marking records whether the source is named explicitly, marked, or left unmarked. Function records what the reuse does in its new setting (background, support, application, critique), and stance the citing text’s attitude (positive, neutral, negative, complex). Reuse means traceable textual dependence. Shared topic, agreement, common vocabulary and diffuse influence do not count. A prediction is correct only if both fragments occur verbatim at the stated offsets.',
          sources: [{ part: 'protocol', pages: [3] }],
        },
        {
          type: 'paragraph',
          text: 'Both chunks enter the model’s context whole. We do not cut them into sentences and pair those by n-gram or embedding similarity: an index surfaces only what it already scores as close, and the marking and rhetorical function of a citation are legible only in the discourse around it.',
          sources: [{ part: 'protocol', pages: [3] }],
        },
        {
          type: 'paragraph',
          text: 'Asked for the reused spans directly, an LLM produces fluent pairs that are sometimes ungrounded or fabricated. The agent therefore has to locate every fragment with a positioning tool, an exact substring search that returns offsets with 30 characters of context on each side, and when it commits a pair, the protocol re-slices both chunks at the stated offsets and rejects the pair unless each fragment reproduces character for character. In the twelve-model run, agents made 319,465 positioning calls, about 11 per task attempt, and the checks rejected 39% of attempts to commit a pair, about a quarter of all attempts at the re-slice and 15% at the check of labels and spans. Rejection tracks grounding rather than quality: the least precise model drew two-thirds of the re-slice rejections, yet 81% of task attempts that hit any rejection still ended with an accepted pair. Removing the positioning tool multiplies the rejection rate ninefold and output tokens fivefold.',
          sources: [{ part: 'protocol', pages: [3] }],
        },
        {
          type: 'paragraph',
          text: 'Conclusions read out of a model’s free text cannot be audited at corpus scale. The final prose of a task is never parsed: its output is exactly the set of pairs committed through the tool, which checks the labels and spans of each pair and refuses a second copy of a pair already committed, identity being both fragment texts with their offsets. Each task runs in isolation, with a fresh temporary home and no inherited configuration, and is keyed by a hash of every input that determines its result, including the provider and endpoint serving the model, so the same model name served by two providers cannot silently reuse cached results.',
          sources: [{ part: 'protocol', pages: [3] }],
        },
        {
          type: 'paragraph',
          text: 'Aggregate counts are trustworthy only if every task ends in a defined outcome. A stop guard keeps the agent from ending before it calls `submit`, and `submit` checks the declared status against the committed set in both directions: a match needs at least one committed pair, and a declaration of no match needs none. A task that ends any other way, through an API error, exhausted retries, a timeout or a run that stops before submitting, is recorded as failed and never counted as an empty result. Explicit abstention is a first-class outcome because most chunk pairs share no reuse.',
          sources: [{ part: 'protocol', pages: [3, 4] }],
        },
      ],
    },
    {
      id: 'benchmark',
      kind: 'question',
      heading: 'How reliable is the expert-adjudicated benchmark?',
      answer:
        'Reliable enough to compare models and to support claims about form and source-marking. Rescoring against the stricter of the two experts barely changes how the models rank, and the experts agree on those two labels. Function and stance, which require inferring intent, are contested, so findings on them are exploratory.',
      blocks: [
        {
          type: 'paragraph',
          text: 'The benchmark compares the *Analects* (20 books, 22,919 characters) with the *Book of Han* (120 scrolls, 942,693 characters) exhaustively, 2,400 chunk-pair tasks on a public punctuated edition (Shidian Guji). Twelve LLMs each ran all 2,400 tasks and proposed 6,018 pairs, 3,489 of them distinct once the same fragments at the same offsets are merged. Pooling all twelve keeps the benchmark from favoring any one model’s proposals, and the models proposed largely different candidates: 68% came from a single model. Two experts independently judged every candidate, first its validity and then, for valid pairs, the five labels, and a third expert adjudicated every disagreement. The result is 2,533 intertextual pairs, 72.6% of the pool.',
          sources: [{ part: 'evaluation', pages: [4] }],
        },
        {
          type: 'paragraph',
          text: 'Manual enumeration offers no substitute reference. Two philological surveys counted *Analects* quotations in the *Book of Han* and arrived at 237 and 447, nearly a factor of two apart, and both authors expected to have missed cases. The experts confirm 954 marked pairs on this source pair alone, and each of the twelve models on its own commits between 323 and 572 adjudicated-valid pairs.',
          sources: [{ part: 'evaluation', pages: [4, 5] }],
        },
        {
          type: 'paragraph',
          text: 'On validity the two experts differ in strictness, not in criterion. One accepted 55.3% of candidates and the other 99.4%, and their decisions nest: no candidate accepted by the stricter expert was rejected by the more lenient one. Both accepted 1,930 candidates. The arbiter resolved the 1,539 between the two thresholds item by item, siding with the stricter expert on 59.9% and accepting 617, and overturned 14 of the 1,214 doubly accepted candidates that label conflicts sent to adjudication, so 1,930 − 14 + 617 = 2,533. Rescored against the stricter expert alone, every model’s precision drops by 9 to 23 points, while the ranking barely moves (Spearman ρ = 0.94, no model moving more than two places) and the choice of deployment model stays the same. The precision figures on this page are measured against the adjudicated threshold.',
          sources: [{ part: 'evaluation', pages: [4] }],
        },
        {
          type: 'paragraph',
          text: 'Agreement on the five labels, computed over the 1,930 candidates both experts accepted and before adjudication, follows a reliability gradient (Table 1). Form and source-marking, whose evidence sits on the surface of the text (is the wording identical, is the source named), are settled by inspection, while function and stance, which require reconstructing intent and attitude, leave room for principled disagreement between competent experts. Aspect agrees 98.9% of the time, but 97% of pairs reuse content, so chance alone predicts 96.1%: the label is reliable and almost constant.',
          sources: [{ part: 'evaluation', pages: [4] }],
        },
        { type: 'table', table: 'agreement' },
        {
          type: 'paragraph',
          text: 'The models reproduce the gradient where it carries information. Against each model’s majority-class baseline, label accuracy rises by 18 to 37 points on form and 25 to 43 on source-marking, by 12 to 25 on function, and by at most 2 on aspect and 9 on stance. The disagreement belongs to the task, as one contested item shows. Both experts accepted the pair linking the *Analects* phrase {{diligent}} (diligent and fond of learning) to a *Book of Han* scene in which a courtier defends the crown prince, and both called it an unmarked verbatim quotation with positive stance. They split only on why: canonical support for the courtier’s claim, or application of the canon’s standard of talent to a living person (the arbiter ruled application). Nothing on the textual surface settles this, and 345 items in the pool share the shape: pair accepted, form and source-marking agreed, function split between support and application.',
          sources: [{ part: 'evaluation', pages: [4, 5] }],
        },
      ],
    },
    {
      id: 'similarity',
      kind: 'question',
      heading: 'How much reuse does similarity search miss?',
      answer:
        'About a quarter of the expert-adjudicated pairs share no three-character sequence, and for those pairs even an oracle dense retriever, queried with the expert-identified fragment itself, ranks an overlapping source sentence in its top ten only 61.0% of the time.',
      blocks: [
        {
          type: 'paragraph',
          text: 'Of the 2,533 expert-adjudicated pairs, 25.8% share no character trigram between their fragments and 40.8% share no 4-gram. An edict of Emperor Wu justifies shifting policy priorities by how Confucius answered each duke differently, {{wuEdict}}, naming the sage yet sharing not one character with the teaching it invokes, {{nearAndFar}} (*Analects* 13). Ban Gu’s rhapsody in the autobiographical postface compresses the ford encounter of *Analects* 18 into {{rhapsody}}, recluse and disciple each reduced to a single name-character, without marking the source.',
          sources: [{ part: 'evaluation', pages: [4] }],
        },
        {
          type: 'paragraph',
          text: 'We gave dense retrieval an advantage no deployed pipeline has: BGE-M3 queried with the history-side fragment the experts identified. It ranks an overlapping source sentence in its top ten for 61.0% of the trigram-free pairs (top one: 33.0%), against 91.7% for verbatim-anchored pairs, and puts the sources of the edict and the rhapsody at 232nd and 470th among 1,470 *Analects* sentence units. The median rank in the trigram-free stratum is 4, against 1 for verbatim-anchored pairs. These hit rates cap the recall of any retrieve-then-judge pipeline exactly where interpretation begins, and retrieval output carries neither spans nor labels.',
          sources: [{ part: 'evaluation', pages: [4] }],
        },
        {
          type: 'paragraph',
          text: 'The same limit appears at the level of whole chunk pairs: if every reuse the experts confirmed is to be kept, dense and sparse embedding prefilters can discard only 2.5% and 1.1% of chunk pairs, 0.3% combined, because literal and distributional similarity systematically miss paraphrase.',
          sources: [{ part: 'introduction', pages: [1] }],
        },
      ],
    },
    {
      id: 'models',
      kind: 'question',
      heading: 'How do twelve LLMs compare on precision, cost, and calibration?',
      answer: `Precision against the benchmark ranges from 55.9% to 92.9%, and eight of the twelve models reach at least 82%. Quality and cost vary independently: the most precise model, ${mostPreciseModel}, costs 51 times as much per valid pair as ${deploymentModel}, which is 4.9 points less precise and gives the most precision per dollar, so we chose it for the corpus run.`,
      blocks: [
        { type: 'table', table: 'models' },
        {
          type: 'paragraph',
          text: `Latency varies independently of both: ${mostPreciseModel} is also the slowest model (median 521 s per task), while the fastest models, at 37 to 39 s, span a wide range of precision (Table 2).`,
          sources: [{ part: 'evaluation', pages: [5] }],
        },
        { type: 'figure', figure: 'models' },
        {
          type: 'paragraph',
          text: `The confidence the models state is informative and optimistic. Pooled over the twelve models, it separates valid from invalid candidates with an AUC of 0.85, and candidates stated at 0.9 or higher are 96.6% valid (${deploymentModel} alone: AUC 0.84, 96.1%). Below 0.9 the models are systematically over-confident (Figure 3).`,
          sources: [{ part: 'evaluation', pages: [5] }],
        },
        { type: 'figure', figure: 'calibration' },
        {
          type: 'paragraph',
          text: 'Candidates proposed by two or more models are 88.5% valid, against 65.1% for those proposed by one, so agreement between models signals validity. The models find different parts of the intertextual space, which the pooled benchmark brings together.',
          sources: [{ part: 'evaluation', pages: [5] }],
        },
      ],
    },
    {
      id: 'histories',
      kind: 'question',
      heading: 'How did the Twenty-Four Histories reuse the *Analects* across eighteen centuries?',
      answer: `We detect no systematic change in the mix of reuse types across histories composed from ${firstHistory} to ${lastHistory}, while later-compiled histories tend to quote the same passage less literally.`,
      blocks: [
        {
          type: 'paragraph',
          text: `We ran ${deploymentModel} over the *Analects* paired with every scroll of the Twenty-Four Histories: 65,380 chunk-pair tasks over about 28.5 million characters, with no failed tasks, yielding 5,766 intertextual pairs. Precision was measured only on the *Book of Han*, and at that precision roughly one pair in eight is expected to be spurious. We therefore treat the output as a distribution of model judgments whose precision and calibration were measured on the benchmark, rest claims on distributional structure rather than raw totals, and let each pair’s confidence serve readers who want a stricter threshold.`,
          sources: [{ part: 'scaling', pages: [5] }],
        },
        { type: 'subheading', id: 'worked-example', text: 'One passage, three kinds of reuse' },
        {
          type: 'paragraph',
          text: 'The abdication charge forms one merged-fragment cluster of 85 extracted pairs across 22 histories. In the *Book of Han* it is quoted near-verbatim under the source’s name, {{charge}}, labeled quotation, explicit, support, with a literal fidelity of 0.87: the canon is named to lend authority. In the same history an imperial patent appointing a commander absorbs its wording, {{patent}} (go, devote your whole heart … hold faithfully to the mean), labeled quotation, unmarked, application (0.37): investiture language repurposed as working government prose. In the *Records of the Three Kingdoms* the abdication edict transfers the mandate with {{jinAbdicationEdition}} (Heaven’s favor ends forever; the succession lies with Jin), labeled paraphrase, unmarked, application (0.25). The labels separate a public appeal to canonical authority, silent administrative repurposing, and a formulaic script, and within this one cluster literal fidelity already tends to fall with composition year.',
          sources: [{ part: 'scaling', pages: [5, 6] }],
        },
        { type: 'subheading', id: 'mix', text: 'The mix of reuse types shows no detectable drift' },
        {
          type: 'paragraph',
          text: 'Comparing histories composed by 659 CE with those from 945 CE onward, the share of reuse that leaves its source unmarked is 77.5% against 77.6%, and for none of the five dimensions does the share of its dominant category correlate with composition year at permutation p < 0.05 (Table 3; function and stance remain exploratory). Per-history usage profiles do not diverge as the gap between composition dates grows: the Jensen–Shannon divergence between two histories is uncorrelated with the years between them (permutation p = .12 to .28). Across the histories, raw citation density does fall to about a third, but that count-level trend needs no typology and matches the received periodization, so we rest no claim on it.',
          sources: [{ part: 'scaling', pages: [6] }],
        },
        { type: 'table', table: 'diachronic' },
        {
          type: 'paragraph',
          text: 'The rewriting of individual passages, shown below, does not conflict with this. Cultural attraction, an account of cultural transmission, expects a group-level distribution that holds steady because transformations of individual items converge on the same forms, not because each item is copied faithfully.',
          sources: [{ part: 'scaling', pages: [6] }],
        },
        {
          type: 'paragraph',
          text: 'Absorbing the canon without marking it, more than three quarters of the reuse in early and late histories alike, is licensed practice in native terms. Zhang Xuecheng distinguishes the compositional register from the evidential: {{zhangComposition}}, in composition one draws on old meanings and takes over existing text without marking the source, and this is no plagiarism, a license he grants only where the author’s own argument stands without leaning on the borrowed words. Liu Xie’s sixth-century poetics already holds that old material, aptly used, reads as if it came from one’s own mouth.',
          sources: [{ part: 'scaling', pages: [6] }],
        },
        { type: 'subheading', id: 'marking', text: 'Marking and fidelity are separate axes' },
        {
          type: 'paragraph',
          text: 'Literal fidelity is measured by aligning each history fragment with its *Analects* source by character-level longest common subsequence. How literally a passage is quoted does not fix how it is marked. Citations that name their source have higher literal fidelity than unmarked ones (median 0.78 against 0.38, Kruskal–Wallis p < 10⁻³), and the gap survives within direct quotation (0.85 against 0.50), so a similarity score cannot stand in for the marking label. Naming a source is a public appeal to canonical authority that holds the wording to a higher standard. The relation is a regularity rather than a law: unmarked citation can be verbatim where concealment is the motive.',
          sources: [{ part: 'scaling', pages: [6] }],
        },
        { type: 'subheading', id: 'function', text: 'Applied citations tend to be looser and mostly unmarked (exploratory)' },
        {
          type: 'paragraph',
          text: 'Citations labeled support quote the canon more literally (mean literal fidelity 0.50) than citations labeled application (0.42), which repurpose it for governance and policy and leave the source unmarked 93% of the time. This is the pragmatic use native scholarship calls *tong-jing zhi-yong*, applying the classics to affairs, where a citation’s force is that the sage would have approved the decision, not its exact words. Function is a low-agreement dimension (Table 1).',
          sources: [{ part: 'scaling', pages: [6] }],
        },
        { type: 'subheading', id: 'fidelity', text: 'Later histories tend to quote the same passage less literally' },
        {
          type: 'paragraph',
          text: 'Holding a passage fixed, later-compiled histories tend to quote it less literally (Figure 4). Across 283 merged-fragment clusters spanning at least five distinct composition years, the mean per-cluster Spearman correlation between literal fidelity and composition year is −0.15 (69.3% of clusters negative; cluster-bootstrap 95% CI [−0.19, −0.12]; permutation p < 0.001). The decline is steeper for direct quotation (−0.18) than for paraphrase (−0.08) and strengthens among pairs with confidence of 0.9 or higher (172 clusters, ρ = −0.19, p < 0.001). Zhang Xuecheng observed that transmission alters wording: {{zhangTransmission}}, successive historians recast their sources’ wording not from a taste for difference but because circumstance required it.',
          sources: [{ part: 'scaling', pages: [7] }],
        },
        { type: 'figure', figure: 'fidelity' },
        { type: 'subheading', id: 'asymmetric', text: 'Reuse that a fixed segmentation cannot align' },
        {
          type: 'paragraph',
          text: 'Reading each chunk in full also recovers reuse whose two sides differ in extent. In the *Book of Han* a single clause praising Emperor Cheng’s bearing, {{carriage}} (on mounting the carriage he stood straight; he did not look round, spoke not hastily, pointed at nothing), draws on two separate passages of the *Analects* chapter “Xiangdang”: {{xiangdangMounting}} (mounting the carriage, he stood straight and grasped the cord) and {{xiangdangRiding}} (in the carriage he did not look round, spoke not hastily, pointed at nothing). Both pairs were accepted. A sentence-to-sentence ranking would have to pick one *Analects* sentence or split its score between the two. The corpus run contains 117 groups in which one history span answers to two or more disjoint *Analects* passages.',
          sources: [{ part: 'scaling', pages: [7] }],
        },
      ],
    },
    {
      id: 'limitations',
      kind: 'plain',
      heading: 'Limitations',
      blocks: [
        {
          type: 'paragraph',
          text: `The corpus run uses a single model whose precision was measured on the *Book of Han* only. The findings we rely on persist and strengthen among pairs with confidence of 0.9 or higher, which make up 55.3% of the run, so lower-confidence pairs do not carry them. On the benchmark, ${deploymentModel}’s candidates at that confidence are 96.1% valid. Every count of reuse is a lower bound, since only pairs that some model proposed can be counted.`,
          sources: [{ part: 'discussion', pages: [7] }],
        },
        {
          type: 'paragraph',
          text: 'The model may have absorbed earlier scholarly identifications of reuse, so we present the system as assistive. Contamination cuts unevenly: cases a model may have memorized concentrate among famous, marked citations, while the value at corpus scale lies in unmarked paraphrase, which concordances do not list. Each history enters the diachronic analyses with a single composition date although several took decades to compile, and the split between early and late histories follows the received periodization.',
          sources: [{ part: 'discussion', pages: [7] }],
        },
        {
          type: 'paragraph',
          text: 'The benchmark is a controlled evaluation setting for one source pair, not a universal intertextuality benchmark.',
          sources: [{ part: 'discussion', pages: [7] }],
        },
      ],
    },
    {
      id: 'using',
      kind: 'plain',
      heading: 'Using this work',
      blocks: [
        {
          type: 'paragraph',
          text: `Two resources are public: the paper on [arXiv](${links.arxivAbs}) and the [Explorer](${links.explorer}), a site in Chinese that shows every intertextual pair of the Twenty-Four Histories run in its textual context, with its spans and labels, and groups pairs into clusters that trace the reception of a passage.`,
          sources: [],
        },
        {
          type: 'paragraph',
          text: 'The protocol needs only a source pair that can be segmented and a typology of reuse to annotate, and little in it is specific to the *Analects* or to Chinese: its checks apply wherever reuse must be tied to exact spans.',
          sources: [{ part: 'discussion', pages: [7] }],
        },
      ],
    },
    {
      id: 'cite',
      kind: 'plain',
      heading: 'Cite',
      blocks: [{ type: 'bibtex' }],
    },
    {
      id: 'acknowledgments',
      kind: 'plain',
      heading: 'Acknowledgments',
      blocks: [
        {
          type: 'paragraph',
          text: 'This work was supported by the National Key Research and Development Program of China (“Research on Cross-Context Barrier-Free Interactive Technology and Equipment for Ethnic Regions,” No. 2025YFC3309300) and the National Natural Science Foundation of China (“The Construction of the Knowledge Graph for the History of Chinese Confucianism,” No. 72010107003).',
          sources: [],
        },
      ],
    },
  ],
  footer: {
    rights: 'Page text and figures: all rights reserved. Code: MIT License.',
    maintainedBy: 'Maintained by',
  },
}
