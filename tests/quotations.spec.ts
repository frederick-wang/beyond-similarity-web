import { expect, test } from '@playwright/test'
import { QUOTATIONS } from './paper-literals'

test('sets every classical Chinese quotation as text in the script of its edition', async ({ page }) => {
  await page.goto('/')
  const rendered = await page.locator('[data-quotation]').evaluateAll((spans) =>
    spans.map((span) => ({ text: span.textContent, lang: span.getAttribute('lang') })),
  )
  for (const quotation of QUOTATIONS) {
    expect(rendered).toContainEqual({ text: quotation.text, lang: quotation.lang })
  }
})

test('sets quotations in a Song face and wraps them in English quotation marks', async ({ page }) => {
  await page.goto('/')
  const first = page.locator('section#gap [data-quotation]').first()
  const family = await first.evaluate((span) => getComputedStyle(span).fontFamily)
  expect(family).toMatch(/Songti|Noto Serif CJK|Source Han Serif|SimSun/)
  const paragraph = await page.locator('section#gap p', { hasText: 'Wang Mang' }).innerText()
  expect(paragraph).toContain('“咨爾舜，天之歷數在爾躬”')
})
