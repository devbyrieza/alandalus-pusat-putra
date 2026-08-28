import { BRANDING, IS_PUTRA } from "@/config/branding";
import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { FaInstagram, FaYoutube, FaFacebook, FaTiktok } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { HiAcademicCap } from "react-icons/hi2";
import { PiHandHeartBold } from "react-icons/pi";

export default function Footer() {
  const primaryColor  = IS_PUTRA ? "text-primary-400"  : "text-sky-400";
  const primaryBg     = IS_PUTRA ? "bg-primary-600"     : "bg-sky-600";
  const primaryBgHov  = IS_PUTRA ? "hover:bg-primary-700" : "hover:bg-sky-700";

  return (
    <footer className="bg-andalus-green-950 border-t border-andalus-green-800 text-slate-400">

      {/* Main Footer Grid */}
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

            {/* Social Media Icons */}
            <div className="flex gap-3">
              {[
                { href: BRANDING.contact.instagram, Icon: FaInstagram, label: "Instagram" },
                { href: BRANDING.contact.youtube,   Icon: FaYoutube,   label: "YouTube"   },
                { href: BRANDING.contact.facebook,  Icon: FaFacebook,  label: "Facebook"  },
                { href: BRANDING.contact.tiktok,    Icon: FaTiktok,    label: "TikTok"    },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl bg-andalus-green-800 hover:bg-slate-700 flex items-center justify-center transition-colors group"
                >
                  <Icon className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigasi */}
          <div className="space-y-5">
            <h4 className="font-bold text-white text-sm uppercase tracking-widest">
              Navigasi
            </h4>
            <nav className="space-y-3">
              {[
                { href: "https://pesantren-alandalus.com/profile/", label: "Profil Pesantren", isExternal: true },
                { href: "/program", label: "Program Pendidikan" },
                { href: "/fasilitas", label: "Fasilitas"          },
                { href: "/kegiatan",  label: "Kegiatan"           },
                { href: "/galeri",    label: "Galeri"             },
                { href: "/berita",    label: "Berita & Pengumuman"},
                { href: "/kontak",    label: "Kontak"             },
              ].map(({ href, label, isExternal }) => (
                <Link
                  key={href}
                  href={href}
                  target={isExternal || href.startsWith("http") ? "_blank" : undefined}
                  rel={isExternal || href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-200 transition-colors group"
                >
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Kontak */}
          <div className="space-y-5">
            <h4 className="font-bold text-white text-sm uppercase tracking-widest">
              Hubungi Kami
            </h4>
            <div className="space-y-4">
              <a
                href={`https://wa.me/${BRANDING.contact.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-slate-500 hover:text-slate-200 transition-colors group"
              >
                <div className="w-9 h-9 rounded-xl bg-green-600/20 flex items-center justify-center shrink-0">
                  <FaWhatsapp className="w-4 h-4 text-green-400" />
                </div>
                <span className="group-hover:underline">{BRANDING.contact.whatsapp}</span>
              </a>

              <a
                href={`mailto:${BRANDING.email}`}
                className="flex items-center gap-3 text-sm text-slate-500 hover:text-slate-200 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-andalus-green-800 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <span>{BRANDING.email}</span>
              </a>

              <div className="flex items-start gap-3 text-sm text-slate-500">
                <div className="w-9 h-9 rounded-xl bg-andalus-green-800 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <span className="leading-relaxed">{BRANDING.contact.address}</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/ppdb"
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold ${primaryBg} ${primaryBgHov} transition-all mt-2`}
            >
              <HiAcademicCap className="w-4 h-4" />
              Daftar SPMB Online
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-andalus-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} {BRANDING.schoolName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/ppdb"  className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Info SPMB</Link>
            <Link href="/login" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">Login Santri</Link>
            <span className={`text-xs font-bold ${primaryColor} flex items-center gap-1`}>
              <PiHandHeartBold className="w-3.5 h-3.5" />
              Dibangun oleh Tim IT Al-Andalus
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

