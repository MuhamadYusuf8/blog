/**
 * components/public/NavbarClient.tsx
 * 'use client' — handles active link highlighting, navigation loading state,
 * and top progress bar for the public site.
 *
 * The parent Navbar (server component) renders this, passing siteTitle as prop.
 */

'use client'

import React, { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV_LINKS = [
  { href: '/',        label: 'Beranda'  },
  { href: '/about',   label: 'Tentang'  },
  { href: '/archive', label: 'Arsip'    },
  { href: '/admin',   label: 'Admin'    },
] as const

// ─── Inline spinner ───────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ animation: 'pub-spin 0.7s linear infinite', flexShrink: 0 }}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pub-spin { to { transform: rotate(360deg); } }
      `}} />
    </svg>
  )
}

// ─── Top progress bar ─────────────────────────────────────────────────────────
function NavProgressBar({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] h-[2px]"
      style={{ background: 'rgba(203,213,225,0.20)' }}
    >
      <div
        className="h-full"
        style={{
          background: 'linear-gradient(90deg, #64748b 0%, #94a3b8 50%, #64748b 100%)',
          boxShadow: '0 0 8px rgba(100,116,139,0.50)',
          animation: 'pub-progress 1s ease-in-out infinite',
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pub-progress {
          0%   { width: 15%; margin-left: 0; }
          50%  { width: 55%; margin-left: 25%; }
          100% { width: 15%; margin-left: 85%; }
        }
      `}} />
    </div>
  )
}

type Props = {
  siteTitle: string
}

export function NavbarClient({ siteTitle }: Props) {
  const pathname  = usePathname()
  const router    = useRouter()

  const [isPending, startTransition] = useTransition()
  const [pendingHref, setPendingHref] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen]  = useState(false)

  // Clear pendingHref once pathname settles after navigation
  useEffect(() => {
    setPendingHref(null)
    setMobileOpen(false)
  }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  function handleNav(href: string) {
    if (href === pathname) return
    setPendingHref(href)
    setMobileOpen(false)
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <>
      {/* Global progress bar */}
      <NavProgressBar visible={isPending} />

      {/* Outer header */}
      <header className="sticky top-0 z-50 px-4 sm:px-6 pt-3 pb-1">
        <nav
          className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between glass-nav glass-transition"
          aria-label="Navigasi utama"
        >

          {/* ── Logo ──────────────────────────────────────────────────── */}
          <button
            type="button"
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 group cursor-pointer bg-transparent border-0 p-0"
            aria-label={`${siteTitle} — Kembali ke beranda`}
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                boxShadow:  '0 2px 8px -2px rgba(15,23,42,0.20)',
              }}
            >
              {pendingHref === '/' && isPending
                ? <Spinner />
                : (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M6 0.5L11.5 6L6 11.5L0.5 6L6 0.5Z" fill="white" fillOpacity="0.92"/>
                  </svg>
                )
              }
            </div>
            <span className="font-display text-[15px] font-bold text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors duration-200">
              {siteTitle}
            </span>
          </button>

          {/* ── Desktop nav links ──────────────────────────────────────── */}
          <ul className="hidden sm:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ href, label }) => {
              const active  = isActive(href)
              const loading = pendingHref === href && isPending
              const dimmed  = isPending && pendingHref !== href && !active

              return (
                <li key={href}>
                  <button
                    type="button"
                    onClick={() => handleNav(href)}
                    aria-current={active ? 'page' : undefined}
                    disabled={loading}
                    className={[
                      'relative flex items-center gap-1.5 px-4 py-2 rounded-xl',
                      'text-[13.5px] font-medium transition-all duration-200 cursor-pointer',
                      'bg-transparent border-0',
                      active
                        ? 'text-slate-900 font-semibold'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-white/60',
                      dimmed ? 'opacity-40' : '',
                    ].join(' ')}
                    style={{ cursor: loading ? 'wait' : undefined }}
                  >
                    {/* Spinner inline when loading */}
                    {loading && <Spinner />}
                    {label}

                    {/* Active underline pill */}
                    {active && !loading && (
                      <span
                        className="absolute bottom-1.5 left-4 right-4 h-[1.5px] rounded-full bg-slate-700"
                        aria-hidden="true"
                      />
                    )}
                    {/* Hover underline (non-active) */}
                    {!active && !loading && (
                      <span
                        className="absolute bottom-1.5 left-4 right-4 h-[1.5px] bg-slate-300 scale-x-0 hover:scale-x-100 transition-transform duration-200 origin-left rounded-full"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          {/* ── Subscribe CTA ──────────────────────────────────────────── */}
          <button
            type="button"
            onClick={() => handleNav('/subscribe')}
            disabled={pendingHref === '/subscribe' && isPending}
            className="hidden sm:flex items-center gap-1.5 text-[12.5px] font-semibold text-white px-4 py-2 rounded-lg glass-transition hover:opacity-90 active:scale-[0.98] cursor-pointer border-0"
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
              boxShadow:  '0 2px 10px -2px rgba(15,23,42,0.25)',
              opacity: pendingHref === '/subscribe' && isPending ? 0.75 : 1,
            }}
          >
            {pendingHref === '/subscribe' && isPending ? <Spinner /> : null}
            Langganan
          </button>

          {/* ── Mobile hamburger ───────────────────────────────────────── */}
          <button
            type="button"
            className="sm:hidden glass-card w-9 h-9 flex items-center justify-center cursor-pointer rounded-xl text-slate-600 hover:text-slate-900 glass-transition border-0 bg-transparent"
            aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu navigasi'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((p) => !p)}
          >
            {isPending
              ? <Spinner />
              : mobileOpen
                ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M3 3l10 10M13 3L3 13" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M2 4h12M2 8h12M2 12h12" />
                  </svg>
                )
            }
          </button>
        </nav>

        {/* ── Mobile dropdown ────────────────────────────────────────── */}
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 top-[72px] z-40 bg-slate-900/10 backdrop-blur-[2px]"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />

            {/* Dropdown panel */}
            <div className="absolute left-4 right-4 top-full mt-1 z-50 glass-panel p-1.5 flex flex-col gap-0.5 max-w-5xl mx-auto">
              {NAV_LINKS.map(({ href, label }) => {
                const active  = isActive(href)
                const loading = pendingHref === href && isPending
                return (
                  <button
                    key={href}
                    type="button"
                    onClick={() => handleNav(href)}
                    aria-current={active ? 'page' : undefined}
                    className={[
                      'flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-left',
                      'text-[13px] font-medium transition-all duration-150 border-0 bg-transparent cursor-pointer',
                      active
                        ? 'text-slate-900 font-semibold bg-white/60'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white/60',
                    ].join(' ')}
                  >
                    {loading && <Spinner />}
                    {label}
                    {active && !loading && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-700" aria-hidden="true" />
                    )}
                  </button>
                )
              })}
              <div className="mt-1 pt-1 border-t border-white/60">
                <button
                  type="button"
                  onClick={() => handleNav('/subscribe')}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-[13px] font-semibold text-slate-900 hover:bg-white/60 transition-all duration-150 border-0 bg-transparent cursor-pointer"
                >
                  {pendingHref === '/subscribe' && isPending && <Spinner />}
                  Langganan →
                </button>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  )
}

export default NavbarClient
