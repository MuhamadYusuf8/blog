/**
 * app/admin/posts/page.tsx — Posts Management Page (Pearl White Edition)
 * Logika data fetching identik, hanya UI dirombak ke pearl white.
 */

import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PostsTable } from '@/components/admin/PostsTable'

export const metadata: Metadata = { title: 'Kelola Postingan — Kak Rahma' }

export default async function AdminPostsPage() {
  const supabase = createServerSupabaseClient()

  const { data: activePosts } = await supabase
    .from('posts')
    .select('id, title, slug, status, category, view_count, published_at, created_at, deleted_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  const { data: trashedPosts } = await supabase
    .from('posts')
    .select('id, title, slug, status, category, view_count, published_at, created_at, deleted_at')
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false })

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* ── Header Section ──────────────────────────────────────────────── */}
      <div className="pb-3 border-b border-slate-200/50">
        {/* Section label ornament */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-[26px] h-[26px] rounded-[8px] flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(241,245,249,0.90)',
              border: '1px solid rgba(226,232,240,0.80)',
            }}
            aria-hidden="true"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#475569" strokeWidth="2">
              <path d="M2 4h12M2 8h8M2 12h6" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Manajemen Konten
          </span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight mb-1"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Kelola Postingan
            </h1>
            <p className="text-[12.5px] text-slate-400">
              {(activePosts?.length ?? 0)} aktif · {(trashedPosts?.length ?? 0)} di sampah
            </p>
          </div>

          {/* CTA Button */}
          <a
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-xs font-semibold transition-all duration-200 hover:opacity-95 hover:shadow-lg flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #0f172a, #334155)',
              boxShadow: '0 4px 15px -3px rgba(15,23,42,0.25)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.2">
              <path d="M2 14l3-1 9-9-2-2-9 9-1 3z" strokeLinejoin="round" />
            </svg>
            Post Baru
          </a>
        </div>
      </div>

      {/* ── Table component ────────────────────────────────────────── */}
      <PostsTable
        activePosts={activePosts ?? []}
        trashedPosts={trashedPosts ?? []}
      />
    </div>
  )
}