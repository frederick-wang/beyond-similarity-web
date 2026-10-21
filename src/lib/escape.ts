// Node runs this module unbundled for scripts/make-site-images.ts; a CI step imports the image scripts to check it.

/** Escapes text for HTML or XML, in element content and in quoted attribute values alike. */
export function escapeMarkupText(text: string): string {
  return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}
