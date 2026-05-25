// app/(public)/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Home / Feed page — Pearl White Minimalist Glassmorphism.
// ISR 60s. Two-column: PostFeed (left) + Sidebar (right).
// Soft 3D abstract centerpiece with floating animation (CSS-driven).
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { createClient }  from '@/lib/supabase/server'
import PostFeed          from '@/components/public/PostFeed'
import Sidebar           from '@/components/public/Sidebar'

export const revalidate = 60

export const metadata: Metadata = {
  title:       'Beranda',
  description: 'Tulisan harian dari Kak Rahma — artikel, cerita, dan refleksi.',
}

const POSTS_PER_PAGE = 6

// ─── Abstract 3D Centerpiece ─────────────────────────────────────────────────
// Pure CSS — no framer-motion dependency on server component.
// Rings rotate at different speeds; main sphere gets the float animation.

function AbstractCenterpiece() {
  return (
    <div
      className="relative mx-auto select-none"
      style={{ width: '200px', height: '200px' }}
      aria-hidden="true"
    >
      {/* Outer diffuse glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(226,232,240,0.50) 0%, transparent 70%)',
          filter:     'blur(24px)',
          transform:  'scale(1.2)',
        }}
      />

      {/* Ring 1 — slowest */}
      <div
        className="absolute rounded-full animate-spin-slow"
        style={{
          inset:       '5px',
          border:      '1.5px solid rgba(203,213,225,0.50)',
          boxShadow:   'inset 0 0 0 1px rgba(255,255,255,0.60)',
        }}
      />

      {/* Ring 2 — counter-spin */}
      <div
        className="absolute rounded-full animate-spin-medium"
        style={{
          inset:  '34px',
          border: '1px solid rgba(148,163,184,0.35)',
        }}
      />

      {/* Ring 3 — inner accent */}
      <div
        className="absolute rounded-full"
        style={{
          inset:     '58px',
          border:    '1px solid rgba(100,116,139,0.20)',
          animation: 'spin 18s linear infinite',
        }}
      />

      {/* Main frosted sphere — gets the float */}
      <div
        className="absolute rounded-full will-change-transform animate-float-slow"
        style={{
          inset:      '44px',
          background: 'radial-gradient(circle at 38% 30%, #ffffff 0%, #f1f5f9 55%, #e2e8f0 100%)',
          border:     '1px solid rgba(255,255,255,1)',
          boxShadow:  '0 16px 48px -12px rgba(0,0,0,0.10), inset 0 2px 0 rgba(255,255,255,1), inset 0 -2px 8px rgba(203,213,225,0.25)',
        }}
      >
        {/* Specular highlight */}
        <div
          className="absolute rounded-full"
          style={{
            top:        '14px',
            left:       '18px',
            width:      '32px',
            height:     '18px',
            background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.95) 0%, transparent 100%)',
            filter:     'blur(3px)',
            transform:  'rotate(-25deg)',
          }}
        />
      </div>

      {/* Satellite sphere A — top-right */}
      <div
        className="absolute rounded-full animate-float-delayed will-change-transform"
        style={{
          top:        '12px',
          right:      '14px',
          width:      '30px',
          height:     '30px',
          background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f1f5f9 100%)',
          border:     '1px solid rgba(255,255,255,1)',
          boxShadow:  '0 6px 20px -4px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)',
        }}
      />

      {/* Satellite sphere B — bottom-left */}
      <div
        className="absolute rounded-full animate-float-slow will-change-transform"
        style={{
          bottom:     '16px',
          left:       '12px',
          width:      '18px',
          height:     '18px',
          background: 'radial-gradient(circle at 35% 30%, #ffffff 0%, #e2e8f0 100%)',
          border:     '1px solid rgba(255,255,255,0.95)',
          boxShadow:  '0 3px 10px -3px rgba(0,0,0,0.06)',
          animationDelay: '1.2s',
        }}
      />

      {/* Tiny dot accent */}
      <div
        className="absolute rounded-full bg-slate-300 animate-pulse"
        style={{ top: '72px', right: '22px', width: '5px', height: '5px', opacity: 0.6 }}
      />
    </div>
  )
}

// ─── Section divider ─────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-400 whitespace-nowrap">
        {label}
      </p>
      <div className="flex-1 h-px bg-slate-200/70" />
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function HomePage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const supabase   = createClient()
  const page       = Math.max(1, parseInt(searchParams.page ?? '1', 10))
  const rangeStart = (page - 1) * POSTS_PER_PAGE
  const rangeEnd   = rangeStart + POSTS_PER_PAGE - 1

  const { data: posts, count } = await supabase
    .from('posts')
    .select(
      'id, title, slug, excerpt, cover_image_url, category, tags, published_at, view_count',
      { count: 'exact' },
    )
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('published_at', { ascending: false })
    .range(rangeStart, rangeEnd)

  const totalCount = count ?? 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <header className="mb-16 text-center">

        {/* Live badge */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-7 glass-card glass-transition"
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400"
            style={{ boxShadow: '0 0 0 3px rgba(52,211,153,0.20)' }}
          />
          <span className="text-[11.5px] font-medium text-slate-500 tracking-wide">
            Tulisan baru setiap minggu
          </span>
        </div>

        {/* Main headline */}
        <h1 className="font-display text-[2.8rem] sm:text-[3.6rem] font-bold text-slate-900 tracking-display leading-[1.1] text-balance mx-auto max-w-2xl">
          Tempat ide{' '}
          <span className="italic font-normal text-slate-400">bernafas.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-4 text-[15px] text-slate-500 leading-relaxed max-w-md mx-auto">
          Tulisan harian tentang desain, keahlian, dan hal-hal yang bertahan lama.
        </p>

        {/* 3D Abstract Centerpiece */}
        <div className="mt-10 mb-4">
          <AbstractCenterpiece />
        </div>

        {/* Decorative pearl divider below centerpiece */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-200" />
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-200" />
        </div>
      </header>

      {/* ── Two-column layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 xl:gap-12 items-start">

        {/* Main feed */}
        <section>
          <SectionDivider label="Tulisan Terbaru" />
          <PostFeed
            posts={posts ?? []}
            totalCount={totalCount}
            currentPage={page}
            postsPerPage={POSTS_PER_PAGE}
          />
        </section>

        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-24">
          <Sidebar />
        </aside>
      </div>
    </div>
  )
}