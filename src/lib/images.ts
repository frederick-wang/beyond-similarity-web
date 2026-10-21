import type { ImageMetadata } from 'astro'

/**
 * An image whose format is PNG. The type is structural, and its literal
 * format field carries the constraint, so unlike IsoDate it needs no brand.
 * The share image is obtained through pngImage(), which checks the imported
 * file's format at build time.
 */
export interface PngImage {
  readonly src: string
  readonly width: number
  readonly height: number
  readonly format: 'png'
}

/**
 * The imported image's metadata, checked to be a PNG: the head declares
 * og:image:type from the format, and the share card's words travel in a PNG
 * text chunk. Any other format stops the build.
 */
export function pngImage(image: ImageMetadata): PngImage {
  const format = image.format
  if (format !== 'png') {
    throw new Error(`${image.src} is ${format}, not PNG`)
  }
  return { src: image.src, width: image.width, height: image.height, format }
}
