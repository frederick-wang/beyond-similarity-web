import type { ImageMetadata } from 'astro'
import type { PngImageMetadata } from '../content/types'

/**
 * Narrows an imported image to a PNG. The share card has to be one: the head
 * declares og:image:type from its format, and its words travel in a PNG text
 * chunk. Any other format stops the build.
 */
export function assertPng(image: ImageMetadata): asserts image is PngImageMetadata {
  if (image.format !== 'png') {
    throw new Error(`${image.src} is ${image.format}, not PNG`)
  }
}
