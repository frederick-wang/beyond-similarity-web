import type { ImageMetadata } from 'astro'

/** An imported image known to be a PNG. Only pngImage() makes one. */
export interface PngImage {
  readonly src: string
  readonly width: number
  readonly height: number
  readonly format: 'png'
}

/**
 * The image, checked to be a PNG. The share card has to be one: the head
 * declares og:image:type from its format, and its words travel in a PNG text
 * chunk. Any other format stops the build.
 */
export function pngImage(image: ImageMetadata): PngImage {
  const format = image.format
  if (format !== 'png') {
    throw new Error(`${image.src} is ${format}, not PNG`)
  }
  return { src: image.src, width: image.width, height: image.height, format }
}
