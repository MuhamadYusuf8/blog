// app/(public)/about/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// About page — Pearl White Minimalist Glassmorphism.
// Professional & clean (portofolio style).
// Fetches bio, avatar, site_title, dan social links dari site_settings.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Image             from 'next/image'
import Link              from 'next/link'
import {
  Mail, BookOpen,
  PenLine, ArrowLeft, ExternalLink,
  Feather, Heart, Bookmark,
} from 'lucide-react'
import { Instagram, Twitter } from '@/components/ui/Icons'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title:       'Tentang',
  description: 'Kenalan lebih dekat dengan Kak Rahma — penulis dan blogger.',
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface SiteSettings {
  site_title:       string | null
  bio:              string | null
  avatar_url:       string | null
  email:            string | null
  instagram_url:    string | null
  twitter_url:      string | null
}

// ─── Writing values data ─────────────────────────────────────────────────────

const WRITING_VALUES = [
  {
    icon:  Feather,
    title: 'Jujur',
    body:  'Setiap tulisan lahir dari pengalaman nyata. Tidak ada yang dibuat-buat — hanya cerita yang benar-benar dirasakan.',
  },
  {
    icon:  Heart,
    title: 'Hangat',
    body:  'Menulis seperti berbicara dengan sahabat lama. Tidak perlu formal, yang penting sampai ke hati.',
  },
  {
    icon:  Bookmark,
    title: 'Bermakna',
    body:  'Setiap kata dipilih dengan hati-hati. Bukan sekadar mengisi halaman, tapi meninggalkan sesuatu yang bisa dibawa pulang.',
  },
]

// ─── Stat item ───────────────────────────────────────────────────────────────

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <span
        className="font-display text-[2.2rem] font-bold text-slate-900 leading-none"
        style={{ letterSpacing: '-0.03em' }}
      >
        {value}
      </span>
      <span className="text-[12px] font-medium text-slate-400 tracking-wide uppercase">
        {label}
      </span>
    </div>
  )
}

// ─── Social button ───────────────────────────────────────────────────────────

