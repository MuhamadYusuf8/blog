/**
 * app/(public)/layout.tsx — Public Site Layout
 * Dark edition — page.tsx manages its own Navbar, Footer & background.
 * This layout is a transparent passthrough to avoid wrapping conflicts.
 */

import type React from 'react'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // page.tsx owns the full-page layout (Navbar, Footer, bg colour).
  // We render children directly without any wrapper padding/chrome.
  return <>{children}</>
}