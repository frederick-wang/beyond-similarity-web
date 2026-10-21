import { expect, test } from '@playwright/test'
import { ABSTRACT, ARXIV_ABS, BENCHMARK_PAIRS, BIBTEX_OPENING, DOI, PRECISION_RANGE, TITLE, normalize } from './paper-literals'

test('reproduces the arXiv abstract word for word', async ({ page }) => {
  await page.goto('/')
  const abstract = page.locator('section#abstract')
  await expect(abstract.getByRole('heading', { level: 2, name: 'Abstract' })).toBeVisible()
  expect(normalize(await abstract.locator('p').allInnerTexts().then((parts) => parts.join(' ')))).toBe(ABSTRACT)
})

test('offers a BibTeX entry for the arXiv preprint', async ({ page }) => {
  await page.goto('/')
  const entry = await page.locator('section#cite pre').innerText()
  expect(entry.startsWith(BIBTEX_OPENING)).toBe(true)
  expect(normalize(entry)).toContain(`title = {${TITLE}}`)
  expect(entry).toMatch(/author\s*=\s*\{Wang, Zhaoji and Si, Wanyu and Wang, Jun\}/)
  expect(entry).toMatch(/year\s*=\s*\{2026\}/)
  expect(entry).toMatch(/eprint\s*=\s*\{2607\.27595\}/)
  expect(entry).toMatch(/archivePrefix\s*=\s*\{arXiv\}/)
  expect(entry).toMatch(/primaryClass\s*=\s*\{cs\.CL\}/)
  expect(entry).toContain(`{${DOI}}`)
  expect(entry).toContain(`{${ARXIV_ABS}}`)
})

test('copies the BibTeX entry with one click', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/')
  const button = page.getByRole('button', { name: 'Copy BibTeX' })
  await button.click()
  await expect(page.locator('[data-copy-status]')).toHaveText('Copied')
  const copied = await page.evaluate(() => navigator.clipboard.readText())
  expect(copied).toBe(await page.locator('section#cite pre').innerText())
})

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })

  test('still shows the whole first screen, the abstract and a selectable BibTeX entry, with no dead button', async ({ page }) => {
    await page.goto('/')
    expect(normalize(await page.locator('h1').innerText())).toBe(TITLE)
    await expect(page.locator('[data-author-name]')).toHaveCount(3)
    await expect(page.locator('[data-author-corresponding]')).toHaveCount(1)
    await expect(page.locator('[data-affiliation]')).toHaveCount(2)
    await expect(page.locator('[data-finding]')).toContainText(`${BENCHMARK_PAIRS} expert-adjudicated pairs`)
    await expect(page.locator('[data-glance]')).toContainText(PRECISION_RANGE)
    expect(normalize(await page.locator('section#abstract p').first().innerText())).toContain('Computational approaches')
    await expect(page.locator('section#cite pre')).toContainText(BIBTEX_OPENING)
    await expect(page.getByRole('button', { name: 'Copy BibTeX' })).toBeHidden()
  })
})
