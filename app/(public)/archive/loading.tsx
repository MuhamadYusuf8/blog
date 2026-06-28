/**
 * app/(public)/archive/loading.tsx — Archive page skeleton
 * Matches the dark cinematic theme: bg-[#0f0f0f], violet/pink accents, timeline layout.
 */
export default function ArchiveLoading() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] animate-pulse overflow-x-hidden" aria-busy="true" aria-label="Memuat arsip">

      {/* ── CINEMATIC HEADER ─────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 px-5 sm:px-8 overflow-hidden">
        <div className="relative max-w-screen-xl mx-auto">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-3.5 h-3.5 rounded" style={{ background: "rgba(139,92,246,0.3)" }} />
            <div className="h-3 w-24 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Giant title */}
          <div className="h-28 sm:h-36 w-56 sm:w-72 rounded-3xl mb-2" style={{ background: "rgba(255,255,255,0.06)", filter: "drop-shadow(0 0 50px rgba(139,92,246,0.2))" }} />
          <div className="h-10 sm:h-14 w-28 sm:w-36 rounded-2xl mb-8" style={{ background: "rgba(255,255,255,0.025)" }} />

          {/* Subtitle */}
          <div className="flex flex-col gap-2 mb-10 max-w-md">
            <div className="h-3.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="h-3.5 w-4/5 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>

          {/* 4-col stat grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              "rgba(139,92,246,0.12)",
              "rgba(244,114,182,0.10)",
              "rgba(251,191,36,0.10)",
              "rgba(16,185,129,0.10)",
            ].map((bg, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl p-5 flex items-center gap-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: bg }} />
                <div>
                  <div className="h-6 w-12 rounded-lg mb-1" style={{ background: "rgba(255,255,255,0.07)" }} />
                  <div className="h-2.5 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STICKY FILTER BAR ────────────────────────────────────────── */}
      <div style={{ background: "rgba(0,0,0,0.55)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-3 overflow-hidden">
          {/* Search box */}
          <div className="h-8 w-44 rounded-xl flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
          <div className="h-5 w-px flex-shrink-0" style={{ background: "rgba(255,255,255,0.07)" }} />
          {/* Year pills */}
          {[56, 56, 56, 56].map((w, i) => (
            <div key={i} className="h-7 rounded-full flex-shrink-0"
              style={{ width: `${w}px`, background: i === 0 ? "rgba(139,92,246,0.35)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
          ))}
          <div className="h-5 w-px flex-shrink-0" style={{ background: "rgba(255,255,255,0.07)" }} />
          {/* Dropdown */}
          <div className="h-8 w-28 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
          <div className="ml-auto h-2.5 w-14 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>

      {/* ── TIMELINE ─────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-5 sm:px-8 py-14 pb-28">
        <div className="relative pl-14 sm:pl-20">
          {/* Spine line */}
          <div className="absolute left-[28px] sm:left-[36px] top-0 bottom-0 w-px" style={{ background: "rgba(255,255,255,0.05)" }} />

          {/* Year groups */}
          {[...Array(3)].map((_, y) => (
            <div key={y} className="mb-14">
              {/* Year label row */}
              <div className="flex items-center gap-4 mb-8 -ml-14 sm:-ml-20">
                <div className="flex-shrink-0 w-14 sm:w-20 flex justify-center">
                  <div className="w-5 h-5 rounded-full" style={{ background: "rgba(139,92,246,0.5)", boxShadow: "0 0 16px rgba(139,92,246,0.4)" }} />
                </div>
                <div className="h-14 sm:h-20 w-32 sm:w-44 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }} />
              </div>

              {/* Month groups */}
              {[...Array(2)].map((_, m) => (
                <div key={m} className="mb-8">
                  {/* Month label */}
                  <div className="flex items-center gap-3 mb-3 -ml-14 sm:-ml-20">
                    <div className="flex-shrink-0 w-14 sm:w-20 flex justify-center">
                      <div className="w-2 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
                    </div>
                    <div className="h-3 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                    <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.04)" }} />
                    <div className="h-2.5 w-14 rounded-full" style={{ background: "rgba(255,255,255,0.03)" }} />
                  </div>

                  {/* Post rows */}
                  <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}>
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 px-4 py-3.5"
                        style={{ borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                        <div className="h-3 w-16 rounded-full flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }} />
                        <div className="flex-1 h-3.5 rounded-full" style={{ width: `${50 + i * 12}%`, background: "rgba(255,255,255,0.06)" }} />
                        <div className="hidden sm:block h-5 w-16 rounded-full flex-shrink-0" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.15)" }} />
                        <div className="flex items-center gap-3">
                          <div className="hidden md:block h-2.5 w-12 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                          <div className="h-2.5 w-10 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
