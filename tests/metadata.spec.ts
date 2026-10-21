import { expect, test } from '@playwright/test'
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
import { readPngHeader, readPngTexts } from '../scripts/png.ts'
import { attributeValues, only } from './head'

test.describe('citation metadata for Google Scholar and reference managers', () => {
  test('describes the arXiv preprint with title, ordered authors, date, DOI and arXiv ID', async ({ page }) => {
    await page.goto('/')
    expect(await attributeValues(page, 'meta[name="citation_title"]', 'content')).toEqual([TITLE])
    expect(await attributeValues(page, 'meta[name="citation_author"]', 'content')).toEqual([...AUTHORS_FAMILY_FIRST])
    expect(await attributeValues(page, 'meta[name="citation_publication_date"]', 'content')).toEqual([PUBLISHED_SLASHED])
    expect(await attributeValues(page, 'meta[name="citation_doi"]', 'content')).toEqual([DOI])
    expect(await attributeValues(page, 'meta[name="citation_arxiv_id"]', 'content')).toEqual([ARXIV_ID])
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
    const description = only(await attributeValues(page, 'meta[name="description"]', 'content'), 'description')
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

test.describe('link previews on social platforms', () => {
  test('give the title, description, address and a large image', async ({ page }) => {
    await page.goto('/')
    const openGraph = async (property: string) => attributeValues(page, `meta[property="${property}"]`, 'content')
    const description = only(await attributeValues(page, 'meta[name="description"]', 'content'), 'description')
    // "article" lets Zotero save a journal article with its DOI; "website" would make it a web page.
    expect(await openGraph('og:type')).toEqual(['article'])
    expect(await openGraph('article:published_time')).toEqual([PUBLISHED])
    expect(await openGraph('og:site_name')).toEqual(['Beyond Similarity'])
    expect(await openGraph('og:title')).toEqual([TITLE])
    expect(await openGraph('og:description')).toEqual([description])
    expect(await openGraph('og:url')).toEqual([SITE])
    expect(await openGraph('og:locale')).toEqual(['en_US'])
    const image = only(await openGraph('og:image'), 'og:image')
    expect(image.startsWith(SITE), image).toBe(true)
    expect(image).toMatch(/\.png$/)
    expect(await openGraph('og:image:type')).toEqual(['image/png'])
    expect(await openGraph('og:image:width')).toEqual(['1200'])
    expect(await openGraph('og:image:height')).toEqual(['630'])
    // The card shows the title and the authors, so its text alternative gives them.
    const alt = only(await openGraph('og:image:alt'), 'og:image:alt')
    for (const words of [TITLE, ...AUTHORS]) {
      expect(alt).toContain(words)
    }
    expect(await attributeValues(page, 'meta[name="twitter:card"]', 'content')).toEqual(['summary_large_image'])
    expect(await attributeValues(page, 'meta[name="twitter:image:alt"]', 'content')).toEqual([alt])
  })

  test('show on the share image the words the head states, so a card left stale after a facts change fails', async ({ page, request }) => {
    await page.goto('/')
    const image = only(await attributeValues(page, 'meta[property="og:image"]', 'content'), 'og:image')
    const response = await request.get(new URL(image).pathname)
    // scripts/make-site-images.ts records the words it renders in this text chunk.
    const [words, ...others] = readPngTexts(await response.body()).filter((chunk) => chunk.keyword === 'Card words')
    if (words === undefined || others.length > 0) {
      throw new Error('The share image must carry exactly one "Card words" text chunk')
    }
    const headAuthors = await page.evaluate(() => {
      const script = document.querySelector('script[type="application/ld+json"]')
      if (script === null || script.textContent === null) {
        throw new Error('The head has no JSON-LD')
      }
      const data: { mainEntity: { author: { name: string }[] } } = JSON.parse(script.textContent)
      return data.mainEntity.author.map((author) => author.name)
    })
    expect(JSON.parse(words.text)).toEqual({
      shortTitle: only(await attributeValues(page, 'meta[property="og:site_name"]', 'content'), 'og:site_name'),
      title: only(await attributeValues(page, 'meta[name="citation_title"]', 'content'), 'citation_title'),
      authors: headAuthors,
      arxivId: only(await attributeValues(page, 'meta[name="citation_arxiv_id"]', 'content'), 'citation_arxiv_id'),
    })
  })

  test('serve the share image as a 1200×630 PNG', async ({ page, request }) => {
    await page.goto('/')
    const image = only(await attributeValues(page, 'meta[property="og:image"]', 'content'), 'og:image')
    // og:image names the public origin; fetch the same path from the server under test.
    const response = await request.get(new URL(image).pathname)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toBe('image/png')
    const header = readPngHeader(await response.body())
    expect([header.width, header.height]).toEqual([1200, 630])
  })
})
