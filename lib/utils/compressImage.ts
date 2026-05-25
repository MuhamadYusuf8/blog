/**
 * lib/utils/compressImage.ts
 * Client-side image compression wrapper — SRS §3.2.4.
 *
 * ⚠️  This utility is CLIENT ONLY. It imports browser-image-compression
 *     which uses Web Workers and browser File APIs. Never import in a
 *     Server Component or Server Action.
 *
 * Compression options (exact values from SRS §3.2.4):
 *   - maxSizeMB: 1          → hard cap at 1 MB after compression
 *   - maxWidthOrHeight: 1920 → resizes proportionally if larger
 *   - useWebWorker: true     → compression runs off the main thread
 *   - fileType: 'image/webp' → always output WebP for best compression ratio
 *   - initialQuality: 0.85   → 85% quality — good balance of size vs fidelity
 *
 * Usage:
 *   const compressed = await compressImage(file)
 *   // compressed is a File (WebP) ready for Supabase Storage upload
 */

import imageCompression from 'browser-image-compression'

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp' as const,
    initialQuality: 0.85,
  }

  // browser-image-compression returns a Blob; cast to File and preserve name
  const compressedBlob = await imageCompression(file, options)

  // Derive a WebP filename from the original
  const originalName = file.name.replace(/\.[^/.]+$/, '')
  const webpFileName = `${originalName}.webp`

  return new File([compressedBlob], webpFileName, {
    type: 'image/webp',
    lastModified: Date.now(),
  })
}
