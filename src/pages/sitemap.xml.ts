import type { APIRoute } from 'astro'
import { absoluteUrl, pageLanguages, pages } from '../data/paper'
import { languageAlternates } from '../lib/alternates'
import { escapeMarkupText } from '../lib/escape'

// The sitemap schema admits elements of another namespace, such as the
// xhtml:link hreflang entries, only where a schema declares them (a strict
// wildcard), so xsi:schemaLocation names XHTML 1.0 Strict, which declares link
// with rel, hreflang and href, beside the sitemap schema.
const urlset = [
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  ' xmlns:xhtml="http://www.w3.org/1999/xhtml"',
  ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
  ' xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd',
  ' http://www.w3.org/1999/xhtml http://www.w3.org/2002/08/xhtml/xhtml1-strict.xsd">',
].join('')

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
  const xml = ['<?xml version="1.0" encoding="UTF-8"?>', urlset].concat(entries, ['</urlset>', '']).join('\n')
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
