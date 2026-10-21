import { expect, test, type APIRequestContext, type Page } from '@playwright/test'
import { marked } from 'marked'
import { attributeValues, isRecord, jsonLd, only } from './head'
import { ABSTRACT, ARXIV_ABS, EXPLORER, MARKDOWN_VERSIONS, PAGE_TEXT, SITE, TITLE, normalize } from './paper-literals'

// The machine-readable versions of the site, read as served: each language
// page's Markdown version, /llms.txt and /llms-full.txt. Expected values come
// from the paper, the SPEC, or the HTML page the Markdown renders.

/** A Markdown document as served; anything other than a 200 Markdown response fails. */
async function fetchMarkdown(request: APIRequestContext, path: string): Promise<string> {
  const response = await request.get(path)
  expect(response.status(), path).toBe(200)
  expect(response.headers()['content-type'], path).toMatch(/^text\/markdown/)
  return response.text()
}

async function fetchText(request: APIRequestContext, path: string): Promise<string> {
  const response = await request.get(path)
  expect(response.status(), path).toBe(200)
  expect(response.headers()['content-type'], path).toContain('text/plain')
  return response.text()
}

/** The Markdown source in runs of lines between blank lines, a fenced code block kept whole. */
function lineGroups(markdown: string): string[] {
  const found: string[] = []
  let current: string[] = []
  let fenced = false
  for (const line of markdown.split('\n')) {
    if (line.startsWith('```')) {
      fenced = !fenced
    }
    if (line === '' && !fenced) {
      if (current.length > 0) {
        found.push(current.join('\n'))
      }
      current = []
    } else {
      current.push(line)
    }
  }
  if (current.length > 0) {
    found.push(current.join('\n'))
  }
  return found
}

/** The line group after the one that equals `group`, which must occur once. */
function groupAfter(all: readonly string[], group: string): string {
  const index = all.indexOf(group)
  const next = all[index + 1]
  if (index === -1 || all.indexOf(group, index + 1) !== -1 || next === undefined) {
    throw new Error(`Expected one line group "${group}" followed by another`)
  }
  return next
}

/** A unit of text as a reader meets it: its kind, its text, and its links as (text, href) pairs. */
interface Block {
  readonly kind: 'heading' | 'paragraph' | 'item' | 'image' | 'cell' | 'code'
  readonly text: string
  readonly links: readonly (readonly [string, string])[]
}

/** One side read in order, with how many times each known difference applied while reading it. */
interface Reading {
  readonly blocks: readonly Block[]
  readonly applied: Readonly<Record<string, number>>
}

/**
 * Where a Markdown version and its page differ by design. The readers below
 * apply exactly these and count each one, and the test requires every one to
 * apply, so a declaration cannot outlive the difference it names.
 */
const KNOWN_DIFFERENCES = [
  { name: 'canonicalSentence', why: 'The sentence that names the canonical address exists only in the Markdown.' },
  { name: 'citeLink', why: 'The in-page Cite link exists only in the link row of the page.' },
  { name: 'openFullSize', why: 'The “Open full size” link under a figure on the page is carried by the Markdown image URL.' },
  { name: 'navigation', why: 'The page navigation exists only on the page.' },
  { name: 'questionNumbers', why: 'The page sets a question’s number apart from its heading; the Markdown writes it as “1. ” before the heading.' },
  { name: 'glanceEntries', why: 'The page sets a glance quantity and its text in dt and dd; the Markdown joins them with a separator.' },
] as const

/**
 * The page in reading order, as blocks: main, then the footer's copyright
 * line, which the Markdown ends with. `glanceJoin` is the separator the
 * Markdown puts between a glance quantity and its text.
 */
