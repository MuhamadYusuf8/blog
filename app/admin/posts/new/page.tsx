/**
 * app/admin/posts/new/page.tsx — New Post Page (Pearl White Edition)
 */

import PostEditor from '@/components/admin/PostEditor'

export const metadata = {
  title: 'Post Baru — Kak Rahma',
}

export default function NewPostPage() {
  return (
    <div className="w-full">
      <PostEditor mode="create" />
    </div>
  )
}