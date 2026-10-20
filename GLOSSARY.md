# Beyond Similarity paper page

The public website for the paper *Beyond Similarity: Grounded Agentic Extraction and Expert-Adjudicated Evaluation of Intertextuality in Classical Chinese Histories*. The site is bilingual, so every term below carries one canonical English form and one canonical Chinese form; site copy in either language uses only these.

## Site

**Paper page**（论文主页）:
This website, the public page that presents the paper to readers.
_Avoid_: project page, landing page, homepage (the homepage is the first author's personal site)

## Texts and units

**Twenty-Four Histories**（二十四史）:
The canonical official dynastic histories, from the *Shiji* to the *Mingshi*, compared against the *Analects*.
_Avoid_: dynastic histories (as a proper name), standard histories

**Chunk**（文本块）:
The unit of comparison: one book of the *Analects* or one scroll of a history, read whole.
_Avoid_: segment, unit, passage, 组块

**Chunk pair**（文本块对）:
One *Analects* chunk paired with one history chunk; each chunk pair is one extraction task.
_Avoid_: task pair, text pair

## Intertextual pairs

**Intertextual pair**（互文对）:
One reuse relation between a fragment of the *Analects* and a fragment of a history, both grounded as exact spans and labelled under the five-dimension typology.
_Avoid_: text-reuse pair, parallel, match, 句对

**Fragment**（片段）:
The exact reused wording on one side of an intertextual pair.
_Avoid_: snippet, quote, excerpt

**Span**（字符区间）:
A fragment's half-open character range [start, end) inside its chunk.
_Avoid_: offset range, position, 跨度

**Merged-fragment cluster**（合并片段簇）:
The intertextual pairs whose *Analects*-side fragments overlap, gathered as the reception of one passage.
_Avoid_: group, family

**Literal fidelity**（字面忠实度）:
How closely a history fragment reproduces the wording of its *Analects* source, measured character by character.
_Avoid_: similarity score (that names the competing paradigm), faithfulness

## Five-dimension typology

**Five-dimension typology**（五维复用类型学）:
The label scheme describing how a fragment is reused, along form, aspect, source-marking, function, and stance.
_Avoid_: taxonomy, tag set, schema

**Form**（复用形式）:
Whether the reuse is a direct quotation or a paraphrase.

**Aspect**（复用层面）:
Whether the reuse takes over content or structure.

**Source-marking**（来源标记）:
Whether the source is named explicitly, marked, or left unmarked.
_Avoid_: signaling, attribution

**Function**（互文功能）:
What the reuse does in its new context: background, support, application, or critique.

**Stance**（立场）:
The citing text's attitude toward the source: positive, neutral, negative, or complex.

## Evaluation

**Candidate pool**（候选池）:
The 3,489 distinct intertextual pairs proposed by twelve LLMs on the *Analects*–*Book of Han* comparison, before expert judgement.

**Expert-adjudicated benchmark**（专家仲裁基准）:
The 2,533 intertextual pairs in the candidate pool that two experts judged and a third adjudicated as valid.
_Avoid_: dataset, ground truth, corpus

**Reliability gradient**（信度梯度）:
The pattern in expert agreement: dimensions legible on the textual surface (form, source-marking) are annotated consistently, while those that require inferring intent (function, stance) are contested.
_Avoid_: agreement gap

**Validate-then-scale**（先验证后规模化）:
The study design: validate extraction against the expert-adjudicated benchmark, then apply the chosen extractor to all Twenty-Four Histories.

**Deployment model**（部署模型）:
The LLM selected on the benchmark (deepseek-v4-flash) to run extraction over the full Twenty-Four Histories.
_Avoid_: production model, chosen LLM
