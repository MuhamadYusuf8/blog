"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Edit3, MessageSquare, Layout, BarChart2, Settings,
  Eye, ArrowUpRight, TrendingUp, FileText, BookOpen,
  ChevronRight, Activity, PenLine, Plus, Sparkles,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  accent: string;
  accentRgb: string;
  iconId: string;        // string key — resolved client-side
  chart: number[] | null;
};

export type RecentPostItem = {
  id: string;
  title: string;
  category: string | null;
  categoryColor: string;
  views: string;
  status: string;
  date: string;
};

// ─── Sparkline Chart ──────────────────────────────────────────────────────────
function SparklineChart({ data, accent, accentRgb }: { data: number[]; accent: string; accentRgb: string }) {
  const w = 120, h = 40;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`);
  const pathD = `M ${pts.join(" L ")}`;
  const areaD = `M ${pts[0]} L ${pts.join(" L ")} L ${w},${h} L 0,${h} Z`;
  const gId = `g-${accentRgb.replace(/,/g, "-")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`${gId}-a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.25" /><stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
        <filter id={`${gId}-f`}><feGaussianBlur stdDeviation="1.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path d={areaD} fill={`url(#${gId}-a)`} />
      <path d={pathD} fill="none" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${gId}-f)`} />
      <circle cx={parseFloat(pts[pts.length - 1].split(",")[0])} cy={parseFloat(pts[pts.length - 1].split(",")[1])} r="2.5" fill={accent} filter={`url(#${gId}-f)`} />
    </svg>
  );
}

// ─── Icon map (client-side only) ─────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = {
  BookOpen,
  FileText,
  Eye,
  MessageSquare,
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ stat, delay }: { stat: DashboardStat; delay: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = ICON_MAP[stat.iconId] ?? FileText;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)} whileHover={{ y: -4 }}
      className="relative group rounded-2xl overflow-hidden cursor-default"
      style={{
        background: "rgba(255,255,255,0.02)", backdropFilter: "blur(24px)",
        border: hovered ? `1px solid rgba(${stat.accentRgb},0.35)` : "1px solid rgba(255,255,255,0.05)",
        boxShadow: hovered ? `0 0 40px rgba(${stat.accentRgb},0.12), 0 20px 60px rgba(0,0,0,0.4)` : "0 20px 60px rgba(0,0,0,0.3)",
        transition: "border 0.3s ease, box-shadow 0.3s ease",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, rgba(${stat.accentRgb},0.4), transparent)`, opacity: hovered ? 1 : 0.3, transition: "opacity 0.3s ease" }} />
      <motion.div className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none" style={{ background: stat.accent }} animate={{ opacity: hovered ? 0.12 : 0.05 }} transition={{ duration: 0.3 }} />
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-5">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `rgba(${stat.accentRgb},0.12)`, border: `1px solid rgba(${stat.accentRgb},0.2)` }}>
            <Icon size={18} style={{ color: stat.accent }} />
          </div>
          <motion.div className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: stat.positive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", color: stat.positive ? "#10b981" : "#ef4444", border: stat.positive ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(239,68,68,0.2)" }}
            animate={{ scale: hovered ? 1.05 : 1 }}
          >
            <TrendingUp size={10} style={{ transform: stat.positive ? "none" : "scaleY(-1)" }} />{stat.delta}
          </motion.div>
        </div>
        <div className="mb-1"><span className="text-4xl font-bold tracking-tight text-slate-50" style={{ fontVariantNumeric: "tabular-nums" }}>{stat.value}</span></div>
        <p className="text-sm text-slate-400 font-medium mb-4">{stat.label}</p>
        {stat.chart ? (
          <motion.div className="mt-2" animate={{ opacity: hovered ? 1 : 0.7 }} transition={{ duration: 0.2 }}>
            <SparklineChart data={stat.chart} accent={stat.accent} accentRgb={stat.accentRgb} />
          </motion.div>
        ) : (
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${stat.accent}, ${stat.accent}80)` }}
              initial={{ width: 0 }} animate={{ width: stat.id === "drafts" ? "60%" : "22%" }}
              transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Quick Action Tile ────────────────────────────────────────────────────────
type QuickAction = { icon: React.ElementType; label: string; desc: string; accent: string; accentRgb: string; href: string };

