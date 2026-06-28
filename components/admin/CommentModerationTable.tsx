'use client'

import React, { useState, useEffect, useTransition, useCallback } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'
import {
  approveComment,
  rejectComment,
  softDeleteComment,
  restoreComment,
  bulkApproveComments,
  bulkRejectComments,
} from '@/app/admin/comments/actions'
import ConfirmModal from '@/components/admin/ConfirmModal'

type Comment = Database['public']['Tables']['comments']['Row']
type FilterTab = 'pending' | 'approved' | 'rejected' | 'trash'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max) + '…' : str
}

// ─── Tab config ───────────────────────────────────────────────────────────────
const tabs: {
  key: FilterTab
  label: string
  icon: React.ReactNode
  activeColor: string
  activeBorder: string
}[] = [
  {
    key: 'pending',
    label: 'Pending',
    icon: (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 5v3.5l2 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    activeColor: 'text-amber-400',
    activeBorder: 'border-amber-500/40',
  },
  {
    key: 'approved',
    label: 'Approved',
    icon: (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    activeColor: 'text-emerald-400',
    activeBorder: 'border-emerald-500/40',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    icon: (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
      </svg>
    ),
    activeColor: 'text-red-400',
    activeBorder: 'border-red-500/40',
  },
  {
    key: 'trash',
    label: 'Trash',
    icon: (
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 4h12M5 4V3h6v1M6 7v5M10 7v5M3 4l1 9h8l1-9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    activeColor: 'text-white/60',
    activeBorder: 'border-white/20',
  },
]

export default function CommentModerationTable() {
  const supabase = createBrowserSupabaseClient()

  const [activeTab, setActiveTab] = useState<FilterTab>('pending')
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    commentId: string | null
  }>({ isOpen: false, commentId: null })

  function showToast(type: 'success' | 'error', text: string) {
    setToast({ type, text })
    setTimeout(() => setToast(null), 3500)
  }

  const fetchComments = useCallback(async () => {
    setLoading(true)
    setSelectedIds(new Set())

    let query = supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })

    if (activeTab === 'trash') {
      query = query.not('deleted_at', 'is', null)
    } else {
      query = query.is('deleted_at', null)
      if (activeTab === 'pending') query = query.is('is_approved', null)
      if (activeTab === 'approved') query = query.eq('is_approved', true)
      if (activeTab === 'rejected') query = query.eq('is_approved', false)
    }

    const { data, error } = await query
    if (error) {
      console.error('[CommentModerationTable]', error)
      showToast('error', 'Gagal memuat komentar.')
    }
    setComments(data ?? [])
    setLoading(false)
  }, [activeTab, supabase])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selectedIds.size === comments.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(comments.map((c) => c.id)))
    }
  }

  async function handleAction(
    action: () => Promise<{ success: boolean; error?: string }>,
    successMsg: string,
  ) {
    startTransition(async () => {
      const result = await action()
      if (result.success) {
        showToast('success', successMsg)
        fetchComments()
      } else {
        showToast('error', result.error ?? 'Aksi gagal.')
      }
    })
  }

  const activeTabConfig = tabs.find((t) => t.key === activeTab)!

  return (
    <div className="space-y-4">

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          role="alert"
          className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm shadow-lg transition-all"
          style={{
            background: toast.type === 'success'
              ? 'rgba(16, 185, 129, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            border: toast.type === 'success'
              ? '1px solid rgba(52,211,153,0.30)'
              : '1px solid rgba(239,68,68,0.25)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px -4px rgba(15,23,42,0.10)',
            color: toast.type === 'success' ? '#34d399' : '#f87171',
          }}
        >
          {toast.type === 'success' ? (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="8" cy="8" r="6.5" />
              <path d="M8 5v3M8 11v.5" strokeLinecap="round" />
            </svg>
          )}
          <span className="font-medium text-[13px]">{toast.text}</span>
        </div>
      )}

      {/* ── Tabs ──────────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-1 flex gap-0.5 overflow-x-auto"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={[
              'flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-medium whitespace-nowrap transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/10',
              activeTab === tab.key
                ? `bg-white/10 shadow-[0_1px_12px_rgba(255,255,255,0.05)] border border-white/10 ${tab.activeColor}`
                : 'text-white/30 hover:text-white/70 hover:bg-white/5',
            ].join(' ')}
          >
            <span className={activeTab === tab.key ? tab.activeColor : 'text-white/30'}>
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Bulk actions ──────────────────────────────────────────────────── */}
      {selectedIds.size > 0 && activeTab !== 'trash' && (
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-2.5"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <span className="text-[12px] font-medium text-white/50 flex-1">
            {selectedIds.size} komentar dipilih
          </span>
          <button
            onClick={() =>
              handleAction(
                () => bulkApproveComments(Array.from(selectedIds)),
                `${selectedIds.size} komentar disetujui.`,
              )
            }
            disabled={isPending}
            className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
            style={{
              background: 'rgba(52,211,153,0.08)',
              border: '1px solid rgba(52,211,153,0.22)',
              color: '#059669',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Setujui Semua
          </button>
          <button
            onClick={() =>
              handleAction(
                () => bulkRejectComments(Array.from(selectedIds)),
                `${selectedIds.size} komentar ditolak.`,
              )
            }
            disabled={isPending}
            className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
            style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.18)',
              color: '#dc2626',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
            Tolak Semua
          </button>
        </div>
      )}

      {/* ── Table panel ───────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Panel header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-2">
            <span className={`${activeTabConfig.activeColor}`}>{activeTabConfig.icon}</span>
            <h2 className="text-[13px] font-semibold text-white/90">
              {activeTabConfig.label}
            </h2>
            {!loading && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
                  color: '#64748b',
                }}
              >
                {comments.length}
              </span>
            )}
          </div>
          <button
            onClick={fetchComments}
            disabled={loading || isPending}
            className="text-[11px] font-medium text-white/30 hover:text-white/70 transition-colors disabled:opacity-40"
            aria-label="Refresh komentar"
          >
            <svg
              width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
              className={loading ? 'animate-spin' : ''}
            >
              <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5a5.5 5.5 0 0 1 4 1.7" strokeLinecap="round" />
              <path d="M12 1v3h3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div
              className="w-7 h-7 rounded-full border-2"
              style={{
                borderColor: 'rgba(255,255,255,0.1)',
                borderTopColor: 'rgba(255,255,255,0.5)',
                animation: 'spin 0.75s linear infinite',
              }}
            />
            <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
          </div>
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8">
                <path d="M2 4c0-1.1.9-2 2-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6l-4 2V4z" />
              </svg>
            </div>
            <p className="text-[13px] font-semibold text-white/50">Tidak ada komentar di sini</p>
            <p className="text-[11.5px] text-white/20 mt-1">Komentar pada tab ini akan muncul di sini.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr
                className="text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                <th className="px-5 py-3 text-left w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === comments.length && comments.length > 0}
                    onChange={toggleSelectAll}
                    aria-label="Pilih semua komentar"
                    className="rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/50"
                  />
                </th>
                <th className="px-4 py-3 text-left">Pengirim</th>
                <th className="px-4 py-3 text-left">Komentar</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Tanggal</th>
                <th className="px-4 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment, i) => (
                <tr
                  key={comment.id}
                  className="group transition-colors hover:bg-white/[0.02]"
                  style={{
                    borderBottom: i < comments.length - 1 ? '1px solid rgba(255,255,255,0.05)' : undefined,
                  }}
                >
                  {/* Checkbox */}
                  <td className="px-5 py-3.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(comment.id)}
                      onChange={() => toggleSelect(comment.id)}
                      aria-label={`Pilih komentar dari ${comment.commenter_name}`}
                      className="rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/50"
                    />
                  </td>

                  {/* Commenter */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
                          color: 'rgba(255,255,255,0.7)',
                        }}
                      >
                        {comment.commenter_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[12.5px] font-semibold text-white/90 whitespace-nowrap">
                        {comment.commenter_name}
                      </span>
                    </div>
                  </td>

                  {/* Body */}
                  <td className="px-4 py-3.5">
                    <p className="text-[12.5px] text-white/50 leading-snug">
                      {truncate(comment.body, 80)}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-[11.5px] text-white/30 font-medium">
                      {formatDate(comment.created_at)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex flex-wrap gap-1.5">
                      {activeTab === 'trash' ? (
                        <button
                          onClick={() =>
                            handleAction(
                              () => restoreComment(comment.id),
                              'Komentar dipulihkan.',
                            )
                          }
                          disabled={isPending}
                          className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all disabled:opacity-50"
                          style={{
                            background: 'rgba(59,130,246,0.1)',
                            border: '1px solid rgba(59,130,246,0.2)',
                            color: '#60a5fa',
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M3 8A5 5 0 1 1 8 13" strokeLinecap="round" />
                            <path d="M3 5v3H6" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Restore
                        </button>
                      ) : (
                        <>
                          {activeTab !== 'approved' && (
                            <button
                              onClick={() =>
                                handleAction(
                                  () => approveComment(comment.id),
                                  'Komentar disetujui.',
                                )
                              }
                              disabled={isPending}
                              className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all disabled:opacity-50"
                              style={{
                                background: 'rgba(52,211,153,0.08)',
                                border: '1px solid rgba(52,211,153,0.22)',
                                color: '#059669',
                              }}
                            >
                              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              Setuju
                            </button>
                          )}
                          {activeTab !== 'rejected' && (
                            <button
                              onClick={() =>
                                handleAction(
                                  () => rejectComment(comment.id),
                                  'Komentar ditolak.',
                                )
                              }
                              disabled={isPending}
                              className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all disabled:opacity-50"
                              style={{
                                background: 'rgba(251,191,36,0.08)',
                                border: '1px solid rgba(251,191,36,0.22)',
                                color: '#b45309',
                              }}
                            >
                              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
                              </svg>
                              Tolak
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setConfirmModal({ isOpen: true, commentId: comment.id })
                            }
                            className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            style={{
                              background: 'rgba(239,68,68,0.05)',
                              border: '1px solid rgba(239,68,68,0.15)',
                              color: '#dc2626',
                            }}
                          >
                            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M2 4h12M5 4V3h6v1M6 7v5M10 7v5M3 4l1 9h8l1-9" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Trash
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Confirm Modal ─────────────────────────────────────────────────── */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Pindah ke Trash"
        description="Komentar ini akan disembunyikan dari publik. Kamu bisa memulihkannya dari tab Trash."
        confirmLabel="Pindah ke Trash"
        variant="danger"
        onConfirm={() => {
          if (!confirmModal.commentId) return
          const id = confirmModal.commentId
          setConfirmModal({ isOpen: false, commentId: null })
          handleAction(() => softDeleteComment(id), 'Komentar dipindah ke trash.')
        }}
        onCancel={() => setConfirmModal({ isOpen: false, commentId: null })}
      />
    </div>
  )
}