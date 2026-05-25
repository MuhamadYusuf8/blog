// components/public/PostFeed.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Pearl White — post grid + pagination. Empty state with pearl glass panel.
// ─────────────────────────────────────────────────────────────────────────────

import Link          from 'next/link'
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'
import PostCard      from './PostCard'
import type { Database } from '@/lib/supabase/types'

type Post = Pick<
  Database['public']['Tables']['posts']['Row'],
  | 'id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'cover_image_url'
  | 'category'
  | 'tags'
  | 'published_at'
  | 'view_count'
>

interface PostFeedProps {
  posts:          Post[]
  totalCount:     number
  currentPage:    number
  postsPerPage?:  number
  basePath?:      string
}

// ─── Pagination ──────────────────────────────────────────────────────────────

function Pagination({
  currentPage,
  totalPages,
  basePath = '',
}: {
  currentPage: number
  totalPages:  number
  basePath?:   string
}) {
  if (totalPages <= 1) return null

  const pageHref = (p: number) => {
    const prefix = basePath || '/'
    return p === 1 ? prefix : `${prefix}${prefix.includes('?') ? '&' : '?'}page=${p}`
  }

  const pages   = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)

  const withEllipsis: (number | 'ellipsis')[] = []
  let prev: number | null = null
  for (const p of visible) {
    if (prev !== null && p - prev > 1) withEllipsis.push('ellipsis')
    withEllipsis.push(p)
    prev = p
  }

  // Shared pill styles
  const pill = 'flex items-center justify-center w-9 h-9 text-sm font-medium glass-transition'

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12">

      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className={`${pill} glass-card rounded-xl text-slate-600 hover:text-slate-900 hover:shadow-glass-card-hover`}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={15} strokeWidth={2} />
        </Link>
      ) : (
        <span className={`${pill} glass-card rounded-xl text-slate-300 cursor-not-allowed`}>
          <ChevronLeft size={15} strokeWidth={2} />
        </span>
      )}

      {/* Page numbers */}
      {withEllipsis.map((item, idx) =>
        item === 'ellipsis' ? (
          <span
            key={`ell-${idx}`}
            className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm"
          >
            ···
          </span>
        ) : (
          <Link
            key={item}
            href={pageHref(item)}
            aria-current={item === currentPage ? 'page' : undefined}
            className={[
              pill,
              'rounded-[10px]',
              item === currentPage
                ? 'text-white'
                : 'glass-card text-slate-600 hover:text-slate-900',
            ].join(' ')}
            style={item === currentPage ? {
              background:  'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
              border:      '1px solid rgba(255,255,255,0.10)',
              boxShadow:   '0 4px 12px -3px rgba(15,23,42,0.25)',
            } : undefined}
          >
            {item}
          </Link>
        ),
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className={`${pill} glass-card rounded-xl text-slate-600 hover:text-slate-900`}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight size={15} strokeWidth={2} />
        </Link>
      ) : (
        <span className={`${pill} glass-card rounded-xl text-slate-300 cursor-not-allowed`}>
          <ChevronRight size={15} strokeWidth={2} />
        </span>
      )}

    </nav>
  )
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="glass-panel p-16 flex flex-col items-center text-center gap-5">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background: 'rgba(248,250,252,0.90)',
          border:     '1px solid rgba(226,232,240,0.80)',
          boxShadow:  '0 4px 16px -4px rgba(0,0,0,0.04)',
        }}
      >
        <BookOpen size={24} strokeWidth={1.5} className="text-slate-400" />
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-xl font-semibold text-slate-800 tracking-tight">
          Belum ada artikel
        </h3>
        <p className="text-slate-400 text-[13.5px] leading-relaxed max-w-xs mx-auto">
          Artikel akan muncul di sini setelah diterbitkan. Kembali lagi segera.
        </p>
      </div>
    </div>
  )
}

export const POSTS_PER_PAGE = 6

// ─── Feed ────────────────────────────────────────────────────────────────────

export function PostFeed({
  posts,
  totalCount,
  currentPage,
  postsPerPage = POSTS_PER_PAGE,
  basePath = '',
}: PostFeedProps) {
  const totalPages = Math.ceil(totalCount / postsPerPage)

  if (posts.length === 0) return <EmptyState />

  return (
    <div>
      {/* Result meta */}
      <p className="text-[12px] text-slate-400 font-medium mb-6 tracking-wide">
        <span className="text-slate-600 font-semibold">{totalCount}</span> artikel
        {totalPages > 1 && (
          <>
            {' '}· Halaman{' '}
            <span className="text-slate-600 font-semibold">{currentPage}</span>
            {' '}dari{' '}
            <span className="text-slate-600 font-semibold">{totalPages}</span>
          </>
        )}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} basePath={basePath} />
    </div>
  )
}

export default PostFeed