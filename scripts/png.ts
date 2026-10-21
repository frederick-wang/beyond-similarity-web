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

function chunks(png: Buffer): Chunk[] {
  if (!isPng(png)) {
    throw new Error('Not a PNG file')
  }
  const found: Chunk[] = []
  // Each chunk is a 4-byte length, a 4-byte type, the data and a 4-byte CRC.
  for (let start = signature.length; start + 8 <= png.length; ) {
    const length = png.readUInt32BE(start)
    const end = start + 12 + length
    found.push({ type: png.toString('latin1', start + 4, start + 8), data: png.subarray(start + 8, start + 8 + length), end })
    start = end
  }
  return found
}

function headerChunk(all: readonly Chunk[]): Chunk {
  const header = all[0]
  if (header?.type !== 'IHDR') {
    throw new Error('PNG file does not start with an IHDR chunk')
  }
  return header
}

export function readPngHeader(png: Buffer): PngHeader {
  const all = chunks(png)
  const header = headerChunk(all)
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
  return chunks(png).flatMap((chunk): PngText[] => {
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
  const afterHeader = headerChunk(chunks(png)).end
  return Buffer.concat([png.subarray(0, afterHeader), ...inserted, png.subarray(afterHeader)])
}