async function readPage(page: Page, glanceJoin: string): Promise<Reading> {
  return page.evaluate(
    ({ site, glanceJoin }) => {
      const required = <T,>(value: T | null | undefined, what: string): T => {
        if (value === null || value === undefined) {
          throw new Error(`The page has no ${what}`)
        }
        return value
      }
      const normalize = (text: string) => text.replace(/\s+/g, ' ').trim()
      const textOf = (element: Element) => normalize(required(element.textContent, 'text'))
      const linksOf = (element: Element) =>
        Array.from(element.querySelectorAll('a'), (anchor): [string, string] => [textOf(anchor), required(anchor.getAttribute('href'), 'link address')])
      const applied = { citeLink: 0, openFullSize: 0, navigation: 0, questionNumbers: 0, glanceEntries: 0 }
      const blocks: Block[] = []
      const main = required(document.querySelector('main'), 'main')
      for (const element of main.querySelectorAll('h1, h2, h3, p, li, [data-glance] .entry, figure[data-figure] img, figcaption, th, td, pre')) {
        if (element.closest('nav') !== null) {
          applied.navigation += 1
        } else if (element.matches('h1, h2, h3')) {
          const numeral = element.querySelector('.numeral')
          if (numeral === null) {
            blocks.push({ kind: 'heading', text: textOf(element), links: linksOf(element) })
          } else {
            applied.questionNumbers += 1
            const heading = required(element.querySelector('.heading-text'), 'question heading text')
            blocks.push({ kind: 'heading', text: `${textOf(numeral)}. ${textOf(heading)}`, links: linksOf(heading) })
          }
        } else if (element.matches('.entry')) {
          applied.glanceEntries += 1
          const quantity = textOf(required(element.querySelector('dt'), 'glance quantity'))
          const words = textOf(required(element.querySelector('dd'), 'glance text'))
          blocks.push({ kind: 'item', text: `${quantity}${glanceJoin}${words}`, links: linksOf(element) })
        } else if (element.matches('li')) {
          if (element.querySelector('a[href="#cite"]') === null) {
            blocks.push({ kind: 'item', text: textOf(element), links: linksOf(element) })
          } else {
            applied.citeLink += 1
          }
        } else if (element.matches('img')) {
          const full = required(required(element.closest('a'), 'full-size link around a figure').getAttribute('href'), 'full-size address')
          const alternative = normalize(required(element.getAttribute('alt'), 'figure text alternative'))
          blocks.push({ kind: 'image', text: alternative, links: [['', new URL(full, site).href]] })
        } else if (element.matches('figcaption')) {
          const caption = element.cloneNode(true)
          if (!(caption instanceof Element)) {
            throw new Error('A caption did not clone as an element')
          }
          const plate = required(element.closest('figure'), 'figure around a caption').querySelector('a.plate')
          for (const full of caption.querySelectorAll('a[href^="/_astro/"]')) {
            if (plate === null || full.getAttribute('href') !== plate.getAttribute('href')) {
              throw new Error('An “Open full size” link does not open its figure’s image')
            }
            full.remove()
            applied.openFullSize += 1
          }
          for (const separator of caption.querySelectorAll('.figure-links [aria-hidden="true"]')) {
            separator.remove()
          }
          blocks.push({ kind: 'paragraph', text: textOf(caption), links: linksOf(caption) })
        } else if (element.matches('th, td')) {
          blocks.push({ kind: 'cell', text: textOf(element), links: linksOf(element) })
        } else if (element.matches('pre')) {
          blocks.push({ kind: 'code', text: required(element.textContent, 'code').trimEnd(), links: [] })
        } else {
          blocks.push({ kind: 'paragraph', text: textOf(element), links: linksOf(element) })
        }
      }
      const copyright = required(document.querySelector('footer p'), 'copyright line')
      blocks.push({ kind: 'paragraph', text: textOf(copyright), links: linksOf(copyright) })
      return { blocks, applied }
    },
    { site: SITE, glanceJoin },
  )
}

