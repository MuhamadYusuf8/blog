"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { Clock, Eye, Tag, ChevronDown, CalendarDays, Layers, Hourglass, Pen, X, Sparkles } from "lucide-react";
import type { PublicPostItem } from "@/lib/utils/publicHelpers";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function groupPosts(posts: PublicPostItem[]) {
  const byYear: Record<string, Record<string, PublicPostItem[]>> = {};
  posts.forEach((p) => {
    const d = new Date(p.dateRaw);
    const y = String(d.getFullYear());
    const m = String(d.getMonth() + 1);
    if (!byYear[y]) byYear[y] = {};
    if (!byYear[y][m]) byYear[y][m] = [];
    byYear[y][m].push(p);
  });
  Object.keys(byYear).forEach((y) => {
    byYear[y] = Object.fromEntries(
      Object.entries(byYear[y]).sort(([a], [b]) => Number(b) - Number(a))
    );
  });
  return Object.fromEntries(
    Object.entries(byYear).sort(([a], [b]) => Number(b) - Number(a))
  );
}

const MONTH_NAMES: Record<number, string> = {
  1:"Januari",2:"Februari",3:"Maret",4:"April",5:"Mei",6:"Juni",
  7:"Juli",8:"Agustus",9:"September",10:"Oktober",11:"November",12:"Desember",
};

const CAT_COLORS: Record<string, string> = {
  Jurnal:    "text-violet-400 bg-violet-500/10 border-violet-500/20",
  Desain:    "text-cyan-400   bg-cyan-500/10   border-cyan-500/20",
  Ilustrasi: "text-pink-400   bg-pink-500/10   border-pink-500/20",
  Webtoon:   "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20",
  Tutorial:  "text-amber-400  bg-amber-500/10  border-amber-500/20",
  "Foto Esai":"text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

// ─── NOISE SVG ────────────────────────────────────────────────────────────────
function Noise({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden style={{ opacity }}>
      <filter id="an">
        <feTurbulence type="fractalNoise" baseFrequency="0.66" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#an)" />
    </svg>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, accent }: { label: string; value: string; icon: React.ElementType; accent: string; }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 0 0 1px rgba(139,92,246,0.4), 0 12px 40px rgba(139,92,246,0.10)" }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-2xl bg-white/[0.04] border border-white/8 backdrop-blur-xl p-5 flex items-center gap-4 cursor-default"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
        <Icon size={17} />
      </div>
      <div>
        <div className="text-white font-black text-xl leading-none mb-0.5">{value}</div>
        <div className="text-white/35 text-[10px] uppercase tracking-widest font-semibold">{label}</div>
      </div>
    </motion.div>
  );
}

