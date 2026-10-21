import { expect, test } from '@playwright/test'
import { attributeValues, only } from './head'
import { ICP_NUMBER, ICP_REGISTRY, SITE, TITLE } from './paper-literals'

test('declares language, title, description and a self canonical', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle(TITLE)
  const description = only(await attributeValues(page, 'meta[name="description"]', 'content'), 'description')
  expect(description.length).toBeGreaterThan(60)
  expect(description.length).toBeLessThanOrEqual(170)
  expect(await attributeValues(page, 'link[rel="canonical"]', 'href')).toEqual([SITE])
})

test('carries copyright, the maintainer and the ICP filing number in the footer', async ({ page }) => {
  await page.goto('/')
  const footer = page.locator('footer')
  await expect(footer).toContainText('© 2026')
  await expect(footer).toContainText('Zhaoji Wang, Wanyu Si, and Jun Wang')
  await expect(footer).toContainText('all rights reserved')
  await expect(footer.locator('a[href="https://www.zhaoji.ac.cn/"]')).toHaveCount(1)
  const icp = footer.getByRole('link', { name: ICP_NUMBER })
  await expect(icp).toHaveAttribute('href', ICP_REGISTRY)
})
