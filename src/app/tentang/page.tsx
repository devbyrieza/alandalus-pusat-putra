"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import {
  Users,
  Target,
  Award,
  BookOpen,
  Compass,
  Sparkles,
  CheckCircle2,
  Send,
  ShieldCheck,
  Building,
  Heart,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import { BRANDING } from "@/config/branding";

export default function TentangPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="section-std pb-0 relative overflow-hidden py-16">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-50/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>PROFIL RESMI {BRANDING.schoolShortName.toUpperCase()}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto mb-6"
          >
            Mencetak Generasi <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Rabbani, Cendekia, dan Mandiri
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg md:text-xl max-w-3xl mx-auto font-normal leading-relaxed mb-12"
          >
            {BRANDING.schoolName} berdedikasi menyelenggarakan pendidikan Islam berasrama berstandar internasional yang memadukan Tahfidz Al-Qur'an, Bahasa Arab, Ilmu Syar'i, dan Akademik Unggulan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="relative w-full max-w-5xl mx-auto aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
          >
            <Image
              src="/images/hero.jpg"
              alt={BRANDING.schoolName}
              fill
              className="object-cover"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-8 text-left">
              <div className="text-white space-y-1">
                <h3 className="text-2xl font-bold">{BRANDING.schoolName}</h3>
                <p className="text-emerald-300 text-sm font-medium">{BRANDING.address}</p>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* 2. VISI & MISI */}
      <section className="py-20 bg-slate-50">
        <Container>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Visi & Misi Lembaga
            </h2>
            <p className="text-slate-600 text-lg">
              Komitmen berkelanjutan kami dalam mencetak pemimpin masa depan yang berakhlak mulia dan berwawasan luas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Visi Utama</h3>
              <p className="text-slate-600 leading-relaxed">
                Menjadi lembaga pendidikan Islam unggulan dalam mencetak generasi Rabbani yang hafal Al-Qur'an, menguasai ilmu syar'i dan sains, serta berkontribusi nyata bagi ummat dan bangsa.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Misi Utama</h3>
              <ul className="space-y-3 text-slate-600">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Menyelenggarakan program Tahfidz Al-Qur'an 30 Juz bermutu dan mutqin.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Menerapkan kurikulum TICE (Tahfidz, International, Character, Entrepreneurship).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Membina karakter beradab, berdisiplin, dan berjiwa kepemimpinan tinggi.</span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. CTA FOOTER */}
      <section className="py-16 bg-gradient-to-r from-emerald-900 to-teal-900 text-white text-center">
        <Container>
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Bergabunglah Bersama Keluarga Besar {BRANDING.schoolShortName}</h2>
            <p className="text-emerald-100 text-lg">Pendaftaran Santri Baru Tahun Ajaran 2027-2028 Telah Dibuka. Kuota Terbatas!</p>
            <div className="pt-2">
              <Link
                href="/daftar"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-xl transition-all"
              >
                <span>Daftar PPDB Online</span>
                <Send className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
