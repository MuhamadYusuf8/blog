"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, Menu, X, User, Archive, Mail, Lock, ChevronDown } from "lucide-react";

const NAV_LINKS = [
  { label: "Beranda",  href: "/" },
  { label: "Desain",   href: "/desain" },
  { label: "Jurnal",   href: "/jurnal" },
  { label: "Tutorial", href: "/tutorial" },
];

const NAV_MORE = [
  { label: "Tentang",      href: "/about",       icon: User },
  { label: "Arsip",        href: "/archive",     icon: Archive },
  { label: "Kontak",       href: "/kontak",      icon: Mail },
  { label: "Admin Portal", href: "/admin/login", icon: Lock },
];

export function PublicNavbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close search on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    const categorySlug = href.replace("/", "").toLowerCase();
    return (
      pathname === href ||
      pathname.startsWith(href + "/") ||
      pathname === `/category/${categorySlug}` ||
      pathname.startsWith(`/category/${categorySlug}/`)
    );
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-4 px-4 pointer-events-none">
      {/* ── Floating Pill ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`pointer-events-auto w-full max-w-3xl transition-all duration-500 ${
          scrolled || menuOpen
            ? "rounded-2xl bg-zinc-950/85 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/60"
            : "rounded-2xl bg-black/40 backdrop-blur-xl border border-white/8"
        }`}
      >
        <div className="h-14 px-3 flex items-center justify-between gap-2 relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 pl-1">
            <div
              className="relative w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}
            >
              <BookOpen size={15} className="text-white relative z-10" />
              <div
                className="absolute inset-0 rounded-xl blur-md opacity-70"
                style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}
              />
            </div>
            <span className="font-extrabold text-[14px] tracking-tight text-white hidden sm:block">
              Rahma
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg,#a78bfa,#f472b6)" }}
              >
                yolan
              </span>
            </span>
          </Link>

          {/* Center nav links (Main Pages + Categories) */}
          <div className={`hidden md:flex items-center gap-0.5 mx-auto transition-all duration-300 origin-center ${
            searchOpen ? "opacity-0 pointer-events-none scale-95 w-0 overflow-hidden" : "opacity-100 scale-100"
          }`}>
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={label}
                  href={href}
                  className={`relative px-3.5 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                    active ? "text-white" : "text-white/45 hover:text-white/80"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="public-nav-pill"
                      className="absolute inset-0 rounded-xl bg-white/10 border border-white/12"
                      transition={{ type: "spring", stiffness: 450, damping: 38 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
            
            {/* Hover Dropdown for NAV_MORE (Lainnya) */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <button
                className={`relative px-3.5 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-200 flex items-center gap-1 cursor-pointer select-none ${
                  NAV_MORE.some(({ href }) => isActive(href))
                    ? "text-white"
                    : "text-white/45 hover:text-white/80"
                }`}
              >
                {NAV_MORE.some(({ href }) => isActive(href)) && (
                  <motion.span
                    layoutId="public-nav-pill"
                    className="absolute inset-0 rounded-xl bg-white/10 border border-white/12"
                    transition={{ type: "spring", stiffness: 450, damping: 38 }}
                  />
                )}
                <span className="relative z-10">Lainnya</span>
                <ChevronDown
                  size={12}
                  className={`relative z-10 transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180 text-white" : "text-white/40 group-hover:text-white/80"
                  }`}
                />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-44 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-1.5 shadow-2xl flex flex-col gap-0.5 z-50 pointer-events-auto"
                  >
                    {NAV_MORE.map(({ label, href, icon: Icon }) => {
                      const active = isActive(href);
                      return (
                        <Link
                          key={label}
                          href={href}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[12.5px] font-medium transition-all ${
                            active
                              ? "bg-white/10 text-white border border-white/8"
                              : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                          }`}
                        >
                          <Icon size={13} className={active ? "text-violet-400" : "text-white/30"} />
                          <span>{label}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5 pr-1" ref={searchRef}>
            {/* Animated search form */}
            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  onSubmit={handleSearchSubmit}
                  key="sb"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: mounted && isMobile ? 140 : 220, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  className="absolute right-[136px] max-md:right-[88px] top-1/2 -translate-y-1/2 z-20 overflow-hidden pointer-events-auto"
                >
                  <div className="relative w-full" style={{ width: mounted && isMobile ? 140 : 220 }}>
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                    <input
                      autoFocus
                      value={searchVal}
                      onChange={(e) => setSearchVal(e.target.value)}
                      placeholder="Cari artikel..."
                      className="w-full bg-white/8 border border-white/12 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/25 outline-none focus:border-violet-400/50 transition-all"
                    />
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <button
              onClick={() => setSearchOpen((v) => !v)}
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-200 pointer-events-auto ${
                searchOpen
                  ? "bg-violet-500/20 text-violet-300"
                  : "text-white/40 hover:text-white hover:bg-white/8"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {searchOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.12 }}>
                    <X size={14} />
                  </motion.span>
                ) : (
                  <motion.span key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.12 }}>
                    <Search size={14} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* CTA */}
            <Link href="/archive" className="hidden md:block pointer-events-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex relative overflow-hidden text-white text-[12px] font-bold px-4 py-1.5 rounded-xl shadow-md shadow-violet-900/40"
                style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}
              >
                <span className="relative z-10">Jelajahi</span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
                  initial={{ x: "-120%" }}
                  animate={{ x: "220%" }}
                  transition={{ repeat: Infinity, repeatDelay: 3.5, duration: 0.6 }}
                />
              </motion.button>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden w-8 h-8 flex items-center justify-center rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all pointer-events-auto"
            >
              <AnimatePresence mode="wait" initial={false}>
                {menuOpen ? (
                  <motion.span key="mx" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.12 }}>
                    <X size={14} />
                  </motion.span>
                ) : (
                  <motion.span key="mm" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.12 }}>
                    <Menu size={14} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Dropdown ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-auto w-full max-w-3xl mt-2 rounded-2xl bg-zinc-950/95 backdrop-blur-3xl border border-white/10 shadow-2xl shadow-black/70 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {/* Search */}
              <form onSubmit={handleSearchSubmit} className="relative mb-2">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                <input
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Cari artikel..."
                  className="w-full bg-white/5 border border-white/8 rounded-xl pl-8 pr-3 py-2 text-sm text-white placeholder-white/25 outline-none focus:border-violet-500/40 transition-all"
                />
              </form>

              {/* Main nav */}
              {NAV_LINKS.map(({ label, href }, i) => {
                const active = isActive(href);
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {label}
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Divider */}
              <div className="h-px bg-white/8 my-1" />

              {/* More pages */}
              {NAV_MORE.map(({ label, href, icon: Icon }, i) => {
                const active = isActive(href);
                return (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.16 + i * 0.04 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon size={14} className="text-white/30" />
                      {label}
                    </Link>
                  </motion.div>
                );
              })}

              <Link
                href="/archive"
                onClick={() => setMenuOpen(false)}
                className="mt-1 w-full py-2.5 rounded-xl text-sm font-bold text-white text-center"
                style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}
              >
                Jelajahi Semua Artikel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
