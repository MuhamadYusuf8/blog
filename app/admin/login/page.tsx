"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2,
  User,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  FileText,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import HCaptcha from "@hcaptcha/react-hcaptcha";

// ─── Types ──────────────────────────────────────────────────────────────────

type AuthMode = "login" | "register" | "forgot";

interface FormState {
  name: string;
  email: string;
  password: string;
}

interface FieldMeta {
  name: boolean;
  email: boolean;
  password: boolean;
}

// ─── Noise Texture SVG ──────────────────────────────────────────────────────

const NoiseSVG = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay"
    xmlns="http://www.w3.org/2000/svg"
  >
    <filter id="noise">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.85"
        numOctaves="4"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#noise)" />
  </svg>
);

// ─── Floating Label Input ────────────────────────────────────────────────────

interface FloatingInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
  icon: React.ReactNode;
  disabled?: boolean;
  rightSlot?: React.ReactNode;
  autoComplete?: string;
}

function FloatingInput({
  id,
  label,
  type,
  value,
  onChange,
  onFocus,
  onBlur,
  isFocused,
  icon,
  disabled,
  rightSlot,
  autoComplete,
}: FloatingInputProps) {
  return (
    <div className="w-full text-left">
      {/* Label di atas input */}
      <label
        htmlFor={id}
        className={`block text-[12px] font-semibold mb-1.5 tracking-wide transition-colors ${
          isFocused ? "text-violet-400" : "text-white/60"
        }`}
      >
        {label}
      </label>

      {/* Input container */}
      <div className="relative w-full">
        {/* Outer glow ring – only visible on focus */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-xl"
          animate={{
            opacity: isFocused ? 1 : 0,
            boxShadow: isFocused
              ? "0 0 0 1.5px rgba(139,92,246,0.7), 0 0 16px 4px rgba(139,92,246,0.15)"
              : "0 0 0 0px rgba(139,92,246,0)",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />

        <div
          className={`
            relative flex h-[48px] items-center rounded-xl border bg-[#18181b] backdrop-blur-md
            transition-all duration-200 overflow-hidden
            ${isFocused ? "border-violet-500/80 bg-[#1e1e24]" : "border-white/12 hover:border-white/25"}
          `}
        >
          {/* Left icon */}
          <span
            className={`pl-3.5 pr-2.5 shrink-0 transition-colors duration-200 flex items-center ${
              isFocused ? "text-violet-400" : "text-white/35"
            }`}
          >
            {icon}
          </span>

          {/* Input field dengan pencegahan autofill putih Chrome */}
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={disabled}
            autoComplete={autoComplete}
            placeholder={`Masukkan ${label.toLowerCase()}...`}
            className="
              h-full w-full bg-transparent pr-3 text-[14px] font-normal tracking-wide
              text-white outline-none placeholder:text-white/20
              disabled:opacity-50 disabled:cursor-not-allowed
              [&:-webkit-autofill]:shadow-[0_0_0_1000px_#18181b_inset]
              [&:-webkit-autofill]:[-webkit-text-fill-color:#ffffff]
              [&:-webkit-autofill]:transition-colors [&:-webkit-autofill]:duration-[5000s]
            "
          />

          {/* Right slot */}
          {rightSlot && <span className="pr-3.5 shrink-0 flex items-center">{rightSlot}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Shine Button ────────────────────────────────────────────────────────────

interface ShineButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
}

function ShineButton({ isLoading, children }: ShineButtonProps) {
  const shineX = useMotionValue(-100);

  const handleMouseEnter = () => {
    animate(shineX, 200, { duration: 0.55, ease: "easeInOut" });
  };

  const handleMouseLeave = () => {
    shineX.set(-100);
  };

  const shineLeft = useTransform(shineX, (v) => `${v}%`);

  return (
    <motion.button
      type="submit"
      disabled={isLoading}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.97 }}
      className="relative w-full overflow-hidden rounded-xl py-3.5 text-[14px] font-bold tracking-widest uppercase text-white shadow-lg shadow-violet-900/30 disabled:cursor-not-allowed disabled:opacity-70 transition-all"
      style={{
        background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #ec4899 100%)",
      }}
    >
      {/* Subtle pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-xl pointer-events-none"
        animate={{ opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          boxShadow: "0 0 24px 4px rgba(168,85,247,0.45)",
        }}
      />

      {/* Shine sweep */}
      <motion.div
        className="pointer-events-none absolute top-0 h-full w-24 skew-x-[-18deg]"
        style={{
          left: shineLeft,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
        }}
      />

      {/* Label */}
      <span className="relative flex items-center justify-center gap-2">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Memproses…
            </motion.span>
          ) : (
            <motion.span
              key="label"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2"
            >
              {children}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.button>
  );
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "" });
  const [focused, setFocused] = useState<FieldMeta>({ name: false, email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<"terms" | "privacy" | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  // Switch mode helper
  const switchMode = (newMode: AuthMode) => {
    setError(null);
    setSuccessMsg(null);
    setCaptchaToken(null);
    captchaRef.current?.resetCaptcha();
    setMode(newMode);
  };

  // Submit Handler activating all modes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === "login") {
      if (!form.email || !form.password) {
        setError("Mohon isi email dan kata sandi terlebih dahulu.");
        return;
      }
      if (!captchaToken && process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY) {
        setError("Mohon selesaikan verifikasi captcha terlebih dahulu.");
        return;
      }
      setIsLoading(true);

      // Attempt real Supabase authentication
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
        options: { captchaToken: captchaToken || undefined },
      });

      await new Promise((r) => setTimeout(r, 600));
      setIsLoading(false);

      if (authError) {
        // Tampilkan pesan error asli dari Supabase (misal: "Email not confirmed" atau "Invalid login credentials")
        setError(authError.message === "Invalid login credentials" ? "Email atau kata sandi salah. Silakan coba lagi." : authError.message);
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
        return;
      }

      setSuccessMsg("✦ Otentikasi berhasil! Mengalihkan ke dashboard…");
      setTimeout(() => {
        // Gunakan window.location untuk memaksa full reload agar layout admin (sidebar) dirender ulang oleh server
        window.location.href = "/admin";
      }, 1000);
    } else if (mode === "register") {
      if (!form.name || !form.email || !form.password) {
        setError("Mohon lengkapi semua kolom pendaftaran.");
        return;
      }
      if (form.password.length < 6) {
        setError("Kata sandi minimal terdiri dari 6 karakter.");
        return;
      }
      if (!captchaToken && process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY) {
        setError("Mohon selesaikan verifikasi captcha terlebih dahulu.");
        return;
      }
      setIsLoading(true);

      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.name },
          captchaToken: captchaToken || undefined,
        },
      });

      setIsLoading(false);

      if (signUpError && !signUpError.message.includes("already registered")) {
        setError(signUpError.message);
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
        return;
      }

      setSuccessMsg("✦ Akun berhasil terdaftar! Silakan masuk dengan akun barumu.");
      setTimeout(() => switchMode("login"), 1500);
    } else if (mode === "forgot") {
      if (!form.email) {
        setError("Masukkan alamat email yang terdaftar.");
        return;
      }
      if (!captchaToken && process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY) {
        setError("Mohon selesaikan verifikasi captcha terlebih dahulu.");
        return;
      }
      setIsLoading(true);

      const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
        captchaToken: captchaToken || undefined,
      });
      setIsLoading(false);

      if (error) {
        setError(error.message);
        captchaRef.current?.resetCaptcha();
        setCaptchaToken(null);
        return;
      }

      setSuccessMsg("✦ Tautan reset kata sandi telah dikirim ke emailmu.");
      captchaRef.current?.resetCaptcha();
      setCaptchaToken(null);
    }
  };

  const setField = (k: keyof FormState) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const setFocus = (k: keyof FieldMeta, v: boolean) =>
    setFocused((p) => ({ ...p, [k]: v }));

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-[#0f0f0f]">
      {/* ── MOBILE TOP BANNER (fixed backdrop < md) ──────────────────── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 md:hidden z-0 opacity-40"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&q=80&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(15,15,15,0.1) 0%, rgba(15,15,15,0.85) 75%, #0f0f0f 100%)",
          }}
        />
      </div>

      {/* ── LEFT PANEL ────────────────────────────────────────────────── */}
      <div className="relative z-10 flex w-full flex-col justify-between overflow-y-auto bg-transparent md:bg-[#0f0f0f] px-6 py-8 md:w-[48%] md:px-12 xl:px-16 min-h-screen">
        <NoiseSVG />

        {/* Ambient blobs */}
        <div
          className="pointer-events-none absolute -top-32 -left-24 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-12 h-64 w-64 rounded-full opacity-15 blur-3xl"
          style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 70%)" }}
        />

        {/* Back / Home link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative z-20"
        >
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-white/50 transition-colors duration-200 hover:text-white bg-black/30 md:bg-transparent px-3 py-1.5 md:p-0 rounded-full md:rounded-none backdrop-blur-md md:backdrop-blur-none border border-white/10 md:border-transparent w-fit"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5 text-violet-400 md:text-inherit" />
            Kembali ke Beranda
          </Link>
        </motion.div>

        {/* ── FORM CARD ────────────────────────────────────────────────── */}
        <motion.div
          className="mx-auto w-full max-w-sm my-auto py-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          {/* Glassmorphism card */}
          <div className="relative rounded-2xl border border-white/10 bg-zinc-950/80 md:bg-white/5 p-7 sm:p-8 shadow-2xl backdrop-blur-2xl">
            <NoiseSVG />

            {/* ─ Header ─ */}
            <div className="mb-7 text-center">
              <motion.div
                key={mode}
                className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 shadow-inner"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: "backOut" }}
              >
                {mode === "login" && <Lock className="h-5 w-5 text-violet-400" />}
                {mode === "register" && <Sparkles className="h-5 w-5 text-pink-400" />}
                {mode === "forgot" && <ShieldCheck className="h-5 w-5 text-amber-400" />}
              </motion.div>

              <h1 className="text-[21px] font-semibold leading-snug tracking-tight text-white/95">
                {mode === "login" && (
                  <>
                    Masuk ke{" "}
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                      Ekosistem
                    </span>
                  </>
                )}
                {mode === "register" && (
                  <>
                    Daftar{" "}
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">
                      Kreator Baru
                    </span>
                  </>
                )}
                {mode === "forgot" && (
                  <>
                    Atur Ulang{" "}
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                      Kata Sandi
                    </span>
                  </>
                )}
              </h1>

              {/* Soft glow line */}
              <div
                className="mx-auto mt-2 h-px w-20 rounded-full"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)",
                  boxShadow: "0 0 10px 1px rgba(167,139,250,0.3)",
                }}
              />

              <p className="mt-2.5 text-[12.5px] font-light leading-relaxed text-white/40">
                {mode === "login" && "Pintu masuk eksklusif para kreator digital pilihan."}
                {mode === "register" && "Mulai bagikan karya visual dan tulisan terbaikmu."}
                {mode === "forgot" && "Masukkan emailmu untuk menerima tautan pemulihan."}
              </p>
            </div>

            {/* ─ Success Message ─ */}
            <AnimatePresence>
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-center text-[12.5px] text-emerald-300 font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                  <span>{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─ Form ─ */}
            <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
              <AnimatePresence mode="popLayout">
                {/* Name field (only for register) */}
                {mode === "register" && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FloatingInput
                      id="name"
                      label="Nama Lengkap atau Kreator"
                      type="text"
                      value={form.name}
                      onChange={setField("name")}
                      onFocus={() => setFocus("name", true)}
                      onBlur={() => setFocus("name", false)}
                      isFocused={focused.name}
                      icon={<User className="h-4 w-4" />}
                      disabled={isLoading || !!successMsg}
                      autoComplete="name"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <FloatingInput
                id="email"
                label="Alamat Email"
                type="email"
                value={form.email}
                onChange={setField("email")}
                onFocus={() => setFocus("email", true)}
                onBlur={() => setFocus("email", false)}
                isFocused={focused.email}
                icon={<Mail className="h-4 w-4" />}
                disabled={isLoading || !!successMsg}
                autoComplete="email"
              />

              {/* Password (for login & register) */}
              <AnimatePresence mode="popLayout">
                {mode !== "forgot" && (
                  <motion.div
                    key="password-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FloatingInput
                      id="password"
                      label="Kata Sandi"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={setField("password")}
                      onFocus={() => setFocus("password", true)}
                      onBlur={() => setFocus("password", false)}
                      isFocused={focused.password}
                      icon={<Lock className="h-4 w-4" />}
                      disabled={isLoading || !!successMsg}
                      autoComplete="current-password"
                      rightSlot={
                        <button
                          type="button"
                          tabIndex={-1}
                          onClick={() => setShowPassword((v) => !v)}
                          className="text-white/30 transition-colors duration-150 hover:text-white/70 focus:outline-none p-1"
                          aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      }
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="text-[12px] text-rose-400/90 font-medium pl-1"
                  >
                    ⚠ {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Captcha Widget */}
              {process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY && (
                <div className="flex justify-center pt-2 pb-1">
                  <HCaptcha
                    ref={captchaRef}
                    sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
                    onVerify={(token) => {
                      setCaptchaToken(token);
                      setError(null);
                    }}
                    onExpire={() => setCaptchaToken(null)}
                    theme="dark"
                  />
                </div>
              )}

              {/* Forgot password link */}
              {mode === "login" && (
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => switchMode("forgot")}
                    className="text-[12px] font-light text-white/40 hover:text-violet-300 transition-colors underline-offset-2 hover:underline"
                  >
                    Lupa kata sandi?
                  </button>
                </div>
              )}

              {/* Submit button */}
              <div className="pt-2">
                <ShineButton isLoading={isLoading}>
                  {mode === "login" && "Masuk Sekarang"}
                  {mode === "register" && "Daftar Akun"}
                  {mode === "forgot" && "Kirim Link Reset"}
                </ShineButton>
              </div>
            </form>

            {/* ─ Divider ─ */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/8" />
              <span className="text-[10px] uppercase tracking-widest text-white/20 font-bold">opsi lain</span>
              <div className="h-px flex-1 bg-white/8" />
            </div>

            {/* Switch mode links */}
            <div className="text-center text-[12.5px] text-white/40 font-light">
              {mode === "login" ? (
                <p>
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("register")}
                    className="font-semibold text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2"
                  >
                    Daftarkan diri
                  </button>
                </p>
              ) : (
                <p>
                  Sudah punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("login")}
                    className="font-semibold text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2"
                  >
                    Masuk di sini
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* Fine print below card */}
          <p className="mt-4 text-center text-[11px] leading-relaxed text-white/25">
            Dengan masuk, kamu menyetujui{" "}
            <button
              type="button"
              onClick={() => setModalContent("terms")}
              className="underline underline-offset-2 hover:text-white/60 transition-colors text-white/40"
            >
              Syarat Layanan
            </button>{" "}
            &amp;{" "}
            <button
              type="button"
              onClick={() => setModalContent("privacy")}
              className="underline underline-offset-2 hover:text-white/60 transition-colors text-white/40"
            >
              Kebijakan Privasi
            </button>{" "}
            kami.
          </p>
        </motion.div>

        {/* Bottom brand mark */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center text-[10px] uppercase tracking-[0.2em] text-white/15 relative z-10"
        >
          ✦ &nbsp;Studio Digital Premium &nbsp;✦
        </motion.p>
      </div>

      {/* ── RIGHT PANEL — Cinematic Visual ───────────────────────────── */}
      <div className="relative hidden flex-1 overflow-hidden md:flex">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1400&q=90&fit=crop"
            alt="Cinematic webtoon art"
            className="h-full w-full object-cover object-center"
            draggable={false}
          />
        </motion.div>

        {/* Left-edge dark gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, #0f0f0f 0%, rgba(15,15,15,0.75) 18%, rgba(15,15,15,0.1) 45%, transparent 100%)",
          }}
        />

        {/* Top & bottom gradients */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(15,15,15,0.6) 0%, transparent 30%, transparent 60%, rgba(15,15,15,0.85) 100%)",
          }}
        />

        {/* Colour toning */}
        <div className="absolute inset-0 bg-violet-950/20 mix-blend-color" />

        {/* Overlaid Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-10 xl:p-14">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="self-end"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 text-[11px] uppercase tracking-widest text-white/60 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.6)]" />
              Platform Aktif
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-sm"
          >
            <motion.div
              className="mb-4 h-px w-10 rounded-full bg-violet-400/80"
              initial={{ width: 0 }}
              animate={{ width: 40 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            />

            <h2 className="text-[28px] font-bold leading-tight tracking-tight text-white/95 xl:text-[34px]">
              Dunia Kreator
              <br />
              <span
                style={{
                  backgroundImage: "linear-gradient(90deg, #a78bfa, #f0abfc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Dimulai di Sini.
              </span>
            </h2>

            <p className="mt-3 max-w-xs text-[13.5px] font-light leading-relaxed text-white/50">
              Bergabunglah dengan ribuan seniman dan penulis cerita visual
              terbaik Asia yang membangun warisan mereka bersama kami.
            </p>

            <motion.div
              className="mt-5 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="flex -space-x-2.5">
                {[
                  "photo-1507003211169-0a1dd7228f2d",
                  "photo-1531746020798-e6953c6e8e04",
                  "photo-1438761681033-6461ffad8d80",
                  "photo-1472099645785-5658abf4ff4e",
                ].map((id, i) => (
                  <div
                    key={id}
                    className="h-7 w-7 overflow-hidden rounded-full border-2 border-[#0f0f0f]"
                    style={{ zIndex: 4 - i }}
                  >
                    <img
                      src={`https://images.unsplash.com/${id}?w=60&h=60&fit=crop&crop=face`}
                      alt="creator avatar"
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
              <span className="text-[12px] font-light text-white/40">
                +14.200 kreator bergabung
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── INTERACTIVE TERMS / PRIVACY MODAL ────────────────────────── */}
      <AnimatePresence>
        {modalContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setModalContent(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl border border-white/15 bg-zinc-900 p-6 shadow-2xl text-white"
            >
              <button
                onClick={() => setModalContent(null)}
                className="absolute right-4 top-4 rounded-lg p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2 text-violet-400 mb-3">
                <FileText size={18} />
                <h3 className="font-semibold text-base">
                  {modalContent === "terms" ? "Syarat Layanan KakRahma.id" : "Kebijakan Privasi"}
                </h3>
              </div>

              <div className="text-xs text-white/70 space-y-3 leading-relaxed max-h-60 overflow-y-auto pr-1 font-light">
                {modalContent === "terms" ? (
                  <>
                    <p>1. <strong>Penggunaan Platform:</strong> KakRahma.id disediakan sebagai ruang publik digital bagi kreator dan pembaca untuk berbagi cerita, ilustrasi, dan artikel secara positif.</p>
                    <p>2. <strong>Hak Cipta Karya:</strong> Seluruh karya (Webtoon, Foto Esai, Jurnal) yang dipublikasikan tetap menjadi hak milik intelektual kreator masing-masing.</p>
                    <p>3. <strong>Akses Admin:</strong> Penggunaan panel admin terbatas pada personel yang berwenang. Setiap tindakan pencatatan dan perubahan data tunduk pada audit sistem.</p>
                  </>
                ) : (
                  <>
                    <p>1. <strong>Perlindungan Data:</strong> Kami menjaga kerahasiaan alamat email, kredensial login, dan data pribadi yang kamu masukkan di dalam sistem kami.</p>
                    <p>2. <strong>Penggunaan Cookie:</strong> Platform menggunakan sesi otentikasi terenkripsi (Supabase Auth) untuk memastikan kenyamanan dan keamanan login kamu.</p>
                    <p>3. <strong>Non-Distribusi:</strong> Kami tidak pernah menjual atau membagikan data pribadi kamu kepada pihak ketiga mana pun.</p>
                  </>
                )}
              </div>

              <button
                onClick={() => setModalContent(null)}
                className="mt-5 w-full rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 py-2.5 text-xs font-semibold text-white transition-colors"
              >
                Mengerti &amp; Tutup
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}