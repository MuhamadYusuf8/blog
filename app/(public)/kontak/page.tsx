"use client";

import { useState, useId } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import {
  Mail,
  Send,
  User,
  Sparkles,
  MessageSquare,
  ArrowUpRight,
  Loader2,
  CheckCircle2,
  AtSign,
} from "lucide-react";
import { Instagram, Twitter, Github } from "@/components/ui/Icons";
import { PublicNavbar } from "@/components/public/PublicNavbar";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type Status = "idle" | "loading" | "success" | "error";

// ─── NOISE ────────────────────────────────────────────────────────────────────

function Noise() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden style={{ opacity: 0.028 }}>
      <filter id="cn">
        <feTurbulence type="fractalNoise" baseFrequency="0.67" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#cn)" />
    </svg>
  );
}

// ─── ABSTRACT FLOATING ART ────────────────────────────────────────────────────

function FloatingArt() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-200, 200], [8, -8]);
  const rotateY = useTransform(mouseX, [-200, 200], [-8, 8]);

  return (
    <motion.div
      className="relative w-full max-w-xs mx-auto select-none"
      style={{ perspective: 800, rotateX, rotateY }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* Outer glow */}
      <div
        className="absolute -inset-8 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.9), rgba(244,114,182,0.5) 60%, transparent 80%)" }}
      />

      {/* Portrait frame */}
      <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/10"
        style={{ background: "linear-gradient(145deg, rgba(139,92,246,0.12), rgba(244,114,182,0.06))" }}>

        {/* Abstract layered circles */}
        <svg viewBox="0 0 300 400" className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="g1" cx="50%" cy="40%">
              <stop offset="0%" stopColor="rgba(139,92,246,0.5)" />
              <stop offset="100%" stopColor="rgba(139,92,246,0)" />
            </radialGradient>
            <radialGradient id="g2" cx="60%" cy="60%">
              <stop offset="0%" stopColor="rgba(244,114,182,0.4)" />
              <stop offset="100%" stopColor="rgba(244,114,182,0)" />
            </radialGradient>
            <radialGradient id="g3" cx="30%" cy="70%">
              <stop offset="0%" stopColor="rgba(96,165,250,0.3)" />
              <stop offset="100%" stopColor="rgba(96,165,250,0)" />
            </radialGradient>
          </defs>
          <circle cx="150" cy="160" r="130" fill="url(#g1)" />
          <circle cx="190" cy="240" r="90"  fill="url(#g2)" />
          <circle cx="90"  cy="300" r="70"  fill="url(#g3)" />
          {/* Fine orbit rings */}
          <circle cx="150" cy="200" r="110" stroke="rgba(139,92,246,0.15)" strokeWidth="1" fill="none" />
          <circle cx="150" cy="200" r="80"  stroke="rgba(244,114,182,0.10)" strokeWidth="0.5" fill="none" strokeDasharray="6 4" />
          <circle cx="150" cy="200" r="50"  stroke="rgba(167,139,250,0.20)" strokeWidth="1" fill="none" />
          {/* Center orb */}
          <circle cx="150" cy="200" r="22" fill="rgba(139,92,246,0.55)" />
          <circle cx="150" cy="200" r="12" fill="rgba(244,114,182,0.8)" />
          <circle cx="150" cy="200" r="5"  fill="white" opacity="0.9" />
          {/* Floating particles */}
          {[
            [60, 80, 3], [240, 120, 2], [80, 320, 2.5],
            [220, 300, 3.5], [170, 60, 2], [50, 200, 1.5],
          ].map(([cx, cy, r], i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="rgba(167,139,250,0.6)" />
          ))}
        </svg>

        {/* Bottom caption glass */}
        <div className="absolute bottom-5 inset-x-4">
          <div className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 text-center">
            <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-0.5">Studio</p>
            <p className="text-white font-black text-sm">KakRahma.id</p>
          </div>
        </div>
      </div>

      {/* Floating accent dots */}
      <motion.div animate={{ y: [-6, 6, -6] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-violet-500/70 blur-sm" />
      <motion.div animate={{ y: [6, -6, 6] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-pink-500/60 blur-sm" />
    </motion.div>
  );
}

// ─── SOCIAL PILLS ─────────────────────────────────────────────────────────────

const SOCIALS = [
  { icon: Mail,      label: "hi@kakrahma.id",   href: "mailto:hi@kakrahma.id" },
  { icon: Instagram, label: "@kakrahma",         href: "#" },
  { icon: Twitter,   label: "@kakrahma_id",      href: "#" },
  { icon: Github,    label: "kakrahma",          href: "#" },
];

// ─── FLOATING LABEL INPUT ─────────────────────────────────────────────────────

interface FloatInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ElementType;
  required?: boolean;
  error?: string;
  autoComplete?: string;
}

function FloatInput({
  id, label, type = "text", value, onChange, icon: Icon,
  required, error, autoComplete,
}: FloatInputProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative">
      <motion.div
        animate={
          focused
            ? { boxShadow: "0 0 0 1.5px rgba(139,92,246,0.7), 0 4px 24px rgba(139,92,246,0.12)" }
            : error
            ? { boxShadow: "0 0 0 1.5px rgba(239,68,68,0.6)" }
            : { boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }
        }
        transition={{ duration: 0.2 }}
        className="relative rounded-2xl overflow-hidden bg-white/[0.04]"
      >
        {/* Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          <Icon size={15} className={`transition-colors duration-200 ${focused ? "text-violet-400" : "text-white/25"}`} />
        </div>

        {/* Floating label */}
        <label
          htmlFor={id}
          className="absolute left-11 pointer-events-none z-10 font-medium transition-all duration-200 origin-left"
          style={{
            top: lifted ? "8px" : "50%",
            transform: lifted ? "translateY(0) scale(0.75)" : "translateY(-50%) scale(1)",
            color: focused ? "rgba(167,139,250,0.9)" : lifted ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.3)",
            fontSize: "0.875rem",
          }}
        >
          {label}{required && " *"}
        </label>

        {/* Input */}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full bg-transparent text-white text-sm pl-11 pr-4 pt-6 pb-3 outline-none transition-colors placeholder-transparent"
        />
      </motion.div>

      {error && (
        <motion.p id={`${id}-error`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="text-red-400/80 text-[11px] mt-1.5 ml-1">
          {error}
        </motion.p>
      )}
    </div>
  );
}

