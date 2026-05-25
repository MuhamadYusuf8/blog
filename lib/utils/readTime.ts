/**
 * lib/utils/readTime.ts
 * Estimates reading time for a post given its HTML content.
 *
 * Method:
 *  1. Strip all HTML tags to get plain text
 *  2. Count words by splitting on whitespace
 *  3. Divide by an average adult reading speed (200 wpm — appropriate for
 *     Indonesian-language content; English averages ~238 wpm)
 *  4. Return at least 1 minute
 *
 * Returns: number of minutes (integer, minimum 1)
 *
 * Example:
 *   estimateReadTime('<p>Hello world</p>')  → 1  (short content floors to 1)
 *   estimateReadTime(longArticleHtml)       → 7  (1400 words ÷ 200 wpm)
 */

const WORDS_PER_MINUTE = 200

export function estimateReadTime(html: string): number {
  // Strip HTML tags to get raw text
  const plainText = html.replace(/<[^>]*>/g, ' ')

  // Count words: split on any whitespace sequence, filter empty strings
  const wordCount = plainText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length

  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE)

  // Always return at least 1 minute for any non-empty content
  return Math.max(1, minutes)
}