/** The Markdown rendered by marked and read in the browser as blocks, the sentence that names `canonical` set aside. */
async function readMarkdown(page: Page, markdown: string, canonical: string): Promise<Reading> {
  // The rendered images point at the public site; reading them loads nothing.
  await page.route('**/*', (route) => route.abort())
  await page.setContent(marked.parse(markdown, { async: false }))
  return page.evaluate((canonical) => {
    const required = <T,>(value: T | null | undefined, what: string): T => {
      if (value === null || value === undefined) {
        throw new Error(`The Markdown has no ${what}`)
      }
      return value
    }
    const normalize = (text: string) => text.replace(/\s+/g, ' ').trim()
    const textOf = (element: Element) => normalize(required(element.textContent, 'text'))
    const linksOf = (element: Element) =>
      Array.from(element.querySelectorAll('a'), (anchor): [string, string] => [textOf(anchor), required(anchor.getAttribute('href'), 'link address')])
    const applied = { canonicalSentence: 0 }
    const blocks: Block[] = []
    for (const element of document.body.querySelectorAll('h1, h2, h3, p, li, th, td, pre')) {
      if (element.matches('h1, h2, h3')) {
        blocks.push({ kind: 'heading', text: textOf(element), links: linksOf(element) })
      } else if (element.matches('li')) {
        blocks.push({ kind: 'item', text: textOf(element), links: linksOf(element) })
      } else if (element.matches('th, td')) {
        blocks.push({ kind: 'cell', text: textOf(element), links: linksOf(element) })
      } else if (element.matches('pre')) {
        blocks.push({ kind: 'code', text: required(element.textContent, 'code').trimEnd(), links: [] })
      } else {
        const links = linksOf(element)
        const [firstLink, ...otherLinks] = links
        const image = element.querySelector(':scope > img')
        if (image !== null && element.childElementCount === 1 && textOf(element) === '') {
          const alternative = normalize(required(image.getAttribute('alt'), 'image text alternative'))
          blocks.push({ kind: 'image', text: alternative, links: [['', required(image.getAttribute('src'), 'image address')]] })
        } else if (firstLink !== undefined && otherLinks.length === 0 && firstLink[1] === canonical) {
          applied.canonicalSentence += 1
        } else {
          blocks.push({ kind: 'paragraph', text: textOf(element), links })
        }
      }
    }
    return { blocks, applied }
  }, canonical)
}

for (const { page: path, markdown: markdownPath, glanceJoin } of MARKDOWN_VERSIONS) {
  test.describe(`${markdownPath}, the Markdown version of ${path}`, () => {
    test('starts with the page title and names the page it renders', async ({ page, request }) => {
      const markdown = await fetchMarkdown(request, markdownPath)
      await page.goto(path)
      expect(markdown.split('\n')[0]).toBe(`# ${normalize(await page.locator('h1').innerText())}`)
      const canonical = only(await attributeValues(page, 'link[rel="canonical"]', 'href'), 'canonical link')
      expect(lineGroups(markdown)[1]).toContain(`<${canonical}>`)
    })

    test('says what the page says, block by block, links included', async ({ page, request }) => {
      const markdown = await fetchMarkdown(request, markdownPath)
      await page.goto(path)
      const canonical = only(await attributeValues(page, 'link[rel="canonical"]', 'href'), 'canonical link')
      const served = await readPage(page, glanceJoin)
      const rendered = await readMarkdown(page, markdown, canonical)
      const applied = new Map(Object.entries(served.applied).concat(Object.entries(rendered.applied)))
      expect([...applied.keys()].sort()).toEqual(KNOWN_DIFFERENCES.map((difference) => difference.name).sort())
      for (const difference of KNOWN_DIFFERENCES) {
        expect(applied.get(difference.name), `${difference.name}: ${difference.why}`).toBeGreaterThan(0)
      }
      expect(served.blocks.length).toBeGreaterThan(100)
      expect(rendered.blocks).toEqual(served.blocks)
    })
  })
}

test('/index.md gives the arXiv abstract word for word', async ({ request }) => {
  const markdown = await fetchMarkdown(request, '/index.md')
  const abstract = groupAfter(lineGroups(markdown), `## ${PAGE_TEXT.en.abstractHeading}`)
  expect(abstract.replace(/\*([^*]+)\*/g, '$1')).toBe(ABSTRACT)
})

test('/llms-full.txt is the English Markdown, a thematic break, then the Chinese Markdown', async ({ request }) => {
  const [english, chinese] = await Promise.all(MARKDOWN_VERSIONS.map(({ markdown }) => fetchMarkdown(request, markdown)))
  if (english === undefined || chinese === undefined) {
    throw new Error('Expected the English and the Chinese Markdown version')
  }
  expect(await fetchText(request, '/llms-full.txt')).toBe(`${english.replace(/\n$/, '')}\n\n---\n\n${chinese}`)
})

