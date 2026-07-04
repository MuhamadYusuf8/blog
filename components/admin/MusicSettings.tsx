'use client'

import React, { useRef, useState, useTransition } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { updateMusic } from '@/app/admin/settings/actions'

interface MusicSettingsProps {
  initialEnabled: boolean
  initialUrl: string
  initialTitle: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const ACCEPTED_AUDIO = ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav', 'audio/aac', 'audio/flac', 'audio/mp4', 'audio/x-m4a', 'audio/m4a']
const ACCEPTED_AUDIO_EXT = '.mp3,.ogg,.wav,.aac,.flac,.m4a,.mp4'

export default function MusicSettings({
  initialEnabled,
  initialUrl,
  initialTitle,
}: MusicSettingsProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createBrowserSupabaseClient()

  const [enabled, setEnabled] = useState(initialEnabled)
  const [musicUrl, setMusicUrl] = useState(initialUrl)
  const [musicTitle, setMusicTitle] = useState(initialTitle)

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(
    initialUrl ? initialUrl.split('/').pop() ?? null : null
  )
  const [fileSize, setFileSize] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const [isPending, startTransition] = useTransition()
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function processAudioFile(file: File) {
    setUploadError(null)
    setUploadedFileName(null)
    setFileSize(null)

    const isValidType = ACCEPTED_AUDIO.some(t => file.type === t) || file.name.match(/\.(mp3|ogg|wav|aac|flac|m4a|mp4)$/i)
    if (!isValidType) {
      setUploadError('Format tidak didukung. Gunakan MP3, OGG, WAV, AAC, FLAC, atau M4A.')
      setUploadStatus('error')
      return
    }

    setFileSize(file.size)
    setUploadStatus('uploading')

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp3'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    let contentType = file.type || 'audio/mpeg'
    if (ext === 'm4a' || ext === 'mp4') contentType = 'audio/mp4'
    else if (ext === 'ogg') contentType = 'audio/ogg'
    else if (ext === 'wav') contentType = 'audio/wav'
    else if (ext === 'flac') contentType = 'audio/flac'

    const { data, error } = await supabase.storage
      .from('music')
      .upload(filename, file, { contentType, upsert: false })

    if (error || !data) {
      console.error('[MusicSettings] Upload error:', error)
      setUploadError('Upload gagal. Pastikan bucket Supabase mengizinkan file audio.')
      setUploadStatus('error')
      return
    }

    const { data: urlData } = supabase.storage.from('music').getPublicUrl(data.path)
    const cleanPublicUrl = encodeURI(decodeURI(urlData.publicUrl.trim()))
    setMusicUrl(cleanPublicUrl)
    setUploadedFileName(file.name)
    setUploadStatus('done')

    if (!musicTitle) setMusicTitle(file.name.replace(/\.[^/.]+$/, ''))
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processAudioFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processAudioFile(file)
  }

  function handleSave() {
    const cleanUrl = musicUrl ? encodeURI(decodeURI(musicUrl.trim())) : ''
    startTransition(async () => {
      const result = await updateMusic(enabled, cleanUrl, musicTitle)
      setStatusMsg(
        result.success
          ? { type: 'success', text: 'Pengaturan musik berhasil disimpan.' }
          : { type: 'error', text: result.error ?? 'Gagal menyimpan.' }
      )
      setTimeout(() => setStatusMsg(null), 4000)
    })
  }

  const isBusy = uploadStatus === 'uploading'

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* ── Panel header ─────────────────────────────────────────────── */}
      <div
        className="px-5 py-4 flex items-center justify-between gap-2"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(167,139,250,0.08)',
              border: '1px solid rgba(167,139,250,0.2)',
            }}
            aria-hidden="true"
          >
            {/* Music note icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </div>
          <h2 className="text-[13px] font-semibold text-white/90">Musik Latar Situs</h2>
        </div>

        {/* Toggle Switch */}
        <button
          type="button"
          id="music-toggle"
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled(prev => !prev)}
          className="relative flex-shrink-0 transition-all duration-200"
          style={{
            width: 40,
            height: 22,
            borderRadius: 999,
            background: enabled
              ? 'linear-gradient(135deg, #a78bfa, #7c3aed)'
              : 'rgba(255,255,255,0.08)',
            border: enabled ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
          }}
        >
          <span
            className="absolute top-[3px] transition-all duration-200"
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              background: '#fff',
              boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
              left: enabled ? 22 : 3,
            }}
          />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* ── Status badge */}
        <div className="flex items-center gap-2">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
            style={
              enabled
                ? { background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }
            }
          >
            <span
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: enabled ? '#a78bfa' : 'rgba(255,255,255,0.2)',
                display: 'inline-block',
                animation: enabled ? 'pulse-dot 2s ease-in-out infinite' : 'none',
              }}
            />
            {enabled ? 'Musik Aktif' : 'Musik Nonaktif'}
          </div>
          <p className="text-[11.5px] text-white/25">
            {enabled ? 'Pengunjung akan mendengar musik latar' : 'Musik tidak diputar untuk pengunjung'}
          </p>
        </div>

        {/* ── Judul Lagu ─────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <label htmlFor="music-title" className="block text-[11.5px] font-semibold text-white/40 uppercase tracking-[0.08em]">
            Judul / Nama Lagu
          </label>
          <input
            id="music-title"
            type="text"
            value={musicTitle}
            onChange={e => setMusicTitle(e.target.value)}
            placeholder="cth: Lofi Study Beats — ChillHop"
            className="w-full px-3 py-2.5 rounded-xl text-[12.5px] outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.8)',
            }}
          />
        </div>

        {/* ── Upload Area ────────────────────────────────────────────── */}
        <div className="space-y-1.5">
          <p className="text-[11.5px] font-semibold text-white/40 uppercase tracking-[0.08em]">
            File Musik
          </p>
          <button
            type="button"
            onClick={() => !isBusy && inputRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            disabled={isBusy}
            className="w-full flex flex-col items-center justify-center gap-2 px-4 py-7 rounded-xl transition-all duration-200"
            style={{
              background: isDragging ? 'rgba(167,139,250,0.08)' : 'rgba(255,255,255,0.02)',
              border: `1.5px dashed ${isDragging ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.1)'}`,
              cursor: isBusy ? 'wait' : 'pointer',
            }}
            aria-label="Upload file musik"
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
                <p className="text-[12px] font-medium text-slate-400">Mengupload...</p>
              </>
            ) : (
              <>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18V5l12-2v13" />
                    <circle cx="6" cy="18" r="3" />
                    <circle cx="18" cy="16" r="3" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-[12.5px] font-semibold text-slate-300">
                    Klik untuk memilih file musik
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    atau drag &amp; drop · MP3, OGG, WAV, AAC, FLAC, M4A
                  </p>
                </div>
              </>
            )}
          </button>

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_AUDIO_EXT}
            className="hidden"
            onChange={handleFileChange}
            aria-label="Upload file musik"
          />

          {/* Upload Success */}
          {uploadStatus === 'done' && uploadedFileName && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[12px]"
              style={{
                background: 'rgba(52,211,153,0.06)',
                border: '1px solid rgba(52,211,153,0.2)',
              }}
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="#34d399" strokeWidth="2.2">
                <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-semibold text-emerald-400">Berhasil diupload:</span>
              <span className="text-white/40 truncate">{uploadedFileName}</span>
              {fileSize && <span className="text-white/25 ml-auto flex-shrink-0">{formatBytes(fileSize)}</span>}
            </div>
          )}

          {/* Existing music URL indicator */}
          {musicUrl && uploadStatus === 'idle' && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11.5px]"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
              </svg>
              <p className="text-white/30 font-medium truncate">{musicUrl.split('/').pop()}</p>
              <span className="text-white/15 ml-auto flex-shrink-0">Terpasang</span>
            </div>
          )}

          {/* Upload Error */}
          {uploadError && (
            <div
              className="flex items-center gap-2 text-[12px] font-medium px-3 py-2 rounded-lg"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8" cy="8" r="6.5" /><path d="M8 5v3M8 11v.5" strokeLinecap="round" />
              </svg>
              {uploadError}
            </div>
          )}
        </div>

        {/* ── Atau URL Langsung ───────────────────────────────────────── */}
        <div className="space-y-1.5">
          <label htmlFor="music-url" className="block text-[11.5px] font-semibold text-white/40 uppercase tracking-[0.08em]">
            Atau Masukkan URL Audio Langsung
          </label>
          <input
            id="music-url"
            type="url"
            value={musicUrl}
            onChange={e => setMusicUrl(e.target.value)}
            placeholder="https://... (URL file .mp3)"
            className="w-full px-3 py-2.5 rounded-xl text-[12.5px] font-mono outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.6)',
            }}
          />
        </div>

        {/* ── Simpan Button ───────────────────────────────────────────── */}
        <div className="flex items-center gap-3 flex-wrap pt-1">
          <button
            id="music-save-btn"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: isPending ? 'rgba(167,139,250,0.1)' : 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(124,58,237,0.1))',
              border: '1px solid rgba(167,139,250,0.25)',
              color: '#a78bfa',
            }}
          >
            {isPending ? (
              <span
                className="w-3.5 h-3.5 rounded-full border-2 inline-block"
                style={{ borderColor: 'rgba(167,139,250,0.2)', borderTopColor: '#a78bfa', animation: 'spin 0.75s linear infinite' }}
              />
            ) : (
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            Simpan Pengaturan Musik
          </button>

          {statusMsg && (
            <div
              className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg"
              style={
                statusMsg.type === 'success'
                  ? { background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.22)', color: '#34d399' }
                  : { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }
              }
            >
              {statusMsg.type === 'success' ? (
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="8" cy="8" r="6.5" /><path d="M8 5v3M8 11v.5" strokeLinecap="round" />
                </svg>
              )}
              {statusMsg.text}
            </div>
          )}
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes pulse-dot { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        ` }} />
      </div>
    </div>
  )
}
