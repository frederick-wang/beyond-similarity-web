import { gzipSync } from 'node:zlib'
import { expect, test } from '@playwright/test'
import { PAGES } from './paper-literals'

// The SPEC's budget: what a page needs for its first screen (HTML, CSS,
// scripts and the images the first screen shows) weighs at most 200 KB after
// gzip. Text is counted as gzip would send it; images as stored.
const budget = 200 * 1024
const textType = /^(text\/|application\/(javascript|json|xml)|image\/svg\+xml)/

for (const { path } of PAGES) {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    test(`${path} needs at most 200 KB after gzip for its first screen at ${viewport.width} px`, async ({ page }) => {
      await page.setViewportSize(viewport)
      const sizes: Promise<number>[] = []
      page.on('response', (response) => {
        if (response.status() >= 300 && response.status() < 400) {
          return
        }
        sizes.push(
          response.body().then((body) => {
            const type = response.headers()['content-type']
            if (type === undefined) {
              throw new Error(`${response.url()} has no content type`)
            }
            return textType.test(type) ? gzipSync(body).length : body.length
          }),
        )
      })
      await page.goto(path, { waitUntil: 'networkidle' })
      const total = (await Promise.all(sizes)).reduce((sum, size) => sum + size, 0)
      test.info().annotations.push({ type: 'first-screen bytes', description: `${total}` })
      expect(total).toBeLessThanOrEqual(budget)
    })
  }
}