test('the host serves the Markdown versions and the llms files as UTF-8', async ({ request }) => {
  test.skip(
    process.env['BASE_URL'] === undefined,
    'The host sets the content type and its charset: static output keeps no endpoint headers, and the local preview names no charset. Run with BASE_URL against a deployment.',
  )
  for (const path of MARKDOWN_VERSIONS.map((version): string => version.markdown).concat(['/llms.txt', '/llms-full.txt'])) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    expect(response.headers()['content-type'], path).toMatch(/;\s*charset=utf-8\b/i)
  }
})

for (const { page: path, markdown } of MARKDOWN_VERSIONS) {
  test(`${path} names its Markdown version in the head`, async ({ page, request }) => {
    await page.goto(path)
    const href = only(await attributeValues(page, 'link[rel="alternate"][type="text/markdown"]', 'href'), 'Markdown alternate link')
    expect(href).toBe(new URL(markdown, SITE).href)
    const response = await request.get(new URL(href).pathname)
    expect(response.status()).toBe(200)
  })
}

test.describe('/llms.txt', () => {
  /**
   * The file's list entries outside fenced code, each with the address of its
   * link when it has the form `- [name](url): notes`, and null when it does not.
   */
  function entries(text: string): { readonly line: string; readonly url: string | null }[] {
    return lineGroups(text)
      .filter((group) => !group.startsWith('```'))
      .flatMap((group) => group.split('\n'))
      .filter((line) => line.startsWith('- '))
      .map((line) => {
        const entry = /^- \[[^\]]+\]\(([^)\s]+)\): \S/.exec(line)
        if (entry === null) {
          return { line, url: null }
        }
        const url = entry[1]
        if (url === undefined) {
          throw new Error(`The entry "${line}" matched without an address`)
        }
        return { line, url }
      })
  }

  test('opens with the English title and a blockquote summary', async ({ request }) => {
    const text = await fetchText(request, '/llms.txt')
    expect(text.split('\n')[0]).toBe(`# ${TITLE}`)
    expect(lineGroups(text)[1]).toMatch(/^> \S/)
  })

  test('lists every file as a link with notes, the pages, their Markdown versions, arXiv and the Explorer among them', async ({ request }) => {
    const listed = entries(await fetchText(request, '/llms.txt'))
    expect(listed.filter((entry) => entry.url === null).map((entry) => entry.line)).toEqual([])
    const urls = listed.map((entry) => entry.url)
    for (const required of [SITE, new URL('zh/', SITE).href, ...MARKDOWN_VERSIONS.map(({ markdown }) => new URL(markdown, SITE).href), ARXIV_ABS, EXPLORER]) {
      expect(urls).toContain(required)
    }
  })

  test('links only to files the site serves', async ({ request }) => {
    const urls = entries(await fetchText(request, '/llms.txt')).flatMap((entry) => (entry.url === null ? [] : [entry.url]))
    const own = urls.filter((url) => url.startsWith(SITE))
    expect(own.length).toBeGreaterThan(0)
    for (const url of own) {
      const response = await request.get(new URL(url).pathname)
      expect(response.status(), url).toBe(200)
    }
  })

  test('links outside the site only where the English page does', async ({ page, request }) => {
    const urls = entries(await fetchText(request, '/llms.txt')).flatMap((entry) => (entry.url === null ? [] : [entry.url]))
    await page.goto('/')
    // The page links to arXiv, the PDF and the Explorer from its title block.
    // It gives the DOI as the paper's identifier in its structured data rather
    // than as a link, so the identifier counts as the page's DOI link.
    const titleLinks = await attributeValues(page, '[data-links] a[href^="https://"]', 'href')
    const article = (await jsonLd(page))['mainEntity']
    if (!isRecord(article) || typeof article['@id'] !== 'string') {
      throw new Error('The JSON-LD names no paper identifier')
    }
    expect(urls.filter((url) => !url.startsWith(SITE)).sort()).toEqual([...titleLinks, article['@id']].sort())
  })
})
