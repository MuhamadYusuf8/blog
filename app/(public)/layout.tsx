/**
 * app/(public)/layout.tsx — Public Site Layout
 * Pearl White edition — untuk halaman publik.
 */

import type React from 'react'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100dvh-4rem)] pt-6 pb-8">
        {children}
      </main>
      <Footer />
    </>
  )
}