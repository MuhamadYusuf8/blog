// components/public/Footer.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Pearl White footer — Server Component.
// glass-footer + minimal monochrome links. RSS & Sitemap per SRS §2.2.
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { Rss, Map } from 'lucide-react'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="glass-footer mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-[12.5px] text-slate-400">
            © {year}{' '}
            <Link
              href="/"
              className="font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200"
            >
              Kak Rahma
            </Link>
            {'. '}
            Dibuat dengan{' '}
            <span aria-label="cinta" className="text-slate-400">♥</span>
          </p>

          {/* Links */}
          <div className="flex items-center gap-5">
            <Link
              href="/feed.xml"
              className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 hover:text-slate-700 transition-colors duration-200"
              aria-label="RSS Feed"
            >
              <Rss size={12} strokeWidth={2} aria-hidden="true" />
              RSS Feed
            </Link>

            <div className="w-px h-3 bg-slate-200" aria-hidden="true" />

            <Link
              href="/sitemap.xml"
              className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 hover:text-slate-700 transition-colors duration-200"
              aria-label="Sitemap"
            >
              <Map size={12} strokeWidth={2} aria-hidden="true" />
              Sitemap
            </Link>
          </div>

        </div>
      </div>
    </footer>
  )
}

export default Footer