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

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/tentang", label: "Tentang" },
    { href: "/program", label: "Program" },
    { href: "/fasilitas", label: "Fasilitas" },
    { href: "/berita", label: "Berita" },
    { href: "/kontak", label: "Kontak" },
  ];

  const isActive = (path: string) => pathname === path;

  const primaryColor = IS_PUTRA ? "text-primary-600" : "text-sky-600";
  const primaryBg = IS_PUTRA ? "bg-primary-600" : "bg-sky-600";
  const primaryBgHover = IS_PUTRA ? "hover:bg-primary-700" : "hover:bg-sky-700";
  const primaryShadow = IS_PUTRA ? "shadow-primary-500/30" : "shadow-sky-500/30";

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
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center p-1 border border-slate-100 overflow-hidden">
                <Image
                  src={BRANDING.logoPath}
                  alt="Logo Al-Andalus"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base text-slate-900 tracking-tight leading-tight">
                  {BRANDING.schoolShortName}
                </span>
                <span
                  className={`text-[10px] font-bold tracking-widest uppercase ${primaryColor}`}
                >
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
                      ? `${primaryColor} bg-primary-50`
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
                className={`px-5 py-2.5 text-white text-sm font-bold rounded-xl ${primaryBg} ${primaryBgHover} shadow-lg ${primaryShadow} transition-all hover:-translate-y-0.5`}
              >
                PPDB Online
              </Link>
            </div>

            {/* Mobile: Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
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

        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-300 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <span className="font-black text-slate-900">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? `${primaryColor} bg-primary-50`
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </nav>

          <div className="p-4 space-y-3 border-t border-slate-100 mt-4">
            <Link
              href="/login"
              className="flex w-full items-center justify-center px-5 py-3 rounded-2xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              Masuk / Login
            </Link>
            <Link
              href="/daftar"
              className={`flex w-full items-center justify-center px-5 py-3 rounded-2xl text-sm font-bold text-white ${primaryBg} ${primaryBgHover} shadow-lg ${primaryShadow} transition-all`}
            >
              Daftar PPDB Online
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
