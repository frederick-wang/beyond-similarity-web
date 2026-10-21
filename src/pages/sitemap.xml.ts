import type { APIRoute } from 'astro'
import { absoluteUrl, pageLanguages, pages } from '../data/paper'
import { languageAlternates } from '../lib/alternates'
import { escapeMarkupText } from '../lib/escape'

// One <url> per language page. Each entry lists every language version
// (https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap).
export const GET: APIRoute = () => {
  const alternates = languageAlternates().map(
    (alternate) => `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeMarkupText(alternate.href)}"/>`,
  )
  const entries = pageLanguages.map((lang) =>
    ['  <url>', `    <loc>${escapeMarkupText(absoluteUrl(pages[lang].path))}</loc>`, `    <lastmod>${pages[lang].updated}</lastmod>`]
      .concat(alternates, ['  </url>'])
      .join('\n'),
  )
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ]
    .concat(entries, ['</urlset>', ''])
    .join('\n')
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
