'use client'

import React, { useRef, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { compressImage } from '@/lib/utils/compressImage'

interface ImageUploaderProps {
  onUpload: (url: string) => void
  bucket?: string
  folder?: string
  label?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export default function ImageUploader({
  onUpload,
  bucket = 'posts-images',
  folder = 'uploads',
  label = 'Upload Image',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createBrowserSupabaseClient()

  const [status, setStatus] = useState<'idle' | 'compressing' | 'uploading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [compressionStats, setCompressionStats] = useState<{
    original: number
    compressed: number
  } | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const isBusy = status === 'compressing' || status === 'uploading'

  async function processFile(file: File) {
    setErrorMsg(null)
    setPreviewUrl(null)
    setCompressionStats(null)

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrorMsg('Format tidak didukung. Gunakan JPEG, PNG, WebP, atau GIF.')
      setStatus('error')
      return
    }

    const originalSize = file.size
    setStatus('compressing')

    let compressed: File
    try {
      compressed = await compressImage(file)
    } catch {
      setErrorMsg('Kompresi gambar gagal. Coba lagi.')
      setStatus('error')
      return
    }

    setCompressionStats({ original: originalSize, compressed: compressed.size })
    setPreviewUrl(URL.createObjectURL(compressed))
    setStatus('uploading')

    const ext = 'webp'
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, compressed, { contentType: 'image/webp', upsert: false })

    if (error || !data) {
      console.error('[ImageUploader] Upload error:', error)
      setErrorMsg('Upload gagal. Coba lagi.')
      setStatus('error')
      return
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path)
    setStatus('done')
    onUpload(urlData.publicUrl)

    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  return (
    <div className="flex flex-col gap-3">

      {/* Drop zone / trigger */}
      <button
        type="button"
        onClick={() => !isBusy && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        disabled={isBusy}
        className="w-full flex flex-col items-center justify-center gap-2 px-4 py-7 rounded-xl transition-all duration-200 disabled:cursor-not-allowed"
        style={{
          background: isDragging
            ? 'rgba(124,58,237,0.1)'
            : 'rgba(255,255,255,0.02)',
          border: `1.5px dashed ${isDragging ? 'rgba(124,58,237,0.4)' : 'rgba(255,255,255,0.1)'}`,
          cursor: isBusy ? 'wait' : 'pointer',
        }}
        aria-label={label}
      >
        {isBusy ? (
          <>
            <div
              className="w-6 h-6 rounded-full border-2"
              style={{
                borderColor: 'rgba(255,255,255,0.1)',
                borderTopColor: '#a78bfa',
                animation: 'spin 0.75s linear infinite',
              }}
            />
            <p className="text-[12px] font-medium text-slate-400">
              {status === 'compressing' ? 'Mengoptimalkan gambar…' : 'Mengupload…'}
            </p>
          </>
        ) : (
          <>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                <path d="M8 11V3M5 6l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 13h12" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-center mt-2">
              <p className="text-[12.5px] font-semibold text-slate-300">
                Klik untuk memilih file
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                atau drag &amp; drop di sini · JPEG, PNG, WebP, GIF
              </p>
            </div>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={handleFileChange}
        aria-label="Upload image"
      />

      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />

      {/* Compression stats */}
      {compressionStats && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11.5px]"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="2">
            <path d="M1 8h14M8 1v14" strokeLinecap="round" />
          </svg>
          <span className="text-slate-500">Dikompresi:</span>
          <span className="font-medium text-slate-300">{formatBytes(compressionStats.original)}</span>
          <span className="text-slate-500">→</span>
          <span className="font-semibold text-emerald-400">{formatBytes(compressionStats.compressed)}</span>
          <span className="text-slate-500">(WebP)</span>
        </div>
      )}

      {/* Preview + success */}
      {previewUrl && status === 'done' && (
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div
            className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg"
            style={{
              background: 'rgba(52,211,153,0.15)',
              border: '1px solid rgba(52,211,153,0.3)',
              color: '#34d399',
            }}
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Upload berhasil
          </div>
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <div
          className="flex items-center gap-2 text-[12px] font-medium px-3 py-2 rounded-lg"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#f87171',
          }}
        >
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="8" cy="8" r="6.5" />
            <path d="M8 5v3M8 11v.5" strokeLinecap="round" />
          </svg>
          {errorMsg}
        </div>
      )}

    </div>
  )
}