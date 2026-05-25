/**
 * components/admin/PostsTable.tsx — Posts Management Table (Pearl White Edition)
 * Semua logika (tab, actions, modal, toast) identik dengan versi dark.
 * Hanya class/style visual dirombak ke pearl white glassmorphism.
 */

'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/Toast'
import { Badge } from '@/components/ui/Badge'
import { ConfirmModal } from '@/components/admin/ConfirmModal'
import { softDeletePost, restorePost, togglePublishStatus } from '@/app/admin/posts/actions'
import type { PostStatus } from '@/lib/supabase/types'

type PostRow = {
  id: string
  title: string
  slug: string
  status: PostStatus
  category: string | null
  view_count: number
  published_at: string | null
  created_at: string
  deleted_at: string | null
}

type PostsTableProps = {
  activePosts: PostRow[]
  trashedPosts: PostRow[]
}

export function PostsTable({ activePosts, trashedPosts }: PostsTableProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()

  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active')
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string
    title: string
    action: 'trash' | 'restore'
  } | null>(null)

  function handleAction(id: string, title: string, action: 'trash' | 'restore') {
    setConfirmTarget({ id, title, action })
  }

  function handleConfirm() {
    if (!confirmTarget) return
    startTransition(async () => {
      const result =
        confirmTarget.action === 'trash'
          ? await softDeletePost(confirmTarget.id)
          : await restorePost(confirmTarget.id)

      if (result.success) {
        showToast(
          confirmTarget.action === 'trash'
            ? 'Postingan dipindahkan ke sampah.'
            : 'Postingan berhasil dipulihkan.',
          'success'
        )
        router.refresh()
      } else {
        showToast(result.error ?? 'Terjadi kesalahan.', 'error')
      }
      setConfirmTarget(null)
    })
  }

  function handleTogglePublish(id: string, currentStatus: PostStatus) {
    startTransition(async () => {
      const result = await togglePublishStatus(id, currentStatus)
      if (result.success) {
        showToast(
          currentStatus === 'published'
            ? 'Postingan diubah ke draft.'
            : 'Postingan berhasil dipublikasikan!',
          'success'
        )
        router.refresh()
      } else {
        showToast(result.error ?? 'Terjadi kesalahan.', 'error')
      }
    })
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—'
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  const posts = activeTab === 'active' ? activePosts : trashedPosts

  return (
    <>
      {/* ── Tabs ─────────────────────────────────────────────────────── */}
      <div
        className="flex gap-1 p-1 rounded-[12px] w-fit"
        style={{
          background: 'rgba(241,245,249,0.80)',
          border: '1px solid rgba(226,232,240,0.80)',
        }}
      >
        {(
          [
            ['active', `Aktif (${activePosts.length})`],
            ['trash', `Sampah (${trashedPosts.length})`],
          ] as const
        ).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className="px-4 py-[7px] rounded-[9px] text-[12px] font-medium transition-all duration-150"
            style={
              activeTab === tab
                ? {
                    background: 'rgba(255,255,255,0.90)',
                    border: '1px solid rgba(226,232,240,0.80)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    color: '#0f172a',
                  }
                : {
                    background: 'transparent',
                    border: '1px solid transparent',
                    color: '#94a3b8',
                  }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Table panel ──────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.72)',
          border: '1px solid rgba(226,232,240,0.80)',
          boxShadow: '0 1px 8px -3px rgba(15,23,42,0.06)',
        }}
      >
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-3xl mb-3" aria-hidden="true">
              {activeTab === 'active' ? '📭' : '🗑️'}
            </p>
            <p className="text-[13px] text-slate-400">
              {activeTab === 'active'
                ? 'Belum ada postingan. Mulai menulis!'
                : 'Sampah kosong.'}
            </p>
            {activeTab === 'active' && (
              <a
                href="/admin/posts/new"
                className="inline-block mt-3 text-[12px] text-slate-600 hover:text-slate-800 transition-colors"
              >
                Buat post pertamamu →
              </a>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* Table head */}
              <thead>
                <tr
                  style={{ borderBottom: '1px solid rgba(226,232,240,0.70)' }}
                >
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                    Judul
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 hidden md:table-cell">
                    Kategori
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 hidden md:table-cell">
                    Views
                  </th>
                  <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400 hidden lg:table-cell">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                    Aksi
                  </th>
                </tr>
              </thead>

              {/* Table body */}
              <tbody>
                {posts.map((post, idx) => (
                  <tr
                    key={post.id}
                    className="group transition-colors hover:bg-slate-50/60"
                    style={
                      idx < posts.length - 1
                        ? { borderBottom: '1px solid rgba(226,232,240,0.50)' }
                        : {}
                    }
                  >
                    {/* Title */}
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-medium text-slate-700 truncate max-w-[240px]">
                        {post.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-[2px]">
                        /posts/{post.slug}
                      </p>
                    </td>

                    {/* Status badge */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span
                        className="inline-block text-[10px] font-semibold px-[7px] py-[2px] rounded-[6px]"
                        style={
                          post.status === 'published'
                            ? {
                                background: 'rgba(52,211,153,0.10)',
                                border: '1px solid rgba(52,211,153,0.20)',
                                color: '#059669',
                              }
                            : {
                                background: 'rgba(251,191,36,0.10)',
                                border: '1px solid rgba(251,191,36,0.20)',
                                color: '#d97706',
                              }
                        }
                      >
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 hidden md:table-cell text-[12px] text-slate-400">
                      {post.category ?? '—'}
                    </td>

                    {/* Views */}
                    <td className="px-4 py-3 hidden md:table-cell text-[12px] text-slate-400">
                      {post.view_count.toLocaleString('id-ID')}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 hidden lg:table-cell text-[11px] text-slate-400">
                      {formatDate(
                        activeTab === 'trash'
                          ? post.deleted_at
                          : post.published_at ?? post.created_at
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        {activeTab === 'active' ? (
                          <>
                            {/* Edit */}
                            <Link
                              href={`/admin/posts/${post.id}/edit`}
                              className="px-[8px] py-[3px] rounded-[6px] text-[11px] font-medium text-slate-500 hover:text-slate-800 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-all"
                            >
                              Edit
                            </Link>

                            {/* Toggle publish */}
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(post.id, post.status)}
                              disabled={isPending}
                              className="px-[8px] py-[3px] rounded-[6px] text-[11px] font-medium border transition-all disabled:opacity-50"
                              style={
                                post.status === 'published'
                                  ? {
                                      color: '#d97706',
                                      border: '1px solid rgba(251,191,36,0.25)',
                                      background: 'rgba(251,191,36,0.06)',
                                    }
                                  : {
                                      color: '#059669',
                                      border: '1px solid rgba(52,211,153,0.25)',
                                      background: 'rgba(52,211,153,0.06)',
                                    }
                              }
                            >
                              {post.status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>

                            {/* Preview draft */}
                            {post.status === 'draft' && (
                              <a
                                href={`/api/preview?secret=${encodeURIComponent(
                                  process.env.NEXT_PUBLIC_DRAFT_PREVIEW_SECRET ?? ''
                                )}&slug=${encodeURIComponent(post.slug)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-[8px] py-[3px] rounded-[6px] text-[11px] font-medium transition-all"
                                style={{
                                  color: '#475569',
                                  border: '1px solid rgba(226,232,240,0.80)',
                                  background: 'rgba(241,245,249,0.70)',
                                }}
                                title="Preview Draft Mode"
                              >
                                👁 Preview
                              </a>
                            )}

                            {/* Trash */}
                            <button
                              type="button"
                              onClick={() => handleAction(post.id, post.title, 'trash')}
                              disabled={isPending}
                              className="px-[8px] py-[3px] rounded-[6px] text-[11px] font-medium transition-all disabled:opacity-50"
                              style={{
                                color: '#dc2626',
                                border: '1px solid rgba(239,68,68,0.18)',
                                background: 'rgba(239,68,68,0.06)',
                              }}
                            >
                              Trash
                            </button>
                          </>
                        ) : (
                          /* Restore from trash */
                          <button
                            type="button"
                            onClick={() => handleAction(post.id, post.title, 'restore')}
                            disabled={isPending}
                            className="px-[8px] py-[3px] rounded-[6px] text-[11px] font-medium transition-all disabled:opacity-50"
                            style={{
                              color: '#059669',
                              border: '1px solid rgba(52,211,153,0.25)',
                              background: 'rgba(52,211,153,0.08)',
                            }}
                          >
                            Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Confirm Modal ─────────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={confirmTarget !== null}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmTarget(null)}
        isLoading={isPending}
        title={
          confirmTarget?.action === 'trash'
            ? 'Pindahkan ke Sampah?'
            : 'Pulihkan Postingan?'
        }
        description={
          confirmTarget?.action === 'trash'
            ? `"${confirmTarget?.title ?? ''}" akan dipindahkan ke sampah. Anda bisa memulihkannya nanti.`
            : `"${confirmTarget?.title ?? ''}" akan dipulihkan dari sampah.`
        }
        confirmLabel={
          confirmTarget?.action === 'trash' ? 'Move to Trash' : 'Restore'
        }
        variant={confirmTarget?.action === 'trash' ? 'danger' : 'default'}
      />
    </>
  )
}

export default PostsTable