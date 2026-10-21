// The one reader and writer of PNG chunks in the repository: the header that
// tests check, the text chunks (tEXt, zTXt, iTXt) that carry provenance and
// that the public-content check scans, and tEXt insertion for the scripts that
// make images. It uses erasable TypeScript only, so Node runs it as is when
// check-public.mjs and build-figures.mjs import it.

import { crc32, inflateSync } from 'node:zlib'

const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

interface Chunk {
  readonly type: string
  readonly data: Buffer
  /** Offset just past the chunk's CRC. */
  readonly end: number
}

export interface PngHeader {
  readonly width: number
  readonly height: number
  /** True when pixels can be transparent: an alpha channel, or a tRNS chunk before the image data. */
  readonly transparency: boolean
}

export interface PngText {
  readonly keyword: string
  readonly text: string
}

export function isPng(bytes: Buffer): boolean {
  return bytes.subarray(0, signature.length).equals(signature)
}

/**
 * Every chunk in file order. A file that does not parse cleanly throws, so a
 * reader never skips bytes it could not account for: each chunk has to fit in
 * the file and match its CRC, IHDR has to come first with its fixed 13 bytes
 * of data, and the chunks have to end with IEND exactly at the end of the file.
 * Without those checks a chunk with an enlarged length could swallow the text
 * chunk after it, and the text would never be read.
 */
function parse(png: Buffer): { readonly header: Chunk; readonly chunks: readonly Chunk[] } {
  if (!isPng(png)) {
    throw new Error('Not a PNG file')
  }
  const found: Chunk[] = []
  // Each chunk is a 4-byte length, a 4-byte type, the data and a 4-byte CRC.
  for (let start = signature.length; start < png.length; ) {
    if (start + 12 > png.length) {
      throw new Error(`PNG chunk at byte ${start} is cut off`)
    }
    const length = png.readUInt32BE(start)
    const type = png.toString('latin1', start + 4, start + 8)
    const end = start + 12 + length
    if (end > png.length) {
      throw new Error(`PNG chunk ${type} at byte ${start} declares ${length} bytes, past the end of the file`)
    }
    const data = png.subarray(start + 8, end - 4)
    if (crc32(png.subarray(start + 4, end - 4)) !== png.readUInt32BE(end - 4)) {
      throw new Error(`PNG chunk ${type} at byte ${start} fails its CRC check`)
    }
    found.push({ type, data, end })
    start = end
  }
  const header = found[0]
  if (header?.type !== 'IHDR' || header.data.length !== 13) {
    throw new Error('PNG file does not start with a 13-byte IHDR chunk')
  }
  if (found.at(-1)?.type !== 'IEND') {
    throw new Error('PNG file does not end with an IEND chunk')
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

/** Every tEXt, zTXt and iTXt chunk in file order, compressed text inflated. */
export function readPngTexts(png: Buffer): PngText[] {
  return parse(png).chunks.flatMap((chunk): PngText[] => {
    const keywordEnd = chunk.data.indexOf(0)
    const keyword = chunk.data.toString('latin1', 0, keywordEnd)
    switch (chunk.type) {
      case 'tEXt':
        return [{ keyword, text: chunk.data.toString('latin1', keywordEnd + 1) }]
      case 'zTXt':
        // keyword, NUL, compression method, compressed text
        return [{ keyword, text: inflateSync(chunk.data.subarray(keywordEnd + 2)).toString('latin1') }]
      case 'iTXt': {
        // keyword, NUL, compression flag, compression method, language tag, NUL, translated keyword, NUL, text
        const compressed = chunk.data.readUInt8(keywordEnd + 1) === 1
        const languageEnd = chunk.data.indexOf(0, keywordEnd + 3)
        const translatedEnd = chunk.data.indexOf(0, languageEnd + 1)
        const text = chunk.data.subarray(translatedEnd + 1)
        return [{ keyword, text: (compressed ? inflateSync(text) : text).toString('utf8') }]
      }
      default:
        return []
    }
  })
}

/**
 * The PNG with one tEXt chunk per entry inserted right after IHDR, in order.
 * tEXt holds Latin-1, so keywords (1 to 79 characters) and texts are kept to
 * printable ASCII and anything else throws.
 */
export function withTextChunks(png: Buffer, entries: readonly PngText[]): Buffer {
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
