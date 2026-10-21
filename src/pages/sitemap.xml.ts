import type { APIRoute } from 'astro'
import { absoluteUrl, pageLanguages, pages, type IsoDate } from '../data/paper'
import { languageAlternates } from '../lib/alternates'

function escapeXml(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

/** The date as lastmod takes it; anything that is not a real YYYY-MM-DD date stops the build. */
function lastmod(date: IsoDate): string {
  const parsed = new Date(`${date}T00:00:00Z`)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error(`Page update date "${date}" is not a calendar date written YYYY-MM-DD`)
  }
  return date
}

// One <url> per language page. Each entry lists every language version
// (https://developers.google.com/search/docs/specialty/international/localized-versions#sitemap).
export const GET: APIRoute = () => {
  const alternates = languageAlternates().map(
    (alternate) => `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${escapeXml(alternate.href)}"/>`,
  )
  const entries = pageLanguages.map((lang) =>
    ['  <url>', `    <loc>${escapeXml(absoluteUrl(pages[lang].path))}</loc>`, `    <lastmod>${lastmod(pages[lang].updated)}</lastmod>`]
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
