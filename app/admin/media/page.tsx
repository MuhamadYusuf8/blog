'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import MediaGrid from '@/components/admin/MediaGrid'
import ImageUploader from '@/components/admin/ImageUploader'
import { Image, RefreshCw, Upload, AlertCircle } from 'lucide-react'
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
      .list('uploads', { limit: 200, offset: 0, sortBy: { column: 'created_at', order: 'desc' } })
    if (storageError) {
      setError('Gagal memuat file media.')
      setLoading(false)
      return
    }
    setFiles((data ?? []).filter((f) => f.name !== '.emptyFolderPlaceholder'))
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchFiles() }, [fetchFiles])

  const totalSize = files.reduce((acc, f) => acc + (f.metadata?.size ?? 0), 0)

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div>
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', color: '#38bdf8' }}
          >
            <Image size={11} /> Perpustakaan Media
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight mb-1">Media Library</h1>
          {!loading && (
            <p className="text-sm text-slate-500">
              <span className="text-slate-400 font-medium">{files.length}</span> file · <span className="text-slate-400 font-medium">{formatBytes(totalSize)}</span> digunakan
            </p>
          )}
        </div>
        <button onClick={fetchFiles} disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 flex-shrink-0 transition-all disabled:opacity-40"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Upload Panel */}
      <div className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)' }}
          >
            <Upload size={14} className="text-sky-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Upload File Baru</h2>
            <p className="text-xs text-slate-500">Mendukung JPG, PNG, WebP, GIF</p>
          </div>
        </div>
        <ImageUploader onUpload={fetchFiles} bucket={BUCKET} folder="uploads" label="Pilih File Gambar" />
      </div>

      {/* Error */}
      {error && (
        <div role="alert" className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
        >
          <AlertCircle size={14} />{error}
        </div>
      )}

      {/* Media Grid Panel */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)' }}
            >
              <Image size={14} className="text-sky-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Semua File</h2>
              {!loading && <p className="text-xs text-slate-500">{files.length} item</p>}
            </div>
          </div>
          {!loading && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.07)' }}
            >{files.length}</span>
          )}
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 rounded-full border-2 animate-spin"
                style={{ borderColor: 'rgba(255,255,255,0.08)', borderTopColor: '#38bdf8' }} />
              <p className="text-sm text-slate-600">Memuat media...</p>
            </div>
          ) : (
            <MediaGrid
              files={files.map((f) => ({ ...f, name: `uploads/${f.name}` }))}
              bucket={BUCKET}
              onDelete={(filename) => setFiles((prev) => prev.filter((f) => f.name !== filename.replace('uploads/', '')))}
            />
          )}
        </div>
      </div>
    </div>
  )
}