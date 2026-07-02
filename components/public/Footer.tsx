"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ArrowUp,
  Sparkles,
  Heart,
  Mail,
  ExternalLink,
  Lock,
} from "lucide-react";
import { Instagram, Twitter, Github } from "@/components/ui/Icons";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: "Navigasi",
    links: [
      { label: "Beranda",  href: "/" },
      { label: "Arsip",    href: "/archive" },
      { label: "Tentang",  href: "/about" },
      { label: "Kontak",   href: "/kontak" },
    ],
  },
  {
    label: "Ekosistem",
    links: [
      { label: "Webtoon",   href: "/category/webtoon" },
      { label: "Ilustrasi", href: "/category/ilustrasi" },
      { label: "Jurnal",    href: "/category/jurnal" },
      { label: "Foto Esai", href: "/category/foto-esai" },
      { label: "Tutorial",  href: "/category/tutorial" },
    ],
  },
  {
    label: "Legal",
    links: [
      { label: "Kebijakan Privasi",  href: "/privacy" },
      { label: "Syarat & Ketentuan", href: "/terms" },
      { label: "Admin Portal",       href: "/admin/login" },
      { label: "RSS Feed",           href: "/rss.xml",     external: true },
      { label: "Sitemap",            href: "/sitemap.xml", external: true },
    ],
  },
];

const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter,   label: "Twitter/X", href: "#" },
  { icon: Github,    label: "GitHub",    href: "#" },
  { icon: Mail,      label: "Email",     href: "mailto:hi@rahmayolan.id" },
];

// ─── NOISE ────────────────────────────────────────────────────────────────────

function Noise() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
      style={{ opacity: 0.022 }}
    >
      <filter id="fn">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.67"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#fn)" />
    </svg>
  );
}

// ─── BACK TO TOP ──────────────────────────────────────────────────────────────

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="btt"
          initial={{ opacity: 0, y: 16, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Kembali ke atas"
          className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white/60 hover:text-white transition-colors"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Pulse glow on hover */}
          <motion.span
            className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{ boxShadow: ["0 0 0px rgba(139,92,246,0)", "0 0 16px rgba(139,92,246,0.35)", "0 0 0px rgba(139,92,246,0)"] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowUp size={13} />
          </motion.span>
          Kembali ke Atas
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0f0f0f] overflow-hidden" aria-label="Footer">

      {/* Ambient glows */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/4 w-[600px] h-[300px] rounded-full blur-[120px] opacity-[0.07]"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,1), transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[400px] h-[250px] rounded-full blur-[100px] opacity-[0.055]"
          style={{ background: "radial-gradient(circle, rgba(244,114,182,1), transparent 70%)" }}
        />
        <Noise />
      </div>

      {/* Glowing gradient top border */}
      <div
        aria-hidden
        className="absolute top-0 inset-x-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.4) 30%, rgba(244,114,182,0.35) 55%, rgba(139,92,246,0.2) 80%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8">

        {/* ── UPPER BLOCK ─────────────────────────────────────────────────── */}
        <div className="pt-14 pb-12 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 lg:gap-8">

          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-5"
          >
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 w-fit group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-900/30 group-hover:brightness-110 transition-all">
                <BookOpen size={17} className="text-white" />
              </div>
              <span className="text-white font-black text-lg tracking-tight">
                Rahma<span className="text-violet-400">yolan</span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-white/35 text-sm leading-relaxed max-w-[260px]">
              Ruang jujur untuk bercerita — lewat kata, gambar, dan segala sesuatu di antaranya.
            </p>

            {/* Signature craft line */}
            <div className="flex items-center gap-2 text-white/20">
              <Sparkles size={11} className="text-violet-500/60" />
              <span className="text-[10px] tracking-wider font-medium italic">
                Crafted with passion for storytellers
              </span>
              <Heart size={10} className="text-pink-500/50 fill-pink-500/40" />
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2 mt-1">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ scale: 1.12, borderColor: "rgba(139,92,246,0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/8 flex items-center justify-center text-white/35 hover:text-violet-400 transition-colors"
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Nav groups */}
          {NAV_GROUPS.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 + gi * 0.07 }}
              className="flex flex-col gap-4"
            >
              {/* Group label */}
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/20">
                {group.label}
              </span>

              {/* Links */}
              <ul className="flex flex-col gap-2.5" role="list">
                {group.links.map(({ label, href, external }) => (
                  <li key={label}>
                    {external ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors duration-200"
                      >
                        <span className="relative">
                          {label}
                          <span className="absolute -bottom-px left-0 right-0 h-px bg-violet-400/60 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                        </span>
                        <ExternalLink size={10} className="opacity-40 group-hover:opacity-80 transition-opacity" />
                      </a>
                    ) : (
                      <Link
                        href={href}
                        className="group inline-block text-white/40 hover:text-white text-sm transition-colors duration-200 relative"
                      >
                        {label}
                        <span className="absolute -bottom-px left-0 right-0 h-px bg-violet-400/60 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* ── LOWER BAR ───────────────────────────────────────────────────── */}
        <div className="border-t border-white/[0.055]">
          <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Copyright */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-white/20 text-[11px] tracking-wide text-center sm:text-left"
            >
              © {year} Rahmayolan.id — Seluruh konten dilindungi hak cipta.
            </motion.p>

            {/* Back to top */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <BackToTop />
            </motion.div>

            {/* Made with & Admin Lock */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-1.5 text-white/15 text-[10px] tracking-widest uppercase">
                <span>Dibuat di</span>
                <span className="text-white/25 font-semibold">Jakarta</span>
                <span className="text-[8px]">🇮🇩</span>
              </div>
              <Link
                href="/admin/login"
                title="Login Admin"
                className="w-6 h-6 rounded-lg bg-white/[0.03] hover:bg-violet-500/20 border border-white/5 hover:border-violet-500/30 flex items-center justify-center text-white/20 hover:text-violet-300 transition-all"
              >
                <Lock size={11} />
              </Link>
            </motion.div>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;