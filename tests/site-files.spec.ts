import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { PUBLISHED, SITE } from './paper-literals'
import { readPngHeader, type PngHeader } from '../scripts/png.ts'

/** The IndexNow key, copied from the key file's name in public/. */
const INDEXNOW_KEY = 'c132bc6e7cb4da6c991d355d9c45f366'

async function attribute(page: Page, selector: string, name: string): Promise<string> {
  const element = page.locator(selector)
  await expect(element).toHaveCount(1)
  const value = await element.getAttribute(name)
  if (value === null) {
    throw new Error(`${selector} has no ${name} attribute`)
  }
  return value
}

async function fetchPng(request: APIRequestContext, path: string): Promise<PngHeader> {
  const response = await request.get(path)
  expect(response.status(), path).toBe(200)
  expect(response.headers()['content-type'], path).toBe('image/png')
  return readPngHeader(await response.body())
}

test.describe('favicons drawn from the scroll seal', () => {
  test('include a square SVG icon', async ({ page, request }) => {
    await page.goto('/')
    const href = await attribute(page, 'link[rel="icon"][type="image/svg+xml"]', 'href')
    const response = await request.get(href)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('image/svg+xml')
    const svg = await page.evaluate((text) => {
      const document = new DOMParser().parseFromString(text, 'image/svg+xml')
      const root = document.documentElement
      return {
        wellFormed: document.querySelector('parsererror') === null,
        namespace: root.namespaceURI,
        name: root.localName,
        viewBox: root.getAttribute('viewBox'),
      }
    }, await response.text())
    expect(svg).toMatchObject({ wellFormed: true, namespace: 'http://www.w3.org/2000/svg', name: 'svg' })
    // "min-x min-y width height" with the width repeated as the height.
    expect(svg.viewBox).toMatch(/^\S+ \S+ (\d+(?:\.\d+)?) \1$/)
  })

  test('include PNG icons at 16, 32 and 192 px whose files match their declared sizes', async ({ page, request }) => {
    await page.goto('/')
    const icons = await page
      .locator('link[rel="icon"][type="image/png"]')
      .evaluateAll((links) => links.map((link) => ({ href: link.getAttribute('href'), sizes: link.getAttribute('sizes') })))
    expect(icons.map((icon) => icon.sizes).sort()).toEqual(['16x16', '192x192', '32x32'])
    for (const { href, sizes } of icons) {
      if (href === null) {
        throw new Error('A PNG icon link has no href')
      }
      const header = await fetchPng(request, href)
      expect(`${header.width}x${header.height}`, href).toBe(sizes)
    }
  })

  test('include a 180 px apple-touch-icon without transparency, which iOS would fill with black', async ({ page, request }) => {
    await page.goto('/')
    const header = await fetchPng(request, await attribute(page, 'link[rel="apple-touch-icon"]', 'href'))
    expect(header).toEqual({ width: 180, height: 180, transparency: false })
  })
})

test.describe('files for crawlers', () => {
  test('robots.txt admits every crawler, training crawlers included, and declares the sitemap', async ({ request }) => {
    const response = await request.get('/robots.txt')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/plain')
    const lines = (await response.text()).split('\n').map((line) => line.trim())
    expect(lines).toContain('User-agent: *')
    expect(lines.filter((line) => /^disallow\s*:\s*\S/i.test(line))).toEqual([])
    expect(lines).toContain(`Sitemap: ${SITE}sitemap.xml`)
  })

  test('sitemap.xml lists the page with the date of its last substantive update', async ({ page, request }) => {
    const response = await request.get('/sitemap.xml')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('xml')
    const sitemap = await page.evaluate((text) => {
      const namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9'
      const document = new DOMParser().parseFromString(text, 'application/xml')
      const child = (parent: Element, name: string) => parent.getElementsByTagNameNS(namespace, name)[0]?.textContent ?? null
      return {
        wellFormed: document.querySelector('parsererror') === null,
        namespace: document.documentElement.namespaceURI,
        name: document.documentElement.localName,
        urls: Array.from(document.getElementsByTagNameNS(namespace, 'url'), (url) => ({ loc: child(url, 'loc'), lastmod: child(url, 'lastmod') })),
      }
    }, await response.text())
    expect(sitemap).toMatchObject({ wellFormed: true, namespace: 'http://www.sitemaps.org/schemas/sitemap/0.9', name: 'urlset' })
    expect(sitemap.urls.map((url) => url.loc)).toEqual([SITE])
    const build: unknown = await (await request.get('/build.json')).json()
    if (typeof build !== 'object' || build === null || !('builtAt' in build) || typeof build.builtAt !== 'string') {
      throw new Error('build.json has no builtAt time')
    }
    const { builtAt } = build
    for (const { loc, lastmod } of sitemap.urls) {
      if (lastmod === null) {
        throw new Error(`${loc} has no lastmod`)
      }
      expect(lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      // The page cannot have changed before the paper existed, nor after this
      // build: the date has to have begun somewhere (UTC+14) by build time.
      expect(lastmod >= PUBLISHED, `${lastmod} precedes the arXiv v1 date`).toBe(true)
      expect(new Date(`${lastmod}T00:00:00+14:00`) <= new Date(builtAt), `${lastmod} is after the build`).toBe(true)
    }
  })

  test('the IndexNow key file sits at the site root, its content equal to its name', async ({ request }) => {
    // IndexNow keys are 8 to 128 letters, digits and dashes (https://www.indexnow.org/documentation).
    expect(INDEXNOW_KEY).toMatch(/^[A-Za-z0-9-]{8,128}$/)
    const response = await request.get(`/${INDEXNOW_KEY}.txt`)
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type']).toContain('text/plain')
    expect(await response.text()).toBe(INDEXNOW_KEY)
  })
})
