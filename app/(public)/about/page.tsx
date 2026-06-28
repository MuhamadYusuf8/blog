"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  Sparkles,
  Heart,
  Coffee,
  Pen,
  BookOpen,
  Users,
  Star,
  ArrowUpRight,
  Mail,
  Palette,
  Lightbulb,
  Moon,
} from "lucide-react";
import { Instagram, Twitter, Github } from "@/components/ui/Icons";
import { PublicNavbar } from "@/components/public/PublicNavbar";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: "120+", label: "Artikel Ditulis",   icon: Pen,      color: "from-violet-500 to-fuchsia-500" },
  { value: "3+",   label: "Tahun Berkarya",    icon: Star,     color: "from-pink-500 to-rose-500"      },
  { value: "48K",  label: "Pembaca Setia",     icon: Users,    color: "from-amber-500 to-orange-500"   },
  { value: "∞",    label: "Cerita Tersimpan",  icon: BookOpen, color: "from-emerald-500 to-teal-500"   },
];

const VALUES = [
  {
    icon: Sparkles,
    title: "Keaslian di Atas Segalanya",
    desc: "Setiap kata yang aku tulis adalah potongan nyata dari hidupku — tidak dipoles berlebihan, tidak dibuat-buat.",
  },
  {
    icon: Heart,
    title: "Bercerita dengan Empati",
    desc: "Aku percaya cerita yang baik bukan yang paling indah, tapi yang paling jujur membuat pembacanya merasa ditemani.",
  },
  {
    icon: Coffee,
    title: "Proses adalah Seninya",
    desc: "Karya terbaik lahir bukan dari inspirasi semata, tapi dari keberanian duduk dan terus menulis bahkan saat ide tak kunjung datang.",
  },
  {
    icon: Palette,
    title: "Visual sebagai Bahasa",
    desc: "Bagi aku, gambar dan kata adalah dua sisi dari koin yang sama — keduanya bercerita dengan caranya masing-masing.",
  },
  {
    icon: Moon,
    title: "Keheningan Malam sebagai Studio",
    desc: "Karya terbaikku lahir di antara jam sebelas malam dan dua pagi, ketika dunia diam dan pikiran paling jujur.",
  },
  {
    icon: Lightbulb,
    title: "Komunitas adalah Energi",
    desc: "Setiap komentar, setiap DM, setiap 'terima kasih' dari pembaca adalah bahan bakar yang menjagaku terus berkarya.",
  },
];

const TIMELINE = [
  {
    year: "2022",
    title: "Baris Pertama yang Bergetar",
    desc: "Menulis jurnal pertama di blog sederhana tanpa domain sendiri. Hanya menulis untuk diri sendiri — tanpa ekspektasi, penuh keberanian.",
    side: "left",
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    year: "2023",
    title: "Menemukan Suara Sendiri",
    desc: "Mulai konsisten posting setiap minggu. Pembaca pertama berdatangan. Menyadari bahwa ada orang lain yang juga merasakan hal yang sama.",
    side: "right",
    accent: "from-pink-500 to-rose-500",
  },
  {
    year: "2024",
    title: "Dunia Webtoon Terbuka",
    desc: "Bereksperimen menggabungkan ilustrasi dengan tulisan. Lahirlah format baru — esai bergambar yang menjadi ciri khas Kak Rahma.",
    side: "left",
    accent: "from-amber-500 to-orange-500",
  },
  {
    year: "2025",
    title: "Komunitas yang Tumbuh",
    desc: "Pembaca menembus 40.000. Merilis seri 'Catatan Malam Hari' yang menjadi yang paling banyak dibaca sepanjang masa.",
    side: "right",
    accent: "from-emerald-500 to-teal-500",
  },
  {
    year: "2026",
    title: "Membangun Rumah Digital",
    desc: "Peluncuran ulang blog dengan desain baru — lebih sinematik, lebih personal, lebih seperti rumah. Ini bukan akhir, ini awal yang baru.",
    side: "left",
    accent: "from-cyan-500 to-blue-500",
  },
];

const SOCIALS = [
  { icon: Instagram, label: "Instagram", handle: "@kakrahma",     href: "#" },
  { icon: Twitter,   label: "Twitter/X", handle: "@kakrahma_id",  href: "#" },
  { icon: Mail,      label: "Email",     handle: "hi@kakrahma.id", href: "#" },
  { icon: Github,    label: "GitHub",    handle: "kakrahma",       href: "#" },
];

// ─── NOISE SVG ────────────────────────────────────────────────────────────────

