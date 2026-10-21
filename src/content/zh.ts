import { links, paper, stats } from '../data/paper'
import { formatYear } from '../lib/format'
import { benchmarkPairs, corpusComparisons, deploymentModel, mostPreciseModel, shareCard } from './shared'
import type { PageCopy } from './types'

// First-screen copy takes its numbers from the facts module, through ./shared
// for the values every page states alike. The abstract, translated from the
// arXiv abstract, and the section prose state numbers as text:
// tests/prose-figures.spec.ts checks every number of two or more digits in
// each section, the abstract included, against the same literals copied from
// the paper, with the one change of form that tests/paper-literals.ts
// declares, and checks the Chinese wording of the numbers written as words
// and of the phrases that tie single digits and paired numbers to their
// objects. tests/parity.spec.ts compares the numbers of figure text
// alternatives, captions and the abstract with the English page's.
const firstHistory = formatYear(stats.compositionYears.first, 'zh-Hans')
const lastHistory = formatYear(stats.compositionYears.last, 'zh-Hans')

export const zh: PageCopy = {
  lang: 'zh-Hans',
  title: paper.titleZh,
  description: `大语言模型智能体把《论语》的每处复用落地到精确字符区间，并标注复用方式。这一方法经 ${benchmarkPairs} 条专家仲裁互文对验证。`,
  siteName: paper.shortTitleZh,
  openGraphLocale: 'zh_CN',
  shareImage: {
    image: shareCard.image,
    alt: `英文分享卡片。题名：${shareCard.title}。作者：${shareCard.byline}。arXiv:${shareCard.arxivId}`,
  },
  skipLink: '跳到正文',
  correspondingNote: '通讯作者',
  finding: `我们让大语言模型智能体把它提出的每处复用落地到精确字符区间，并标注来源被复用的方式，再用《论语》与《汉书》之间的 ${benchmarkPairs} 条专家仲裁互文对验证它。在成书于${firstHistory}至 ${lastHistory}的正史中，直接引用和无标记复用的占比都未检出系统性变化，而同一原文在较晚成书的史书中字面忠实度总体较低。`,
  abstract:
    '互文性的计算方法已从字符串匹配走到神经检索，但其输出（相似度分数与平行段落列表）只标明文本在哪里相互复用，而不刻画「如何」与「为何」。我们把细粒度互文抽取改写为一个智能体任务：大语言模型（LLM, Large Language Model）完整读入两个文本单元，经由受约束的工具接口，必须把每条提出的复用落地到两侧的精确字符区间，并按五维复用类型学（复用形式、复用层面、来源标记、互文功能、立场）标注。我们在《论语》与《汉书》的穷尽比对上验证这一方法：三位领域专家把多模型汇集的候选集仲裁为 2,533 条互文对构成的基准。以此为标准，我们研究十二个大语言模型，报告精确率（56%～93%）、可比质量下 51 倍的成本跨度，以及其置信度校准得如何。专家一致性勾勒出一条「信度梯度」：证据落在文本表面的维度被一致地标注，而需要推断意图的维度存在争议，这划定了此类标注所能支撑的主张。把验证过的抽取器扩展到全部二十四史（65,380 次比对、5,766 对），得到相似度分数无法表达的语料级结构。引用的解释性构成在十八个世纪间未显示系统性变化，同一段经文却被引得越来越不逐字。总体稳定与个案漂移并存，正是文化吸引式解释所预期的。我们发布抽取协议与专家仲裁基准。',
  glanceHeading: '一览',
  glance: {
    benchmark: '《论语》与《汉书》之间的专家仲裁互文对',
    precision: `${stats.models} 个大语言模型对照这一基准的精确率`,
    costSpread: `精确率最高的 ${mostPreciseModel} 与 ${deploymentModel} 每个有效互文对的成本之比，后者精确率低 ${stats.precisionGapPoints} 个百分点`,
    corpusRun: `${deploymentModel} 在二十四史上经 ${corpusComparisons} 次比对抽取的互文对。如果它在《汉书》上 ${stats.deploymentPrecision.toFixed(1)}% 的精确率在这里同样成立，其中约每 ${stats.expectedSpuriousOneIn} 条就有 1 条是误报。`,
  },
  navHeading: '本页内容',
  links: {
    arxiv: `arXiv:${paper.arxivId}`,
    pdf: 'PDF',
    explorer: '互文图谱',
    cite: '引用',
  },
  copyButton: {
    idle: '复制 BibTeX',
    done: '已复制',
    failed: '复制失败。请直接选中上方的条目。',
  },
  bibtexLabel: 'BibTeX 条目',
  sources: {
    lead: '出处：',
    parts: {
      introduction: '引言',
      protocol: '任务与智能体抽取协议',
      evaluation: '专家仲裁评测',
      scaling: '规模化到二十四史',
      discussion: '讨论与局限',
    },
    pages: (pages) => (pages.length === 1 ? `PDF 第 ${pages[0]} 页` : `PDF 第 ${pages[0]}～${pages[1]} 页`),
  },
  figures: {
    openFull: '查看原图',
    items: {
      framework: {
        label: '图 1',
        alt: '四栏示意图，图中文字为英文。(a) 大语言模型智能体完整读入《论语》的一篇和史书的一卷，用 find_position 工具查找措辞，取得精确的起止偏移，再把互文对提交给 add_pair 工具。add_pair 检查标签与区间的格式，按所述偏移把原文重新切片，并拒绝重复的互文对。list 和 remove 工具用来修订已提交的互文对。(b) 一条已提交的互文对，来自《论语》第 13 篇和《汉书》第 6 卷，两侧片段没有一个字相同，标注为转述、内容、有标记、应用、肯定，证据强度中等，置信度 0.72。(c) 三格漫画：一次运行结束时有若干条已提交的互文对；停止守卫拦住除 submit 之外的所有出口；submit 把任务判为匹配或无匹配，其他任何结束方式都记为失败。(d) 管线：2,400 个文本块对任务乘以 12 个大语言模型，提出 6,018 条互文对，汇集为 3,489 条候选。两位专家加一位仲裁人得出 2,533 条专家仲裁互文对。据此按精确率、成本和校准选出抽取器，在 24 部史书上运行 65,380 个任务，得到 5,766 条互文对。',
        caption:
          '框架总览。(a) 单个文本块对的抽取智能体及其任务工具：`find_position` 把候选措辞落地到精确偏移，`list` 和 `remove` 用于修订，`add_pair` 只在通过图中三项检查后才提交一条互文对。(b) 图中这条已提交的互文对是真实个案，两侧片段没有一个字相同：汉武帝的一道诏书只凭孔子之名援引《论语》第 13 篇。(c) 任务只能经 `submit` 结束，`submit` 对照已提交的集合核对所声明的状态，其他任何结束方式都记为失败。(d) 先验证后规模化的管线。',
      },
      models: {
        label: '图 2',
        alt: '十二个大语言模型的散点图：精确率对每个有效互文对的成本，成本为对数轴。一条虚线有效前沿经过 deepseek-v4-flash、deepseek-v4-pro 和 doubao-2.1-turbo，其中 deepseek-v4-flash 以绿色描边，标示为选定的模型。claude-haiku-4.5 位置最低，精确率约 56%。',
        caption:
          '十二个大语言模型在 2,533 条互文对的基准上：精确率对每个有效互文对的成本（对数刻度）。选定的部署模型 `deepseek-v4-flash` 每单位成本换得的精确率最高，各项计数见表 2。',
      },
      calibration: {
        label: '图 3',
        alt: '柱状图，显示十二个模型汇总后，各置信度桶内被判为有效的候选比例：低于 0.7 为 41%，0.7～0.8 为 56%，0.8～0.9 为 74%，0.9～0.95 为 91%，0.95 及以上为 99%。灰色色带标出每个桶的名义范围，低于 0.9 的各柱都没有达到各自的色带。',
        caption:
          '模型自报置信度的校准，汇总十二个模型：各置信度桶内被判为有效的候选比例。柱子没有达到灰色色带，表示模型在该桶内过度自信。',
      },
      fidelity: {
        label: '图 4',
        alt: '箱线图，显示各簇字面忠实度与成书年份的 Spearman 相关系数。全部互文对：283 个簇，均值 −0.15。直接引用：123 个簇，均值 −0.18。转述：170 个簇，均值 −0.08。三个均值都在零的左侧，都带有表示置换检验 p 小于 0.05 的星号。',
        caption:
          '固定原文时，字面忠实度往往随引用方史书的成书年份下降：各簇忠实度与年份的 Spearman 相关系数分布。箱体为四分位距，菱形为各层均值，星号表示置换检验 p 小于 0.05，*k* 为符合条件的簇数。',
      },
    },
  },
  tables: {
    scrollRegion: (label) => `${label}，可横向滚动`,
    agreement: {
      label: '表 1',
      caption:
        '两位专家在五个标签上的一致性，基于两人都接受的 1,930 条候选，在仲裁之前计算。机会一致率指按每位专家各自的标签频率推算的预期一致率，即 Cohen’s κ 所校正的基线。',
      headers: { dimension: '维度', observed: '观察一致率', chance: '机会一致率', kappa: 'Cohen’s κ' },
      dimensions: {
        form: '复用形式（直接引用/转述）',
        aspect: '复用层面（内容/结构）',
        sourceMarking: '来源标记（显性/有标记/无标记）',
        function: '互文功能（背景/支持/……）',
        stance: '立场（肯定/中立/……）',
      },
    },
    models: {
      label: '表 2',
      caption:
        '十二个模型在 2,400 个评测任务上的结果：候选数、有效互文对数、精确率（已提交的互文对中经专家仲裁判为有效的比例）、总成本、每个有效互文对的成本，以及每个任务的中位时延。',
      headers: {
        model: '模型',
        candidates: '候选',
        valid: '有效',
        precision: '精确率',
        cost: '成本（美元）',
        costPerValid: '每个有效互文对的成本（美元）',
        latency: '中位时延（秒）',
      },
      total: '合计',
    },
    diachronic: {
      label: '表 3',
      caption:
        '二十四史中复用类型的构成。早期与晚期分别是 659 年及以前成书、945 年起成书的史书合并计算的占比。ρ 是 24 部史书中主导类别的逐史占比与成书年份的 Spearman 相关系数，p 是 2,000 次置换得到的置换检验 p 值。没有一个趋势的 p 低于 0.05。',
      headers: {
        dimension: '维度',
        dominant: '主导类别',
        early: '早期',
        late: '晚期',
        rho: 'ρ',
        p: 'p',
      },
      dimensions: {
        form: '复用形式',
        aspect: '复用层面',
        sourceMarking: '来源标记',
        function: '互文功能',
        stance: '立场',
      },
      dominant: {
        quotation: '直接引用',
        content: '内容',
        unmarked: '无标记',
        support: '支持',
        positive: '肯定',
      },
    },
  },
  sections: [
    {
      id: 'abstract',
      kind: 'plain',
      heading: '摘要',
      blocks: [{ type: 'abstract' }],
    },
    {
      id: 'gap',
      kind: 'question',
      heading: '相似度分数漏掉了什么？',
      answer:
        '漏掉的是复用的种类。分数只记下两段文字重合多少，史家要问的却是一段话是忠实称引、借重权威，还是已经磨成套语。',
      blocks: [
        {
          type: 'paragraph',
          text: '《汉书》（公元一世纪）近乎逐字地转录了《论语》的禅让册命{{charge}}。几章之后，在篡位者王莽的传记里，同一句话再次出现，作{{wangMang}}，第二人称代词悄悄换成了第一人称。到 260 年代，《三国志》的禅让文书里只剩下一个公式化的骨架{{jinAbdication}}，已脱离《论语》，融进了王朝更替的标准文书。文本复用检测器能发现这三处都与《论语》相似，却说不出第一处是忠实的称引，第二处是对权威的挪用，第三处是僵死的套语。',
          sources: [{ part: 'introduction', pages: [1] }],
        },
        {
          type: 'paragraph',
          text: '用人工追踪这种复用，是索引之学的功夫。顾颉刚靠文本之间的逐一对勘，为传说中的古史分出层次、判定先后。他认为每个时代都把承接下来的古史再加长一层，这一论断开启了疑古运动。这类对勘受限于专家能持续投入多少注意力，顾颉刚本人也只打算一部书一部书地做下去。通行的计算替代方法没有解除这个限制：它们让每次比较都归结为一个相似度值，留下复用的程度，丢掉复用的种类。因此我们把互文性看作区间落地的关系抽取（span-grounded relation extraction）：模型把两侧每个被复用的片段定位为精确字符区间，再按复用的种类标注由此得到的互文对。',
          sources: [{ part: 'introduction', pages: [1] }],
        },
      ],
    },
    {
      id: 'method',
      kind: 'question',
      heading: '落地化智能体抽取如何运作？',
      answer:
        '大语言模型智能体把《论语》的一整篇与史书的一整卷对读，只能通过对照原文核验的工具记录复用，因此每条提交的互文对都指向两侧的精确字符区间，并带有五个维度的标签。',
      blocks: [
        { type: 'figure', figure: 'framework' },
        {
          type: 'paragraph',
          text: '每个任务的输入是一个文本块对，即《论语》的一篇和史书的一卷，要求找出其中所有互文对：两侧各一个片段，以字符区间 [start, end) 给出，并在五个维度上标注。复用形式区分直接引用与转述。复用层面区分对内容的复用与对结构的复用。来源标记记录来源是显性点明、有标记，还是无标记。互文功能记录复用在新语境中起什么作用（背景、支持、应用、批判），立场记录引用方的态度（肯定、中立、否定、复杂）。复用指可追溯的文本依赖，共同话题、观点一致、常用词汇重合和弥散的影响都不算。只有两侧片段都在所述偏移处逐字出现，预测才算正确。',
          sources: [{ part: 'protocol', pages: [3] }],
        },
        {
          type: 'paragraph',
          text: '两个文本块都整体进入模型的上下文。我们不把它们切成句子、再按 n-gram 或嵌入相似度配对，因为索引只会呈现它已经判为相近的内容，而一处引用怎样标记来源、起什么修辞作用，只有放回它所在的语篇才看得出来。',
          sources: [{ part: 'protocol', pages: [3] }],
        },
        {
          type: 'paragraph',
          text: '直接让大语言模型给出被复用的区间，得到的互文对行文流畅，却有时没有落地，甚至是编造的。因此智能体必须用定位工具找到每个片段。这个工具在文本块上做精确子串检索，返回偏移和两侧各 30 个字符的上下文。智能体提交互文对时，协议按所述偏移把两个文本块重新切片，只要有一侧片段不能逐字复现，就拒绝这条互文对。在十二个模型的运行中，智能体共调用定位工具 319,465 次，每次任务尝试约 11 次。校验拒绝了 39% 的提交尝试，按全部尝试计，约四分之一拒在逐字回切，15% 拒在标签与区间检查。拒绝反映的是能否落地，而非质量：精确率最低的那个模型独占了逐字回切拒绝的三分之二，而遇到过拒绝的任务尝试中，81% 最后仍提交了一条被接受的互文对。去掉定位工具后，拒绝率增至九倍，输出 token 数增至五倍。',
          sources: [{ part: 'protocol', pages: [3] }],
        },
        {
          type: 'paragraph',
          text: '从模型自由文本里读出的结论，在语料规模上无法审计。协议从不解析模型在任务结尾写的文字，任务的输出就是经工具提交的互文对集合。工具检查每条互文对的标签与区间，并拒绝重复提交。两条互文对是否相同，看两侧片段文本及各自的偏移。每个任务隔离运行，使用全新的临时主目录，不继承任何配置。每个任务的键是一个哈希，覆盖决定其结果的全部输入，包括提供模型服务的供应商和端点，所以同名模型由两家供应商提供时，不会悄悄复用缓存结果。',
          sources: [{ part: 'protocol', pages: [3] }],
        },
        {
          type: 'paragraph',
          text: '只有每个任务都以明确的结果结束，汇总计数才可信。停止守卫不让智能体在调用 `submit` 之前结束，`submit` 再对照已提交的集合双向核对所声明的状态：声明匹配至少要有一条已提交的互文对，声明无匹配则一条也不能有。以其他方式结束的任务，包括接口报错、重试耗尽、超时，或没有提交就停下的运行，都记为失败，绝不算作空结果。多数文本块对之间没有复用，所以显式弃权本身是一种正式结果。',
          sources: [{ part: 'protocol', pages: [3, 4] }],
        },
      ],
    },
    {
      id: 'benchmark',
      kind: 'question',
      heading: '专家仲裁基准有多可靠？',
      answer:
        '足以用来比较模型，也足以支撑关于复用形式和来源标记的结论。只按两位专家中较严的一位重新计分，模型排名几乎不变，两位专家在这两个标签上的判断也基本一致。互文功能和立场需要推断意图，存在争议，关于它们的发现只是探索性的。',
      blocks: [
        {
          type: 'paragraph',
          text: '基准在公开的标点数字版（识典古籍）上，把《论语》（20 篇，22,919 字符）与《汉书》（120 卷，942,693 字符）穷尽配对，共 2,400 个文本块对任务。十二个大语言模型各自跑完全部 2,400 个任务，提出 6,018 条互文对，把相同偏移上的相同片段合并后，得到 3,489 条互异候选。汇集全部十二个模型，基准就不会偏向某一个模型提出的候选，而各模型提出的候选大多不同：68% 只由一个模型提出。两位专家独立判断每条候选，先判断是否有效，再为有效的互文对标注五个标签，第三位专家仲裁所有分歧。最终得到 2,533 条互文对，占候选池的 72.6%。',
          sources: [{ part: 'evaluation', pages: [4] }],
        },
        {
          type: 'paragraph',
          text: '人工枚举给不出可替代的参照。两项文献学调查统计《汉书》引用《论语》的次数，分别得到 237 和 447，后者将近前者的两倍，两位作者也都预计自己有遗漏。仅在这一对来源上，专家就确认了 954 条有标记的互文对。十二个模型各自单独运行，提交的经仲裁有效的互文对都在 323～572 条之间。',
          sources: [{ part: 'evaluation', pages: [4, 5] }],
        },
        {
          type: 'paragraph',
          text: '在有效性判断上，两位专家宽严不同，标准一致。一位接受了 55.3% 的候选，另一位接受了 99.4%，而且两人的决定是嵌套的：较严的专家接受的候选，较宽的专家一条也没有拒绝。两人都接受的候选有 1,930 条。落在两人阈值之间的 1,539 条，由仲裁人逐条裁定：其中 59.9% 与较严的专家一致，共接受 617 条。标签冲突另把 1,214 条双方都接受的候选送去仲裁，仲裁人把其中 14 条改判为无效，所以 1,930 − 14 + 617 = 2,533。只对照较严的专家重新计分，每个模型的精确率都下降 9～23 个百分点，排名却几乎不动（Spearman 相关系数 ρ = 0.94，没有模型移动超过两位），部署模型的选择也不变。本页的精确率都对照仲裁后的阈值计算。',
          sources: [{ part: 'evaluation', pages: [4] }],
        },
        {
          type: 'paragraph',
          text: '在两位专家都接受的 1,930 条候选上，按仲裁前的标注计算五个标签的一致性，结果呈现一条信度梯度（表 1）。复用形式和来源标记的证据就在文本表面（措辞是否相同，来源是否点名），一看便能判定。互文功能和立场需要重构意图和态度，称职的专家之间也会有各有依据的分歧。复用层面的一致率是 98.9%，但 97% 的互文对复用的是内容，按机会推算的一致率已有 96.1%：这个标签可靠，但几乎是个常量。',
          sources: [{ part: 'evaluation', pages: [4] }],
        },
        { type: 'table', table: 'agreement' },
        {
          type: 'paragraph',
          text: '模型在梯度有信息量的地方复现了这条梯度。与各模型自身的多数类基线相比，标签准确率在复用形式上提高 18～37 个百分点，来源标记上 25～43 个，互文功能上 12～25 个，复用层面和立场上分别至多 2 个和 9 个。分歧来自任务本身，下面这个有争议的条目可以说明。两位专家都接受了一条互文对，它把《论语》的{{diligent}}与《汉书》中一位臣子为皇太子辩护的场景联系起来，两人也都判定这是无标记的逐字引用，立场为肯定。他们只在「为什么引」上分歧：是用经典支持臣子的主张，还是把经典衡量人才的标准应用到一个活人身上（仲裁人裁定为应用）。文本表面没有任何东西能裁决这一点，而候选池中有 345 条与它形态相同：互文对被接受，复用形式和来源标记一致，互文功能在支持与应用之间分歧。',
          sources: [{ part: 'evaluation', pages: [4, 5] }],
        },
      ],
    },
    {
      id: 'similarity',
      kind: 'question',
      heading: '相似度检索会漏掉多少复用？',
      answer:
        '约四分之一的专家仲裁互文对没有一处相同的连续三字。对这些互文对，即使稠密检索器直接用专家标出的片段去查询，也只在 61.0% 的情况下把有重叠的源句排进前十。',
      blocks: [
        {
          type: 'paragraph',
          text: '在 2,533 条专家仲裁互文对中，25.8% 的两侧片段没有一处相同的连续三字，40.8% 没有相同的连续四字。汉武帝的一道诏书援引孔子对不同国君的答问各不相同，为施政重点的调整辩护：{{wuEdict}}。它点出了孔子，却与所援引的教诲{{nearAndFar}}（《论语》第 13 篇）没有一个字相同。班固《叙传》中的赋把《论语》第 18 篇的问津一事压缩为{{rhapsody}}，隐者与弟子各只剩名字里的一个字，也没有标明来源。',
          sources: [{ part: 'evaluation', pages: [4] }],
        },
        {
          type: 'paragraph',
          text: '我们给了稠密检索一个实际部署的管线都没有的优势：用专家标出的史书侧片段直接查询 BGE-M3。对没有相同连续三字的互文对，它只在 61.0% 的情况下把有重叠的源句排进前十（排在第一：33.0%），逐字锚定的互文对则为 91.7%。在 1,470 个《论语》句子单元中，那道诏书和那篇赋的来源分别排在第 232 位和第 470 位。无连续三字重合的这一层，中位排名是 4，逐字锚定的互文对是 1。这些命中率给任何先检索后判读的管线的召回率设了上限，而上限恰好落在需要解读的地方。检索的输出也既不带区间，也不带标签。',
          sources: [{ part: 'evaluation', pages: [4] }],
        },
        {
          type: 'paragraph',
          text: '在整个文本块对的层面也有同样的限制：要保留专家确认的每一处复用，稠密与稀疏嵌入预过滤分别只能剔除 2.5% 和 1.1% 的文本块对，两者合用只有 0.3%，因为字面相似度和分布相似度都会系统地漏掉转述。',
          sources: [{ part: 'introduction', pages: [1] }],
        },
      ],
    },
    {
      id: 'models',
      kind: 'question',
      heading: '十二个大语言模型在精确率、成本和校准上有何差别？',
      answer: `对照基准，精确率在 55.9%～92.9% 之间，十二个模型中有八个不低于 82%。质量与成本各自独立变化：精确率最高的 ${mostPreciseModel} 每个有效互文对的成本是 ${deploymentModel} 的 51 倍，后者精确率低 4.9 个百分点，每美元换来的精确率最高，因此我们选它做全量运行。`,
      blocks: [
        { type: 'table', table: 'models' },
        {
          type: 'paragraph',
          text: `时延与这两者也各自独立：${mostPreciseModel} 同时是最慢的模型（每个任务的中位时延为 521 秒），而最快的几个模型（37～39 秒）精确率跨度很大（表 2）。`,
          sources: [{ part: 'evaluation', pages: [5] }],
        },
        { type: 'figure', figure: 'models' },
        {
          type: 'paragraph',
          text: `模型自报的置信度有信息量，但偏乐观。汇集十二个模型，置信度区分有效与无效候选的曲线下面积（AUC, Area Under the Curve）为 0.85。自报置信度不低于 0.9 的候选，96.6% 有效（只看 ${deploymentModel}：AUC 0.84，96.1%）。低于 0.9 时，各模型系统地过度自信（图 3）。`,
          sources: [{ part: 'evaluation', pages: [5] }],
        },
        { type: 'figure', figure: 'calibration' },
        {
          type: 'paragraph',
          text: '由两个或更多模型共同提出的候选有 88.5% 有效，只由一个模型提出的为 65.1%，所以模型之间的一致是候选有效的信号。各模型找到的是互文空间的不同部分，汇集而成的基准把它们合在一起。',
          sources: [{ part: 'evaluation', pages: [5] }],
        },
      ],
    },
    {
      id: 'histories',
      kind: 'question',
      heading: '二十四史在十八个世纪里如何复用《论语》？',
      answer: `在成书于${firstHistory}至 ${lastHistory}的各部史书之间，复用类型的构成未检出系统性变化，而同一原文在较晚成书的史书中字面忠实度总体较低。`,
      blocks: [
        {
          type: 'paragraph',
          text: `我们用 ${deploymentModel} 把《论语》与二十四史的每一卷配对，共 65,380 个文本块对任务，涉及约 2,850 万字符，没有失败的任务，得到 5,766 条互文对。精确率只在《汉书》上测过，按这一精确率，预计大约每八条中有一条是误报。因此我们把输出看作一组模型判断的分布，这些判断的精确率和校准已在基准上测过。结论建立在分布结构上，不依赖原始总数，每条互文对的置信度则留给想把阈值收得更紧的读者。`,
          sources: [{ part: 'scaling', pages: [5] }],
        },
        { type: 'subheading', id: 'worked-example', text: '一段原文，三种复用' },
        {
          type: 'paragraph',
          text: '禅让册命构成一个合并片段簇，包含从 22 部史书中抽取的 85 条互文对。《汉书》点明出处，近乎逐字地引用它：{{charge}}，标注为直接引用、显性、支持，字面忠实度 0.87，点出经典是为了借重它的权威。同一部史书里的一道拜将册文吸收了它的措辞，标注为直接引用、无标记、应用（0.37），册命的语言转作了日常施政的公文：{{patent}}《三国志》的禅让诏书用{{jinAbdicationEdition}}移交天命，标注为转述、无标记、应用（0.25）。标签把对经典权威的公开诉诸、不声不响的行政挪用和公式化的文书区分开来，而仅在这一个簇里，字面忠实度已有随成书年份下降的趋势。',
          sources: [{ part: 'scaling', pages: [5, 6] }],
        },
        { type: 'subheading', id: 'mix', text: '复用类型的构成未检出漂移' },
        {
          type: 'paragraph',
          text: '比较 659 年及以前成书的史书与 945 年起成书的史书，无标记复用的占比分别为 77.5% 和 77.6%。五个维度中，没有一个维度的主导类别占比与成书年份的相关在置换检验中达到 p < 0.05（表 3；互文功能和立场仍属探索性）。各部史书的用法画像也不随成书年代的间隔拉大而分化：两部史书之间的 Jensen–Shannon 散度与相隔年数不相关（置换检验 p = .12～.28）。从较早的史书到较晚的史书，原始引用密度确实降到约三分之一，但这个计数层面的趋势用不着类型学，也与通行的分期相符，所以我们不以此立论。',
          sources: [{ part: 'scaling', pages: [6] }],
        },
        { type: 'table', table: 'diachronic' },
        {
          type: 'paragraph',
          text: '下文所见单段原文的改写，与复用类型的构成未检出变化并不冲突。文化吸引是一种关于文化传播的解释。它预期群体层面的分布保持稳定，原因是个体的变形向相同的形式收敛，而不是每一项都被忠实复制。',
          sources: [{ part: 'scaling', pages: [6] }],
        },
        {
          type: 'paragraph',
          text: '吸收经典而不标出处，在早期和晚期史书中都占复用的四分之三以上，按本土的说法，这是得到许可的做法。章学诚把著作之体与考据之体分开：{{zhangComposition}}。不过他只把这一许可给予自家论说足以自立、无须倚仗所引之言的作者。刘勰六世纪的诗学已经认为，旧语用得恰当，读来便如同出自己口。',
          sources: [{ part: 'scaling', pages: [6] }],
        },
        { type: 'subheading', id: 'marking', text: '来源标记与字面忠实度是两回事' },
        {
          type: 'paragraph',
          text: '字面忠实度的计算方法，是按字符级最长公共子序列把每个史书片段与它的《论语》源文对齐。一处引用有多贴近字面，并不决定它怎样标记来源。点名来源的引用比无标记的引用字面忠实度更高（中位数 0.78 对 0.38，Kruskal–Wallis 检验 p < 10⁻³），在直接引用内部这一差距依然存在（0.85 对 0.50），所以相似度分数代替不了来源标记这个标签。点名来源是公开诉诸经典权威，措辞也因此要守更高的标准。这种关系只是一种规律，有例外：作者有意隐藏来源时，无标记的引用也可以逐字照录。',
          sources: [{ part: 'scaling', pages: [6] }],
        },
        { type: 'subheading', id: 'function', text: '应用型引用往往不那么贴近字面，大多也不标来源（探索性）' },
        {
          type: 'paragraph',
          text: '标为支持的引用比标为应用的引用更贴近经典的字面（字面忠实度均值 0.50 对 0.42）。应用型引用把经典改用于治理与政策，93% 不标来源。本土学术把这种实用的引经称为「通经致用」：引文的分量在于圣人会赞同这个决定，不在于圣人的原话。互文功能是专家一致性较低的维度（表 1）。',
          sources: [{ part: 'scaling', pages: [6] }],
        },
        { type: 'subheading', id: 'fidelity', text: '较晚的史书引用同一原文，字面忠实度往往更低' },
        {
          type: 'paragraph',
          text: '固定同一段原文来看，较晚成书的史书引用它时往往不那么贴近字面（图 4）。在 283 个合并片段簇上（每簇至少涉及五个不同的成书年份），簇内字面忠实度与成书年份的 Spearman 相关系数平均为 −0.15（69.3% 的簇为负；簇级自助法 95% 置信区间 [−0.19, −0.12]；置换检验 p < 0.001）。直接引用的下降比转述更陡（−0.18 对 −0.08），在置信度不低于 0.9 的互文对中，这一趋势更强（172 个簇，ρ = −0.19，p < 0.001）。章学诚已经看到，流传会改动措辞：{{zhangTransmission}}。',
          sources: [{ part: 'scaling', pages: [7] }],
        },
        { type: 'figure', figure: 'fidelity' },
        { type: 'subheading', id: 'asymmetric', text: '固定切分无法对齐的复用' },
        {
          type: 'paragraph',
          text: '完整读入每个文本块，还能找回两侧长短不一的复用。《汉书》称赞汉成帝仪容的一句{{carriage}}，取材于《论语·乡党》两处分开的记述：{{xiangdangMounting}}和{{xiangdangRiding}}。这两条互文对都被接受。按句子对句子排序，只能选中其中一句《论语》，或者把分数摊到两句上。全量运行中共有 117 组这样的复用：一个史书侧字符区间对应两处及以上互不重叠的《论语》段落。',
          sources: [{ part: 'scaling', pages: [7] }],
        },
      ],
    },
    {
      id: 'limitations',
      kind: 'plain',
      heading: '局限',
      blocks: [
        {
          type: 'paragraph',
          text: `全量运行只用了一个模型，它的精确率只在《汉书》上测过。我们依赖的发现在置信度不低于 0.9 的互文对中依然成立，而且更强。这部分互文对占全量运行的 55.3%，所以这些发现并不靠低置信度的互文对支撑。在基准上，${deploymentModel} 置信度达到这一水平的候选 96.1% 有效。所有复用计数都是下限，因为只有某个模型提出过的互文对才能计入。`,
          sources: [{ part: 'discussion', pages: [7] }],
        },
        {
          type: 'paragraph',
          text: '模型可能吸收过前人对复用的学术认定，所以我们把这个系统定位为辅助工具。这种数据污染的影响并不均匀：模型可能记住的个案集中在著名的、有标记的引用上，而语料规模上的价值在于索引不收的无标记转述。每部史书都只以一个成书年份进入历时分析，尽管有几部编了几十年，早期与晚期的划分也沿用通行的分期。',
          sources: [{ part: 'discussion', pages: [7] }],
        },
        {
          type: 'paragraph',
          text: '这个基准是针对一对来源的受控评测场景，并非通用的互文基准。',
          sources: [{ part: 'discussion', pages: [7] }],
        },
      ],
    },
    {
      id: 'using',
      kind: 'plain',
      heading: '使用本研究',
      blocks: [
        {
          type: 'paragraph',
          // The source lint takes the Markdown [ after 和 for half-width punctuation;
          // tests/typography-zh.spec.ts lints the rendered text.
          // autocorrect-disable
          text: `目前公开的资源有两项：[arXiv](${links.arxivAbs}) 上的论文和[互文图谱](${links.explorer})。互文图谱在原文语境中展示二十四史全量运行得到的每一条互文对及其字符区间和标签，并把互文对归入簇，追踪一段原文的接受史。`,
          // autocorrect-enable
          sources: [],
        },
        {
          type: 'paragraph',
          text: '这套协议只需要一对可以切分的来源和一套用于标注的复用类型学，其中几乎没有专属于《论语》或中文的东西：凡是必须把复用落地到精确字符区间的场合，它的校验都适用。',
          sources: [{ part: 'discussion', pages: [7] }],
        },
      ],
    },
    {
      id: 'cite',
      kind: 'plain',
      heading: '引用',
      blocks: [{ type: 'bibtex' }],
    },
    {
      id: 'acknowledgments',
      kind: 'plain',
      heading: '致谢',
      blocks: [
        {
          type: 'paragraph',
          text: '本文的研究得到国家重点研发计划项目「面向民族地区跨语境无障碍交互技术装备研究」（2025YFC3309300）和国家自然科学基金国际重点合作项目「中国儒家学术史知识图谱构建研究」（项目号：72010107003）的支持。',
          sources: [],
        },
      ],
    },
  ],
  footer: {
    rights: '页面文字与插图保留所有权利。代码采用 MIT 许可证。',
    maintainedBy: '维护者：',
  },
}
