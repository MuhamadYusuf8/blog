'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function approveComment(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('comments')
    .update({ is_approved: true })
    .eq('id', id)
    .is('deleted_at', null)

  if (error) {
    console.error('[approveComment]', error)
    return { success: false, error: 'Failed to approve comment.' }
  }

  revalidatePath('/admin/comments')
  return { success: true }
}

export async function rejectComment(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('comments')
    .update({ is_approved: false })
    .eq('id', id)
    .is('deleted_at', null)

  if (error) {
    console.error('[rejectComment]', error)
    return { success: false, error: 'Failed to reject comment.' }
  }

  revalidatePath('/admin/comments')
  return { success: true }
}

/**
 * Soft-deletes a comment by setting deleted_at = now().
 * The SQL DELETE statement is strictly prohibited per SRS RULE 2.
 */
export async function softDeleteComment(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('comments')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('[softDeleteComment]', error)
    return { success: false, error: 'Failed to move comment to trash.' }
  }

  revalidatePath('/admin/comments')
  return { success: true }
}

export async function restoreComment(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('comments')
    .update({ deleted_at: null })
    .eq('id', id)

  if (error) {
    console.error('[restoreComment]', error)
    return { success: false, error: 'Failed to restore comment.' }
  }

  revalidatePath('/admin/comments')
  return { success: true }
}

export async function bulkApproveComments(
  ids: string[],
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('comments')
    .update({ is_approved: true })
    .in('id', ids)
    .is('deleted_at', null)

  if (error) {
    console.error('[bulkApproveComments]', error)
    return { success: false, error: 'Failed to bulk approve comments.' }
  }

  revalidatePath('/admin/comments')
  return { success: true }
}

export async function bulkRejectComments(
  ids: string[],
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('comments')
    .update({ is_approved: false })
    .in('id', ids)
    .is('deleted_at', null)

  if (error) {
    console.error('[bulkRejectComments]', error)
    return { success: false, error: 'Failed to bulk reject comments.' }
  }

  revalidatePath('/admin/comments')
  return { success: true }
}