const Noise = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.032] pointer-events-none" aria-hidden>
    <filter id="n">
      <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#n)" />
  </svg>
);

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({ value, label, icon: Icon, color }: typeof STATS[0]) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: "0 0 0 1px rgba(139,92,246,0.45), 0 16px 48px rgba(139,92,246,0.12)" }}
      transition={{ duration: 0.22 }}
      className="group relative overflow-hidden rounded-2xl bg-white/[0.04] border border-white/8 backdrop-blur-xl p-6 flex flex-col gap-4 cursor-default"
    >
      {/* Corner glow on hover */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
        style={{ background: `linear-gradient(135deg, rgba(139,92,246,0.8), rgba(244,114,182,0.6))` }} />

      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} bg-opacity-15 flex items-center justify-center`}
        style={{ background: "rgba(255,255,255,0.06)" }}>
        <Icon size={18} className={`bg-gradient-to-br ${color} bg-clip-text`} style={{ color: "rgba(167,139,250,0.9)" }} />
      </div>

      <div>
        <div className="text-3xl font-black text-white tracking-tight leading-none mb-1">{value}</div>
        <div className="text-white/35 text-xs font-medium uppercase tracking-widest">{label}</div>
      </div>
    </motion.div>
  );
}

// ─── VALUE CARD ───────────────────────────────────────────────────────────────

function ValueCard({ icon: Icon, title, desc }: typeof VALUES[0]) {
  return (
    <motion.div
      whileHover={{ y: -4, borderColor: "rgba(139,92,246,0.35)" }}
      transition={{ duration: 0.2 }}
      className="group rounded-2xl bg-white/[0.03] border border-white/8 p-5 flex gap-4"
    >
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center">
        <Icon size={15} className="text-violet-400" />
      </div>
      <div>
        <h4 className="text-white text-sm font-bold mb-1.5 leading-snug">{title}</h4>
        <p className="text-white/40 text-xs leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── TIMELINE ITEM ────────────────────────────────────────────────────────────

function TimelineItem({ item, index }: { item: typeof TIMELINE[0]; index: number }) {
  const isLeft = item.side === "left";

  return (
    <div className={`relative flex items-start gap-0 ${isLeft ? "flex-row" : "flex-row-reverse"} group`}>
      {/* Content card */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="w-[calc(50%-28px)] rounded-2xl bg-white/[0.04] border border-white/8 p-5 hover:border-violet-500/25 transition-colors duration-300"
      >
        <div className={`text-xs font-black uppercase tracking-[0.2em] bg-gradient-to-r ${item.accent} bg-clip-text text-transparent mb-2`}>
          {item.year}
        </div>
        <h4 className="text-white font-bold text-sm leading-snug mb-2">{item.title}</h4>
        <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
      </motion.div>

      {/* Center spine dot */}
      <div className="flex-shrink-0 w-14 flex flex-col items-center pt-5">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.35, delay: index * 0.08 + 0.2, ease: "backOut" }}
          className={`w-4 h-4 rounded-full bg-gradient-to-br ${item.accent} shadow-lg`}
          style={{ boxShadow: "0 0 16px rgba(139,92,246,0.5)" }}
        />
      </div>

      {/* Empty spacer for the other side */}
      <div className="w-[calc(50%-28px)]" />
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const portraitY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 40]), { stiffness: 80, damping: 20 });

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white overflow-x-hidden">
      <PublicNavbar />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-10">

        {/* Ambient glows */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,1), transparent 70%)" }} />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] opacity-12"
            style={{ background: "radial-gradient(circle, rgba(244,114,182,1), transparent 70%)" }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }} />
          <Noise />
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT — Text */}
            <div>
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2.5 mb-7"
              >
                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-400 to-pink-400" />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/35">
                  Tentang Penulis
                </span>
              </motion.div>

              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6"
              >
                <p className="text-white/30 text-lg font-light mb-1">Halo, Saya</p>
                <h1
                  className="font-black leading-[0.9]"
                  style={{ fontSize: "clamp(4rem, 11vw, 8rem)" }}
                >
                  <span
                    style={{
                      background: "linear-gradient(135deg, #ffffff 0%, rgba(167,139,250,0.9) 50%, rgba(244,114,182,0.8) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 40px rgba(139,92,246,0.45))",
                    }}
                  >
                    Kak
                  </span>
                  <br />
                  <span className="text-white" style={{ filter: "drop-shadow(0 0 32px rgba(244,114,182,0.3))" }}>
                    Rahma
                  </span>
                </h1>
              </motion.div>

              {/* Bio */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.25 }}
                className="text-white/45 leading-relaxed text-sm max-w-md mb-8"
              >
                Penulis jurnal, ilustrator paruh waktu, dan peminum kopi profesional. 
                Aku percaya bahwa setiap orang punya cerita yang layak diceritakan — 
                dan aku di sini untuk membantu menemukan cara terbaik untuk menceritakannya.
                Blog ini adalah ruang jujurku: tidak sempurna, tapi selalu nyata.
              </motion.p>

              {/* Signature tags */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="flex flex-wrap gap-2"
              >
                {["Jurnal Harian", "Webtoon", "Ilustrasi", "Foto Esai", "Jakarta 🇮🇩"].map((tag) => (
                  <span key={tag}
                    className="text-[10px] font-semibold text-white/40 bg-white/5 border border-white/8 px-3 py-1.5 rounded-full hover:border-violet-500/30 hover:text-white/60 transition-all cursor-default">
                    {tag}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — Portrait */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex justify-center lg:justify-end"
            >
              <motion.div
                style={{ y: portraitY }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-xs sm:max-w-sm"
              >
                {/* Glow ring */}
                <div className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.6), rgba(244,114,182,0.4))" }} />

                {/* Portrait container */}
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop&q=90"
                    alt="Kak Rahma"
                    className="w-full h-full object-cover"
                  />
                  {/* Bottom fade to bg */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/10 to-transparent" />

                  {/* Floating caption */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-white font-bold text-sm">Kak Rahma</div>
                          <div className="text-white/40 text-[10px]">Penulis & Ilustrator</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center">
                          <Pen size={13} className="text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative corner dots */}
                <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-violet-500/60 blur-sm" />
                <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-pink-500/50 blur-sm" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0f0f0f] to-transparent pointer-events-none" />
      </section>

      {/* ── STATS BENTO ───────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-5 sm:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="h-px flex-1 bg-white/8" />
          <span className="text-[11px] font-black uppercase tracking-[0.22em] text-white/25">Dalam Angka</span>
          <div className="h-px flex-1 bg-white/8" />
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
            >
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>

        {/* Values grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">Nilai & Filosofi</h2>
          <p className="text-white/35 text-sm">Prinsip-prinsip yang menghidupkan setiap kata yang aku tulis.</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
            >
              <ValueCard {...v} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TIMELINE ──────────────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-5 sm:px-8 pb-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-400/70">
            Perjalanan Cerita
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 mb-3">
            Dari Satu Baris<br />
            <span
              style={{
                background: "linear-gradient(135deg, rgba(167,139,250,1), rgba(244,114,182,0.9))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Menjadi Ribuan Halaman
            </span>
          </h2>
          <p className="text-white/35 text-sm max-w-md mx-auto">
            Setiap karya besar dimulai dari satu langkah kecil yang berani.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical spine line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="w-full h-full origin-top bg-gradient-to-b from-violet-500/60 via-pink-500/40 to-transparent"
            />
          </div>

          <div className="flex flex-col gap-10">
            {TIMELINE.map((item, i) => (
              <TimelineItem key={item.year} item={item} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CONNECT TERMINAL ──────────────────────────────────────────────── */}
      <section className="max-w-screen-xl mx-auto px-5 sm:px-8 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] rounded-full blur-[80px] opacity-20 pointer-events-none"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,1), rgba(244,114,182,0.8))" }} />
          <Noise />

          {/* Terminal top bar */}
          <div className="relative flex items-center gap-2 px-5 py-3.5 border-b border-white/8">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-amber-500/60" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            <span className="ml-3 text-white/20 text-[10px] font-mono tracking-wider">
              kakrahma.id — kontak.sh
            </span>
          </div>

          <div className="relative p-8 sm:p-14">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left copy */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                  Mari Saling
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, rgba(167,139,250,1), rgba(244,114,182,0.9))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Sapa 👋
                  </span>
                </h2>
                <p className="text-white/40 text-sm leading-relaxed max-w-sm mb-8">
                  Punya pertanyaan, ide kolaborasi, atau sekadar ingin berbagi cerita?
                  Pintuku selalu terbuka. Aku membalas setiap pesan dengan sepenuh hati.
                </p>

                {/* Pulse send button */}
                <motion.a
                  href="mailto:hi@kakrahma.id"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold text-white overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(139,92,246,0.9), rgba(244,114,182,0.8))",
                  }}
                >
                  {/* Pulsing aura */}
                  <motion.span
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.04, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ boxShadow: "0 0 28px rgba(139,92,246,0.6)" }}
                  />
                  <Mail size={15} />
                  Kirim Pesan
                  <ArrowUpRight size={13} className="opacity-70" />
                </motion.a>
              </div>

              {/* Right — Social links */}
              <div className="grid grid-cols-1 gap-3">
                {SOCIALS.map(({ icon: Icon, label, handle, href }, i) => (
                  <motion.a
                    key={label}
                    href={href}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    whileHover={{ x: 4, borderColor: "rgba(139,92,246,0.4)" }}
                    className="flex items-center gap-4 bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3.5 group transition-colors duration-200"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center group-hover:bg-violet-500/10 group-hover:border-violet-500/20 transition-all">
                      <Icon size={16} className="text-white/40 group-hover:text-violet-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white/60 text-[10px] uppercase tracking-widest font-semibold">{label}</div>
                      <div className="text-white text-sm font-semibold truncate">{handle}</div>
                    </div>
                    <ArrowUpRight size={14} className="text-white/20 group-hover:text-violet-400 transition-colors flex-shrink-0" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}