"use client";

import { BRANDING, IS_PUTRA } from "@/config/branding";
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Microscope,
  Star,
  Building2,
  Heart,
  Zap,
  TrendingUp,
  MapPin,
  Phone,
  ChevronRight,
  GraduationCap,
  BookMarked,
  Languages,
  Briefcase,
} from "lucide-react";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ─── Animated Counter Hook ───────────────────────────────────────────────────
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── Counter Card Component ───────────────────────────────────────────────────
function StatCard({
  value,
  suffix = "",
  label,
  started,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  started: boolean;
  delay?: number;
}) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setActive(true), delay);
    return () => clearTimeout(t);
  }, [started, delay]);
  const count = useCountUp(value, 2000, active);
  return (
    <div className="text-center">
      <div
        className={`text-4xl md:text-5xl font-black ${IS_PUTRA ? "text-primary-400" : "text-sky-400"}`}
      >
        {count}
        {suffix}
      </div>
      <div className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

// ─── Infinite Marquee ────────────────────────────────────────────────────────
const alumniUniversities = [
  "🎓 Universitas Islam Madinah",
  "🎓 Al-Azhar University (Mesir)",
  "🎓 Universiti Utara Malaysia",
  "🎓 The Hong Kong Polytechnic University",
  "🎓 University of Auckland (NZ)",
  "🎓 International Open University",
  "🎓 Universitas Indonesia (UI)",
  "🎓 Universitas Gadjah Mada (UGM)",
  "🎓 Institut Teknologi Bandung (ITB)",
  "🎓 Universitas Diponegoro",
  "🎓 Universitas Brawijaya",
  "🎓 Universitas Airlangga",
  "🎓 LIPIA Jakarta",
  "🎓 UIN Syarif Hidayatullah",
  "🎓 IPB University",
];

function InfiniteMarquee() {
  return (
    <div className="relative overflow-hidden py-4" aria-hidden="true">
      <div className="flex gap-8 animate-marquee whitespace-nowrap">
        {[...alumniUniversities, ...alumniUniversities].map((uni, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${
              IS_PUTRA
                ? "border-primary-200 text-primary-700 bg-primary-50"
                : "border-sky-200 text-sky-700 bg-sky-50"
            }`}
          >
            {uni}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function Home() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  // Scroll observer for stats animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsStarted(true);
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  // Parallax on scroll
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const primaryGradient = IS_PUTRA
    ? "from-primary-600 to-primary-800"
    : "from-sky-500 to-blue-700";
  const primaryColor = IS_PUTRA ? "text-primary-600" : "text-sky-600";
  const primaryBg = IS_PUTRA ? "bg-primary-600" : "bg-sky-600";
  const primaryBgHover = IS_PUTRA ? "hover:bg-primary-700" : "hover:bg-sky-700";
  const primaryShadow = IS_PUTRA
    ? "shadow-primary-500/30"
    : "shadow-sky-500/30";
  const primaryBorder = IS_PUTRA ? "border-primary-200" : "border-sky-200";
  const primaryLight = IS_PUTRA ? "bg-primary-50" : "bg-sky-50";
  const primaryText600 = IS_PUTRA ? "text-primary-600" : "text-sky-600";

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* ═══════════════════════════════════════════════
          §1 ANNOUNCEMENT BANNER
          ═══════════════════════════════════════════════ */}
      <div
        className={`w-full py-2 text-center text-xs font-bold text-white ${primaryBg}`}
      >
        🔥 Pendaftaran Santri Baru Angkatan IX Telah Dibuka — Daftar Sekarang
        Sebelum Kuota Penuh!
        <Link href="/daftar" className="ml-2 underline underline-offset-2">
          Daftar →
        </Link>
      </div>

      {/* ═══════════════════════════════════════════════
          §2 HERO SECTION — SPLIT LAYOUT (Omniroute Style)
          ═══════════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-[calc(100vh-40px)] flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-20"
      >
        {/* Animated mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] ${IS_PUTRA ? "bg-primary-600" : "bg-sky-500"}`}
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px] bg-amber-500"
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          />
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* LEFT: Copy + CTA + Stats */}
            <div className="space-y-8">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${IS_PUTRA ? "bg-primary-400" : "bg-sky-400"}`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${IS_PUTRA ? "bg-primary-400" : "bg-sky-400"}`}
                  />
                </span>
                <span className="text-white/90 text-xs font-bold uppercase tracking-widest">
                  Pesantren Islam Internasional • Jonggol, Bogor
                </span>
              </div>

              {/* Main headline */}
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight">
                  Cetak Generasi{" "}
                  <span
                    className={`text-transparent bg-clip-text bg-gradient-to-r ${primaryGradient}`}
                  >
                    Rabbani
                  </span>
                  <br />
                  Berkelas Dunia.
                </h1>
                <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                  Kurikulum TICE — Tahfizh Al-Qur'an, Internasional, Karakter
                  Mulia, dan Entrepreneurship. Bergabung bersama{" "}
                  <strong className="text-white">400+ santri aktif</strong> di
                  lingkungan asrama terbaik.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/daftar"
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base ${primaryBg} ${primaryBgHover} shadow-xl ${primaryShadow} transition-all hover:-translate-y-1 hover:shadow-2xl group`}
                >
                  Daftar Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:-translate-y-1 backdrop-blur-sm"
                >
                  Profil Pesantren
                </Link>
              </div>

              {/* Inline stats row (like Omniroute's "268 providers · 90+ free · 15–95% saved") */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {[
                  { val: "2013", label: "Tahun Berdiri" },
                  { val: "VIII", label: "Angkatan" },
                  { val: "400+", label: "Santri Aktif" },
                  { val: "3", label: "Benua Alumni" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i > 0 && (
                      <span className="text-slate-600 select-none">·</span>
                    )}
                    <span className="text-white font-black">{s.val}</span>
                    <span className="text-slate-500 text-sm">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Visual — Hero Image with Glassmorphism Frame */}
            <div className="relative flex justify-center lg:justify-end">
              {/* Main image frame */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 w-full max-w-lg">
                <Image
                  src="/images/hero-aerial.jpg"
                  alt="Pesantren Al-Andalus Jonggol"
                  width={600}
                  height={450}
                  className="object-cover w-full h-[380px]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                {/* Floating badge: PPDB Open */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${primaryBg} flex items-center justify-center shrink-0`}
                    >
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">
                        PPDB 2026/2027 Dibuka
                      </p>
                      <p className="text-slate-400 text-xs">
                        Angkatan IX · Kuota Terbatas
                      </p>
                    </div>
                    <Link
                      href="/daftar"
                      className={`ml-auto px-4 py-2 rounded-xl text-white text-xs font-bold ${primaryBg} ${primaryBgHover} transition shrink-0`}
                    >
                      Daftar
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating mini-card: Muadalah Accreditation */}
              <div className="absolute -top-4 -right-4 md:-right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center gap-2">
                <span className="text-2xl">🏅</span>
                <div>
                  <p className="text-white text-xs font-bold">
                    Terakreditasi Muadalah
                  </p>
                  <p className="text-slate-400 text-[10px]">
                    Setara Internasional
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          §3 STATS BAND — Animated Counters (Omniroute giant number)
          ═══════════════════════════════════════════════ */}
      <section
        ref={statsRef}
        className="relative py-20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-y border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span
              className={`text-xs font-bold uppercase tracking-widest ${primaryColor}`}
            >
              Angka Bicara
            </span>
            <h2 className="text-3xl font-black text-white mt-2">
              Capaian Nyata yang Kami Banggakan
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatCard
              value={800}
              suffix="+"
              label="Alumni"
              started={statsStarted}
              delay={0}
            />
            <StatCard
              value={400}
              suffix="+"
              label="Santri Aktif"
              started={statsStarted}
              delay={200}
            />
            <StatCard
              value={12}
              suffix=""
              label="Tahun Pengalaman"
              started={statsStarted}
              delay={400}
            />
            <StatCard
              value={50}
              suffix="+"
              label="Perguruan Tinggi"
              started={statsStarted}
              delay={600}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          §4 KEUNGGULAN BENTO GRID (Omniroute features bento)
          ═══════════════════════════════════════════════ */}
      <section id="program" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <span
              className={`text-xs font-bold uppercase tracking-widest ${primaryColor}`}
            >
              Sistem Pendidikan
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-3 mb-4">
              Kurikulum{" "}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${primaryGradient}`}
              >
                TICE
              </span>{" "}
              — Komprehensif
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Empat pilar utama yang membentuk generasi Muslim yang unggul di
              dunia dan akhirat.
            </p>
          </header>

          {/* Bento Grid: 2 besar + 4 kecil */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Large card 1: Tahfizh */}
            <div
              className={`md:col-span-2 rounded-3xl p-8 bg-gradient-to-br ${IS_PUTRA ? "from-primary-600 to-primary-800" : "from-sky-500 to-blue-700"} text-white relative overflow-hidden group hover:scale-[1.01] transition-transform`}
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <BookMarked className="w-10 h-10 mb-6 opacity-90" />
              <h3 className="text-2xl font-black mb-3">
                T — Tahfizh Al-Qur'an
              </h3>
              <p className="text-white/80 leading-relaxed mb-6">
                Program hafalan Al-Qur'an 30 juz dengan metode Itqan yang
                teruji. Setiap santri mendapatkan bimbingan intensif 26 jam/pekan
                dengan ustadz hafizh berpengalaman.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm font-bold">
                <Star className="w-4 h-4" /> Target 30 Juz
              </div>
            </div>

            {/* Small card: International */}
            <div className="rounded-3xl p-8 bg-slate-900 text-white relative overflow-hidden group hover:scale-[1.01] transition-transform border border-slate-700">
              <Globe className="w-10 h-10 mb-6 text-amber-400" />
              <h3 className="text-xl font-black mb-3">I — Internasional</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Kurikulum nasional + khas Andalus + persiapan kuliah ke luar
                negeri (Muadalah).
              </p>
              <div className="text-amber-400 font-black text-2xl">50+</div>
              <div className="text-slate-500 text-xs">Perguruan Tinggi</div>
            </div>

            {/* Small card: Karakter */}
            <div className="rounded-3xl p-8 bg-emerald-50 border border-emerald-100 group hover:scale-[1.01] transition-transform">
              <Heart className="w-10 h-10 mb-6 text-emerald-600" />
              <h3 className="text-xl font-black mb-3 text-slate-900">
                C — Karakter Rabbani
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Pembentukan akhlak mulia berdasarkan Al-Qur'an dan As-Sunnah
                sesuai pemahaman Salafush Shalih.
              </p>
              <div className="text-emerald-600 font-black text-2xl">24/7</div>
              <div className="text-slate-400 text-xs">Lingkungan Kondusif</div>
            </div>

            {/* Small card: Entrepreneurship */}
            <div className="rounded-3xl p-8 bg-amber-50 border border-amber-100 group hover:scale-[1.01] transition-transform">
              <Briefcase className="w-10 h-10 mb-6 text-amber-600" />
              <h3 className="text-xl font-black mb-3 text-slate-900">
                E — Entrepreneurship
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Penanaman jiwa kewirausahaan berwawasan global agar santri
                mandiri dan berdaya sejak dini.
              </p>
              <div className="text-amber-600 font-black text-2xl">Mandiri</div>
              <div className="text-slate-400 text-xs">& Berdaya</div>
            </div>

            {/* Large card 2: Trilingual */}
            <div className="rounded-3xl p-8 bg-slate-50 border border-slate-200 group hover:scale-[1.01] transition-transform">
              <Languages className="w-10 h-10 mb-6 text-slate-700" />
              <h3 className="text-xl font-black mb-3 text-slate-900">
                Trilingual Excellence
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Bahasa Arab (ilmu syar'i), Bahasa Inggris (global), dan Bahasa
                Indonesia sebagai bahasa pengantar utama.
              </p>
              <div className="flex gap-2 flex-wrap">
                {["🇸🇦 Arab", "🇬🇧 Inggris", "🇮🇩 Indonesia"].map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 bg-slate-200 rounded-full text-xs font-bold text-slate-700"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          §5 PAIN vs SOLUTION TABLE (Omniroute "Why" section)
          ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <span
              className={`text-xs font-bold uppercase tracking-widest ${primaryColor}`}
            >
              Kekhawatiran Orang Tua
            </span>
            <h2 className="text-4xl font-black text-white mt-3 mb-4">
              Kami Pahami Keresahan Anda
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Setiap kekhawatiran orang tua adalah prioritas kami. Berikut
              jawaban nyata dari Al-Andalus.
            </p>
          </header>

          {/* Table header */}
          <div className="rounded-3xl overflow-hidden border border-slate-800">
            <div className="grid grid-cols-2 bg-slate-900">
              <div className="p-5 text-slate-500 text-sm font-bold uppercase tracking-widest border-r border-slate-800">
                ❌ Kekhawatiran Orang Tua
              </div>
              <div
                className={`p-5 text-sm font-bold uppercase tracking-widest ${primaryColor}`}
              >
                ✅ Jaminan Al-Andalus
              </div>
            </div>

            {[
              {
                pain: "Anak jauh dari keluarga dan tidak terpantau",
                fix: "Laporan berkala via WhatsApp + portal online orang tua",
              },
              {
                pain: "Kurikulum pesantren vs persiapan kuliah?",
                fix: "Muadalah diakui setara — alumni masuk UI, UGM, ITB, Al-Azhar",
              },
              {
                pain: "Hafalan Qur'an tapi akademik terbengkalai?",
                fix: "TICE memadukan tahfizh 30 juz + akademik internasional seimbang",
              },
              {
                pain: "Fasilitas asrama tidak layak dan tidak nyaman",
                fix: "Asrama modern, kamar bersih, fasilitas olahraga & lab lengkap",
              },
              {
                pain: "Bullying dan lingkungan teman yang negatif",
                fix: "Pembinaan karakter 24/7, guru pengasuh profesional bersertifikat",
              },
              {
                pain: "Mahal dan tidak terjangkau",
                fix: "Program beasiswa bagi santri berprestasi atau kurang mampu",
              },
            ].map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-2 border-t border-slate-800 hover:bg-slate-900/50 transition-colors"
              >
                <div className="p-5 text-slate-400 text-sm border-r border-slate-800">
                  {row.pain}
                </div>
                <div className="p-5 text-slate-200 text-sm font-medium">
                  {row.fix}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          §6 LANGKAH PENDAFTARAN — Step-by-Step (Omniroute quickstart)
          ═══════════════════════════════════════════════ */}
      <section id="cara-daftar" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: Steps */}
            <div>
              <span
                className={`text-xs font-bold uppercase tracking-widest ${primaryColor}`}
              >
                Proses Pendaftaran
              </span>
              <h2 className="text-4xl font-black text-slate-900 mt-3 mb-12">
                Daftar dalam{" "}
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${primaryGradient}`}
                >
                  4 Langkah
                </span>{" "}
                Mudah
              </h2>

              <ol className="space-y-8">
                {[
                  {
                    num: "01",
                    title: "Isi Formulir Online",
                    desc: "Daftar via website ini. Isi data diri calon santri dengan lengkap dan benar.",
                    icon: BookOpen,
                  },
                  {
                    num: "02",
                    title: "Upload Berkas Dokumen",
                    desc: "Upload foto rapor, foto santri, akte lahir, dan kartu keluarga melalui portal.",
                    icon: CheckCircle2,
                  },
                  {
                    num: "03",
                    title: "Lakukan Pembayaran",
                    desc: "Bayar biaya seleksi via transfer bank atau metode pembayaran yang tersedia.",
                    icon: TrendingUp,
                  },
                  {
                    num: "04",
                    title: "Ikuti Ujian Seleksi",
                    desc: "Hadir di hari yang ditentukan untuk mengikuti ujian tulis dan wawancara.",
                    icon: GraduationCap,
                  },
                ].map((step, i) => (
                  <li key={i} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-2xl ${primaryBg} text-white font-black text-sm flex items-center justify-center shadow-lg ${primaryShadow} shrink-0`}
                      >
                        {step.num}
                      </div>
                      {i < 3 && (
                        <div className="w-0.5 h-full mt-3 bg-slate-200" />
                      )}
                    </div>
                    <div className="pb-8">
                      <h3 className="font-black text-slate-900 text-lg mb-1">
                        {step.title}
                      </h3>
                      <p className="text-slate-500 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <Link
                href="/daftar"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white ${primaryBg} ${primaryBgHover} shadow-xl ${primaryShadow} transition-all hover:-translate-y-1 group`}
              >
                Mulai Daftar Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: Info Card */}
            <div className="space-y-6">
              <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden">
                {/* Terminal-style bar */}
                <div className="flex items-center gap-2 px-5 py-4 bg-slate-900 border-b border-slate-800">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-slate-500 text-sm ml-3">
                    ppdb-alandalus — status pendaftaran
                  </span>
                </div>
                <div className="p-6 font-mono text-sm space-y-2">
                  <p className="text-slate-500">
                    $ cek status PPDB 2026/2027...
                  </p>
                  <p>
                    <span
                      className={`${IS_PUTRA ? "text-primary-400" : "text-sky-400"}`}
                    >
                      ▸
                    </span>{" "}
                    <span className="text-white">Status Pendaftaran</span>{" "}
                    <span className="text-green-400 font-bold">✓ DIBUKA</span>
                  </p>
                  <p>
                    <span
                      className={`${IS_PUTRA ? "text-primary-400" : "text-sky-400"}`}
                    >
                      ▸
                    </span>{" "}
                    <span className="text-white">Angkatan</span>{" "}
                    <span className="text-amber-400">IX (2026/2027)</span>
                  </p>
                  <p>
                    <span
                      className={`${IS_PUTRA ? "text-primary-400" : "text-sky-400"}`}
                    >
                      ▸
                    </span>{" "}
                    <span className="text-white">Lokasi</span>{" "}
                    <span className="text-slate-400">Sukamakmur, Jonggol</span>
                  </p>
                  <p className="text-slate-600">
                    ▸ kuota terbatas — daftar segera...
                  </p>
                  <p>
                    <span className="text-green-400">✓</span>{" "}
                    <span className="text-slate-300">
                      Formulir online tersedia 24/7
                    </span>
                  </p>
                </div>
              </div>

              {/* Contact Card */}
              <div
                className={`rounded-3xl p-6 ${primaryLight} border ${primaryBorder}`}
              >
                <h4
                  className={`font-black text-slate-900 mb-4 flex items-center gap-2`}
                >
                  <Phone className={`w-5 h-5 ${primaryText600}`} />
                  Butuh Bantuan? Hubungi Kami
                </h4>
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/${BRANDING.contact.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-slate-700 hover:text-slate-900 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <span className="group-hover:underline">
                      {BRANDING.contact.whatsapp}
                    </span>
                  </a>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-slate-600" />
                    </div>
                    <span>{BRANDING.contact.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          §7 ALUMNI MARQUEE (Omniroute marquee ticker)
          ═══════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50 border-y border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
          <span
            className={`text-xs font-bold uppercase tracking-widest ${primaryColor}`}
          >
            Jejak Alumni
          </span>
          <h2 className="text-2xl font-black text-slate-900 mt-2">
            Tersebar di 3 Benua, 50+ Perguruan Tinggi
          </h2>
        </div>
        <InfiniteMarquee />
      </section>

      {/* ═══════════════════════════════════════════════
          §8 KEUNGGULAN TAMBAHAN — Feature Grid
          ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <span
              className={`text-xs font-bold uppercase tracking-widest ${primaryColor}`}
            >
              Fasilitas & Keunggulan
            </span>
            <h2 className="text-4xl font-black text-slate-900 mt-3">
              Semua yang Dibutuhkan Santri,{" "}
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${primaryGradient}`}
              >
                Tersedia
              </span>
            </h2>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Kurikulum Internasional",
                desc: "Perpaduan kurikulum nasional dan khas Andalus dengan pengakuan Muadalah (setara internasional).",
              },
              {
                icon: ShieldCheck,
                title: "Asrama Premium",
                desc: "Lingkungan asrama bersih, aman, nyaman dengan pengawasan 24 jam penuh oleh ustadz pengasuh.",
              },
              {
                icon: Award,
                title: "Tenaga Didik Expert",
                desc: "Asatidz lulusan Universitas Islam Madinah, Al-Azhar Mesir, LIPIA, dan perguruan tinggi terkemuka.",
              },
              {
                icon: Globe,
                title: "Jaringan Global",
                desc: "Alumni tersebar di 3 benua: Asia, Afrika (Mesir), dan Oseania (New Zealand, Hong Kong).",
              },
              {
                icon: Microscope,
                title: "Lab & Fasilitas Modern",
                desc: "Laboratorium IPA, lab bahasa, perpustakaan digital, lapangan olahraga lengkap.",
              },
              {
                icon: Zap,
                title: "Program Beasiswa",
                desc: "Tersedia program beasiswa penuh dan parsial bagi santri berprestasi dan dari keluarga kurang mampu.",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="group p-6 rounded-3xl border border-slate-100 bg-white hover:border-slate-200 hover:-translate-y-1 hover:shadow-xl transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${primaryLight} ${primaryText600} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-2">
                  {feat.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          §9 SOCIAL PROOF — Logo Grid (Omniroute CLI logos)
          ═══════════════════════════════════════════════ */}
      <section
        className={`py-20 ${IS_PUTRA ? "bg-primary-950" : "bg-sky-950"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-400 text-sm font-bold uppercase tracking-widest mb-12">
            Alumni Diterima di Perguruan Tinggi Terkemuka
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { label: "Univ. Islam Madinah", flag: "🇸🇦" },
              { label: "Al-Azhar Mesir", flag: "🇪🇬" },
              { label: "Univ. Auckland NZ", flag: "🇳🇿" },
              { label: "HK Polytechnic", flag: "🇭🇰" },
              { label: "LIPIA Jakarta", flag: "🇮🇩" },
              { label: "UI", flag: "🏛️" },
              { label: "UGM", flag: "🏛️" },
              { label: "ITB", flag: "🏛️" },
              { label: "Univ. Brawijaya", flag: "🏛️" },
              { label: "Univ. Airlangga", flag: "🏛️" },
              { label: "Undip", flag: "🏛️" },
              { label: "UUM Malaysia", flag: "🇲🇾" },
              { label: "UIN Jakart", flag: "🕌" },
              { label: "IPB University", flag: "🌿" },
            ].map((uni, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-center"
              >
                <span className="text-2xl">{uni.flag}</span>
                <span className="text-slate-400 text-xs font-medium leading-tight">
                  {uni.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          §10 CTA FINAL SECTION
          ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-[100px] ${IS_PUTRA ? "bg-primary-600" : "bg-sky-500"}`}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <span
            className={`text-xs font-bold uppercase tracking-widest ${primaryColor}`}
          >
            Bergabunglah Bersama Kami
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-4 mb-6">
            Siapkan Putra Anda untuk{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${primaryGradient}`}
            >
              Masa Depan Gemilang
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Bergabunglah bersama ratusan keluarga yang telah mempercayakan
            pendidikan putra mereka kepada Al-Andalus selama 12 tahun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/daftar"
              className={`inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold text-white text-lg ${primaryBg} ${primaryBgHover} shadow-2xl ${primaryShadow} transition-all hover:-translate-y-1 group`}
            >
              Daftar Sekarang — Gratis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={`https://wa.me/${BRANDING.contact.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold text-white text-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:-translate-y-1 backdrop-blur-sm"
            >
              <Phone className="w-5 h-5" />
              WhatsApp Kami
            </a>
          </div>
          <p className="text-slate-600 text-sm mt-8">
            ✓ Formulir gratis · ✓ Panduan lengkap · ✓ Tim siap membantu
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
