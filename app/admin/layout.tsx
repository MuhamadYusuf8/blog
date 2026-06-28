/**
 * app/admin/layout.tsx — Admin Dark Shell
 * Sidebar dirender di sini agar konsisten di semua halaman admin.
 * Background gelap dipaksakan sejak SSR melalui <style> di <head>.
 */

import type React from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AdminShell } from '@/components/admin/AdminShell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = headers().get('x-pathname') || ''

  // Halaman login: no shell, no auth check
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  const { count: pendingCount } = await supabase
    .from('comments')
    .select('id', { count: 'exact', head: true })
    .eq('is_approved', false)
    .is('deleted_at', null)

  return (
    <>
      {/*
        Inject dark background CSS at the <head> level for admin routes.
        This fires before page render so there's zero flash-of-white,
        even though site_settings applies a body inline style via RootLayout.
      */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            body {
              background-color: #0a0a0f !important;
              background-image: none !important;
            }
          `,
        }}
      />
      <AdminShell pendingCommentCount={pendingCount ?? 0}>
        {children}
      </AdminShell>
    </>
  )
}