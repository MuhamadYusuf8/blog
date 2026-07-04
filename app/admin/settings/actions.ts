'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export type BackgroundType = 'image' | 'color' | 'default'

export async function updateBackground(
  type: BackgroundType,
  value: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  const updatePayload =
    type === 'image'
      ? { background_type: 'image' as const, background_value: value }
      : type === 'color'
      ? { background_type: 'color' as const, background_value: value }
      : { background_type: 'color' as const, background_value: '' }


  const { error } = await supabase
    .from('site_settings')
    .update(updatePayload)
    .eq('id', 1)

  if (error) {
    console.error('[updateBackground]', error)
    return { success: false, error: 'Failed to update background.' }
  }

  // Revalidate the root layout so the new background is applied immediately
  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateAboutMe(
  bio: string,
  avatarUrl: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('site_settings')
    .update({ bio, avatar_url: avatarUrl })
    .eq('id', 1)

  if (error) {
    console.error('[updateAboutMe]', error)
    return { success: false, error: 'Failed to update about me.' }
  }

  revalidatePath('/', 'layout')
  revalidatePath('/about')
  return { success: true }
}

export async function updateSiteTitle(
  siteTitle: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('site_settings')
    .update({ site_title: siteTitle })
    .eq('id', 1)

  if (error) {
    console.error('[updateSiteTitle]', error)
    return { success: false, error: 'Failed to update site title.' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateMusic(
  enabled: boolean,
  url: string,
  title: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('site_settings')
    .update({
      music_enabled: enabled,
      music_url: url || null,
      music_title: title || null,
    })
    .eq('id', 1)

  if (error) {
    console.error('[updateMusic]', error)
    return { success: false, error: 'Gagal menyimpan pengaturan musik.' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
