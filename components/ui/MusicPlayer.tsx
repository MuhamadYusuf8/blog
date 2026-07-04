'use client'

import React, { useEffect, useRef, useState } from 'react'

interface MusicPlayerProps {
  url: string
  title: string
}

export default function MusicPlayer({ url, title }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [audioError, setAudioError] = useState<string | null>(null)

  // Ensure URL is properly encoded (fix for filenames/URLs with spaces or special characters)
  const cleanUrl = url ? encodeURI(decodeURI(url.trim())) : ''

  // Show the player with a delay after mount (slide-in animation)
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  // Auto-play after first user interaction with the page
  const hasInteractedRef = useRef(false)
  useEffect(() => {
    const handleInteraction = () => {
      if (hasInteractedRef.current) return
      hasInteractedRef.current = true
      setHasInteracted(true)
      audioRef.current?.play().then(() => {
        setIsPlaying(true)
        setAudioError(null)
      }).catch((err) => {
        console.warn('[MusicPlayer] Autoplay prevented or failed:', err)
      })
    }
    document.addEventListener('click', handleInteraction)
    document.addEventListener('keydown', handleInteraction)
    document.addEventListener('scroll', handleInteraction)
    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
      document.removeEventListener('scroll', handleInteraction)
    }
  }, [])


  // Progress & error tracking
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleTimeUpdate = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
    }
    const handleError = () => {
      const err = audio.error
      console.error('[MusicPlayer] Audio load error:', err, 'URL:', cleanUrl)
      let msg = 'Gagal memuat musik (404/403/CORS).'
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
    audio.addEventListener('error', handleError)
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('error', handleError)
    }
  }, [cleanUrl])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      setAudioError(null)
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch((err) => {
        console.error('[MusicPlayer] Play error:', err)
        if (err.name === 'NotAllowedError') {
          setAudioError('Autoplay diblokir browser. Klik putar lagi.')
        } else if (err.name === 'NotSupportedError') {
          setAudioError('Format audio tidak didukung atau file 404/403.')
        } else {
          setAudioError(`Gagal memutar: ${err.message || 'Error jaringan/sumber'}`)
        }
        setIsPlaying(false)
      })
    }
  }

  function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * audio.duration
  }

  if (isDismissed) return null

  // Sanitize title for display
  const displayTitle = title || 'Musik Latar'
  const artistDisplay = displayTitle.includes('—') ? displayTitle.split('—')[1]?.trim() : undefined
  const songDisplay = displayTitle.includes('—') ? displayTitle.split('—')[0]?.trim() : displayTitle

  return (
    <>
      <audio ref={audioRef} preload="auto" loop>
        {/* Provide multiple source types so the browser can try each decoder.
            This fixes files where extension doesn't match actual format
            (e.g. .mp3 file that is actually M4A/MP4 container from YouTube).
            MP4/M4A listed first as most common from YouTube sources. */}
        <source src={cleanUrl} type="audio/mp4" />
        <source src={cleanUrl} type="audio/x-m4a" />
        <source src={cleanUrl} type="audio/aac" />
        <source src={cleanUrl} type="audio/mpeg" />
        <source src={cleanUrl} type="audio/ogg" />
        <source src={cleanUrl} type="audio/wav" />
        <source src={cleanUrl} type="audio/flac" />
        <source src={cleanUrl} />
      </audio>

      {/* Floating Player */}
      <div
        id="music-player-widget"
        role="region"
        aria-label="Pemutar musik latar"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          transform: isVisible
            ? 'translateY(0) scale(1)'
            : 'translateY(20px) scale(0.96)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
        }}
      >
        {/* Minimized pill */}
        {isMinimized ? (
          <button
            id="music-player-expand"
            onClick={() => setIsMinimized(false)}
            aria-label="Buka pemutar musik"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 999,
              background: 'rgba(15,15,15,0.85)',
              border: '1px solid rgba(167,139,250,0.25)',
              backdropFilter: 'blur(20px)',
              color: '#a78bfa',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(167,139,250,0.1)',
              transition: 'all 0.2s ease',
            }}
          >
            {/* Animated music bars when playing */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 14 }}>
              {[1, 2, 3].map(i => (
                <span
                  key={i}
                  style={{
                    width: 3,
                    borderRadius: 2,
                    background: isPlaying ? '#a78bfa' : 'rgba(167,139,250,0.4)',
                    animation: isPlaying ? `bar-bounce-${i} 0.8s ease-in-out infinite alternate` : 'none',
                    height: isPlaying ? undefined : 8,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.02em' }}>
              {audioError ? '⚠️ Error' : isPlaying ? 'Sedang Diputar' : 'Musik'}
            </span>
          </button>
        ) : (
          /* Full player card */
          <div
            style={{
              width: 260,
              borderRadius: 20,
              background: 'rgba(12,12,14,0.88)',
              border: '1px solid rgba(167,139,250,0.2)',
              backdropFilter: 'blur(28px)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(167,139,250,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
              overflow: 'hidden',
            }}
          >
            {/* Header bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 12px 6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Animated vinyl disc */}
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 50% 50%, #1e1b2e 30%, #3a2d5e 60%, #2d1b4e 100%)',
                    border: '2px solid rgba(167,139,250,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    animation: isPlaying ? 'vinyl-spin 3s linear infinite' : 'none',
                    boxShadow: isPlaying ? '0 0 12px rgba(167,139,250,0.3)' : 'none',
                    transition: 'box-shadow 0.3s ease',
                  }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a78bfa', opacity: 0.9 }} />
                </div>
                <div>
                  <p style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(255,255,255,0.88)', lineHeight: 1.2, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {songDisplay}
                  </p>
                  {artistDisplay && (
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{artistDisplay}</p>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                {/* Minimize */}
                <button
                  id="music-player-minimize"
                  onClick={() => setIsMinimized(true)}
                  aria-label="Perkecil pemutar"
                  style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.35)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                    padding: 0,
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 4h6" />
                  </svg>
                </button>
                {/* Close */}
                <button
                  id="music-player-close"
                  onClick={() => { audioRef.current?.pause(); setIsDismissed(true) }}
                  aria-label="Tutup pemutar musik"
                  style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.35)',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                    padding: 0,
                  }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 1l6 6M7 1L1 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Error Message Display */}
            {audioError && (
              <div
                style={{
                  margin: '4px 12px',
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  color: '#f87171',
                  fontSize: 11,
                  lineHeight: 1.3,
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
                ⚠️ {audioError}
              </div>
            )}

            {/* Progress bar */}
            <div
              onClick={handleSeek}
              style={{
                margin: '4px 12px',
                height: 3,
                borderRadius: 99,
                background: 'rgba(255,255,255,0.07)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              role="progressbar"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                  borderRadius: 99,
                  transition: 'width 0.3s linear',
                }}
              />
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 12px 12px' }}>
              {/* Play / Pause */}
              <button
                id="music-player-playpause"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Jeda musik' : 'Putar musik'}
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: isPlaying
                    ? 'linear-gradient(135deg, #7c3aed, #a78bfa)'
                    : 'rgba(167,139,250,0.12)',
                  border: isPlaying ? 'none' : '1px solid rgba(167,139,250,0.25)',
                  color: isPlaying ? '#fff' : '#a78bfa',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: isPlaying ? '0 4px 16px rgba(124,58,237,0.5)' : 'none',
                  transition: 'all 0.2s ease',
                  padding: 0,
                }}
              >
                {isPlaying ? (
                  // Pause icon
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <rect x="2" y="2" width="4" height="10" rx="1" />
                    <rect x="8" y="2" width="4" height="10" rx="1" />
                  </svg>
                ) : (
                  // Play icon
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                    <path d="M3 2l9 5-9 5V2z" />
                  </svg>
                )}
              </button>

              {/* Visualizer bars — only visible when playing */}
              {isPlaying && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2.5, height: 16, marginLeft: 10 }}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <span
                      key={i}
                      style={{
                        width: 3,
                        borderRadius: 2,
                        background: `rgba(167,139,250,${0.3 + i * 0.1})`,
                        animation: `bar-bounce-${(i % 3) + 1} ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
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
      ` }} />
    </>
  )
}
