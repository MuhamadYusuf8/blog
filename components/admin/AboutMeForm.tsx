'use client'

import React, { useState, useTransition } from 'react'
import ImageUploader from '@/components/admin/ImageUploader'
import { updateAboutMe, updateSiteTitle } from '@/app/admin/settings/actions'

interface AboutMeFormProps {
  bio: string
  avatarUrl: string
  siteTitle: string
}

// ─── Inline status badge ──────────────────────────────────────────────────────
function StatusBadge({ type, text }: { type: 'success' | 'error'; text: string }) {
  return (
    <div
      className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg"
      style={
        type === 'success'
          ? { background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.22)', color: '#059669' }
          : { background: 'rgba(254,242,242,0.97)', border: '1px solid rgba(239,68,68,0.20)', color: '#991b1b' }
      }
    >
      {type === 'success' ? (
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 8l3.5 3.5L13 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="8" cy="8" r="6.5" /><path d="M8 5v3M8 11v.5" strokeLinecap="round" />
        </svg>
      )}
      {text}
    </div>
  )
}

// ─── Section card wrapper ─────────────────────────────────────────────────────
function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.72)',
        border: '1px solid rgba(226,232,240,0.80)',
        boxShadow: '0 2px 12px -4px rgba(15,23,42,0.05)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-2"
        style={{ borderBottom: '1px solid rgba(226,232,240,0.70)' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(241,245,249,0.90)', border: '1px solid rgba(226,232,240,0.80)' }}
          aria-hidden="true"
        >
          {icon}
        </div>
        <h2 className="text-[13px] font-semibold text-slate-700">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

export default function AboutMeForm({ bio, avatarUrl, siteTitle }: AboutMeFormProps) {
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(avatarUrl)
  const [bioValue, setBioValue] = useState(bio)
  const [siteTitleValue, setSiteTitleValue] = useState(siteTitle)
  const [isPending, startTransition] = useTransition()
  const [isTitlePending, startTitleTransition] = useTransition()
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [titleMsg, setTitleMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileMsg(null)
    startTransition(async () => {
      const result = await updateAboutMe(bioValue, currentAvatarUrl)
      setProfileMsg(
        result.success
          ? { type: 'success', text: 'Profil berhasil diperbarui.' }
          : { type: 'error', text: result.error ?? 'Update gagal.' },
      )
      setTimeout(() => setProfileMsg(null), 4000)
    })
  }

  function handleSaveTitle(e: React.FormEvent) {
    e.preventDefault()
    setTitleMsg(null)
    startTitleTransition(async () => {
      const result = await updateSiteTitle(siteTitleValue)
      setTitleMsg(
        result.success
          ? { type: 'success', text: 'Judul situs diperbarui.' }
          : { type: 'error', text: result.error ?? 'Update gagal.' },
      )
      setTimeout(() => setTitleMsg(null), 4000)
    })
  }

  return (
    <div className="space-y-4">

      {/* ── Profile / About Me ──────────────────────────────────────────── */}
      <SectionCard
        title="Profil & About Me"
        icon={
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#64748b" strokeWidth="2">
            <circle cx="8" cy="5" r="3" />
            <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
          </svg>
        }
      >
        <form onSubmit={handleSaveProfile} className="space-y-5">

          {/* Avatar */}
          <div className="space-y-3">
            <label className="text-[12.5px] font-semibold text-slate-600 block">
              Avatar
            </label>
            {currentAvatarUrl && (
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0"
                  style={{ border: '2px solid rgba(226,232,240,0.80)' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentAvatarUrl}
                    alt="Avatar saat ini"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11.5px] text-slate-400 font-medium">Avatar saat ini</p>
              </div>
            )}
            <ImageUploader
              onUpload={(url) => setCurrentAvatarUrl(url)}
              bucket="posts-images"
              folder="avatars"
              label="Upload Avatar Baru"
            />
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Bio */}
          <div className="space-y-1.5">
            <label htmlFor="bio" className="text-[12.5px] font-semibold text-slate-600 block">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={5}
              value={bioValue}
              onChange={(e) => setBioValue(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-[13px] text-slate-700 placeholder-slate-300 resize-none transition-all"
              style={{
                background: 'rgba(248,250,252,0.80)',
                border: '1px solid rgba(226,232,240,0.80)',
                outline: 'none',
              }}
              placeholder="Tulis bio singkat tentang kamu…"
              onFocus={(e) => (e.currentTarget.style.border = '1px solid rgba(148,163,184,0.60)')}
              onBlur={(e) => (e.currentTarget.style.border = '1px solid rgba(226,232,240,0.80)')}
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-[12.5px] font-semibold transition-all disabled:opacity-50"
              style={{
                background: 'rgba(15,23,42,0.05)',
                border: '1px solid rgba(15,23,42,0.10)',
                color: '#0f172a',
              }}
            >
              {isPending && (
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 inline-block"
                  style={{ borderColor: 'rgba(226,232,240,0.80)', borderTopColor: '#64748b', animation: 'spin 0.75s linear infinite' }}
                />
              )}
              Simpan Profil
            </button>
            {profileMsg && <StatusBadge type={profileMsg.type} text={profileMsg.text} />}
          </div>

          <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
        </form>
      </SectionCard>

      {/* ── Site Title ──────────────────────────────────────────────────── */}
      <SectionCard
        title="Judul Situs"
        icon={
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#64748b" strokeWidth="2">
            <path d="M2 4h12M2 8h8M2 12h6" strokeLinecap="round" />
          </svg>
        }
      >
        <form onSubmit={handleSaveTitle} className="flex flex-col gap-3">
          <p className="text-[12px] text-slate-400">
            Nama yang tampil di browser tab dan header blog.
          </p>
          <div className="flex gap-2">
            <input
              id="site-title"
              type="text"
              value={siteTitleValue}
              onChange={(e) => setSiteTitleValue(e.target.value)}
              className="flex-1 rounded-xl px-4 py-2.5 text-[13px] text-slate-700 placeholder-slate-300 transition-all"
              style={{
                background: 'rgba(248,250,252,0.80)',
                border: '1px solid rgba(226,232,240,0.80)',
                outline: 'none',
              }}
              placeholder="Kak Rahma"
              onFocus={(e) => (e.currentTarget.style.border = '1px solid rgba(148,163,184,0.60)')}
              onBlur={(e) => (e.currentTarget.style.border = '1px solid rgba(226,232,240,0.80)')}
            />
            <button
              type="submit"
              disabled={isTitlePending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all whitespace-nowrap disabled:opacity-50"
              style={{
                background: 'rgba(15,23,42,0.05)',
                border: '1px solid rgba(15,23,42,0.10)',
                color: '#0f172a',
              }}
            >
              {isTitlePending && (
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 inline-block"
                  style={{ borderColor: 'rgba(226,232,240,0.80)', borderTopColor: '#64748b', animation: 'spin 0.75s linear infinite' }}
                />
              )}
              Simpan
            </button>
          </div>
          {titleMsg && <StatusBadge type={titleMsg.type} text={titleMsg.text} />}
        </form>
      </SectionCard>
    </div>
  )
}