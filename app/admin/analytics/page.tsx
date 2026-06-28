import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import { BarChart2, Eye, ExternalLink } from 'lucide-react'

export const metadata: Metadata = { title: 'Analitik — Kak Rahma' }

const MEDAL = ['🥇', '🥈', '🥉']

const CATEGORY_COLORS: Record<string, string> = {
  Teknologi: '#7c3aed', Desain: '#10b981', Penulisan: '#0ea5e9',
  Budaya: '#f59e0b', Webtoon: '#ec4899', Ilustrasi: '#8b5cf6',
}

export default async function AnalyticsPage() {
  const supabase = createServerSupabaseClient()

  const { data: topPosts } = await supabase
    .from('posts')
    .select('id, title, slug, view_count, category, published_at')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('view_count', { ascending: false })
    .limit(10)

  const posts = topPosts ?? []
  const maxViews = posts[0]?.view_count ?? 1
  const totalViews = posts.reduce((sum, p) => sum + p.view_count, 0)

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div>
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}
          >
            <BarChart2 size={11} /> Performa Konten
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight mb-1">Analitik</h1>
          <p className="text-sm text-slate-500">Pantau performa konten dan trafik blog kamu.</p>
        </div>
        <a href="https://vercel.com/analytics" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 flex-shrink-0 transition-all hover:text-white"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <ExternalLink size={13} /> Vercel Dashboard
        </a>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Tayangan', value: totalViews.toLocaleString('id-ID'), accent: '#10b981', accentRgb: '16,185,129' },
          { label: 'Post Dipublikasikan', value: posts.length.toString(), accent: '#7c3aed', accentRgb: '124,58,237' },
          { label: 'Rata-rata Views', value: posts.length ? Math.round(totalViews / posts.length).toLocaleString('id-ID') : '0', accent: '#0ea5e9', accentRgb: '14,165,233' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)' }}
          >
            <p className="text-xs text-slate-500 mb-2 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold tabular-nums" style={{ color: stat.accent }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Top Posts Leaderboard */}
      <section>
        <div className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
        >
          <div className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)' }}
              >
                <BarChart2 size={14} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-100">Top 10 Posts by Views</h2>
                <p className="text-xs text-slate-500">{posts.length} postingan dianalisis</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.07)' }}
            >{posts.length}</span>
          </div>

          {posts.length === 0 ? (
            <div className="py-16 text-center">
              <BarChart2 size={32} className="text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">Belum ada data tayangan</p>
              <p className="text-sm text-slate-600 mt-1">Views akan muncul setelah post dipublikasikan.</p>
            </div>
          ) : (
            <div>
              {posts.map((post, index) => {
                const barWidth = Math.max(4, Math.round((post.view_count / maxViews) * 100))
                const catColor = CATEGORY_COLORS[post.category ?? ''] ?? '#64748b'
                const barGradient = index === 0
                  ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  : index === 1 ? 'linear-gradient(90deg, #94a3b8, #cbd5e1)'
                  : index === 2 ? 'linear-gradient(90deg, #c08040, #d97706)'
                  : 'linear-gradient(90deg, #7c3aed, #a78bfa)'

                return (
                  <div key={post.id}
                    className="flex items-center gap-4 px-5 py-4 group hover:bg-white/[0.02] transition-colors duration-200"
                    style={{ borderBottom: index < posts.length - 1 ? '1px solid rgba(255,255,255,0.035)' : 'none' }}
                  >
                    {/* Rank */}
                    <div className="w-8 text-center flex-shrink-0">
                      {index < 3
                        ? <span className="text-base">{MEDAL[index]}</span>
                        : <span className="text-[11px] font-bold font-mono text-slate-600">#{index + 1}</span>
                      }
                    </div>

                    {/* Info + bar */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <Link href={`/admin/posts/${post.id}/edit`}
                        className="text-[13px] font-semibold text-slate-200 hover:text-white transition-colors truncate block"
                      >
                        {post.title}
                      </Link>
                      <div className="flex items-center gap-2 flex-wrap">
                        {post.category && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                            style={{ color: catColor, background: `${catColor}18`, border: `1px solid ${catColor}30` }}
                          >{post.category}</span>
                        )}
                        {post.published_at && (
                          <span className="text-[10px] text-slate-600">
                            {new Date(post.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      {/* Progress bar */}
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div className="h-full rounded-full" style={{ width: `${barWidth}%`, background: barGradient, transition: 'width 0.8s ease' }} />
                      </div>
                    </div>

                    {/* View count */}
                    <div className="flex-shrink-0 text-right min-w-[56px]">
                      <div className="flex items-center gap-1 justify-end text-slate-400">
                        <Eye size={11} />
                        <span className="text-sm font-bold text-slate-100 tabular-nums">{post.view_count.toLocaleString('id-ID')}</span>
                      </div>
                      <p className="text-[10px] text-slate-600">views</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}