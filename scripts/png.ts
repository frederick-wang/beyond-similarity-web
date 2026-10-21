// The one reader and writer of PNG chunks in the repository: the header that
// tests check, the words that the public-content check scans, and tEXt
// insertion for the scripts that make images. Node runs it as is when
// check-public.mjs and build-figures.mjs import it, which needs erasable
// TypeScript only; erasableSyntaxOnly in tsconfig.json makes `astro check`
// reject anything else, here and in every module the scripts import.
//
// Of the chunks the PNG specification defines, these carry words: tEXt, zTXt
// and iTXt (keyword and text, and for iTXt a language tag and a translated
// keyword), iCCP (the name of its colour profile) and sPLT (the name of its
// palette). eXIf carries EXIF, which can hold host names, paths, device serial
// numbers and places; it is reported, not read. Every other chunk the
// specification defines holds binary or numeric data. Private chunks could
// hold anything, and none of the repository's images has one.

import { crc32, inflateSync } from 'node:zlib'

const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

interface Chunk {
  readonly type: string
  readonly data: Buffer
  /** Offset of the chunk's length field. */
  readonly start: number
  /** Offset just past the chunk's CRC. */
  readonly end: number
}

/**
 * Why a PNG could not be read. check-public.mjs prints these into CI logs,
 * which are public, so an error names only a category and a byte offset and
 * never repeats bytes from the file.
 */
export type PngFormatProblem =
  | 'cut off'
  | 'past the end of the file'
  | 'CRC mismatch'
  | 'no 13-byte IHDR first'
  | 'no IEND at the end'
  | 'trailing bytes'
  | 'malformed text field'
  | 'compressed text cannot be inflated'
  | 'compressed text not fully consumed'

export class PngFormatError extends Error {
  readonly offset: number
  readonly problem: PngFormatProblem

  constructor(offset: number, problem: PngFormatProblem) {
    super(`PNG malformed at byte ${offset}: ${problem}`)
    this.offset = offset
    this.problem = problem
  }
}

export interface PngHeader {
  readonly width: number
  readonly height: number
  /** True when pixels can be transparent: an alpha channel, or a tRNS chunk before the image data. */
  readonly transparency: boolean
}

/** A keyword and its text: what a tEXt chunk holds, and what withTextChunks writes. */
export interface TextEntry {
  readonly keyword: string
  readonly text: string
}

/** A text chunk as read. iTXt adds a language tag and a translated keyword to the keyword and the text. */
export type PngText =
  | { readonly type: 'tEXt' | 'zTXt'; readonly keyword: string; readonly text: string }
  | {
      readonly type: 'iTXt'
      readonly keyword: string
      readonly language: string
      readonly translatedKeyword: string
      readonly text: string
    }

/** Every word a PNG carries, by where it sits. */
export interface PngWords {
  readonly texts: readonly PngText[]
  /** The names that iCCP and sPLT chunks give their colour profile and palettes. */
  readonly names: readonly string[]
  /** Whether the file has an eXIf chunk. */
  readonly exif: boolean
}

export function isPng(bytes: Buffer): boolean {
  return bytes.subarray(0, signature.length).equals(signature)
}

/**
 * Every chunk in file order. A file that does not parse cleanly throws a
 * PngFormatError, so a reader never skips bytes it could not account for: each
 * chunk has to fit in the file and match its CRC, IHDR has to come first with
 * its fixed 13 bytes of data, and IEND has to come last, exactly at the end of
 * the file. Without those checks a chunk with an enlarged length could swallow
 * the text chunk after it, and the text would never be read.
 */
