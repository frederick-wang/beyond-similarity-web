// The English copy of /llms.txt, the file that tells language models what the
// site holds (https://llmstxt.org/). Facts and addresses come from the facts
// module; src/lib/markdown.ts assembles the file.

/** An entry of a file list: the link's name, and the notes after it. */
export interface LlmsEntry {
  readonly name: string
  readonly notes: string
}

/** The facts the paragraph about the site states, from the facts module. */
export interface LlmsFacts {
  readonly arxivId: string
  /** The authors as an English list, as in "A, B, and C". */
  readonly authors: string
  /** The authors' institutions as an English list. */
  readonly institutions: string
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
  readonly paper: { readonly heading: string; readonly arxiv: LlmsEntry; readonly pdf: LlmsEntry; readonly doi: LlmsEntry }
  readonly data: { readonly heading: string; readonly explorer: LlmsEntry }
  /** The proposal names the list of links a reader short of context may skip "Optional". */
  readonly optional: { readonly heading: 'Optional'; readonly full: LlmsEntry }
}

export const llms: LlmsCopy = {
  about: (facts) =>
    `This site is the paper page for the arXiv preprint arXiv:${facts.arxivId} by ${facts.authors} at ${facts.institutions}. It has an English page and a Chinese counterpart with the same sections, figures, tables and numbers. Every number on the pages follows arXiv v1, and paragraphs, figures and tables link to the pages of the v1 PDF that support them.`,
  citeAs: 'Cite the paper with this BibTeX entry:',
  pages: {
    heading: 'Pages',
    english: { name: 'English page', notes: 'the findings, method and evidence of the paper, with its figures, tables and classical Chinese quotations' },
    chinese: { name: 'Chinese page (中文页)', notes: 'the same sections, figures, tables and numbers in Chinese' },
    englishMarkdown: { name: 'English page in Markdown', notes: 'the text of the English page as Markdown, with its tables and BibTeX entry' },
    chineseMarkdown: { name: 'Chinese page in Markdown', notes: 'the text of the Chinese page as Markdown, with its tables and BibTeX entry' },
  },
  paper: {
    heading: 'Paper',
    arxiv: { name: 'arXiv record', notes: 'the abstract page of the preprint, which lists its versions and publication details' },
    pdf: { name: 'PDF of arXiv v1', notes: 'the version that every number on this site follows' },
    doi: { name: 'DOI', notes: 'the DOI that arXiv assigned to the preprint, which resolves to the arXiv record' },
  },
  data: {
    heading: 'Data',
    explorer: {
      name: 'Explorer',
      notes:
        '《论语》×二十四史互文图谱, a site in Chinese that shows every intertextual pair of the corpus run over the Twenty-Four Histories in its textual context, with its spans and labels',
    },
  },
  optional: {
    heading: 'Optional',
    full: { name: 'llms-full.txt', notes: 'the English and the Chinese page in Markdown, in one file' },
  },
}
