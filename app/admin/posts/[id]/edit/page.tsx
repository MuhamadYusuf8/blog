import { notFound } from 'next/navigation'
import { createServiceSupabaseClient } from '@/lib/supabase/service'
import PostEditor from '@/components/admin/PostEditor'

export const metadata = {
  title: 'Edit Post — Kak Rahma',
}

interface EditPostPageProps {
  params: { id: string }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const supabase = createServiceSupabaseClient()

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', params.id)
    .is('deleted_at', null)
    .single()

  if (error || !post) {
    notFound()
  }

  return (
    <div className="w-full">
      <PostEditor mode="edit" post={post} />
    </div>
  )
}
