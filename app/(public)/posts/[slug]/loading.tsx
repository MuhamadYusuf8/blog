/**
 * app/(public)/posts/[slug]/loading.tsx — Post detail page skeleton
 */
export default function PostLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse" aria-busy="true">
      {/* Cover image */}
      <div className="h-64 rounded-2xl bg-slate-200/70 mb-8 w-full" />

      {/* Category + date */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-5 w-16 rounded-full bg-slate-200/80" />
        <div className="h-2.5 w-1 rounded-full bg-slate-200" />
        <div className="h-2.5 w-24 rounded-full bg-slate-100" />
      </div>

      {/* Title */}
      <div className="h-9 bg-slate-200/70 rounded-xl mb-2 w-5/6" />
      <div className="h-9 bg-slate-200/50 rounded-xl mb-8 w-2/3" />

      {/* Body paragraphs */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col gap-2 mb-5">
          <div className="h-3 bg-slate-100 rounded-full" />
          <div className="h-3 bg-slate-100 rounded-full w-11/12" />
          <div className="h-3 bg-slate-100 rounded-full w-4/5" />
          {i % 3 === 2 && <div className="h-3 bg-slate-100 rounded-full w-1/2" />}
        </div>
      ))}
    </div>
  )
}
