"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Home, ChevronRight, Eye, Clock, TrendingUp, Loader2, Sparkles, BookOpen, Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { PublicPostItem } from "@/lib/utils/publicHelpers";

type SortValue = "latest" | "popular";
const PAGE_SIZE = 8;

const CATEGORY_META: Record<string, { label: string; description: string; accent: string; glow: string }> = {
  jurnal: {
    label: "Jurnal",
    description: "Catatan harian, refleksi pribadi, dan serpihan pikiran yang dituangkan ke dalam halaman.",
    accent: "from-violet-400 to-fuchsia-400",
    glow: "rgba(139,92,246,0.22)",
  },
  desain: {
    label: "Desain",
    description: "Eksplorasi visual, proses kreatif, dan filosofi di balik setiap karya.",
    accent: "from-cyan-400 to-blue-400",
    glow: "rgba(34,211,238,0.18)",
  },
  tutorial: {
    label: "Tutorial",
    description: "Panduan langkah demi langkah untuk belajar dan berkembang bersama.",
    accent: "from-emerald-400 to-teal-400",
    glow: "rgba(52,211,153,0.18)",
  },
  ilustrasi: {
    label: "Ilustrasi",
    description: "Dunia yang hanya bisa diungkapkan lewat gambar — satu sapuan kuas dalam satu waktu.",
    accent: "from-pink-400 to-rose-400",
    glow: "rgba(244,114,182,0.22)",
  },
};

const DEFAULT_META = {
  label: "Kategori",
  description: "Kumpulan tulisan, ilustrasi, dan cerita terbaik dalam kategori ini.",
  accent: "from-violet-400 to-pink-400",
  glow: "rgba(139,92,246,0.2)",
};

const NoiseSVG = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none" aria-hidden>
    <filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

function MeshBackground({ glow }: { glow: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[120px]" style={{ background: glow, opacity: 0.6 }} />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: glow, opacity: 0.2 }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)", backgroundSize: "52px 52px" }} />
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/95 via-[#0f0f0f]/50 to-transparent" />
      <NoiseSVG />
    </div>
  );
}

function TagBadge({ label, accent }: { label: string; accent: string }) {
  return (
    <span className={`text-[9px] font-black uppercase tracking-[0.18em] px-2 py-0.5 rounded-full bg-gradient-to-r ${accent} bg-clip-text text-transparent border border-white/10`}>
      {label}
    </span>
  );
}

function isRecentPost(dateRaw: string): boolean {
  const diff = Date.now() - new Date(dateRaw).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000;
}

