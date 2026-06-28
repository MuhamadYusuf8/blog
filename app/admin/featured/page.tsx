/**
 * app/admin/featured/page.tsx — Featured Posts Manager (Dark Edition)
 */
import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Star, Eye, Calendar } from 'lucide-react'

export const metadata: Metadata = { title: 'Featured Posts — Kak Rahma' }

export default async function AdminFeaturedPage() {
  const supabase = createServerSupabaseClient()

  const { data: featuredPosts } = await supabase
    .from('posts')
    .select('id, title, slug, status, category, view_count, published_at')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('view_count', { ascending: false })
    .limit(10)

  function formatDate(d: string | null) {
    if (!d) return '—'
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(d))
  }

  const CATEGORY_COLORS: Record<string, string> = {
    Teknologi: '#7c3aed', Desain: '#10b981', Penulisan: '#0ea5e9',
    Budaya: '#f59e0b', Webtoon: '#ec4899', Ilustrasi: '#8b5cf6',
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div>
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}
          >
            <Star size={11} /> Konten Unggulan
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight mb-1">Featured Posts</h1>
          <p className="text-sm text-slate-500">Postingan berperforma tinggi · diurutkan berdasarkan tayangan</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl px-5 py-4"
        style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}
      >
        <p className="text-sm text-amber-300 font-medium mb-1">⭐ Tentang Featured Posts</p>
        <p className="text-xs text-amber-400/70 leading-relaxed">
          Halaman ini menampilkan postingan dengan tayangan tertinggi. Untuk menandai post sebagai featured secara manual,
          fitur toggle akan segera tersedia. Saat ini, featured otomatis berdasarkan popularitas.
        </p>
      </div>

      {/* Posts Grid */}
      {!featuredPosts || featuredPosts.length === 0 ? (
        <div className="rounded-2xl py-20 text-center"
          style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <Star size={32} className="text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Belum ada postingan yang dipublikasikan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {featuredPosts.map((post, idx) => {
            const catColor = CATEGORY_COLORS[post.category ?? ''] ?? '#64748b'
            return (
              <div key={post.id}
                className="group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 hover:bg-white/[0.03]"
                style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                {/* Rank */}
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{
                    background: idx === 0 ? 'rgba(245,158,11,0.2)' : idx === 1 ? 'rgba(148,163,184,0.12)' : idx === 2 ? 'rgba(180,120,60,0.15)' : 'rgba(255,255,255,0.04)',
                    color: idx === 0 ? '#fbbf24' : idx === 1 ? '#94a3b8' : idx === 2 ? '#c08040' : '#475569',
                    border: `1px solid ${idx === 0 ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)'}`,
                  }}
                >
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors truncate">{post.title}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {post.category && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ color: catColor, background: `${catColor}18`, border: `1px solid ${catColor}30` }}
                      >{post.category}</span>
                    )}
                    <span className="text-[10px] text-slate-600 flex items-center gap-1">
                      <Calendar size={9} /> {formatDate(post.published_at)}
                    </span>
                  </div>
                </div>

                {/* Views */}
                <div className="flex items-center gap-1.5 flex-shrink-0"
                  style={{ color: idx < 3 ? '#fbbf24' : '#64748b' }}
                >
                  <Eye size={13} />
                  <span className="text-sm font-bold tabular-nums">{post.view_count.toLocaleString('id-ID')}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
