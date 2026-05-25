/**
 * app/(public)/archive/loading.tsx — Archive page skeleton
 */
export default function ArchiveLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse" aria-busy="true">
      <div className="h-9 w-40 bg-slate-200/80 rounded-xl mb-2" />
      <div className="h-3 w-48 bg-slate-100 rounded-full mb-10" />

      {/* Year groups */}
      {[...Array(3)].map((_, y) => (
        <div key={y} className="mb-8">
          <div className="h-4 w-12 bg-slate-200/80 rounded-full mb-4" />
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(226,232,240,0.70)' }}
              >
                <div className="h-2.5 w-16 bg-slate-200/60 rounded-full flex-shrink-0" />
                <div className="h-3.5 flex-1 bg-slate-200/60 rounded-full" />
                <div className="h-2.5 w-14 bg-slate-100 rounded-full flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
