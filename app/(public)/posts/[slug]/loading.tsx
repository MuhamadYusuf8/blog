/**
 * app/(public)/posts/[slug]/loading.tsx — Post detail page skeleton
 * Matches the dark cinematic theme: bg-[#0f0f0f], violet/pink accents.
 */
export default function PostLoading() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] animate-pulse" aria-busy="true" aria-label="Memuat artikel">

      {/* ── HERO IMAGE ───────────────────────────────────────────────── */}
      <div className="relative w-full h-[55vh] min-h-[340px] overflow-hidden"
        style={{ background: "rgba(255,255,255,0.04)" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/30 to-transparent" />
      </div>

      {/* ── ARTICLE CONTENT ──────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-16 relative z-10 pb-24">

        {/* Category + date + meta row */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-6 w-20 rounded-full" style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.2)" }} />
          <div className="w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
          <div className="h-3 w-24 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="w-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
          <div className="h-3 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* Title */}
        <div className="h-10 sm:h-12 rounded-2xl mb-2" style={{ width: "90%", background: "rgba(255,255,255,0.08)" }} />
        <div className="h-10 sm:h-12 rounded-2xl mb-8" style={{ width: "65%", background: "rgba(255,255,255,0.05)" }} />

        {/* Author row */}
        <div className="flex items-center gap-3 mb-10 pb-8" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-9 h-9 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div>
            <div className="h-3.5 w-24 rounded-full mb-1.5" style={{ background: "rgba(255,255,255,0.07)" }} />
            <div className="h-2.5 w-32 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="h-8 w-20 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
            <div className="h-8 w-8 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
          </div>
        </div>

        {/* Article body paragraphs */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2.5 mb-6">
            <div className="h-3.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="h-3.5 rounded-full" style={{ width: "95%", background: "rgba(255,255,255,0.05)" }} />
            <div className="h-3.5 rounded-full" style={{ width: "88%", background: "rgba(255,255,255,0.04)" }} />
            {i % 3 === 2 && (
              <div className="h-3.5 rounded-full" style={{ width: "60%", background: "rgba(255,255,255,0.04)" }} />
            )}
            {/* Occasional image placeholder within body */}
            {i === 2 && (
              <div className="h-52 sm:h-64 rounded-2xl mt-3 mb-1" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
            )}
          </div>
        ))}

        {/* Tags row */}
        <div className="flex items-center gap-2 mt-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="h-2.5 w-10 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
          {[48, 56, 64].map((w, i) => (
            <div key={i} className="h-6 rounded-full" style={{ width: `${w}px`, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }} />
          ))}
        </div>

        {/* Related posts hint */}
        <div className="mt-12">
          <div className="h-5 w-32 rounded-lg mb-5" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="h-36" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="p-4 flex flex-col gap-2">
                  <div className="h-3 w-16 rounded-full" style={{ background: "rgba(139,92,246,0.15)" }} />
                  <div className="h-4 w-full rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <div className="h-4 w-4/5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
