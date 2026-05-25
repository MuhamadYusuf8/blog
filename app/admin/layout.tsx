/**
 * app/admin/layout.tsx — Admin Shell Layout (Pearl White Edition)
 * Light glassmorphism shell, selaras dengan public blog.
 */

import type React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = headers().get('x-pathname') || ''

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const supabase = createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { count: pendingCount } = await supabase
    .from('comments')
    .select('id', { count: 'exact', head: true })
    .eq('is_approved', false)
    .is('deleted_at', null)

  return (
    /*
     * Pearl White shell:
     * - Background: #f8fafc dengan subtle gradient overlay (sama dengan preview HTML)
     * - Teks default: slate-800 (gelap, bukan putih)
     * - Tidak ada bg-gray-950 / dark mode
     */
    <div
      className="min-h-dvh text-slate-800 flex"
      style={{
        background: 'linear-gradient(135deg, rgba(226,232,240,0.35) 0%, transparent 50%), #f8fafc',
      }}
    >
      <AdminSidebar pendingCommentCount={pendingCount ?? 0} />

      {/* Main content — offset 200px (lebar sidebar desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[200px]">
        <main className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}