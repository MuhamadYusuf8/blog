// app/admin/login/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin Login — Premium dark glassmorphism.
// Deep slate background with layered mesh, frosted glass card.
// Handles Supabase auth sign-in + error states + hCaptcha (RULE 5).
// ─────────────────────────────────────────────────────────────────────────────

'use client'

import { useState, useRef }  from 'react'
import Link                  from 'next/link'
import { useRouter }         from 'next/navigation'
import HCaptcha              from '@hcaptcha/react-hcaptcha'
import {
  Eye, EyeOff, ArrowLeft, Loader2,
  ShieldCheck, AlertCircle,
} from 'lucide-react'
import { createClient }      from '@/lib/supabase/client'

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminLoginPage() {
  const router              = useRouter()
  const supabase            = createClient()
  const emailRef            = useRef<HTMLInputElement>(null)
  const captchaRef          = useRef<HCaptcha>(null)

  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPw,       setShowPw]       = useState(false)
  const [status,       setStatus]       = useState<'idle' | 'loading' | 'error'>('idle')
  const [errMsg,       setErrMsg]       = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password || !captchaToken) return
    setStatus('loading')
    setErrMsg('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: { captchaToken }, // RULE 5: captchaToken passed to Supabase
    })

    if (error) {
      setStatus('error')
      setErrMsg(
        error.message.includes('Invalid login credentials')
          ? 'Email atau kata sandi salah. Silakan coba lagi.'
          : error.message.includes('captcha')
            ? 'Verifikasi CAPTCHA gagal. Silakan coba lagi.'
            : 'Terjadi kesalahan. Coba lagi dalam beberapa saat.',
      )
      // Reset captcha after failed attempt
      captchaRef.current?.resetCaptcha()
      setCaptchaToken(null)
      emailRef.current?.focus()
      return
    }

    router.push('/admin')
    router.refresh()
  }

  const canSubmit =
    email.trim().length > 0 &&
    password.length > 0 &&
    captchaToken !== null &&
    status !== 'loading'

  return (
    // ── Full-page dark background ──────────────────────────────────────────
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundColor: '#080c14',
        backgroundImage: [
          'radial-gradient(ellipse 80% 50% at 20% 10%,  rgba(30,41,59,0.80) 0%, transparent 60%)',
          'radial-gradient(ellipse 70% 60% at 85% 80%,  rgba(15,23,42,0.90) 0%, transparent 55%)',
          'radial-gradient(ellipse 50% 40% at 50% 50%,  rgba(51,65,85,0.25) 0%, transparent 70%)',
        ].join(', '),
      }}
    >
      {/* ── Decorative rings (background) ─────────────────────────────── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width:  '600px',
          height: '600px',
          top:    '50%',
          left:   '50%',
          transform: 'translate(-50%, -50%)',
          border:  '1px solid rgba(255,255,255,0.03)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width:  '900px',
          height: '900px',
          top:    '50%',
          left:   '50%',
          transform: 'translate(-50%, -50%)',
          border:  '1px solid rgba(255,255,255,0.02)',
        }}
        aria-hidden="true"
      />

      {/* ── Subtle noise grain ────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize:   '200px',
        }}
        aria-hidden="true"
      />

      {/* ══════════════════════════════════════════════════════════════════
          LOGIN CARD
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        className="relative w-full max-w-[420px] z-10"
        style={{
          background:           'rgba(15, 23, 42, 0.70)',
          backdropFilter:       'blur(40px) saturate(160%)',
          WebkitBackdropFilter: 'blur(40px) saturate(160%)',
          border:               '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius:         '24px',
          boxShadow: [
            '0 32px 80px -20px rgba(0,0,0,0.60)',
            '0 0 0 1px rgba(255,255,255,0.04) inset',
            '0 1px 0 rgba(255,255,255,0.08) inset',
          ].join(', '),
          padding: '40px 36px 36px',
        }}
      >
        {/* Top specular line */}
        <div
          className="absolute top-0 left-8 right-8 h-px pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
          }}
          aria-hidden="true"
        />

        {/* ── Wordmark ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
              border:     '1px solid rgba(255,255,255,0.12)',
              boxShadow:  'inset 0 1px 0 rgba(255,255,255,0.10)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1L13 7L7 13L1 7L7 1Z" fill="white" fillOpacity="0.85"/>
            </svg>
          </div>
          <span
            className="font-display font-bold text-white"
            style={{ fontSize: '15px', letterSpacing: '-0.02em', opacity: 0.90 }}
          >
            Kak Rahma
          </span>
        </div>

        {/* ── Heading ──────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-4"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border:     '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <ShieldCheck size={11} strokeWidth={2} style={{ color: 'rgba(255,255,255,0.45)' }} />
            <span
              className="text-[10.5px] font-semibold tracking-[0.10em] uppercase"
              style={{ color: 'rgba(255,255,255,0.40)' }}
            >
              Panel Admin
            </span>
          </div>

          <h1
            className="font-display font-bold text-white leading-tight"
            style={{ fontSize: '1.75rem', letterSpacing: '-0.03em', opacity: 0.95 }}
          >
            Selamat datang
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '13.5px', marginTop: '6px', lineHeight: 1.6 }}>
            Masuk untuk mengelola blog kamu
          </p>
        </div>

        {/* ── Form ─────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

          {/* Error banner */}
          {status === 'error' && (
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(239,68,68,0.10)',
                border:     '1px solid rgba(239,68,68,0.22)',
              }}
              role="alert"
            >
              <AlertCircle
                size={14}
                strokeWidth={2}
                className="flex-shrink-0 mt-0.5"
                style={{ color: 'rgba(252,165,165,0.90)' }}
              />
              <p style={{ color: 'rgba(252,165,165,0.90)', fontSize: '13px', lineHeight: 1.5 }}>
                {errMsg}
              </p>
            </div>
          )}

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-email"
              style={{ color: 'rgba(255,255,255,0.50)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em' }}
            >
              ALAMAT EMAIL
            </label>
            <input
              ref={emailRef}
              id="admin-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@kakrahma.com"
              required
              autoComplete="email"
              className="w-full outline-none font-sans"
              style={{
                background:   'rgba(255,255,255,0.05)',
                border:       status === 'error' ? '1px solid rgba(239,68,68,0.40)' : '1px solid rgba(255,255,255,0.10)',
                borderRadius: '12px',
                padding:      '12px 16px',
                color:        'rgba(255,255,255,0.88)',
                fontSize:     '14px',
                transition:   'all 0.2s ease',
                caretColor:   'rgba(255,255,255,0.70)',
              }}
              onFocus={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.border     = '1px solid rgba(255,255,255,0.22)'
                e.currentTarget.style.boxShadow  = '0 0 0 3px rgba(255,255,255,0.04)'
              }}
              onBlur={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.border     = status === 'error'
                  ? '1px solid rgba(239,68,68,0.40)'
                  : '1px solid rgba(255,255,255,0.10)'
                e.currentTarget.style.boxShadow  = 'none'
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="admin-password"
              style={{ color: 'rgba(255,255,255,0.50)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em' }}
            >
              KATA SANDI
            </label>
            <div className="relative">
              <input
                id="admin-password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="w-full outline-none font-sans pr-12"
                style={{
                  background:   'rgba(255,255,255,0.05)',
                  border:       status === 'error' ? '1px solid rgba(239,68,68,0.40)' : '1px solid rgba(255,255,255,0.10)',
                  borderRadius: '12px',
                  padding:      '12px 16px',
                  color:        'rgba(255,255,255,0.88)',
                  fontSize:     '14px',
                  transition:   'all 0.2s ease',
                  caretColor:   'rgba(255,255,255,0.70)',
                  letterSpacing: showPw ? 'normal' : '0.08em',
                }}
                onFocus={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.border     = '1px solid rgba(255,255,255,0.22)'
                  e.currentTarget.style.boxShadow  = '0 0 0 3px rgba(255,255,255,0.04)'
                }}
                onBlur={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                  e.currentTarget.style.border     = status === 'error'
                    ? '1px solid rgba(239,68,68,0.40)'
                    : '1px solid rgba(255,255,255,0.10)'
                  e.currentTarget.style.boxShadow  = 'none'
                }}
              />
              {/* Show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition-opacity duration-150 hover:opacity-80"
                style={{ color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                aria-label={showPw ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPw
                  ? <EyeOff size={16} strokeWidth={2} />
                  : <Eye    size={16} strokeWidth={2} />
                }
              </button>
            </div>
          </div>

          {/* hCaptcha — RULE 5: required, theme="dark" */}
          <div className="flex justify-center my-2 select-none">
            <HCaptcha
              ref={captchaRef}
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
              theme="dark"
              onVerify={(token) => setCaptchaToken(token)}
              onExpire={() => setCaptchaToken(null)}
              onError={() => {
                setCaptchaToken(null)
              }}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold mt-1 transition-all duration-200"
            style={{
              fontSize:   '14px',
              background: canSubmit
                ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(241,245,249,0.95) 100%)'
                : 'rgba(255,255,255,0.08)',
              color:      canSubmit ? '#0f172a' : 'rgba(255,255,255,0.25)',
              border:     canSubmit ? '1px solid rgba(255,255,255,0.20)' : '1px solid rgba(255,255,255,0.06)',
              boxShadow:  canSubmit ? '0 8px 24px -6px rgba(0,0,0,0.40)' : 'none',
              cursor:     canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={15} strokeWidth={2} className="animate-spin" />
                Memverifikasi...
              </>
            ) : (
              <>
                <ShieldCheck size={15} strokeWidth={2.5} />
                Masuk ke Dashboard
              </>
            )}
          </button>
        </form>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 my-6">
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }}
          />
          <div
            className="w-1 h-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          />
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }}
          />
        </div>

        {/* ── Security note ─────────────────────────────────────────────── */}
        <p
          className="text-center"
          style={{ color: 'rgba(255,255,255,0.22)', fontSize: '12px', lineHeight: 1.6 }}
        >
          Halaman ini hanya untuk administrator.
          <br />Akses tidak sah akan dicatat dan dilaporkan.
        </p>
      </div>

      {/* ── Back to blog ────────────────────────────────────────────────── */}
      <Link
        href="/"
        className="relative z-10 mt-6 inline-flex items-center gap-1.5 transition-all duration-200 group"
        style={{ color: 'rgba(255,255,255,0.28)', fontSize: '12.5px', fontWeight: 500 }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
      >
        <ArrowLeft
          size={13}
          strokeWidth={2.5}
          className="group-hover:-translate-x-0.5 transition-transform duration-200"
        />
        Kembali ke Blog
      </Link>
    </div>
  )
}