// ─── FILTER PILL ──────────────────────────────────────────────────────────────
function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 ${
        active
          ? "bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-900/30"
          : "bg-white/5 border-white/10 text-white/45 hover:text-white hover:border-white/20"
      }`}
    >
      {label}
    </button>
  );
}

// ─── DROPDOWN ─────────────────────────────────────────────────────────────────
function Dropdown({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl px-3.5 py-2 text-white/60 hover:text-white text-xs font-semibold transition-all whitespace-nowrap"
      >
        <Tag size={12} />
        {value === "Semua" ? label : value}
        <ChevronDown size={12} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="absolute left-0 top-full mt-2 bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-40 min-w-[140px]"
          >
            {options.map((opt) => (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                  opt === value ? "text-violet-400 bg-violet-500/10" : "text-white/55 hover:text-white hover:bg-white/5"
                }`}>
                {opt === value && <span className="mr-1.5">✓</span>}{opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── HOVER IMAGE REVEAL ───────────────────────────────────────────────────────
function HoverImageReveal({ post }: { post: PublicPostItem }) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rowRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const rect = rowRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const catClass = CAT_COLORS[post.category || ""] ?? "text-white/50 bg-white/5 border-white/10";

  return (
    <div
      ref={rowRef}
      className="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onMouseMove={handleMove}
      onClick={() => window.location.href = `/posts/${post.slug}`}
    >
      <motion.div
        whileHover={{ x: 6 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-4 py-3.5 px-4 rounded-xl hover:bg-white/[0.035] transition-colors duration-200 cursor-pointer group"
      >
        <span className="flex-shrink-0 text-white/25 text-[11px] font-mono w-16 tabular-nums">
          {new Date(post.dateRaw).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
        </span>
        <span className="flex-1 text-white/80 text-sm font-semibold leading-snug group-hover:text-white transition-colors line-clamp-1">
          {post.title}
        </span>
        {post.category && (
          <span className={`flex-shrink-0 hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${catClass}`}>
            {post.category}
          </span>
        )}
        <div className="flex-shrink-0 flex items-center gap-3 text-white/25 text-[10px]">
          <span className="hidden md:flex items-center gap-1">
            <Eye size={10} />{post.views}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} />{post.read_time}m
          </span>
        </div>
      </motion.div>
      <AnimatePresence>
        {show && post.cover_image_url && (
          <motion.div
            key="img"
            initial={{ opacity: 0, scale: 0.88, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 4 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute z-50 pointer-events-none"
            style={{ left: Math.min(pos.x + 20, 320), top: pos.y - 120 }}
          >
            <div className="w-28 aspect-[3/4] rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60">
              <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="absolute -inset-2 rounded-2xl blur-xl opacity-30 -z-10"
              style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.8), rgba(244,114,182,0.5))" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── SCROLLING TIMELINE LINE ─────────────────────────────────────────────────
function TimelineLine() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 80%", "end 20%"] });
  const height = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), {
    stiffness: 60, damping: 18,
  });

  return (
    <div ref={timelineRef} className="absolute left-[28px] sm:left-[36px] top-0 bottom-0 w-px bg-white/5 overflow-hidden">
      <motion.div
        className="w-full origin-top"
        aria-hidden
        style={{
          height,
          background: "linear-gradient(to bottom, rgba(139,92,246,0.8), rgba(244,114,182,0.6), rgba(139,92,246,0.3))",
          boxShadow: "0 0 8px rgba(139,92,246,0.5)",
        }}
      />
    </div>
  );
}

// ─── MAIN CLIENT COMPONENT ─────────────────────────────────────────────────────
export function ArchiveClient({
  posts,
  categories,
  totalViews,
}: {
  posts: PublicPostItem[];
  categories: string[];
  totalViews: string;
}) {
  const [yearFilter, setYearFilter] = useState("Semua");
  const [catFilter, setCatFilter] = useState("Semua");
  const [search, setSearch] = useState("");

  const uniqueYears = [...new Set(posts.map((p) => p.dateRaw.slice(0, 4)))];
  const YEARS = ["Semua", ...uniqueYears];
  const CATEGORIES = ["Semua", ...categories];

  const filtered = posts.filter((p) => {
    const matchYear = yearFilter === "Semua" || p.dateRaw.startsWith(yearFilter);
    const matchCat = catFilter === "Semua" || p.category === catFilter;
    const matchQ = !search.trim() || p.title.toLowerCase().includes(search.toLowerCase());
    return matchYear && matchCat && matchQ;
  });

  const grouped = groupPosts(filtered);

  return (
    <>
      {/* ── CINEMATIC HEADER ───────────────────────────────────────────── */}
      <section className="relative pt-24 pb-16 px-5 sm:px-8 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/3 w-[700px] h-[500px] rounded-full blur-[130px] opacity-15"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,1), transparent 70%)" }} />
          <div className="absolute top-1/2 right-0 w-[350px] h-[350px] rounded-full blur-[100px] opacity-10"
            style={{ background: "radial-gradient(circle, rgba(244,114,182,1), transparent 70%)" }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
              backgroundSize: "52px 52px",
            }} />
          <Noise opacity={0.028} />
        </div>
        <div className="relative max-w-screen-xl mx-auto">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-2.5 mb-6">
            <Hourglass size={13} className="text-violet-400" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/30">Lorong Waktu</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-black uppercase tracking-tight leading-[0.88] mb-6"
            style={{ fontSize: "clamp(3.8rem, 12vw, 9rem)" }}
          >
            <span style={{
              background: "linear-gradient(140deg, #ffffff 0%, rgba(167,139,250,0.85) 55%, rgba(244,114,182,0.7) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              filter: "drop-shadow(0 0 50px rgba(139,92,246,0.4))",
            }}>Arsip</span><br />
            <span className="text-white/20" style={{ fontSize: "0.55em", letterSpacing: "0.06em" }}>Lengkap</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.22 }} className="text-white/35 text-sm leading-relaxed max-w-md mb-10">
            Semua yang pernah ditulis, digambar, dan dibagikan — tersimpan di sini sebagai catatan perjalanan yang terus tumbuh.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Tulisan",  value: String(posts.length), icon: Pen,         accent: "bg-violet-500/15 text-violet-400" },
              { label: "Tahun Aktif",    value: `${uniqueYears.length} Thn`, icon: CalendarDays, accent: "bg-pink-500/15 text-pink-400"   },
              { label: "Kategori",       value: String(categories.length), icon: Layers, accent: "bg-amber-500/15 text-amber-400" },
              { label: "Total Dibaca",   value: totalViews, icon: Eye,          accent: "bg-emerald-500/15 text-emerald-400" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.07, duration: 0.45 }}>
                <StatCard {...s} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STICKY FILTER BAR ──────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-black/55 backdrop-blur-2xl border-y border-white/8">
        <div className="max-w-screen-xl mx-auto px-5 sm:px-8 py-3 flex items-center gap-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 focus-within:border-violet-500/50 rounded-xl px-3 py-2 transition-all flex-shrink-0 min-w-0 w-44">
            <Sparkles size={12} className="text-white/25 flex-shrink-0" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari arsip…" className="bg-transparent text-xs text-white placeholder-white/20 outline-none w-full" />
            {search && <button onClick={() => setSearch("")}><X size={11} className="text-white/25 hover:text-white" /></button>}
          </div>
          <div className="h-5 w-px bg-white/8 flex-shrink-0" />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {YEARS.map((y) => (
              <Pill key={y} label={y} active={yearFilter === y} onClick={() => setYearFilter(y)} />
            ))}
          </div>
          <div className="h-5 w-px bg-white/8 flex-shrink-0" />
          <Dropdown label="Kategori" options={CATEGORIES} value={catFilter} onChange={setCatFilter} />
          {(yearFilter !== "Semua" || catFilter !== "Semua" || search) && (
            <button onClick={() => { setYearFilter("Semua"); setCatFilter("Semua"); setSearch(""); }} className="flex-shrink-0 flex items-center gap-1 text-[10px] text-white/35 hover:text-white/70 transition-colors ml-auto">
              <X size={11} /> Reset
            </button>
          )}
          <span className="flex-shrink-0 text-white/20 text-[10px] ml-auto whitespace-nowrap">{filtered.length} entri</span>
        </div>
      </div>

      {/* ── TIMELINE ───────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-5 sm:px-8 py-14 pb-28">
        {filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-32 text-center">
            <Hourglass size={32} className="text-white/15 mb-4" />
            <p className="text-white/30 text-sm">Tidak ada entri yang cocok.</p>
            <button onClick={() => { setYearFilter("Semua"); setCatFilter("Semua"); setSearch(""); }} className="mt-4 text-violet-400 hover:text-violet-300 text-xs font-semibold transition-colors">
              Hapus semua filter
            </button>
          </motion.div>
        ) : (
          <div className="relative pl-14 sm:pl-20">
            <TimelineLine />
            {Object.entries(grouped).map(([year, months]) => (
              <div key={year} className="mb-14">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex items-center gap-4 mb-8 -ml-14 sm:-ml-20">
                  <div className="relative flex-shrink-0 w-14 sm:w-20 flex justify-center">
                    <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.1, ease: "backOut" }} className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg" style={{ boxShadow: "0 0 20px rgba(139,92,246,0.7)" }} />
                  </div>
                  <div>
                    <span className="font-black leading-none select-none" style={{ fontSize: "clamp(2.8rem, 8vw, 5.5rem)", background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(139,92,246,0.5))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      {year}
                    </span>
                  </div>
                </motion.div>
                {Object.entries(months).map(([month, monthPosts]) => (
                  <div key={month} className="mb-8">
                    <motion.div initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.38 }} className="flex items-center gap-3 mb-3 -ml-14 sm:-ml-20">
                      <div className="flex-shrink-0 w-14 sm:w-20 flex justify-center"><div className="w-2 h-2 rounded-full bg-white/20" /></div>
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/25">{MONTH_NAMES[Number(month)]}</span>
                      <div className="h-px flex-1 bg-white/5" />
                      <span className="text-white/15 text-[10px]">{monthPosts.length} tulisan</span>
                    </motion.div>
                    <div className="rounded-2xl overflow-hidden border border-white/5 bg-white/[0.015]">
                      {monthPosts.map((post, pi) => (
                        <motion.div key={post.id} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-30px" }} transition={{ duration: 0.38, delay: pi * 0.055 }} className={pi < monthPosts.length - 1 ? "border-b border-white/5" : ""}>
                          <HoverImageReveal post={post} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex items-center gap-3 -ml-14 sm:-ml-20 mt-4">
              <div className="flex-shrink-0 w-14 sm:w-20 flex justify-center"><div className="w-2 h-2 rounded-full bg-white/10" /></div>
              <div className="flex items-center gap-2 text-white/15">
                <div className="h-px w-12 bg-gradient-to-r from-white/10 to-transparent" />
                <Sparkles size={11} />
                <span className="text-[10px] uppercase tracking-widest">Awal Perjalanan</span>
              </div>
            </motion.div>
          </div>
        )}
      </section>
    </>
  );
}
