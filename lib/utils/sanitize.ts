/**
 * lib/utils/sanitize.ts
 * DOMPurify wrapper for server-side HTML sanitisation — SRS §3.1.3, RULE 3.
 *
 * SECURITY CONTRACT:
 *  - This function MUST be called on every code path that reaches
 *    dangerouslySetInnerHTML={{ __html: ... }}
 *  - Sanitisation runs at render time (NOT at storage time).
 *    Sanitising at storage time is wrong because:
 *      a) DOMPurify configs may change — you would need to re-sanitise all
 *         existing posts in the DB if the policy hardens.
 *      b) The raw HTML is preserved for admin editing in the Tiptap editor.
 *  - This applies to BOTH the public render path AND the Draft Mode path.
 *    Sanitisation is never conditional or skipped.
 *
 * Forbidden tags: script, iframe, object, embed, form
 * Forbidden attributes: onerror, onload, onclick, onmouseover (XSS vectors)
 *
 * isomorphic-dompurify works in both Node.js (server) and browser contexts,
 * making it safe for use in Next.js Server Components.
 */

import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitises an HTML string, removing all XSS vectors while preserving
 * legitimate rich text formatting from the Tiptap editor.
 *
 * @param html - The raw HTML string from the posts.content_html column
 * @returns A sanitised HTML string safe for use with dangerouslySetInnerHTML
 */
export function sanitizeHtml(html: string): string {
  if (!html) return ''
  try {
    return DOMPurify.sanitize(html, {
      // Use the full HTML profile (allows all standard HTML elements and attrs)
      USE_PROFILES: { html: true },
      // Explicitly forbid tags that could execute scripts or load external content
      FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
      // Explicitly forbid event handler attributes (inline JavaScript vectors)
      FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    })
  } catch (e) {
    console.error('Sanitize HTML error:', e)
    return html
  }
}
