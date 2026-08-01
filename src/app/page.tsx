"use client";

import { BRANDING, IS_PUTRA } from "@/config/branding";
import {
  ArrowRight,
  BookOpen,
  Award,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Zap,
  TrendingUp,
  MapPin,
  Phone,
  GraduationCap,
  BookMarked,
  Languages,
  Briefcase,
  Heart,
  AlertTriangle,
  Microscope,
  Star,
  ChevronRight,
  Wifi,
  Medal,
  Building2,
  Users,
} from "lucide-react";
import {
  FaMosque,
  FaQuran,
  FaGlobeAsia,
  FaUniversity,
  FaUserGraduate,
  FaWhatsapp,
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaStar,
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
  FaBullseye,
  FaHandshake,
  FaTrophy,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  PiBookOpenTextBold,
  PiCertificateBold,
  PiPlantBold,
} from "react-icons/pi";
import {
  HiAcademicCap,
  HiOutlineBookOpen,
  HiOutlineCpuChip,
} from "react-icons/hi2";
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
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ─── Counter Card ─────────────────────────────────────────────────────────────
function StatCard({
  value,
  suffix = "",
  label,
  icon: Icon,
  started,
  delay = 0,
}: {
  value: number;
  suffix?: string;
  label: string;
  icon: React.ElementType;
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
  const primaryColor = IS_PUTRA ? "text-primary-400" : "text-sky-400";
  const primaryBg = IS_PUTRA ? "bg-primary-500/10" : "bg-sky-500/10";
  return (
    <div className="text-center group">
      <div className={`w-14 h-14 rounded-2xl ${primaryBg} flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`w-7 h-7 ${primaryColor}`} />
      </div>
      <div className={`text-4xl md:text-5xl font-black ${primaryColor}`}>
        {count}{suffix}
      </div>
      <div className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

// ─── Infinite Marquee ────────────────────────────────────────────────────────
const alumniItems = [
  { label: "Universitas Islam Madinah", Icon: FaMosque },
  { label: "Al-Azhar University, Mesir", Icon: FaUniversity },
  { label: "Universiti Utara Malaysia", Icon: FaGlobeAsia },
  { label: "HK Polytechnic University", Icon: Building2 },
  { label: "University of Auckland, NZ", Icon: Globe },
  { label: "Universitas Indonesia (UI)", Icon: HiAcademicCap },
  { label: "Universitas Gadjah Mada", Icon: HiAcademicCap },
  { label: "Institut Teknologi Bandung", Icon: HiOutlineCpuChip },
  { label: "Universitas Diponegoro", Icon: FaUniversity },
  { label: "Universitas Brawijaya", Icon: FaUniversity },
  { label: "Universitas Airlangga", Icon: FaUniversity },
  { label: "LIPIA Jakarta", Icon: FaQuran },
  { label: "UIN Syarif Hidayatullah", Icon: FaMosque },
  { label: "IPB University", Icon: PiPlantBold },
];

function InfiniteMarquee() {
  const primaryBorder = IS_PUTRA ? "border-primary-800/60" : "border-sky-800/60";
  const primaryBg = IS_PUTRA ? "bg-primary-950/60" : "bg-sky-950/60";
  const primaryText = IS_PUTRA ? "text-primary-300" : "text-sky-300";
  const iconColor = IS_PUTRA ? "text-primary-500" : "text-sky-500";

  return (
    <div className="relative overflow-hidden py-4" aria-hidden="true">
      <div className="flex gap-6 animate-marquee whitespace-nowrap">
        {[...alumniItems, ...alumniItems].map((item, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold border ${primaryBorder} ${primaryBg} ${primaryText} shrink-0`}
          >
            <item.Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Testimonials Data ──────────────────────────────────────────────────
const TESTIMONIALS = [
  { initial: "I", name: "Bapak Irfan H.", role: "Orang Tua Santri · Jakarta", quote: "Awalnya khawatir anak jauh dari keluarga. Tapi setelah setahun, dia justru lebih mandiri dan hafalannya sudah 15 juz. Alhamdulillah." },
  { initial: "R", name: "Ibu Rahmawati", role: "Orang Tua Santri · Bandung", quote: "Komunikasi dengan pihak pesantren sangat baik. Laporan perkembangan putra kami rutin dikirim via WhatsApp, jadi saya benar-benar tenang." },
  { initial: "D", name: "Bapak Dedy S.", role: "Orang Tua Santri · Surabaya", quote: "Anak saya yang dulu malas sholat, kini jadi imam masjid kampung saat liburan. Perubahan yang tidak pernah kami bayangkan sebelumnya." },
  { initial: "F", name: "Ibu Fitri A.", role: "Orang Tua Santri · Bekasi", quote: "Kurikulum TICE ini memang berbeda. Anak hafal Qur'an sekaligus lancar berbahasa Arab dan Inggris. Dua kebaikan yang kami dapat sekaligus." },
  { initial: "H", name: "Bapak Hendra P.", role: "Orang Tua Santri · Medan", quote: "Tahun pertama sempat ragu. Tapi melihat perubahan karakter dan prestasi anak dalam dua tahun ini, tidak ada yang kami sesalkan." },
  { initial: "S", name: "Ibu Sari M.", role: "Orang Tua Santri · Bogor", quote: "Fasilitas asramanya bersih dan terjaga. Anak saya betah dan tidak minta pindah — itu saja sudah membuktikan kualitas pesantrennya." },
];

// ─── Main Component ────────────────────────────────────────────────────────
export default function Home() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const c = {
    grad:       IS_PUTRA ? "from-primary-600 to-primary-800"   : "from-sky-500 to-blue-700",
    gradText:   "from-secondary-400 to-secondary-600",
    text600:    IS_PUTRA ? "text-primary-600"  : "text-sky-600",
    text400:    IS_PUTRA ? "text-primary-400"  : "text-sky-400",
    bg600:      IS_PUTRA ? "bg-primary-600"    : "bg-sky-600",
    bgHover:    IS_PUTRA ? "hover:bg-primary-700" : "hover:bg-sky-700",
    shadow:     IS_PUTRA ? "shadow-primary-500/30" : "shadow-sky-500/30",
    border200:  IS_PUTRA ? "border-primary-200" : "border-sky-200",
    bg50:       IS_PUTRA ? "bg-primary-50"     : "bg-sky-50",
    bgDark:     IS_PUTRA ? "bg-primary-950"    : "bg-sky-950",
    bg950:      IS_PUTRA ? "bg-primary-950"    : "bg-sky-950",
    ring:       IS_PUTRA ? "ring-primary-500/30" : "ring-sky-500/30",
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">

      {/* ═══ ANNOUNCEMENT BAR ═══════════════════════════════════════════════ */}
      <div className={`w-full py-2 sm:py-2.5 text-xs font-bold text-white ${c.bg600} flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-8`}>
        <Zap className="w-3.5 h-3.5 shrink-0" />
        <span className="sm:hidden">PPDB Angkatan IX — Kuota Terbatas!</span>
        <span className="hidden sm:inline">Pendaftaran Santri Baru Angkatan IX Telah Dibuka — Kuota Terbatas!</span>
        <Link href="/daftar" className="underline underline-offset-2 flex items-center gap-0.5 whitespace-nowrap hover:opacity-80 transition-opacity">
          Daftar <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ═══ §1 HERO SECTION — SPLIT DARK ═══════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-[calc(100svh-40px)] flex items-center bg-[#020617] pt-20 pb-12 md:pb-20 overflow-hidden"
      >
        {/* Animated glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`hidden md:block absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] bg-[#166534]`}
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}
          />
          <div
            className="hidden md:block absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] bg-amber-600"
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(#ffffff 1px,transparent 1px),linear-gradient(90deg,#ffffff 1px,transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${IS_PUTRA ? "bg-primary-400" : "bg-sky-400"}`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${IS_PUTRA ? "bg-primary-400" : "bg-sky-400"}`} />
                </span>
                <FaMosque className={`w-3.5 h-3.5 ${c.text400}`} />
                <span className="text-white/90 text-xs font-bold uppercase tracking-widest">
                  Pesantren Islam Internasional · Jonggol, Bogor
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif italic font-black text-white leading-[1.08] tracking-tight">
                  Cetak Generasi{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#d97706] pr-2 md:pr-4">
                    Rabbani
                  </span>{" "}
                  Berkelas Dunia.
                </h1>
                <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed text-left">
                  Kurikulum <strong className="text-white">TICE</strong> — Tahfizh Al-Qur'an, Internasional,
                  Karakter Mulia, dan Entrepreneurship. Bergabung bersama{" "}
                  <strong className="text-white">400+ santri aktif</strong> di lingkungan asrama terbaik.
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/daftar"
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base ${c.bg600} ${c.bgHover} shadow-xl ${c.shadow} transition-all hover:-translate-y-1 hover:shadow-2xl group`}
                >
                  Daftar Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/tentang"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:-translate-y-1 backdrop-blur-sm"
                >
                  <PiBookOpenTextBold className="w-5 h-5" />
                  Profil Pesantren
                </Link>
              </div>

              {/* Stat Row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 border-t border-white/10">
                {[
                  { val: "2013", label: "Tahun Berdiri", Icon: FaStar },
                  { val: "VIII", label: "Angkatan", Icon: HiAcademicCap },
                  { val: "400+", label: "Santri Aktif", Icon: Users },
                  { val: "3", label: "Benua Alumni", Icon: FaGlobeAsia },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="text-slate-700">·</span>}
                    <s.Icon className={`w-3.5 h-3.5 ${c.text400} shrink-0`} />
                    <span className="text-white font-black text-sm">{s.val}</span>
                    <span className="text-slate-500 text-xs">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Image + floating cards */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 w-full max-w-lg">
                <Image
                  src="/images/halaman-dekat-masjid.webp"
                  alt="Kampus Pesantren Al-Andalus Jonggol"
                  width={600}
                  height={420}
                  className="object-cover w-full h-[240px] sm:h-[320px] md:h-[380px]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />

                {/* Floating bottom card */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${c.bg600} flex items-center justify-center shrink-0`}>
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">PPDB 2026/2027 Dibuka</p>
                      <p className="text-slate-400 text-xs">Angkatan IX · Kuota Terbatas</p>
                    </div>
                    <Link
                      href="/daftar"
                      className={`ml-auto px-4 py-2 rounded-xl text-white text-xs font-bold ${c.bg600} ${c.bgHover} transition shrink-0 flex items-center gap-1`}
                    >
                      Daftar <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating top-right badge */}
              <div className="absolute -top-4 right-0 md:-right-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center gap-2.5 shadow-xl">
                <PiCertificateBold className={`w-6 h-6 ${c.text400} shrink-0`} />
                <div>
                  <p className="text-white text-xs font-bold leading-tight">Terakreditasi Muadalah</p>
                  <p className="text-slate-400 text-[10px]">Setara Internasional</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ §2 STATS BAND — Animated Counters ══════════════════════════════ */}
      <section
        ref={statsRef}
        className="relative py-20 bg-[#0f172a] border-y border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className={`text-xs font-bold uppercase tracking-widest ${c.text400}`}>
              Angka Bicara
            </span>
            <h2 className="text-3xl font-black text-white mt-2 px-6 sm:px-0 text-balance">
              Capaian Nyata yang Kami Banggakan
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <StatCard value={800} suffix="+" label="Alumni" icon={FaUserGraduate} started={statsStarted} delay={0} />
            <StatCard value={400} suffix="+" label="Santri Aktif" icon={Users} started={statsStarted} delay={200} />
            <StatCard value={12} suffix="" label="Tahun Pengalaman" icon={FaTrophy} started={statsStarted} delay={400} />
            <StatCard value={50} suffix="+" label="Perguruan Tinggi" icon={FaUniversity} started={statsStarted} delay={600} />
          </div>
        </div>
      </section>

      {/* ═══ §3 BENTO GRID — Kurikulum TICE ════════════════════════════════ */}
      <section id="program" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest ${c.text600}`}>
              Sistem Pendidikan
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mt-3 mb-4 text-balance">
              Kurikulum{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#059669] to-[#064e3b] pr-1">
                TICE
              </span>
              <span className="block mt-1 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-500">Empat Pilar Pendidikan Unggul</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base md:text-lg">
              Membentuk generasi Muslim yang unggul dalam Iman, Ilmu, dan Karakter di dunia dan akhirat.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* T — Tahfizh (large) */}
            <div className="md:col-span-2 rounded-3xl p-8 bg-gradient-to-br from-[#059669] to-[#064e3b] text-white relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <FaQuran className="w-10 h-10 mb-6 opacity-90" />
              <h3 className="text-2xl font-black mb-3">T — Tahfizh Al-Qur'an</h3>
              <p className="text-white/80 leading-relaxed mb-6">
                Program hafalan Al-Qur'an 30 juz dengan metode Itqan yang teruji. Setiap santri mendapatkan
                bimbingan intensif 26 jam/pekan bersama ustadz hafizh berpengalaman lulusan luar negeri.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm font-bold">
                <Star className="w-4 h-4" /> Target 30 Juz
              </div>
            </div>

            {/* I — Internasional (small) */}
            <div className="rounded-3xl p-8 bg-slate-900 text-white border border-slate-700 group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <Globe className="w-10 h-10 mb-6 text-amber-400" />
              <h3 className="text-xl font-black mb-3">I — Internasional</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Kurikulum nasional + khas Andalus + persiapan kuliah ke luar negeri (Muadalah).
              </p>
              <div className="text-amber-400 font-black text-2xl">50+</div>
              <div className="text-slate-500 text-xs">Perguruan Tinggi Alumni</div>
            </div>

            {/* C — Karakter (small) */}
            <div className="rounded-3xl p-8 bg-emerald-50 border border-emerald-100 group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <Heart className="w-10 h-10 mb-6 text-emerald-600" />
              <h3 className="text-xl font-black mb-3 text-slate-900">C — Karakter Rabbani</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Pembentukan akhlak mulia berdasarkan Al-Qur'an dan As-Sunnah sesuai pemahaman Salafush Shalih.
              </p>
              <div className="text-emerald-600 font-black text-2xl">24/7</div>
              <div className="text-slate-400 text-xs">Lingkungan Kondusif</div>
            </div>

            {/* E — Entrepreneurship (small) */}
            <div className="rounded-3xl p-8 bg-amber-50 border border-amber-100 group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <Briefcase className="w-10 h-10 mb-6 text-amber-600" />
              <h3 className="text-xl font-black mb-3 text-slate-900">E — Entrepreneurship</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Penanaman jiwa kewirausahaan berwawasan global agar santri mandiri dan berdaya sejak dini.
              </p>
              <div className="text-amber-600 font-black text-2xl">Mandiri</div>
              <div className="text-slate-400 text-xs">dan Berdaya</div>
            </div>

            {/* Trilingual (large) */}
            <div className="rounded-3xl p-8 bg-slate-50 border border-slate-200 group hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <Languages className="w-10 h-10 mb-6 text-slate-700" />
              <h3 className="text-xl font-black mb-3 text-slate-900">Trilingual Excellence</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Bahasa Arab (ilmu syar'i), Bahasa Inggris (global), dan Bahasa Indonesia sebagai bahasa pengantar.
              </p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "Arab", Icon: FaMosque },
                  { label: "Inggris", Icon: Globe },
                  { label: "Indonesia", Icon: FaGlobeAsia },
                ].map(({ label, Icon }) => (
                  <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200 rounded-full text-xs font-bold text-slate-700">
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ §4 PAIN vs SOLUTION TABLE ══════════════════════════════════════ */}
      <section className="py-24 bg-[#020617]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest ${c.text400}`}>
              Kekhawatiran Orang Tua
            </span>
            <h2 className="text-4xl font-black text-white mt-3 mb-4">
              Kami Pahami Setiap Keresahan Anda
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Setiap kekhawatiran orang tua adalah prioritas kami. Berikut jawaban nyata dari Al-Andalus.
            </p>
          </header>

          <div className="rounded-3xl overflow-hidden border border-slate-800">
            {/* Table header */}
            <div className="grid grid-cols-2 bg-[#0f172a] border-b border-[#1e293b]">
              <div className="p-5 flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-widest border-r border-slate-800">
                <FaTimesCircle className="w-4 h-4 text-red-500 shrink-0" />
                Kekhawatiran Orang Tua
              </div>
              <div className={`p-5 flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${c.text400}`}>
                <FaCheckCircle className={`w-4 h-4 shrink-0 ${c.text400}`} />
                Jaminan Al-Andalus
              </div>
            </div>

            {[
              { pain: "Anak jauh dari keluarga dan tidak terpantau", fix: "Laporan berkala via WhatsApp + portal online orang tua" },
              { pain: "Kurikulum pesantren vs persiapan kuliah?", fix: "Muadalah diakui setara — alumni masuk UI, UGM, ITB, Al-Azhar" },
              { pain: "Hafalan Qur'an tapi akademik terbengkalai?", fix: "TICE memadukan tahfizh 30 juz + akademik internasional seimbang" },
              { pain: "Fasilitas asrama tidak layak dan tidak nyaman", fix: "Asrama modern, kamar bersih, fasilitas olahraga & lab lengkap" },
              { pain: "Khawatir bullying dan lingkungan teman negatif", fix: "Pembinaan karakter 24/7, guru pengasuh profesional bersertifikat" },
              { pain: "Biaya terlalu mahal dan tidak terjangkau", fix: "Program beasiswa bagi santri berprestasi atau kurang mampu" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-2 border-t border-slate-800 hover:bg-slate-900/60 transition-colors group">
                <div className="p-5 flex items-start gap-3 text-slate-400 text-sm border-r border-slate-800">
                  <AlertTriangle className="w-4 h-4 text-red-500/70 mt-0.5 shrink-0" />
                  {row.pain}
                </div>
                <div className="p-5 flex items-start gap-3 text-slate-200 text-sm font-medium">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${c.text400}`} />
                  {row.fix}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ §5 CARA DAFTAR — Step-by-Step ════════════════════════════════ */}
      <section id="cara-daftar" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Steps */}
            <div>
              <span className={`text-xs font-bold uppercase tracking-widest ${c.text600}`}>
                Proses Pendaftaran
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-3 mb-8 md:mb-12">
                Daftar dalam{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#166534] to-[#14532d]">
                  4 Langkah
                </span>{" "}Mudah
              </h2>

              <ol className="space-y-0">
                {[
                  { num: "01", title: "Isi Formulir Online", desc: "Daftar via website ini. Isi data diri calon santri dengan lengkap dan benar.", Icon: HiOutlineBookOpen },
                  { num: "02", title: "Upload Berkas Dokumen", desc: "Upload foto rapor, foto santri, akte lahir, dan kartu keluarga melalui portal.", Icon: PiCertificateBold },
                  { num: "03", title: "Lakukan Pembayaran", desc: "Bayar biaya seleksi via transfer bank atau metode pembayaran yang tersedia.", Icon: TrendingUp },
                  { num: "04", title: "Ikuti Ujian Seleksi", desc: "Hadir di hari yang ditentukan untuk mengikuti ujian tulis dan wawancara.", Icon: HiAcademicCap },
                ].map((step, i) => (
                  <li key={i} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-2xl ${c.bg600} text-white font-black text-sm flex items-center justify-center shadow-lg ${c.shadow} shrink-0`}>
                        {step.num}
                      </div>
                      {i < 3 && <div className="w-0.5 flex-1 mt-2 mb-2 bg-slate-200" />}
                    </div>
                    <div className="pb-8 pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <step.Icon className={`w-5 h-5 ${c.text600}`} />
                        <h3 className="font-black text-slate-900 text-lg">{step.title}</h3>
                      </div>
                      <p className="text-slate-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <Link
                href="/daftar"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white ${c.bg600} ${c.bgHover} shadow-xl ${c.shadow} transition-all hover:-translate-y-1 group mt-2`}
              >
                Mulai Daftar Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: Terminal + Contact */}
            <div className="space-y-6">
              <div className="rounded-3xl bg-[#020617] border border-[#1e293b] overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-4 bg-[#0f172a] border-b border-[#1e293b]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <Wifi className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-500 text-sm">ppdb-alandalus — status realtime</span>
                  </div>
                </div>
                <div className="p-6 font-mono text-sm space-y-2">
                  <p className="text-slate-600">$ cek status PPDB 2026/2027...</p>
                  <p>
                    <span className={c.text400}>▸</span>{" "}
                    <span className="text-white">Status Pendaftaran</span>{" "}
                    <span className="text-green-400 font-bold">✓ DIBUKA</span>
                  </p>
                  <p>
                    <span className={c.text400}>▸</span>{" "}
                    <span className="text-white">Angkatan</span>{" "}
                    <span className="text-amber-400">IX (2026/2027)</span>
                  </p>
                  <p>
                    <span className={c.text400}>▸</span>{" "}
                    <span className="text-white">Lokasi</span>{" "}
                    <span className="text-slate-400">Sukamakmur, Jonggol, Bogor</span>
                  </p>
                  <p>
                    <span className={c.text400}>▸</span>{" "}
                    <span className="text-slate-600">kuota terbatas — daftar segera...</span>
                  </p>
                  <p>
                    <span className="text-green-400">✓</span>{" "}
                    <span className="text-slate-300">Formulir online tersedia 24/7</span>
                  </p>
                </div>
              </div>

              {/* Contact Card */}
              <div className={`rounded-3xl p-6 ${c.bg50} border ${c.border200}`}>
                <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Phone className={`w-5 h-5 ${c.text600}`} />
                  Butuh Bantuan? Hubungi Kami
                </h4>
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/${BRANDING.contact.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-slate-700 hover:text-slate-900 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
                      <FaWhatsapp className="w-4 h-4 text-white" />
                    </div>
                    <span className="group-hover:underline font-medium">{BRANDING.contact.whatsapp}</span>
                  </a>
                  <div className="flex items-start gap-3 text-sm text-slate-500">
                    <div className="w-9 h-9 rounded-xl bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                      <FaMapMarkerAlt className="w-4 h-4 text-slate-500" />
                    </div>
                    <span className="leading-relaxed">{BRANDING.contact.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ §6 ALUMNI MARQUEE ══════════════════════════════════════════════ */}
      <section className="py-16 bg-[#052e16] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <span className={`text-xs font-bold uppercase tracking-widest ${c.text400}`}>
            Jejak Alumni
          </span>
          <h2 className="text-2xl font-black text-white mt-2 flex items-center justify-center gap-2">
            <FaGlobeAsia className={`w-6 h-6 ${c.text400}`} />
            Tersebar di 3 Benua, 50+ Perguruan Tinggi
          </h2>
        </div>
        <InfiniteMarquee />
      </section>

      {/* ═══ §7 FEATURE GRID ════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest ${c.text600}`}>
              Fasilitas dan Keunggulan
            </span>
            <h2 className="text-4xl font-black text-slate-900 mt-3">
              Semua yang Dibutuhkan Santri,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#166534] to-[#14532d]">
                Tersedia
              </span>
            </h2>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { Icon: HiOutlineBookOpen, title: "Kurikulum Internasional", desc: "Perpaduan kurikulum nasional dan khas Andalus dengan pengakuan Muadalah setara internasional." },
              { Icon: FaShieldAlt, title: "Asrama Premium", desc: "Lingkungan asrama bersih, aman, nyaman dengan pengawasan 24 jam penuh oleh ustadz pengasuh." },
              { Icon: Award, title: "Tenaga Didik Expert", desc: "Asatidz lulusan Universitas Islam Madinah, Al-Azhar Mesir, LIPIA, dan perguruan tinggi terkemuka." },
              { Icon: FaGlobeAsia, title: "Jaringan Global", desc: "Alumni tersebar di 3 benua: Asia, Afrika (Mesir), dan Oseania (New Zealand, Hong Kong)." },
              { Icon: Microscope, title: "Lab dan Fasilitas Modern", desc: "Laboratorium IPA, lab bahasa, perpustakaan digital, lapangan olahraga, dan masjid kampus." },
              { Icon: Medal, title: "Program Beasiswa", desc: "Tersedia program beasiswa penuh dan parsial bagi santri berprestasi dan dari keluarga kurang mampu." },
            ].map((feat, i) => (
              <div
                key={i}
                className={`group p-6 rounded-3xl border border-slate-100 bg-white hover:border-slate-200 hover:-translate-y-1 hover:shadow-xl transition-all`}
              >
                <div className={`w-12 h-12 rounded-2xl ${c.bg50} ${c.text600} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feat.Icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-2">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ §8 SOCIAL PROOF — University Grid ══════════════════════════════ */}
      <section className="py-20 bg-[#052e16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest mb-10 flex items-center justify-center gap-2">
            <FaTrophy className={`w-4 h-4 ${c.text400}`} />
            Alumni Diterima di Perguruan Tinggi Terkemuka Dunia
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: "Univ. Islam Madinah", Icon: FaMosque },
              { label: "Al-Azhar, Mesir", Icon: FaUniversity },
              { label: "Auckland, NZ", Icon: Globe },
              { label: "HK Polytechnic", Icon: Building2 },
              { label: "LIPIA Jakarta", Icon: FaQuran },
              { label: "UI", Icon: HiAcademicCap },
              { label: "UGM", Icon: HiAcademicCap },
              { label: "ITB", Icon: HiOutlineCpuChip },
              { label: "Univ. Brawijaya", Icon: FaUniversity },
              { label: "Univ. Airlangga", Icon: FaUniversity },
              { label: "Undip", Icon: FaUniversity },
              { label: "UUM Malaysia", Icon: FaGlobeAsia },
              { label: "UIN Jakarta", Icon: FaMosque },
              { label: "IPB University", Icon: PiPlantBold },
            ].map(({ label, Icon }, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors text-center"
              >
                <Icon className={`w-6 h-6 ${c.text400}`} />
                <span className="text-slate-400 text-xs font-medium leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ §9 GALERI FOTO PESANTREN ═══════════════════════════════════════ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <span className={`text-xs font-bold uppercase tracking-widest ${c.text600}`}>Galeri</span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">Lihat Langsung Kampus Kami</h2>
          </header>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { src: "/images/halaman-dekat-masjid.webp", label: "Area Masjid" },
              { src: "/images/asrama.webp", label: "Asrama Santri" },
              { src: "/images/tahfidz.webp", label: "Halaqah Tahfizh" },
              { src: "/images/kelas-dari-dalam.webp", label: "Kelas Modern" },
              { src: "/images/lapangan-minisoccer.webp", label: "Lapangan Olahraga" },
              { src: "/images/gedung-utama-dan-lapangan-basket.webp", label: "Gedung Utama" },
            ].map((photo, i) => (
              <div key={i} className="relative group overflow-hidden rounded-2xl aspect-video">
                <Image
                  src={photo.src}
                  alt={photo.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm font-bold">{photo.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/galeri"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm ${c.text600} border-2 ${c.border200} transition-all`}
            >
              Lihat Semua Galeri <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ §9.5 TESTIMONIAL — Suara Orang Tua ══════════════════════════════ */}
      <section className="py-24 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest ${c.text400}`}>
              Suara Orang Tua
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 mb-4 text-balance px-4 sm:px-0">
              Mereka Sudah{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#d97706] pr-1">
                Membuktikannya
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Dengarkan langsung dari para orang tua yang telah mempercayakan pendidikan putra mereka kepada Al-Andalus.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:-translate-y-2 hover:shadow-2xl hover:bg-white/[0.08] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-lg shrink-0"
                    style={{ background: "linear-gradient(135deg, #059669, #064e3b)" }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm leading-tight">{t.name}</p>
                    <p className="text-slate-400 text-xs mt-0.5">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <FaStar key={j} className="w-3.5 h-3.5 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ §10 FINAL CTA ══════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-[100px] bg-[#166534]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 mb-6`}
            style={{ backgroundColor: "rgba(5,150,105,0.15)" }}>
            <FaHandshake className={`w-4 h-4 ${c.text400}`} />
            <span className={`text-xs font-bold uppercase tracking-widest ${c.text400}`}>
              Bergabunglah Bersama Kami
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Siapkan Putra Anda untuk{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#d97706]">
              Masa Depan Gemilang
            </span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Bergabunglah bersama ratusan keluarga yang telah mempercayakan pendidikan putra mereka
            kepada Al-Andalus selama 12 tahun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/daftar"
              className={`inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold text-white text-lg ${c.bg600} ${c.bgHover} shadow-2xl ${c.shadow} transition-all hover:-translate-y-1 group`}
            >
              <GraduationCap className="w-5 h-5" />
              Daftar Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={`https://wa.me/${BRANDING.contact.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-bold text-white text-lg bg-green-600 hover:bg-green-700 transition-all hover:-translate-y-1 shadow-xl shadow-green-500/20"
            >
              <FaWhatsapp className="w-5 h-5" />
              WhatsApp Kami
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 text-slate-600 text-sm">
            {[
              { Icon: CheckCircle2, label: "Formulir gratis" },
              { Icon: FaShieldAlt, label: "Panduan lengkap" },
              { Icon: FaHandshake, label: "Tim siap membantu" },
            ].map(({ Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5">
                <Icon className={`w-4 h-4 ${c.text400}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
