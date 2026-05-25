/**
 * components/admin/PostEditor.tsx — Full Post Editor (Pearl White Edition)
 * Semua logika (Tiptap, auto-save, Server Actions) identik.
 * Hanya visual dirombak ke pearl white glassmorphism.
 */

'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import Youtube from '@tiptap/extension-youtube'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { EditorToolbar } from '@/components/admin/EditorToolbar'
import ImageUploader from '@/components/admin/ImageUploader'
import { slugify } from '@/lib/utils/slugify'
import { generatePostHtml } from '@/lib/utils/htmlFromTiptap'
import { createPost, updatePost } from '@/app/admin/posts/actions'
import type { Post, PostFormData, PostStatus } from '@/lib/supabase/types'
import type { JSONContent } from '@tiptap/core'

// ─── Shared pearl panel style ───────────────────────────────────────────────
const panel: React.CSSProperties = {
  background: 'rgba(255,255,255,0.72)',
  border: '1px solid rgba(226,232,240,0.80)',
  boxShadow: '0 1px 8px -3px rgba(15,23,42,0.06)',
  borderRadius: '14px',
  padding: '16px',
}

// ─── Label ──────────────────────────────────────────────────────────────────
function FieldLabel({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[10px] font-semibold uppercase tracking-[0.12em] mb-[6px]"
      style={{ color: '#94a3b8' }}
    >
      {children}
    </label>
  )
}

// ─── Text input base style ───────────────────────────────────────────────────
const inputCls =
  'w-full bg-slate-50/50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-slate-100/50 rounded-lg px-3.5 py-2.5 text-[13px] transition-all duration-200'

type PostEditorProps = {
  mode: 'create' | 'edit'
  post?: Post
}

