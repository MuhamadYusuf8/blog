/**
 * lib/utils/sanitize.ts
 * HTML sanitisation using sanitize-html — SRS §3.1.3, RULE 3.
 *
 * SECURITY CONTRACT:
 *  - This function MUST be called on every code path that reaches
 *    dangerouslySetInnerHTML={{ __html: ... }}
 *  - Sanitisation runs at render time (NOT at storage time).
 *    Sanitising at storage time is wrong because:
 *      a) Sanitiser configs may change — you would need to re-sanitise all
 *         existing posts in the DB if the policy hardens.
 *      b) The raw HTML is preserved for admin editing in the Tiptap editor.
 *  - This applies to BOTH the public render path AND the Draft Mode path.
 *    Sanitisation is never conditional or skipped.
 *
 * Forbidden tags: script, iframe, object, embed, form
 * Forbidden attributes: onerror, onload, onclick, onmouseover (XSS vectors)
 *
 * Uses sanitize-html (pure JS, no jsdom/canvas dependency) which is fully
 * compatible with Vercel Serverless Functions and Edge Runtime.
 */

import sanitize from 'sanitize-html'

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
    return sanitize(html, {
      // Allow all standard HTML tags used by Tiptap editor output
      allowedTags: sanitize.defaults.allowedTags.concat([
        'img', 'figure', 'figcaption', 'video', 'audio', 'source',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'details', 'summary', 'mark', 'del', 'ins', 'sub', 'sup',
        'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
        'colgroup', 'col', 'caption',
        'span', 'div', 'section', 'article', 'aside', 'header', 'footer', 'nav',
      ]),
      // Explicitly disallow dangerous tagss
      disallowedTagsMode: 'discard',
      allowedAttributes: {
        ...sanitize.defaults.allowedAttributes,
        '*': ['class', 'id', 'style', 'data-*'],
        img: ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
        a: ['href', 'title', 'target', 'rel'],
        video: ['src', 'controls', 'width', 'height', 'poster', 'preload'],
        audio: ['src', 'controls'],
        source: ['src', 'type'],
        td: ['colspan', 'rowspan'],
        th: ['colspan', 'rowspan', 'scope'],
        col: ['span'],
        colgroup: ['span'],
      },
      // Remove script, iframe, object, embed, form entirely
      exclusiveFilter: (frame) => {
        return ['script', 'iframe', 'object', 'embed', 'form'].includes(frame.tag)
      },
      // Allow safe URL schemes only
      allowedSchemes: ['http', 'https', 'mailto', 'tel'],
      allowedSchemesByTag: {
        img: ['http', 'https', 'data'],
      },
      // Strip all event handler attributes (onerror, onload, onclick, etc.)
      transformTags: {
        '*': (tagName: string, attribs: Record<string, string>) => {
          // Remove any on* event handlers
          const cleaned: Record<string, string> = {}
          for (const [key, val] of Object.entries(attribs)) {
            if (!key.startsWith('on')) {
              cleaned[key] = val
            }
          }
          return { tagName, attribs: cleaned }
        },
      },
    })
  } catch (e) {
    console.error('Sanitize HTML error:', e)
    return html
  }
}