function PostCard({ post, index, accent }: { post: PublicPostItem; index: number; accent: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={`/posts/${post.slug}`}>
      <motion.article
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
        className="group cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 mb-3">
          {post.cover_image_url ? (
            <motion.img src={post.cover_image_url} alt={post.title} className="absolute inset-0 w-full h-full object-cover" animate={{ scale: hovered ? 1.1 : 1 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} />
          ) : (
            <motion.div className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-700" animate={{ scale: hovered ? 1.1 : 1 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <motion.div className="absolute inset-0 bg-black/60" animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.5, ease: "easeInOut" }} />
          <AnimatePresence>
            {hovered && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.5, delay: 0.15, ease: "easeInOut" }} className="absolute inset-0 flex flex-col justify-center items-start p-5">
                <p className="text-white/85 text-xs sm:text-sm leading-relaxed line-clamp-6 mb-4 font-light italic">"{post.excerpt || 'Tanpa ringkasan'}"</p>
                <div className="flex items-center gap-1.5 text-white/60 text-[10px] font-semibold uppercase tracking-widest">
                  <span>Baca Selengkapnya</span><ArrowUpRight size={11} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div className="absolute bottom-0 left-0 right-0 p-3" animate={{ opacity: hovered ? 0 : 1, y: hovered ? 6 : 0 }} transition={{ duration: 0.35, ease: "easeInOut" }}>
            <div className="flex items-center gap-1.5 text-white/45 text-[10px] mb-1.5">
              <Calendar size={9} /><span>{new Date(post.dateRaw).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
              <span className="mx-0.5 opacity-40">·</span><Clock size={9} /><span>{post.read_time} min</span>
            </div>
            <h3 className="text-white text-xs sm:text-sm font-bold leading-snug line-clamp-2">{post.title}</h3>
          </motion.div>
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isRecentPost(post.dateRaw) && <span className="text-[9px] font-black uppercase tracking-wider bg-pink-500 text-white px-2 py-0.5 rounded-full">BARU</span>}
            {post.category && <TagBadge label={post.category} accent={accent} />}
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-2 py-0.5 text-white/50 text-[9px]"><Eye size={9} />{post.views}</div>
        </div>
      </motion.article>
    </Link>
  );
}

export function CategoryClient({ slug, posts }: { slug: string; posts: PublicPostItem[] }) {
  const meta = CATEGORY_META[slug.toLowerCase()] ?? { ...DEFAULT_META, label: slug.charAt(0).toUpperCase() + slug.slice(1) };
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortValue>("latest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const processed = useMemo(() => {
    let list = [...posts];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || (p.excerpt && p.excerpt.toLowerCase().includes(q)));
    }
    if (sort === "popular") list.sort((a, b) => b.view_count - a.view_count);
    else list.sort((a, b) => new Date(b.dateRaw).getTime() - new Date(a.dateRaw).getTime());
    return list;
  }, [posts, query, sort]);

  const visible = processed.slice(0, visibleCount);
  const hasMore = visibleCount < processed.length;

  const loadMore = () => {
    setLoading(true);
    setTimeout(() => { setVisibleCount((v) => v + PAGE_SIZE); setLoading(false); }, 900);
  };

  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [query, sort]);
  
  const totalViews = posts.reduce((acc, p) => acc + p.view_count, 0);

  return (
    <>
      <section ref={heroRef} className="relative h-[48vh] min-h-[360px] flex items-end overflow-hidden pt-28">
        <MeshBackground glow={meta.glow} />
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full max-w-screen-xl mx-auto px-5 sm:px-8 pb-8">
          <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="flex items-center gap-1.5 text-[11px] text-white/30 mb-6">
            <Link href="/" className="flex items-center gap-1 hover:text-white/60 transition-colors"><Home size={11} /> Beranda</Link>
            <ChevronRight size={10} /><span className="text-white/40">Kategori</span><ChevronRight size={10} />
            <span className={`font-semibold bg-gradient-to-r ${meta.accent} bg-clip-text text-transparent`}>{meta.label}</span>
          </motion.nav>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }} className="flex items-center gap-3 mb-4">
            <BookOpen size={14} className="text-white/30" />
            <span className="text-[11px] font-black uppercase tracking-[0.28em] text-white/30">Kategori</span>
            <div className={`h-px w-16 bg-gradient-to-r ${meta.accent} opacity-40`} />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="font-black uppercase tracking-[0.08em] leading-[0.88] mb-6" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>
            <span style={{ background: `linear-gradient(140deg, #ffffff 0%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.45) 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", filter: `drop-shadow(0 0 48px ${meta.glow}) drop-shadow(0 0 120px ${meta.glow})` }}>
              {meta.label}
            </span>
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.28 }} className="flex flex-col sm:flex-row sm:items-end gap-5">
            <p className="text-white/50 text-base sm:text-lg leading-relaxed max-w-lg">{meta.description}</p>
            <div className="flex items-center gap-6 sm:ml-auto flex-shrink-0">
              {[
                { n: posts.length, label: "Tulisan" },
                { n: totalViews >= 1000 ? (totalViews/1000).toFixed(1) + 'K' : totalViews, label: "Dibaca" },
                { n: "2024", label: "Mulai" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-white font-black text-lg leading-none">{s.n}</div>
                  <div className="text-white/30 text-[10px] uppercase tracking-widest mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="max-w-screen-xl mx-auto px-4 sm:px-8 py-16">
        <AnimatePresence mode="wait">
          {visible.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-32 text-center">
              <Sparkles size={32} className="text-white/20 mb-4" />
              <p className="text-white/40 text-sm sm:text-base">Tidak ada tulisan yang cocok.</p>
              <button onClick={() => setQuery("")} className="mt-5 text-violet-400 hover:text-violet-300 text-xs sm:text-sm font-semibold transition-colors">Hapus pencarian</button>
            </motion.div>
          ) : (
            <motion.div key={`${sort}-${query}`} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 mt-2">
              {visible.map((post, i) => <PostCard key={post.id} post={post} index={i} accent={meta.accent} />)}
            </motion.div>
          )}
        </AnimatePresence>

        {hasMore && (
          <div className="flex flex-col items-center mt-20 gap-5">
            <div className="w-64 flex flex-col items-center gap-3">
              <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                <motion.div className={`h-full bg-gradient-to-r ${meta.accent}`} initial={{ width: 0 }} animate={{ width: `${(visible.length / processed.length) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }} />
              </div>
              <span className="text-white/30 text-[11px] tracking-wider uppercase font-medium">{visible.length} / {processed.length}</span>
            </div>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={loadMore} disabled={loading} className="relative flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-sm font-bold text-white disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden mt-2" style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(16px)", border: "1px solid rgba(139,92,246,0.3)" }}>
              {!loading && <motion.span className="absolute inset-0 rounded-2xl pointer-events-none" animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.02, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} style={{ boxShadow: "0 0 24px rgba(139,92,246,0.2)" }} />}
              {loading ? <><Loader2 size={16} className="animate-spin text-violet-400" /><span className="text-white/60 tracking-wide">Memuat…</span></> : <><Sparkles size={15} className="text-violet-400" /><span className="tracking-wide">Muat Lebih Banyak</span></>}
            </motion.button>
          </div>
        )}

        {!hasMore && visible.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col items-center mt-20 gap-3">
            <div className="flex items-center gap-4 text-white/10">
              <div className={`h-[2px] w-24 bg-gradient-to-r ${meta.accent} opacity-30 rounded-full`} />
              <Sparkles size={13} className="text-white/20" />
              <div className={`h-[2px] w-24 bg-gradient-to-l ${meta.accent} opacity-30 rounded-full`} />
            </div>
            <p className="text-white/20 text-xs sm:text-sm mt-1 tracking-wide">Semua tulisan telah dimuat</p>
          </motion.div>
        )}
      </section>
    </>
  );
}
