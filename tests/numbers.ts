// A number token: digits with optional thousands separators and decimals, or a
// decimal without a leading zero (".12"), with an optional minus sign, percent
// sign and superscript exponent ("10⁻³"). A run of digits and dots that
// follows a Latin letter belongs to an identifier and is not a number: the M3
// of BGE-M3, the 3.7 of qwen3.7-plus, the 3309300 of grant 2025YFC3309300. A
// digit run that a letter follows, such as the 2025 of that grant number,
// still counts; a lookahead for letters would cut "260s" down to "26".
const numberToken = /(?<![A-Za-z][\d.]*)[−]?(?:\d+(?:,\d{3})*(?:\.\d+)?|(?<!\d)\.\d+)%?[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*/g

/**
 * The distinct numbers of two or more digits in the text, as written. Single
 * digits are left out; each caller lists the ones it checks inside phrases
 * (SECTION_PHRASES, FIGURE_ALT_PHRASES in tests/paper-literals.ts).
 */
export function multiDigitNumbers(text: string): string[] {
  const tokens = text.match(numberToken) ?? []
  return [...new Set(tokens.filter((token) => token.replace(/\D/g, '').length >= 2))]
}

/**
 * Where each occurrence of the phrase starts in the text. An empty phrase
 * throws: it occurs at every position, and indexOf would never move past the
 * end, so the loop below would not stop.
 */
export function occurrences(text: string, phrase: string): number[] {
  if (phrase === '') {
    throw new Error('An empty phrase occurs everywhere; list a phrase with words in it')
  }
  const starts: number[] = []
  for (let start = text.indexOf(phrase); start !== -1; start = text.indexOf(phrase, start + 1)) {
    starts.push(start)
  }
  return starts
}

/**
 * Every number in the text that lies inside no occurrence of the phrases,
 * each with the words around it, so a failing test shows where it is.
 */
export function numbersOutside(text: string, phrases: readonly string[]): string[] {
  const spans = phrases.flatMap((phrase) => occurrences(text, phrase).map((start) => ({ start, end: start + phrase.length })))
  const outside: string[] = []
  for (const match of text.matchAll(numberToken)) {
    const start = match.index
    const end = start + match[0].length
    if (!spans.some((span) => span.start <= start && end <= span.end)) {
      outside.push(`${match[0]} in “${text.slice(Math.max(0, start - 30), end + 30)}”`)
    }
  }
  return outside
}
