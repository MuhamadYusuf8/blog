/**
 * app/admin/pages/page.tsx — Static Pages Manager (Dark Edition)
 */
import type { Metadata } from 'next'
import { Layers, Plus } from 'lucide-react'

export const metadata: Metadata = { title: 'Kelola Halaman — Kak Rahma' }

const STATIC_PAGES = [
  { title: 'Tentang', slug: '/about', status: 'Aktif', lastUpdated: '1 Jun 2026' },
  { title: 'Kontak', slug: '/contact', status: 'Aktif', lastUpdated: '1 Jun 2026' },
  { title: 'Arsip', slug: '/archive', status: 'Aktif', lastUpdated: '1 Jun 2026' },
]

export default function AdminPagesPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div>
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)', color: '#38bdf8' }}
          >
            <Layers size={11} /> Halaman Statis
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight mb-1">Kelola Halaman</h1>
          <p className="text-sm text-slate-500">{STATIC_PAGES.length} halaman aktif</p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex-shrink-0 opacity-50 cursor-not-allowed"
          disabled
          title="Fitur segera hadir"
          style={{ background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', border: '1px solid rgba(14,165,233,0.4)' }}
        >
          <Plus size={14} /> Tambah Halaman
        </button>
      </div>

      {/* Pages List */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.015)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
      >
        <div className="px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
            {['Judul', 'URL', 'Status', 'Terakhir Diubah'].map((h) => (
              <span key={h} className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">{h}</span>
            ))}
          </div>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {STATIC_PAGES.map((page) => (
            <div key={page.slug} className="px-5 py-4 hover:bg-white/[0.02] transition-colors duration-200 group">
              <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
                <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{page.title}</p>
                <span className="text-[11px] font-mono text-slate-500 hidden sm:block">{page.slug}</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#34d399' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 5px #34d399' }} />
                  {page.status}
                </span>
                <span className="text-[11px] text-slate-600 hidden sm:block">{page.lastUpdated}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="px-5 py-4 m-4 rounded-xl"
          style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.1)' }}
        >
          <p className="text-xs text-sky-400 font-medium">💡 Editor halaman statis akan segera hadir. Saat ini, halaman ini dikelola langsung dari kode sumber.</p>
        </div>
      </div>
    </div>
  )
}
