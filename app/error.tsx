/**
 * app/error.tsx — Global Error Boundary Page
 * SRS §2.4, RULE 1, RULE 8, Phase 2D step 24.
 *
 * RULE 1: Uses .glass-panel-error — NOT a plain unstyled div.
 * RULE 8: Full first-class UI page, not a placeholder.
 *
 * Requirements (SRS §2.4):
 *   - 'use client' (Next.js requirement for error boundaries)
 *   - Uses .glass-panel-error on the content container
 *   - Heading in text-red-300
 *   - Generic error message — NEVER exposes error.message to the user
 *   - "Try Again" button calls the reset() prop
 *   - "Go Home" navigates to /
 *   - role="alert" on the container (WCAG 2.1 AA)
 *   - Renders over the dynamic background (glassmorphism floats above it)
 */

'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const router = useRouter()

  // Log the real error server-side / to console for debugging.
  // NEVER display error.message to the user — it may contain sensitive info.
  useEffect(() => {
    console.error('[ErrorBoundary] Unhandled error:', error)
  }, [error])

  return (
    /* Full-screen centering — the body background shows behind the glass panel */
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-12">
      {/*
       * RULE 1: glass-panel-error is MANDATORY here.
       * RULE 8: role="alert" for WCAG 2.1 AA compliance.
       */}
      <div
        className="glass-panel-error p-8 md:p-12 max-w-lg w-full text-center flex flex-col items-center gap-6 animate-fade-in"
        role="alert"
        aria-live="assertive"
      >
        {/* Error icon */}
        <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center" aria-hidden="true">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        {/* Heading — SRS: text-red-300 */}
        <h1 className="text-red-300 font-bold text-2xl md:text-3xl">
          Terjadi Kesalahan
        </h1>

        {/* Generic message — NEVER expose error.message publicly */}
        <p className="text-white/60 text-sm leading-relaxed max-w-sm">
          Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu.
          Silakan coba lagi atau kembali ke beranda.
        </p>

        {/* Error digest — safe to show, it's just an ID with no sensitive info */}
        {error.digest && (
          <p className="text-white/25 text-xs font-mono">
            Error ID: {error.digest}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
          {/* Try Again — calls the reset() prop from Next.js error boundary */}
          <button
            type="button"
            onClick={reset}
            id="error-try-again"
            className="
              w-full px-6 py-2.5 rounded-xl text-sm font-semibold
              bg-red-500/20 hover:bg-red-500/30
              text-red-300 hover:text-red-200
              border border-red-500/30 hover:border-red-400/50
              transition-all duration-200
            "
          >
            🔄 Coba Lagi
          </button>

          {/* Go Home */}
          <button
            type="button"
            onClick={() => router.push('/')}
            id="error-go-home"
            className="
              w-full px-6 py-2.5 rounded-xl text-sm font-semibold
              glass-panel hover:bg-white/20
              text-white/70 hover:text-white
              transition-all duration-200
            "
          >
            🏠 Beranda
          </button>
        </div>
      </div>
    </div>
  )
}
