"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Search } from "lucide-react";

// ─── NOISE CANVAS ─────────────────────────────────────────────────────────────
// Creates a subtle film-grain texture overlay for depth

function NoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);
    const imageData = ctx.createImageData(W, H);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const v = Math.random() * 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 12; // very low alpha — subtle grain
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
    />
  );
}

// ─── GRID LINES ───────────────────────────────────────────────────────────────

function GridLines() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)",
      }}
    />
  );
}

// ─── ANIMATED GLOW ────────────────────────────────────────────────────────────

function GlowOrb() {
  return (
    <>
      {/* Primary violet glow */}
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.12, 1], opacity: [0.15, 0.22, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute pointer-events-none"
        style={{
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(124,58,237,0.4) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      {/* Secondary pink glow, offset */}
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.08, 1], opacity: [0.08, 0.13, 0.08] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute pointer-events-none"
        style={{
          top: "35%",
          left: "55%",
          width: "400px",
          height: "300px",
          background: "radial-gradient(ellipse, rgba(219,39,119,0.35) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
    </>
  );
}

// ─── SEARCH INPUT ─────────────────────────────────────────────────────────────

function SearchInput() {
  const [q, setQ] = useState("");

  return (
    <form
      action="/search"
      method="GET"
      className="relative w-full max-w-xs"
    >
      <Search
        size={14}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none"
      />
      <input
        name="q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari artikel..."
        className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-violet-500/40 focus:bg-white/8 transition-all"
      />
    </form>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

const FADE_UP = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
});


export default function NotFound() {
  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* ── Textures & Atmosphere ── */}
      <GlowOrb />
      <GridLines />
      <NoiseCanvas />

      {/* ── Minimal Navbar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-6 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}
          >
            <BookOpen size={13} className="text-white" />
          </div>
          <span className="text-white/80 text-sm font-semibold tracking-tight group-hover:text-white transition-colors">
            Rahma<span className="text-violet-400">yolan</span>
          </span>
        </Link>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-14 max-w-xl w-full">

        {/* Error code — typographic centerpiece */}
        <motion.div {...FADE_UP(0)} className="mb-8 select-none">
          {/* Tiny label above */}
          <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/20 mb-6">
            Error 404
          </p>

          {/* Large "404" — thin stroked, gradient */}
          <div className="relative inline-block">
            <span
              className="font-black leading-none block"
              style={{
                fontSize: "clamp(5rem, 18vw, 10rem)",
                color: "transparent",
                WebkitTextStroke: "1.5px rgba(255,255,255,0.07)",
                letterSpacing: "-0.05em",
              }}
            >
              404
            </span>
            {/* Violet gradient overlay — clipped to text shape */}
            <span
              aria-hidden
              className="absolute inset-0 font-black leading-none flex items-center justify-center bg-gradient-to-br from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent opacity-60"
              style={{
                fontSize: "clamp(5rem, 18vw, 10rem)",
                letterSpacing: "-0.05em",
              }}
            >
              404
            </span>
          </div>
        </motion.div>

        {/* Divider line */}
        <motion.div
          {...FADE_UP(0.15)}
          className="w-12 h-px mb-8"
          style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.6), transparent)" }}
        />

        {/* Heading */}
        <motion.h1
          {...FADE_UP(0.2)}
          className="text-xl sm:text-2xl font-bold text-white mb-3 leading-snug"
          style={{ letterSpacing: "-0.02em" }}
        >
          Halaman Tidak Ditemukan
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...FADE_UP(0.28)}
          className="text-white/40 text-sm leading-relaxed mb-10 max-w-sm"
        >
          Halaman yang kamu cari mungkin sudah dipindahkan, dihapus, atau
          alamatnya tidak tepat. Coba cari artikel secara langsung.
        </motion.p>

        {/* Search */}
        <motion.div {...FADE_UP(0.35)} className="w-full flex justify-center mb-8">
          <SearchInput />
        </motion.div>

        {/* Actions */}
        <motion.div
          {...FADE_UP(0.42)}
          className="flex items-center gap-3 flex-wrap justify-center"
        >
          {/* Primary CTA */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all hover:brightness-110 active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}
          >
            <ArrowLeft size={14} />
            Kembali ke Beranda
          </Link>

          {/* Secondary — Archive */}
          <Link
            href="/archive"
            className="flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white/90 px-5 py-2.5 rounded-xl border border-white/8 hover:border-white/20 bg-white/4 hover:bg-white/8 transition-all"
          >
            Semua Artikel
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Quick nav row */}
        <motion.div
          {...FADE_UP(0.52)}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/15">
            Jelajahi
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Beranda", href: "/" },
              { label: "Tentang", href: "/about" },
              { label: "Arsip", href: "/archive" },
              { label: "Kontak", href: "/kontak" },
              { label: "Jurnal", href: "/jurnal" },
              { label: "Desain", href: "/desain" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs text-white/30 hover:text-white/70 border border-white/6 hover:border-white/15 bg-white/3 hover:bg-white/6 px-3 py-1.5 rounded-lg transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ── Bottom signature ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute bottom-6 text-[10px] tracking-[0.2em] uppercase text-white/12"
      >
        Rahmayolan · Blog
      </motion.p>
    </main>
  );
}