/**
 * lib/utils/slugify.ts
 * Converts a post title into a URL-safe slug.
 *
 * Rules:
 *  - Lowercase everything
 *  - Normalise Unicode (NFD) then strip combining diacritical marks
 *  - Replace spaces and non-alphanumeric characters with hyphens
 *  - Collapse consecutive hyphens into one
 *  - Strip leading/trailing hyphens
 *
 * Examples:
 *   slugify('Hello World')          → 'hello-world'
 *   slugify('Apa itu Next.js?')     → 'apa-itu-next-js'
 *   slugify('  --Trim me--  ')      → 'trim-me'
 *   slugify('Café au lait!')        → 'cafe-au-lait'
 */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    // Normalise to NFD so diacritics become separate characters
    .normalize('NFD')
    // Strip combining diacritical marks (accents, umlauts, etc.)
    .replace(/[\u0300-\u036f]/g, '')
    // Replace any character that is NOT alphanumeric or hyphen with a hyphen
    .replace(/[^a-z0-9]+/g, '-')
    // Collapse multiple consecutive hyphens into a single one
    .replace(/-{2,}/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-+|-+$/g, '')
}