function QuickActionTile({ action, index }: { action: QuickAction; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = action.icon;
  return (
    <Link href={action.href} className="block w-full">
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.6 + index * 0.08 }}
        whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}
        onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
        className="relative flex flex-col items-start p-4 rounded-2xl text-left w-full overflow-hidden cursor-pointer"
        style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(16px)", border: hovered ? `1px solid rgba(${action.accentRgb},0.35)` : "1px solid rgba(255,255,255,0.05)", boxShadow: hovered ? `0 0 30px rgba(${action.accentRgb},0.1)` : "none", transition: "border 0.25s ease, box-shadow 0.25s ease" }}
      >
        <motion.div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: `radial-gradient(circle at 30% 30%, rgba(${action.accentRgb},0.08), transparent 70%)` }} animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.25 }} />
        <div className="relative w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `rgba(${action.accentRgb},${hovered ? "0.2" : "0.1"})`, border: `1px solid rgba(${action.accentRgb},0.25)`, boxShadow: hovered ? `0 0 16px rgba(${action.accentRgb},0.3)` : "none", transition: "all 0.3s" }}>
          <Icon size={16} style={{ color: action.accent }} />
        </div>
        <span className="relative text-sm font-semibold text-slate-200 leading-none mb-1">{action.label}</span>
        <span className="relative text-xs text-slate-500">{action.desc}</span>
        <motion.div className="absolute right-3 top-3" animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : -4 }} transition={{ duration: 0.2 }}>
          <ArrowUpRight size={14} style={{ color: action.accent }} />
        </motion.div>
      </motion.div>
    </Link>
  );
}

// ─── Post Row ─────────────────────────────────────────────────────────────────
function PostRow({ post, index }: { post: RecentPostItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const statusKey = post.status === "published" ? "Dipublikasikan" : post.status === "draft" ? "Draft" : "Review";
  const sc = {
    Dipublikasikan: { color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
    Draft: { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" },
    Review: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
  }[statusKey] ?? { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" };

  const statusLabel = post.status === "published" ? "Dipublikasikan" : post.status === "draft" ? "Draft" : post.status;

  return (
    <Link href={`/admin/posts/${post.id}/edit`} className="block w-full">
      <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, delay: 0.7 + index * 0.07 }}
        onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
        className="group relative flex items-center gap-4 px-5 py-4 rounded-xl cursor-pointer"
        style={{ background: hovered ? "rgba(255,255,255,0.03)" : "transparent", border: hovered ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent", transition: "background 0.2s ease, border 0.2s ease" }}
      >
        <span className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold flex-shrink-0" style={{ background: "rgba(255,255,255,0.03)", color: "#475569", border: "1px solid rgba(255,255,255,0.05)" }}>{index + 1}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate leading-snug mb-1.5 group-hover:text-white transition-colors">{post.title}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {post.category && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ color: post.categoryColor, background: `${post.categoryColor}18`, border: `1px solid ${post.categoryColor}30` }}>{post.category}</span>
            )}
            <span className="text-xs text-slate-600">{post.date}</span>
          </div>
        </div>
        <div className="hidden md:flex"><span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ color: sc.color, background: sc.bg, border: `1px solid ${sc.border}` }}>{statusLabel}</span></div>
        <div className="flex items-center gap-1.5 text-slate-400 flex-shrink-0"><Eye size={12} /><span className="text-xs font-semibold tabular-nums">{post.views}</span></div>
        <motion.div className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg flex-shrink-0"
          style={{ background: hovered ? "rgba(124,58,237,0.12)" : "rgba(255,255,255,0.03)", color: hovered ? "#a78bfa" : "#475569", border: hovered ? "1px solid rgba(124,58,237,0.25)" : "1px solid rgba(255,255,255,0.05)", transition: "all 0.2s ease" }}
        >
          <Edit3 size={11} /><span className="hidden sm:inline">Edit</span><ChevronRight size={11} />
        </motion.div>
      </motion.div>
    </Link>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4"><div className="w-10 h-10 rounded-xl bg-white/5" /><div className="w-12 h-5 rounded-full bg-white/5" /></div>
      <div className="w-20 h-8 rounded-lg bg-white/5 mb-2" /><div className="w-32 h-4 rounded-md bg-white/5" />
    </div>
  );
}

// ─── Dashboard Client Shell ───────────────────────────────────────────────────
type DashboardClientProps = {
  stats: DashboardStat[];
  recentPosts: RecentPostItem[];
  pendingCount: number;
  todayDate: string;
};


