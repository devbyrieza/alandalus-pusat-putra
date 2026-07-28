"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRANDING, IS_PUTRA } from "@/config/branding";

export default function Navbar() {
  const pathname = usePathname();
  
  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/tentang", label: "Tentang" },
    { href: "/program", label: "Program" },
    { href: "/fasilitas", label: "Fasilitas" },
    { href: "/berita", label: "Berita" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed w-full z-50 glass border-b border-white/50 shadow-sm transition-all duration-300 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center p-1 border border-slate-100 overflow-hidden">
              <img src={BRANDING.logoPath} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg text-slate-800 tracking-tight leading-tight">{BRANDING.schoolShortName}</span>
              <span className={`text-[10px] font-bold tracking-widest uppercase ${IS_PUTRA ? "text-primary-600" : "text-sky-600"}`}>
                Pesantren Islam Internasional
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-semibold transition-colors ${isActive(link.href) ? (IS_PUTRA ? "text-primary-600" : "text-sky-600") : "text-slate-600 hover:text-slate-900"}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-2">
              <Link href="/daftar" className="px-5 py-2.5 text-white text-sm font-bold rounded-xl bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30 transition-all hover:-translate-y-0.5">
                PPDB Online
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
