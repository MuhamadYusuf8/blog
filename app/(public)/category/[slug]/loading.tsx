/**
 * app/(public)/category/[slug]/loading.tsx — Category page skeleton
 * Matches the dark cinematic theme: bg-[#0f0f0f], violet/pink accents.
 */
export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] animate-pulse overflow-x-hidden" aria-busy="true" aria-label="Memuat kategori">

      {/* ── CINEMATIC HERO ───────────────────────────────────────────── */}
      <section className="relative h-[48vh] min-h-[360px] flex items-end overflow-hidden pt-28">
        {/* Ambient glow background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[120px]"
            style={{ background: "rgba(139,92,246,0.18)" }} />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
        </div>

        {/* Bottom hero content */}
        <div className="relative z-10 w-full max-w-screen-xl mx-auto px-5 sm:px-8 pb-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 mb-6">
            <div className="h-3 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="h-3 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="h-3 w-20 rounded-full" style={{ background: "rgba(139,92,246,0.3)" }} />
          </div>

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="h-3 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="h-px w-16" style={{ background: "rgba(139,92,246,0.3)" }} />
          </div>

          {/* Giant category title */}
          <div className="h-20 sm:h-28 w-48 sm:w-72 rounded-2xl mb-6"
            style={{ background: "rgba(255,255,255,0.07)", filter: "drop-shadow(0 0 48px rgba(139,92,246,0.25))" }} />

          {/* Description + stats row */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="flex flex-col gap-2 max-w-lg">
              <div className="h-4 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
              <div className="h-4 w-4/5 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>
            {/* Mini stats */}
            <div className="flex items-center gap-6 sm:ml-auto">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-center">
                  <div className="h-5 w-10 rounded-lg mx-auto mb-1" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <div className="h-2.5 w-14 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── POST GRID ─────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i}>
              {/* Cover image */}
              <div className="relative aspect-[3/4] rounded-2xl mb-3"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>
                {/* Top badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <div className="h-4 w-10 rounded-full" style={{ background: "rgba(139,92,246,0.2)" }} />
                </div>
                {/* Top-right view count */}
                <div className="absolute top-3 right-3 h-4 w-10 rounded-full" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)" }} />
                {/* Bottom text */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5">
                  <div className="h-2.5 w-24 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <div className="h-3.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                  <div className="h-3.5 w-4/5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
