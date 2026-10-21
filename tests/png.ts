// Reads what a test needs from a PNG file's header, so image files can be
// checked as served without an image library.

export interface PngHeader {
  readonly width: number
  readonly height: number
  /** True when pixels can be transparent: an alpha channel, or a tRNS chunk before the image data. */
  readonly transparency: boolean
}

const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

export function readPngHeader(file: Buffer): PngHeader {
  if (!file.subarray(0, 8).equals(signature) || file.toString('latin1', 12, 16) !== 'IHDR') {
    throw new Error('Not a PNG file')
  }
  const colourType = file.readUInt8(25)
  return {
    width: file.readUInt32BE(16),
    height: file.readUInt32BE(20),
    transparency: colourType === 4 || colourType === 6 || chunkTypesBeforeImageData(file).includes('tRNS'),
  }
}

function chunkTypesBeforeImageData(file: Buffer): string[] {
  const types: string[] = []
  // Each chunk is a 4-byte length, a 4-byte type, the data and a 4-byte CRC.
  for (let offset = 8; offset + 8 <= file.length; offset += 12 + file.readUInt32BE(offset)) {
    const type = file.toString('latin1', offset + 4, offset + 8)
    if (type === 'IDAT') {
      return types
    }
    types.push(type)
  }
  throw new Error('PNG file has no image data')
}
