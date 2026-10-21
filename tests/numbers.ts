// A number token: digits with optional thousands separators and decimals, or a
// decimal without a leading zero (".12"), with an optional minus sign, percent
// sign and superscript exponent ("10⁻³"). Digits that follow a Latin letter
// belong to an identifier such as BGE-M3 and are not numbers.
const numberToken = /(?<![A-Za-z])[−]?(?:\d+(?:,\d{3})*(?:\.\d+)?|(?<!\d)\.\d+)%?[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*/g

/**
 * The distinct numbers of two or more digits in the text, as written. Single
 * digits are left out: SECTION_PHRASES in tests/paper-literals.ts lists each
 * of them inside a phrase.
 */
export function multiDigitNumbers(text: string): string[] {
  const tokens = text.match(numberToken) ?? []
  return [...new Set(tokens.filter((token) => token.replace(/\D/g, '').length >= 2))]
}

/** Where each occurrence of the phrase starts in the text. */
export function occurrences(text: string, phrase: string): number[] {
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
