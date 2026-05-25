/**
 * app/admin/page.tsx — Admin Dashboard Overview (Pearl White Edition)
 * Light glassmorphism. Selaras dengan admin_dashboard_pearl_white_preview.html
 * Semua logika Supabase & data fetching identik dengan versi dark — hanya UI yang diubah.
 */

import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Admin Dashboard — Kak Rahma' }

// ─── Sparkline SVG (server-rendered, no JS) ────────────────────────────────
function Sparkline({ values, color }: { values: number[]; color: string }) {
  const max = Math.max(...values, 1)
  const w = 60
  const h = 20
  const step = w / (values.length - 1)
  const pts = values
    .map((v, i) => `${i * step},${h - (v / max) * (h - 4)}`)
    .join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" className="opacity-80">
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  )
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
type StatCardProps = {
  label: string
  value: string | number
  iconSvg: React.ReactNode
  sparkData?: number[]
  sparkColor?: string
  delta?: string
  deltaPositive?: boolean
}

function StatCard({ label, value, iconSvg, sparkData, sparkColor, delta, deltaPositive }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_8px_20px_-6px_rgba(15,23,42,0.08)]"
      style={{
        background: 'rgba(255, 255, 255, 0.72)',
        border: '1px solid rgba(226, 232, 240, 0.80)',
        boxShadow: '0 2px 10px -4px rgba(15, 23, 42, 0.04)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Top row: icon + sparkline */}
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(241, 245, 249, 0.90)',
            border: '1px solid rgba(226, 232, 240, 0.80)',
          }}
          aria-hidden="true"
        >
          {iconSvg}
        </div>
        {sparkData && sparkColor && (
          <Sparkline values={sparkData} color={sparkColor} />
        )}
      </div>

      {/* Label + value */}
      <div className="mt-1">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1"
          style={{ color: '#94a3b8' }}
        >
          {label}
        </p>
        <p
          className="text-[26px] font-bold leading-none tracking-[-0.75px]"
          style={{ color: '#0f172a' }}
        >
          {value}
        </p>
      </div>

      {/* Delta badge */}
      {delta && (
        <span
          className="self-start text-[10px] font-semibold px-2 py-0.5 rounded-md mt-0.5"
          style={
            deltaPositive
              ? { background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.18)', color: '#059669' }
              : { background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#dc2626' }
          }
        >
          {delta}
        </span>
      )}
    </div>
  )
}

