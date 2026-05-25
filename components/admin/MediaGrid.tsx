'use client'

import React, { useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import type { FileObject } from '@supabase/storage-js'

interface MediaGridProps {
  files: FileObject[]
  bucket: string
  onDelete: (filename: string) => void
}

function formatBytes(bytes: number | undefined): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function MediaGrid({ files, bucket, onDelete }: MediaGridProps) {
  const supabase = createBrowserSupabaseClient()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function getPublicUrl(filename: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
    return data.publicUrl
  }

  async function handleCopyUrl(filename: string) {
    const url = getPublicUrl(filename)
    await navigator.clipboard.writeText(url)
    setCopiedId(filename)
    setTimeout(() => setCopiedId(null), 2000)
  }

  async function handleDelete(filename: string) {
    if (!confirm(`Hapus "${filename.split('/').pop()}"? Tindakan ini tidak bisa dibatalkan.`)) return
    setDeletingId(filename)

    const { error } = await supabase.storage.from(bucket).remove([filename])
    setDeletingId(null)

    if (error) {
      console.error('[MediaGrid] Delete error:', error)
      alert('Gagal menghapus file.')
      return
    }

    onDelete(filename)
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
          style={{
            background: 'rgba(241,245,249,0.70)',
            border: '1px solid rgba(226,232,240,0.50)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.8">
            <rect x="1" y="3" width="14" height="10" rx="1.5" />
            <circle cx="6" cy="8" r="2" />
          </svg>
        </div>
        <p className="text-[13px] font-semibold text-slate-500">Belum ada file media</p>
        <p className="text-[11.5px] text-slate-400 mt-1">Upload gambar menggunakan form di atas.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {files.map((file) => {
        const publicUrl = getPublicUrl(file.name)
        const isCopied = copiedId === file.name
        const isDeleting = deletingId === file.name
        const shortName = file.name.split('/').pop() ?? file.name

        return (
          <div
            key={file.name}
            className="group rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_6px_18px_-4px_rgba(15,23,42,0.10)]"
            style={{
              background: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(226,232,240,0.80)',
            }}
          >
            {/* Thumbnail */}
            <div
              className="aspect-square overflow-hidden"
              style={{ background: 'rgba(241,245,249,0.60)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={publicUrl}
                alt={shortName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <div className="p-2.5 space-y-2">
              <div>
                <p
                  className="text-[11.5px] font-semibold text-slate-600 truncate leading-snug"
                  title={shortName}
                >
                  {shortName}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                  {formatBytes(file.metadata?.size)}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleCopyUrl(file.name)}
                  className="flex-1 flex items-center justify-center gap-1 text-[10.5px] font-semibold py-1.5 rounded-lg transition-all duration-150"
                  style={
                    isCopied
                      ? {
                          background: 'rgba(52,211,153,0.08)',
                          border: '1px solid rgba(52,211,153,0.22)',
                          color: '#059669',
                        }
                      : {
                          background: 'rgba(241,245,249,0.90)',
                          border: '1px solid rgba(226,232,240,0.80)',
                          color: '#475569',
                        }
                  }
                  title="Salin URL"
                >
                  {isCopied ? (
                    <>
                      <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="5" y="5" width="9" height="9" rx="1.5" />
                        <path d="M11 5V3a1 1 0 00-1-1H3a1 1 0 00-1 1v7a1 1 0 001 1h2" />
                      </svg>
                      Copy URL
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(file.name)}
                  disabled={isDeleting}
                  className="flex items-center justify-center w-7 rounded-lg transition-all disabled:opacity-50"
                  style={{
                    background: 'rgba(239,68,68,0.05)',
                    border: '1px solid rgba(239,68,68,0.15)',
                    color: '#dc2626',
                  }}
                  title="Hapus file"
                  aria-label={`Hapus ${shortName}`}
                >
                  {isDeleting ? (
                    <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                      <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 4h12M5 4V3h6v1M6 7v5M10 7v5M3 4l1 9h8l1-9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}