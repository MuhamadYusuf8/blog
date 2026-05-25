/**
 * components/admin/EditorToolbar.tsx — Tiptap Rich Text Toolbar
 * Pearl White Edition.
 *
 * Toolbar buttons for all configured extensions:
 * Bold, Italic, Strikethrough, H2, H3, Bullet list, Ordered list,
 * Blockquote, Code block, Link, Image, YouTube, Text align, Highlight,
 * Character count
 */

'use client'

import React, { useCallback } from 'react'
import type { Editor } from '@tiptap/react'

type EditorToolbarProps = {
  editor: Editor | null
}

function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        min-w-[28px] h-7 px-1.5 flex items-center justify-center rounded-md text-[12.5px] transition-all duration-150
        disabled:opacity-30 disabled:cursor-not-allowed
        ${isActive
          ? 'bg-slate-800 text-white shadow-sm'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/60'
        }
      `}
      aria-pressed={isActive}
      aria-label={title}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-4 bg-slate-200 mx-1 self-center" aria-hidden="true" />
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const addLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href ?? ''
    const url = window.prompt('Enter URL:', previousUrl)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Enter image URL (from Media Library):')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addYoutube = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Enter YouTube URL:')
    if (url) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run()
    }
  }, [editor])

  if (!editor) return null

  const charCount = editor.storage.characterCount?.characters?.() ?? 0
  const wordCount = editor.storage.characterCount?.words?.() ?? 0

  return (
    <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-slate-50/50 rounded-t-[14px]">
      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="Bold"
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="Italic"
      >
        <span className="italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive('strike')}
        title="Strikethrough"
      >
        <span className="line-through">S</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive('highlight')}
        title="Highlight"
      >
        <span className="bg-yellow-200 text-slate-800 px-1 rounded text-[11px] font-bold">H</span>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="Heading 2"
      >
        <span className="font-bold">H2</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="Heading 3"
      >
        <span className="font-bold">H3</span>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="Bullet List"
      >
        <span className="font-bold tracking-tighter">• List</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="Ordered List"
      >
        <span className="font-bold tracking-tighter">1. List</span>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Block elements */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        title="Blockquote"
      >
        <span className="font-serif italic font-bold">❝</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        isActive={editor.isActive('codeBlock')}
        title="Code Block"
      >
        <span className="font-mono font-bold tracking-tighter">{'</>'}</span>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Text Align */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="Align Left"
      >
        <span className="font-bold tracking-tighter">≡←</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="Align Center"
      >
        <span className="font-bold tracking-tighter">≡↔</span>
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="Align Right"
      >
        <span className="font-bold tracking-tighter">→≡</span>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Media & Link */}
      <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Insert Link">
        🔗
      </ToolbarButton>
      <ToolbarButton onClick={addImage} title="Insert Image">
        🖼️
      </ToolbarButton>
      <ToolbarButton onClick={addYoutube} title="Embed YouTube">
        ▶️
      </ToolbarButton>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Character count */}
      <span className="text-slate-400 text-[10.5px] px-2 tabular-nums font-medium" aria-label={`${charCount} karakter, ${wordCount} kata`}>
        {charCount} chars · {wordCount} words
      </span>
    </div>
  )
}

export default EditorToolbar
