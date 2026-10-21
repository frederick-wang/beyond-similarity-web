import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { readPngHeader, type PngHeader } from '../scripts/png.ts'
import { attributeValues, only } from './head'
import { PUBLISHED, SITE } from './paper-literals'

/** The IndexNow key, copied from the key file's name in public/. */
const INDEXNOW_KEY = 'c132bc6e7cb4da6c991d355d9c45f366'

const sitemapNamespace = 'http://www.sitemaps.org/schemas/sitemap/0.9'
const xhtmlNamespace = 'http://www.w3.org/1999/xhtml'

/** sitemap.xml as served, parsed by the browser: each <url> with its lastmod and its hreflang links. */
async function readSitemap(page: Page, request: APIRequestContext) {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('xml')
  return page.evaluate(
    ({ text, sitemapNamespace, xhtmlNamespace }) => {
      const document = new DOMParser().parseFromString(text, 'application/xml')
      const root = document.documentElement
      const child = (parent: Element, name: string) => parent.getElementsByTagNameNS(sitemapNamespace, name)[0]?.textContent ?? null
      return {
        wellFormed: document.querySelector('parsererror') === null,
        namespace: root.namespaceURI,
        name: root.localName,
        schemaLocation: root.getAttributeNS('http://www.w3.org/2001/XMLSchema-instance', 'schemaLocation'),
        urls: Array.from(root.getElementsByTagNameNS(sitemapNamespace, 'url'), (url) => ({
          loc: child(url, 'loc'),
          lastmod: child(url, 'lastmod'),
          alternates: Array.from(url.getElementsByTagNameNS(xhtmlNamespace, 'link'), (link) => ({
            rel: link.getAttribute('rel'),
            hreflang: link.getAttribute('hreflang'),
            href: link.getAttribute('href'),
          })),
        })),
      }
    },
    { text: await response.text(), sitemapNamespace, xhtmlNamespace },
  )
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
    const href = only(await attributeValues(page, 'link[rel="icon"][type="image/svg+xml"]', 'href'), 'SVG icon')
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
    const selector = 'link[rel="icon"][type="image/png"]'
    const hrefs = await attributeValues(page, selector, 'href')
    const sizes = await attributeValues(page, selector, 'sizes')
    expect([...sizes].sort()).toEqual(['16x16', '192x192', '32x32'])
    for (const [index, href] of hrefs.entries()) {
      const header = await fetchPng(request, href)
      expect(`${header.width}x${header.height}`, href).toBe(sizes[index])
    }
  })

  test('include a 180 px apple-touch-icon without transparency, which iOS would fill with black', async ({ page, request }) => {
    await page.goto('/')
    const header = await fetchPng(request, only(await attributeValues(page, 'link[rel="apple-touch-icon"]', 'href'), 'apple-touch-icon'))
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
    const sitemap = await readSitemap(page, request)
    expect(sitemap).toMatchObject({ wellFormed: true, namespace: sitemapNamespace, name: 'urlset' })
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

  test('sitemap.xml names the schema of each namespace, so validators can check its hreflang links', async ({ page, request }) => {
    const sitemap = await readSitemap(page, request)
    // The sitemap schema admits xhtml:link only if a schema declares it; XHTML 1.0 Strict does.
    expect(sitemap.schemaLocation?.split(/\s+/)).toEqual([
      sitemapNamespace,
      'http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
      xhtmlNamespace,
      'http://www.w3.org/2002/08/xhtml/xhtml1-strict.xsd',
    ])
  })

  test('sitemap.xml links every language version of each page once there is more than one', async ({ page, request }) => {
    const sitemap = await readSitemap(page, request)
    const locs = sitemap.urls.map((url) => url.loc)
    if (locs.length < 2) {
      for (const url of sitemap.urls) {
        expect(url.alternates, `${url.loc}`).toEqual([])
      }
      return
    }
    // Each page's language is what the page itself declares in <html lang>.
    const versions: { readonly rel: string; readonly hreflang: string; readonly href: string }[] = []
    for (const loc of locs) {
      if (loc === null) {
        throw new Error('A sitemap <url> has no <loc>')
      }
      await page.goto(new URL(loc).pathname)
      versions.push({ rel: 'alternate', hreflang: only(await attributeValues(page, 'html', 'lang'), `lang of ${loc}`), href: loc })
    }
    // Readers whose language has no page get the English page.
    const expected = versions.concat([{ rel: 'alternate', hreflang: 'x-default', href: SITE }])
    const byLanguage = (a: { readonly hreflang: string | null }, b: { readonly hreflang: string | null }) => `${a.hreflang}`.localeCompare(`${b.hreflang}`)
    for (const url of sitemap.urls) {
      expect([...url.alternates].sort(byLanguage), `${url.loc}`).toEqual([...expected].sort(byLanguage))
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
