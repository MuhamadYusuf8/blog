/**
 * components/admin/AdminSidebar.tsx
 * Pearl White edition — light glassmorphism sidebar.
 *
 * UX IMPROVEMENTS:
 * - Navigation uses router.push() + useTransition() so isPending state is available
 * - Pending nav item shows an inline spinner, others are dimmed slightly
 * - Sign-out has its own loading state
 * - Mobile drawer closes on navigation
 */

'use client'

import React, { useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'

type AdminSidebarProps = {
  pendingCommentCount: number
}

// ─── Inline spinner SVG ──────────────────────────────────────────────────────
function Spinner({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ animation: 'admin-spin 0.7s linear infinite', flexShrink: 0 }}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="1" width="6" height="6" rx="1.5" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" />
      </svg>
    ),
  },
  {
    href: '/admin/posts',
    label: 'Posts',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 4h12M2 8h8M2 12h6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/admin/posts/new',
    label: 'New Post',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 14l3-1 9-9-2-2-9 9-1 3z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/admin/comments',
    label: 'Comments',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 4c0-1.1.9-2 2-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6l-4 2V4z" />
      </svg>
    ),
    showBadge: true,
  },
  {
    href: '/admin/media',
    label: 'Media',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="14" height="10" rx="1.5" />
        <circle cx="6" cy="8" r="2" />
      </svg>
    ),
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="8" cy="8" r="2.5" />
        <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="1,12 5,7 8,9 11,5 15,3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
]

