// app/(public)/archive/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Archive page — Pearl White Minimalist Glassmorphism.
// Server Component with ISR. Shows all published posts grouped by year,
// filterable by category via searchParams.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata }   from 'next'
import Link                from 'next/link'
import {
  ArrowLeft, Clock, Eye, ArrowUpRight,
  Calendar, Tag, Layers,
} from 'lucide-react'
import { createClient }    from '@/lib/supabase/server'

export const revalidate = 60

export const metadata: Metadata = {
  title:       'Arsip',
  description: 'Semua tulisan dari Kak Rahma, diurutkan berdasarkan tahun.',
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface Post {
  id:           string
  title:        string
  slug:         string
  excerpt:      string | null
  category:     string | null
  tags:         string[] | null
  published_at: string | null
  view_count:   number | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string | null): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(iso))
}

function formatDateShort(iso: string | null): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit', month: 'short',
  }).format(new Date(iso))
}

function getYear(iso: string | null): number {
  if (!iso) return 0
  return new Date(iso).getFullYear()
}

function estimateReadTime(text: string | null | undefined): number {
  if (!text) return 1
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200))
}

// ─── Sub-components ──────────────────────────────────────────────────────────

// Sticky year label on the left rail
function YearLabel({ year }: { year: number }) {
  return (
    <div className="flex items-center gap-3 mb-6 mt-2">
      <span
        className="font-display font-bold text-slate-900 leading-none"
        style={{ fontSize: '2rem', letterSpacing: '-0.04em' }}
      >
        {year}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
    </div>
  )
}

// Individual archive row
function ArchiveRow({ post }: { post: Post }) {
  const readTime = estimateReadTime(post.excerpt)
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group glass-card glass-transition hover:-translate-y-0.5 flex items-start sm:items-center gap-4 p-4 sm:p-5"
    >
      {/* Date column */}
      <div
        className="flex-shrink-0 w-16 text-center"
      >
        <p
          className="font-display font-semibold text-slate-800 leading-tight"
          style={{ fontSize: '1.1rem', letterSpacing: '-0.02em' }}
        >
          {formatDateShort(post.published_at).split(' ')[0]}
        </p>
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mt-0.5">
          {formatDateShort(post.published_at).split(' ')[1]}
        </p>
      </div>

      {/* Divider dot */}
      <div className="flex-shrink-0 flex flex-col items-center self-stretch gap-0">
        <div className="w-px flex-1 bg-slate-100" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-amber-400 transition-colors duration-200 my-1 flex-shrink-0" />
        <div className="w-px flex-1 bg-slate-100" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {post.category && (
          <span
            className="inline-block text-[10px] font-semibold tracking-[0.1em] uppercase text-slate-400 mb-1.5"
            style={{
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.05)',
              padding: '2px 8px',
              borderRadius: '99px',
            }}
          >
            {post.category}
          </span>
        )}
        <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors text-[15px] leading-snug line-clamp-1">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-[12.5px] text-slate-400 leading-relaxed mt-1 line-clamp-1">
            {post.excerpt}
          </p>
        )}
      </div>

      {/* Meta */}
      <div className="flex-shrink-0 flex items-center gap-4 text-[11.5px] text-slate-400 hidden sm:flex">
        <span className="flex items-center gap-1">
          <Clock size={10} strokeWidth={2} />
          {readTime} min
        </span>
        <span className="flex items-center gap-1">
          <Eye size={10} strokeWidth={2} />
          {(post.view_count ?? 0).toLocaleString('id-ID')}
        </span>
        <ArrowUpRight
          size={14}
          strokeWidth={2}
          className="text-slate-300 group-hover:text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
        />
      </div>
    </Link>
  )
}

