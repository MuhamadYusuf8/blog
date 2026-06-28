/**
 * app/admin/loading.tsx — Admin Loading Skeleton (Dark Edition)
 * Sesuai tema dark cinematic AdminShell.
 */

export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse" aria-label="Memuat halaman..." aria-busy="true">
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex flex-col gap-3">
          <div className="h-5 w-36 rounded-full" style={{ background: "rgba(124,58,237,0.2)" }} />
          <div className="h-8 w-64 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }} />
          <div className="h-4 w-48 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
        </div>
        <div className="h-11 w-36 rounded-xl" style={{ background: "rgba(124,58,237,0.2)" }} />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl p-6 flex flex-col gap-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl" style={{ background: "rgba(255,255,255,0.05)" }} />
              <div className="h-5 w-14 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
            </div>
            <div className="h-9 w-20 rounded-lg" style={{ background: "rgba(255,255,255,0.05)" }} />
            <div className="h-4 w-28 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
        ))}
      </div>

      {/* Two-col skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* Posts skeleton */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg" style={{ background: "rgba(124,58,237,0.15)" }} />
              <div className="flex flex-col gap-1.5">
                <div className="h-3.5 w-32 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
                <div className="h-3 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
            </div>
            <div className="h-4 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
              <div className="w-7 h-7 rounded-lg flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)" }} />
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="h-3.5 rounded-full" style={{ width: `${55 + i * 8}%`, background: "rgba(255,255,255,0.06)" }} />
                <div className="h-3 w-28 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
              </div>
              <div className="hidden md:block h-5 w-20 rounded-full" style={{ background: "rgba(255,255,255,0.05)" }} />
              <div className="h-4 w-12 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>
          ))}
        </div>

        {/* Quick actions skeleton */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.015)", border: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="w-8 h-8 rounded-lg" style={{ background: "rgba(16,185,129,0.12)" }} />
            <div className="flex flex-col gap-1.5">
              <div className="h-3.5 w-24 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }} />
              <div className="h-3 w-16 rounded-full" style={{ background: "rgba(255,255,255,0.04)" }} />
            </div>
          </div>
          <div className="p-4 space-y-2.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-[72px] rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
