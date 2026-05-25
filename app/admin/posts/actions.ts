/**
 * app/admin/posts/actions.ts — Post Management Server Actions
 * SRS Phase 3B step 6, RULE 2.
 *
 * RULE 2 COMPLIANCE:
 *   - softDeletePost uses UPDATE ... SET deleted_at = now() — NEVER DELETE
 *   - restorePost uses UPDATE ... SET deleted_at = null
 *   - No supabase.from('posts').delete() anywhere in this file
 */

'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { PostFormData, PostStatus } from '@/lib/supabase/types'
import { estimateReadTime } from '@/lib/utils/readTime'

type ActionResult = { success: true; id?: string } | { success: false; error: string }

// ---------------------------------------------------------------------------
// Soft Delete — RULE 2: UPDATE ... SET deleted_at = now()
// ---------------------------------------------------------------------------
export async function softDeletePost(id: string): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('posts')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('[softDeletePost] Error:', error.message)
    return { success: false, error: 'Gagal memindahkan postingan ke sampah.' }
  }

  revalidatePath('/admin/posts')
  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true }
}

// ---------------------------------------------------------------------------
// Restore — undo soft delete
// ---------------------------------------------------------------------------
export async function restorePost(id: string): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('posts')
    .update({ deleted_at: null })
    .eq('id', id)

  if (error) {
    console.error('[restorePost] Error:', error.message)
    return { success: false, error: 'Gagal memulihkan postingan.' }
  }

  revalidatePath('/admin/posts')
  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true }
}

// ---------------------------------------------------------------------------
// Toggle Publish Status
// ---------------------------------------------------------------------------
export async function togglePublishStatus(
  id: string,
  currentStatus: PostStatus
): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()

  const newStatus: PostStatus = currentStatus === 'published' ? 'draft' : 'published'
  const publishedAt = newStatus === 'published' ? new Date().toISOString() : null

  const { error } = await supabase
    .from('posts')
    .update({ status: newStatus, published_at: publishedAt })
    .eq('id', id)

  if (error) {
    console.error('[togglePublishStatus] Error:', error.message)
    return { success: false, error: 'Gagal mengubah status postingan.' }
  }

  revalidatePath('/admin/posts')
  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true }
}

// ---------------------------------------------------------------------------
// Create Post
// ---------------------------------------------------------------------------
export async function createPost(data: PostFormData): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()

  const publishedAt = data.status === 'published' ? new Date().toISOString() : null

  const { data: newPost, error } = await supabase
    .from('posts')
    .insert({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content_html: data.content_html,
      cover_image_url: data.cover_image_url,
      category: data.category,
      tags: data.tags,
      status: data.status,
      published_at: publishedAt,
      deleted_at: null,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[createPost] Error:', error.message)

    if (error.code === '23505') {
      return { success: false, error: 'Slug sudah digunakan. Gunakan slug lain.' }
    }

    return { success: false, error: 'Gagal membuat postingan. Silakan coba lagi.' }
  }

  revalidatePath('/admin/posts')
  revalidatePath('/admin')
  revalidatePath('/')
  return { success: true, id: newPost.id }
}

// ---------------------------------------------------------------------------
// Update Post
// ---------------------------------------------------------------------------
export async function updatePost(
  id: string,
  data: PostFormData
): Promise<ActionResult> {
  const supabase = createServerSupabaseClient()

  // If status is changing to 'published' and there is no existing published_at,
  // set it now. If toggling back to draft, preserve the original published_at.
  const { data: existingPost } = await supabase
    .from('posts')
    .select('published_at, status')
    .eq('id', id)
    .single()

  let publishedAt = existingPost?.published_at ?? null
  if (data.status === 'published' && !publishedAt) {
    publishedAt = new Date().toISOString()
  }

  const { error } = await supabase
    .from('posts')
    .update({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content_html: data.content_html,
      cover_image_url: data.cover_image_url,
      category: data.category,
      tags: data.tags,
      status: data.status,
      published_at: publishedAt,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
    })
    .eq('id', id)

  if (error) {
    console.error('[updatePost] Error:', error.message)

    if (error.code === '23505') {
      return { success: false, error: 'Slug sudah digunakan. Gunakan slug lain.' }
    }

    return { success: false, error: 'Gagal memperbarui postingan.' }
  }

  revalidatePath('/admin/posts')
  revalidatePath('/admin')
  revalidatePath('/')
  revalidatePath(`/posts/${data.slug}`)
  return { success: true }
}
