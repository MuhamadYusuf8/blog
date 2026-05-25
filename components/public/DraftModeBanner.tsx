/**
 * components/public/DraftModeBanner.tsx
 * Draft preview mode warning banner — SRS §6.
 * 'use client' — rendered conditionally based on client-readable state.
 *
 * Shown ONLY when Next.js Draft Mode is active (admin preview).
 * Displays a prominent amber warning strip with an "Exit Preview" link.
 *
 * Uses .glass-panel-accent with an amber border as the SRS specifies.
 */

'use client'

import React from 'react'
import Link from 'next/link'

export function DraftModeBanner() {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="
        glass-panel-accent
        border border-amber-400/40
        rounded-xl px-4 py-3 mb-6
        flex items-center justify-between gap-4
        flex-wrap
      "
    >
      <div className="flex items-center gap-2.5">
        {/* Warning icon */}
        <svg
          className="w-5 h-5 text-amber-400 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>

        <p className="text-amber-200 text-sm font-medium">
          <span className="font-bold">⚠️ DRAFT PREVIEW</span>
          {' — '}
          Postingan ini belum dipublikasikan. Hanya terlihat oleh Anda.
        </p>
      </div>

      {/* Exit Preview link → /api/exit-preview */}
      <Link
        href="/api/exit-preview"
        className="
          shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold
          bg-amber-400/20 hover:bg-amber-400/30
          text-amber-300 hover:text-amber-200
          border border-amber-400/30
          transition-all duration-200
          whitespace-nowrap
        "
      >
        Keluar dari Preview →
      </Link>
    </div>
  )
}

export default DraftModeBanner
