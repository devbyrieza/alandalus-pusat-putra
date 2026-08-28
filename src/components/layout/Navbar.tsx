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
  Sparkles
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
    { name: "Program Pendidikan", href: "/program" },
    { name: "Galeri Pesantren", href: "/galeri" },
    { name: "Kontak Panitia", href: "/kontak" },
    { name: "Alur Seleksi", href: "/ppdb" },
  ];

  const handleNavClick = (e: any, href: string, closeMenu?: () => void) => {
    e.preventDefault();
    if (closeMenu) closeMenu();
    
    const host = window.location.hostname;
    const isPpdbHost = host.startsWith("ppdb.");
    const isPpdbRoute = href.startsWith("/ppdb") || href.startsWith("/login") || href.startsWith("/dashboard") || href.startsWith("/daftar");
    
    if (isPpdbHost) {
      if (isPpdbRoute) {
        // Subdomain -> Subdomain (SPA)
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
        // Subdomain -> Main Domain (Hard Redirect)
        const mainDomain = host.replace("ppdb.", "");
        const port = window.location.port ? `:${window.location.port}` : "";
        window.location.href = `${window.location.protocol}//${mainDomain}${port}${href}`;
      }
    } else {
      if (isPpdbRoute) {
        // Main Domain -> Subdomain (Hard Redirect to let Middleware catch it)
        window.location.href = href;
      } else {
        // Main Domain -> Main Domain (SPA or Hard navigation)
        window.location.href = href;
      }
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-andalus-green-950/95  border-b border-andalus-green-800 shadow-lg py-3"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LOGO & BRAND */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-andalus-green-900 border border-andalus-green-700 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
            <Image
              src={BRANDING.logoPath}
              alt={BRANDING.schoolShortName}
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <div className="font-extrabold text-white text-base leading-tight tracking-tight group-hover:text-andalus-gold-400 transition-colors">
              Al-Andalus Putra
            </div>
            <div className="text-[11px] font-bold text-amber-300 tracking-wide drop-shadow-sm">
              SPMB Online 2027/2028
            </div>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 p-1.5 rounded-xl border border-white/10 ">
          {navLinks.map((link) => {
            const normalizedPath = pathname === "/" ? "/ppdb" : pathname;
            const linkBase = link.href.split("#")[0];
            const isActive = normalizedPath === linkBase;
            
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-andalus-green-600 text-white font-bold shadow-md shadow-andalus-green-600/30"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* RIGHT ACTION BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          {/* External Link to Main Corporate Website */}
          <a
            href="https://pesantren-alandalus.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-andalus-green-900/90 hover:bg-andalus-green-800 border border-andalus-green-700 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
            title="Kunjungi Website Utama Pesantren Al-Andalus"
          >
            <Globe className="w-3.5 h-3.5 text-andalus-gold-400" />
            <span>Web Utama</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          {/* Session check: Login or Dashboard */}
          {session ? (
            <div className="flex items-center gap-3">
              <a
                href="/dashboard"
                onClick={(e) => handleNavClick(e, "/dashboard")}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center gap-1.5 transition-all"
              >
                <UserCheck className="w-4 h-4 text-emerald-300" />
                <span>Masuk ke Akun</span>
              </a>
              <a
                href="/ppdb"
                onClick={(e) => handleNavClick(e, "/ppdb")}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all border border-amber-300"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Daftar SPMB</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a
                href="/login"
                onClick={(e) => handleNavClick(e, "/login")}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-200 hover:text-white transition-colors"
              >
                Masuk
              </a>
              <a
                href="/ppdb"
                onClick={(e) => handleNavClick(e, "/ppdb")}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all border border-amber-300"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Daftar SPMB</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-andalus-green-900 border border-andalus-green-800 text-slate-300 hover:text-white"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-andalus-green-950 border-b border-andalus-green-800 overflow-hidden px-4 py-6 space-y-4 shadow-lg"
          >
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, () => setIsMenuOpen(false))}
                  className="block px-4 py-3 rounded-xl text-slate-300 font-medium hover:bg-andalus-green-900 hover:text-white"
                >
                  {link.name}
                </a>
              ))}
              <a
                href="https://pesantren-alandalus.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl text-andalus-gold-400 font-medium bg-andalus-green-950/40 border border-andalus-green-800/40"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Kunjungi Website Utama (pesantren-alandalus.com)
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </nav>

            <div className="pt-4 border-t border-andalus-green-800 flex flex-col gap-3">
              <a
                href="/ppdb"
                onClick={(e) => handleNavClick(e, "/ppdb", () => setIsMenuOpen(false))}
                className="w-full text-center py-3 rounded-xl bg-andalus-green-700 text-white font-bold text-sm shadow-lg"
              >
                Daftar SPMB Online Sekarang
              </a>
              <a
                href="/login"
                onClick={(e) => handleNavClick(e, "/login", () => setIsMenuOpen(false))}
                className="w-full text-center py-3 rounded-xl bg-andalus-green-900 border border-andalus-green-800 text-slate-300 font-semibold text-sm"
              >
                Masuk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

