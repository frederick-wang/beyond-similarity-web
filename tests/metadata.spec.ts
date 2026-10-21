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
import { readPngHeader } from './png'

async function metaContents(page: Page, name: string): Promise<(string | null)[]> {
  return page.locator(`meta[name="${name}"]`).evaluateAll((elements) => elements.map((element) => element.getAttribute('content')))
}

/** The content of the one Open Graph tag with this property. */
async function openGraph(page: Page, property: string): Promise<string> {
  const tag = page.locator(`meta[property="${property}"]`)
  await expect(tag).toHaveCount(1)
  const content = await tag.getAttribute('content')
  if (content === null) {
    throw new Error(`${property} has no content attribute`)
  }
  return content
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

test.describe('link previews on social platforms', () => {
  test('give the title, description, address and a large image', async ({ page }) => {
    await page.goto('/')
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(await openGraph(page, 'og:type')).toBe('website')
    expect(await openGraph(page, 'og:site_name')).toBe('Beyond Similarity')
    expect(await openGraph(page, 'og:title')).toBe(TITLE)
    expect(await openGraph(page, 'og:description')).toBe(description)
    expect(await openGraph(page, 'og:url')).toBe(SITE)
    expect(await openGraph(page, 'og:locale')).toBe('en_US')
    const image = await openGraph(page, 'og:image')
    expect(image.startsWith(SITE), image).toBe(true)
    expect(image).toMatch(/\.png$/)
    expect(await openGraph(page, 'og:image:type')).toBe('image/png')
    expect(await openGraph(page, 'og:image:width')).toBe('1200')
    expect(await openGraph(page, 'og:image:height')).toBe('630')
    // The card shows the title and the authors, so its text alternative gives them.
    const alt = await openGraph(page, 'og:image:alt')
    for (const words of [TITLE, ...AUTHORS]) {
      expect(alt).toContain(words)
    }
    expect(await metaContents(page, 'twitter:card')).toEqual(['summary_large_image'])
    expect(await metaContents(page, 'twitter:image:alt')).toEqual([alt])
  })

  test('serve the share image as a 1200×630 PNG', async ({ page, request }) => {
    await page.goto('/')
    const image = await openGraph(page, 'og:image')
    // og:image names the public origin; fetch the same path from the server under test.
    const response = await request.get(new URL(image).pathname)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toBe('image/png')
    const header = readPngHeader(await response.body())
    expect([header.width, header.height]).toEqual([1200, 630])
  })
})