export function AdminSidebar({ pendingCommentCount }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)

  // useTransition lets us know when a navigation is in-flight
  const [isPending, startTransition] = useTransition()
  const [pendingHref, setPendingHref] = useState<string | null>(null)

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  function handleNav(href: string) {
    if (href === pathname) return
    setPendingHref(href)
    setIsMobileOpen(false)
    startTransition(() => {
      router.push(href)
    })
  }

  // Clear pendingHref once pathname updates (navigation complete)
  React.useEffect(() => {
    setPendingHref(null)
  }, [pathname])

  async function handleSignOut() {
    setIsSigningOut(true)
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* ── Brand ─────────────────────────────────── */}
      <div className="px-4 py-[18px] border-b border-slate-200/70">
        <div className="flex items-center gap-2">
          <span
            className="w-[26px] h-[26px] rounded-[8px] inline-flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #0f172a, #334155)' }}
            aria-hidden="true"
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M6 0.5L11.5 6L6 11.5L0.5 6L6 0.5Z" fill="white" fillOpacity="0.92" />
            </svg>
          </span>
          <span className="text-[13px] font-bold text-slate-900 tracking-[-0.2px]">
            Rahma
          </span>
          <span className="text-[9px] font-semibold text-slate-500 bg-slate-100/90 border border-slate-200/80 rounded-[5px] px-[5px] py-[1px] ml-1">
            Admin
          </span>
        </div>
      </div>

      {/* Divider ornament */}
      <div className="mx-3 my-2 flex items-center gap-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent" />
        <div className="w-1 h-1 rounded-full bg-slate-300" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent" />
      </div>

      {/* ── Navigation ────────────────────────────── */}
      <nav className="flex-1 px-[10px] py-1 overflow-y-auto flex flex-col gap-0.5" aria-label="Admin navigation">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const loading = pendingHref === item.href && isPending
          const dimmed = isPending && pendingHref !== item.href && !active

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => handleNav(item.href)}
              aria-current={active ? 'page' : undefined}
              disabled={loading}
              className={[
                'w-full flex items-center gap-[9px] px-[10px] py-2 rounded-[10px]',
                'text-[12px] font-medium transition-all duration-150 text-left',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40',
                active
                  ? 'bg-white/85 border border-slate-200/80 shadow-[0_1px_6px_-2px_rgba(0,0,0,0.06)] text-slate-900'
                  : 'text-slate-500 hover:bg-white/60 border border-transparent hover:border-slate-200/50 hover:text-slate-800',
                dimmed ? 'opacity-40' : '',
              ].join(' ')}
              style={{
                cursor: loading ? 'wait' : 'pointer',
              }}
            >
              {/* Icon / Spinner */}
              <span className={`flex-shrink-0 ${active ? 'text-slate-600' : 'text-slate-400'}`}>
                {loading ? <Spinner size={14} /> : item.icon}
              </span>

              {/* Label */}
              <span className="flex-1">{item.label}</span>

              {/* Badge for comments */}
              {item.showBadge && pendingCommentCount > 0 && !loading && (
                <span
                  className="ml-auto text-[9px] font-bold px-[5px] py-[1px] rounded-full min-w-[20px] text-center"
                  style={{
                    background: 'rgba(239,68,68,0.10)',
                    border: '1px solid rgba(239,68,68,0.18)',
                    color: '#dc2626',
                  }}
                  aria-label={`${pendingCommentCount} komentar menunggu moderasi`}
                >
                  {pendingCommentCount > 99 ? '99+' : pendingCommentCount}
                </span>
              )}

              {/* Loading dots on the right when pending */}
              {loading && (
                <span className="ml-auto flex gap-0.5 items-center">
                  <span className="w-1 h-1 rounded-full bg-slate-400" style={{ animation: 'dot-pulse 1.2s ease-in-out 0s infinite' }} />
                  <span className="w-1 h-1 rounded-full bg-slate-400" style={{ animation: 'dot-pulse 1.2s ease-in-out 0.2s infinite' }} />
                  <span className="w-1 h-1 rounded-full bg-slate-400" style={{ animation: 'dot-pulse 1.2s ease-in-out 0.4s infinite' }} />
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* ── View Blog ─────────────────────────────── */}
      <div className="px-[10px] py-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-[9px] px-[10px] py-[7px] rounded-[10px] text-[12px] text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-all duration-150 border border-dashed border-slate-300/70"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="8" cy="8" r="6.5" />
            <ellipse cx="8" cy="8" rx="3" ry="6.5" />
            <path d="M1.5 8h13" />
          </svg>
          <span>Lihat Blog Publik</span>
          <span className="ml-auto text-[10px] opacity-50">↗</span>
        </a>
      </div>

      {/* ── Logout ────────────────────────────────── */}
      <div className="px-[10px] pb-4">
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut || isPending}
          className="
            w-full flex items-center gap-[9px] px-[10px] py-2 rounded-[10px]
            text-[12px] text-red-400 hover:text-red-600
            hover:bg-red-50/80 border border-transparent hover:border-red-200/50
            transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          aria-label="Keluar dari panel admin"
        >
          {isSigningOut ? (
            <Spinner size={13} />
          ) : (
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 3H3a1 1 0 00-1 1v8a1 1 0 001 1h3M10 11l4-4-4-4M14 8H6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          <span>{isSigningOut ? 'Keluar...' : 'Keluar'}</span>
        </button>
      </div>

      {/* Keyframe animations via injected style */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes admin-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes dot-pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      ` }} />
    </div>
  )

  return (
    <>
      {/* ── Top loading bar (global) ─────────────── */}
      {isPending && (
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 right-0 z-[9999] h-[2px]"
          style={{ background: 'rgba(148,163,184,0.15)' }}
        >
          <div
            className="h-full"
            style={{
              background: 'linear-gradient(90deg, #64748b, #94a3b8)',
              animation: 'nav-progress 1s ease-in-out infinite',
              boxShadow: '0 0 6px rgba(100,116,139,0.6)',
            }}
          />
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes nav-progress {
              0% { width: 20%; margin-left: 0; }
              50% { width: 60%; margin-left: 20%; }
              100% { width: 20%; margin-left: 80%; }
            }
          ` }} />
        </div>
      )}

      {/* ── Desktop sidebar ─────────────────────── */}
      <aside
        className="hidden lg:flex flex-col w-[200px] min-h-dvh fixed top-0 left-0 z-30"
        style={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(226,232,240,0.70)',
        }}
        aria-label="Admin sidebar"
      >
        <SidebarContent />
      </aside>

      {/* ── Mobile top bar ──────────────────────── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between border-b border-slate-200/70"
        style={{
          background: 'rgba(248,250,252,0.95)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-[7px] inline-flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0f172a, #334155)' }}
            aria-hidden="true"
          >
            <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
              <path d="M6 0.5L11.5 6L6 11.5L0.5 6L6 0.5Z" fill="white" fillOpacity="0.92" />
            </svg>
          </span>
          <span className="text-slate-900 font-bold text-sm">Admin</span>
          {isPending && <Spinner size={12} />}
        </div>
        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-admin-sidebar"
          aria-label={isMobileOpen ? 'Tutup menu' : 'Buka menu'}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            {isMobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* ── Mobile drawer ───────────────────────── */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          <aside
            id="mobile-admin-sidebar"
            className="lg:hidden fixed top-0 left-0 bottom-0 z-40 w-[200px] flex flex-col border-r border-slate-200/70"
            style={{
              background: 'rgba(248,250,252,0.98)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            aria-label="Admin sidebar mobile"
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Mobile spacer */}
      <div className="lg:hidden h-14" aria-hidden="true" />
    </>
  )
}

export default AdminSidebar