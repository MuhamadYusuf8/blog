'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

export interface PlayerSong {
  id: number
  title: string
  url: string
}

interface MusicPlayerProps {
  playlist: PlayerSong[]
}

export default function MusicPlayer({ playlist }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)
  const [showPlaylist, setShowPlaylist] = useState(false)

  const currentSong = playlist[currentIndex]
  const cleanUrl = currentSong?.url ? encodeURI(decodeURI(currentSong.url.trim())) : ''

  // Slide-in animation delay
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  // ─── Auto-play on first user interaction ──────────────────────────────────
  const hasInteractedRef = useRef(false)
  useEffect(() => {
    const trigger = () => {
      if (hasInteractedRef.current) return
      hasInteractedRef.current = true
      audioRef.current?.play().then(() => {
        setIsPlaying(true)
        setAudioError(null)
      }).catch(err => {
        console.warn('[MusicPlayer] Autoplay prevented:', err)
      })
    }
    document.addEventListener('click', trigger)
    document.addEventListener('keydown', trigger)
    document.addEventListener('scroll', trigger)
    return () => {
      document.removeEventListener('click', trigger)
      document.removeEventListener('keydown', trigger)
      document.removeEventListener('scroll', trigger)
    }
  }, [])

  // ─── Load new song when index changes ─────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !cleanUrl) return
    const wasPlaying = isPlaying
    audio.pause()
    audio.load()
    setProgress(0)
    setAudioError(null)
    if (wasPlaying || hasInteractedRef.current) {
      audio.play().then(() => setIsPlaying(true)).catch(err => {
        console.warn('[MusicPlayer] Play after track change failed:', err)
        setIsPlaying(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  // ─── Progress, error, and ended tracking ──────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
    }

    const handleEnded = () => {
      // Auto-advance to next song, loop back to first at end
      setCurrentIndex(prev => (prev + 1) % playlist.length)
    }

    const handleError = () => {
      const err = audio.error
      let msg = 'Gagal memuat musik.'
      if (err) {
        if (err.code === 1) msg = 'Pengunduhan musik dibatalkan.'
        else if (err.code === 2) msg = 'Masalah jaringan saat memuat musik.'
        else if (err.code === 3) msg = 'Format audio tidak didukung atau file rusak.'
        else if (err.code === 4) msg = 'File musik tidak ditemukan atau akses ditolak (404/403).'
      }
      setAudioError(msg)
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('error', handleError)
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('error', handleError)
    }
  }, [playlist.length])

  // ─── Controls ─────────────────────────────────────────────────────────────
  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      setAudioError(null)
      audio.play().then(() => setIsPlaying(true)).catch(err => {
        if (err.name === 'NotAllowedError') setAudioError('Autoplay diblokir browser. Klik putar lagi.')
        else if (err.name === 'NotSupportedError') setAudioError('Format audio tidak didukung.')
        else setAudioError(`Gagal memutar: ${err.message}`)
        setIsPlaying(false)
      })
    }
  }

  const playPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + playlist.length) % playlist.length)
  }, [playlist.length])

  const playNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % playlist.length)
  }, [playlist.length])

  function jumpTo(idx: number) {
    setCurrentIndex(idx)
    setShowPlaylist(false)
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration
  }

  if (isDismissed || !currentSong) return null

  const displayTitle = currentSong.title || 'Musik Latar'
  const artistDisplay = displayTitle.includes('—') ? displayTitle.split('—')[1]?.trim() : undefined
  const songDisplay = displayTitle.includes('—') ? displayTitle.split('—')[0]?.trim() : displayTitle

  return (
    <>
      <audio ref={audioRef} preload="auto">
        <source src={cleanUrl} type="audio/mp4" />
        <source src={cleanUrl} type="audio/x-m4a" />
        <source src={cleanUrl} type="audio/aac" />
        <source src={cleanUrl} type="audio/mpeg" />
        <source src={cleanUrl} type="audio/ogg" />
        <source src={cleanUrl} type="audio/wav" />
        <source src={cleanUrl} type="audio/flac" />
        <source src={cleanUrl} />
      </audio>

      {/* Floating Widget */}
      <div
        id="music-player-widget"
        role="region"
        aria-label="Pemutar musik latar"
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
        }}
      >
        {/* ── Minimized pill ── */}
        {isMinimized ? (
          <button
            id="music-player-expand"
            onClick={() => setIsMinimized(false)}
            aria-label="Buka pemutar musik"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 999,
              background: 'rgba(15,15,15,0.85)',
              border: '1px solid rgba(167,139,250,0.25)',
              backdropFilter: 'blur(20px)',
              color: '#a78bfa', cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(167,139,250,0.1)',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 14 }}>
              {[1, 2, 3].map(i => (
                <span key={i} style={{ width: 3, borderRadius: 2, background: isPlaying ? '#a78bfa' : 'rgba(167,139,250,0.4)', animation: isPlaying ? `bar-bounce-${i} 0.8s ease-in-out infinite alternate` : 'none', height: isPlaying ? undefined : 8 }} />
              ))}
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.02em' }}>
              {audioError ? '⚠️ Error' : isPlaying ? 'Sedang Diputar' : 'Musik'}
            </span>
          </button>
        ) : (
          /* ── Full card ── */
          <div style={{ width: 276, borderRadius: 20, background: 'rgba(12,12,14,0.92)', border: '1px solid rgba(167,139,250,0.2)', backdropFilter: 'blur(28px)', boxShadow: '0 16px 48px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.04)', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px 6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                {/* Vinyl disc */}
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'radial-gradient(circle at 50% 50%, #1e1b2e 30%, #3a2d5e 60%, #2d1b4e 100%)', border: '2px solid rgba(167,139,250,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: isPlaying ? 'vinyl-spin 3s linear infinite' : 'none', boxShadow: isPlaying ? '0 0 12px rgba(167,139,250,0.35)' : 'none', transition: 'box-shadow 0.3s ease' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', opacity: 0.9 }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.88)', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 148 }}>{songDisplay}</p>
                  {artistDisplay && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{artistDisplay}</p>}
                  {/* Track counter */}
                  {playlist.length > 1 && (
                    <p style={{ fontSize: 10, color: 'rgba(167,139,250,0.5)', marginTop: 1 }}>{currentIndex + 1} / {playlist.length}</p>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                {/* Playlist toggle */}
                {playlist.length > 1 && (
                  <button
                    id="music-player-playlist"
                    onClick={() => setShowPlaylist(p => !p)}
                    aria-label="Lihat playlist"
                    title="Playlist"
                    style={{ width: 22, height: 22, borderRadius: '50%', background: showPlaylist ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)', border: showPlaylist ? '1px solid rgba(167,139,250,0.3)' : '1px solid rgba(255,255,255,0.08)', color: showPlaylist ? '#a78bfa' : 'rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                  </button>
                )}
                {/* Minimize */}
                <button id="music-player-minimize" onClick={() => setIsMinimized(true)} aria-label="Perkecil pemutar" style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 4h6" /></svg>
                </button>
                {/* Close */}
                <button id="music-player-close" onClick={() => { audioRef.current?.pause(); setIsDismissed(true) }} aria-label="Tutup pemutar musik" style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 1l6 6M7 1L1 7" /></svg>
                </button>
              </div>
            </div>

            {/* Error */}
            {audioError && (
              <div style={{ margin: '4px 12px', padding: '8px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 11, textAlign: 'center', fontWeight: 500 }}>
                ⚠️ {audioError}
              </div>
            )}

            {/* Progress bar */}
            <div onClick={handleSeek} style={{ margin: '4px 12px', height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.07)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)', borderRadius: 99, transition: 'width 0.3s linear' }} />
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 12px 12px' }}>
              {/* Prev */}
              {playlist.length > 1 && (
                <button id="music-player-prev" onClick={playPrev} aria-label="Lagu sebelumnya" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" /></svg>
                </button>
              )}

              {/* Play/Pause */}
              <button id="music-player-playpause" onClick={togglePlay} aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'} style={{ width: 42, height: 42, borderRadius: '50%', background: isPlaying ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : 'rgba(167,139,250,0.12)', border: isPlaying ? 'none' : '1px solid rgba(167,139,250,0.25)', color: isPlaying ? '#fff' : '#a78bfa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isPlaying ? '0 4px 16px rgba(124,58,237,0.5)' : 'none', transition: 'all 0.2s ease', padding: 0 }}>
                {isPlaying ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><rect x="2" y="2" width="4" height="10" rx="1" /><rect x="8" y="2" width="4" height="10" rx="1" /></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><path d="M3 2l9 5-9 5V2z" /></svg>
                )}
              </button>

              {/* Next */}
              {playlist.length > 1 && (
                <button id="music-player-next" onClick={playNext} aria-label="Lagu berikutnya" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2.5-6 5.5 4V8l-5.5 4zM16 6h2v12h-2z" /></svg>
                </button>
              )}

              {/* Visualizer when playing */}
              {isPlaying && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: 16, marginLeft: 4 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} style={{ width: 3, borderRadius: 2, background: `rgba(167,139,250,${0.3 + i * 0.1})`, animation: `bar-bounce-${(i % 3) + 1} ${0.5 + i * 0.1}s ease-in-out infinite alternate` }} />
                  ))}
                </div>
              )}
            </div>

            {/* Playlist panel */}
            {showPlaylist && playlist.length > 1 && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', maxHeight: 180, overflowY: 'auto', padding: '6px 8px 8px' }}>
                {playlist.map((song, idx) => (
                  <button
                    key={song.id}
                    onClick={() => jumpTo(idx)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                      padding: '6px 8px', borderRadius: 8, cursor: 'pointer',
                      background: idx === currentIndex ? 'rgba(167,139,250,0.12)' : 'transparent',
                      border: idx === currentIndex ? '1px solid rgba(167,139,250,0.2)' : '1px solid transparent',
                      textAlign: 'left', transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 10, fontWeight: 700, color: idx === currentIndex ? '#a78bfa' : 'rgba(255,255,255,0.25)', width: 16, textAlign: 'center', flexShrink: 0 }}>
                      {idx === currentIndex && isPlaying ? '▶' : idx + 1}
                    </span>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: idx === currentIndex ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                      {song.title}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes vinyl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bar-bounce-1 { from { height: 4px; } to { height: 14px; } }
        @keyframes bar-bounce-2 { from { height: 8px; } to { height: 6px; } }
        @keyframes bar-bounce-3 { from { height: 6px; } to { height: 12px; } }
        #music-player-minimize:hover { background: rgba(255,255,255,0.08) !important; color: rgba(255,255,255,0.7) !important; }
        #music-player-close:hover { background: rgba(239,68,68,0.15) !important; border-color: rgba(239,68,68,0.3) !important; color: #f87171 !important; }
        #music-player-expand:hover { background: rgba(20,20,24,0.9) !important; border-color: rgba(167,139,250,0.4) !important; }
        #music-player-prev:hover, #music-player-next:hover { background: rgba(255,255,255,0.08) !important; color: rgba(255,255,255,0.8) !important; }
        #music-player-playlist:hover { opacity: 0.8; }
      ` }} />
    </>
  )
}
