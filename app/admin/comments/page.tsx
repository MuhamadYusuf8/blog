import type { Metadata } from 'next'
import { MessageSquare } from 'lucide-react'
import CommentModerationTable from '@/components/admin/CommentModerationTable'

export const metadata: Metadata = { title: 'Moderasi Komentar — Kak Rahma' }

export default function CommentsPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pb-6"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div>
          <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24' }}
          >
            <MessageSquare size={11} /> Moderasi Komentar
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight mb-1">Komentar</h1>
          <p className="text-sm text-slate-500">Kelola dan moderasi komentar dari pembaca blog.</p>
        </div>
      </div>

      <CommentModerationTable />
    </div>
  )
}