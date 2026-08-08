"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Instagram,
  Facebook,
  Youtube,
  Clock,
  ArrowRight,
  Sparkles,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { BRANDING } from "@/config/branding";

export default function KontakPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-slate-50 min-h-screen py-16">
      <Container>
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>LAYANAN INFORMASI & KONTAK</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Kami Siap Membantu Anda
          </h1>

          <p className="text-slate-600 text-lg">
            Hubungi panitia PPDB & sekretariat {BRANDING.schoolName} untuk informasi pendaftaran, kunjungan pesantren, dan pertanyaan lainnya.
          </p>
        </div>

        {/* CONTACT CARDS GRID */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {/* ADDRESS */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto font-bold">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Alamat Kampus</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{BRANDING.address}</p>
          </div>

          {/* WHATSAPP / TELEPON */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center mx-auto font-bold">
              <Phone className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Customer Service / WA</h3>
            <p className="text-emerald-700 font-bold text-lg">{BRANDING.phone}</p>
            <p className="text-slate-400 text-xs">Senin - Sabtu: 08.00 - 16.00 WIB</p>
          </div>

          {/* EMAIL */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center mx-auto font-bold">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Email Resmi</h3>
            <p className="text-slate-700 font-semibold text-sm">{BRANDING.email}</p>
            <p className="text-slate-400 text-xs">Surat Menyurat & Kerjasama</p>
          </div>
        </div>

        {/* SOCIAL MEDIA & ACTION */}
        <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Ikuti Media Sosial Resmi</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href={BRANDING.igUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-semibold border border-pink-200 transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span>Instagram</span>
            </a>
            <a
              href={BRANDING.fbUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold border border-blue-200 transition-colors"
            >
              <Facebook className="w-5 h-5" />
              <span>Facebook</span>
            </a>
            <a
              href={BRANDING.ytUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold border border-red-200 transition-colors"
            >
              <Youtube className="w-5 h-5" />
              <span>YouTube</span>
            </a>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-4">
            <a
              href={`https://wa.me/${BRANDING.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg transition-all"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Chat WhatsApp Panitia</span>
            </a>
          </div>
        </div>
      </Container>
    </main>
  );
}
