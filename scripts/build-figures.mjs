#!/usr/bin/env node
// Regenerates the paper's figures as high-resolution PNG sources in
// src/assets/figures/ from arXiv:2607.27595v1. The build turns these sources
// into responsive AVIF and WebP files, so this script only runs when the
// figures need regenerating, not on every build.
//
// Figures 2 to 4 are rendered from the vector PDFs in the arXiv source
// package. Figure 1 is TikZ drawn inside the paper, so it is cropped from
// page 2 of the PDF.
//
// Requires poppler's `pdftocairo` and `tar` on PATH. Downloads are checked
// against pinned SHA-256 digests: arXiv versions are immutable, so a mismatch
// means a wrong or corrupted download, and the script stops.
//
// Each PNG carries its origin in tEXt chunks: `Source` and `Description`
// (registered PNG keywords) and `impeccable:prompt`, which the design tooling
// reads when it checks that every shipped raster records its provenance.
//
// Usage: node scripts/build-figures.mjs

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { withTextChunks } from './png.ts'

const sourcePackage = {
  url: 'https://arxiv.org/e-print/2607.27595v1',
  sha256: '4d67e38e1010f2c3c770166fa2961bde616f4bae7bde9f214cfeb650fa51eb77',
}
const paperPdf = {
  url: 'https://arxiv.org/pdf/2607.27595v1',
  sha256: '3be02c47fa5d9981de2ecedd929f37a7de7bdcc15b29e534b8a190366e86f11c',
}

const outputDirectory = new URL('../src/assets/figures/', import.meta.url)

// Figure 1 occupies the top of page 2. The crop box, in PDF points from the
// page's top-left corner, encloses every drawing of the figure with a 3 pt
// margin and stops above its caption.
const frameworkCrop = { page: 2, left: 51, top: 51, width: 510, height: 283, dpi: 400 }

/** Vector figures in the source package, rendered at a resolution that covers 2x screens at full width. */
const vectorFigures = [
  { file: 'figures/fig-models.pdf', output: 'models.png', label: 'Figure 2' },
  { file: 'figures/fig-calib.pdf', output: 'calibration.png', label: 'Figure 3' },
  { file: 'figures/fig-decay.pdf', output: 'fidelity.png', label: 'Figure 4' },
]
const vectorDpi = 600

async function download(resource) {
  const response = await fetch(resource.url)
  if (!response.ok) {
    throw new Error(`Download failed: ${resource.url} answered HTTP ${response.status}`)
  }
  const bytes = Buffer.from(await response.arrayBuffer())
  const digest = createHash('sha256').update(bytes).digest('hex')
  if (digest !== resource.sha256) {
    throw new Error(`SHA-256 mismatch for ${resource.url}: expected ${resource.sha256}, got ${digest}`)
  }
  return bytes
}

/** Renders one PDF page to `<outputBase>.png` with pdftocairo. */
function renderPage(pdfPath, outputBase, options) {
  const args = ['-png', '-singlefile', '-r', String(options.dpi), '-f', String(options.page), '-l', String(options.page)]
  if (options.crop !== undefined) {
    const scale = options.dpi / 72
    args.push(
      '-x',
      String(Math.round(options.crop.left * scale)),
      '-y',
      String(Math.round(options.crop.top * scale)),
      '-W',
      String(Math.round(options.crop.width * scale)),
      '-H',
      String(Math.round(options.crop.height * scale)),
    )
  }
  execFileSync('pdftocairo', [...args, pdfPath, outputBase])
  return `${outputBase}.png`
}

function writeFigure(renderedPath, outputName, origin) {
  const png = withTextChunks(readFileSync(renderedPath), [
    { keyword: 'Source', text: origin.source },
    { keyword: 'Description', text: origin.description },
    { keyword: 'impeccable:prompt', text: `Sourced, not generated. ${origin.description} Source: ${origin.source}.` },
  ])
  writeFileSync(new URL(outputName, outputDirectory), png)
  console.log(`wrote src/assets/figures/${outputName}`)
}

const workDirectory = mkdtempSync(join(tmpdir(), 'beyond-similarity-figures-'))
try {
  const packagePath = join(workDirectory, 'source.tar.gz')
  writeFileSync(packagePath, await download(sourcePackage))
  execFileSync('tar', ['-xzf', packagePath, '-C', workDirectory])
  const pdfPath = join(workDirectory, 'paper.pdf')
  writeFileSync(pdfPath, await download(paperPdf))

  const framework = renderPage(pdfPath, join(workDirectory, 'framework'), {
    page: frameworkCrop.page,
    dpi: frameworkCrop.dpi,
    crop: frameworkCrop,
  })
  writeFigure(framework, 'framework.png', {
    source: paperPdf.url,
    description: `Figure 1 of arXiv:2607.27595v1, cropped from PDF page ${frameworkCrop.page} at ${frameworkCrop.dpi} dpi by scripts/build-figures.mjs.`,
  })

  for (const figure of vectorFigures) {
    const rendered = renderPage(join(workDirectory, figure.file), join(workDirectory, figure.output.replace('.png', '')), {
      page: 1,
      dpi: vectorDpi,
    })
    writeFigure(rendered, figure.output, {
      source: sourcePackage.url,
      description: `${figure.label} of arXiv:2607.27595v1, rendered from ${figure.file} in the source package at ${vectorDpi} dpi by scripts/build-figures.mjs.`,
    })
  }
} finally {
  rmSync(workDirectory, { recursive: true, force: true })
}
