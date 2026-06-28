"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, FileText, PenLine, MessageSquare, Layers, BarChart2,
  Star, Settings, Image, Sparkles, LogOut, ChevronDown, Menu, X, Globe,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AdminPageTransition } from "@/components/admin/AdminPageTransition";

const NAV_ITEMS = [
  { icon: Home,          label: "Dashboard",  href: "/admin" },
  { icon: FileText,      label: "Semua Post", href: "/admin/posts" },
  { icon: PenLine,       label: "Tulis Post", href: "/admin/posts/new" },
  { icon: MessageSquare, label: "Komentar",   href: "/admin/comments", isComments: true },
  { icon: Image,         label: "Media",      href: "/admin/media" },
  { icon: Layers,        label: "Halaman",    href: "/admin/pages" },
  { icon: BarChart2,     label: "Analitik",   href: "/admin/analytics" },
  { icon: Star,          label: "Featured",   href: "/admin/featured" },
  { icon: Settings,      label: "Pengaturan", href: "/admin/settings" },
];

function AuroraBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      <motion.div
        className="absolute rounded-full"
        style={{ width: 600, height: 600, top: -200, right: -100, background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)", filter: "blur(40px)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{ width: 500, height: 500, bottom: -150, left: -100, background: "radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)", filter: "blur(50px)" }}
        animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`, backgroundSize: "48px 48px" }} />
    </div>
  );
}

// ─── Nav Item (extracted to avoid hooks-in-loop) ─────────────────────────────
function NavItem({
  item, collapsed, pendingCommentCount, onNavigate, onDrawerClose,
}: {
  item: (typeof NAV_ITEMS)[0];
  collapsed: boolean;
  pendingCommentCount: number;
  onNavigate: (href: string) => void;
  onDrawerClose?: () => void;
}) {
  const pathname = usePathname();
  let isActive = false;
  if (item.href === "/admin") {
    isActive = pathname === "/admin";
  } else if (item.href === "/admin/posts") {
    isActive = pathname === "/admin/posts" || (pathname.startsWith("/admin/posts/") && !pathname.startsWith("/admin/posts/new"));
  } else {
    isActive = pathname.startsWith(item.href);
  }
  const badge = item.isComments ? pendingCommentCount : 0;

  function handleClick() {
    onDrawerClose?.();
    if (item.href !== pathname) onNavigate(item.href);
  }

  const Icon = item.icon;
  return (
    <button
      onClick={handleClick}
      className="relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all duration-200 text-left"
      style={{
        background: isActive ? "rgba(124,58,237,0.15)" : "transparent",
        border: isActive ? "1px solid rgba(124,58,237,0.25)" : "1px solid transparent",
      }}
    >
      {isActive && (
        <motion.div
          layoutId="adminActiveBar"
          className="absolute left-0 top-1/2 w-0.5 h-5 rounded-full"
          style={{ background: "linear-gradient(180deg, #7c3aed, #a78bfa)", transform: "translateY(-50%)", boxShadow: "0 0 8px rgba(124,58,237,0.6)" }}
        />
      )}
      <div className="relative flex-shrink-0">
        <Icon size={17} className={isActive ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300"} style={{ transition: "color 0.2s" }} />
        {badge > 0 && collapsed && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full text-white" style={{ background: "#f59e0b" }}>
            {badge > 99 ? "99+" : badge}
          </span>
        )}
      </div>
      <AnimatePresence>
        {!collapsed && (
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={`text-sm font-medium whitespace-nowrap flex-1 ${isActive ? "text-violet-300" : "text-slate-400 group-hover:text-slate-200"}`}
            style={{ transition: "color 0.2s" }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>
      {!collapsed && badge > 0 && (
        <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "#f59e0b" }}>{badge > 99 ? "99+" : badge}</span>
      )}
    </button>
  );
}

// ─── Main Shell ───────────────────────────────────────────────────────────────
export function AdminShell({ children, pendingCommentCount = 0 }: { children: React.ReactNode; pendingCommentCount?: number }) {
  const router = useRouter();
  const supabase = createClient();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isNavigating, startNavTransition] = useTransition();

  // Force dark background for admin — overrides any site_settings inline body style
  useEffect(() => {
    const prev = {
      bg: document.body.style.getPropertyValue('background-color'),
      img: document.body.style.getPropertyValue('background-image'),
      bgPrio: document.body.style.getPropertyPriority('background-color'),
      imgPrio: document.body.style.getPropertyPriority('background-image'),
    };
    document.body.style.setProperty('background-color', '#0a0a0f', 'important');
    document.body.style.setProperty('background-image', 'none', 'important');
    return () => {
      document.body.style.setProperty('background-color', prev.bg, prev.bgPrio);
      document.body.style.setProperty('background-image', prev.img, prev.imgPrio);
    };
  }, []);

  const handleLogout = async () => {
    setIsSigningOut(true);
    await supabase.auth.signOut();
    router.push("/admin/login");
  };


  // Navigate with shell-level transition (drives the progress bar)
  function navigate(href: string) {
    startNavTransition(() => router.push(href));
  }


  // Shared sidebar nav list
  const NavList = ({ mini = false, onDrawerClose }: { mini?: boolean; onDrawerClose?: () => void }) => (
    <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.href} item={item} collapsed={mini} pendingCommentCount={pendingCommentCount} onNavigate={navigate} onDrawerClose={onDrawerClose} />
      ))}
    </nav>
  );

  const ViewBlogLink = ({ mini = false }) => (
    <div className="px-3 py-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <a href="/" target="_blank" rel="noopener noreferrer"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl group transition-all duration-200"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Globe size={17} className="text-slate-500 group-hover:text-slate-300 flex-shrink-0" style={{ transition: "color 0.2s" }} />
        <AnimatePresence>
          {!mini && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-sm font-medium whitespace-nowrap text-slate-500 group-hover:text-slate-300"
              style={{ transition: "color 0.2s" }}
            >
              Lihat Blog
            </motion.span>
          )}
        </AnimatePresence>
      </a>
    </div>
  );

  const UserBlock = ({ mini = false }) => (
    <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <motion.div
        whileHover={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        className="flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 group"
        onClick={handleLogout}
        title="Keluar / Logout"
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
          style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)", boxShadow: "0 0 12px rgba(124,58,237,0.3)" }}
        >R</div>
        <AnimatePresence>
          {!mini && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">Rahma</p>
              <p className="text-xs text-slate-500 truncate">Administrator</p>
            </motion.div>
          )}
        </AnimatePresence>
        {!mini && (
          isSigningOut
            ? <div className="w-4 h-4 border-2 border-slate-600 border-t-rose-400 rounded-full animate-spin flex-shrink-0" />
            : <LogOut size={14} className="text-slate-500 group-hover:text-rose-400 transition-colors flex-shrink-0" />
        )}
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0a0f", color: "#f8fafc", fontFamily: "'Inter', system-ui, sans-serif", position: "relative" }}>
      <AuroraBackground />

      {/* ── Desktop Sidebar ───────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 overflow-hidden z-20"
        style={{ background: "rgba(10,10,15,0.8)", backdropFilter: "blur(24px)", borderRight: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Brand + collapse toggle */}
        <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <motion.div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 24px rgba(124,58,237,0.4)" }}
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles size={16} className="text-white" />
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="overflow-hidden">
                <p className="text-sm font-bold text-slate-50 whitespace-nowrap tracking-wide">KREATOR</p>
                <p className="text-xs text-slate-500 whitespace-nowrap">Admin Panel</p>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={() => setCollapsed((v) => !v)} className="ml-auto flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-slate-500 hover:text-slate-300 transition-colors">
            <ChevronDown size={14} style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(90deg)", transition: "transform 0.3s" }} />
          </button>
        </div>

        <NavList mini={collapsed} />
        <ViewBlogLink mini={collapsed} />
        <UserBlock mini={collapsed} />
      </motion.aside>

      {/* ── Mobile Drawer ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full w-64 z-50 lg:hidden flex flex-col"
              style={{ background: "rgba(12,12,18,0.97)", backdropFilter: "blur(24px)", borderRight: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
                    <Sparkles size={14} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-slate-50">KREATOR</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="text-slate-500 hover:text-slate-300"><X size={18} /></button>
              </div>
              <NavList onDrawerClose={() => setMobileOpen(false)} />
              <div className="p-4 space-y-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <a href="/" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-400 text-sm"
                  style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <Globe size={16} /><span>Lihat Blog</span>
                </a>
                <button onClick={() => { setMobileOpen(false); handleLogout(); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-300 text-sm font-medium"
                  style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  <LogOut size={16} /><span>Keluar / Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 relative" style={{ zIndex: 1 }}>
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-30"
          style={{ background: "rgba(10,10,15,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 16px rgba(124,58,237,0.4)" }}>
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold text-slate-50 tracking-wide">KREATOR</span>
          </div>
          <button onClick={() => setMobileOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <Menu size={16} />
          </button>
        </div>

        {/* Navigation progress bar */}
        <AnimatePresence>
          {isNavigating && (
            <motion.div
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: 0.85 }}
              exit={{ scaleX: 1, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[100]"
              style={{ background: "linear-gradient(90deg, #7c3aed, #a78bfa, #ec4899)" }}
            />
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
            <AdminPageTransition>
              {children}
            </AdminPageTransition>
          </div>
        </main>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.3); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(124,58,237,0.5); }
      `}</style>
    </div>
  );
}
