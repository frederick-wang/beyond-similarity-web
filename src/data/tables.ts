// Data of the paper's three tables (arXiv:2607.27595v1, pages 5 and 6). Both
// language pages render these rows; only captions and headers are translated.
// Values are stored as the numbers the paper prints, and src/lib/format.ts
// renders them with the paper's precision.

import type { PdfPage } from './paper'

export type TableId = 'agreement' | 'models' | 'diachronic'

/** The PDF page of arXiv v1 on which each table is printed. */
export const tablePages = { agreement: 5, models: 6, diachronic: 6 } as const satisfies Readonly<Record<TableId, PdfPage>>

/** `wide` tables use the full page width on desktop; `column` tables fit the reading column. */
export const tableLayouts = { agreement: 'column', models: 'wide', diachronic: 'column' } as const satisfies Readonly<
  Record<TableId, 'wide' | 'column'>
>

/** The five dimensions of the reuse typology, in the paper's order. */
export const dimensionIds = ['form', 'aspect', 'sourceMarking', 'function', 'stance'] as const
export type DimensionId = (typeof dimensionIds)[number]

export interface AgreementRow {
  readonly dimension: DimensionId
  /** Observed agreement between the two experts, in percent. */
  readonly observed: number
  /** Agreement expected by chance from the experts' label frequencies, in percent. */
  readonly chance: number
  readonly kappa: number
}

/** Table 1: agreement over the 1,930 candidates both experts accepted, before adjudication. */
export const agreementRows: readonly AgreementRow[] = [
  { dimension: 'form', observed: 87.3, chance: 56.1, kappa: 0.71 },
  { dimension: 'aspect', observed: 98.9, chance: 96.1, kappa: 0.7 },
  { dimension: 'sourceMarking', observed: 85.9, chance: 39.8, kappa: 0.77 },
  { dimension: 'function', observed: 58.9, chance: 39.5, kappa: 0.32 },
  { dimension: 'stance', observed: 77.0, chance: 68.4, kappa: 0.27 },
]

/** The twelve models of the study, in the order of Table 2. */
export const modelNames = [
  'doubao-2.1-turbo',
  'deepseek-v4-pro',
  'glm-5-turbo',
  'deepseek-v4-flash',
  'doubao-2.1-pro',
  'qwen3.7-plus',
  'gemini-3.1-flash-lite',
  'glm-5.2',
  'qwen3.7-max',
  'gpt-5.4-mini',
  'gpt-5.5',
  'claude-haiku-4.5',
] as const
export type ModelName = (typeof modelNames)[number]

export interface ModelRow {
  readonly model: ModelName
  readonly candidates: number
  readonly valid: number
  /** Share of committed pairs judged valid, in percent. */
  readonly precision: number
  /** Total cost of the 2,400 evaluation tasks, in USD. */
  readonly cost: number
  /** Cost per valid pair, in USD. */
  readonly costPerValid: number
  /** Median latency per task, in seconds. */
  readonly latency: number
}

/** Table 2: the twelve models on the 2,400 evaluation tasks, in the paper's order (by precision). */
export const modelRows: readonly ModelRow[] = [
  { model: 'doubao-2.1-turbo', candidates: 367, valid: 341, precision: 92.9, cost: 853, costPerValid: 2.501, latency: 521 },
  { model: 'deepseek-v4-pro', candidates: 426, valid: 394, precision: 92.5, cost: 42, costPerValid: 0.107, latency: 101 },
  { model: 'glm-5-turbo', candidates: 460, valid: 410, precision: 89.1, cost: 215, costPerValid: 0.525, latency: 126 },
  { model: 'deepseek-v4-flash', candidates: 443, valid: 390, precision: 88.0, cost: 19, costPerValid: 0.049, latency: 131 },
  { model: 'doubao-2.1-pro', candidates: 495, valid: 426, precision: 86.1, cost: 241, costPerValid: 0.566, latency: 183 },
  { model: 'qwen3.7-plus', candidates: 492, valid: 416, precision: 84.6, cost: 68, costPerValid: 0.163, latency: 178 },
  { model: 'gemini-3.1-flash-lite', candidates: 384, valid: 324, precision: 84.4, cost: 115, costPerValid: 0.355, latency: 37 },
  { model: 'glm-5.2', candidates: 583, valid: 478, precision: 82.0, cost: 98, costPerValid: 0.205, latency: 162 },
  { model: 'qwen3.7-max', candidates: 520, valid: 414, precision: 79.6, cost: 122, costPerValid: 0.294, latency: 194 },
  { model: 'gpt-5.4-mini', candidates: 455, valid: 350, precision: 76.9, cost: 227, costPerValid: 0.648, latency: 39 },
  { model: 'gpt-5.5', candidates: 815, valid: 572, precision: 70.2, cost: 1029, costPerValid: 1.799, latency: 38 },
  { model: 'claude-haiku-4.5', candidates: 578, valid: 323, precision: 55.9, cost: 647, costPerValid: 2.003, latency: 163 },
]

/** The total row the paper prints under Table 2. */
export const modelTotals = { candidates: 6018, valid: 4838, cost: 3676 } as const

export const dominantCategoryIds = ['quotation', 'content', 'unmarked', 'support', 'positive'] as const
export type DominantCategoryId = (typeof dominantCategoryIds)[number]

export interface DiachronicRow {
  readonly dimension: DimensionId
  readonly dominant: DominantCategoryId
  /** Pooled share in histories composed by 659 CE, in percent. */
  readonly early: number
  /** Pooled share in histories composed from 945 CE onward, in percent. */
  readonly late: number
  /** Spearman correlation of the per-history share with composition year. */
  readonly rho: number
  /** Permutation p-value (2,000 permutations). */
  readonly p: number
}

/** Table 3: diachronic stability of the mix of reuse types over the 24 histories. */
export const diachronicRows: readonly DiachronicRow[] = [
  { dimension: 'form', dominant: 'quotation', early: 40.9, late: 42.4, rho: -0.07, p: 0.73 },
  { dimension: 'aspect', dominant: 'content', early: 98.1, late: 98.2, rho: -0.28, p: 0.18 },
  { dimension: 'sourceMarking', dominant: 'unmarked', early: 77.5, late: 77.6, rho: 0.11, p: 0.6 },
  { dimension: 'function', dominant: 'support', early: 67.8, late: 70.8, rho: -0.11, p: 0.61 },
  { dimension: 'stance', dominant: 'positive', early: 73.8, late: 79.8, rho: 0.16, p: 0.44 },
]
