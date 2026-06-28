"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
} from "lucide-react";
import type { PublicPostItem } from "@/lib/utils/publicHelpers";

// ─── Category badge colors ─────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, string> = {
  Desain:   "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Tutorial: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Jurnal:   "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Ilustrasi:"bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Webtoon:  "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

function CategoryBadge({ label }: { label: string }) {
  const cls = CATEGORY_COLORS[label] ?? "bg-white/10 text-white/70 border-white/20";
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}

// ─── HERO CAROUSEL ─────────────────────────────────────────────────────────────
const HERO_TAGS = ["TERBARU", "TERPOPULER", "PILIHAN EDITOR"];

function HeroCarousel({ featured }: { featured: PublicPostItem[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = () => setActive((a) => (a - 1 + featured.length) % featured.length);
  const next = () => setActive((a) => (a + 1) % featured.length);

  useEffect(() => {
    if (paused || featured.length === 0) return;
    const t = setInterval(() => setActive((a) => (a + 1) % featured.length), 5000);
    return () => clearInterval(t);
  }, [paused, featured.length]);

  if (featured.length === 0) return null;
  const item = featured[active];

  return (
    <section
      className="relative w-full h-[92vh] min-h-[520px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.65, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {item.cover_image_url ? (
            <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/70 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-end pb-16 px-4 sm:px-10 max-w-screen-xl mx-auto left-0 right-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id + "text"}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-400 bg-violet-400/15 border border-violet-400/30 px-3 py-1 rounded-full">
                {HERO_TAGS[active] ?? "UNGGULAN"}
              </span>
              {item.category && <CategoryBadge label={item.category} />}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4 drop-shadow-2xl">
              {item.title}
            </h1>

            <div className="flex items-center gap-4">
              <Link href={`/posts/${item.slug}`}>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold px-7 py-3 rounded-2xl text-sm hover:brightness-110 transition-all shadow-lg shadow-violet-900/40 cursor-pointer"
                >
                  Baca Artikel
                </motion.div>
              </Link>
              <span className="text-white/50 text-xs">👁 {item.views} kali dibaca</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Arrow controls */}
      {featured.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-black/70 transition-all">
            <ChevronLeft size={18} className="text-white/80" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center hover:bg-black/70 transition-all">
            <ChevronRight size={18} className="text-white/80" />
          </button>
        </>
      )}

      {/* Progress bar */}
      {!paused && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10">
          <motion.div
            key={active}
            className="h-full bg-gradient-to-r from-violet-500 to-pink-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>
      )}

      {/* Dots */}
      {featured.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {featured.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`transition-all duration-300 rounded-full ${i === active ? "w-6 h-2 bg-violet-400" : "w-2 h-2 bg-white/30 hover:bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ─── SECTION HEADER ────────────────────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle, href }: { icon: React.ReactNode; title: string; subtitle?: string; href?: string }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-violet-400">{icon}</span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{title}</h2>
        </div>
        {subtitle && <p className="text-white/40 text-xs">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="text-xs text-violet-400 hover:text-violet-300 font-semibold transition-colors flex items-center gap-1">
          Lihat Semua <ChevronRight size={13} />
        </Link>
      )}
    </div>
  );
}

// ─── TRENDING SECTION ──────────────────────────────────────────────────────────
function TrendingSection({ posts }: { posts: PublicPostItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
      <SectionHeader
        icon={<Flame size={20} />}
        title="Postingan Terpopuler"
        subtitle="Artikel dan foto yang paling banyak dilihat"
        href="/archive"
      />
      <div className="relative">
        <button onClick={() => scroll("left")} className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-zinc-900 border border-white/10 rounded-full items-center justify-center hover:bg-zinc-800 transition-all shadow-lg">
          <ChevronLeft size={16} className="text-white/70" />
        </button>
        <button onClick={() => scroll("right")} className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-zinc-900 border border-white/10 rounded-full items-center justify-center hover:bg-zinc-800 transition-all shadow-lg">
          <ChevronRight size={16} className="text-white/70" />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {posts.map((post, i) => (
            <Link key={post.id} href={`/posts/${post.slug}`}>
              <motion.div
                className="snap-start flex-shrink-0 w-[160px] sm:w-[190px] group cursor-pointer"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2.5 bg-zinc-900">
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500"
                      style={{ transform: "scale(1)" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute bottom-1 left-1 leading-none">
                    <span className="font-black text-white select-none" style={{ fontSize: "clamp(56px, 10vw, 76px)", lineHeight: 1, WebkitTextStroke: "1.5px rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.12)", textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
                      {i + 1}
                    </span>
                  </div>
                </div>
                {post.category && <CategoryBadge label={post.category} />}
                <p className="text-white text-xs font-semibold mt-1.5 leading-snug line-clamp-2">{post.title}</p>
                <p className="text-white/35 text-[10px] mt-1">👁 {post.views} views</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── LATEST GRID ───────────────────────────────────────────────────────────────
const FILTER_CATS = ["Semua", "Desain", "Jurnal", "Tutorial", "Ilustrasi", "Webtoon"];

// Determine if a post was published within the last 7 days
function isRecentPost(dateRaw: string): boolean {
  const diff = Date.now() - new Date(dateRaw).getTime();
  return diff < 7 * 24 * 60 * 60 * 1000;
}

function LatestGrid({ posts }: { posts: PublicPostItem[] }) {
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filtered = activeFilter === "Semua"
    ? posts
    : posts.filter((p) => p.category === activeFilter);

  return (
    <section className="max-w-screen-xl mx-auto px-4 sm:px-6 pb-20 pt-2">
      <SectionHeader icon={<Sparkles size={18} />} title="Artikel Terbaru" subtitle="Tulisan dan gambar terbaru setiap minggu" href="/archive" />

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6" style={{ scrollbarWidth: "none" }}>
        {FILTER_CATS.map((c) => (
          <button
            key={c}
            onClick={() => setActiveFilter(c)}
            className={`flex-shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full border transition-all duration-200 ${
              activeFilter === c
                ? "bg-violet-600 border-violet-600 text-white"
                : "bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/25"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((post, i) => (
          <Link key={post.id} href={`/posts/${post.slug}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="group cursor-pointer"
              whileHover={{ y: -3 }}
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2.5 bg-zinc-900">
                {post.cover_image_url ? (
                  <img
                    src={post.cover_image_url}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-700" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isRecentPost(post.dateRaw) && (
                  <div className="absolute top-2 left-2 bg-pink-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">BARU</div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-2 text-white text-xs font-bold">Baca Artikel</div>
                </div>
              </div>
              {post.category && <CategoryBadge label={post.category} />}
              <p className="text-white text-xs font-semibold mt-1.5 leading-snug line-clamp-2">{post.title}</p>
              <p className="text-white/35 text-[10px] mt-1">👁 {post.views} views</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Sparkles size={32} className="text-white/20" />
          <p className="text-white/40 text-sm">Belum ada artikel dalam kategori ini.</p>
        </div>
      )}
    </section>
  );
}

// ─── MAIN CLIENT SHELL ─────────────────────────────────────────────────────────
export function HomepageClient({
  featured,
  trending,
  latest,
}: {
  featured: PublicPostItem[];
  trending: PublicPostItem[];
  latest: PublicPostItem[];
}) {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <HeroCarousel featured={featured} />
      <TrendingSection posts={trending} />
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      <LatestGrid posts={latest} />
    </main>
  );
}
