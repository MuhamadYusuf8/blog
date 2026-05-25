// app/(public)/subscribe/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Subscribe page — Pearl White Minimalist Glassmorphism.
// "use client" for form state. Premium newsletter signup with benefit list.
// ─────────────────────────────────────────────────────────────────────────────

'use client'

import { useState }  from 'react'
import Link          from 'next/link'
import {
  ArrowLeft, Mail, CheckCircle2, Feather,
  BookOpen, Clock, Sparkles, ArrowRight,
  Loader2,
} from 'lucide-react'

// ─── Benefits ────────────────────────────────────────────────────────────────

const BENEFITS = [
  {
    icon:  Feather,
    title: 'Tulisan eksklusif tiap minggu',
    body:  'Refleksi, cerita, dan esai pendek langsung ke inbox kamu — sebelum tayang di blog.',
  },
  {
    icon:  BookOpen,
    title: 'Rekomendasi bacaan pilihan',
    body:  'Buku, artikel, dan tautan menarik yang saya temukan sepanjang minggu.',
  },
  {
    icon:  Clock,
    title: 'Tidak pernah spam',
    body:  'Hanya satu email per minggu. Tidak ada iklan, tidak ada promosi berlebihan.',
  },
  {
    icon:  Sparkles,
    title: 'Bisa berhenti kapan saja',
    body:  'Satu klik untuk berhenti langganan. Tidak perlu konfirmasi, tidak ada pertanyaan.',
  },
]

// ─── Testimonial ─────────────────────────────────────────────────────────────

