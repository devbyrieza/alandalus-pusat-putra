import { BRANDING, IS_PUTRA } from "@/config/branding";
import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Youtube, Facebook } from "lucide-react";

export default function Footer() {
  const primaryColor = IS_PUTRA ? "text-primary-400" : "text-sky-400";
  const primaryBg = IS_PUTRA ? "bg-primary-600" : "bg-sky-600";

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h3 className="font-black text-white text-lg leading-tight">
                {BRANDING.schoolName}
              </h3>
              <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${primaryColor}`}>
                Jonggol, Kabupaten Bogor, Jawa Barat
              </p>
            </div>
            <p className="text-slate-500 leading-relaxed text-sm max-w-sm">
              {BRANDING.schoolTagline}. Berdiri sejak 2013, mencetak generasi 
              Muslim yang Rabbani, Cendekia, dan Mandiri melalui kurikulum TICE.
            </p>

            {/* Social Media */}
            <div className="flex gap-3">
              {[
                { href: BRANDING.contact.instagram, icon: Instagram, label: "Instagram" },
                { href: BRANDING.contact.youtube, icon: Youtube, label: "YouTube" },
                { href: BRANDING.contact.facebook, icon: Facebook, label: "Facebook" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-5">
            <h4 className="font-bold text-white text-sm uppercase tracking-widest">
              Navigasi
            </h4>
            <nav className="space-y-3">
              {[
                { href: "/tentang", label: "Tentang Pesantren" },
                { href: "/program", label: "Program TICE" },
                { href: "/fasilitas", label: "Fasilitas" },
                { href: "/kegiatan", label: "Kegiatan" },
                { href: "/galeri", label: "Galeri" },
                { href: "/berita", label: "Berita & Pengumuman" },
                { href: "/kontak", label: "Kontak" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-slate-500 hover:text-slate-200 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <h4 className="font-bold text-white text-sm uppercase tracking-widest">
              Hubungi Kami
            </h4>
            <div className="space-y-4">
              <a
                href={`https://wa.me/${BRANDING.contact.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-slate-500 hover:text-slate-200 transition-colors group"
              >
                <Phone className="w-4 h-4 mt-0.5 shrink-0 group-hover:text-green-400 transition-colors" />
                <span>{BRANDING.contact.whatsapp}</span>
              </a>
              <a
                href={`mailto:${BRANDING.email}`}
                className="flex items-start gap-3 text-sm text-slate-500 hover:text-slate-200 transition-colors"
              >
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{BRANDING.email}</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-slate-500">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-600" />
                <span className="leading-relaxed">{BRANDING.contact.address}</span>
              </div>
            </div>

            {/* PPDB CTA */}
            <Link
              href="/daftar"
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-white text-sm font-bold ${primaryBg} hover:opacity-90 transition-all mt-2`}
            >
              Daftar PPDB Online →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} {BRANDING.schoolName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/ppdb" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Info PPDB
            </Link>
            <Link href="/login" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Login Santri
            </Link>
            <span className={`text-xs font-bold ${primaryColor}`}>
              Dibangun dengan ❤️ oleh Tim IT Al-Andalus
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
