import { expect, test, type Page } from '@playwright/test'
import { ARXIV_ID, AUTHORS_FAMILY_FIRST, DOI, PUBLISHED_SLASHED, TITLE } from './paper-literals'

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
