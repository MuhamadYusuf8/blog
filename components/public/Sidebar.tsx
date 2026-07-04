// components/public/Sidebar.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Pearl White Minimalist — async Server Component sidebar.
// Single glass-panel, internal sections separated by pearl dividers.
// Monochrome category pills; no amber except hover.
// ─────────────────────────────────────────────────────────────────────────────

import Image  from 'next/image'
import Link   from 'next/link'
import { Tag, FileText, Clock, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

// ─── Types ───────────────────────────────────────────────────────────────────

interface CategoryRow { category: string | null }
interface RecentPost  { slug: string; title: string; published_at: string | null }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(iso))
}

// ─── Section heading ─────────────────────────────────────────────────────────

function SectionHeading({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      {/* Icon container */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          background: 'rgba(124,58,237,0.15)',
          border:     '1px solid rgba(124,58,237,0.3)',
        }}
      >
        <Icon size={13} strokeWidth={2} className="text-violet-400" aria-hidden="true" />
      </div>
      <h2 className="font-display text-[13.5px] font-semibold text-white tracking-tight">
        {label}
      </h2>
    </div>
  )
}

// ─── Divider ───────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="w-1 h-1 rounded-full bg-violet-400/40" />
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-transparent" />
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export default async function Sidebar() {
  const supabase = createClient()

  const [settingsResult, categoryResult, recentResult] = await Promise.all([
    supabase.from('site_settings').select('bio, avatar_url, site_title').single(),
    supabase
      .from('posts')
      .select('category')
      .eq('status', 'published')
      .is('deleted_at', null)
      .not('category', 'is', null),
    supabase
      .from('posts')
      .select('slug, title, published_at')
      .eq('status', 'published')
      .is('deleted_at', null)
      .order('published_at', { ascending: false })
      .limit(5),
  ])

  const settings  = settingsResult.data
  const allCats   = (categoryResult.data ?? []) as CategoryRow[]
  const recent    = (recentResult.data   ?? []) as RecentPost[]

  let siteTitle = settings?.site_title ?? 'Rahmayolan'
  if (siteTitle === 'KakRahma' || siteTitle === 'Kak Rahma' || siteTitle === 'Kak Rahma Blog') {
    siteTitle = 'Rahmayolan'
  }

  const categoryCounts = allCats.reduce<Record<string, number>>((acc, row) => {
    if (row.category) acc[row.category] = (acc[row.category] ?? 0) + 1
    return acc
  }, {})
  const categories = Object.entries(categoryCounts).sort(([, a], [, b]) => b - a)

  return (
    <div 
      className="p-6 flex flex-col rounded-3xl border border-white/10 backdrop-blur-2xl"
      style={{ background: 'rgba(255,255,255,0.03)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
    >

      {/* ── About ────────────────────────────────────────────────────── */}
      <section aria-label="Tentang Penulis">
        <SectionHeading icon={User} label="Tentang Penulis" />

        <div className="flex flex-col items-center text-center gap-4">

          {/* Avatar */}
          {settings?.avatar_url ? (
            <div
              className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0"
              style={{
                border:    '2px solid rgba(124,58,237,0.4)',
                boxShadow: '0 0 20px rgba(124,58,237,0.3)',
              }}
            >
              <Image
                src={settings.avatar_url}
                alt={`Foto ${siteTitle}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>
          ) : (
            // Initials
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                border:     '2px solid rgba(255,255,255,0.2)',
                boxShadow:  '0 0 20px rgba(124,58,237,0.4)',
              }}
            >
              <span className="font-display text-2xl font-bold text-white">
                {siteTitle.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div>
            <p className="font-display font-semibold text-white text-[15px] tracking-tight">
              {siteTitle}
            </p>
            {settings?.bio && (
              <p className="text-slate-400 text-[13px] leading-relaxed mt-1.5">
                {settings.bio}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <>
          <Divider />
          <section aria-label="Kategori">
            <SectionHeading icon={Tag} label="Kategori" />

            <div className="flex flex-wrap gap-2">
              {categories.map(([name, count]) => (
                <Link
                  key={name}
                  href={`/category/${encodeURIComponent(name.toLowerCase().replace(/\s+/g, '-'))}`}
                  className="px-3 py-1.5 rounded-xl text-[12px] font-medium text-slate-300 hover:text-white hover:border-violet-500/40 transition-all flex items-center gap-1.5 group"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span>{name}</span>
                  <span className="text-[10.5px] font-semibold text-violet-400 group-hover:text-violet-300 transition-colors">
                    {count}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ── Recent Posts ─────────────────────────────────────────────── */}
      {recent.length > 0 && (
        <>
          <Divider />
          <section aria-label="Tulisan Terbaru">
            <SectionHeading icon={FileText} label="Tulisan Terbaru" />

            <ul className="flex flex-col gap-2.5" role="list">
              {recent.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="p-3.5 rounded-xl flex flex-col gap-1 transition-all group block"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <span className="text-[13px] font-medium text-slate-200 group-hover:text-violet-300 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <Clock size={10} strokeWidth={2} aria-hidden="true" />
                      {formatDate(post.published_at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

    </div>
  )
}