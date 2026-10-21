/**
 * Escapes text for HTML or XML, in element content and in quoted attribute
 * values alike. It has no imports, so the Node scripts in scripts/ can import
 * it as well as the site.
 */
export function escapeMarkupText(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}
