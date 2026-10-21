import { expect, test } from '@playwright/test'
import {
  AFFILIATIONS_ZH,
  ARXIV_ABS,
  ARXIV_PDF_V1,
  AUTHORS_ZH,
  BENCHMARK_PAIRS,
  COST_SPREAD_ZH,
  EXPLORER,
  FIRST_HISTORY_ZH,
  ICP_NUMBER,
  ICP_REGISTRY,
  LAST_HISTORY_ZH,
  PRECISION_RANGE_ZH,
  TITLE_ZH,
  normalize,
} from './paper-literals'

test.describe('Chinese page, first screen', () => {
  test('declares Chinese as the language of the document', async ({ page }) => {
    await page.goto('/zh/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'zh-Hans')
    await expect(page).toHaveTitle(TITLE_ZH)
  })

  test('shows the Chinese title as the only h1', async ({ page }) => {
    await page.goto('/zh/')
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    expect(normalize(await h1.innerText())).toBe(TITLE_ZH)
  })

  test('lists the three authors in order with affiliation marks and the corresponding author', async ({ page }) => {
    await page.goto('/zh/')
    const names = await page.locator('[data-author-name]').allInnerTexts()
    expect(names.map(normalize)).toEqual([...AUTHORS_ZH])
    const marks = await page.locator('[data-author-affiliations]').allInnerTexts()
    expect(marks.map(normalize)).toEqual(['1,2', '1,2', '1,2'])
    await expect(page.locator('[data-author-corresponding]')).toHaveCount(1)
    await expect(page.locator('[data-author]').nth(2).locator('[data-author-corresponding]')).toHaveCount(1)
    // Chinese separates the names with 、, not with an English comma.
    const entries = await page.locator('[data-author]').allInnerTexts()
    expect(entries.map(normalize)).toEqual(['王兆基1,2、', '司宛玉1,2、', '王军1,2*'])
  })

  test('names both affiliations in Chinese', async ({ page }) => {
    await page.goto('/zh/')
    const affiliations = await page.locator('[data-affiliation]').allInnerTexts()
    expect(affiliations.map((text) => normalize(text).replace(/^\d\s*/, ''))).toEqual([...AFFILIATIONS_ZH])
  })

  test('links to the arXiv record, the v1 PDF, the Explorer and the citation', async ({ page }) => {
    await page.goto('/zh/')
    const row = page.locator('[data-links]')
    await expect(row.locator(`a[href="${ARXIV_ABS}"]`)).toHaveCount(1)
    await expect(row.locator(`a[href="${ARXIV_PDF_V1}"]`)).toHaveCount(1)
    await expect(row.locator(`a[href="${EXPLORER}"]`)).toHaveCount(1)
    await expect(row.locator('a[href="#cite"]')).toHaveCount(1)
    await expect(row.locator('a')).toHaveCount(4)
  })

  test('states the finding with the bounded result the SPEC words', async ({ page }) => {
    await page.goto('/zh/')
    const finding = normalize(await page.locator('[data-finding]').innerText())
    expect(finding).toContain(`${BENCHMARK_PAIRS} 条专家仲裁互文对`)
    expect(finding).toContain('未检出系统性变化')
    expect(finding).toContain('同一原文在较晚成书的史书中字面忠实度总体较低')
    expect(finding).toContain(`成书于${FIRST_HISTORY_ZH}至 ${LAST_HISTORY_ZH}`)
    // No-break spaces keep 公元前, the number and 年 on one line.
    const raw = await page.locator('[data-finding]').textContent()
    expect(raw).toContain(FIRST_HISTORY_ZH.replaceAll(' ', '\u00a0'))
    expect(raw).toContain(LAST_HISTORY_ZH.replace(' ', '\u00a0'))
    expect(finding).not.toMatch(/保持稳定|显著|强大|全面|巧妙/)
  })

  test('gives the numbers worth repeating with their objects', async ({ page }) => {
    await page.goto('/zh/')
    const glance = page.locator('[data-glance]')
    await expect(glance.getByRole('heading', { name: '一览' })).toBeVisible()
    const text = normalize(await glance.innerText())
    for (const expected of [BENCHMARK_PAIRS, '《论语》', '《汉书》', PRECISION_RANGE_ZH, COST_SPREAD_ZH, 'doubao-2.1-turbo', 'deepseek-v4-flash', '4.9 个百分点', '5,766', '65,380', '88.0%']) {
      expect(text).toContain(expected)
    }
  })

  test('lists the sections on this page', async ({ page }) => {
    await page.goto('/zh/')
    const nav = page.getByRole('navigation', { name: '本页内容' })
    await expect(nav.getByRole('link', { name: '摘要' })).toHaveAttribute('href', '#abstract')
    await expect(nav.getByRole('link', { name: '引用' })).toHaveAttribute('href', '#cite')
  })

  test('carries copyright and the maintainer in Chinese, and the ICP filing number', async ({ page }) => {
    await page.goto('/zh/')
    const footer = page.locator('footer')
    await expect(footer).toContainText('© 2026 王兆基、司宛玉和王军。')
    await expect(footer.getByRole('link', { name: AUTHORS_ZH[0] })).toHaveAttribute('href', 'https://www.zhaoji.ac.cn/')
    const icp = footer.getByRole('link', { name: ICP_NUMBER })
    await expect(icp).toHaveAttribute('href', ICP_REGISTRY)
  })
})