function parse(png: Buffer): { readonly header: Chunk; readonly chunks: readonly Chunk[] } {
  if (!isPng(png)) {
    throw new Error('Not a PNG file')
  }
  const found: Chunk[] = []
  // Each chunk is a 4-byte length, a 4-byte type, the data and a 4-byte CRC.
  let start = signature.length
  while (found.at(-1)?.type !== 'IEND') {
    if (start === png.length) {
      throw new PngFormatError(start, 'no IEND at the end')
    }
    if (start + 12 > png.length) {
      throw new PngFormatError(start, 'cut off')
    }
    const end = start + 12 + png.readUInt32BE(start)
    if (end > png.length) {
      throw new PngFormatError(start, 'past the end of the file')
    }
    if (crc32(png.subarray(start + 4, end - 4)) !== png.readUInt32BE(end - 4)) {
      throw new PngFormatError(start, 'CRC mismatch')
    }
    found.push({ type: png.toString('latin1', start + 4, start + 8), data: png.subarray(start + 8, end - 4), start, end })
    start = end
  }
  if (start !== png.length) {
    throw new PngFormatError(start, 'trailing bytes')
  }
  const header = found[0]
  if (header?.type !== 'IHDR' || header.data.length !== 13) {
    throw new PngFormatError(signature.length, 'no 13-byte IHDR first')
  }
  return { header, chunks: found }
}

export function readPngHeader(png: Buffer): PngHeader {
  const { header, chunks: all } = parse(png)
  const imageData = all.findIndex((chunk) => chunk.type === 'IDAT')
  if (imageData === -1) {
    throw new Error('PNG file has no image data')
  }
  const colourType = header.data.readUInt8(9)
  return {
    width: header.data.readUInt32BE(0),
    height: header.data.readUInt32BE(4),
    transparency: colourType === 4 || colourType === 6 || all.slice(0, imageData).some((chunk) => chunk.type === 'tRNS'),
  }
}

/**
 * The bytes up to the NUL that ends a field starting at `from`; a missing NUL
 * means the chunk is malformed.
 */
function fieldEnd(chunk: Chunk, from: number): number {
  const end = chunk.data.indexOf(0, from)
  if (end === -1) {
    throw new PngFormatError(chunk.start, 'malformed text field')
  }
  return end
}

/**
 * Inflates compressed text and requires the zlib stream to use every byte
 * given: inflateSync ignores bytes after the end of the stream, and words
 * hidden there would otherwise go unread. With { info: true } it returns
 * { buffer, engine }, which the Node typings do not describe, so the shape is
 * checked; engine.bytesWritten is the number of input bytes the stream used.
 */
function inflateWhole(chunk: Chunk, compressed: Buffer): Buffer {
  let result: unknown
  try {
    result = inflateSync(compressed, { info: true })
  } catch {
    throw new PngFormatError(chunk.start, 'compressed text cannot be inflated')
  }
  if (
    typeof result !== 'object' ||
    result === null ||
    !('buffer' in result) ||
    !('engine' in result) ||
    !Buffer.isBuffer(result.buffer) ||
    typeof result.engine !== 'object' ||
    result.engine === null ||
    !('bytesWritten' in result.engine) ||
    typeof result.engine.bytesWritten !== 'number'
  ) {
    throw new Error('zlib.inflateSync with { info: true } no longer returns { buffer, engine }')
  }
  if (result.engine.bytesWritten !== compressed.length) {
    throw new PngFormatError(chunk.start, 'compressed text not fully consumed')
  }
  return result.buffer
}

