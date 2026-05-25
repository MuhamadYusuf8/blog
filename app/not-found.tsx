/**
 * app/not-found.tsx — 404 Not Found Page
 * SRS §2.5, RULE 1, RULE 8, Phase 2D step 25.
 *
 * RULE 1: Uses .glass-panel — NOT a plain unstyled div.
 * RULE 8: Full first-class UI page, not a placeholder.
 *
 * Requirements (SRS §2.5):
 *   - Server Component (not 'use client')
 *   - Uses .glass-panel on the content container
 *   - Large "404" heading in text-white font-bold text-6xl
 *   - Subheading "Page Not Found"
 *   - Vague description — does NOT confirm whether a slug ever existed
 *     (prevents enumeration of deleted post slugs)
 *   - "← Back to Blog" link to /
 *   - Renders over the dynamic background
 *   - role="alert" on the error container (WCAG 2.1 AA, SRS §10)
 */

import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Halaman Tidak Ditemukan',
  description: 'Halaman yang Anda cari tidak ditemukan.',
  robots: { index: false, follow: false },
}

export default function NotFoundPage() {
  return (
    /* Full-screen centering over the dynamic body background */
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-12">
      {/*
       * RULE 1: glass-panel is MANDATORY here.
       * RULE 8: role="alert" for WCAG 2.1 AA compliance.
       * Vague copy: does NOT say "this post was deleted" or "this slug existed".
       */}
      <div
        className="glass-panel p-10 md:p-16 max-w-lg w-full text-center flex flex-col items-center gap-6 animate-fade-in"
        role="alert"
      >
        {/* Decorative gradient orb */}
        <div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/20 border border-purple-400/20 flex items-center justify-center mb-2"
          aria-hidden="true"
        >
          <span className="text-4xl">🔍</span>
        </div>

        {/* 404 number — SRS: text-white font-bold text-6xl */}
        <p
          className="text-white font-bold text-6xl md:text-8xl leading-none"
          aria-hidden="true"
        >
          404
        </p>

        {/* Subheading — SRS: "Page Not Found" */}
        <h1 className="text-white font-bold text-xl md:text-2xl">
          Halaman Tidak Ditemukan
        </h1>

        {/* Vague description — deliberately does not confirm slug existence */}
        <p className="text-white/55 text-sm leading-relaxed max-w-sm">
          Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
          Coba periksa kembali alamat URL, atau kembali ke beranda.
        </p>

        {/* Back to Blog — SRS: "← Back to Blog" link to / */}
        <Link
          href="/"
          id="not-found-back-home"
          className="
            mt-2 inline-flex items-center gap-2
            px-6 py-3 rounded-xl
            bg-purple-600/70 hover:bg-purple-500/80
            text-white font-semibold text-sm
            border border-purple-400/30
            shadow-lg shadow-purple-900/30
            transition-all duration-200 hover:scale-105
          "
        >
          <span aria-hidden="true">←</span>
          Kembali ke Blog
        </Link>
      </div>
    </div>
  )
}
