/**
 * app/(public)/about/loading.tsx — About page skeleton
 * Matches the dark cinematic theme: bg-[#0f0f0f], violet/pink accents.
 */
export default function AboutLoading() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] animate-pulse overflow-x-hidden" aria-busy="true" aria-label="Memuat halaman about">

      {/* ── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-10 px-5 sm:px-8">
        <div className="relative z-10 max-w-screen-xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left — text column */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-2.5 mb-7">
                <div className="w-1 h-6 rounded-full" style={{ background: "rgba(139,92,246,0.4)" }} />
                <div className="h-3 w-28 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
              </div>

              {/* Name block */}
              <div className="mb-6">
                <div className="h-5 w-24 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="h-24 sm:h-32 w-48 rounded-2xl mb-1" style={{ background: "rgba(255,255,255,0.07)" }} />
                <div className="h-20 sm:h-28 w-52 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>

              {/* Bio lines */}
              <div className="flex flex-col gap-2 mb-8 max-w-md">
                <div className="h-3.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="h-3.5 w-11/12 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
                <div className="h-3.5 w-4/5 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="h-3.5 w-3/4 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>

              {/* Tag pills */}
              <div className="flex flex-wrap gap-2">
                {[80, 64, 72, 72, 80].map((w, i) => (
                  <div key={i} className={`h-7 w-${w} rounded-full`} style={{ width: `${w + 12}px`, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
                ))}
              </div>
            </div>

            {/* Right — portrait */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-xs sm:max-w-sm">
                {/* Glow ring */}
                <div className="absolute -inset-4 rounded-3xl blur-2xl opacity-20" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.6), rgba(244,114,182,0.4))" }} />
                {/* Portrait placeholder */}
                <div className="relative aspect-[3/4] rounded-3xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  {/* Bottom caption strip */}
                  <div className="absolute bottom-5 left-5 right-5 h-14 rounded-2xl" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BENTO ───────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-5 sm:px-8 pb-24">
        {/* Divider with label */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-3 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* 4-col stat grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-10 h-10 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }} />
              <div className="h-9 w-16 rounded-lg" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="h-3 w-24 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>
          ))}
        </div>

        {/* Values section header */}
        <div className="mb-6">
          <div className="h-8 w-40 rounded-xl mb-2" style={{ background: "rgba(255,255,255,0.07)" }} />
          <div className="h-3 w-72 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl p-5 flex gap-4"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex-shrink-0 w-9 h-9 rounded-xl" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.12)" }} />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-3.5 w-3/4 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
                <div className="h-3 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="h-3 w-5/6 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-5 sm:px-8 pb-28">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="h-3 w-28 rounded-full mx-auto mb-3" style={{ background: "rgba(139,92,246,0.2)" }} />
          <div className="h-10 w-64 rounded-xl mx-auto mb-2" style={{ background: "rgba(255,255,255,0.07)" }} />
          <div className="h-10 w-48 rounded-xl mx-auto mb-4" style={{ background: "rgba(139,92,246,0.2)" }} />
          <div className="h-3 w-72 rounded-full mx-auto" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>

        {/* Timeline items */}
        <div className="relative flex flex-col gap-10">
          {/* Spine line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: "rgba(255,255,255,0.06)" }} />
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`relative flex items-start gap-0 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
              <div className="w-[calc(50%-28px)] rounded-2xl p-5"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="h-3 w-12 rounded-full mb-2" style={{ background: "rgba(139,92,246,0.2)" }} />
                <div className="h-3.5 w-3/4 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.07)" }} />
                <div className="h-3 rounded-full mb-1" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="h-3 w-4/5 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
              <div className="flex-shrink-0 w-14 flex flex-col items-center pt-5">
                <div className="w-4 h-4 rounded-full" style={{ background: "rgba(139,92,246,0.5)" }} />
              </div>
              <div className="w-[calc(50%-28px)]" />
            </div>
          ))}
        </div>
      </section>

      {/* ── CONNECT TERMINAL ──────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-5 sm:px-8 pb-28">
        <div className="relative rounded-3xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {/* Terminal top bar */}
          <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="w-3 h-3 rounded-full bg-red-500/30" />
            <div className="w-3 h-3 rounded-full bg-amber-500/30" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
            <div className="ml-3 h-2.5 w-36 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
          <div className="p-8 sm:p-14 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left text */}
            <div>
              <div className="h-10 w-48 rounded-xl mb-2" style={{ background: "rgba(255,255,255,0.07)" }} />
              <div className="h-10 w-36 rounded-xl mb-6" style={{ background: "rgba(139,92,246,0.2)" }} />
              <div className="flex flex-col gap-2 mb-8 max-w-sm">
                <div className="h-3 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="h-3 w-5/6 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="h-3 w-4/5 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
              <div className="h-11 w-36 rounded-2xl" style={{ background: "rgba(139,92,246,0.3)" }} />
            </div>
            {/* Right social links */}
            <div className="grid grid-cols-1 gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl px-4 py-3.5"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="w-9 h-9 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="h-2.5 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
                    <div className="h-3.5 w-28 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
