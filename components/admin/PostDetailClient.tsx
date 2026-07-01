"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowLeft,
  Eye,
  Clock,
  ChevronUp,
  Edit3,
  ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminPostDetail {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  status: string;
  author: { name: string; avatar: string; handle: string };
  date: string;
  readTime: string;
  views: string;
  coverImage: string | null;
  contentHtml: string;
  likes: number;
  comments: number;
}

// ─── Reading Progress Bar ─────────────────────────────────────────────────────

function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[999] h-[3px] origin-left"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, #7c3aed 0%, #a78bfa 40%, #f59e0b 80%, #fbbf24 100%)",
        boxShadow:
          "0 0 12px rgba(167,139,250,0.8), 0 0 24px rgba(124,58,237,0.4)",
      }}
    />
  );
}

// ─── Parallax Hero ────────────────────────────────────────────────────────────

function CinematicHero({ post }: { post: AdminPostDetail }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 180]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 1.08]);

  const statusColor: Record<string, string> = {
    published: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
    draft:     "bg-amber-500/20 border-amber-500/30 text-amber-300",
    archived:  "bg-slate-500/20 border-slate-500/30 text-slate-400",
  };

  return (
    <div ref={heroRef} className="relative w-full h-[92vh] overflow-hidden">
      {/* Parallax image / fallback */}
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-900/40 via-zinc-900 to-fuchsia-900/30" />
        )}
      </motion.div>

      {/* Layered gradients for cinematic depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/30 via-transparent to-[#0f0f0f]/20" />

      {/* Top nav bar */}
      <motion.div
        style={{ opacity }}
        className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 pt-8"
      >
        <a
          href="/admin/posts"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 text-white/70 text-sm hover:text-white hover:bg-black/50 transition-all"
        >
          <ArrowLeft size={14} />
          Semua Post
        </a>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
              statusColor[post.status] ?? statusColor.draft
            }`}
          >
            {post.status}
          </span>

          {/* View count */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-xl border border-white/10">
            <Eye size={13} className="text-white/40" />
            <span className="text-white/60 text-xs font-medium">{post.views}</span>
          </div>

          {/* Edit shortcut */}
          <a
            href={`/admin/posts/${post.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 backdrop-blur-xl border border-violet-500/30 text-violet-300 text-sm hover:bg-violet-500/30 transition-all"
          >
            <Edit3 size={13} />
            Edit
          </a>

          {/* Open public link */}
          {post.status === "published" && (
            <a
              href={`/posts/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/30 backdrop-blur-xl border border-white/10 text-white/60 text-sm hover:text-white hover:bg-black/50 transition-all"
            >
              <ExternalLink size={13} />
              Publik
            </a>
          )}
        </div>
      </motion.div>

      {/* Hero content */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-0 left-0 right-0 px-6 pb-16 md:pb-20 max-w-4xl mx-auto"
      >
        {/* Category badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/20 border border-violet-500/30 backdrop-blur-md mb-5"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-violet-300 text-xs font-semibold tracking-widest uppercase">
            {post.category ?? "Uncategorized"}
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6"
          style={{ textShadow: "0 4px 40px rgba(0,0,0,0.8)" }}
        >
          {post.title}
        </motion.h1>

        {/* Meta row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center flex-wrap gap-4"
        >
          <div className="flex items-center gap-3">
            {post.author.avatar ? (
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-9 h-9 rounded-full border-2 border-violet-500/40 object-cover"
              />
            ) : (
              <div className="w-9 h-9 rounded-full border-2 border-violet-500/40 bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                {post.author.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-white/90 text-sm font-semibold leading-tight">
                {post.author.name}
              </p>
              <p className="text-white/35 text-[11px]">{post.author.handle}</p>
            </div>
          </div>
          <div className="w-px h-6 bg-white/15" />
          <div className="flex items-center gap-1.5 text-white/40 text-sm">
            <Clock size={13} className="text-white/30" />
            {post.readTime}
          </div>
          <div className="w-px h-6 bg-white/15" />
          <span className="text-white/35 text-sm">{post.date}</span>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Article HTML Content ─────────────────────────────────────────────────────

function ArticleContent({ html }: { html: string }) {
  if (!html) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center">
          <Edit3 size={20} className="text-white/20" />
        </div>
        <p className="text-white/30 text-sm">Konten belum ditulis.</p>
        <a
          href="#"
          className="text-violet-400 hover:text-violet-300 text-xs font-semibold transition-colors"
        >
          Mulai menulis →
        </a>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="post-content journal-article"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// ─── Floating Dock ────────────────────────────────────────────────────────────

function FloatingDock({ likes, comments }: { likes: number; comments: number }) {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showShareToast, setShowShareToast] = useState(false);

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  const handleShare = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  const formatCount = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n);

  const actions = [
    {
      icon: Heart,
      label: "Suka",
      count: formatCount(likeCount),
      active: liked,
      activeColor: "text-rose-400",
      activeGlow: "rgba(251,113,133,0.35)",
      onClick: handleLike,
    },
    {
      icon: MessageCircle,
      label: "Komentar",
      count: formatCount(comments),
      active: false,
      activeColor: "text-sky-400",
      activeGlow: "rgba(56,189,248,0.35)",
      onClick: () => {},
    },
    {
      icon: Share2,
      label: "Bagikan",
      count: null,
      active: false,
      activeColor: "text-emerald-400",
      activeGlow: "rgba(52,211,153,0.35)",
      onClick: handleShare,
    },
    {
      icon: Bookmark,
      label: "Simpan",
      count: null,
      active: bookmarked,
      activeColor: "text-amber-400",
      activeGlow: "rgba(251,191,36,0.35)",
      onClick: () => setBookmarked((p) => !p),
    },
  ];

  return (
    <>
      {/* Share toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-2xl border border-white/15 text-white/80 text-sm font-medium whitespace-nowrap"
          >
            ✓ Link berhasil disalin
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40"
      >
        <div
          className="flex items-center gap-1 px-3 py-2.5 rounded-full backdrop-blur-2xl border border-white/10"
          style={{
            background: "rgba(255,255,255,0.05)",
            boxShadow:
              "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          }}
        >
          {actions.map(
            (
              { icon: Icon, label, count, active, activeColor, activeGlow, onClick },
              i
            ) => (
              <div key={label} className="flex items-center">
                {i > 0 && (
                  <div
                    className="w-px h-5 mx-1"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  />
                )}
                <motion.button
                  onClick={onClick}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-full group transition-all duration-200"
                >
                  {active && (
                    <motion.div
                      layoutId={`dock-glow-${label}`}
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${activeGlow} 0%, transparent 70%)`,
                      }}
                    />
                  )}
                  <Icon
                    size={18}
                    className={`relative transition-all duration-200 ${
                      active
                        ? activeColor
                        : "text-white/40 group-hover:text-white/75"
                    }`}
                    fill={
                      active && (label === "Suka" || label === "Simpan")
                        ? "currentColor"
                        : "none"
                    }
                    style={
                      active
                        ? { filter: `drop-shadow(0 0 6px ${activeGlow})` }
                        : {}
                    }
                  />
                  {count && (
                    <span
                      className={`relative text-[10px] font-semibold leading-none transition-colors ${
                        active ? activeColor : "text-white/30"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </motion.button>
              </div>
            )
          )}
        </div>
      </motion.div>
    </>
  );
}

// ─── Scroll To Top ────────────────────────────────────────────────────────────

function ScrollToTop() {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  scrollYProgress.on("change", (v) => setVisible(v > 0.3));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-6 z-40 w-10 h-10 rounded-full backdrop-blur-xl border border-white/10 flex items-center justify-center hover:border-white/20 transition-all group"
          style={{
            background: "rgba(255,255,255,0.06)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          }}
        >
          <ChevronUp
            size={16}
            className="text-white/40 group-hover:text-white/70 transition-colors"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── Post Footer ─────────────────────────────────────────────────────────────

function PostFooter({ post }: { post: AdminPostDetail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mt-20 pb-36"
    >
      {/* End-of-post decorative line */}
      <div className="flex items-center gap-4 mb-12">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex gap-1.5">
          <div className="w-1 h-1 rounded-full bg-violet-500/50" />
          <div className="w-1 h-1 rounded-full bg-fuchsia-500/40" />
          <div className="w-1 h-1 rounded-full bg-amber-500/40" />
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/10 to-transparent" />
      </div>

      {/* Author card */}
      <div
        className="rounded-3xl border border-white/8 backdrop-blur-xl p-7 flex flex-col sm:flex-row items-center sm:items-start gap-6"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        {post.author.avatar ? (
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-violet-500/30 shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl border-2 border-violet-500/30 bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-black text-2xl shrink-0">
            {post.author.name.charAt(0)}
          </div>
        )}
        <div className="flex-1 text-center sm:text-left">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-white/25 mb-1">
            Tentang Kreator
          </p>
          <p className="text-white/90 font-bold text-lg mb-1">{post.author.name}</p>
          <p className="text-violet-400/70 text-sm mb-3">{post.author.handle}</p>
          <p className="text-white/40 text-sm leading-relaxed">
            Penulis dan kreator konten di balik blog ini. Setiap tulisan adalah
            potongan nyata dari perjalanan hidup yang dibagikan dengan jujur dan
            penuh empati.
          </p>
        </div>

        {/* Admin quick actions */}
        <div className="shrink-0 flex flex-col gap-2">
          <a
            href={`/admin/posts/${post.id}/edit`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-sm font-medium hover:bg-violet-500/25 hover:border-violet-500/40 transition-all whitespace-nowrap"
          >
            <Edit3 size={13} />
            Edit Post
          </a>
          {post.status === "published" && (
            <a
              href={`/posts/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white/50 text-sm font-medium hover:bg-white/8 hover:text-white/70 transition-all whitespace-nowrap"
            >
              <ExternalLink size={13} />
              Lihat Publik
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function PostDetailClient({ post }: { post: AdminPostDetail }) {
  return (
    // Escape AdminShell padding dengan negative margins
    <div
      className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-8 -mb-8 min-h-screen relative overflow-x-hidden"
      style={{ background: "#0f0f0f", color: "#f8fafc" }}
    >
      {/* Fixed ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute top-1/4 -left-48 w-[500px] h-[500px] rounded-full bg-violet-900/10 blur-[140px]" />
        <div className="absolute top-2/3 right-0 w-[400px] h-[400px] rounded-full bg-fuchsia-900/8 blur-[120px]" />
      </div>

      {/* ── Reading Progress ─────────────────────────────────────────────── */}
      <ReadingProgressBar />

      {/* ── Parallax Hero ───────────────────────────────────────────────── */}
      <CinematicHero post={post} />

      {/* ── Article Content ─────────────────────────────────────────────── */}
      <article className="relative z-10 -mt-6">
        <div className="max-w-2xl mx-auto px-5 md:px-6">
          <ArticleContent html={post.contentHtml} />
          <PostFooter post={post} />
        </div>
      </article>

      {/* ── Floating Dock ───────────────────────────────────────────────── */}
      <FloatingDock likes={post.likes} comments={post.comments} />

      {/* ── Scroll To Top ───────────────────────────────────────────────── */}
      <ScrollToTop />

      {/* ── Article prose styles ─────────────────────────────────────────── */}
      <style>{`
        .post-content,
        .post-content .content,
        .post-content p,
        .post-content .content p,
        .post-content div {
          color: rgba(226,232,240,0.88);
          font-size: 0.875rem !important;
          line-height: 1.8 !important;
          font-weight: 400;
        }
        .post-content p { margin-bottom: 1.25rem !important; }
        .post-content h1, .post-content .content h1 {
          color: #ffffff !important;
          font-weight: 600 !important;
          line-height: 1.5 !important;
          margin: 1.75rem 0 0.6rem !important;
          font-size: 1.05rem !important;
        }
        .post-content h2, .post-content .content h2 {
          color: #ffffff !important;
          font-weight: 600 !important;
          line-height: 1.55 !important;
          margin: 1.5rem 0 0.5rem !important;
          font-size: 0.975rem !important;
        }
        .post-content h3, .post-content .content h3 {
          color: rgba(255,255,255,0.92) !important;
          font-weight: 600 !important;
          line-height: 1.6 !important;
          margin: 1.25rem 0 0.4rem !important;
          font-size: 0.925rem !important;
        }
        .post-content h4, .post-content .content h4 {
          color: rgba(255,255,255,0.88) !important;
          font-weight: 600 !important;
          line-height: 1.6 !important;
          margin: 1.1rem 0 0.35rem !important;
          font-size: 0.875rem !important;
        }
        .post-content .jurnal-post > h2:first-child,
        .post-content .jurnal-subtitle {
          font-size: 0.875rem !important;
          font-weight: 400 !important;
          font-family: var(--font-sans) !important;
          font-style: italic !important;
          line-height: 1.75 !important;
          color: rgba(203, 213, 225, 0.85) !important;
          margin-top: 0.4rem !important;
          margin-bottom: 1.25rem !important;
          padding-left: 0.875rem !important;
          border-left: 2px solid rgba(139, 92, 246, 0.55) !important;
        }
        .post-content a {
          color: rgba(167,139,250,0.9);
          text-decoration: underline;
          text-decoration-color: rgba(139,92,246,0.35);
          transition: color 0.2s;
        }
        .post-content a:hover { color: #a78bfa; }
        .post-content img {
          width: 100%;
          border-radius: 16px;
          margin: 2rem 0;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .post-content blockquote {
          border-left: 2px solid rgba(139,92,246,0.6);
          padding-left: 1.25rem;
          margin: 1.75rem 0;
          color: rgba(203,213,225,0.8);
          font-style: italic;
          font-size: 1rem;
        }
        .post-content ul,.post-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1.5rem;
          color: rgba(255,255,255,0.65);
        }
        .post-content li { margin-bottom: 0.5rem; }
        .post-content strong { color: rgba(255,255,255,0.9); font-weight: 700; }
        .post-content em { color: rgba(255,255,255,0.65); }
        .post-content hr {
          border: none;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
          margin: 3rem 0;
        }
        .post-content pre {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 1.5rem;
          overflow-x: auto;
          font-size: 0.875rem;
          margin: 2rem 0;
        }
        .post-content code {
          background: rgba(139,92,246,0.12);
          border: 1px solid rgba(139,92,246,0.2);
          border-radius: 4px;
          padding: 0.1em 0.4em;
          font-size: 0.875em;
          color: rgba(167,139,250,0.9);
        }
        .post-content pre code {
          background: none;
          border: none;
          padding: 0;
          color: rgba(255,255,255,0.75);
        }
      `}</style>
    </div>
  );
}