export function DashboardClient({ stats, recentPosts, pendingCount, todayDate }: DashboardClientProps) {
  const QUICK_ACTIONS: QuickAction[] = [
    { icon: PenLine,       label: "Tulis Post",  desc: "Mulai artikel baru",                         accent: "#7c3aed", accentRgb: "124,58,237", href: "/admin/posts/new" },
    { icon: MessageSquare, label: "Moderasi",    desc: pendingCount > 0 ? `${pendingCount} komentar menunggu` : "Tidak ada komentar baru", accent: "#f59e0b", accentRgb: "245,158,11", href: "/admin/comments" },
    { icon: Layout,        label: "Halaman",     desc: "Kelola halaman statis",                      accent: "#0ea5e9", accentRgb: "14,165,233",  href: "/admin/pages" },
    { icon: BarChart2,     label: "Analitik",    desc: "Laporan performa",                           accent: "#10b981", accentRgb: "16,185,129",  href: "/admin/analytics" },
    { icon: Settings,      label: "Pengaturan",  desc: "Konfigurasi blog",                           accent: "#ec4899", accentRgb: "236,72,153",  href: "/admin/settings" },
  ];

  return (
    <div className="space-y-8">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <motion.section initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-5"
      >
        <div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#a78bfa" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-violet-400" style={{ boxShadow: "0 0 6px #a78bfa" }} />
            {todayDate}
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-50 leading-tight tracking-tight mb-2">Selamat datang, Rahma 👋</h1>
          <p className="text-slate-400 text-sm sm:text-base">Berikut ringkasan aktivitas blog kamu hari ini.</p>
        </div>
        <Link href="/admin/posts/new">
          <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(124,58,237,0.5)" }} whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #6d28d9 100%)", boxShadow: "0 0 24px rgba(124,58,237,0.35), inset 0 1px 0 rgba(255,255,255,0.1)", border: "1px solid rgba(124,58,237,0.4)" }}
          >
            <Plus size={16} strokeWidth={2.5} />Tulis Post Baru
          </motion.button>
        </Link>
      </motion.section>

      {/* ── Stat Cards ──────────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => <StatCard key={s.id} stat={s} delay={0.2 + i * 0.08} />)}
        </div>
      </section>

      {/* ── Posts + Quick Actions ──────────────────────────────────── */}
      <section className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        {/* Recent Posts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.015)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.2)" }}>
                <Activity size={15} className="text-violet-400" />
              </div>
              <div><h2 className="text-sm font-semibold text-slate-100">Postingan Terbaru</h2><p className="text-xs text-slate-500">{recentPosts.length} post terakhir</p></div>
            </div>
            <Link href="/admin/posts"><motion.button whileHover={{ x: 2 }} className="flex items-center gap-1 text-xs text-slate-500 hover:text-violet-400 transition-colors">Lihat semua <ChevronRight size={12} /></motion.button></Link>
          </div>
          <div className="hidden md:grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-5 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
            <span className="w-7" /><span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Judul</span><span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</span><span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Tayangan</span><span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Aksi</span>
          </div>
          <div className="divide-y divide-white/[0.03] px-2 py-2">
            {recentPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <FileText size={28} className="text-slate-600" />
                <p className="text-sm text-slate-500">Belum ada postingan</p>
                <Link href="/admin/posts/new" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Tulis yang pertama →</Link>
              </div>
            ) : (
              recentPosts.map((post, i) => <PostRow key={post.id} post={post} index={i} />)
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.65 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.015)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
        >
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <Sparkles size={15} className="text-emerald-400" />
            </div>
            <div><h2 className="text-sm font-semibold text-slate-100">Aksi Cepat</h2><p className="text-xs text-slate-500">Pintasan utama</p></div>
          </div>
          <div className="p-4 space-y-2.5">
            {QUICK_ACTIONS.map((action, i) => <QuickActionTile key={action.label} action={action} index={i} />)}
          </div>
          <div className="mx-4 mb-4 rounded-xl px-4 py-3" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.12)" }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 6px #10b981", animation: "pulse 2s infinite" }} />
              <span className="text-xs font-semibold text-emerald-400">Semua Sistem Aktif</span>
            </div>
            <p className="text-xs text-slate-600">Uptime 99.9% · CDN Normal · DB Optimal</p>
          </div>
        </motion.div>
      </section>

      <div className="h-8" />
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
