// components/public/PostCard.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Pearl White Minimalist Glassmorphism — individual post card.
// glass-panel + hover lift. Monochrome tag pills. Amber accent only on CTA.
// ─────────────────────────────────────────────────────────────────────────────

import Image  from 'next/image'
import Link   from 'next/link'
import { Eye, Clock, ArrowUpRight } from 'lucide-react'
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function estimateReadTime(text: string | null | undefined): number {
  if (!text) return 1
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200))
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(iso))
}

// ─── Component ───────────────────────────────────────────────────────────────

export function PostCard({ post }: { post: Post }) {
  const readTime = estimateReadTime(post.excerpt)

  return (
    <article
      className="group glass-panel glass-transition hover:-translate-y-1 overflow-hidden"
      style={{ boxShadow: '0 10px 40px -10px rgba(0,0,0,0.04), 0 1px 3px -1px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.9)' }}
    >

      {/* ── Cover image ─────────────────────────────────────────────── */}
      {post.cover_image_url ? (
        <Link href={`/posts/${post.slug}`} className="block overflow-hidden">
          <div className="relative h-48 w-full">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            {/* Subtle bottom gradient for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/8 to-transparent" />
          </div>
        </Link>
      ) : (
        // Placeholder — pearl gradient, letter monogram
        <Link href={`/posts/${post.slug}`} className="block">
          <div
            className="h-48 w-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(ellipse 80% 80% at 50% 50%, #f8fafc 0%, #f1f5f9 100%)',
            }}
          >
            <span
              className="font-display text-6xl font-bold text-slate-200 select-none"
              aria-hidden="true"
            >
              {post.title.charAt(0).toUpperCase()}
            </span>
          </div>
        </Link>
      )}

      {/* ── Card body ───────────────────────────────────────────────── */}
      <div className="p-6 flex flex-col gap-3">

        {/* Category — monochrome pill */}
        {post.category && (
          <span className="tag-pill self-start">{post.category}</span>
        )}

        {/* Title */}
        <Link href={`/posts/${post.slug}`}>
          <h2 className="font-display text-[1.15rem] font-semibold text-slate-900 tracking-tight leading-snug line-clamp-2 group-hover:text-slate-700 transition-colors duration-200">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-slate-500 text-[13.5px] leading-relaxed line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {/* ── Meta row ────────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between pt-3 mt-1"
          style={{ borderTop: '1px solid rgba(226,232,240,0.70)' }}
        >
          <div className="flex items-center gap-3 text-slate-400 text-[11.5px]">
            <time dateTime={post.published_at ?? ''} className="text-slate-500 font-medium">
              {formatDate(post.published_at)}
            </time>

            <span className="flex items-center gap-1">
              <Clock size={11} strokeWidth={2} aria-hidden="true" />
              {readTime} min
            </span>

            <span className="flex items-center gap-1">
              <Eye size={11} strokeWidth={2} aria-hidden="true" />
              {(post.view_count ?? 0).toLocaleString('id-ID')}
            </span>
          </div>

          {/* Read more — amber accent, the ONE coloured element per card */}
          <Link
            href={`/posts/${post.slug}`}
            aria-label={`Baca artikel: ${post.title}`}
            className="flex items-center gap-1 text-[12px] font-semibold text-amber-600 hover:text-amber-700 transition-colors duration-150"
          >
            Baca
            <ArrowUpRight size={12} strokeWidth={2.5} aria-hidden="true" />
          </Link>
        </div>

      </div>
    </article>
  )
}

export default PostCard