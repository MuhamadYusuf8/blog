'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import MediaGrid from '@/components/admin/MediaGrid'
import ImageUploader from '@/components/admin/ImageUploader'
import type { FileObject } from '@supabase/storage-js'

const BUCKET = 'posts-images'

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export default function MediaPage() {
  const supabase = createBrowserSupabaseClient()
  const [files, setFiles] = useState<FileObject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFiles = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error: storageError } = await supabase.storage
      .from(BUCKET)
      .list('uploads', {
        limit: 200,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      })

    if (storageError) {
      console.error('[MediaPage]', storageError)
      setError('Gagal memuat file media.')
      setLoading(false)
      return
    }

    setFiles((data ?? []).filter((f) => f.name !== '.emptyFolderPlaceholder'))
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  function handleUpload() {
    fetchFiles()
  }

  function handleDelete(filename: string) {
    setFiles((prev) => prev.filter((f) => f.name !== filename.replace('uploads/', '')))
  }

  const totalSize = files.reduce((acc, f) => acc + (f.metadata?.size ?? 0), 0)

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.4px] text-slate-900">
            Media Library
          </h1>
          {!loading && (
            <p className="text-[12.5px] text-slate-400 mt-0.5 font-medium">
              {files.length} file{files.length !== 1 ? 's' : ''} · {formatBytes(totalSize)} digunakan
            </p>
          )}
        </div>

        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid rgba(226,232,240,0.80)',
            boxShadow: '0 2px 8px -3px rgba(15,23,42,0.06)',
          }}
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#64748b" strokeWidth="1.8">
            <rect x="1" y="3" width="14" height="10" rx="1.5" />
            <circle cx="6" cy="8" r="2" />
            <path d="M10 6l4 5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── Upload panel ────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(255,255,255,0.72)',
          border: '1px solid rgba(226,232,240,0.80)',
          boxShadow: '0 2px 12px -4px rgba(15,23,42,0.05)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(241,245,249,0.90)',
              border: '1px solid rgba(226,232,240,0.80)',
            }}
            aria-hidden="true"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#64748b" strokeWidth="2">
              <path d="M8 11V3M5 6l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 13h12" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-[13px] font-semibold text-slate-700">Upload File Baru</h2>
        </div>

        <ImageUploader
          onUpload={handleUpload}
          bucket={BUCKET}
          folder="uploads"
          label="Pilih File Gambar"
        />
      </div>

      {/* ── Error state ─────────────────────────────────────────────────── */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-[12.5px] font-medium"
          style={{
            background: 'rgba(254,242,242,0.97)',
            border: '1px solid rgba(239,68,68,0.20)',
            color: '#991b1b',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3M8 11v.5" strokeLinecap="round" />
          </svg>
          {error}
        </div>
      )}

      {/* ── Grid panel ──────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.72)',
          border: '1px solid rgba(226,232,240,0.80)',
          boxShadow: '0 2px 12px -4px rgba(15,23,42,0.05)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Panel header */}
        <div
          className="px-5 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid rgba(226,232,240,0.70)' }}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-[13px] font-semibold text-slate-700">Semua File</h2>
            {!loading && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: 'rgba(241,245,249,0.90)',
                  border: '1px solid rgba(226,232,240,0.80)',
                  color: '#64748b',
                }}
              >
                {files.length}
              </span>
            )}
          </div>

          <button
            onClick={fetchFiles}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-40"
            aria-label="Refresh media"
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

        <div className="p-5">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div
                className="w-7 h-7 rounded-full border-2"
                style={{
                  borderColor: 'rgba(226,232,240,0.80)',
                  borderTopColor: '#94a3b8',
                  animation: 'spin 0.75s linear infinite',
                }}
              />
              <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
            </div>
          ) : (
            <MediaGrid
              files={files.map((f) => ({ ...f, name: `uploads/${f.name}` }))}
              bucket={BUCKET}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

    </div>
  )
}