/**
 * app/(public)/search/page.tsx — Full-Text Search Page
 * SRS §3.1.8, Phase 2D step 23.
 *
 * Reads ?q= from searchParams and performs Supabase full-text search
 * using the `fts` computed column (GIN index on title + excerpt + content).
 */

import type { Metadata } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { PostCard } from '@/components/public/PostCard'
import { GlassPanel } from '@/components/ui/GlassPanel'
import type { PostRow } from '@/lib/supabase/types'

export const revalidate = 0 // search results must never be cached

type SearchPageProps = {
  searchParams: { q?: string }
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const q = searchParams.q?.trim() ?? ''
  return {
    title: q ? `Hasil pencarian: "${q}"` : 'Cari Postingan',
    description: q ? `Hasil pencarian untuk "${q}".` : 'Cari postingan di Kak Rahma Blog.',
    robots: { index: false, follow: false }, // don't index search result pages
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() ?? ''

  let posts: PostRow[] = []
  let searchError = false

  if (query.length >= 2) {
    const supabase = createServerSupabaseClient()

    // SRS §3.1.8: textSearch on the `fts` computed column, type 'websearch'
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'published')
      .is('deleted_at', null)
      .textSearch('fts', query, { type: 'websearch' })
      .order('published_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('[SearchPage] Full-text search error:', error.message)
      searchError = true
    } else {
      posts = data ?? []
    }
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      {/* Search header + input */}
      <GlassPanel className="p-6">
        <h1 className="text-white font-bold text-2xl mb-4 flex items-center gap-2">
          <span aria-hidden="true">🔍</span> Cari Postingan
        </h1>
        <form method="GET" action="/search" role="search">
          <div className="flex gap-3">
            <label htmlFor="search-input" className="sr-only">Kata kunci pencarian</label>
            <input
              id="search-input"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Ketik kata kunci..."
              autoComplete="off"
              className="
                flex-1 px-4 py-2.5 rounded-xl
                bg-white/10 border border-white/20
                text-white placeholder-white/30 text-sm
                focus:outline-none focus:ring-2 focus:ring-purple-400/60
                transition-all duration-200
              "
            />
            <button
              type="submit"
              className="
                px-5 py-2.5 rounded-xl text-sm font-semibold
                bg-purple-600/70 hover:bg-purple-500/80
                text-white border border-purple-400/30
                transition-all duration-200
              "
            >
              Cari
            </button>
          </div>
        </form>
      </GlassPanel>

      {/* Results */}
      {searchError && (
        <GlassPanel variant="error" className="p-6 text-center" role="alert">
          <p className="text-red-300 text-sm">Terjadi kesalahan saat mencari. Silakan coba lagi.</p>
        </GlassPanel>
      )}

      {query.length >= 2 && !searchError && (
        <>
          <p className="text-white/50 text-sm px-1">
            {posts.length === 0
              ? `Tidak ada hasil untuk "${query}"`
              : `${posts.length} hasil untuk "${query}"`}
          </p>

          {posts.length === 0 ? (
            <GlassPanel className="p-12 text-center">
              <div className="text-4xl mb-3" aria-hidden="true">🌫️</div>
              <p className="text-white/60 text-sm">
                Tidak ada postingan yang cocok dengan kata kunci Anda.
              </p>
            </GlassPanel>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              aria-label={`${posts.length} hasil pencarian`}
            >
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </>
      )}

      {query.length > 0 && query.length < 2 && (
        <GlassPanel className="p-6 text-center">
          <p className="text-white/50 text-sm">Masukkan minimal 2 karakter untuk mencari.</p>
        </GlassPanel>
      )}

      {!query && (
        <GlassPanel className="p-10 text-center">
          <div className="text-4xl mb-3" aria-hidden="true">✨</div>
          <p className="text-white/50 text-sm">Ketik kata kunci di atas untuk mencari postingan.</p>
        </GlassPanel>
      )}
    </div>
  )
}
