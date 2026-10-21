import { expect, test } from '@playwright/test'
import { attributeValues, only } from './head'
import { PAGES, SITE, TITLE_ZH } from './paper-literals'

// The two language pages declare each other: each is its own canonical page,
// both list every language version (itself included) and x-default, and the
// masthead of each links to the other.

const CHINESE_PAGE = new URL('zh/', SITE).href

/** The page's JSON-LD block, parsed. */
async function jsonLd(page: import('@playwright/test').Page): Promise<Record<string, unknown>> {
  const data: unknown = JSON.parse(only(await page.locator('script[type="application/ld+json"]').allTextContents(), 'JSON-LD block'))
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    throw new Error('The JSON-LD block is not an object')
  }
  return Object.fromEntries(Object.entries(data))
}

for (const { path } of PAGES) {
  test(`${path} is its own canonical page and lists every language version, itself included`, async ({ page }) => {
    await page.goto(path)
    const self = new URL(path, SITE).href
    expect(await attributeValues(page, 'link[rel="canonical"]', 'href')).toEqual([self])
    const selector = 'link[rel="alternate"][hreflang]'
    const hreflangs = await attributeValues(page, selector, 'hreflang')
    const hrefs = await attributeValues(page, selector, 'href')
    const alternates = hreflangs.map((hreflang, index) => ({ hreflang, href: hrefs[index] }))
    expect(alternates).toEqual([
      { hreflang: 'en', href: SITE },
      { hreflang: 'zh-Hans', href: CHINESE_PAGE },
      // Readers whose language has no page get the English page.
      { hreflang: 'x-default', href: SITE },
    ])
    expect(alternates).toContainEqual({ hreflang: only(await attributeValues(page, 'html', 'lang'), 'html lang'), href: self })
  })
}

test('the Chinese page previews in Chinese for link previews', async ({ page }) => {
  await page.goto('/zh/')
  const openGraph = async (property: string) => attributeValues(page, `meta[property="${property}"]`, 'content')
  expect(await openGraph('og:locale')).toEqual(['zh_CN'])
  expect(await openGraph('og:url')).toEqual([CHINESE_PAGE])
  expect(await openGraph('og:title')).toEqual([TITLE_ZH])
  expect(await openGraph('og:site_name')).toEqual(['超越相似度'])
  // The share card is the English card on both pages, and its text alternative says so.
  expect(only(await openGraph('og:image:alt'), 'og:image:alt')).toMatch(/^英文分享卡片/)
})

test('the Chinese page is a WebPage of its own about the same ScholarlyArticle as the English page', async ({ page }) => {
  await page.goto('/')
  const english = await jsonLd(page)
  await page.goto('/zh/')
  const chinese = await jsonLd(page)
  expect(chinese).toMatchObject({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: CHINESE_PAGE,
    name: TITLE_ZH,
    inLanguage: 'zh-Hans',
  })
  expect(chinese['@id']).toEqual(expect.stringContaining(CHINESE_PAGE))
  expect(chinese['@id']).not.toEqual(english['@id'])
  expect(english['mainEntity']).toBeDefined()
  expect(chinese['mainEntity']).toEqual(english['mainEntity'])
})

test.describe('language switch in the masthead', () => {
  for (const [from, to, name] of [
    ['/', { path: '/zh/', lang: 'zh-Hans' }, '中文'],
    ['/zh/', { path: '/', lang: 'en' }, 'English'],
  ] as const) {
    test(`${from} links to ${to.path}, named in its language`, async ({ page }) => {
      await page.goto(from)
      const link = page.getByRole('banner').getByRole('link', { name, exact: true })
      await expect(link).toHaveAttribute('href', to.path)
      await expect(link).toHaveAttribute('hreflang', to.lang)
      await expect(link).toHaveAttribute('lang', to.lang)
      await link.click()
      await expect(page).toHaveURL(new URL(to.path, page.url()).href)
      await expect(page.locator('html')).toHaveAttribute('lang', to.lang)
    })
  }

  test('the site name in the masthead is in the page language and leads to the page itself', async ({ page }) => {
    for (const [path, name] of [
      ['/', 'Beyond Similarity'],
      ['/zh/', '超越相似度'],
    ] as const) {
      await page.goto(path)
      const brand = page.getByRole('banner').getByRole('link', { name, exact: true })
      await expect(brand).toHaveAttribute('href', path)
    }
  })
})
