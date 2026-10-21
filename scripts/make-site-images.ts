#!/usr/bin/env node
// Regenerates the site's derived images and writes them into the repository:
//
//   src/assets/share-en.png   the 1200×630 card that link previews show (og:image)
//
// The card is HTML rendered by Playwright's Chromium with the site's own
// stylesheet, so it takes the page's palette, font stack and seal; its text
// comes from the facts module. Rendering uses the fonts installed on the
// machine that runs the script. The committed card was rendered on macOS,
// where the font stack resolves to the system font, as it does for readers on
// Apple devices.
//
// Each PNG carries its origin in tEXt chunks: `Source` and `Description`
// (registered PNG keywords) and `impeccable:prompt`, which the design tooling
// reads when it checks that every shipped raster records its provenance.
//
// Run it after changing the title, the authors, the seal or the palette, and
// commit the results.
//
// Usage: node scripts/make-site-images.ts

import { readFileSync, writeFileSync } from 'node:fs'
import { crc32 } from 'node:zlib'
import { chromium } from '@playwright/test'
import sharp, { type Sharp } from 'sharp'
import { authors, paper } from '../src/data/paper.ts'

const root = new URL('../', import.meta.url)

interface Origin {
  readonly source: string
  readonly description: string
}

const shareCard = {
  output: 'src/assets/share-en.png',
  width: 1200,
  height: 630,
  origin: {
    source:
      'scripts/make-site-images.ts, HTML rendered by Playwright Chromium from src/data/paper.ts (title, short title, authors, arXiv ID), src/styles/global.css and src/assets/seal.png',
    description:
      'Share card for link previews of the paper page: the scroll seal and the short title, the full paper title, the authors and the arXiv ID, on the white paper of the page.',
  },
} as const

function escapeHtml(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

function shareCardHtml(): string {
  const stylesheet = readFileSync(new URL('src/styles/global.css', root), 'utf8')
  const seal = readFileSync(new URL('src/assets/seal.png', root)).toString('base64')
  const byline = authors.map((author) => author.nameEn).join(', ')
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style>${stylesheet}</style>
    <style>
      html,
      body {
        width: ${shareCard.width}px;
        height: ${shareCard.height}px;
        overflow: hidden;
      }

      .card {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 60px 80px 58px;
        overflow: hidden;
      }

      .masthead {
        display: flex;
        align-items: center;
        gap: 18px;
        padding-bottom: 28px;
        border-bottom: 2px solid var(--rule);
      }

      .masthead img {
        display: block;
        width: 62px;
        height: 62px;
      }

      .masthead span {
        font-size: 36px;
        font-weight: 600;
        letter-spacing: 0.005em;
      }

      h1 {
        margin-top: 40px;
        font-size: 64px;
        font-weight: 650;
        line-height: 1.14;
        letter-spacing: -0.012em;
      }

      /* The byline sits at the foot; its top padding is the least room it
         leaves the title, so a title that grows into it overflows the card
         and the script stops. */
      .byline {
        display: flex;
        justify-content: space-between;
        gap: 40px;
        margin-top: auto;
        padding-top: 28px;
        font-size: 32px;
        color: var(--ink-muted);
      }
    </style>
  </head>
  <body>
    <main class="card">
      <header class="masthead">
        <img src="data:image/png;base64,${seal}" alt="" />
        <span>${escapeHtml(paper.shortTitle)}</span>
      </header>
      <h1>${escapeHtml(paper.titleEn)}</h1>
      <footer class="byline">
        <span>${escapeHtml(byline)}</span>
        <span>arXiv:${escapeHtml(paper.arxivId)}</span>
      </footer>
    </main>
  </body>
</html>`
}

async function renderShareCard(): Promise<Buffer> {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({
      viewport: { width: shareCard.width, height: shareCard.height },
      deviceScaleFactor: 1,
      colorScheme: 'light',
    })
    await page.setContent(shareCardHtml())
    await page.evaluate(async () => {
      await document.fonts.ready
    })
    const overflow = await page.locator('.card').evaluate((card) => card.scrollHeight - card.clientHeight)
    if (overflow > 0) {
      throw new Error(`The share card text overflows the card by ${overflow}px; shorten the text or reduce the type size`)
    }
    return await page.screenshot({ type: 'png' })
  } finally {
    await browser.close()
  }
}

/**
 * Returns the PNG with tEXt chunks recording its origin, inserted right after
 * the IHDR chunk. tEXt holds Latin-1, so the texts are kept to printable ASCII.
 */
function withOrigin(png: Buffer, origin: Origin): Buffer {
  const entries = [
    ['Source', origin.source],
    ['Description', origin.description],
    ['impeccable:prompt', `Rendered from HTML, not generated by a model. ${origin.description} Source: ${origin.source}.`],
  ] as const
  const chunks = entries.map(([keyword, text]) => {
    if (!/^[\x20-\x7e]+$/.test(text)) {
      throw new Error(`PNG text for ${keyword} must be printable ASCII: ${text}`)
    }
    const type = Buffer.from('tEXt', 'latin1')
    const data = Buffer.from(`${keyword}\0${text}`, 'latin1')
    const length = Buffer.alloc(4)
    length.writeUInt32BE(data.length)
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(Buffer.concat([type, data])))
    return Buffer.concat([length, type, data, crc])
  })
  // The signature is 8 bytes; IHDR is its 4-byte length, type, data and CRC.
  const ihdrEnd = 8 + 12 + png.readUInt32BE(8)
  return Buffer.concat([png.subarray(0, ihdrEnd), ...chunks, png.subarray(ihdrEnd)])
}

async function writePng(path: string, image: Sharp, origin: Origin): Promise<void> {
  // sharp drops the renderer's metadata; the origin chunks are the only text left.
  const png = await image.png({ compressionLevel: 9, effort: 10 }).toBuffer()
  writeFileSync(new URL(path, root), withOrigin(png, origin))
  console.log(`wrote ${path}`)
}

const card = await renderShareCard()
await writePng(shareCard.output, sharp(card).removeAlpha(), shareCard.origin)
