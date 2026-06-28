import { createServerSupabaseClient } from '@/lib/supabase/server'
import BackgroundChanger from '@/components/admin/BackgroundChanger'
import AboutMeForm from '@/components/admin/AboutMeForm'
import type { Metadata } from 'next'
import { Settings } from 'lucide-react'

export const metadata: Metadata = { title: 'Pengaturan — Kak Rahma' }

export default async function SettingsPage() {
  const supabase = createServerSupabaseClient()

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()

  const backgroundType = (settings?.background_type === 'image' ? 'image' : 'color') as 'image' | 'color'
  const backgroundValue = settings?.background_value ?? '#1a1a2e'

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full text-xs font-medium"
          style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', color: '#f472b6' }}
        >
          <Settings size={11} /> Konfigurasi Blog
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight mb-1">Pengaturan</h1>
        <p className="text-sm text-slate-500">Kelola profil, tampilan, dan konfigurasi blog.</p>
      </div>

      <BackgroundChanger currentType={backgroundType} currentValue={backgroundValue} />
      <AboutMeForm bio={settings?.bio ?? ''} avatarUrl={settings?.avatar_url ?? ''} siteTitle={settings?.site_title ?? 'Kak Rahma'} />
    </div>
  )
}