import { getImage } from 'astro:assets'
import { figures, type FigureId } from '../data/figures'

/**
 * The address of a figure at the full resolution of its source, as WebP. The
 * page's "Open full size" link and the image in the Markdown version both
 * point to it, so the build writes one file for both.
 */
export async function fullSizeFigure(figure: FigureId): Promise<string> {
  const image = figures[figure].image
  const full = await getImage({ src: image, width: image.width, format: 'webp' })
  return full.src
}
