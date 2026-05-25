/**
 * app/(public)/loading.tsx — Public site loading skeleton
 * Shown automatically by Next.js while any public page is being server-fetched.
 */

export default function PublicLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24 animate-pulse" aria-busy="true" aria-label="Memuat halaman">

      {/* Hero skeleton */}
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 mx-auto">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
          <div className="h-2.5 w-32 bg-slate-200 rounded-full" />
        </div>
        <div className="h-10 w-72 bg-slate-200/80 rounded-xl mx-auto mb-3" />
        <div className="h-4 w-56 bg-slate-100 rounded-full mx-auto" />
        {/* Centerpiece placeholder */}
        <div className="w-40 h-40 rounded-full bg-slate-100/70 mx-auto mt-8 mb-4" />
        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <div className="h-px w-16 bg-slate-200" />
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="h-px w-16 bg-slate-200" />
        </div>
      </header>

      {/* Two-column: Feed + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">

        {/* Feed column */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-2.5 w-24 bg-slate-200 rounded-full" />
            <div className="flex-1 h-px bg-slate-200/50" />
          </div>

          {/* Post card skeletons */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.72)',
                border: '1px solid rgba(226,232,240,0.70)',
                boxShadow: '0 1px 8px -3px rgba(15,23,42,0.04)',
              }}
            >
              {/* Cover image placeholder */}
              <div className="h-44 bg-slate-100" />
              <div className="p-5 flex flex-col gap-3">
                <div className="h-2 w-16 bg-slate-200/80 rounded-full" />
                <div className="h-5 bg-slate-200/70 rounded-lg w-4/5" />
                <div className="h-3 bg-slate-100 rounded-full" />
                <div className="h-3 bg-slate-100 rounded-full w-3/4" />
                <div className="flex items-center gap-3 mt-1">
                  <div className="h-2.5 w-20 bg-slate-100 rounded-full" />
                  <div className="h-2.5 w-12 bg-slate-100 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Sidebar skeleton */}
        <aside className="flex flex-col gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-5"
              style={{
                background: 'rgba(255,255,255,0.72)',
                border: '1px solid rgba(226,232,240,0.70)',
              }}
            >
              <div className="h-3 w-24 bg-slate-200/80 rounded-full mb-4" />
              <div className="flex flex-col gap-3">
                <div className="h-3 bg-slate-100 rounded-full" />
                <div className="h-3 w-4/5 bg-slate-100 rounded-full" />
                <div className="h-3 w-2/3 bg-slate-100 rounded-full" />
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  )
}