export function PostEditor({ mode, post }: PostEditorProps) {
  const router = useRouter()
  const { showToast } = useToast()

  const [title, setTitle]                     = useState(post?.title ?? '')
  const [slug, setSlug]                       = useState(post?.slug ?? '')
  const [excerpt, setExcerpt]                 = useState(post?.excerpt ?? '')
  const [category, setCategory]               = useState(post?.category ?? '')
  const [tagsInput, setTagsInput]             = useState(post?.tags?.join(', ') ?? '')
  const [coverImageUrl, setCoverImageUrl]     = useState(post?.cover_image_url ?? '')
  const [metaTitle, setMetaTitle]             = useState(post?.meta_title ?? '')
  const [metaDescription, setMetaDescription] = useState(post?.meta_description ?? '')
  const [status, setStatus]                   = useState<PostStatus>(post?.status ?? 'draft')
  const [isSaving, setIsSaving]               = useState(false)
  const [lastSaved, setLastSaved]             = useState<Date | null>(null)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const autoSaveKey = `post-draft-${post?.id ?? 'new'}`

  // ── Tiptap ────────────────────────────────────────────────────────────────
  const editor = useEditor({
    extensions: [
      StarterKit,
      TiptapImage,
      TiptapLink.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Mulai menulis postingan Anda...' }),
      CharacterCount,
      Youtube.configure({ nocookie: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
    ],
    content: post?.content_html ?? '<p></p>',
    editorProps: {
      attributes: {
        // prose-slate untuk light mode, tanpa prose-invert
        class:
          'prose prose-slate max-w-none focus:outline-none min-h-[320px] px-4 py-3 text-slate-700',
      },
    },
  })

  // Auto-generate slug
  useEffect(() => {
    if (!slugManuallyEdited && title) setSlug(slugify(title))
  }, [title, slugManuallyEdited])

  // Auto-save every 30 seconds
  const autoSaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  useEffect(() => {
    autoSaveTimerRef.current = setInterval(() => {
      if (editor) {
        const draftData = {
          title, slug, excerpt, category, tagsInput,
          coverImageUrl, metaTitle, metaDescription, status,
          editorJson: editor.getJSON(),
          savedAt: new Date().toISOString(),
        }
        localStorage.setItem(autoSaveKey, JSON.stringify(draftData))
        setLastSaved(new Date())
      }
    }, 30000)
    return () => { if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current) }
  }, [editor, title, slug, excerpt, category, tagsInput, coverImageUrl, metaTitle, metaDescription, status, autoSaveKey])

  // Restore from localStorage (create mode)
  useEffect(() => {
    if (mode === 'create' && !post) {
      try {
        const saved = localStorage.getItem(autoSaveKey)
        if (saved) {
          const data = JSON.parse(saved)
          setTitle(data.title ?? '')
          setSlug(data.slug ?? '')
          setExcerpt(data.excerpt ?? '')
          setCategory(data.category ?? '')
          setTagsInput(data.tagsInput ?? '')
          setCoverImageUrl(data.coverImageUrl ?? '')
          setMetaTitle(data.metaTitle ?? '')
          setMetaDescription(data.metaDescription ?? '')
          setStatus(data.status ?? 'draft')
          if (data.editorJson && editor) editor.commands.setContent(data.editorJson)
          setLastSaved(new Date(data.savedAt))
        }
      } catch { /* ignore */ }
    }
  }, [mode, post, autoSaveKey, editor])

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!editor) return
    setIsSaving(true)

    try {
      const editorJson: JSONContent = editor.getJSON()
      const contentHtml = generatePostHtml(editorJson)
      const tags = tagsInput.split(',').map((t) => t.trim()).filter((t) => t.length > 0)

      const formData: PostFormData = {
        title, slug, excerpt, content_html: contentHtml,
        cover_image_url: coverImageUrl, category, tags, status,
        meta_title: metaTitle, meta_description: metaDescription,
      }

      const result = mode === 'create'
        ? await createPost(formData)
        : await updatePost(post!.id, formData)

      if (result.success) {
        showToast(
          mode === 'create' ? 'Postingan berhasil dibuat!' : 'Postingan berhasil diperbarui!',
          'success'
        )
        if (autoSaveTimerRef.current) {
          clearInterval(autoSaveTimerRef.current)
        }
        localStorage.removeItem(autoSaveKey)
        if (mode === 'create' && 'id' in result && result.id) {
          router.push(`/admin/posts/${result.id}/edit`)
        }
        router.refresh()
      } else {
        showToast(result.error ?? 'Gagal menyimpan postingan.', 'error')
      }
    } catch (err: any) {
      console.error('Save error:', err)
      showToast(err.message || 'Terjadi kesalahan tidak terduga saat menyimpan.', 'error')
    } finally {
      setIsSaving(false)
    }
  }, [editor, title, slug, excerpt, coverImageUrl, category, tagsInput, status, metaTitle, metaDescription, mode, post, autoSaveKey, showToast, router])

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-5">

      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          {/* Ornament label */}
          <div className="flex items-center gap-2 mb-[10px]">
            <div
              className="w-[26px] h-[26px] rounded-[8px] flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(241,245,249,0.90)', border: '1px solid rgba(226,232,240,0.80)' }}
              aria-hidden="true"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#475569" strokeWidth="2.2">
                <path d="M2 14l3-1 9-9-2-2-9 9-1 3z" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {mode === 'create' ? 'Buat Konten Baru' : 'Edit Konten'}
            </span>
          </div>

          <h1
            className="text-[22px] md:text-[26px] font-bold text-slate-900 tracking-[-0.4px] leading-[1.2]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {mode === 'create' ? 'Post Baru' : 'Edit Post'}
          </h1>

          {/* Auto-save timestamp & Clear Draft */}
          {lastSaved && (
            <div className="flex items-center gap-3 mt-1">
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="8" cy="8" r="6.5" />
                  <path d="M8 5v3.5l2 1.5" strokeLinecap="round" />
                </svg>
                Auto-saved {lastSaved.toLocaleTimeString('id-ID')}
              </p>
              {mode === 'create' && (
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(autoSaveKey)
                    window.location.reload()
                  }}
                  className="text-[10px] text-red-400 hover:text-red-500 underline transition-colors"
                >
                  Hapus Draft Ini
                </button>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={() => router.push('/admin/posts')}
            disabled={isSaving}
            className="px-4 py-2 rounded-[10px] text-[12px] font-medium text-slate-500 hover:text-slate-700 transition-all disabled:opacity-50"
            style={{ border: '1px solid rgba(226,232,240,0.80)', background: 'rgba(255,255,255,0.60)' }}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="inline-flex items-center gap-[7px] px-4 py-2 rounded-[10px] text-white text-[12px] font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #0f172a, #334155)',
              boxShadow: '0 2px 12px -3px rgba(15,23,42,0.25)',
            }}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin" width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M8 2a6 6 0 100 12A6 6 0 008 2z" opacity="0.3" />
                  <path d="M8 2a6 6 0 016 6" strokeLinecap="round" />
                </svg>
                Menyimpan...
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.2">
                  <path d="M3 8l4 4 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Simpan
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Main editor column ──────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-4">

          {/* Title */}
          <div style={panel}>
            <FieldLabel htmlFor="post-title">Judul</FieldLabel>
            <input
              id="post-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul postingan..."
              className="w-full bg-transparent text-slate-900 text-[20px] font-bold placeholder-slate-400 focus:outline-none"
              style={{ fontFamily: 'Georgia, serif' }}
            />
          </div>

          {/* Slug */}
          <div style={panel}>
            <FieldLabel htmlFor="post-slug">Slug</FieldLabel>
            <div className="flex items-center gap-2">
              <span className="text-[12px] text-slate-400 flex-shrink-0">/posts/</span>
              <input
                id="post-slug"
                type="text"
                value={slug}
                onChange={(e) => { setSlug(e.target.value); setSlugManuallyEdited(true) }}
                className={inputCls}
              />
            </div>
          </div>

          {/* Tiptap Editor */}
          <div
            className="overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.72)',
              border: '1px solid rgba(226,232,240,0.80)',
              boxShadow: '0 1px 8px -3px rgba(15,23,42,0.06)',
              borderRadius: '14px',
            }}
          >
            {/* Toolbar — EditorToolbar pakai style-nya sendiri; kita wrap dengan bg putih */}
            <div style={{ borderBottom: '1px solid rgba(226,232,240,0.70)' }}>
              <EditorToolbar editor={editor} />
            </div>
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* ── Sidebar column ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">

          {/* Status */}
          <div style={panel}>
            <FieldLabel>Status</FieldLabel>
            <div className="flex gap-2">
              {(['draft', 'published'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className="flex-1 px-3 py-[9px] rounded-[9px] text-[12px] font-medium transition-all"
                  style={
                    status === s
                      ? s === 'published'
                        ? {
                            background: 'rgba(52,211,153,0.10)',
                            border: '1px solid rgba(52,211,153,0.25)',
                            color: '#059669',
                          }
                        : {
                            background: 'rgba(251,191,36,0.10)',
                            border: '1px solid rgba(251,191,36,0.25)',
                            color: '#d97706',
                          }
                      : {
                          background: 'rgba(241,245,249,0.60)',
                          border: '1px solid rgba(226,232,240,0.70)',
                          color: '#94a3b8',
                        }
                  }
                >
                  {s === 'draft' ? '📋 Draft' : '🚀 Published'}
                </button>
              ))}
            </div>
          </div>

          {/* Cover Image */}
          <div style={panel}>
            <FieldLabel>Cover Image</FieldLabel>
            {coverImageUrl && (
              <div className="mb-3 rounded-[10px] overflow-hidden aspect-video relative">
                <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImageUrl('')}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 text-slate-600 text-xs hover:bg-white transition-colors flex items-center justify-center border border-slate-200"
                  aria-label="Remove cover image"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.10)' }}
                >
                  ✕
                </button>
              </div>
            )}
            <ImageUploader onUpload={(url: string) => setCoverImageUrl(url)} />
          </div>

          {/* Excerpt */}
          <div style={panel}>
            <FieldLabel htmlFor="post-excerpt">Excerpt</FieldLabel>
            <textarea
              id="post-excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="Ringkasan singkat..."
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Category */}
          <div style={panel}>
            <FieldLabel htmlFor="post-category">Category</FieldLabel>
            <input
              id="post-category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Teknologi"
              className={inputCls}
            />
          </div>

          {/* Tags */}
          <div style={panel}>
            <FieldLabel htmlFor="post-tags">Tags</FieldLabel>
            <input
              id="post-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="tag1, tag2, tag3"
              className={inputCls}
            />
            <p className="text-[10px] text-slate-400 mt-1.5">Pisahkan dengan koma</p>
          </div>

          {/* SEO */}
          <div style={panel}>
            <FieldLabel>SEO</FieldLabel>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="meta-title"
                  className="block text-[10px] text-slate-400 mb-1"
                >
                  Meta Title
                </label>
                <input
                  id="meta-title"
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder={title || 'Meta title'}
                  className={inputCls}
                />
              </div>

              {/* Divider */}
              <div className="h-px bg-slate-100" />

              <div>
                <label
                  htmlFor="meta-desc"
                  className="block text-[10px] text-slate-400 mb-1"
                >
                  Meta Description
                </label>
                <textarea
                  id="meta-desc"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={2}
                  placeholder="SEO description..."
                  className={`${inputCls} resize-none`}
                />
                {/* Character count hint */}
                <p
                  className="text-[10px] mt-1"
                  style={{ color: metaDescription.length > 160 ? '#dc2626' : '#94a3b8' }}
                >
                  {metaDescription.length}/160 karakter
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default PostEditor