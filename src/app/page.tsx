"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BRANDING, IS_PUTRA } from "@/config/branding";
import {
  ArrowRight,
  BookOpen,
  Award,
  ShieldCheck,
  CheckCircle2,
  Check,
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
  XCircle,
  Microscope,
  Star,
  ChevronRight,
  Wifi,
  Medal,
  Building2,
  Users,
  UserPlus,
  FileText,
  CreditCard,
  BellRing,
  ClipboardCheck,
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
  FaHandshake,
  FaMapMarkerAlt,
  FaTrophy,
} from "react-icons/fa";
import { HiAcademicCap, HiOutlineBookOpen } from "react-icons/hi";
import { HiOutlineCpuChip } from "react-icons/hi2";
import { PiCertificateBold, PiPlantBold, PiBookOpenTextBold } from "react-icons/pi";

// ————————————————————————————————————————————————————————————————————————————————————
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

// â”€â”€â”€ Counter Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StatCard({
  value,
  suffix = "",
  label,
  icon: Icon,
  started,
  delay = 0 }: {
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
  const primaryBg = IS_PUTRA ? "bg-primary-500/10" : "bg-pink-500/10";
  return (
    <div className="text-center group">
      <div className={`w-14 h-14 rounded-xl ${primaryBg} flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`w-7 h-7 ${primaryColor}`} />
      </div>
      <div className={`text-4xl sm:text-5xl lg:text-6xl font-black ${primaryColor}`}>
        {count}{suffix}
      </div>
      <div className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

// â”€â”€â”€ Infinite Marquee â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const alumniItems = [
  { label: "Universitas Islam Madinah", Icon: Building2 },
  { label: "Yarmouk University, Jordan", Icon: Building2 },
  { label: "Universitas di Syiria", Icon: Building2 },
  { label: "STIBA Ar Raayah", Icon: FaQuran },
  { label: "Al-Azhar University, Mesir", Icon: Building2 },
  { label: "Universiti Utara Malaysia", Icon: Globe },
  { label: "HK Polytechnic University", Icon: Building2 },
  { label: "University of Auckland, NZ", Icon: Globe },
  { label: "Universitas Indonesia (UI)", Icon: GraduationCap },
  { label: "Universitas Gadjah Mada", Icon: GraduationCap },
  { label: "Institut Teknologi Bandung", Icon: HiOutlineCpuChip },
  { label: "Universitas Diponegoro", Icon: Building2 },
  { label: "Universitas Brawijaya", Icon: Building2 },
  { label: "Universitas Airlangga", Icon: Building2 },
  { label: "LIPIA Jakarta", Icon: FaQuran },
  { label: "UIN Syarif Hidayatullah", Icon: Building2 },
  { label: "IPB University", Icon: PiPlantBold },
];

function InfiniteMarquee() {
  const primaryBorder = IS_PUTRA ? "border-primary-800/60" : "border-sky-800/60";
  const primaryBg = IS_PUTRA ? "bg-primary-950/60" : "bg-sky-950/60";
  const primaryText = IS_PUTRA ? "text-primary-300" : "text-sky-300";
  const iconColor = IS_PUTRA ? "text-primary-500" : "text-pink-500";

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

// â”€â”€â”€ Testimonials Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TESTIMONIALS = [
  { initial: "I", name: "Bapak Irfan H.", role: "Orang Tua Santri · Jakarta", quote: "Awalnya khawatir anak jauh dari keluarga. Tapi setelah setahun, dia justru lebih mandiri dan hafalannya sudah 15 juz. Alhamdulillah." },
  { initial: "R", name: "Ibu Rahmawati", role: "Orang Tua Santri · Bandung", quote: `Komunikasi dengan pihak pesantren sangat baik. Laporan perkembangan ${IS_PUTRA ? "putra" : "putri"} kami rutin dikirim via WhatsApp, jadi saya benar-benar tenang.` },
  { initial: "D", name: "Bapak Dedy S.", role: "Orang Tua Santri · Surabaya", quote: "Anak saya yang dulu malas sholat, kini jadi imam masjid kampung saat liburan. Perubahan yang tidak pernah kami bayangkan sebelumnya." },
  { initial: "F", name: "Ibu Fitri A.", role: "Orang Tua Santri · Bekasi", quote: "Kurikulum TICE ini memang berbeda. Anak hafal Qur'an sekaligus lancar berbahasa Arab dan Inggris. Dua kebaikan yang kami dapat sekaligus." },
  { initial: "H", name: "Bapak Hendra P.", role: "Orang Tua Santri · Medan", quote: "Tahun pertama sempat ragu. Tapi melihat perubahan karakter dan prestasi anak dalam dua tahun ini, tidak ada yang kami sesalkan." },
  { initial: "S", name: "Ibu Sari M.", role: "Orang Tua Santri · Bogor", quote: "Fasilitas asramanya bersih dan terjaga. Anak saya betah dan tidak minta pindah — itu saja sudah membuktikan kualitas pesantrennya." },
];

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
    text600:    IS_PUTRA ? "text-primary-600"  : "text-pink-600",
    text400:    IS_PUTRA ? "text-primary-400"  : "text-sky-400",
    bg600:      IS_PUTRA ? "bg-emerald-800"    : "bg-pink-600",
    bgHover:    IS_PUTRA ? "hover:bg-primary-700" : "hover:bg-sky-700",
    shadow:     IS_PUTRA ? "shadow-primary-500/30" : "shadow-sky-500/30",
    border200:  IS_PUTRA ? "border-primary-200" : "border-pink-200",
    bg50:       IS_PUTRA ? "bg-primary-50"     : "bg-pink-50",
    bgDark:     IS_PUTRA ? "bg-primary-950"    : "bg-sky-950",
    bg950:      IS_PUTRA ? "bg-primary-950"    : "bg-sky-950",
    ring:       IS_PUTRA ? "ring-primary-500/30" : "ring-sky-500/30" };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">

      {/* ——— ANNOUNCEMENT BAR —————————————————————————————————————————————————————————— */}
      <div className={`w-full py-2 sm:py-2.5 text-xs font-bold text-white ${c.bg600} flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-8`}>
        <Zap className="w-3.5 h-3.5 shrink-0" />
        <span className="sm:hidden">PPDB 2027/2028 — Kuota Terbatas!</span>
        <span className="hidden sm:inline">Pendaftaran Santri Baru 2027/2028 Telah Dibuka — Kuota Terbatas!</span>
        <Link href="/ppdb" className="inline-flex items-center gap-1.5 ml-2 px-4 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md hover:scale-105 transition-all shrink-0">
          <span>Daftar</span>
          <ChevronRight className="w-3 h-3 stroke-[3]" />
        </Link>
      </div>

      {/* ——— §1 HERO SECTION — SPLIT DARK ————————————————————————————————————————————— */}
      <section
        id="hero"
        className="relative flex items-center bg-[#020617] pt-8 sm:pt-12 md:pt-14 pb-12 sm:pb-16 md:pb-16 overflow-hidden"
      >
        {/* Animated glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`hidden md:block absolute top-0 left-1/3 w-full max-w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] bg-[#166534]`}
            style={{ transform: `translateY(${scrollY * 0.08}px)` }}
          />
          <div
            className="hidden md:block absolute bottom-0 right-1/3 w-full max-w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] bg-amber-600"
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(#ffffff 1px,transparent 1px),linear-gradient(90deg,#ffffff 1px,transparent 1px)`,
              backgroundSize: "60px 60px" }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-4 md:py-4 lg:py-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center">

            {/* LEFT */}
            <div className="space-y-4 sm:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 ">
                <span className="relative flex h-2.5 w-2.5 shrink-0">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${IS_PUTRA ? "bg-primary-400" : "bg-pink-400"}`} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${IS_PUTRA ? "bg-primary-400" : "bg-pink-400"}`} />
                </span>
                <Building2 className={`w-3.5 h-3.5 ${c.text400}`} />
                <span className="text-white/90 text-xs font-bold uppercase tracking-widest">
                  Pesantren Islam Internasional · Jonggol, Bogor
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif italic font-black text-white leading-[1.1] tracking-tight">
                  Cetak Generasi{" "}
                  <span className="box-decoration-clone text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] to-[#d97706] pr-2 md:pr-4">
                    Rabbani
                  </span>{" "}
                  Berkelas Dunia.
                </h1>
                <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed text-left">
                  Kurikulum <strong className="text-white">TICE</strong> — Tahfizh Al-Qur'an, Internasional,
                  Karakter Mulia, dan Entrepreneurship. Bergabung bersama{" "}
                  <strong className="text-white">Ribuan santri berprestasi</strong> di lingkungan asrama terbaik.
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/ppdb"
                  className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base ${c.bg600} ${c.bgHover} shadow-lg ${c.shadow} transition-all hover:-translate-y-1 hover:shadow-lg group`}
                >
                  Daftar Sekarang
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="https://pesantren-alandalus.com/profile/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base bg-white/10 hover:bg-white/20 border border-white/20 transition-all hover:-translate-y-1"
                >
                  <PiBookOpenTextBold className="w-5 h-5" />
                  Profil Pesantren
                </a>
              </div>

              {/* Stat Row */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 border-t border-white/10">
                {[
                  { val: "2013", label: "Tahun Berdiri", Icon: Star },
                  { val: "A", label: "Akreditasi", Icon: GraduationCap },
                  { val: "1000+", label: "Santri & Alumni", Icon: Users },
                  { val: "Jejaring", label: "3 Benua", Icon: Globe },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {i > 0 && <span className="text-slate-700">·</span>}
                    <s.Icon className={`w-3.5 h-3.5 ${c.text400} shrink-0`} />
                    <span className="text-white font-black text-sm">{s.val}</span>
                    <span className="text-slate-300 text-[13px] font-medium tracking-wide">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Image + floating cards */}
            <div className="relative flex justify-center lg:justify-end mt-8 lg:mt-0">
              <div className="relative w-full max-w-lg">
                
                {/* Image Container */}
                <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-lg shadow-black/50 w-full">
                  <Image
                    src="/images/gedung-utama-putra.jpeg"
                    alt="Pesantren Al-Andalus Jonggol"
                    width={600}
                    height={420}
                    className="object-cover object-top w-full h-[280px] sm:h-[360px] md:h-[420px]"
                    priority
                  />
                  {/* Lighter gradient since text is no longer inside */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent" />
                </div>

                {/* Floating bottom card - Now floating outside the image */}
                <div className="relative -mt-6 sm:-mt-8 mx-4 sm:-mx-6 z-20">
                  <div className="bg-slate-900/80  border border-white/20 rounded-xl p-4 sm:p-5 flex items-center gap-4 shadow-lg shadow-black/40 ring-1 ring-white/10">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${c.bg600} flex items-center justify-center shrink-0`}>
                      <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm sm:text-base">PPDB 2027/2028 Dibuka</p>
                      <p className="text-amber-300 text-[11px] sm:text-xs font-bold tracking-wide drop-shadow-lg shadow-emerald-900/20">Angkatan ke-15 · Kuota Terbatas</p>
                    </div>
                    <Link
                      href="/ppdb"
                      className={`ml-auto px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-white text-xs sm:text-sm font-bold ${c.bg600} ${c.bgHover} transition shrink-0 flex items-center gap-1.5 shadow-lg`}
                    >
                      Daftar <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </Link>
                  </div>
                </div>

                {/* Floating top-right badge - Also slightly adjusted to pop out */}
                <div className="absolute -top-4 right-0 md:-right-6 bg-slate-900/80  border border-white/30 rounded-xl p-3 flex items-center gap-2.5 shadow-lg ring-1 ring-white/10 z-20">
                  <Award className={`w-6 h-6 ${c.text400} shrink-0`} />
                  <div>
                    <p className="text-white text-[11px] font-bold leading-tight">Terakreditasi Muadalah</p>
                    <p className="text-amber-300 text-xs font-black tracking-wide drop-shadow-lg shadow-emerald-900/20">Setara Internasional</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â•â•â• Â§2 STATS BAND — Animated Counters â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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
            <StatCard value={700} suffix="+" label="Alumni" icon={FaUserGraduate} started={statsStarted} delay={0} />
            <StatCard value={500} suffix="+" label="Santri Aktif" icon={Users} started={statsStarted} delay={200} />
            <StatCard value={13} suffix="" label="Tahun Pengalaman" icon={FaTrophy} started={statsStarted} delay={400} />
            <StatCard value={50} suffix="+" label="Perguruan Tinggi" icon={FaUniversity} started={statsStarted} delay={600} />
          </div>
        </div>
      </section>

      {/* â•â•â• Â§3 BENTO GRID — Kurikulum TICE â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="program" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest ${c.text600}`}>
              Sistem Pendidikan
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mt-3 mb-4 text-balance">
              Kurikulum{" "}
              <span className="text-emerald-700 font-black">TICE</span>
              <span className="block mt-1 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-500">Empat Pilar Pendidikan Unggul</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-base md:text-lg">
              Membentuk generasi Muslim yang unggul dalam Iman, Ilmu, dan Karakter di dunia dan akhirat.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* T — Tahfizh (large) */}
            <div className="md:col-span-2 rounded-xl p-8 bg-emerald-900 border border-emerald-500/30 text-white relative overflow-hidden group hover:-translate-y-2 hover:shadow-lg transition-all duration-300 shadow-md" style={{ background: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #022c22 100%)" }}>
              <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <BookOpen className="w-10 h-10 mb-6 opacity-90" />
              <h3 className="text-2xl font-black mb-3 text-white">T — Tahfizh Al-Qur'an</h3>
              <p className="text-white/80 leading-relaxed mb-6">
                Program hafalan Al-Qur'an 30 juz dengan metode Itqan yang teruji. Setiap santri mendapatkan
                bimbingan intensif 26 jam/pekan bersama ustadz hafizh berpengalaman lulusan luar negeri.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm font-bold">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" /> Target 30 Juz
              </div>
            </div>

            {/* I — Internasional (small) */}
            <div className="rounded-xl p-8 bg-slate-900 text-white border border-slate-700 group hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
              <Globe className="w-10 h-10 mb-6 text-amber-400" />
              <h3 className="text-xl font-black mb-3 text-white">I — Internasional</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Kurikulum nasional + khas Andalus + persiapan kuliah ke luar negeri (Muadalah).
              </p>
              <div className="text-amber-400 font-black text-2xl">50+</div>
              <div className="text-slate-500 text-xs">Perguruan Tinggi Alumni</div>
            </div>

            {/* C — Karakter (small) */}
            <div className="rounded-xl p-8 bg-emerald-50 border border-emerald-100 group hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
              <Heart className="w-10 h-10 mb-6 text-emerald-600" />
              <h3 className="text-xl font-black mb-3 text-slate-900">C — Karakter Rabbani</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Pembentukan akhlak mulia berdasarkan Al-Qur'an dan As-Sunnah sesuai pemahaman Salafush Shalih.
              </p>
              <div className="text-emerald-600 font-black text-2xl">24/7</div>
              <div className="text-slate-400 text-xs">Lingkungan Kondusif</div>
            </div>

            {/* E — Entrepreneurship (small) */}
            <div className="rounded-xl p-8 bg-amber-50 border border-amber-100 group hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
              <Briefcase className="w-10 h-10 mb-6 text-amber-600" />
              <h3 className="text-xl font-black mb-3 text-slate-900">E — Entrepreneurship</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Penanaman jiwa kewirausahaan berwawasan global agar santri mandiri dan berdaya sejak dini.
              </p>
              <div className="text-amber-600 font-black text-2xl">Mandiri</div>
              <div className="text-slate-400 text-xs">dan Berdaya</div>
            </div>

            {/* Trilingual (large) */}
            <div className="rounded-xl p-8 bg-slate-50 border border-slate-200 group hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
              <Languages className="w-10 h-10 mb-6 text-slate-700" />
              <h3 className="text-xl font-black mb-3 text-slate-900">Trilingual Excellence</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Bahasa Arab (ilmu syar'i), Bahasa Inggris (global), dan Bahasa Indonesia sebagai bahasa pengantar.
              </p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "Arab", Icon: Building2 },
                  { label: "Inggris", Icon: Globe },
                  { label: "Indonesia", Icon: Globe },
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

      {/* â•â•â• Â§4 PAIN vs SOLUTION TABLE â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="py-24 bg-[#020617]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest ${c.text400}`}>
              Kekhawatiran Orang Tua
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mt-3 mb-4">
              Kami Pahami Setiap Keresahan Anda
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Setiap kekhawatiran orang tua adalah prioritas kami. Berikut jawaban nyata dari Al-Andalus.
            </p>
          </header>

          <div className="rounded-xl overflow-hidden border border-slate-800">
            {/* Table header */}
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-[#0f172a] border-b border-[#1e293b]">
              <div className="p-5 flex items-center gap-2 text-slate-500 text-sm font-bold uppercase tracking-widest border-r border-slate-800">
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                Kekhawatiran Orang Tua
              </div>
              <div className={`p-5 flex items-center gap-2 text-sm font-bold uppercase tracking-widest ${c.text400}`}>
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${c.text400}`} />
                Jaminan Al-Andalus
              </div>
            </div>

            {[
              { pain: "Anak jauh dari keluarga dan tidak terpantau", fix: "Laporan berkala via WhatsApp + portal online orang tua" },
              { pain: "Kurikulum pesantren vs persiapan kuliah?", fix: "Muadalah diakui setara — alumni masuk UI, UGM, ITB, Al-Azhar" },
              { pain: "Hafalan Qur'an tapi akademik terbengkalai?", fix: "TICE memadukan tahfizh 30 juz + akademik internasional seimbang" },
              { pain: "Fasilitas asrama tidak layak dan tidak nyaman", fix: "Asrama modern, kamar bersih, fasilitas olahraga & lab lengkap" },
              { pain: "Khawatir bullying dan lingkungan teman negatif", fix: "Pembinaan karakter 24/7, guru pengasuh profesional bersertifikat" },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-2 border-t border-slate-800 hover:bg-slate-900/60 transition-colors group">
                <div className="p-5 flex items-start gap-3 text-slate-400 text-sm border-r border-slate-800">
                  <XCircle className="w-4 h-4 text-red-500/70 mt-0.5 shrink-0" />
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

      {/* â•â•â• Â§5 CARA DAFTAR — Step-by-Step â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section id="cara-daftar" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Steps */}
            <div>
              <span className={`text-xs font-bold uppercase tracking-widest ${c.text600}`}>
                Proses Pendaftaran
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mt-3 mb-8 md:mb-12">
                Daftar dalam{" "}
                <span className="text-emerald-700 font-black">7 Langkah</span>{" "}Mudah
              </h2>

              <ol className="space-y-0">
                {[
                  { num: "01", title: "Buat Akun", desc: "Mendaftar dan mengisi form pendaftaran awal.", Icon: UserPlus },
                  { num: "02", title: "Pembayaran", desc: "Membayar biaya pendaftaran seleksi calon santri baru.", Icon: CreditCard },
                  { num: "03", title: "Lengkapi Data", desc: "Mengisi data lengkap calon santri dan orangtua/wali.", Icon: FileText },
                  { num: "04", title: "Upload Berkas", desc: "Upload berkas persyaratan (Rapor, KK, Akte, dll).", Icon: ClipboardCheck },
                  { num: "05", title: "Tes Seleksi", desc: "Mengikuti ujian tes tertulis dan wawancara.", Icon: GraduationCap },
                  { num: "06", title: "Pengumuman", desc: "Pengumuman hasil kelulusan seleksi PPDB.", Icon: BellRing },
                  { num: "07", title: "Daftar Ulang", desc: "Membayar uang pangkal dan SPP bulan pertama.", Icon: CheckCircle2 },
                ].map((step, i) => (
                  <li key={i} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-xl ${c.bg600} text-white font-black text-sm flex items-center justify-center shadow-lg ${c.shadow} shrink-0`}>
                        {step.num}
                      </div>
                      {i < 6 && <div className="w-0.5 flex-1 mt-2 mb-2 bg-slate-200" />}
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
                href="/ppdb"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white ${c.bg600} ${c.bgHover} shadow-lg ${c.shadow} transition-all hover:-translate-y-1 group mt-2`}
              >
                Mulai Daftar Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: Terminal + Contact */}
            <div className="space-y-6">
              <div className="rounded-xl bg-[#020617] border border-[#1e293b] overflow-hidden">
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
                  <p className="text-slate-600">$ cek status PPDB 2027/2028...</p>
                  <p>
                    <span className={c.text400}>â–¸</span>{" "}
                    <span className="text-white">Status Pendaftaran</span>{" "}
                    <span className="text-green-400 font-bold inline-flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> DIBUKA
                    </span>
                  </p>
                  <p>
                    <span className={c.text400}>â–¸</span>{" "}
                    <span className="text-white">Tahun Ajaran</span>{" "}
                    <span className="text-amber-400">IX (2027/2028)</span>
                  </p>
                  <p>
                    <span className={c.text400}>â–¸</span>{" "}
                    <span className="text-white">Lokasi</span>{" "}
                    <span className="text-slate-400">Sukamakmur, Jonggol, Bogor</span>
                  </p>
                  <p>
                    <span className={c.text400}>â–¸</span>{" "}
                    <span className="text-slate-600">kuota terbatas — daftar segera...</span>
                  </p>
                  <p className="flex items-center gap-1 text-slate-300">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />{" "}
                    <span>Formulir online tersedia 24/7</span>
                  </p>
                </div>
              </div>

              {/* Contact Card */}
              <div className={`rounded-xl p-6 ${c.bg50} border ${c.border200}`}>
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

      {/* â•â•â• Â§6 ALUMNI MARQUEE â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="py-16 bg-[#052e16] border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <span className={`text-xs font-bold uppercase tracking-widest ${c.text400}`}>
            Jejak Alumni
          </span>
          <h2 className="text-2xl font-black text-white mt-2 flex items-center justify-center gap-2">
            <Globe className={`w-6 h-6 ${c.text400}`} />
            Tersebar di 3 Benua, 50+ Perguruan Tinggi
          </h2>
        </div>
        <InfiniteMarquee />
      </section>

      {/* â•â•â• Â§7 FEATURE GRID â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest ${c.text600}`}>
              Fasilitas dan Keunggulan
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 mt-3">
              Semua yang Dibutuhkan Santri,{" "}
              <span className="text-emerald-700 font-black">Tersedia</span>
            </h2>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { Icon: HiOutlineBookOpen, title: "Kurikulum Internasional", desc: "Perpaduan kurikulum nasional dan khas Andalus dengan pengakuan Muadalah setara internasional." },
              { Icon: FaShieldAlt, title: "Asrama Premium", desc: "Lingkungan asrama bersih, aman, nyaman dengan pengawasan 24 jam penuh oleh ustadz pengasuh." },
              { Icon: Award, title: "Tenaga Didik Expert", desc: "Asatidz lulusan Universitas Islam Madinah, Al-Azhar Mesir, LIPIA, dan perguruan tinggi terkemuka." },
              { Icon: Globe, title: "Jaringan Global", desc: "Alumni tersebar di 3 benua: Asia, Afrika (Mesir), dan Oseania (New Zealand, Hong Kong)." },
              { Icon: Microscope, title: "Lab dan Fasilitas Modern", desc: "Laboratorium IPA, lab bahasa, perpustakaan digital, lapangan olahraga, dan masjid pesantren." },
            ].map((feat, i) => (
              <div
                key={i}
                className={`group p-6 rounded-xl border border-slate-100 bg-white hover:border-slate-200 hover:-translate-y-1 hover:shadow-lg transition-all`}
              >
                <div className={`w-12 h-12 rounded-xl ${c.bg50} ${c.text600} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <feat.Icon className="w-6 h-6" />
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-2">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â•â• Â§8 SOCIAL PROOF — University Grid â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="py-20 bg-[#052e16]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest mb-10 flex items-center justify-center gap-2">
            <Award className={`w-4 h-4 ${c.text400}`} />
            Alumni Diterima di Perguruan Tinggi Terkemuka Dunia
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: "Univ. Islam Madinah", Icon: Building2 },
              { label: "Yarmouk, Jordan", Icon: Building2 },
              { label: "Univ. di Syiria", Icon: Building2 },
              { label: "STIBA Ar Raayah", Icon: FaQuran },
              { label: "Al-Azhar, Mesir", Icon: Building2 },
              { label: "Auckland, NZ", Icon: Globe },
              { label: "HK Polytechnic", Icon: Building2 },
              { label: "LIPIA Jakarta", Icon: FaQuran },
              { label: "UI", Icon: GraduationCap },
              { label: "UGM", Icon: GraduationCap },
              { label: "ITB", Icon: HiOutlineCpuChip },
              { label: "Univ. Brawijaya", Icon: Building2 },
              { label: "Univ. Airlangga", Icon: Building2 },
              { label: "Undip", Icon: Building2 },
              { label: "UUM Malaysia", Icon: Globe },
              { label: "UIN Jakarta", Icon: Building2 },
              { label: "IPB University", Icon: PiPlantBold },
            ].map(({ label, Icon }, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 transition-colors text-center"
              >
                <Icon className={`w-6 h-6 ${c.text400}`} />
                <span className="text-slate-400 text-xs font-medium leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â•â•â• Â§9 GALERI FOTO PESANTREN â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <span className={`text-xs font-bold uppercase tracking-widest ${c.text600}`}>Galeri</span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">Lihat Langsung Pesantren Kami</h2>
          </header>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { src: "/images/gedung-utama-putra.jpeg", label: "Gedung Utama & Kompleks Pesantren" },
              { src: "/images/masjid-1.jpg", label: "Masjid Area Putra" },
              { src: "/images/lapangan-futsal-1.jpeg", label: "Lapangan Futsal Pesantren" },
              { src: "/images/lapangan-basket-1.jpeg", label: "Lapangan Basket Santri" },
              { src: "/images/drone-pesantren-1.jpeg", label: "Panorama Udara Pesantren" },
              { src: "/images/tangga-selasar.jpeg", label: "Akses Tangga Masjid & Selasar" },
            ].map((photo, i) => (
              <div key={i} className="relative group overflow-hidden rounded-xl aspect-video bg-slate-200 shadow-sm border border-slate-200">
                <Image
                  src={photo.src}
                  alt={photo.label}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm font-bold">{photo.label}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/galeri"
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm ${c.text600} border-2 ${c.border200} transition-all`}
            >
              Lihat Semua Galeri <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* â•â•â• Â§9.5 TESTIMONIAL — Suara Orang Tua â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="py-24 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <span className={`text-xs font-bold uppercase tracking-widest ${c.text400}`}>
              Suara Orang Tua
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 mb-4 text-balance px-4 sm:px-0">
              Mereka Sudah{" "}
              <span className="text-amber-400 font-black pr-1">Membuktikannya</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Dengarkan langsung dari para orang tua yang telah mempercayakan pendidikan {IS_PUTRA ? "putra" : "putri"} mereka kepada Al-Andalus.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:-translate-y-2 hover:shadow-lg hover:bg-white/[0.08] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0"
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
                    <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
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

      {/* â•â•â• Â§10 FINAL CTA â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="py-24 bg-[#0f172a] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[400px] rounded-full opacity-20 blur-[100px] bg-[#166534]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 mb-6`}
            style={{ backgroundColor: "rgba(5,150,105,0.15)" }}>
            <FaHandshake className={`w-4 h-4 ${c.text400}`} />
            <span className={`text-xs font-bold uppercase tracking-widest ${c.text400}`}>
              Bergabunglah Bersama Kami
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-6">
            Siapkan {IS_PUTRA ? "Putra" : "Putri"} Anda untuk{" "}
            <span className="text-amber-400 font-black">Masa Depan Gemilang</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Bergabunglah bersama ratusan keluarga yang telah mempercayakan pendidikan {IS_PUTRA ? "putra" : "putri"} mereka
            kepada Al-Andalus selama 12 tahun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ppdb"
              className={`inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-lg ${c.bg600} ${c.bgHover} shadow-lg ${c.shadow} transition-all hover:-translate-y-1 group`}
            >
              <GraduationCap className="w-5 h-5" />
              Daftar Sekarang
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={`https://wa.me/${BRANDING.contact.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-lg bg-green-600 hover:bg-green-700 transition-all hover:-translate-y-1 shadow-lg shadow-green-500/20"
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
    </div>
  );
}










