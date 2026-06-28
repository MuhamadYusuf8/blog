/**
 * app/(public)/loading.tsx — Public Homepage Loading Skeleton
 * Matches the dark cinematic theme: bg-[#0f0f0f], violet/pink accents.
 */
export default function PublicLoading() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] animate-pulse" aria-busy="true" aria-label="Memuat halaman">

      {/* ── Hero Carousel Skeleton ─────────────────────────────────────── */}
      <div className="relative w-full h-[92vh] min-h-[520px] bg-zinc-900/80 overflow-hidden">
        {/* Fake gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />

        {/* Bottom content area */}
        <div className="absolute bottom-16 left-0 right-0 px-4 sm:px-10 max-w-screen-xl mx-auto">
          {/* Badge row */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-24 rounded-full" style={{ background: "rgba(139,92,246,0.2)" }} />
            <div className="h-5 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
          {/* Title lines */}
          <div className="h-10 sm:h-14 w-3/4 max-w-lg rounded-2xl mb-2" style={{ background: "rgba(255,255,255,0.07)" }} />
          <div className="h-10 sm:h-14 w-1/2 max-w-xs rounded-2xl mb-5" style={{ background: "rgba(255,255,255,0.04)" }} />
          {/* Buttons */}
          <div className="flex items-center gap-4">
            <div className="h-11 w-36 rounded-2xl" style={{ background: "rgba(139,92,246,0.25)" }} />
            <div className="h-4 w-28 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
          </div>
        </div>

        {/* Arrow buttons */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full" style={{ background: "rgba(0,0,0,0.4)" }} />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full" style={{ background: "rgba(0,0,0,0.4)" }} />

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "rgba(255,255,255,0.08)" }} />

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          <div className="w-6 h-2 rounded-full" style={{ background: "rgba(139,92,246,0.6)" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
          <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
        </div>
      </div>

      {/* ── Trending Section ───────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
        {/* Section header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded" style={{ background: "rgba(139,92,246,0.25)" }} />
              <div className="h-6 w-44 rounded-lg" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>
            <div className="h-3 w-52 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
          <div className="h-4 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>

        {/* Horizontal scroll cards */}
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[160px] sm:w-[190px]">
              <div className="aspect-[3/4] rounded-xl mb-2.5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }} />
              <div className="h-4 w-16 rounded-full mb-1.5" style={{ background: "rgba(139,92,246,0.15)" }} />
              <div className="h-3 rounded-full mb-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="h-3 w-3/4 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)" }} />
      </div>

      {/* ── Latest Grid Section ────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-20 pt-8">
        {/* Section header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded" style={{ background: "rgba(139,92,246,0.25)" }} />
              <div className="h-6 w-36 rounded-lg" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>
            <div className="h-3 w-56 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
          <div className="h-4 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-7 rounded-full flex-shrink-0 ${i === 0 ? "w-20" : "w-14"}`}
              style={{ background: i === 0 ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            />
          ))}
        </div>

        {/* Post grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] rounded-xl mb-2.5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }} />
              <div className="h-4 w-16 rounded-full mb-1.5" style={{ background: "rgba(139,92,246,0.15)" }} />
              <div className="h-3 rounded-full mb-1" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="h-3 w-3/4 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="h-2.5 w-20 rounded-full mt-1" style={{ background: "rgba(255,255,255,0.03)" }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
