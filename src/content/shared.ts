// Values that every language page states in the same form, derived once from
// the facts module: counts grouped by thousands, model names as code spans,
// and the share card, which is English on every page. Formatting that differs
// by language, such as a year with its era, stays in each language's copy.

import shareCardImage from '../assets/share-en.png'
import { shareCardWords, stats } from '../data/paper'
import { formatCount, formatIdentifier, shareCardByline } from '../lib/format'
import { pngImage } from '../lib/images'

export const benchmarkPairs = formatCount(stats.benchmarkPairs)
export const corpusComparisons = formatCount(stats.corpusComparisons)
export const mostPreciseModel = formatIdentifier(stats.mostPreciseModel)
export const deploymentModel = formatIdentifier(stats.deploymentModel)

const cardWords = shareCardWords()

/** The share card: its image, and the words that each page's text alternative for it gives. */
export const shareCard = {
  image: pngImage(shareCardImage),
  title: cardWords.title,
  /** The author line as the card prints it, an English list on every page. */
  byline: shareCardByline(cardWords.authors),
  arxivId: cardWords.arxivId,
} as const
