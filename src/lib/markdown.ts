// The Markdown version of each language page, and the llms.txt files built
// from it (https://llmstxt.org/). Both are rendered at build time from the
// copy, facts and table model that the HTML pages render, through the same
// functions wherever the two share a formatting rule, so editing the copy
// updates them with the page. Only the HTML has the masthead, the skip link,
// the page navigation, the copy button and the footer's maintainer and ICP
// lines; the Markdown ends with the copyright line.

import { en } from '../content/en'
import { llms, type LlmsEntry } from '../content/llms'
import type { Block, InlineMarkdown, PageCopy, SourceRef } from '../content/types'
import { zh } from '../content/zh'
import { figures, type FigureId } from '../data/figures'
import {
  absoluteUrl,
  affiliationIds,
  affiliationMarks,
  affiliationName,
  authorName,
  authors,
  bibtex,
  correspondingMark,
  explorerName,
  glance,
  glanceIds,
  institutions,
  links,
  markdownPath,
  pages,
  paper,
  type PdfPage,
} from '../data/paper'
import { tablePages, type TableId } from '../data/tables'
import { authorList } from './authors'
import { fullSizeFigure } from './figures'
import { copyrightLine } from './footer'
import { formatIdentifier, formatList, formatQuantity, punctuationFor } from './format'
import { markdownLiteral, markdownText } from './inline'
import { numberQuestions } from './sections'
import { pageLink, sourceLink } from './sources'
import { tableModel, type Cell } from './table-cells'

/** The Markdown version of the page in the copy's language. */
export async function pageMarkdown(copy: PageCopy): Promise<string> {
  return markdownDocument(await pageBlocks(copy))
}

/** /llms-full.txt: the English page's Markdown, a thematic break, then the Chinese page's. */
export async function llmsFullText(): Promise<string> {
  return markdownDocument((await pageBlocks(en)).concat(['---'], await pageBlocks(zh)))
}

/** /llms.txt in the order the proposal sets: title, summary, details, then the file lists. */
export function llmsText(): string {
  const facts = {
    arxivId: paper.arxivId,
    version: paper.arxivVersion,
    authors: authorList('en'),
    institutions: formatList(
      institutions().map((institution) => institution.nameEn),
      'en',
    ),
    explorerName,
  }
  return markdownDocument([
    `# ${markdownLiteral(en.title, 'The page title')}`,
    `> ${markdownText(en.finding, en.lang)}`,
    markdownLiteral(llms.about(facts), 'The paragraph about the site'),
    markdownLiteral(llms.citeAs, 'The line before the BibTeX entry'),
    bibtexBlock(),
    fileList(llms.pages.heading, [
      fileEntry(llms.pages.english, absoluteUrl(pages.en.path)),
      fileEntry(llms.pages.chinese, absoluteUrl(pages['zh-Hans'].path)),
      fileEntry(llms.pages.englishMarkdown, absoluteUrl(markdownPath('en'))),
      fileEntry(llms.pages.chineseMarkdown, absoluteUrl(markdownPath('zh-Hans'))),
    ]),
    fileList(llms.paper.heading, [
      fileEntry(llms.paper.arxiv, links.arxivAbs),
      fileEntry(llms.paper.pdf(facts), links.pdf),
      fileEntry(llms.paper.doi, links.doi),
    ]),
    fileList(llms.data.heading, [fileEntry(llms.data.explorer(facts), links.explorer)]),
    fileList(llms.optional.heading, [fileEntry(llms.optional.full, absoluteUrl('/llms-full.txt'))]),
  ])
}

/** Blocks separated by blank lines, ending with a newline. */
function markdownDocument(blocks: readonly string[]): string {
  return `${blocks.join('\n\n')}\n`
}

/** The page from its title to its copyright line, one Markdown block per entry. */
async function pageBlocks(copy: PageCopy): Promise<readonly string[]> {
  return [
    `# ${markdownLiteral(copy.title, 'The page title')}`,
    markdownText(copy.markdownVersion(absoluteUrl(pages[copy.lang].path)), copy.lang),
  ].concat(
    titleBlock(copy),
    [markdownText(copy.finding, copy.lang)],
    glanceBlocks(copy),
    await sectionBlocks(copy),
    [markdownLiteral(copyrightLine(copy), 'The copyright line')],
  )
}

/** Authors with their affiliation numbers, the affiliations, the corresponding-author note and the links, as the title block shows them. */
function titleBlock(copy: PageCopy): readonly string[] {
  const marks = punctuationFor(copy.lang)
  const mark = superscript(markdownSymbol(correspondingMark))
  const names = authors.map((author) => {
    const name = authorName(author, copy.lang)
    const shown = author.homepage === null ? markdownLiteral(name, 'An author name') : markdownLink(name, author.homepage)
    return `${shown}${superscript(affiliationMarks(author))}${author.corresponding ? mark : ''}`
  })
  return [
    names.join(marks.authorSeparator),
    markdownList(affiliationIds.map((id) => `${superscript(String(id))} ${markdownLiteral(affiliationName(id, copy.lang), 'An affiliation')}`)),
    `${mark} ${markdownLiteral(copy.correspondingNote, 'The corresponding-author note')}`,
    markdownList([
      markdownLink(copy.links.arxiv, links.arxivAbs),
      markdownLink(copy.links.pdf, links.pdf),
      markdownLink(copy.links.explorer, links.explorer),
    ]),
  ]
}

function glanceBlocks(copy: PageCopy): readonly string[] {
  const marks = punctuationFor(copy.lang)
  return [
    `## ${markdownLiteral(copy.glanceHeading, 'The glance heading')}`,
    markdownList(
      glanceIds.map(
        (id) =>
          `**${markdownLiteral(formatQuantity(glance[id], copy.lang), 'A glance quantity')}**${marks.glanceJoin}${markdownText(copy.glance[id], copy.lang)}`,
      ),
    ),
  ]
}