// ─── FLOAT TEXTAREA ───────────────────────────────────────────────────────────

function FloatTextarea({
  id, label, value, onChange, required, error,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; required?: boolean; error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative">
      <motion.div
        animate={
          focused
            ? { boxShadow: "0 0 0 1.5px rgba(139,92,246,0.7), 0 4px 24px rgba(139,92,246,0.12)" }
            : error
            ? { boxShadow: "0 0 0 1.5px rgba(239,68,68,0.6)" }
            : { boxShadow: "0 0 0 1px rgba(255,255,255,0.07)" }
        }
        transition={{ duration: 0.2 }}
        className="relative rounded-2xl overflow-hidden bg-white/[0.04]"
      >
        <div className="absolute left-4 top-5 pointer-events-none z-10">
          <MessageSquare size={15} className={`transition-colors duration-200 ${focused ? "text-violet-400" : "text-white/25"}`} />
        </div>

        <label
          htmlFor={id}
          className="absolute left-11 pointer-events-none z-10 font-medium transition-all duration-200 origin-left"
          style={{
            top: lifted ? "10px" : "22px",
            transform: lifted ? "scale(0.75)" : "scale(1)",
            color: focused ? "rgba(167,139,250,0.9)" : "rgba(255,255,255,0.3)",
            fontSize: "0.875rem",
          }}
        >
          {label}{required && " *"}
        </label>

        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          rows={5}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full bg-transparent text-white text-sm pl-11 pr-4 pt-8 pb-4 outline-none resize-none transition-colors"
        />
      </motion.div>

      {error && (
        <motion.p id={`${id}-error`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="text-red-400/80 text-[11px] mt-1.5 ml-1">
          {error}
        </motion.p>
      )}
    </div>
  );
}

// ─── ANIMATED CHECK ───────────────────────────────────────────────────────────

function AnimatedCheck() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <motion.circle
        cx="36" cy="36" r="34" stroke="url(#cg)" strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      <motion.path
        d="M20 37L31 48L52 25"
        stroke="url(#cg2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
      />
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="72" y2="72">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="cg2" x1="20" y1="36" x2="52" y2="36">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── SUCCESS CARD ─────────────────────────────────────────────────────────────

function SuccessCard() {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center py-12 px-8"
    >
      {/* Glow behind check */}
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-2xl opacity-40 scale-150"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.8), rgba(244,114,182,0.4), transparent 70%)" }} />
        <AnimatedCheck />
      </div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.45 }}
        className="text-white font-black text-2xl mb-3 leading-tight"
      >
        Pesanmu Sudah<br />
        <span style={{
          background: "linear-gradient(135deg, rgba(167,139,250,1), rgba(244,114,182,0.9))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>
          Sampai! 🎉
        </span>
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.4 }}
        className="text-white/45 text-sm leading-relaxed max-w-xs"
      >
        Terima kasih sudah meluangkan waktu untuk menyapa. Aku akan membaca pesanmu dan membalas secepatnya — biasanya dalam 1–2 hari kerja.
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.4 }}
        className="text-violet-400/60 text-xs mt-6 font-medium italic"
      >
        — Kak Rahma
      </motion.p>
    </motion.div>
  );
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [status, setStatus] = useState<Status>("idle");
  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const msgId = useId();

  const set = (k: keyof FormState) => (v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: Partial<FormState> = {};
    if (!form.name.trim())    e.name    = "Nama tidak boleh kosong.";
    if (!form.email.trim())   e.email   = "Email tidak boleh kosong.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email tidak valid.";
    if (!form.message.trim()) e.message = "Pesan tidak boleh kosong.";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStatus("loading");
    // Simulate async server action
    await new Promise((r) => setTimeout(r, 1800));
    setStatus("success");
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(28px)",
      }}
    >
      {/* Top terminal bar */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.07]">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
        <span className="ml-2 text-white/20 text-[10px] font-mono tracking-widest">kontak.sh — new message</span>
      </div>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <SuccessCard key="success" />
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            noValidate
            className="p-6 sm:p-8 flex flex-col gap-4"
            aria-label="Formulir kontak"
          >
            {/* Row: name + email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <FloatInput id={nameId}  label="Nama Kamu"    value={form.name}    onChange={set("name")}    icon={User}   required autoComplete="name"  error={errors.name}  />
              <FloatInput id={emailId} label="Alamat Email" value={form.email}   onChange={set("email")}   icon={AtSign} required autoComplete="email" error={errors.email} type="email" />
            </div>

            <FloatInput id={subjectId} label="Perihal (opsional)" value={form.subject} onChange={set("subject")} icon={Sparkles} autoComplete="off" />

            <FloatTextarea id={msgId} label="Pesanmu" value={form.message} onChange={set("message")} required error={errors.message} />

            {/* Error summary */}
            {status === "error" && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400/80 text-xs text-center">
                Terjadi kesalahan. Coba lagi atau kirim email langsung.
              </motion.p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={status === "loading"}
              whileHover={status !== "loading" ? { scale: 1.02 } : {}}
              whileTap={status !== "loading" ? { scale: 0.98 } : {}}
              className="relative w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm text-white overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed mt-1"
              style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.95), rgba(139,92,246,0.9), rgba(219,39,119,0.85))" }}
            >
              {/* Shine sweep */}
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.12) 50%, transparent 65%)",
                  backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              {/* Pulse ring */}
              <motion.span
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{ opacity: [0.3, 0.65, 0.3] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ boxShadow: "0 0 24px rgba(139,92,246,0.5)" }}
              />

              {status === "loading" ? (
                <><Loader2 size={16} className="animate-spin" /><span>Mengirim…</span></>
              ) : (
                <><Send size={15} /><span>Kirim Pesan</span></>
              )}
            </motion.button>

            <p className="text-white/25 text-[11px] text-center leading-relaxed">
              Biasanya dibalas dalam 1–2 hari kerja · Pesanmu aman dan tidak dibagikan ke pihak manapun.
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white overflow-x-hidden">
      <PublicNavbar />

      {/* ── AMBIENT ATMOSPHERE ─────────────────────────────────────────── */}
      <div aria-hidden className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[700px] h-[600px] rounded-full blur-[150px] opacity-[0.13]"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,1), transparent 70%)" }} />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.09]"
          style={{ background: "radial-gradient(circle, rgba(244,114,182,1), transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-[0.07]"
          style={{ background: "radial-gradient(circle, rgba(96,165,250,1), transparent 70%)" }} />
        <div className="absolute inset-0 opacity-[0.024]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }} />
        <Noise />
      </div>

      {/* ── HERO + FORM ────────────────────────────────────────────────── */}
      <section className="relative z-10 max-w-screen-xl mx-auto px-5 sm:px-8 pt-28 pb-24">

        {/* Asymmetric 2-column layout */}
        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-16 lg:gap-20 items-start">

          {/* ── LEFT — Hero copy ── */}
          <div className="lg:sticky lg:top-24">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
              className="flex items-center gap-2.5 mb-7"
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.5, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-white/30">Sapa Kami</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="font-black leading-[0.92] mb-6"
              style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)" }}
            >
              <span style={{
                background: "linear-gradient(140deg, #ffffff 0%, rgba(255,255,255,0.88) 40%, rgba(167,139,250,0.75) 70%, rgba(244,114,182,0.65) 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                filter: "drop-shadow(0 0 44px rgba(139,92,246,0.38))",
              }}>
                Mari<br />Saling<br />Sapa
              </span>
            </motion.h1>

            {/* Sub copy */}
            <motion.p
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="text-white/40 text-sm leading-relaxed max-w-sm mb-10"
            >
              Ada cerita yang ingin kamu bagikan? Ide kolaborasi yang menarik? Atau sekadar ingin menyapa dan mengobrol?
              <br /><br />
              Pintuku selalu terbuka — dan aku membaca setiap pesan dengan sepenuh hati.
            </motion.p>

            {/* Social pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="flex flex-col gap-2.5 mb-12"
            >
              {SOCIALS.map(({ icon: Icon, label, href }, i) => (
                <motion.a
                  key={label} href={href}
                  initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.38 + i * 0.07, duration: 0.4 }}
                  whileHover={{ x: 5, borderColor: "rgba(139,92,246,0.4)" }}
                  className="flex items-center gap-3 bg-white/[0.035] border border-white/8 rounded-2xl px-4 py-3 group transition-all duration-200 w-fit"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/8 group-hover:bg-violet-500/10 group-hover:border-violet-500/20 flex items-center justify-center transition-all">
                    <Icon size={14} className="text-white/40 group-hover:text-violet-400 transition-colors" />
                  </div>
                  <span className="text-white/60 group-hover:text-white text-sm font-medium transition-colors">{label}</span>
                  <ArrowUpRight size={13} className="text-white/15 group-hover:text-violet-400 transition-colors ml-1" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT — Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <ContactForm />

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.5 }}
              className="flex items-center justify-center gap-6 mt-6"
            >
              {[
                { icon: CheckCircle2, label: "Aman & Privat" },
                { icon: Sparkles,     label: "Dibalas Sendiri" },
                { icon: Mail,         label: "Tidak ada spam" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-white/20 text-[10px]">
                  <Icon size={10} />{label}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Centered Portrait Art / Studio Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center w-full mt-20"
        >
          <FloatingArt />
        </motion.div>
      </section>
    </div>
  );
}