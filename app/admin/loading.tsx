/**
 * app/admin/loading.tsx — Admin Content Loading Skeleton
 * Ditampilkan otomatis oleh Next.js saat halaman admin sedang di-fetch server-side.
 */

export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse" aria-label="Memuat halaman..." aria-busy="true">

      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-28 bg-slate-200/80 rounded-full" />
          <div className="h-7 w-56 bg-slate-200/60 rounded-lg" />
          <div className="h-3 w-40 bg-slate-100 rounded-full" />
        </div>
        <div className="h-9 w-32 bg-slate-200/60 rounded-xl" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
              background: 'rgba(255,255,255,0.60)',
              border: '1px solid rgba(226,232,240,0.60)',
            }}
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-xl bg-slate-100" />
              <div className="h-5 w-14 bg-slate-100 rounded" />
            </div>
            <div>
              <div className="h-2.5 w-16 bg-slate-100 rounded-full mb-2" />
              <div className="h-7 w-10 bg-slate-200/70 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      {/* Two-col skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">

        {/* Quick actions skeleton */}
        <div className="flex flex-col gap-2">
          <div className="h-2.5 w-20 bg-slate-200/80 rounded-full mb-1" />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-[44px] rounded-xl"
              style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(226,232,240,0.60)' }}
            />
          ))}
        </div>

        {/* Recent posts skeleton */}
        <div className="flex flex-col gap-2">
          <div className="h-2.5 w-28 bg-slate-200/80 rounded-full mb-1" />
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.60)', border: '1px solid rgba(226,232,240,0.60)' }}
          >
            <div className="h-11 border-b border-slate-100 px-5 flex items-center justify-between">
              <div className="h-3 w-32 bg-slate-200/70 rounded-full" />
              <div className="h-3 w-16 bg-slate-100 rounded-full" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-4 border-b border-slate-100/80">
                <div className="w-2 h-2 rounded-full bg-slate-200 flex-shrink-0" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="h-3 bg-slate-200/70 rounded-full" style={{ width: `${65 + i * 6}%` }} />
                  <div className="h-2.5 w-32 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
