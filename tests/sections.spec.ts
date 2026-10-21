import { expect, test } from '@playwright/test'
import { ARXIV_PDF_V1, normalize } from './paper-literals'

test('opens every question section with a numbered question and a direct answer', async ({ page }) => {
  await page.goto('/')
  const questions = page.locator('section.section-question')
  const count = await questions.count()
  expect(count).toBeGreaterThanOrEqual(5)
  for (let index = 0; index < count; index += 1) {
    const section = questions.nth(index)
    const heading = section.locator('h2')
    await expect(heading.locator('.numeral')).toHaveText(String(index + 1))
    expect(normalize(await heading.locator('.heading-text').innerText())).toMatch(/\?$/)
    const firstBlock = section.locator(':scope > :not(h2)').first()
    await expect(firstBlock).toHaveAttribute('data-answer', '')
  }
})

test('keeps abstract, limitations, using this work, cite and acknowledgments as plain sections, in order', async ({ page }) => {
  await page.goto('/')
  const ids = await page.locator('main section.section').evaluateAll((sections) => sections.map((section) => section.id))
  expect(ids[0]).toBe('abstract')
  expect(ids.slice(-4)).toEqual(['limitations', 'using', 'cite', 'acknowledgments'])
  for (const id of ['abstract', 'limitations', 'using', 'cite', 'acknowledgments']) {
    await expect(page.locator(`section#${id}`)).toHaveClass(/section-plain/)
  }
})

test('lists every section in the page navigation, with the same question numbers', async ({ page }) => {
  await page.goto('/')
  const ids = await page.locator('main section.section').evaluateAll((sections) => sections.map((section) => section.id))
  const nav = page.getByRole('navigation', { name: 'On this page' })
  const hrefs = await nav.locator('.wide a').evaluateAll((links) => links.map((link) => link.getAttribute('href')))
  expect(hrefs).toEqual(ids.map((id) => `#${id}`))
  const numerals = await nav.locator('.wide .numeral').allInnerTexts()
  const questionCount = await page.locator('section.section-question').count()
  expect(numerals).toEqual(Array.from({ length: questionCount }, (_, index) => String(index + 1)))
})

test('links each supported paragraph to a page of the arXiv v1 PDF', async ({ page }) => {
  await page.goto('/')
  const links = page.locator('[data-sources] a')
  expect(await links.count()).toBeGreaterThanOrEqual(20)
  for (const href of await links.evaluateAll((elements) => elements.map((element) => element.getAttribute('href')))) {
    expect(href).toMatch(new RegExp(`^${ARXIV_PDF_V1.replace(/\./g, '\\.')}#page=[1-9]$`))
  }
})

test('cites the pages that hold the evidence for the opening example and the prefilter bound', async ({ page }) => {
  await page.goto('/')
  const opening = page.locator('section#gap p', { hasText: 'Wang Mang' })
  await expect(opening.locator('[data-sources] a')).toHaveAttribute('href', `${ARXIV_PDF_V1}#page=1`)
  const prefilter = page.locator('p', { hasText: '0.3% combined' })
  await expect(prefilter.locator('[data-sources] a')).toHaveAttribute('href', `${ARXIV_PDF_V1}#page=1`)
  const gradientExample = page.locator('p', { hasText: '345 items' })
  await expect(gradientExample.locator('[data-sources] a')).toHaveText(/PDF pp\. 4–5$/)
})

test('states the corpus-run caveat and the reliability bound in the text', async ({ page }) => {
  await page.goto('/')
  const histories = normalize(await page.locator('section#histories').innerText())
  expect(histories).toContain('one pair in eight')
  expect(histories).toContain('function and stance remain exploratory')
  const benchmark = normalize(await page.locator('section#benchmark').innerText())
  expect(benchmark).toContain('1,930 − 14 + 617 = 2,533')
})
