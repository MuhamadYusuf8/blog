/**
 * app/(public)/about/loading.tsx — About page skeleton
 */
export default function AboutLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse" aria-busy="true">
      <div className="h-3 w-20 bg-slate-200 rounded-full mb-6" />
      <div className="h-9 w-64 bg-slate-200/80 rounded-xl mb-4" />
      <div className="flex flex-col gap-2 mb-10">
        <div className="h-3 bg-slate-100 rounded-full" />
        <div className="h-3 w-5/6 bg-slate-100 rounded-full" />
        <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
      </div>
      <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.72)', border: '1px solid rgba(226,232,240,0.70)' }}>
        <div className="w-20 h-20 rounded-full bg-slate-200 mx-auto mb-4" />
        <div className="h-5 w-32 bg-slate-200/70 rounded-lg mx-auto mb-2" />
        <div className="h-3 w-48 bg-slate-100 rounded-full mx-auto mb-4" />
        <div className="flex flex-col gap-2">
          <div className="h-3 bg-slate-100 rounded-full" />
          <div className="h-3 w-5/6 bg-slate-100 rounded-full" />
        </div>
      </div>
    </div>
  )
}
