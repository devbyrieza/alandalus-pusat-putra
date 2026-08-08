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
    { name: "Beranda PPDB", href: "/" },
    { name: "Alur PPDB", href: "/ppdb" },
    { name: "Program & Biaya", href: "/program" },
    { name: "Galeri Pesantren", href: "/galeri" },
    { name: "Kontak Panitia", href: "/kontak" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-xl py-3"
          : "bg-gradient-to-b from-slate-950/80 to-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LOGO & BRAND */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
            <Image
              src={BRANDING.logoPath}
              alt={BRANDING.schoolShortName}
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <div className="font-extrabold text-white text-base leading-tight tracking-tight group-hover:text-emerald-400 transition-colors">
              PPDB {BRANDING.schoolShortName}
            </div>
            <div className="text-[11px] font-semibold text-slate-400">
              {BRANDING.schoolName.includes("Putri") ? "Pesantren Putri" : "Pesantren Putra"}
            </div>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                }`}
              >
                {link.name}
              </Link>
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
            title="Kunjungi Website Utama Pesantren Al-Andalus"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>Web Utama</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          {/* Session check: Login or Dashboard */}
          {session ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
            >
              <UserCheck className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
              >
                <span>Daftar PPDB</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
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
            className="lg:hidden bg-slate-950 border-b border-slate-800 overflow-hidden px-4 py-6 space-y-4 shadow-2xl"
          >
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-slate-300 font-medium hover:bg-slate-900 hover:text-white"
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://pesantren-alandalus.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl text-emerald-400 font-medium bg-emerald-950/40 border border-emerald-800/40"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Kunjungi Website Utama (pesantren-alandalus.com)
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </nav>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <Link
                href="/daftar"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-lg"
              >
                Daftar PPDB Online Sekarang
              </Link>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm"
              >
                Masuk Akun Santri / Wali
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
