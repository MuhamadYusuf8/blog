'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export type BackgroundType = 'image' | 'color' | 'default'

export interface PlaylistSong {
  id: number
  title: string
  url: string
  sort_order: number
  created_at: string
}

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

// ─── Playlist CRUD ────────────────────────────────────────────────────────────

export async function getPlaylist(): Promise<{ songs: PlaylistSong[]; error?: string }> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('music_playlist')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[getPlaylist]', error)
    return { songs: [], error: 'Gagal memuat playlist.' }
  }
  return { songs: (data ?? []) as PlaylistSong[] }
}

export async function addSongToPlaylist(
  title: string,
  url: string,
): Promise<{ success: boolean; song?: PlaylistSong; error?: string }> {
  const supabase = createServerSupabaseClient()

  // Get current max sort_order
  const { data: maxRow } = await supabase
    .from('music_playlist')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const nextOrder = ((maxRow as { sort_order: number } | null)?.sort_order ?? -1) + 1

  const { data, error } = await supabase
    .from('music_playlist')
    .insert({ title, url, sort_order: nextOrder })
    .select()
    .single()

  if (error) {
    console.error('[addSongToPlaylist]', error)
    return { success: false, error: 'Gagal menambah lagu ke playlist.' }
  }

  revalidatePath('/', 'layout')
  return { success: true, song: data as PlaylistSong }
}

export async function deleteSongFromPlaylist(
  id: number,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('music_playlist')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[deleteSongFromPlaylist]', error)
    return { success: false, error: 'Gagal menghapus lagu.' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function reorderPlaylist(
  orderedIds: number[],
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  const updates = orderedIds.map((id, index) =>
    supabase.from('music_playlist').update({ sort_order: index }).eq('id', id)
  )

  const results = await Promise.all(updates)
  const failed = results.find(r => r.error)
  if (failed?.error) {
    console.error('[reorderPlaylist]', failed.error)
    return { success: false, error: 'Gagal mengubah urutan playlist.' }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}
