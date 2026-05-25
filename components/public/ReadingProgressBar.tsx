/**
 * components/public/ReadingProgressBar.tsx
 * Thin reading progress bar fixed at the very top of the viewport — SRS §2.2.
 * 'use client' — required for window.scrollY and document measurements.
 *
 * Behaviour:
 *   - Tracks scroll position relative to scrollable document height
 *   - Updates width (0–100%) in real time via passive scroll listener
 *   - Uses purple → pink gradient to complement the glassmorphism palette
 *   - 4px height, z-[9999] to stay above the sticky navbar (z-50)
 *   - Does NOT block render — renders null on the server
 */

'use client'

import React, { useEffect, useState } from 'react'

export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function updateProgress() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight

      if (docHeight <= 0) {
        setProgress(0)
        return
      }

      const percentage = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
      setProgress(percentage)
    }

    // Set initial value in case page is pre-scrolled
    updateProgress()

    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      aria-label="Reading progress"
      className="fixed top-0 left-0 right-0 z-[9999] h-1 pointer-events-none"
    >
      {/* Track (background) */}
      <div className="w-full h-full bg-white/5" aria-hidden="true" />

      {/* Fill bar */}
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 via-violet-400 to-pink-400 shadow-lg shadow-purple-500/40"
        style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}
        aria-hidden="true"
      />
    </div>
  )
}

export default ReadingProgressBar