function textChunk(chunk: Chunk): PngText | null {
  switch (chunk.type) {
    case 'tEXt': {
      const keywordEnd = fieldEnd(chunk, 0)
      return { type: 'tEXt', keyword: chunk.data.toString('latin1', 0, keywordEnd), text: chunk.data.toString('latin1', keywordEnd + 1) }
    }
    case 'zTXt': {
      // keyword, NUL, compression method, compressed text
      const keywordEnd = fieldEnd(chunk, 0)
      const text = inflateWhole(chunk, chunk.data.subarray(keywordEnd + 2)).toString('latin1')
      return { type: 'zTXt', keyword: chunk.data.toString('latin1', 0, keywordEnd), text }
    }
    case 'iTXt': {
      // keyword, NUL, compression flag, compression method, language tag, NUL, translated keyword, NUL, text
      const keywordEnd = fieldEnd(chunk, 0)
      if (keywordEnd + 3 > chunk.data.length) {
        throw new PngFormatError(chunk.start, 'malformed text field')
      }
      const compressed = chunk.data.readUInt8(keywordEnd + 1) === 1
      const languageEnd = fieldEnd(chunk, keywordEnd + 3)
      const translatedEnd = fieldEnd(chunk, languageEnd + 1)
      const text = chunk.data.subarray(translatedEnd + 1)
      return {
        type: 'iTXt',
        keyword: chunk.data.toString('latin1', 0, keywordEnd),
        language: chunk.data.toString('latin1', keywordEnd + 3, languageEnd),
        translatedKeyword: chunk.data.toString('utf8', languageEnd + 1, translatedEnd),
        text: (compressed ? inflateWhole(chunk, text) : text).toString('utf8'),
      }
    }
    default:
      return null
  }
}

/** Every word a PNG carries: its text chunks, its iCCP and sPLT names, and whether it has EXIF. */
export function readPngWords(png: Buffer): PngWords {
  const texts: PngText[] = []
  const names: string[] = []
  let exif = false
  for (const chunk of parse(png).chunks) {
    const text = textChunk(chunk)
    if (text !== null) {
      texts.push(text)
    } else if (chunk.type === 'iCCP' || chunk.type === 'sPLT') {
      // A Latin-1 name ending at its NUL opens both chunks.
      names.push(chunk.data.toString('latin1', 0, fieldEnd(chunk, 0)))
    } else if (chunk.type === 'eXIf') {
      exif = true
    }
  }
  return { texts, names, exif }
}

/** Every tEXt, zTXt and iTXt chunk in file order, compressed text inflated. */
export function readPngTexts(png: Buffer): PngText[] {
  return parse(png).chunks.flatMap((chunk) => {
    const text = textChunk(chunk)
    return text === null ? [] : [text]
  })
}

/** Where an image came from, as its provenance chunks record it. */
export interface Provenance {
  /** How the image was made, opening the impeccable record, such as "Sourced, not generated." */
  readonly method: string
  readonly description: string
  readonly source: string
}

/**
 * The tEXt entries that record an image's provenance: Source and Description
 * (registered PNG keywords) and impeccable:prompt, which the design tooling
 * reads when it checks that every shipped raster records where it came from.
 */
export function provenanceTexts(provenance: Provenance): TextEntry[] {
  return [
    { keyword: 'Source', text: provenance.source },
    { keyword: 'Description', text: provenance.description },
    { keyword: 'impeccable:prompt', text: `${provenance.method} ${provenance.description} Source: ${provenance.source}.` },
  ]
}

/**
 * The PNG with one tEXt chunk per entry inserted right after IHDR, in order.
 * tEXt holds Latin-1, so keywords (1 to 79 characters) and texts are kept to
 * printable ASCII and anything else throws.
 */
export function withTextChunks(png: Buffer, entries: readonly TextEntry[]): Buffer {
  const inserted = entries.map((entry) => {
    if (!/^[\x20-\x7e]{1,79}$/.test(entry.keyword) || !/^[\x20-\x7e]*$/.test(entry.text)) {
      throw new Error(`PNG text must be printable ASCII: ${entry.keyword}`)
    }
    const type = Buffer.from('tEXt', 'latin1')
    const data = Buffer.from(`${entry.keyword}\0${entry.text}`, 'latin1')
    const length = Buffer.alloc(4)
    length.writeUInt32BE(data.length)
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(Buffer.concat([type, data])))
    return Buffer.concat([length, type, data, crc])
  })
  const afterHeader = parse(png).header.end
  return Buffer.concat([png.subarray(0, afterHeader), ...inserted, png.subarray(afterHeader)])
}
