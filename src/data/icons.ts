// The favicon set, all drawn from the scroll seal. The head links to these
// files and scripts/make-site-images.ts renders the PNGs, so both read the
// paths and sizes from here. The SVG is the traced seal that
// scripts/trace-seal.py writes.
// Node runs this module unbundled for scripts/make-site-images.ts; a CI step imports the image scripts to check it.

export const svgIcon = '/favicon.svg'

/**
 * PNG favicons in public/, by edge length in pixels: 16 and 32 for browser
 * tabs that do not take SVG, 192 for Android and for Google Search, which
 * asks for 48 px or more.
 */
export const pngIcons = [
  { path: '/favicon-16.png', size: 16 },
  { path: '/favicon-32.png', size: 32 },
  { path: '/favicon-192.png', size: 192 },
] as const

/** The iOS home-screen icon, opaque because iOS fills transparent pixels with black. */
export const appleTouchIcon = { path: '/apple-touch-icon.png', size: 180 } as const
