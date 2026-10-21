// The cells of the paper's three tables on a language page: what each cell
// says and how it is set. The HTML table (src/components/PaperTable.astro)
// and the Markdown version of the page (src/lib/markdown.ts) both render this
// model, so each column is formatted in one place.

import type { InlineMarkdown, PageCopy } from '../content/types'
import { stats, type ModelName } from '../data/paper'
import { agreementRows, diachronicRows, modelRows, modelTotals, type DimensionId, type TableId } from '../data/tables'
import { formatCount, formatDecimal, formatPercent, formatPValue } from './format'

/**
 * How a cell's text is set. `plain` is a number or ordinary words; `code` an
 * identifier such as a model name; `emphasis` a statistical symbol, set in
 * italics as the paper sets ρ and p; `category` a word in a column of
 * numbers, or the header of such a column, which the HTML aligns with the
 * row headers instead of with the numbers.
 */
export type CellKind = 'plain' | 'code' | 'emphasis' | 'category'

export interface Cell<Kind extends CellKind = CellKind> {
  /** The cell's text; empty where the paper prints nothing. */
  readonly text: string
  readonly kind: Kind
}

/** A column header: words, a statistical symbol, or the header of a column of words. */
export type HeaderCell = Cell<'plain' | 'emphasis' | 'category'>

/** A row header: a dimension's name, or a model's identifier. */
export type RowHeaderCell = Cell<'plain' | 'code'>

/** A cell in the body or the total row: a number, a label, or a word in a column of numbers. */
export type DataCell = Cell<'plain' | 'category'>

/** What a body row describes, which the HTML states as data-dimension or data-model. */
export type RowKey = { readonly kind: 'dimension'; readonly id: DimensionId } | { readonly kind: 'model'; readonly id: ModelName }

export interface BodyRow {
  readonly key: RowKey
  readonly header: RowHeaderCell
  /** Lets the row header wrap in the HTML, for dimension names too long for one line. */
  readonly headerWraps: boolean
  /** The deployment model's row, which the HTML highlights. */
  readonly deployment: boolean
  /** The cells after the row header, one per remaining column. */
  readonly cells: readonly DataCell[]
}

/** The totals the paper prints under a table's body, label first; the HTML sets them in tfoot with data-total. */
export interface TotalRow {
  readonly cells: readonly DataCell[]
}

export interface TableModel {
  readonly label: string
  readonly caption: InlineMarkdown
  /** The column headers, one per column. */
  readonly head: readonly HeaderCell[]
  readonly body: readonly BodyRow[]
  readonly total: TotalRow | null
}

/** The table as the page in the copy's language shows it. A row whose cells do not fill the columns stops the build. */
export function tableModel(copy: PageCopy, table: TableId): TableModel {
  return checkColumns(table, buildTable(copy, table))
}

function buildTable(copy: PageCopy, table: TableId): TableModel {
  switch (table) {
    case 'agreement':
      return agreementTable(copy)
    case 'models':
      return modelsTable(copy)
    case 'diachronic':
      return diachronicTable(copy)
  }
}

function plain(text: string): Cell<'plain'> {
  return { text, kind: 'plain' }
}

function agreementTable(copy: PageCopy): TableModel {
  const text = copy.tables.agreement
  return {
    label: text.label,
    caption: text.caption,
    head: [plain(text.headers.dimension), plain(text.headers.observed), plain(text.headers.chance), plain(text.headers.kappa)],
    body: agreementRows.map(
      (row): BodyRow => ({
        key: { kind: 'dimension', id: row.dimension },
        header: plain(text.dimensions[row.dimension]),
        headerWraps: true,
        deployment: false,
        cells: [plain(formatPercent(row.observed)), plain(formatPercent(row.chance)), plain(formatDecimal(row.kappa, 2))],
      }),
    ),
    total: null,
  }
}

function modelsTable(copy: PageCopy): TableModel {
  const text = copy.tables.models
  return {
    label: text.label,
    caption: text.caption,
    head: [
      plain(text.headers.model),
      plain(text.headers.candidates),
      plain(text.headers.valid),
      plain(text.headers.precision),
      plain(text.headers.cost),
      plain(text.headers.costPerValid),
      plain(text.headers.latency),
    ],
    body: modelRows.map(
      (row): BodyRow => ({
        key: { kind: 'model', id: row.model },
        header: { text: row.model, kind: 'code' },
        headerWraps: false,
        deployment: row.model === stats.deploymentModel,
        cells: [
          plain(formatCount(row.candidates)),
          plain(formatCount(row.valid)),
          plain(formatPercent(row.precision)),
          plain(formatCount(row.cost)),
          plain(formatDecimal(row.costPerValid, 3)),
          plain(formatCount(row.latency)),
        ],
      }),
    ),
    // The paper totals candidates, valid pairs and cost; precision, cost per
    // valid pair and latency have no total.
    total: {
      cells: [
        plain(text.total),
        plain(formatCount(modelTotals.candidates)),
        plain(formatCount(modelTotals.valid)),
        plain(''),
        plain(formatCount(modelTotals.cost)),
        plain(''),
        plain(''),
      ],
    },
  }
}

function diachronicTable(copy: PageCopy): TableModel {
  const text = copy.tables.diachronic
  return {
    label: text.label,
    caption: text.caption,
    head: [
      plain(text.headers.dimension),
      { text: text.headers.dominant, kind: 'category' },
      plain(text.headers.early),
      plain(text.headers.late),
      { text: text.headers.rho, kind: 'emphasis' },
      { text: text.headers.p, kind: 'emphasis' },
    ],
    body: diachronicRows.map(
      (row): BodyRow => ({
        key: { kind: 'dimension', id: row.dimension },
        header: plain(text.dimensions[row.dimension]),
        headerWraps: false,
        deployment: false,
        cells: [
          { text: text.dominant[row.dominant], kind: 'category' },
          plain(formatPercent(row.early)),
          plain(formatPercent(row.late)),
          plain(formatDecimal(row.rho, 2)),
          plain(formatPValue(row.p)),
        ],
      }),
    ),
    total: null,
  }
}

function checkColumns(table: TableId, model: TableModel): TableModel {
  const columns = model.head.length
  for (const row of model.body) {
    if (row.cells.length + 1 !== columns) {
      throw new Error(`Table ${table}: row ${row.key.id} has ${row.cells.length + 1} cells for ${columns} columns`)
    }
  }
  if (model.total !== null && model.total.cells.length !== columns) {
    throw new Error(`Table ${table}: the total row has ${model.total.cells.length} cells for ${columns} columns`)
  }
  return model
}
