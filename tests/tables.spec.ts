import { expect, test } from '@playwright/test'
import { TABLE_1, TABLE_1_DIMENSIONS, TABLE_2, TABLE_2_TOTAL, TABLE_3, TABLE_3_DIMENSIONS, normalize } from './paper-literals'

async function bodyCells(page: import('@playwright/test').Page, table: string): Promise<string[][]> {
  return page.locator(`#table-${table} tbody tr`).evaluateAll((rows) =>
    rows.map((row) => Array.from(row.querySelectorAll('th, td'), (cell) => (cell.textContent ?? '').replace(/\s+/g, ' ').trim())),
  )
}

test('reproduces every cell of Table 1', async ({ page }) => {
  await page.goto('/')
  const rows = await bodyCells(page, 'agreement')
  expect(rows).toEqual(TABLE_1.map((row, index) => [TABLE_1_DIMENSIONS[index], ...row]))
})

test('reproduces every cell of Table 2, including the total row', async ({ page }) => {
  await page.goto('/')
  expect(await bodyCells(page, 'models')).toEqual(TABLE_2.map((row) => [...row]))
  const total = await page.locator('#table-models tfoot td').allInnerTexts()
  expect(total.slice(1).map(normalize)).toEqual([...TABLE_2_TOTAL])
})

test('reproduces every cell of Table 3', async ({ page }) => {
  await page.goto('/')
  const rows = await bodyCells(page, 'diachronic')
  expect(rows).toEqual(TABLE_3.map((row, index) => [TABLE_3_DIMENSIONS[index], ...row]))
})

test('gives every table one header per column', async ({ page }) => {
  await page.goto('/')
  for (const table of ['agreement', 'models', 'diachronic']) {
    const headers = await page.locator(`#table-${table} thead th`).count()
    const cells = await page.locator(`#table-${table} tbody tr`).first().locator('th, td').count()
    expect(headers, table).toBe(cells)
  }
})

test('labels each table and links it to its PDF page', async ({ page }) => {
  await page.goto('/')
  for (const [table, label, pdfPage] of [
    ['agreement', 'Table 1.', 5],
    ['models', 'Table 2.', 6],
    ['diachronic', 'Table 3.', 6],
  ] as const) {
    const figure = page.locator(`#table-${table}`)
    await expect(figure.locator('figcaption .label')).toHaveText(label)
    await expect(figure.locator('figcaption .page-link')).toHaveAttribute('href', new RegExp(`#page=${pdfPage}$`))
    await expect(figure.getByRole('region')).toHaveAttribute('tabindex', '0')
  }
})

test('shows the whole model table without scrolling on a 1440 px screen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/')
  const region = page.locator('#table-models').getByRole('region')
  const overflow = await region.evaluate((element) => element.scrollWidth - element.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test.describe('on a 390 px screen', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('scrolls the wide model table inside its own region, not the page', async ({ page }) => {
    await page.goto('/')
    const region = page.locator('#table-models').getByRole('region', { name: 'Table 2, scrolls horizontally' })
    const overflow = await region.evaluate((element) => element.scrollWidth - element.clientWidth)
    expect(overflow).toBeGreaterThan(0)
    const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(pageOverflow).toBeLessThanOrEqual(0)
  })
})
