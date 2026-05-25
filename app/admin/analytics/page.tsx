import { createServerSupabaseClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analytics | Admin',
}

const MEDAL = ['🥇', '🥈', '🥉']

export default async function AnalyticsPage() {
  const supabase = createServerSupabaseClient()

  const { data: topPosts, error } = await supabase
    .from('posts')
    .select('id, title, slug, view_count, category, published_at')
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('view_count', { ascending: false })
    .limit(10)

  if (error) console.error('[AnalyticsPage]', error)

  const posts = topPosts ?? []
  const maxViews = posts[0]?.view_count ?? 1

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.4px] text-slate-900">
            Analytics
          </h1>
          <p className="text-[12.5px] text-slate-400 mt-0.5 font-medium">
            Pantau performa konten dan trafik blog kamu.
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid rgba(226,232,240,0.80)',
            boxShadow: '0 2px 8px -3px rgba(15,23,42,0.06)',
          }}
          aria-hidden="true"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#64748b" strokeWidth="1.8">
            <path d="M1 12l4-4 3 3 4-5 3 2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1 15h14" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* ── Top Posts Leaderboard ────────────────────────────────────────── */}
      <section>
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid rgba(226,232,240,0.80)',
            boxShadow: '0 2px 12px -4px rgba(15,23,42,0.05)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Panel header */}
          <div
            className="px-5 py-4 flex items-center gap-2"
            style={{ borderBottom: '1px solid rgba(226,232,240,0.70)' }}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(241,245,249,0.90)',
                border: '1px solid rgba(226,232,240,0.80)',
              }}
              aria-hidden="true"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#64748b" strokeWidth="2">
                <path d="M8 2v4M4 6v6M12 4v8M2 14h12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-[13px] font-semibold text-slate-700">Top 10 Posts by Views</h2>
            {posts.length > 0 && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-1"
                style={{
                  background: 'rgba(241,245,249,0.90)',
                  border: '1px solid rgba(226,232,240,0.80)',
                  color: '#64748b',
                }}
              >
                {posts.length}
              </span>
            )}
          </div>

          {/* Content */}
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: 'rgba(241,245,249,0.70)',
                  border: '1px solid rgba(226,232,240,0.50)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                  <path d="M8 2v4M4 6v6M12 4v8M2 14h12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[13px] font-semibold text-slate-500">Belum ada data</p>
              <p className="text-[11.5px] text-slate-400 mt-1">
                Views akan muncul di sini setelah post dipublikasikan.
              </p>
            </div>
          ) : (
            <div>
              {posts.map((post, index) => {
                const barWidth = Math.max(3, Math.round((post.view_count / maxViews) * 100))
                const isTop3 = index < 3

                // Bar color gradient per rank
                const barGradient =
                  index === 0
                    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)'
                    : index === 1
                    ? 'linear-gradient(90deg, #94a3b8, #cbd5e1)'
                    : index === 2
                    ? 'linear-gradient(90deg, #b45309, #d97706)'
                    : 'linear-gradient(90deg, #6366f1, #818cf8)'

                return (
                  <div
                    key={post.id}
                    className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50/60"
                    style={{
                      borderBottom:
                        index < posts.length - 1
                          ? '1px solid rgba(226,232,240,0.50)'
                          : undefined,
                    }}
                  >
                    {/* Rank */}
                    <div className="w-8 text-center flex-shrink-0">
                      {isTop3 ? (
                        <span className="text-base leading-none">{MEDAL[index]}</span>
                      ) : (
                        <span
                          className="text-[11px] font-bold font-mono tabular-nums"
                          style={{ color: '#cbd5e1' }}
                        >
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* Post info + bar */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-[13px] font-semibold text-slate-700 hover:text-slate-900 transition-colors truncate block"
                      >
                        {post.title}
                      </Link>

                      <div className="flex items-center gap-2">
                        {post.category && (
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: 'rgba(99,102,241,0.08)',
                              border: '1px solid rgba(99,102,241,0.18)',
                              color: '#4338ca',
                            }}
                          >
                            {post.category}
                          </span>
                        )}
                        {post.published_at && (
                          <span className="text-[10.5px] text-slate-400 font-medium">
                            {new Date(post.published_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(226,232,240,0.60)' }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%`, background: barGradient }}
                        />
                      </div>
                    </div>

                    {/* View count */}
                    <div className="flex-shrink-0 text-right min-w-[56px]">
                      <p className="text-[14px] font-bold text-slate-800 tabular-nums">
                        {post.view_count.toLocaleString('id-ID')}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">views</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Vercel Analytics link ────────────────────────────────────────── */}
      <section>
        <div
          className="rounded-2xl p-5 flex items-center justify-between gap-4"
          style={{
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid rgba(226,232,240,0.80)',
            boxShadow: '0 2px 12px -4px rgba(15,23,42,0.05)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'rgba(241,245,249,0.90)',
                border: '1px solid rgba(226,232,240,0.80)',
              }}
              aria-hidden="true"
            >
              {/* Vercel triangle */}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="#64748b">
                <path d="M8 1L15.5 14.5H0.5L8 1Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-[13px] font-semibold text-slate-700">Vercel Analytics</h2>
              <p className="text-[11.5px] text-slate-400 mt-0.5">
                Lihat visitor real-time, page views, dan metrik performa di Vercel.
              </p>
            </div>
          </div>

          <a
            href="https://vercel.com/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all hover:-translate-y-[1px]"
            style={{
              background: 'rgba(15,23,42,0.05)',
              border: '1px solid rgba(15,23,42,0.10)',
              color: '#0f172a',
            }}
          >
            Buka Dashboard
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 13L13 3M13 3H7M13 3v6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

    </div>
  )
}