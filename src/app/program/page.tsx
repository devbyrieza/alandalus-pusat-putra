"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BookOpen,
  GraduationCap,
  Users,
  Sparkles,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Award
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { motion } from "framer-motion";

const PROGRAMS = [
  {
    id: "smpit",
    name: "SMPIT",
    buttonLabel: "Daftar SMPIT",
    fullName: "Program SMPIT (Sekolah Menengah Pertama Islam Terpadu)",
    badge: "Jenjang Formal Terpadu (SMPIT)",
    heroTitle: "Pondasi Rabbani, Cendekia & Mandiri",
    graduateProfile: "Membentuk karakter santri berakhlak mulia, hafalan Al-Qur'an mutqin (pilihan Takhassus 30 Juz atau Reguler 5 Juz), serta kesiapan akademik prima menuju jenjang Aliyah / SMA unggulan.",
    description:
      "Kami menerapkan Kurikulum TICE terpadu yang menggabungkan standar Nasional Kemendikbudristek dengan ciri khas Pesantren Al-Andalus, berfokus pada penguasaan Tahfidz Al-Qur'an (Program Takhassus 30 Juz & Reguler 5 Juz) serta pembentukan Adab Islami dan Karakter Rabbani yang kokoh sejak usia dini.",
    stats: [
      { label: "Tahfidz", value: "30 Juz / 5 Juz", icon: BookOpen },
      { label: "Karakter", value: "Adab & Mandiri", icon: ShieldCheck },
      { label: "Bahasa", value: "Dwi-Bahasa", icon: Globe },
    ],
    highlights: [
      { icon: BookOpen, title: "Tahfidz Takhassus & Reguler", desc: "Pilihan program Tahfidz Takhassus 30 Juz Mutqin atau Tahfidz Reguler 5 Juz dengan sanad tajwid." },
      { icon: ShieldCheck, title: "Karakter & Adab Rabbani", desc: "Penanaman adab islami, akhlak karimah, dan kemandirian melalui pembinaan asrama 24 jam." },
      { icon: Globe, title: "Bahasa Arab & Inggris", desc: "Pembiasaan percakapan dwi-bahasa aktif dalam aktivitas keseharian." },
      { icon: Award, title: "Ijazah Formal & Syahadah", desc: "Lulusan memperoleh Ijazah Resmi SMPIT Kemendikbudristek & Syahadah Pesantren Al-Andalus." },
    ],
    curriculum: [
      "Program Tahfidz Takhassus (Target 30 Juz Mutqin)",
      "Program Tahfidz Reguler (Target 5 Juz Berstandar)",
      "Pembinaan Adab, Karakter Rabbani & Kemandirian santri",
      "Bahasa Arab & Inggris Yaumiyah (Active Speaking)",
      "Kajian Kitab Turots Dasar & Aqidah Ahlussunnah",
      "Kurikulum Nasional SMPIT Terakreditasi Lengkap",
    ],
    theme: "emerald",
    accent: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    id: "il",
    name: "I'dad Lughowi",
    buttonLabel: "Daftar IL",
    fullName: "Program I'dad Lughowi (SMA)",
    badge: "Persiapan Intensif Aliyah & Jamiah (SMA)",
    heroTitle: "Kaderisasi Dai & Cendekia Muslim",
    graduateProfile: "Mencetak santri berkemampuan bahasa Arab fasih, pemahaman syar'i mendalam, dan siap bersaing di PTN maupun Universitas Luar Negeri.",
    description:
      "Program persiapan intensif menuju jenjang Aliyah, berfokus pada percepatan pemantapan Bahasa Arab, penguasaan Turots, Tahfidz Al-Qur'an (Takhassus 30 Juz & Reguler 5 Juz), dan pembinaan karakter ulama cendekia yang beradab dan kontributif.",
    stats: [
      { label: "Tahfidz", value: "30 Juz / 5 Juz", icon: BookOpen },
      { label: "Kekhasan", value: "Kader Ulama", icon: Users },
      { label: "Fokus", value: "Bahasa & Syar'i", icon: Sparkles },
    ],
    highlights: [
      { icon: BookOpen, title: "Tahfidz Takhassus & Reguler", desc: "Penguatan hafalan Tahfidz Takhassus 30 Juz atau Reguler 5 Juz dengan sanad tajwid." },
      { icon: Sparkles, title: "Intensif Bahasa & Turots", desc: "Pendalaman nahwu, shorof, balaghah, dan pengkajian kitab para ulama." },
      { icon: Users, title: "Organisasi & Kemandirian", desc: "Pengasuhan kepemimpinan organisasi dakwah dan kemandirian santri." },
      { icon: Award, title: "Akses Studi Lanjut Global", desc: "Jalur persiapan studi ke Timur Tengah (Madinah, Al-Azhar) & PTN Favorit." },
    ],
    curriculum: [
      "Tahun I'dad: Intensif Bahasa Arab & Qowaid",
      "Program Tahfidz Takhassus 30 Juz & Tahfidz Reguler 5 Juz",
      "Manajemen Organisasi Dakwah & Kemandirian santri",
      "Kajian Kitab Turots Lanjutan & Fiqih Perbandingan",
      "Bimbingan Persiapan Masuk Perguruan Tinggi Favorit",
    ],
    theme: "gold",
    accent: "text-gold-600",
    bg: "bg-secondary-50"
  },
];

