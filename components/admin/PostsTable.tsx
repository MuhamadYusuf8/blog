'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, Edit3, Trash2, RotateCcw, ExternalLink, ChevronRight, FileText } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'
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

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(dateStr))
}

export function PostsTable({ activePosts, trashedPosts }: PostsTableProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState<'active' | 'trash'>('active')
  const [confirmTarget, setConfirmTarget] = useState<{
    id: string; title: string; action: 'trash' | 'restore'
  } | null>(null)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  function handleAction(id: string, title: string, action: 'trash' | 'restore') {
    setConfirmTarget({ id, title, action })
  }

  function handleConfirm() {
    if (!confirmTarget) return
    startTransition(async () => {
      const result = confirmTarget.action === 'trash'
        ? await softDeletePost(confirmTarget.id)
        : await restorePost(confirmTarget.id)

      if (result.success) {
        showToast(confirmTarget.action === 'trash' ? 'Postingan dipindahkan ke sampah.' : 'Postingan berhasil dipulihkan.', 'success')
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
        showToast(currentStatus === 'published' ? 'Postingan diubah ke draft.' : 'Postingan berhasil dipublikasikan!', 'success')
        router.refresh()
      } else {
        showToast(result.error ?? 'Terjadi kesalahan.', 'error')
      }
    })
  }

  const posts = activeTab === 'active' ? activePosts : trashedPosts

  return (
    <>
      {/* ── Tabs ─────────────────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 rounded-xl w-fit mb-5"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        {(['active', 'trash'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-[10px] text-[13px] font-medium transition-all duration-200 relative"
            style={activeTab === tab
              ? { background: 'rgba(124,58,237,0.2)', color: '#c4b5fd', border: '1px solid rgba(124,58,237,0.3)' }
              : { background: 'transparent', color: '#64748b', border: '1px solid transparent' }
            }
          >
            {tab === 'active' ? `Aktif (${activePosts.length})` : `Sampah (${trashedPosts.length})`}
            {activeTab === tab && (
              <motion.div layoutId="tabIndicator" className="absolute inset-0 rounded-[10px]"
                style={{ background: 'rgba(124,58,237,0.08)' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Table Panel ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        {posts.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <FileText size={28} className="text-slate-600" />
            </div>
            <div>
              <p className="text-slate-300 font-medium mb-1">
                {activeTab === 'active' ? 'Belum ada postingan' : 'Sampah kosong'}
              </p>
              <p className="text-sm text-slate-600">
                {activeTab === 'active' ? 'Mulai tulis artikel pertamamu!' : 'Tidak ada postingan di sampah.'}
              </p>
            </div>
            {activeTab === 'active' && (
              <Link href="/admin/posts/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-violet-300 transition-all"
                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.25)' }}
              >
                Tulis Post Pertama <ChevronRight size={14} />
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table head */}
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {['Judul', 'Status', 'Kategori', 'Views', 'Tanggal', 'Aksi'].map((col, i) => (
                    <th key={col}
                      className={`px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 ${
                        i === 1 ? 'hidden sm:table-cell' :
                        i === 2 || i === 3 ? 'hidden md:table-cell' :
                        i === 4 ? 'hidden lg:table-cell' :
                        i === 5 ? 'text-right' : ''
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table body */}
              <tbody>
                {posts.map((post, idx) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    onHoverStart={() => setHoveredRow(post.id)}
                    onHoverEnd={() => setHoveredRow(null)}
                    className="group transition-all duration-200"
                    style={{
                      borderBottom: idx < posts.length - 1 ? '1px solid rgba(255,255,255,0.035)' : 'none',
                      background: hoveredRow === post.id ? 'rgba(255,255,255,0.025)' : 'transparent',
                    }}
                  >
                    {/* Title */}
                    <td className="px-5 py-4">
                      <p className="text-[13.5px] font-medium text-slate-200 group-hover:text-white truncate max-w-[280px] transition-colors">
                        {post.title}
                      </p>
                      <p className="text-[10px] text-slate-600 truncate mt-0.5 font-mono">
                        /posts/{post.slug}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                        style={post.status === 'published'
                          ? { background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }
                          : { background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }
                        }
                      >
                        <span className="w-1.5 h-1.5 rounded-full"
                          style={{ background: post.status === 'published' ? '#34d399' : '#fbbf24', boxShadow: post.status === 'published' ? '0 0 6px #34d399' : '0 0 6px #fbbf24' }}
                        />
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      {post.category
                        ? <span className="text-[12px] font-medium px-2 py-0.5 rounded-md" style={{ background: 'rgba(124,58,237,0.1)', color: '#a78bfa', border: '1px solid rgba(124,58,237,0.2)' }}>{post.category}</span>
                        : <span className="text-[12px] text-slate-600">—</span>
                      }
                    </td>

                    {/* Views */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Eye size={12} />
                        <span className="text-[12px] tabular-nums">{post.view_count.toLocaleString('id-ID')}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 hidden lg:table-cell text-[11px] text-slate-500">
                      {formatDate(activeTab === 'trash' ? post.deleted_at : post.published_at ?? post.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        {activeTab === 'active' ? (
                          <>
                            {/* Edit */}
                            <Link href={`/admin/posts/${post.id}/edit`}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200"
                              style={{ color: '#94a3b8', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a78bfa'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.35)'; (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#94a3b8'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                            >
                              <Edit3 size={11} /> Edit
                            </Link>

                            {/* Toggle Publish */}
                            <button
                              onClick={() => handleTogglePublish(post.id, post.status)}
                              disabled={isPending}
                              className="px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 disabled:opacity-40"
                              style={post.status === 'published'
                                ? { color: '#fbbf24', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }
                                : { color: '#34d399', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }
                              }
                            >
                              {post.status === 'published' ? 'Unpublish' : 'Publish'}
                            </button>

                            {/* Preview draft */}
                            {post.status === 'draft' && (
                              <a
                                href={`/api/preview?secret=${encodeURIComponent(process.env.NEXT_PUBLIC_DRAFT_PREVIEW_SECRET ?? '')}&slug=${encodeURIComponent(post.slug)}`}
                                target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200"
                                style={{ color: '#64748b', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                              >
                                <ExternalLink size={10} /> Preview
                              </a>
                            )}

                            {/* Trash */}
                            <button
                              onClick={() => handleAction(post.id, post.title, 'trash')}
                              disabled={isPending}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 disabled:opacity-40"
                              style={{ color: '#f87171', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}
                            >
                              <Trash2 size={11} /> Trash
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleAction(post.id, post.title, 'restore')}
                            disabled={isPending}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-200 disabled:opacity-40"
                            style={{ color: '#34d399', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}
                          >
                            <RotateCcw size={11} /> Restore
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Confirm Modal ─────────────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={confirmTarget !== null}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmTarget(null)}
        isLoading={isPending}
        title={confirmTarget?.action === 'trash' ? 'Pindahkan ke Sampah?' : 'Pulihkan Postingan?'}
        description={confirmTarget?.action === 'trash'
          ? `"${confirmTarget?.title ?? ''}" akan dipindahkan ke sampah. Anda bisa memulihkannya nanti.`
          : `"${confirmTarget?.title ?? ''}" akan dipulihkan dari sampah.`
        }
        confirmLabel={confirmTarget?.action === 'trash' ? 'Move to Trash' : 'Restore'}
        variant={confirmTarget?.action === 'trash' ? 'danger' : 'default'}
      />
    </>
  )
}

export default PostsTable