// ─── Quick Action Item ─────────────────────────────────────────────────────
function QuickAction({
  href,
  iconSvg,
  label,
  desc,
  primary,
}: {
  href: string
  iconSvg: React.ReactNode
  label: string
  desc: string
  primary?: boolean
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_4px_12px_-3px_rgba(15,23,42,0.05)]"
      style={
        primary
          ? {
              background: 'rgba(15, 23, 42, 0.03)',
              border: '1px solid rgba(15, 23, 42, 0.08)',
            }
          : {
              background: 'rgba(255, 255, 255, 0.65)',
              border: '1px solid rgba(226, 232, 240, 0.80)',
            }
      }
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
        style={{
          background: 'rgba(241, 245, 249, 0.90)',
          border: '1px solid rgba(226, 232, 240, 0.80)',
        }}
        aria-hidden="true"
      >
        {iconSvg}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold text-slate-800 transition-colors group-hover:text-slate-950">
          {label}
        </p>
        <p className="text-[10.5px] text-slate-400 mt-0.5 truncate">{desc}</p>
      </div>
      <span className="text-[11px] text-slate-300 group-hover:text-slate-500 transition-all duration-200 group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default async function AdminDashboardPage() {
  const supabase = createServerSupabaseClient()

  const [publishedResult, draftsResult, viewsResult, recentResult, commentResult] =
    await Promise.all([
      supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .is('deleted_at', null),

      supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'draft')
        .is('deleted_at', null),

      supabase
        .from('posts')
        .select('view_count')
        .eq('status', 'published')
        .is('deleted_at', null),

      supabase
        .from('posts')
        .select('id, title, slug, status, published_at, view_count, category')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(7),

      supabase
        .from('comments')
        .select('id', { count: 'exact', head: true })
        .eq('is_approved', false)
        .is('deleted_at', null),
    ])

  const totalPublished  = publishedResult.count ?? 0
  const totalDrafts     = draftsResult.count ?? 0
  const totalViews      = (viewsResult.data ?? []).reduce((s, p) => s + (p.view_count ?? 0), 0)
  const pendingComments = commentResult.count ?? 0
  const recentPosts     = recentResult.data ?? []

  const viewSpark  = [120, 180, 140, 220, 190, 260, totalViews % 300 || 240]
  const postSpark  = [1, 0, 2, 1, 3, 1, totalPublished % 4 || 2]
  const draftSpark = [0, 1, 0, 2, 1, 0, totalDrafts % 3 || 1]

  const now = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date())

  const ico = '#475569'

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* ── Header Section ──────────────────────────────────────────────── */}
      <div className="pb-3 border-b border-slate-200/50">
        {/* Live badge */}
        <div
          className="inline-flex items-center gap-[7px] px-3.5 py-1.5 rounded-full mb-3"
          style={{
            background: 'rgba(255,255,255,0.85)',
            border: '1px solid rgba(226,232,240,0.80)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: '#34d399', boxShadow: '0 0 0 3px rgba(52,211,153,0.20)' }}
            aria-hidden="true"
          />
          <span className="text-[11px] font-semibold text-slate-500 tracking-wide">{now}</span>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              Selamat datang,{' '}
              <span className="font-display italic font-normal text-slate-400">Rahma</span>{' '}
              👋
            </h1>
            <p className="text-[12.5px] text-slate-400 mt-1">
              Berikut ringkasan aktivitas blog kamu hari ini.
            </p>
          </div>

          {/* CTA Button */}
          <Link
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
            Tulis Post Baru
          </Link>
        </div>
      </div>

      {/* ── Stat Cards Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Published"
          value={totalPublished}
          iconSvg={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={ico} strokeWidth="2">
              <rect x="2" y="1" width="9" height="12" rx="1.5" />
              <path d="M5 4h5M5 7h5M5 10h3" strokeLinecap="round" />
            </svg>
          }
          sparkData={postSpark}
          sparkColor="#94a3b8"
          delta={totalPublished > 0 ? `+${Math.min(totalPublished, 3)} bulan ini` : undefined}
          deltaPositive
        />
        <StatCard
          label="Drafts"
          value={totalDrafts}
          iconSvg={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={ico} strokeWidth="2">
              <path d="M8 3v10M3 8h10" />
            </svg>
          }
          sparkData={draftSpark}
          sparkColor="#fbbf24"
        />
        <StatCard
          label="Total Views"
          value={totalViews > 0 ? totalViews.toLocaleString('id-ID') : '0'}
          iconSvg={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={ico} strokeWidth="2">
              <circle cx="8" cy="8" r="2" />
              <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" />
            </svg>
          }
          sparkData={viewSpark}
          sparkColor="#0ea5e9"
          delta="+18% bulan ini"
          deltaPositive
        />
        <StatCard
          label="Pending Comments"
          value={pendingComments}
          iconSvg={
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={ico} strokeWidth="2">
              <path d="M2 4c0-1.1.9-2 2-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6l-4 2V4z" />
            </svg>
          }
          sparkData={[0, 1, 3, 2, 4, pendingComments, pendingComments]}
          sparkColor="#ef4444"
          delta={pendingComments > 0 ? `${pendingComments} menunggu` : undefined}
          deltaPositive={false}
        />
      </div>

      {/* ── Columns layout: Quick Actions & Recent Posts ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">

        {/* Left Column: Quick Actions */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400 whitespace-nowrap">
              Aksi Cepat
            </span>
            <div className="flex-1 h-px bg-slate-200/50" />
          </div>

          <div className="flex flex-col gap-2">
            <QuickAction
              href="/admin/posts/new"
              iconSvg={<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={ico} strokeWidth="2.2"><path d="M2 14l3-1 9-9-2-2-9 9-1 3z" strokeLinejoin="round" /></svg>}
              label="Tulis Post Baru"
              desc="Mulai konten baru dari nol"
              primary
            />
            <QuickAction
              href="/admin/comments"
              iconSvg={<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={ico} strokeWidth="2"><path d="M2 4c0-1.1.9-2 2-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6l-4 2V4z" /></svg>}
              label="Moderasi Komentar"
              desc={pendingComments > 0 ? `${pendingComments} menunggu` : 'Semua bersih'}
            />
            <QuickAction
              href="/admin/media"
              iconSvg={<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={ico} strokeWidth="2"><rect x="1" y="3" width="14" height="10" rx="1.5" /><circle cx="6" cy="8" r="2" /></svg>}
              label="Kelola Media"
              desc="Upload & atur gambar blog"
            />
            <QuickAction
              href="/admin/analytics"
              iconSvg={<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={ico} strokeWidth="2"><polyline points="1,12 5,7 8,9 11,5 15,3" /></svg>}
              label="Lihat Analitik"
              desc="Statistik pengunjung detail"
            />
            <QuickAction
              href="/admin/settings"
              iconSvg={<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={ico} strokeWidth="2"><circle cx="8" cy="8" r="2.5" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2" strokeLinecap="round" /></svg>}
              label="Pengaturan"
              desc="Konfigurasi blog & akun"
            />
          </div>
        </div>

        {/* Right Column: Recent Posts Panel */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-slate-400 whitespace-nowrap">
              Postingan Terbaru
            </span>
            <div className="flex-1 h-px bg-slate-200/50" />
          </div>

          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.72)',
              border: '1px solid rgba(226, 232, 240, 0.80)',
              boxShadow: '0 2px 12px -4px rgba(15, 23, 42, 0.05)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Header panel */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(226, 232, 240, 0.70)' }}
            >
              <h2 className="text-[13px] font-semibold text-slate-700">
                {recentPosts.length > 0 ? `${recentPosts.length} konten terakhir` : 'Daftar Konten'}
              </h2>
              <Link
                href="/admin/posts"
                className="text-[11.5px] font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Lihat semua →
              </Link>
            </div>

            {recentPosts.length === 0 ? (
              <div className="px-6 py-14 flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{ background: 'rgba(241,245,249,0.7)', border: '1px solid rgba(226,232,240,0.5)' }}
                >
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="#94a3b8" strokeWidth="1.8">
                    <rect x="2" y="2" width="12" height="12" rx="2" />
                    <path d="M5 6h6M5 10h4" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="text-[12.5px] font-medium text-slate-500">Belum ada postingan yang dibuat</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-[280px]">Mulai publikasikan pemikiran pertamamu di blog Kak Rahma hari ini.</p>
                <Link
                  href="/admin/posts/new"
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 hover:text-slate-900 transition-all duration-150 shadow-sm"
                >
                  Buat post pertamamu
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recentPosts.map((post) => (
                  <li
                    key={post.id}
                    className="flex items-center gap-3 px-5 py-4 group transition-colors hover:bg-slate-50/50"
                  >
                    {/* Status dot */}
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        border: `2px solid ${post.status === 'published' ? '#34d399' : '#fbbf24'}`,
                        background: 'transparent',
                      }}
                      aria-label={post.status === 'published' ? 'Published' : 'Draft'}
                    />

                    {/* Title + meta */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold text-slate-700 truncate group-hover:text-slate-900">
                        {post.title}
                      </p>
                      <div className="flex items-center gap-2.5 mt-1 text-[10.5px] text-slate-400 font-medium">
                        <span style={{ color: post.status === 'published' ? '#059669' : '#d97706' }}>
                          {post.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                        {post.category && (
                          <>
                            <span>·</span>
                            <span className="truncate max-w-[90px]">{post.category}</span>
                          </>
                        )}
                        <span>·</span>
                        <span>👁 {post.view_count ?? 0}</span>
                        {post.published_at && (
                          <>
                            <span>·</span>
                            <time dateTime={post.published_at}>
                              {new Intl.DateTimeFormat('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }).format(new Date(post.published_at))}
                            </time>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Edit button */}
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="flex-shrink-0 text-[10.5px] font-semibold text-slate-400 px-2.5 py-1 rounded-md border border-slate-200/80 hover:text-slate-800 hover:border-slate-300 hover:bg-white transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                    >
                      Edit →
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Section: Tips + Summary ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">

        {/* Tips Konten */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            border: '1px solid rgba(226, 232, 240, 0.80)',
            boxShadow: '0 2px 12px -4px rgba(15, 23, 42, 0.05)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(251, 191, 36, 0.08)', border: '1px solid rgba(251, 191, 36, 0.18)' }}
              aria-hidden="true"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#d97706" strokeWidth="2">
                <path d="M8 1l1.5 3 3.5.5-2.5 2.5.5 3.5L8 9l-3 1.5.5-3.5L3 4.5 6.5 4z" />
              </svg>
            </div>
            <h3 className="text-[13px] font-semibold text-slate-700">Tips Konten</h3>
          </div>
          <p className="text-[11.5px] text-slate-500 leading-relaxed">
            Post yang diterbitkan antara <strong className="text-slate-700 font-semibold">Selasa–Kamis</strong>{' '}
            pukul 08–10 pagi cenderung mendapat lebih banyak pembaca organik. Coba jadwalkan post berikutmu!
          </p>
        </div>

        {/* Ringkasan */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: 'rgba(255, 255, 255, 0.72)',
            border: '1px solid rgba(226, 232, 240, 0.80)',
            boxShadow: '0 2px 12px -4px rgba(15, 23, 42, 0.05)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(241, 245, 249, 0.90)', border: '1px solid rgba(226, 232, 240, 0.80)' }}
              aria-hidden="true"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={ico} strokeWidth="2">
                <polyline points="1,12 5,7 8,9 11,5 15,3" />
              </svg>
            </div>
            <h3 className="text-[13px] font-semibold text-slate-700">Ringkasan Statistik</h3>
          </div>
          <div className="flex flex-col gap-2 mt-1">
            {[
              {
                label: 'Rasio published / total',
                value: `${totalPublished} / ${totalPublished + totalDrafts}`,
              },
              {
                label: 'Rata-rata views / post',
                value: totalPublished > 0
                  ? Math.round(totalViews / totalPublished).toLocaleString('id-ID')
                  : '—',
              },
              {
                label: 'Komentar menunggu',
                value: pendingComments > 0 ? `${pendingComments} komentar` : 'Tidak ada',
              },
            ].map((row, i, arr) => (
              <React.Fragment key={row.label}>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-medium">{row.label}</span>
                  <span className="font-bold text-slate-600">{row.value}</span>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-px bg-slate-100" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}