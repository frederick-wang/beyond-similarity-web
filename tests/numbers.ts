// A number token: digits with optional thousands separators and decimals, or a
// decimal without a leading zero (".12"), with an optional minus sign, percent
// sign and superscript exponent ("10⁻³").
const numberToken = /[−]?(?:\d+(?:,\d{3})*(?:\.\d+)?|(?<!\d)\.\d+)%?[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]*/g

/**
 * The distinct numbers of two or more digits in the text, as written. Single
 * digits are left out: they number figures, tables, questions and PDF pages,
 * which other tests check.
 */
export function multiDigitNumbers(text: string): string[] {
  const tokens = text.match(numberToken) ?? []
  return [...new Set(tokens.filter((token) => token.replace(/\D/g, '').length >= 2))]
}