const TESTIMONIALS = [
  { text: 'Email dari Kak Rahma selalu jadi yang pertama saya buka setiap Senin pagi.', name: 'Dina, pembaca setia' },
  { text: 'Tulisannya hangat dan jujur. Seperti dapat surat dari sahabat lama.', name: 'Rizky, Jakarta' },
  { text: 'Newsletter favorit saya. Singkat, padat, dan selalu meninggalkan sesuatu.', name: 'Aulia, Bandung' },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function SubscribePage() {
  const [email,   setEmail]   = useState('')
  const [name,    setName]    = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg,  setErrMsg]  = useState('')
  const [activeTx, setActiveTx] = useState(0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setErrMsg('')

    try {
      // ── Replace this with your actual subscription API call ──────
      // e.g. Supabase insert, Mailchimp, ConvertKit, etc.
      await new Promise(r => setTimeout(r, 1200)) // Simulated delay
      // Example Supabase call:
      // const { error } = await supabase.from('subscribers').insert({ email, name })
      // if (error) throw error
      setStatus('success')
    } catch {
      setStatus('error')
      setErrMsg('Terjadi kesalahan. Coba lagi dalam beberapa saat.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24">

      {/* ── Back ──────────────────────────────────────────────────────── */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-400 hover:text-slate-700 transition-colors duration-200 mb-10 group"
      >
        <ArrowLeft
          size={13}
          strokeWidth={2.5}
          className="group-hover:-translate-x-0.5 transition-transform duration-200"
        />
        Kembali ke Blog
      </Link>

      {/* ═══════════════════════════════════════════════════════════════
          TWO-COLUMN LAYOUT
      ══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6 items-start">

        {/* ── LEFT: Benefits + Testimonials ─────────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Header */}
          <div className="glass-panel p-8 sm:p-10">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.1em] uppercase text-slate-400 mb-4"
              style={{
                background:   'rgba(0,0,0,0.04)',
                border:       '1px solid rgba(0,0,0,0.05)',
                padding:      '3px 10px',
                borderRadius: '99px',
              }}
            >
              <Mail size={10} strokeWidth={2.5} />
              Newsletter Mingguan
            </span>

            <h1
              className="font-display font-bold text-slate-900 leading-tight mb-3"
              style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', letterSpacing: '-0.03em' }}
            >
              Satu email,<br />
              <span className="italic font-normal text-slate-400">setiap minggu.</span>
            </h1>

            <p className="text-[15px] text-slate-500 leading-relaxed max-w-lg">
              Bergabunglah dengan pembaca yang menikmati refleksi jujur, cerita kecil yang bermakna, dan rekomendasi bacaan pilihan — langsung di inbox.
            </p>

            {/* Subscriber count hint */}
            <div className="flex items-center gap-3 mt-6">
              {/* Avatar stack */}
              <div className="flex -space-x-2">
                {['#c7d2fe','#fde68a','#bbf7d0','#fbcfe8'].map((color, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{
                      background: color,
                      border:     '2px solid white',
                      color:      '#334155',
                      zIndex:     4 - i,
                    }}
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <p className="text-[12.5px] text-slate-500">
                Bergabung dengan <span className="font-semibold text-slate-700">ratusan pembaca</span> lainnya
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="glass-panel p-7">
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-slate-400 mb-5">
              Yang akan kamu dapatkan
            </p>
            <div className="flex flex-col gap-5">
              {BENEFITS.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-3.5 items-start">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      background: 'rgba(248,250,252,0.95)',
                      border:     '1px solid rgba(226,232,240,0.80)',
                      boxShadow:  '0 1px 4px rgba(0,0,0,0.03)',
                    }}
                  >
                    <Icon size={14} strokeWidth={2} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[13.5px] font-semibold text-slate-800 mb-0.5">{title}</p>
                    <p className="text-[12.5px] text-slate-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div
            className="rounded-[20px] p-7"
            style={{
              background: 'linear-gradient(145deg, rgba(15,23,42,0.94) 0%, rgba(51,65,85,0.96) 100%)',
              border:     '1px solid rgba(255,255,255,0.06)',
              boxShadow:  '0 20px 60px -15px rgba(15,23,42,0.18), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-white/35 mb-5">
              Kata pembaca
            </p>

            {/* Active testimonial */}
            <div className="min-h-[72px]">
              <p className="font-display text-[1.05rem] text-white/88 italic leading-relaxed">
                &ldquo;{TESTIMONIALS[activeTx].text}&rdquo;
              </p>
              <p className="mt-3 text-[11.5px] font-medium text-white/35">
                — {TESTIMONIALS[activeTx].name}
              </p>
            </div>

            {/* Dots */}
            <div className="flex items-center gap-2 mt-5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTx(i)}
                  className="transition-all duration-200"
                  style={{
                    width:        i === activeTx ? '20px' : '6px',
                    height:       '6px',
                    borderRadius: '99px',
                    background:   i === activeTx ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.20)',
                    border:       'none',
                    cursor:       'pointer',
                    padding:      0,
                  }}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: Form (sticky) ───────────────────────────────────── */}
        <div className="lg:sticky lg:top-24">
          {status === 'success' ? (
            /* ── SUCCESS STATE ─────────────────────────────────────── */
            <div className="glass-panel p-8 flex flex-col items-center text-center gap-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'rgba(240,253,244,0.90)',
                  border:     '1px solid rgba(187,247,208,0.80)',
                  boxShadow:  '0 4px 16px -4px rgba(34,197,94,0.10)',
                }}
              >
                <CheckCircle2 size={28} strokeWidth={1.5} className="text-emerald-500" />
              </div>
              <div>
                <h2 className="font-display text-[1.4rem] font-bold text-slate-900 tracking-tight leading-tight">
                  Selamat bergabung!
                </h2>
                <p className="mt-2 text-[14px] text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Terima kasih, <span className="font-semibold text-slate-700">{name || email}</span>! Cek inbox kamu untuk email konfirmasi.
                </p>
              </div>

              {/* Divider */}
              <div className="w-full flex items-center gap-3">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-200 to-transparent" />
              </div>

              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 text-[13.5px] font-semibold text-white py-3 rounded-xl glass-transition hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                  boxShadow:  '0 4px 16px -4px rgba(15,23,42,0.25)',
                }}
              >
                Mulai Membaca
                <ArrowRight size={14} strokeWidth={2.5} />
              </Link>
            </div>
          ) : (
            /* ── FORM STATE ────────────────────────────────────────── */
            <div className="glass-panel p-7 sm:p-8">
              <h2 className="font-display text-[1.35rem] font-bold text-slate-900 tracking-tight leading-tight mb-1.5">
                Daftar sekarang
              </h2>
              <p className="text-[13px] text-slate-500 mb-7 leading-relaxed">
                Gratis. Tidak perlu kartu kredit. Berhenti kapan saja.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

                {/* Name field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="sub-name"
                    className="text-[12px] font-semibold text-slate-600 tracking-wide"
                  >
                    Nama <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>
                  <input
                    id="sub-name"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Nama kamu"
                    className="w-full px-4 py-3 text-[13.5px] text-slate-700 placeholder-slate-300 rounded-xl outline-none glass-transition font-sans"
                    style={{
                      background: 'rgba(248,250,252,0.85)',
                      border:     '1px solid rgba(226,232,240,0.70)',
                      boxShadow:  'inset 0 1px 3px rgba(0,0,0,0.02)',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.border     = '1px solid rgba(100,116,139,0.40)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.95)'
                      e.currentTarget.style.boxShadow  = '0 0 0 3px rgba(100,116,139,0.06), inset 0 1px 3px rgba(0,0,0,0.02)'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.border     = '1px solid rgba(226,232,240,0.70)'
                      e.currentTarget.style.background = 'rgba(248,250,252,0.85)'
                      e.currentTarget.style.boxShadow  = 'inset 0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  />
                </div>

                {/* Email field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="sub-email"
                    className="text-[12px] font-semibold text-slate-600 tracking-wide"
                  >
                    Alamat Email <span className="text-red-400 text-[10px]">*</span>
                  </label>
                  <input
                    id="sub-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="kamu@email.com"
                    required
                    className="w-full px-4 py-3 text-[13.5px] text-slate-700 placeholder-slate-300 rounded-xl outline-none glass-transition font-sans"
                    style={{
                      background: 'rgba(248,250,252,0.85)',
                      border:     '1px solid rgba(226,232,240,0.70)',
                      boxShadow:  'inset 0 1px 3px rgba(0,0,0,0.02)',
                    }}
                    onFocus={e => {
                      e.currentTarget.style.border     = '1px solid rgba(100,116,139,0.40)'
                      e.currentTarget.style.background = 'rgba(255,255,255,0.95)'
                      e.currentTarget.style.boxShadow  = '0 0 0 3px rgba(100,116,139,0.06), inset 0 1px 3px rgba(0,0,0,0.02)'
                    }}
                    onBlur={e => {
                      e.currentTarget.style.border     = '1px solid rgba(226,232,240,0.70)'
                      e.currentTarget.style.background = 'rgba(248,250,252,0.85)'
                      e.currentTarget.style.boxShadow  = 'inset 0 1px 3px rgba(0,0,0,0.02)'
                    }}
                  />
                </div>

                {/* Error message */}
                {status === 'error' && (
                  <p className="text-[12.5px] text-red-500 font-medium -mt-1">
                    {errMsg}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'loading' || !email.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-semibold text-white glass-transition mt-1"
                  style={{
                    background: email.trim()
                      ? 'linear-gradient(135deg, #0f172a 0%, #334155 100%)'
                      : 'rgba(203,213,225,0.60)',
                    boxShadow: email.trim()
                      ? '0 6px 20px -4px rgba(15,23,42,0.28)'
                      : 'none',
                    cursor: email.trim() ? 'pointer' : 'not-allowed',
                    color:  email.trim() ? '#ffffff' : '#94a3b8',
                  }}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 size={15} strokeWidth={2} className="animate-spin" />
                      Mendaftarkan...
                    </>
                  ) : (
                    <>
                      <Mail size={14} strokeWidth={2.5} />
                      Berlangganan Gratis
                      <ArrowRight size={14} strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 mt-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-200 to-transparent" />
              </div>

              {/* Reassurance */}
              <div className="mt-5 flex flex-col gap-2.5">
                {[
                  'Tidak ada spam, dijamin',
                  'Data kamu aman dan tidak dijual',
                  'Berhenti langganan dengan 1 klik',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 size={13} strokeWidth={2} className="text-emerald-400 flex-shrink-0" />
                    <span className="text-[12.5px] text-slate-500">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}