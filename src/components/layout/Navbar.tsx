"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowRight,
  GraduationCap,
  Globe,
  Images,
  BookOpen,
  UserCheck,
  ExternalLink,
  Zap,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { BRANDING } from "@/config/branding";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          if (data.session) {
            setSession(data.session);
          }
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      }
    };
    fetchSession();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Program", href: "/program" },
    { name: "Galeri", href: "/galeri" },
    { name: "Alur Seleksi", href: "/ppdb" },
    { name: "Kontak", href: "/kontak" },
  ];

  const handleNavClick = (e: any, href: string, closeMenu?: () => void) => {
    e.preventDefault();
    if (closeMenu) closeMenu();
    
    const host = window.location.hostname;
    const isPpdbHost = host.startsWith("ppdb.");
    const isPpdbRoute = href.startsWith("/ppdb") || href.startsWith("/login") || href.startsWith("/dashboard") || href.startsWith("/daftar");
    
    if (isPpdbHost) {
      if (isPpdbRoute) {
        let target = href;
        if (target.startsWith("/ppdb")) {
          target = target.replace("/ppdb", "/");
          if (target === "") target = "/";
        }
        if (target.includes("#") && pathname === target.split("#")[0]) {
           const id = target.split("#")[1];
           document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        } else {
           window.location.href = target;
        }
      } else {
        const mainDomain = host.replace("ppdb.", "");
        const port = window.location.port ? `:${window.location.port}` : "";
        window.location.href = `${window.location.protocol}//${mainDomain}${port}${href}`;
      }
    } else {
      if (isPpdbRoute) {
        window.location.href = href;
      } else {
        window.location.href = href;
      }
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-xl"
    >
      {/* ── 1. MAIN NAVBAR ROW ── */}
      <div className="bg-primary-950/95 backdrop-blur-md border-b border-primary-800/80 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 xl:gap-4">
          {/* LOGO & BRAND */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-primary-900 border border-primary-700 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
              <Image
                src={BRANDING.logoPath}
                alt={BRANDING.schoolShortName}
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-white text-base leading-tight tracking-tight group-hover:text-emerald-300 transition-colors">
                Al-Andalus Putra
              </div>
              <div className="text-[11px] font-bold text-amber-300 tracking-wide drop-shadow-sm">
                PPDB Online 2027/2028
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-primary-900/60 p-1 xl:p-1.5 rounded-xl border border-primary-800 shrink-0">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`px-2.5 xl:px-4 py-1.5 xl:py-2 rounded-xl text-xs xl:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-primary-600 text-white font-bold shadow-md shadow-primary-500/20"
                      : "text-slate-300 hover:text-white hover:bg-primary-800/80"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* RIGHT ACTION BUTTONS */}
          <div className="hidden md:flex items-center gap-2 shrink-0 ml-auto">
            {/* External Link to Main Corporate Website */}
            <a
              href="https://pesantren-alandalus.com"
              target="_blank"
              rel="noreferrer"
              className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-900/90 hover:bg-primary-800 border border-primary-700 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm shrink-0"
              title="Kunjungi Website Utama Pesantren Al-Andalus"
            >
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>Web Utama</span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            {/* Session check: Login or Dashboard */}
            {session ? (
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="/dashboard"
                  onClick={(e) => handleNavClick(e, "/dashboard")}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-1.5 transition-all shrink-0"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Masuk ke Akun</span>
                </a>
                <a
                  href="/ppdb"
                  onClick={(e) => handleNavClick(e, "/ppdb")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all border border-amber-200 shrink-0"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Daftar PPDB</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="/login"
                  onClick={(e) => handleNavClick(e, "/login")}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition-colors shrink-0"
                >
                  Masuk
                </a>
                <a
                  href="/ppdb"
                  onClick={(e) => handleNavClick(e, "/ppdb")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-xs shadow-md hover:scale-105 active:scale-95 transition-all border border-amber-200 shrink-0"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Daftar PPDB</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* Language Switcher */}
            <div className="border-l border-primary-800 pl-2 shrink-0">
              <LanguageSwitcher />
            </div>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-primary-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-primary-950 border-b border-primary-800 px-4 pt-2 pb-6 space-y-3"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href, () => setIsMenuOpen(false))}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary-600 text-white font-bold"
                        : "text-slate-300 hover:text-white hover:bg-primary-900"
                    }`}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>

            <div className="pt-3 border-t border-primary-900 flex flex-col gap-2">
              <a
                href="https://pesantren-alandalus.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-primary-900 border border-primary-800 text-xs font-semibold text-slate-300 hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-300" />
                  <span>Kunjungi Website Utama</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              {session ? (
                <div className="flex flex-col gap-2">
                  <a
                    href="/dashboard"
                    onClick={(e) => handleNavClick(e, "/dashboard", () => setIsMenuOpen(false))}
                    className="w-full text-center px-4 py-2.5 rounded-xl font-bold bg-white/10 text-white text-sm"
                  >
                    Masuk ke Akun
                  </a>
                  <a
                    href="/ppdb"
                    onClick={(e) => handleNavClick(e, "/ppdb", () => setIsMenuOpen(false))}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 text-slate-950 font-black text-sm shadow-md"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Daftar PPDB</span>
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <a
                    href="/login"
                    onClick={(e) => handleNavClick(e, "/login", () => setIsMenuOpen(false))}
                    className="w-full text-center px-4 py-2.5 rounded-xl font-bold text-slate-300 hover:text-white text-sm"
                  >
                    Masuk
                  </a>
                  <a
                    href="/ppdb"
                    onClick={(e) => handleNavClick(e, "/ppdb", () => setIsMenuOpen(false))}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 text-slate-950 font-black text-sm shadow-md"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Daftar PPDB</span>
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

