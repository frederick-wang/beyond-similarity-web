// JSON-LD for the language pages: each page is a WebPage of its own, and its
// main entity is the paper. The paper node is built from the facts module and
// the English abstract alone, so every language page carries the identical
// ScholarlyArticle, identified by its DOI, rather than a translated copy.

import { en } from '../content/en'
import type { PageCopy } from '../content/types'
import { affiliationName, authors, links, paper, type IsoDate, type PageLanguage } from '../data/paper'
import { plainText } from './inline'

interface OrganizationNode {
  readonly '@type': 'Organization'
  readonly name: string
}

interface PersonNode {
  readonly '@type': 'Person'
  readonly name: string
  readonly givenName: string
  readonly familyName: string
  readonly affiliation: readonly OrganizationNode[]
}

interface ScholarlyArticleNode {
  readonly '@type': 'ScholarlyArticle'
  readonly '@id': string
  readonly sameAs: string
  readonly name: string
  readonly headline: string
  readonly author: readonly PersonNode[]
  readonly datePublished: IsoDate
  readonly abstract: string
  readonly inLanguage: typeof paper.language
}

interface WebPageNode {
  readonly '@context': 'https://schema.org'
  readonly '@type': 'WebPage'
  readonly '@id': string
  readonly url: string
  readonly name: string
  readonly description: string
  readonly inLanguage: PageLanguage
  readonly mainEntity: ScholarlyArticleNode
}

/** The page's JSON-LD; `url` is the page's canonical address. */
export function webPage(copy: PageCopy, url: string): WebPageNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: copy.title,
    description: copy.description,
    inLanguage: copy.lang,
    mainEntity: scholarlyArticle(),
  }
}

/** Serialises JSON-LD for a `<script type="application/ld+json">` element. */
export function serializeJsonLd(node: WebPageNode): string {
  // Escaping "<" keeps any string in the data from closing the element early.
  return JSON.stringify(node).replaceAll('<', '\\u003c')
}

function scholarlyArticle(): ScholarlyArticleNode {
  return {
    '@type': 'ScholarlyArticle',
    '@id': links.doi,
    sameAs: links.arxivAbs,
    name: paper.titleEn,
    headline: paper.titleEn,
    author: authors.map(
      (author): PersonNode => ({
        '@type': 'Person',
        name: author.nameEn,
        givenName: author.givenNameEn,
        familyName: author.familyNameEn,
        affiliation: author.affiliations.map((id): OrganizationNode => ({ '@type': 'Organization', name: affiliationName(id, 'en') })),
      }),
    ),
    datePublished: paper.published,
    abstract: plainText(en.abstract, en.lang),
    inLanguage: paper.language,
  }
}