function SocialBtn({
  href,
  icon: Icon,
  label,
  handle,
}: {
  href:   string
  icon:   React.ElementType
  label:  string
  handle: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group glass-card glass-transition hover:-translate-y-0.5 flex items-center gap-3 px-4 py-3"
      aria-label={label}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: 'rgba(241,245,249,0.90)',
          border:     '1px solid rgba(226,232,240,0.80)',
        }}
      >
        <Icon size={16} strokeWidth={2} className="text-slate-600 group-hover:text-slate-900 transition-colors" />
      </div>
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-slate-400 tracking-wide uppercase">{label}</p>
        <p className="text-[13.5px] font-medium text-slate-700 group-hover:text-slate-900 transition-colors truncate">
          {handle}
        </p>
      </div>
      <ExternalLink
        size={12}
        strokeWidth={2}
        className="ml-auto text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0"
        aria-hidden="true"
      />
    </a>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const supabase = createClient()

  // Parallel fetches
  const [settingsResult, statsResult] = await Promise.all([
    supabase
      .from('site_settings')
      .select('site_title, bio, avatar_url, email, instagram_url, twitter_url')
      .single(),
    supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published')
      .is('deleted_at', null),
  ])

  const s           = settingsResult.data as SiteSettings | null
  const totalPosts  = statsResult.count ?? 0
  const siteTitle   = s?.site_title ?? 'Kak Rahma'
  const bio         = s?.bio        ?? 'Penulis dan blogger yang gemar berbagi cerita, refleksi, dan pemikiran sehari-hari tentang kehidupan, keluarga, dan hal-hal kecil yang sering terlewatkan.'

  // Social links — only show if configured
  const socials = [
    s?.email         && { href: `mailto:${s.email}`,    icon: Mail,      label: 'Email',     handle: s.email },
    s?.instagram_url && { href: s.instagram_url,         icon: Instagram, label: 'Instagram', handle: s.instagram_url.replace(/^https?:\/\/(www\.)?instagram\.com\/?/, '@').replace(/\/$/, '') },
    s?.twitter_url   && { href: s.twitter_url,           icon: Twitter,   label: 'Twitter / X', handle: s.twitter_url.replace(/^https?:\/\/(www\.)?twitter\.com\/?/, '@').replace(/^https?:\/\/(www\.)?x\.com\/?/, '@').replace(/\/$/, '') },
  ].filter(Boolean) as { href: string; icon: React.ElementType; label: string; handle: string }[]

  // Fallback socials for demo when DB has no entries
  const displaySocials = socials.length > 0 ? socials : [
    { href: 'mailto:halo@kakrahma.com', icon: Mail,      label: 'Email',     handle: 'halo@kakrahma.com' },
    { href: '#',                         icon: Instagram, label: 'Instagram', handle: '@kakrahma' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24">

      {/* ── Back link ─────────────────────────────────────────────────── */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-400 hover:text-slate-700 transition-colors duration-200 mb-10 group"
      >
        <ArrowLeft
          size={13}
          strokeWidth={2.5}
          className="group-hover:-translate-x-0.5 transition-transform duration-200"
          aria-hidden="true"
        />
        Kembali ke Blog
      </Link>

      {/* ═══════════════════════════════════════════════════════════════
          HERO — Avatar + Name + Bio
      ══════════════════════════════════════════════════════════════════ */}
      <div className="glass-panel p-8 sm:p-10 mb-5">
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">

          {/* Avatar */}
          <div className="flex-shrink-0">
            {s?.avatar_url ? (
              <div
                className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden"
                style={{
                  border:    '3px solid rgba(255,255,255,1)',
                  boxShadow: '0 16px 48px -12px rgba(0,0,0,0.12), 0 4px 16px -4px rgba(0,0,0,0.06)',
                }}
              >
                <Image
                  src={s.avatar_url}
                  alt={`Foto ${siteTitle}`}
                  fill
                  sizes="128px"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              // Pearl initials avatar
              <div
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)',
                  border:     '3px solid rgba(255,255,255,1)',
                  boxShadow:  '0 16px 48px -12px rgba(0,0,0,0.10), 0 4px 16px -4px rgba(0,0,0,0.06)',
                }}
              >
                <span
                  className="font-display font-bold text-slate-400"
                  style={{ fontSize: '3rem', lineHeight: 1 }}
                >
                  {siteTitle.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name + role + bio */}
          <div className="flex-1 text-center sm:text-left">

            {/* Role badge */}
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-slate-400 mb-3"
              style={{
                background:   'rgba(0,0,0,0.04)',
                border:       '1px solid rgba(0,0,0,0.05)',
                padding:      '3px 10px',
                borderRadius: '99px',
              }}
            >
              <PenLine size={10} strokeWidth={2.5} aria-hidden="true" />
              Penulis &amp; Blogger
            </span>

            {/* Name */}
            <h1
              className="font-display font-bold text-slate-900 mb-3"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', letterSpacing: '-0.03em', lineHeight: 1.1 }}
            >
              {siteTitle}
            </h1>

            {/* Bio */}
            <p className="text-slate-500 text-[15px] leading-[1.75] max-w-xl">
              {bio}
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          STATS ROW
      ══════════════════════════════════════════════════════════════════ */}
      <div className="glass-panel px-8 py-6 mb-5">
        <div className="grid grid-cols-3 divide-x divide-slate-100">
          <StatItem value={totalPosts.toString()} label="Artikel" />
          <StatItem value="2+" label="Tahun menulis" />
          <StatItem value="∞" label="Cerita untuk dibagi" />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          TWO-COLUMN: Values + Contact
      ══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* ── Writing Values ────────────────────────────────────────── */}
        <div className="glass-panel p-7 flex flex-col gap-6">

          {/* Heading */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-400 mb-1">
              Cara menulis
            </p>
            <h2 className="font-display text-[1.25rem] font-bold text-slate-900 tracking-tight">
              Nilai di Balik Setiap Kata
            </h2>
          </div>

          {/* Value items */}
          <div className="flex flex-col gap-5">
            {WRITING_VALUES.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-3.5 items-start">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: 'rgba(248,250,252,0.95)',
                    border:     '1px solid rgba(226,232,240,0.80)',
                    boxShadow:  '0 1px 4px rgba(0,0,0,0.03)',
                  }}
                >
                  <Icon size={14} strokeWidth={2} className="text-slate-500" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold text-slate-800 mb-0.5">{title}</p>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contact / Social ──────────────────────────────────────── */}
        <div className="glass-panel p-7 flex flex-col gap-6">

          {/* Heading */}
          <div>
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-400 mb-1">
              Terhubung
            </p>
            <h2 className="font-display text-[1.25rem] font-bold text-slate-900 tracking-tight">
              Mari Saling Sapa
            </h2>
          </div>

          {/* Intro text */}
          <p className="text-[13.5px] text-slate-500 leading-relaxed -mt-2">
            Punya pertanyaan, kolaborasi, atau hanya ingin berbagi cerita? Saya selalu senang mendengar kabar dari pembaca.
          </p>

          {/* Social buttons */}
          <div className="flex flex-col gap-2.5">
            {displaySocials.map((soc) => (
              <SocialBtn key={soc.label} {...soc} />
            ))}
          </div>

          {/* Separator */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-200 to-transparent" />
          </div>

          {/* Response note */}
          <p className="text-[12px] text-slate-400 leading-relaxed text-center">
            Biasanya membalas dalam <span className="font-semibold text-slate-500">1–2 hari kerja</span>.
            <br />Semua pesan dibaca dengan sepenuh hati.
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          WRITING CTA — dark panel
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="mt-5 rounded-[20px] px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{
          background: 'linear-gradient(145deg, rgba(15,23,42,0.94) 0%, rgba(51,65,85,0.96) 100%)',
          border:     '1px solid rgba(255,255,255,0.06)',
          boxShadow:  '0 20px 60px -15px rgba(15,23,42,0.20), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <div className="text-center sm:text-left">
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-1.5">
            Mulai membaca
          </p>
          <p className="font-display text-[1.3rem] font-semibold text-white leading-snug">
            Jelajahi semua tulisan
          </p>
          <p className="text-[13px] text-white/50 mt-1.5 leading-relaxed">
            Dari refleksi harian hingga cerita yang menghangatkan hati.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/archive"
            className="flex items-center gap-2 text-[13px] font-medium text-white/60 hover:text-white/90 transition-colors duration-200 px-4 py-2.5 rounded-xl"
            style={{ border: '1px solid rgba(255,255,255,0.12)' }}
          >
            Lihat Arsip
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-[13.5px] font-semibold text-slate-900 px-5 py-2.5 rounded-xl glass-transition hover:opacity-90 active:scale-[0.98]"
            style={{
              background: '#ffffff',
              boxShadow:  '0 4px 16px -4px rgba(255,255,255,0.25)',
            }}
          >
            <BookOpen size={14} strokeWidth={2.5} aria-hidden="true" />
            Baca Sekarang
          </Link>
        </div>
      </div>

    </div>
  )
}