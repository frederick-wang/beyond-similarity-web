import { expect, test } from '@playwright/test'
import { attributeValues, only } from './head'
import { AUTHORS, AUTHORS_ZH, ICP_NUMBER, ICP_REGISTRY, PAGES, PAGE_TEXT, SITE, TITLE, normalize } from './paper-literals'

test('declares language, title, description and a self canonical', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle(TITLE)
  const description = only(await attributeValues(page, 'meta[name="description"]', 'content'), 'description')
  expect(description.length).toBeGreaterThan(60)
  expect(description.length).toBeLessThanOrEqual(170)
  expect(await attributeValues(page, 'link[rel="canonical"]', 'href')).toEqual([SITE])
})

/** The maintainer, the first author, as each page names him. */
const maintainer = { en: AUTHORS[0], 'zh-Hans': AUTHORS_ZH[0] } as const

for (const { path, lang } of PAGES) {
  test(`${path} carries copyright, the maintainer and the ICP filing number in the footer, in the page language`, async ({ page }) => {
    await page.goto(path)
    const footer = page.locator('footer')
    const [copyright, maintainedBy] = await footer.locator('p').allInnerTexts()
    expect([copyright, maintainedBy].map((sentence) => normalize(sentence ?? ''))).toEqual([...PAGE_TEXT[lang].footer])
    await expect(footer.getByRole('link', { name: maintainer[lang], exact: true })).toHaveAttribute('href', 'https://www.zhaoji.ac.cn/')
    const icp = footer.getByRole('link', { name: ICP_NUMBER })
    await expect(icp).toHaveAttribute('href', ICP_REGISTRY)
  })
}