async function sectionBlocks(copy: PageCopy): Promise<readonly string[]> {
  const blocks: string[] = []
  for (const { section, number } of numberQuestions(copy.sections)) {
    const heading = markdownText(section.heading, copy.lang)
    blocks.push(number === null ? `## ${heading}` : `## ${number}. ${heading}`)
    if (section.kind === 'question') {
      blocks.push(markdownText(section.answer, copy.lang))
    }
    for (const block of section.blocks) {
      blocks.push(await blockMarkdown(copy, block))
    }
  }
  return blocks
}

async function blockMarkdown(copy: PageCopy, block: Block): Promise<string> {
  switch (block.type) {
    case 'abstract':
      return markdownText(copy.abstract, copy.lang)
    case 'paragraph':
      return `${markdownText(block.text, copy.lang)}${sourceLinks(copy, block.sources)}`
    case 'subheading':
      return `### ${markdownText(block.text, copy.lang)}`
    case 'figure':
      return figureBlock(copy, block.figure)
    case 'table':
      return tableBlock(copy, block.table)
    case 'bibtex':
      return bibtexBlock()
  }
}

/** A paragraph's source links as the page sets them after it; nothing for a paragraph without sources. */
function sourceLinks(copy: PageCopy, sources: readonly SourceRef[]): string {
  if (sources.length === 0) {
    return ''
  }
  const marks = punctuationFor(copy.lang)
  const linked = sources.map((source) => {
    const target = sourceLink(copy, source)
    return markdownLink(target.label, target.href)
  })
  return `${marks.join}${markdownLiteral(copy.sources.lead, 'The source lead')}${marks.join}${linked.join(marks.sourceSeparator)}`
}

/** The image at full size, then its caption. */
async function figureBlock(copy: PageCopy, figure: FigureId): Promise<string> {
  const text = copy.figures.items[figure]
  const image = `![${markdownLiteral(text.alt, `The text alternative of figure ${figure}`)}](${markdownUrl(absoluteUrl(await fullSizeFigure(figure)))})`
  return `${image}\n\n${caption(copy, text.label, text.caption, figures[figure].page)}`
}

/** The caption, then the table in GitHub Flavored Markdown, its total row last. */
function tableBlock(copy: PageCopy, table: TableId): string {
  const model = tableModel(copy, table)
  const rows = [model.head.map(tableCell), model.head.map(() => '---')]
    .concat(model.body.map((row) => [tableCell(row.header)].concat(row.cells.map(tableCell))))
    .concat(model.total === null ? [] : [model.total.cells.map(tableCell)])
  const lines = rows.map((cells) => `| ${cells.join(' | ')} |`)
  return `${caption(copy, model.label, model.caption, tablePages[table])}\n\n${lines.join('\n')}`
}

/** A figure's or a table's caption as the page sets it: the label, the caption, and a link to its page of the PDF. */
function caption(copy: PageCopy, label: string, text: InlineMarkdown, page: PdfPage): string {
  const marks = punctuationFor(copy.lang)
  const pdf = pageLink(copy, page)
  return `**${markdownLiteral(label, 'A caption label')}${marks.labelEnd}** ${markdownText(text, copy.lang)}${marks.join}${markdownLink(pdf.label, pdf.href)}`
}

/** A table cell set as its kind asks, with | escaped so that it cannot end the cell. */
function tableCell(cell: Cell): string {
  switch (cell.kind) {
    case 'plain':
    case 'category':
      return escapePipes(markdownLiteral(cell.text, 'A table cell'))
    case 'emphasis':
      return `*${escapePipes(markdownLiteral(cell.text, 'A table cell'))}*`
    case 'code':
      return escapePipes(formatIdentifier(cell.text))
  }
}

function escapePipes(text: string): string {
  return text.replaceAll('|', '\\|')
}

/** The entry exactly as the page serves it. */
function bibtexBlock(): string {
  return ['```bibtex', bibtex(), '```'].join('\n')
}

function fileList(heading: string, entries: readonly string[]): string {
  return `## ${markdownLiteral(heading, 'A file list heading')}\n\n${entries.join('\n')}`
}

/** A file list entry in the proposal's form: `- [name](url): notes`. */
function fileEntry(entry: LlmsEntry, url: string): string {
  return `- ${markdownLink(entry.name, url)}: ${markdownLiteral(entry.notes, `The notes on ${entry.name}`)}`
}

function markdownList(items: readonly string[]): string {
  return items.map((item) => `- ${item}`).join('\n')
}

function markdownLink(label: string, url: string): string {
  return `[${markdownLiteral(label, 'A link label')}](${markdownUrl(url)})`
}

/**
 * An address as a bare link destination. Whitespace and unbalanced
 * parentheses cut or break a bare destination, and a leading < turns it into
 * the angle-bracket form, so the build rejects every whitespace character,
 * parenthesis and angle bracket, and nothing has to track their balance.
 */
function markdownUrl(url: string): string {
  if (/[\s()<>]/.test(url)) {
    throw new Error(`${url} cannot stand as a Markdown link destination`)
  }
  return url
}

/** Raw HTML superscript, which CommonMark passes through: affiliation numbers and the corresponding-author mark. */
function superscript(markdown: string): string {
  return `<sup>${markdown}</sup>`
}

/** A mark such as the corresponding-author asterisk, its ASCII punctuation backslash-escaped so that Markdown prints it as it is. */
function markdownSymbol(text: string): string {
  return text.replace(/[!-/:-@[-`{-~]/g, '\\$&')
}