export default function ProgramPage() {
  const [activeSection, setActiveSection] = useState("smpit");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportMiddle = scrollPosition + window.innerHeight / 3;

      for (const program of PROGRAMS) {
        const element = document.getElementById(program.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            viewportMiddle >= offsetTop &&
            viewportMiddle < offsetTop + offsetHeight
          ) {
            setActiveSection(program.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-white min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none" />

        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-8 shadow-xs"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Jenjang Pendidikan Pesantren</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-7xl font-display font-black mb-8 tracking-tight leading-[1.05] text-ink-950"
          >
            Program Pendidikan <br />
            <span className="text-gradient-primary">Al-Andalus Putra</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-ink-600 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Kurikulum terintegrasi komprehensif yang menyelaraskan standar
            Nasional dengan nilai-nilai unggul kepesantrenan Ahlussunnah.
          </motion.p>
        </Container>
      </section>

      {/* 2. Navigation Tabs (Sticky) */}
      <div className="sticky top-[72px] z-40 bg-white/80 backdrop-blur-md border-y border-surface-100 py-4 shadow-xs">
        <Container>
          <div className="flex flex-wrap justify-center gap-3">
            {PROGRAMS.map((program) => (
              <button
                key={program.id}
                onClick={() => {
                  document
                    .getElementById(program.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`px-8 py-3 rounded-full font-black text-sm transition-all border shadow-xs cursor-pointer ${
                  activeSection === program.id
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-emerald-700/20"
                    : "bg-white text-ink-500 border-surface-200 hover:border-primary-300 hover:text-primary-700"
                }`}
              >
                {program.name}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* 3. Program Content Sections */}
      <div className="py-12">
        {PROGRAMS.map((program, idx) => (
          <section
            key={program.id}
            id={program.id}
            className="py-20 md:py-28 scroll-mt-32 overflow-hidden"
          >
            <Container>
              <div
                className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${idx % 2 === 1 ? "lg:grid-flow-dense" : ""}`}
              >
                {/* Infographic Bento Highlight Card */}
                <motion.div
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative ${idx % 2 === 1 ? "lg:col-start-2" : ""}`}
                >
                  <div className={`rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-10 shadow-2xl relative z-10 border ${
                    program.theme === "emerald"
                      ? "bg-gradient-to-br from-[#064e3b] via-[#047857] to-[#022c22] border-emerald-400/30 text-white shadow-2xl shadow-emerald-950/30"
                      : "bg-gradient-to-br from-[#047857] via-[#064e3b] to-[#0f3d2e] border-emerald-400/30 text-white shadow-2xl shadow-emerald-950/30"
                  }`}>
                    {/* Header Badge */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-xs font-bold uppercase tracking-wider text-white">
                        <Sparkles className="w-3.5 h-3.5 text-secondary-200" />
                        <span>{program.badge}</span>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center border border-white/20">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-3">
                      {program.heroTitle}
                    </h3>
                    <p className="text-sm text-white/90 leading-relaxed mb-8 font-medium">
                      {program.graduateProfile}
                    </p>

                    {/* 2x2 Feature Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                      {program.highlights.map((hl, hIdx) => {
                        const HlIcon = hl.icon;
                        return (
                          <div
                            key={hIdx}
                            className="bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-2xl border border-white/15"
                          >
                            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-secondary-200 mb-2.5">
                              <HlIcon className="w-4 h-4" />
                            </div>
                            <h4 className="font-bold text-sm text-white mb-1">{hl.title}</h4>
                            <p className="text-xs text-white/80 leading-relaxed">{hl.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Trust Banner / Akreditasi Footer */}
                    <div className="pt-5 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs text-white/90">
                      <span className="flex items-center gap-1.5 font-medium">
                        <ShieldCheck className="w-4 h-4 text-emerald-300" />
                        Ijazah Formal & Syahadah Pesantren
                      </span>
                      <span className="font-bold text-secondary-200">
                        Al-Andalus Standard
                      </span>
                    </div>
                  </div>

                  {/* Decorative Glow Blob */}
                  <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full blur-[100px] -z-10 opacity-30 ${
                      program.theme === "emerald" ? "bg-emerald-900/50" : "bg-teal-900/50"
                    }`}
                  />
                </motion.div>

                {/* Content Side */}
                <div className={idx % 2 === 1 ? "lg:col-start-1" : ""}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center lg:text-left"
                  >
                    <h2 className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-ink-950 leading-[1.05] mb-6">
                      {program.fullName}
                    </h2>
                    <p className="text-lg text-ink-600 font-medium leading-relaxed mb-8 text-center lg:text-left">
                      {program.description}
                    </p>
                  </motion.div>

                  {/* Stats Grid - Modern Design */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    {program.stats.map((stat, sIdx) => (
                      <div
                        key={sIdx}
                        className="app-card bg-white p-5 rounded-[2rem] border border-primary-50 shadow-xs hover:shadow-md transition-all text-center group"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110 border border-primary-100 ${
                            program.theme === "emerald" ? "bg-emerald-50 text-emerald-600" : "bg-secondary-100 text-gold-700"
                          }`}
                        >
                          <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] text-ink-400 font-black uppercase tracking-widest mb-1">
                          {stat.label}
                        </p>
                        <p
                          className={`font-black text-ink-950 ${stat.value.length > 20 ? "text-sm leading-tight" : "text-base"}`}
                        >
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Curriculum Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`app-card rounded-[2.5rem] p-8 md:p-10 mb-8 border ${program.bg} border-primary-100 shadow-xs relative overflow-hidden`}
                  >
                    <div className="absolute top-0 right-0 p-5 md:p-8 opacity-5">
                      <BookOpen className="w-32 h-32 text-primary-900" />
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-ink-950 mb-6 flex items-center gap-3">
                      <div
                        className={`w-2.5 h-8 rounded-full ${program.theme === "emerald" ? "bg-emerald-600" : "bg-gold-500"}`}
                      />
                      Kurikulum & Fokus Pembinaan
                    </h3>

                    <ul className="space-y-4 relative z-10">
                      {program.curriculum.map((item, cIdx) => (
                        <li
                          key={cIdx}
                          className="flex items-start gap-3.5 group/item"
                        >
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                              program.theme === "emerald" ? "bg-emerald-600 text-white" : "bg-gold-500 text-white"
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-ink-800 font-bold text-base leading-tight tracking-tight group-hover/item:text-ink-950 transition-colors">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <Link href={`/daftar?program=${program.id}`}>
                      <button
                        className="w-full sm:w-auto px-10 py-4 rounded-full font-black text-base shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/25"
                      >
                        {program.buttonLabel} Sekarang
                      </button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </Container>
          </section>
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="py-16 md:py-24 bg-surface-50">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 shadow-emerald-950/20 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-16 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-display font-black mb-6 text-white leading-tight">
                Mulai Perjalanan Pendidikan <br />
                <span className="text-secondary-300">Terbaik Putra Anda</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-primary-50 max-w-2xl mx-auto mb-10 font-medium px-2 leading-relaxed">
                Konsultasikan rencana pendidikan santri dengan tim penerimaan kami untuk mendapatkan pilihan jenjang yang paling tepat.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
                <Link href="/daftar">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-primary-900 font-black text-base hover:bg-primary-50 shadow-lg transition-all cursor-pointer">
                    Pendaftaran Online
                  </button>
                </Link>
                <Link href="/kontak">
                  <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all text-base cursor-pointer">
                    Hubungi Panitia PSB
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}
