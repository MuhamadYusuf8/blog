import { createServerSupabaseClient } from '@/lib/supabase/server'
import BackgroundChanger from '@/components/admin/BackgroundChanger'
import AboutMeForm from '@/components/admin/AboutMeForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings | Admin',
}

export default async function SettingsPage() {
  const supabase = createServerSupabaseClient()

  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single()

  const backgroundType = settings?.background_type ?? 'color'
  const backgroundValue = settings?.background_value ?? '#1a1a2e'

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-[-0.4px] text-slate-900">
            Settings
          </h1>
          <p className="text-[12.5px] text-slate-400 mt-0.5 font-medium">
            Kelola profil, tampilan, dan konfigurasi blog.
          </p>
        </div>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'rgba(255,255,255,0.72)',
            border: '1px solid rgba(226,232,240,0.80)',
            boxShadow: '0 2px 8px -3px rgba(15,23,42,0.06)',
          }}
          aria-hidden="true"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#64748b" strokeWidth="1.8">
            <circle cx="8" cy="8" r="2.5" />
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <BackgroundChanger
        currentType={backgroundType}
        currentValue={backgroundValue}
      />

      <AboutMeForm
        bio={settings?.bio ?? ''}
        avatarUrl={settings?.avatar_url ?? ''}
        siteTitle={settings?.site_title ?? 'Kak Rahma'}
      />
    </div>
  )
}