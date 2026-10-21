import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { readPngHeader, type PngHeader } from './png'

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
