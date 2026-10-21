# Beyond Similarity paper page

The public website for the paper *Beyond Similarity: Grounded Agentic Extraction and Expert-Adjudicated Evaluation of Intertextuality in Classical Chinese Histories*. The site is bilingual, so every term below carries one canonical English form and one canonical Chinese form; site copy in either language uses only these.

## Site

**Paper page**（论文主页）:
This website, the public page that presents the paper to readers.
_Avoid_: project page, landing page, homepage (the homepage is the first author's personal site)

**Explorer**（互文图谱）:
The public interactive site 《论语》×二十四史互文图谱, which shows every intertextual pair from the Twenty-Four Histories run in its textual context.
_Avoid_: platform, demo, visualization site, viz site

## Texts and units

**Twenty-Four Histories**（二十四史）:
The canonical official dynastic histories, from the *Shiji* to the *Mingshi*, compared against the *Analects*.
_Avoid_: dynastic histories (as a proper name), standard histories

**Chunk**（文本块）:
The unit of comparison: one book of the *Analects* or one scroll of a history, read whole. The abstract's *text unit* (文本单元) is the same thing.
_Avoid_: segment, unit, passage, 组块

**Chunk pair**（文本块对）:
One *Analects* chunk paired with one history chunk; each chunk pair is one extraction task.
_Avoid_: task pair, text pair

**Sentence unit**（句子单元）:
One of the 1,470 *Analects* sentences that the dense-retrieval baseline ranks; the one that overlaps the source fragment is the source sentence (源句).
_Avoid_: 句子单位

**Fixed segmentation**（固定切分）:
Cutting texts into sentences or segments before comparing them, which cannot align reuse whose two sides differ in extent.
_Avoid_: 固定分段

## Method

**Grounded agentic extraction**（落地化智能体抽取）:
The paper's method: an LLM agent reads two chunks whole and may record an intertextual pair only after grounding both fragments in exact spans through a checked tool interface. The Chinese title of the paper is 超越相似度：古代中国史书互文的落地化智能体抽取与专家仲裁评测.
_Avoid_: grounded extraction pipeline, 接地抽取

**Grounding**（落地）:
Tying a proposed reuse to exact spans on both sides, verified character for character when the pair is committed.
_Avoid_: anchoring, 锚定 (reserved for verbatim-anchored pairs in the paper's retrieval analysis)

**LLM**（大语言模型）:
A large language model. The Chinese page introduces the abbreviation at its first mention as 大语言模型（LLM, Large Language Model）.
_Avoid_: 大型语言模型

**Agent**（智能体）:
The LLM that works through one extraction task, acting on the text only through the protocol's tools.
_Avoid_: 代理 or 智能代理

**Span-grounded relation extraction**（区间落地的关系抽取）:
The paper's framing of intertextuality: locate each reused fragment on both sides as an exact span, then label the pair by the kind of reuse.

**Positioning tool**（定位工具）:
The exact substring search (`find_position`) that returns a wording's offsets with 30 characters of context on each side.

**Re-slice check**（逐字回切）:
The check at commit time that cuts both chunks at the stated offsets and rejects the pair unless each fragment reproduces character for character.

**Stop guard**（停止守卫）:
The rule that keeps an agent from ending a task before it calls `submit`.

**Abstention**（弃权）:
A task's explicit declaration that its chunk pair holds no reuse, a defined outcome distinct from a failed task.
_Avoid_: 拒答

**Match, no match**（匹配、无匹配）:
The two statuses a task can declare when it calls `submit`: a match needs at least one committed pair, a declaration of no match needs none.

**Commit checks**（校验）:
The three checks `add_pair` runs before it records a pair: the format of labels and spans (标签与区间检查), the re-slice check, and the refusal of duplicates.
_Avoid_: 检验 (reserved for statistical tests such as the permutation test)

**Offset**（偏移）:
A character position inside a chunk; a span is given by its start and end offsets.
_Avoid_: 偏移量

**Task attempt**（任务尝试）:
One run of an agent on one extraction task.

**Extraction protocol**（抽取协议）:
The tools and checks under which every extraction task runs.

**Extractor**（抽取器）:
An LLM running under the extraction protocol; the deployment model is the extractor chosen on the benchmark.

**Pipeline**（管线）:
A fixed sequence of processing steps, such as the validate-then-scale design or a retrieve-then-judge baseline.
_Avoid_: 流水线

**Text-reuse detector**（文本复用检测器）:
A tool that finds passages resembling a source, by string matching or retrieval, without saying how the source is reused.
_Avoid_: 文本重用检测器

## Intertextual pairs

**Intertextuality**（互文性）:
The reuse of one text's wording or structure in another, the relation the paper extracts. Compounds such as 互文对 and 互文功能 drop the 性 of the Chinese term; standing alone, the term keeps it.
_Avoid_: 文本间性

**Reuse**（复用）:
Traceable textual dependence of one text on another. Shared topic, agreement, common vocabulary and diffuse influence do not count.
_Avoid_: 重用 or 借用

**Intertextual space**（互文空间）:
All the reuse relations between two texts; each model finds a different part of it, and the pooled benchmark brings the parts together.

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
Whether the reuse is a direct quotation (直接引用) or a paraphrase (转述).
_Avoid_: bare 引用 as the name of the direct-quotation category

**Aspect**（复用层面）:
Whether the reuse takes over content (内容) or structure (结构).

**Source-marking**（来源标记）:
Whether the source is named explicitly (显性), marked (有标记), or left unmarked (无标记).
_Avoid_: signaling, attribution

**Function**（互文功能）:
What the reuse does in its new context: background (背景), support (支持), application (应用), or critique (批判).
_Avoid_: 主要互文功能 (the Explorer's label for the dimension), 批评

**Stance**（立场）:
The citing text's attitude toward the source: positive (肯定), neutral (中立), negative (否定), or complex (复杂).
_Avoid_: 正面 or 负面

## Evaluation

**Candidate pool**（候选池）:
The 3,489 distinct intertextual pairs proposed by twelve LLMs on the *Analects*–*Book of Han* comparison, before expert judgement. The abstract's pooled candidate set (候选集) is the same pool.

**Candidate**（候选）:
One distinct pair in the candidate pool, proposed by at least one model and not yet judged.

**Arbiter**（仲裁人）:
The third expert, who resolved every disagreement between the two judging experts.
_Avoid_: 仲裁者

**Expert-adjudicated benchmark**（专家仲裁基准）:
The 2,533 intertextual pairs of the candidate pool that adjudication accepted. Two experts judged every candidate, and the third expert settled every disagreement between them, whether over validity or over labels; the 716 pairs that both experts accepted with matching labels never went to the arbiter. Later mentions shorten it to the benchmark (基准).
_Avoid_: dataset, ground truth, corpus, 金标 or 仲裁金标

**Valid pair**（有效互文对）:
A candidate that expert adjudication accepts; precision and cost per valid pair count these.

**Threshold**（门槛）:
The level at which a candidate is accepted: an expert's strictness on validity, or a minimum stated confidence.
_Avoid_: 阈值

**Agreement**（一致性）:
How often the two experts give the same judgement, measured before adjudication.
_Avoid_: 一致度

**Observed agreement**（观察一致率）:
The share of the 1,930 candidates both experts accepted on which they gave the same label.
_Avoid_: 观测一致率

**Chance agreement**（机会一致率）:
The agreement expected from each expert's label frequencies alone, which Cohen's κ corrects for.
_Avoid_: 偶然一致率 or 期望一致率

**Majority-class baseline**（多数类基线）:
Labelling every pair with the most frequent category of a dimension; label accuracy is reported as a gain over it.
_Avoid_: 多数类基准 (基准 names the benchmark)

**Label accuracy**（标签准确率）:
How often a model's label on a dimension matches the adjudicated label.
_Avoid_: 标注准确率

**Precision**（精确率）:
The share of a model's committed pairs that expert adjudication judges valid; it says nothing about recall.
_Avoid_: 准确率 (accuracy, which the page uses for label accuracy), 查准率

**Recall**（召回率）:
The share of all reuse in the texts that a method finds. The candidate pool holds only pairs that some model proposed, so the benchmark measures precision, not recall.
_Avoid_: 查全率

**Cost per valid pair**（每个有效互文对的成本）:
Billed API cost divided by the model's valid pairs. Cost (成本) is always the billed API cost, in USD.
_Avoid_: 费用

**Efficient frontier**（有效前沿）:
In Figure 2, the models that no other model beats on both precision and cost per valid pair.
_Avoid_: 效率前沿

**Latency**（时延）:
The median time a model takes per task, in seconds.
_Avoid_: 延迟

**AUC**（曲线下面积）:
The area under the ROC curve, here how well stated confidence separates valid from invalid candidates. The Chinese page introduces it as 曲线下面积（AUC, Area Under the Curve）.
_Avoid_: 曲线下方面积

**Confidence**（置信度）:
The probability a model states for each pair it commits.
_Avoid_: 置信分数

**Confidence bucket**（置信度桶）:
A range of stated confidence, such as 0.9 to 0.95, over which the share of valid candidates is measured.
_Avoid_: 置信度区间 (too close to a confidence interval, 置信区间)

**Calibration**（校准）:
How closely the share of valid candidates in each confidence bucket matches the confidence the models stated.
_Avoid_: 标定

**Similarity score**（相似度分数）:
The one value by which string-matching and retrieval methods record how much two passages overlap, keeping the degree of reuse and discarding its kind.
_Avoid_: 相似度得分

**Literal similarity**（字面相似度）:
Overlap in characters between two passages, as string matching measures it.
_Avoid_: 表层相似度

**Distributional similarity**（分布相似度）:
Closeness of two passages in an embedding space, as dense retrieval and embedding prefilters measure it.
_Avoid_: 语义相似度 (the page does not equate closeness in an embedding space with closeness in meaning)

**Character trigram**（连续三字）:
Three consecutive characters. The retrieval analysis counts the pairs whose two fragments share no character trigram: 25.8% of the benchmark.
_Avoid_: 三元组

**Verbatim-anchored pair**（逐字锚定的互文对）:
In the retrieval analysis, a pair anchored by wording its two fragments share verbatim, the stratum set against the pairs that share no character trigram.

**Dense retrieval**（稠密检索）:
Retrieval by embedding similarity, tested in the paper with BGE-M3.
_Avoid_: 密集检索

**Retrieve-then-judge pipeline**（先检索后判读的管线）:
A baseline in which retrieval proposes the source and a model judges only what retrieval surfaces.

**Prefilter**（预过滤）:
A step that discards chunk pairs by dense or sparse embedding similarity before extraction.
_Avoid_: 预筛选 or 粗筛

**Contamination**（数据污染）:
A model's possible memory of earlier scholarly identifications of reuse, which concentrates among famous, marked citations.
_Avoid_: 数据泄露

**Reliability gradient**（信度梯度）:
The pattern in expert agreement: dimensions legible on the textual surface (form, source-marking) are annotated consistently, while those that require inferring intent (function, stance) are contested.
_Avoid_: agreement gap

**Validate-then-scale**（先验证后规模化）:
The study design: validate extraction against the expert-adjudicated benchmark, then apply the chosen extractor to all Twenty-Four Histories.

**Cultural attraction**（文化吸引）:
An account of cultural transmission in which items change as they are passed on yet converge on a few stable forms. The paper reads the absence of a detectable change in the mix of reuse types, alongside drifting individual passages, in these terms.
_Avoid_: cultural evolution, attractor theory

**Deployment model**（部署模型）:
The LLM selected on the benchmark (deepseek-v4-flash) to run extraction over the full Twenty-Four Histories.
_Avoid_: production model, chosen LLM

## Corpus run

**Corpus run**（全量运行）:
The deployment model's extraction over the *Analects* paired with every scroll of the Twenty-Four Histories: 65,380 chunk-pair tasks, 5,766 intertextual pairs.
_Avoid_: production run, 全量抽取

**Composition year**（成书年份）:
The single year with which a history enters the analysis, although several histories took decades to compile. Every computed relation and every cut-off takes it: a correlation with composition year, the split at 659 and 945 CE, a trend over composition year.

**Composition date**（成书年代）:
A history's time of composition as an ordering or a span, in phrases such as 较晚成书 and 成书年代相隔越远; a computed relation or a cut-off takes composition year instead.

**Diachronic analysis**（历时分析）:
An analysis of change across the histories' composition years.
_Avoid_: 纵向分析

**Received periodization**（通行的分期）:
The conventional division of the histories into periods, which the split between early and late histories follows.
_Avoid_: 传统分期

**Dominant category**（主导类别）:
The most frequent category of a dimension; the diachronic analysis follows its share across the histories.

**Usage profile**（用法画像）:
The mix of reuse types in one history; the paper compares the profiles of two histories by Jensen–Shannon divergence.

**Citation density**（引用密度）:
How often a history cites the *Analects*, a count-level measure that needs no typology and on which the paper rests no claim.

**Longest common subsequence**（最长公共子序列）:
The character-level alignment of a history fragment with its *Analects* source, from which literal fidelity is computed.
_Avoid_: 最长公共子串 (the longest common substring, a different measure)

**Spearman correlation**（Spearman 相关系数）:
A rank correlation, written ρ.
_Avoid_: 斯皮尔曼相关系数

**Permutation test**（置换检验）:
A test that compares a statistic with its values under random reassignments of the data; the page gives its p-values.
_Avoid_: 排列检验

**Cluster bootstrap**（簇级自助法）:
Resampling whole merged-fragment clusters to put a confidence interval on the mean per-cluster correlation.
_Avoid_: 自举法

**Confidence interval**（置信区间）:
A range around an estimate at a stated confidence level, here 95%.
_Avoid_: 置信度区间 (see confidence bucket) or 信赖区间

**Jensen–Shannon divergence**（Jensen–Shannon 散度）:
A distance between two distributions, here two histories' usage profiles.
_Avoid_: JS 距离 (the distance is the square root of the divergence)

**Kruskal–Wallis test**（Kruskal–Wallis 检验）:
A rank-based test of whether groups differ, used to compare literal fidelity across the source-marking categories.
_Avoid_: 克鲁斯卡尔–沃利斯检验

## Scholarship

**Concordance scholarship**（索引之学）:
Tracing reuse by hand by setting text against text (对勘), the work that concordances record.

**Doubting Antiquity movement**（疑古运动）:
The movement launched by Gu Jiegang's thesis that each age extended the history it received.

**Applying the classics to affairs**（通经致用）:
*tong-jing zhi-yong*, native scholarship's name for citing the canon in governance and policy, where a citation's force is that the sage would have approved the decision, not its exact words.

**Compositional and evidential registers**（著作之体、考据之体）:
Zhang Xuecheng's distinction between composition, which may take over existing text without marking the source, and evidential scholarship.
