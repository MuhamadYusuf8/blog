'use client'

import React, { useRef, useState, useTransition, useCallback } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import {
  updateMusic,
  addSongToPlaylist,
  deleteSongFromPlaylist,
  type PlaylistSong,
} from '@/app/admin/settings/actions'

interface MusicSettingsProps {
  initialEnabled: boolean
  initialUrl: string
  initialTitle: string
  initialPlaylist: PlaylistSong[]
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

const ACCEPTED_AUDIO = ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav', 'audio/aac', 'audio/flac', 'audio/mp4', 'audio/x-m4a', 'audio/m4a']
const ACCEPTED_AUDIO_EXT = '.mp3,.ogg,.wav,.aac,.flac,.m4a,.mp4'

// ─── Icon helpers ──────────────────────────────────────────────────────────────

function IconMusic({ size = 13, color = '#a78bfa' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  )
}

function IconUpload({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

function IconTrash({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function IconCheck({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── Sub-component: Upload Area ────────────────────────────────────────────────

interface UploadAreaProps {
  onUploadDone: (song: PlaylistSong) => void
}

function UploadArea({ onUploadDone }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createBrowserSupabaseClient()

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [fileSize, setFileSize] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [isSaving, startSaving] = useTransition()
  const [pendingUrl, setPendingUrl] = useState<string | null>(null)
  const [pendingName, setPendingName] = useState<string | null>(null)

  async function processAudioFile(file: File) {
    setUploadError(null)
    setUploadedFileName(null)
    setFileSize(null)
    setPendingUrl(null)
    setPendingName(null)

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
      setUploadError('Upload gagal. Pastikan bucket Supabase mengizinkan file audio.')
      setUploadStatus('error')
      return
    }

    const { data: urlData } = supabase.storage.from('music').getPublicUrl(data.path)
    const cleanPublicUrl = encodeURI(decodeURI(urlData.publicUrl.trim()))
    const autoTitle = file.name.replace(/\.[^/.]+$/, '')

    setPendingUrl(cleanPublicUrl)
    setPendingName(file.name)
    setUploadedFileName(file.name)
    setNewTitle(autoTitle)
    setUploadStatus('done')

    if (inputRef.current) inputRef.current.value = ''
  }

  function handleSaveToPlaylist() {
    if (!pendingUrl) return
    const finalTitle = newTitle.trim() || pendingName || 'Lagu Tanpa Judul'
    startSaving(async () => {
      const result = await addSongToPlaylist(finalTitle, pendingUrl!)
      if (result.success && result.song) {
        onUploadDone(result.song)
        setUploadStatus('idle')
        setUploadedFileName(null)
        setPendingUrl(null)
        setPendingName(null)
        setNewTitle('')
        setFileSize(null)
      } else {
        setUploadError(result.error ?? 'Gagal menyimpan ke playlist.')
      }
    })
  }

  const isBusy = uploadStatus === 'uploading'

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <button
        type="button"
        onClick={() => !isBusy && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={e => { e.preventDefault(); setIsDragging(false); const f = e.dataTransfer.files?.[0]; if (f) processAudioFile(f) }}
        disabled={isBusy}
        className="w-full flex flex-col items-center justify-center gap-2 px-4 py-8 rounded-xl transition-all duration-200"
        style={{
          background: isDragging ? 'rgba(167,139,250,0.08)' : 'rgba(255,255,255,0.02)',
          border: `1.5px dashed ${isDragging ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)'}`,
          cursor: isBusy ? 'wait' : 'pointer',
        }}
        aria-label="Upload file musik"
      >
        {isBusy ? (
          <>
            <div className="w-6 h-6 rounded-full border-2" style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#a78bfa', animation: 'spin 0.75s linear infinite' }} />
            <p className="text-[12px] font-medium text-slate-400">Mengupload...</p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)' }}>
              <IconUpload size={18} />
            </div>
            <div className="text-center">
              <p className="text-[12.5px] font-semibold text-slate-300">Klik atau seret file musik ke sini</p>
              <p className="text-[11px] text-slate-500 mt-0.5">MP3, OGG, WAV, AAC, FLAC, M4A</p>
            </div>
          </>
        )}
      </button>

      <input ref={inputRef} type="file" accept={ACCEPTED_AUDIO_EXT} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processAudioFile(f) }} aria-label="Upload file musik" />

      {/* After upload: enter title & save */}
      {uploadStatus === 'done' && pendingUrl && (
        <div className="rounded-xl p-3 space-y-3" style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <div className="flex items-center gap-2 text-[12px]">
            <IconCheck size={10} />
            <span className="font-semibold text-emerald-400">File siap:</span>
            <span className="text-white/40 truncate">{uploadedFileName}</span>
            {fileSize && <span className="text-white/25 ml-auto flex-shrink-0">{formatBytes(fileSize)}</span>}
          </div>
          <input
            type="text"
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Judul lagu (opsional)"
            className="w-full px-3 py-2 rounded-lg text-[12.5px] outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)' }}
          />
          <button
            onClick={handleSaveToPlaylist}
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[12.5px] font-semibold transition-all"
            style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.2), rgba(124,58,237,0.15))', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa' }}
          >
            {isSaving ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 inline-block" style={{ borderColor: 'rgba(167,139,250,0.2)', borderTopColor: '#a78bfa', animation: 'spin 0.75s linear infinite' }} />
            ) : (
              <IconCheck size={10} />
            )}
            Tambahkan ke Playlist
          </button>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center gap-2 text-[12px] font-medium px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="6.5" /><path d="M8 5v3M8 11v.5" strokeLinecap="round" /></svg>
          {uploadError}
        </div>
      )}
    </div>
  )
}

