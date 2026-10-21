// The English copy of /llms.txt, the file that tells language models what the
// site holds (https://llmstxt.org/). Facts and addresses come from the facts
// module; src/lib/markdown.ts assembles the file.

import { explorerDescription } from './en'

/** An entry of a file list: the link's name, and the notes after it. */
export interface LlmsEntry {
  readonly name: string
  readonly notes: string
}

/** The facts from the facts module that the about paragraph and the file-list entries state. */
export interface LlmsFacts {
  readonly arxivId: string
  /** The arXiv version that every number on the pages follows, as in "v1". */
  readonly version: string
  /** The authors as an English list, as in "A, B, and C". */
  readonly authors: string
  /** The authors' institutions as an English list. */
  readonly institutions: string
  readonly explorerName: string
}

export interface LlmsCopy {
  readonly about: (facts: LlmsFacts) => string
  /** Introduces the BibTeX entry. */
  readonly citeAs: string
  readonly pages: {
    readonly heading: string
    readonly english: LlmsEntry
    readonly chinese: LlmsEntry
    readonly englishMarkdown: LlmsEntry
    readonly chineseMarkdown: LlmsEntry
  }
  readonly paper: {
    readonly heading: string
    readonly arxiv: LlmsEntry
    readonly pdf: (facts: LlmsFacts) => LlmsEntry
    readonly doi: LlmsEntry
  }
  readonly data: { readonly heading: string; readonly explorer: (facts: LlmsFacts) => LlmsEntry }
  /** The proposal names the list of links a reader short of context may skip "Optional". */
  readonly optional: { readonly heading: 'Optional'; readonly full: LlmsEntry }
}

export const llms: LlmsCopy = {
  about: (facts) =>
    `This site is the paper page for the arXiv preprint arXiv:${facts.arxivId} by ${facts.authors} at ${facts.institutions}. It has an English page and a Chinese counterpart. Every number on the pages follows arXiv ${facts.version}, and figures, tables and most paragraphs link to the page of the ${facts.version} PDF that supports them.`,
  citeAs: 'Cite the paper with this BibTeX entry:',
  pages: {
    heading: 'Pages',
    english: { name: 'English page', notes: 'the findings, method and evidence of the paper, with its figures, tables and classical Chinese quotations' },
    chinese: { name: 'Chinese page (中文页)', notes: 'the page in Chinese, with the same sections, figures, tables and numbers' },
    englishMarkdown: { name: 'English page in Markdown', notes: 'the text of the English page as Markdown, with its tables and BibTeX entry' },
    chineseMarkdown: { name: 'Chinese page in Markdown', notes: 'the text of the Chinese page as Markdown, with its tables and BibTeX entry' },
  },
  paper: {
    heading: 'Paper',
    arxiv: { name: 'arXiv record', notes: 'the abstract page of the preprint, which lists its versions and publication details' },
    pdf: (facts) => ({ name: `PDF of arXiv ${facts.version}`, notes: 'the full text of the paper' }),
    doi: { name: 'DOI', notes: 'the DOI that arXiv assigned to the preprint, which resolves to the arXiv record' },
  },
  data: {
    heading: 'Data',
    explorer: (facts) => ({ name: 'Explorer', notes: `${facts.explorerName}, ${explorerDescription}` }),
  },
  optional: {
    heading: 'Optional',
    full: { name: 'llms-full.txt', notes: 'the English and the Chinese page in Markdown, in one file' },
  },
}
