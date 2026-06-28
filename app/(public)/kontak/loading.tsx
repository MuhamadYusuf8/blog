/**
 * app/(public)/kontak/loading.tsx — Kontak page skeleton
 * Matches the dark cinematic theme: bg-[#0f0f0f], violet/pink accents.
 */
export default function KontakLoading() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] animate-pulse overflow-x-hidden" aria-busy="true" aria-label="Memuat halaman kontak">
      <section className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8 pt-28 pb-24">
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-20 items-start">

          {/* ── LEFT — Hero copy ── */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2.5 mb-7">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(139,92,246,0.5)" }} />
              <div className="h-3 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
            </div>

            {/* Big headline */}
            <div className="mb-6 flex flex-col gap-2">
              <div className="h-16 sm:h-20 w-44 rounded-2xl" style={{ background: "rgba(255,255,255,0.07)", filter: "drop-shadow(0 0 44px rgba(139,92,246,0.2))" }} />
              <div className="h-16 sm:h-20 w-40 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }} />
              <div className="h-16 sm:h-20 w-36 rounded-2xl" style={{ background: "rgba(255,255,255,0.035)" }} />
            </div>

            {/* Sub copy lines */}
            <div className="flex flex-col gap-2 mb-10 max-w-sm">
              <div className="h-3.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
              <div className="h-3.5 w-5/6 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="h-3.5 w-4/5 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="h-3.5 w-3/4 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>

            {/* Social pill links */}
            <div className="flex flex-col gap-2.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 w-fit rounded-2xl px-4 py-3"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-8 h-8 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }} />
                  <div className="h-3.5 w-32 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — Contact form skeleton ── */}
          <div>
            <div className="relative rounded-3xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {/* Terminal bar */}
              <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/30" />
                <div className="ml-2 h-2.5 w-40 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>

              <div className="p-6 sm:p-8 flex flex-col gap-4">
                {/* Name + Email row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="h-14 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
                  <div className="h-14 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
                </div>
                {/* Subject */}
                <div className="h-14 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
                {/* Message */}
                <div className="h-36 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }} />
                {/* Submit button */}
                <div className="h-12 rounded-2xl" style={{ background: "rgba(139,92,246,0.3)" }} />
                {/* Trust row */}
                <div className="h-3 w-48 rounded-full mx-auto" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-3 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