// ─── Sub-component: Playlist List ──────────────────────────────────────────────

interface PlaylistListProps {
  songs: PlaylistSong[]
  onDelete: (id: number) => void
}

function PlaylistList({ songs, onDelete }: PlaylistListProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [, startDelete] = useTransition()

  function handleDelete(id: number) {
    setDeletingId(id)
    startDelete(async () => {
      const result = await deleteSongFromPlaylist(id)
      if (result.success) {
        onDelete(id)
      }
      setDeletingId(null)
    })
  }

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <IconMusic size={16} color="rgba(255,255,255,0.2)" />
        </div>
        <p className="text-[12px] text-white/25">Belum ada lagu di playlist.</p>
        <p className="text-[11px] text-white/15">Upload lagu di tab &quot;Upload Lagu&quot;</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-white/25 mb-3">{songs.length} lagu · Diputar berurutan dari atas ke bawah</p>
      {songs.map((song, idx) => (
        <div
          key={song.id}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Number */}
          <span className="text-[11px] font-bold w-5 text-center flex-shrink-0" style={{ color: 'rgba(167,139,250,0.5)' }}>
            {idx + 1}
          </span>

          {/* Vinyl mini icon */}
          <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'radial-gradient(circle at 50% 50%, #1e1b2e 30%, #3a2d5e 60%, #2d1b4e 100%)', border: '1.5px solid rgba(167,139,250,0.2)' }}>
            <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#a78bfa', opacity: 0.8 }} />
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <p className="text-[12.5px] font-semibold text-white/80 truncate">{song.title}</p>
            <p className="text-[10.5px] text-white/25 truncate mt-0.5">{song.url.split('/').pop()}</p>
          </div>

          {/* Delete */}
          <button
            onClick={() => handleDelete(song.id)}
            disabled={deletingId === song.id}
            aria-label={`Hapus ${song.title}`}
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', color: '#f87171', opacity: deletingId === song.id ? 0.4 : 1 }}
          >
            {deletingId === song.id ? (
              <span className="w-3 h-3 rounded-full border-2 inline-block" style={{ borderColor: 'rgba(239,68,68,0.2)', borderTopColor: '#f87171', animation: 'spin 0.75s linear infinite' }} />
            ) : (
              <IconTrash size={11} />
            )}
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MusicSettings({
  initialEnabled,
  initialPlaylist,
}: MusicSettingsProps) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [playlist, setPlaylist] = useState<PlaylistSong[]>(initialPlaylist)
  const [activeTab, setActiveTab] = useState<'playlist' | 'upload'>('playlist')
  const [isPending, startTransition] = useTransition()
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleUploadDone = useCallback((song: PlaylistSong) => {
    setPlaylist(prev => [...prev, song])
    setActiveTab('playlist')
  }, [])

  const handleDelete = useCallback((id: number) => {
    setPlaylist(prev => prev.filter(s => s.id !== id))
  }, [])

  function handleSaveEnabled() {
    startTransition(async () => {
      // Preserve existing music_url/title for backward compat (use first song in playlist or empty)
      const firstSong = playlist[0]
      const result = await updateMusic(enabled, firstSong?.url ?? '', firstSong?.title ?? '')
      setStatusMsg(
        result.success
          ? { type: 'success', text: 'Pengaturan musik berhasil disimpan.' }
          : { type: 'error', text: result.error ?? 'Gagal menyimpan.' }
      )
      setTimeout(() => setStatusMsg(null), 4000)
    })
  }

  const tabs = [
    { id: 'playlist' as const, label: `Daftar Lagu ${playlist.length > 0 ? `(${playlist.length})` : ''}` },
    { id: 'upload' as const, label: '+ Upload Lagu' },
  ]

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>

      {/* ── Panel header ──────────────────────────────────────────────── */}
      <div className="px-5 py-4 flex items-center justify-between gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }} aria-hidden="true">
            <IconMusic size={13} />
          </div>
          <h2 className="text-[13px] font-semibold text-white/90">Musik Latar Situs</h2>
        </div>

        {/* Toggle */}
        <button
          type="button"
          id="music-toggle"
          role="switch"
          aria-checked={enabled}
          onClick={() => setEnabled(p => !p)}
          className="relative flex-shrink-0 transition-all duration-200"
          style={{
            width: 40, height: 22, borderRadius: 999,
            background: enabled ? 'linear-gradient(135deg, #a78bfa, #7c3aed)' : 'rgba(255,255,255,0.08)',
            border: enabled ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
          }}
        >
          <span className="absolute top-[3px] transition-all duration-200" style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.4)', left: enabled ? 22 : 3 }} />
        </button>
      </div>

      <div className="p-5 space-y-5">

        {/* ── Status badge ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={
                enabled
                  ? { background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)' }
              }
            >
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: enabled ? '#a78bfa' : 'rgba(255,255,255,0.2)', display: 'inline-block', animation: enabled ? 'pulse-dot 2s ease-in-out infinite' : 'none' }} />
              {enabled ? 'Musik Aktif' : 'Musik Nonaktif'}
            </div>
            <p className="text-[11.5px] text-white/25">
              {enabled ? 'Pengunjung akan mendengar musik latar' : 'Musik tidak diputar untuk pengunjung'}
            </p>
          </div>

          {/* Save enable/disable */}
          <button
            id="music-save-btn"
            onClick={handleSaveEnabled}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, rgba(167,139,250,0.15), rgba(124,58,237,0.1))', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }}
          >
            {isPending ? (
              <span className="w-3 h-3 rounded-full border-2 inline-block" style={{ borderColor: 'rgba(167,139,250,0.2)', borderTopColor: '#a78bfa', animation: 'spin 0.75s linear infinite' }} />
            ) : <IconCheck size={10} />}
            Simpan
          </button>
        </div>

        {statusMsg && (
          <div
            className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg"
            style={
              statusMsg.type === 'success'
                ? { background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.22)', color: '#34d399' }
                : { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }
            }
          >
            {statusMsg.type === 'success' ? <IconCheck size={10} /> : '⚠'}
            {statusMsg.text}
          </div>
        )}

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-2 px-3 rounded-lg text-[12px] font-semibold transition-all duration-200"
                style={
                  activeTab === tab.id
                    ? { background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.25)', color: '#a78bfa' }
                    : { background: 'transparent', border: '1px solid transparent', color: 'rgba(255,255,255,0.35)' }
                }
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'playlist' ? (
            <PlaylistList songs={playlist} onDelete={handleDelete} />
          ) : (
            <UploadArea onUploadDone={handleUploadDone} />
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-dot { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      ` }} />
    </div>
  )
}
