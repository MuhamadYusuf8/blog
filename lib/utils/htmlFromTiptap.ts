/**
 * lib/utils/htmlFromTiptap.ts
 * Generates an HTML string from Tiptap's JSON document representation.
 *
 * When the PostEditor saves a post, it reads editor.getJSON() (a plain
 * JavaScript object) and calls this utility to convert it to the HTML
 * string stored in posts.content_html.
 *
 * The extensions list MUST match the extensions configured in the Tiptap
 * editor in components/admin/PostEditor.tsx, otherwise nodes from those
 * extensions won't be serialised correctly.
 *
 * This utility can run on the server (in a Server Action) or the client.
 * It has no browser-specific dependencies.
 */

import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Youtube from '@tiptap/extension-youtube'
import type { JSONContent } from '@tiptap/core'

/**
 * Converts a Tiptap JSON document to an HTML string.
 *
 * @param json - The JSON output of editor.getJSON()
 * @returns An HTML string suitable for storage in posts.content_html
 *
 * @example
 *   const html = generatePostHtml(editor.getJSON())
 *   // Pass html to createPost / updatePost Server Action
 */
export function generatePostHtml(json: JSONContent): string {
  return generateHTML(json, [
    StarterKit,
    Image,
    Link.configure({ openOnClick: false }),
    Highlight,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Youtube.configure({ nocookie: true }),
  ])
}
