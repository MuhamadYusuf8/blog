import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PostsTable } from '@/components/admin/PostsTable'
import { PenLine, FileText } from 'lucide-react'

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

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div>
          {/* Label ornament */}
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa' }}
          >
            <FileText size={11} />
            Manajemen Konten
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight leading-tight mb-1">
            Kelola Postingan
          </h1>
          <p className="text-sm text-slate-500">
            <span className="text-slate-400 font-medium">{activePosts?.length ?? 0}</span> aktif ·{' '}
            <span className="text-slate-400 font-medium">{trashedPosts?.length ?? 0}</span> di sampah
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 transition-all duration-200"
          style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #6d28d9 100%)',
            boxShadow: '0 0 20px rgba(124,58,237,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            border: '1px solid rgba(124,58,237,0.4)',
          }}
        >
          <PenLine size={14} />
          Post Baru
        </Link>
      </div>

      {/* ── Posts Table ─────────────────────────────────────────────────── */}
      <PostsTable
        activePosts={activePosts ?? []}
        trashedPosts={trashedPosts ?? []}
      />
    </div>
  )
}