"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRANDING, IS_PUTRA } from "@/config/branding";
import { useState, useEffect } from "react";
import { Menu, X, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/tentang", label: "Tentang" },
    { href: "/program", label: "Program" },
    { href: "/fasilitas", label: "Fasilitas" },
    { href: "/berita", label: "Berita" },
    { href: "/kontak", label: "Kontak" },
  ];

  const isActive = (path: string) => pathname === path;

  // Hardcoded hex colors to avoid dynamic class issues
  const primaryTextClass   = IS_PUTRA ? "text-[#064e3b]"  : "text-[#0284c7]";
  const primaryBgClass     = IS_PUTRA ? "bg-[#064e3b]"    : "bg-[#0284c7]";
  const primaryBgHover     = IS_PUTRA ? "hover:bg-[#022c22]" : "hover:bg-[#0369a1]";
  const primaryBgLightClass = IS_PUTRA ? "bg-[#ecfdf5]"   : "bg-[#e0f2fe]";
  const primaryShadow      = IS_PUTRA ? "shadow-emerald-500/30" : "shadow-sky-500/30";

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm"
            : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[64px] sm:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-white shadow-sm flex items-center justify-center p-1 border border-slate-100 overflow-hidden">
                <Image
                  src={BRANDING.logoPath}
                  alt="Logo Al-Andalus"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-sm sm:text-base text-slate-900 tracking-tight leading-tight">
                  {BRANDING.schoolShortName}
                </span>
                <span className={`text-[9px] sm:text-[10px] font-bold tracking-widest uppercase ${primaryTextClass}`}>
                  Pesantren Islam Internasional
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive(link.href)
                      ? `${primaryTextClass} ${primaryBgLightClass}`
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 transition"
              >
                Masuk
              </Link>
              <Link
                href="/daftar"
                className={`px-5 py-2.5 text-white text-sm font-bold rounded-xl ${primaryBgClass} ${primaryBgHover} shadow-lg ${primaryShadow} transition-all hover:-translate-y-0.5`}
              >
                PPDB Online
              </Link>
            </div>

            {/* Mobile: Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-colors ${
                isOpen
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              aria-label={isOpen ? "Tutup menu" : "Buka menu navigasi"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer — slides from RIGHT */}
        <div
          className={`absolute top-0 right-0 h-full w-[280px] sm:w-[300px] bg-white shadow-2xl transition-transform duration-300 flex flex-col ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header — with Brand */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white shadow-sm border border-slate-100 overflow-hidden p-1 shrink-0">
                <Image
                  src={BRANDING.logoPath}
                  alt="Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="font-black text-sm text-slate-900 leading-tight">
                  {BRANDING.schoolShortName}
                </p>
                <p className={`text-[9px] font-bold tracking-widest uppercase ${primaryTextClass}`}>
                  Menu Navigasi
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? `${primaryTextClass} ${primaryBgLightClass}`
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
                <ChevronRight className={`w-4 h-4 ${isActive(link.href) ? primaryTextClass : "text-slate-300"}`} />
              </Link>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div className="p-4 space-y-3 border-t border-slate-100 shrink-0">
            <Link
              href="/login"
              className="flex w-full items-center justify-center px-5 py-3 rounded-2xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              Masuk / Login
            </Link>
            <Link
              href="/daftar"
              className={`flex w-full items-center justify-center px-5 py-3 rounded-2xl text-sm font-bold text-white ${primaryBgClass} ${primaryBgHover} shadow-lg ${primaryShadow} transition-all`}
            >
              Daftar PPDB Online
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