// Category filter pill
function CategoryPill({
  label,
  count,
  active,
  href,
}: {
  label:  string
  count:  number
  active: boolean
  href:   string
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-medium glass-transition"
      style={active ? {
        background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
        border:     '1px solid rgba(255,255,255,0.08)',
        color:      '#ffffff',
        boxShadow:  '0 4px 12px -3px rgba(15,23,42,0.20)',
      } : {
        background: 'rgba(255,255,255,0.55)',
        border:     '1px solid rgba(255,255,255,0.90)',
        color:      '#64748b',
        boxShadow:  '0 2px 8px -2px rgba(0,0,0,0.03)',
      }}
    >
      {label}
      <span
        className="text-[10px] font-semibold"
        style={{ color: active ? 'rgba(255,255,255,0.55)' : '#94a3b8' }}
      >
        {count}
      </span>
    </Link>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const supabase          = createClient()
  const activeCategory    = searchParams.category ?? null

  // Fetch all published posts
  let query = supabase
    .from('posts')
    .select('id, title, slug, excerpt, category, tags, published_at, view_count')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('published_at', { ascending: false })

  if (activeCategory) {
    query = query.eq('category', activeCategory)
  }

  const { data: posts } = await query
  const allPosts = (posts ?? []) as Post[]

  // Build category counts from all posts (need unfiltered for counts)
  const { data: allForCounts } = await supabase
    .from('posts')
    .select('category')
    .eq('status', 'published')
    .is('deleted_at', null)
    .not('category', 'is', null)

  const categoryCounts = (allForCounts ?? []).reduce<Record<string, number>>((acc, row) => {
    if (row.category) acc[row.category] = (acc[row.category] ?? 0) + 1
    return acc
  }, {})
  const categories = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)

  // Group posts by year
  const byYear = allPosts.reduce<Record<number, Post[]>>((acc, post) => {
    const y = getYear(post.published_at)
    if (!acc[y]) acc[y] = []
    acc[y].push(post)
    return acc
  }, {})
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)

  // Stats
  const totalPosts = allPosts.length
  const totalYears = years.length
  const totalCats  = categories.length

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24">

      {/* ── Back ──────────────────────────────────────────────────────── */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-400 hover:text-slate-700 transition-colors duration-200 mb-10 group"
      >
        <ArrowLeft size={13} strokeWidth={2.5} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
        Kembali ke Blog
      </Link>

      {/* ═══════════════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════════════════ */}
      <div className="glass-panel p-8 sm:p-10 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-400 mb-2">
              Semua Tulisan
            </p>
            <h1
              className="font-display font-bold text-slate-900 leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)', letterSpacing: '-0.03em' }}
            >
              Arsip Lengkap
            </h1>
            <p className="mt-2 text-[14.5px] text-slate-500 leading-relaxed max-w-md">
              Kumpulan semua tulisan, terorganisir berdasarkan waktu. Temukan cerita lama yang mungkin terlewatkan.
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center mb-1">
                <Layers size={12} strokeWidth={2} className="text-slate-400" />
                <p
                  className="font-display font-bold text-slate-900 leading-none"
                  style={{ fontSize: '1.6rem', letterSpacing: '-0.04em' }}
                >
                  {totalPosts}
                </p>
              </div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Artikel</p>
            </div>
            <div
              className="w-px h-10 bg-slate-100"
              aria-hidden="true"
            />
            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center mb-1">
                <Calendar size={12} strokeWidth={2} className="text-slate-400" />
                <p
                  className="font-display font-bold text-slate-900 leading-none"
                  style={{ fontSize: '1.6rem', letterSpacing: '-0.04em' }}
                >
                  {totalYears}
                </p>
              </div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Tahun</p>
            </div>
            <div className="w-px h-10 bg-slate-100" aria-hidden="true" />
            <div className="text-center">
              <div className="flex items-center gap-1.5 justify-center mb-1">
                <Tag size={12} strokeWidth={2} className="text-slate-400" />
                <p
                  className="font-display font-bold text-slate-900 leading-none"
                  style={{ fontSize: '1.6rem', letterSpacing: '-0.04em' }}
                >
                  {totalCats}
                </p>
              </div>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Kategori</p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          CATEGORY FILTER
      ══════════════════════════════════════════════════════════════════ */}
      {categories.length > 0 && (
        <div className="glass-panel px-6 py-4 mb-5">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-slate-400 mr-1 flex-shrink-0">
              Filter
            </p>
            <CategoryPill
              label="Semua"
              count={Object.values(categoryCounts).reduce((a, b) => a + b, 0)}
              active={!activeCategory}
              href="/archive"
            />
            {categories.map(([name, count]) => (
              <CategoryPill
                key={name}
                label={name}
                count={count}
                active={activeCategory === name}
                href={`/archive?category=${encodeURIComponent(name)}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          ARCHIVE LIST — grouped by year
      ══════════════════════════════════════════════════════════════════ */}
      {allPosts.length === 0 ? (
        // Empty state
        <div className="glass-panel p-16 flex flex-col items-center text-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: 'rgba(248,250,252,0.90)',
              border:     '1px solid rgba(226,232,240,0.80)',
            }}
          >
            <Layers size={22} strokeWidth={1.5} className="text-slate-400" />
          </div>
          <div>
            <h3 className="font-display text-xl font-semibold text-slate-800 tracking-tight">
              {activeCategory ? `Belum ada artikel dalam "${activeCategory}"` : 'Belum ada artikel'}
            </h3>
            <p className="text-slate-400 text-[13.5px] leading-relaxed max-w-xs mx-auto mt-1">
              {activeCategory
                ? 'Coba pilih kategori lain atau lihat semua tulisan.'
                : 'Artikel akan muncul di sini setelah diterbitkan.'}
            </p>
            {activeCategory && (
              <Link
                href="/archive"
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-amber-600 hover:text-amber-700 transition-colors mt-4"
              >
                ← Lihat semua
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {years.map((year) => (
            <div key={year}>
              <YearLabel year={year} />
              <div className="flex flex-col gap-2">
                {byYear[year].map((post) => (
                  <ArchiveRow key={post.id} post={post} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          BOTTOM CTA
      ══════════════════════════════════════════════════════════════════ */}
      {allPosts.length > 0 && (
        <div
          className="mt-10 rounded-[20px] px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{
            background: 'linear-gradient(145deg, rgba(15,23,42,0.94) 0%, rgba(51,65,85,0.96) 100%)',
            border:     '1px solid rgba(255,255,255,0.06)',
            boxShadow:  '0 20px 60px -15px rgba(15,23,42,0.20), inset 0 1px 0 rgba(255,255,255,0.05)',
          }}
        >
          <div className="text-center sm:text-left">
            <p className="font-display text-[1.15rem] font-semibold text-white leading-snug">
              Sudah baca semua?
            </p>
            <p className="text-[13px] text-white/45 mt-1">
              Kembali ke beranda untuk tulisan terbaru.
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-[13.5px] font-semibold text-slate-900 px-5 py-2.5 rounded-xl glass-transition hover:opacity-90 active:scale-[0.98] flex-shrink-0"
            style={{
              background: '#ffffff',
              boxShadow:  '0 4px 16px -4px rgba(255,255,255,0.20)',
            }}
          >
            Ke Beranda
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      )}

    </div>
  )
}