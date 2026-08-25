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
  Award,
  ArrowRight
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
    heroTitle: "Pondasi Rabbani, Ulama & Mandiri",
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
      { icon: Globe, title: "Bahasa Arab & Inggris", desc: "Pembiasaan percakapan dwi-bahasa aktif dalam aktivitas keseharian santri." },
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
    accentBadge: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    iconBg: "bg-emerald-100/80 text-emerald-700",
    buttonBg: "bg-emerald-700 hover:bg-emerald-800 shadow-emerald-900/20",
    borderHighlight: "hover:border-emerald-300"
  },
  {
    id: "il",
    name: "I'dad Lughowi",
    buttonLabel: "Daftar IL",
    fullName: "Program I'dad Lughowi (SMA)",
    badge: "Persiapan Intensif Aliyah & Jamiah (SMA)",
    heroTitle: "Kaderisasi Ulama & Cendekia Muslim",
    graduateProfile: "Mencetak santri berkemampuan bahasa Arab fasih, pemahaman syar'i mendalam, dan siap bersaing di PTN maupun Universitas Luar Negeri (Madinah, Al-Azhar, dll).",
    description:
      "Program persiapan intensif menuju jenjang Aliyah, berfokus pada percepatan pemantapan Bahasa Arab, penguasaan Turots, Tahfidz Al-Qur'an (Takhassus 30 Juz & Reguler 5 Juz), dan pembinaan kader ulama yang beradab dan kontributif bagi umat.",
    stats: [
      { label: "Tahfidz", value: "30 Juz / 5 Juz", icon: BookOpen },
      { label: "Kekhasan", value: "Kader Ulama", icon: Users },
      { label: "Fokus", value: "Bahasa & Syar'i", icon: Sparkles },
    ],
    highlights: [
      { icon: BookOpen, title: "Tahfidz Takhassus & Reguler", desc: "Penguatan hafalan Tahfidz Takhassus 30 Juz atau Reguler 5 Juz dengan sanad tajwid." },
      { icon: Sparkles, title: "Intensif Bahasa & Turots", desc: "Pendalaman nahwu, shorof, balaghah, dan pengkajian kitab para ulama salaf." },
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
    accentBadge: "bg-teal-50 text-teal-900 border-teal-200/80",
    iconBg: "bg-teal-100/80 text-teal-800",
    buttonBg: "bg-teal-700 hover:bg-teal-800 shadow-teal-900/20",
    borderHighlight: "hover:border-teal-300"
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
    <main className="bg-slate-50/50 min-h-screen text-slate-900">
      {/* 1. Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-white border-b border-slate-100">
        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold uppercase tracking-widest mb-6 shadow-xs"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Jenjang Pendidikan Pesantren Putra</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 tracking-tight text-slate-950 leading-tight"
          >
            Program Pendidikan <br />
            <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 bg-clip-text text-transparent">
              Al-Andalus Putra
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Kurikulum terintegrasi yang menyelaraskan standar Nasional Kemendikbudristek dengan nilai-nilai luhur kepesantrenan Ahlussunnah.
          </motion.p>
        </Container>
      </section>

      {/* 2. Navigation Tabs (Sticky) */}
      <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 py-3.5 shadow-xs">
        <Container>
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
            {PROGRAMS.map((program) => (
              <button
                key={program.id}
                onClick={() => {
                  document
                    .getElementById(program.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`px-6 sm:px-8 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all border cursor-pointer ${
                  activeSection === program.id
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-700/20 scale-105"
                    : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-700 shadow-xs"
                }`}
              >
                {program.name}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* 3. Program Content Sections */}
      <div className="py-8 md:py-16">
        {PROGRAMS.map((program, idx) => (
          <section
            key={program.id}
            id={program.id}
            className="py-12 md:py-20 scroll-mt-28 overflow-hidden"
          >
            <Container>
              <div
                className={`grid lg:grid-cols-2 gap-8 lg:gap-14 items-center ${
                  idx % 2 === 1 ? "lg:grid-flow-dense" : ""
                }`}
              >
                {/* Visual Highlight Card (Platinum Light & Airy) */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`relative ${idx % 2 === 1 ? "lg:col-start-2" : ""}`}
                >
                  <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-slate-200/90 relative z-10 transition-all">
                    {/* Header Badge */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${program.accentBadge}`}>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{program.badge}</span>
                      </div>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border border-slate-200/80 ${program.iconBg}`}>
                        <GraduationCap className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Card Title */}
                    <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-950 mb-3 tracking-tight leading-snug">
                      {program.heroTitle}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6 font-normal">
                      {program.graduateProfile}
                    </p>

                    {/* 2x2 Feature Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {program.highlights.map((hl, hIdx) => {
                        const HlIcon = hl.icon;
                        return (
                          <div
                            key={hIdx}
                            className={`bg-slate-50/80 hover:bg-white transition-all p-4 rounded-2xl border border-slate-200/70 ${program.borderHighlight} shadow-2xs`}
                          >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-2.5 ${program.iconBg}`}>
                              <HlIcon className="w-4 h-4" />
                            </div>
                            <h4 className="font-bold text-sm text-slate-900 mb-1">{hl.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{hl.desc}</p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Trust Banner / Akreditasi Footer */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1.5 text-slate-700">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Ijazah Resmi & Syahadah Pesantren
                      </span>
                      <span className="font-bold text-emerald-700">
                        Standar Al-Andalus
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Content Side */}
                <div className={idx % 2 === 1 ? "lg:col-start-1" : ""}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-left"
                  >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-slate-950 leading-tight mb-4">
                      {program.fullName}
                    </h2>
                    <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-6">
                      {program.description}
                    </p>
                  </motion.div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 mb-6">
                    {program.stats.map((stat, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-center"
                      >
                        <div
                          className={`w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center ${program.iconBg}`}
                        >
                          <stat.icon className="w-4 h-4" />
                        </div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-0.5">
                          {stat.label}
                        </p>
                        <p className="font-black text-slate-900 text-xs sm:text-sm">
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Curriculum Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-6 sm:p-8 mb-6 border border-slate-200/80 shadow-xs relative overflow-hidden"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2.5">
                      <div className="w-2 h-6 rounded-full bg-emerald-600" />
                      Kurikulum & Fokus Pembinaan
                    </h3>

                    <ul className="space-y-3 relative z-10">
                      {program.curriculum.map((item, cIdx) => (
                        <li
                          key={cIdx}
                          className="flex items-start gap-3"
                        >
                          <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-slate-700 font-medium text-xs sm:text-sm leading-normal">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* CTA Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href="/ppdb"
                      className={`inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-2xl font-bold text-white text-sm transition-all shadow-md hover:-translate-y-0.5 ${program.buttonBg}`}
                    >
                      <span>{program.buttonLabel}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </Container>
          </section>
        ))}
      </div>
    </main>
  );
}
