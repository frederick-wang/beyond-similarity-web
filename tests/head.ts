import type { Page } from '@playwright/test'

/**
 * The values of `attribute` on every element of the page that matches
 * `selector`, in document order: the one way the tests read meta and link
 * tags. An element without the attribute fails the test instead of reading as
 * empty.
 */
export async function attributeValues(page: Page, selector: string, attribute: string): Promise<string[]> {
  const values = await page.locator(selector).evaluateAll((elements, name) => elements.map((element) => element.getAttribute(name)), attribute)
  return values.map((value) => {
    if (value === null) {
      throw new Error(`An element matching ${selector} has no ${attribute} attribute`)
    }
    return value
  })
}

/** The one value in a list read from the page; fails unless there is exactly one. */
export function only(values: readonly string[], what: string): string {
  const [value, ...others] = values
  if (value === undefined || others.length > 0) {
    throw new Error(`Expected exactly one ${what}, found ${values.length}`)
  }
  return value
}
