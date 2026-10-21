import { expect, test, type Page } from '@playwright/test'
import {
  ABSTRACT,
  AFFILIATIONS,
  ARXIV_ABS,
  ARXIV_ID,
  AUTHORS,
  AUTHORS_FAMILY_FIRST,
  DOI,
  DOI_URL,
  PUBLISHED,
  PUBLISHED_SLASHED,
  SITE,
  TITLE,
} from './paper-literals'

async function metaContents(page: Page, name: string): Promise<string[]> {
  return page.locator(`meta[name="${name}"]`).evaluateAll((elements) => elements.map((element) => element.getAttribute('content') ?? ''))
}

test.describe('citation metadata for Google Scholar and reference managers', () => {
  test('describes the arXiv preprint with title, ordered authors, date, DOI and arXiv ID', async ({ page }) => {
    await page.goto('/')
    expect(await metaContents(page, 'citation_title')).toEqual([TITLE])
    expect(await metaContents(page, 'citation_author')).toEqual([...AUTHORS_FAMILY_FIRST])
    expect(await metaContents(page, 'citation_publication_date')).toEqual([PUBLISHED_SLASHED])
    expect(await metaContents(page, 'citation_doi')).toEqual([DOI])
    expect(await metaContents(page, 'citation_arxiv_id')).toEqual([ARXIV_ID])
  })

  test('offers no citation_pdf_url, since Google Scholar wants the PDF in the same directory as the page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('meta[name="citation_pdf_url"]')).toHaveCount(0)
  })
})

test.describe('structured data', () => {
  test('describes the page as a WebPage whose main entity is the paper as a ScholarlyArticle', async ({ page }) => {
    await page.goto('/')
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
    expect(blocks).toHaveLength(1)
    const data: unknown = JSON.parse(blocks.join(''))
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      // The page's own identifier, distinct from the paper's DOI.
      '@id': expect.stringContaining(SITE),
      url: SITE,
      name: TITLE,
      description,
      inLanguage: 'en',
      mainEntity: {
        '@type': 'ScholarlyArticle',
        '@id': DOI_URL,
        sameAs: ARXIV_ABS,
        name: TITLE,
        headline: TITLE,
        author: AUTHORS.map((name) => ({
          '@type': 'Person',
          name,
          affiliation: AFFILIATIONS.map((affiliation) => ({ '@type': 'Organization', name: affiliation })),
        })),
        datePublished: PUBLISHED,
        abstract: ABSTRACT,
        inLanguage: 'en',
      },
    })
  })
})
