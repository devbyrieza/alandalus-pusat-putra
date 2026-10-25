"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  Users,
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle,
  FileText,
  Sparkles,
  ArrowRight,
  Loader2,
  Check,
  HelpCircle,
  Download,
  CreditCard,
  ChevronRight,
  Phone,
  Target,
  Shield,
  Star,
  MapPin,
  Clock,
  Copy } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { motion, AnimatePresence } from "framer-motion";

// ========================================
// REUSABLE COMPONENTS
// ========================================

const StatCard = ({
  label,
  value,
  icon: Icon,
  delay,
}: {
  label: string;
  value: string;
  icon: any;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all text-center group relative overflow-hidden"
  >
    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-emerald-50/80 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-inner border border-emerald-100/50">
      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" />
    </div>
    <div className="font-display font-black text-base sm:text-xl md:text-2xl text-slate-900 mb-1 leading-snug tracking-tight">
      {value}
    </div>
    <div className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider leading-tight">
      {label}
    </div>
  </motion.div>
);

const TimelineItem = ({ item, index }: { item: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="relative pl-12 md:pl-20 pb-12 last:pb-0"
  >
    {/* Line */}
    <div className="absolute left-[23px] md:left-[31px] top-0 bottom-0 w-0.5 bg-surface-100" />

    {/* Dot */}
    <div
      className={`absolute left-0 top-0 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-xl border-4 flex items-center justify-center bg-white z-10 shadow-premium-sm transition-all duration-500
      ${item.status === "active" ? "border-primary-600 text-primary-600" : "border-surface-100 text-ink-300"}`}
    >
      <span className="text-xl md:text-2xl font-display font-black">
        {index + 1}
      </span>
      {item.status === "active" && (
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white"
        />
      )}
    </div>

    {/* Card */}
    <div className="bg-white p-5 sm:p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-surface-100 shadow-premium-sm hover:shadow-premium-md transition-all">
      <div className="flex flex-wrap items-center gap-4 mb-3">
        <h3 className="text-xl md:text-2xl font-display font-black text-ink-950">
          {item.phase}
        </h3>
        <span
          className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
            item.status === "active"
              ? "bg-primary-50 text-primary-900"
              : "bg-surface-50 text-ink-600"
          }`}
        >
          {item.date}
        </span>
      </div>
      <p className="text-lg text-ink-600 leading-relaxed font-bold text-left">
        {item.desc}
      </p>
    </div>
  </motion.div>
);

// ========================================
// CONTENT COMPONENT
// ========================================

function PPDBContent() {
  const [copiedBank, setCopiedBank] = useState(false);

  const handleCopyRekening = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedBank(true);
    setTimeout(() => setCopiedBank(false), 2500);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const searchParams = useSearchParams();
  const jenjang = searchParams.get("jenjang");

  const stats = [
    { label: "Akreditasi A", value: "Unggul", icon: Award },
    { label: "Sebaran Alumni", value: "3 Benua", icon: Users },
    { label: "Asatidz", value: "Lulusan Terbaik", icon: GraduationCap },
    { label: "Target", value: "TimTeng & PTN", icon: Target },
  ];

  const timeline = [
    {
      phase: "Registrasi Online",
      date: "28 Agt - 30 Nov 2026",
      desc: "Buat akun pendaftar dan isi formulir awal melalui website resmi.",
      status: "active" },
    {
      phase: "Pembayaran Registrasi",
      date: "Setelah Daftar",
      desc: "Lakukan pembayaran biaya pendaftaran via Transfer Manual BSI yang tersedia di dashboard.",
      status: "upcoming" },
    {
      phase: "Lengkapi Data & Berkas",
      date: "Setelah Bayar",
      desc: "Lengkapi profil santri, data orang tua/wali, dan upload dokumen persyaratan.",
      status: "upcoming" },
    {
      phase: "Ujian Seleksi",
      date: "Sesuai Pilihan Jadwal",
      desc: "Wali santri memilih sesi dan tanggal ujian seleksi secara mandiri di Dashboard (tersedia tes lisan/tahfidz, tes tertulis, & wawancara).",
      status: "upcoming" },
    {
      phase: "Pengumuman Hasil",
      date: "7 Hari Setelah Tes",
      desc: "Hasil seleksi diumumkan melalui Dashboard Pendaftar dan Notifikasi WhatsApp.",
      status: "upcoming" },
    {
      phase: "Daftar Ulang",
      date: "Setelah Lulus",
      desc: "Melakukan pembayaran Uang Pangkal (dapat dicicil 3x). Pastikan pembayaran pertama minimal 50% diselesaikan 1 pekan setelah pengumuman.",
      status: "upcoming" },
  ];

  const requirements = [
    {
      title: "Dokumen Persyaratan",
      icon: FileText,
      items: [
        { name: "Scan Akta Kelahiran", type: "Wajib" },
        { name: "Scan Rapor 4 Semester Terakhir, SD/MI Kelas 4 & 5 atau SMP/MTS Kelas 7 & 8", type: "Wajib" },
        { name: "Scan Kartu Keluarga (KK)", type: "Wajib" },
        { name: "Scan Nomor Induk Siswa Nasional (NISN) atau Surat Keterangan NISN", type: "Wajib" },
        { name: "Foto Setengah Badan (Putra: background merah, baju putih berkerah, tanpa penutup kepala & kacamata)", type: "Wajib" },
        { name: "Scan Hasil Tes Lab HBsAg (Hepatitis B)", type: "Wajib" },
      ] },
    {
      title: "Dokumen Pendukung",
      icon: CheckCircle,
      note: "Format dokumen di bawah dapat di-unduh (DOWNLOAD) melalui akun Dashboard pendaftar saat Anda sudah berada di tahap upload berkas.",
      items: [
        { name: "Surat Keterangan Sehat (Format Bebas, dari RS/Klinik)", type: "Wajib" },
        { name: "Scan Pakta Integritas (Format Panitia)", type: "Wajib" },
        { name: "Scan Pernyataan Bebas Perilaku Negatif (Format Panitia)", type: "Wajib" },
      ] },
  ];

  const biaya = [
    { label: "Biaya Pendaftaran", value: "Rp 500rb", icon: CreditCard },
    { label: "Uang Pangkal", value: "Rp 35Jt", icon: Shield },
    { label: "SPP / Bulan", value: "Rp 3Jt", icon: Star },
  ];

  return (
    <main className="bg-white min-h-dvh">
      {/* 1. Hero Section - Airy & Impactful */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-full max-w-[600px] h-[600px] bg-primary-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full max-w-[400px] h-[400px] bg-secondary-50/30 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.02] pointer-events-none" />

        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-surface-200 text-primary-700 text-xs font-black uppercase tracking-widest mb-10 shadow-premium-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Penerimaan Santri Baru T.A 2027/2028</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 md:mb-8 tracking-tight text-slate-900 leading-[1.15]"
            >
              <span className="block">Kaderisasi Generasi Robbani,</span>
              <span className="block mt-1 text-emerald-800">
                Cendekia &amp; Berakhlak Mulia
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium mb-10"
            >
              Bergabunglah dengan Pesantren Islam Internasional Al-Andalus Putra. Lingkungan yang
              kondusif untuk mencetak Hafidz Qur'an yang berwawasan luas dan
              berakhlak mulia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href={`/daftar${jenjang ? `?jenjang=${jenjang}` : ""}`}
                className="inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4.5 rounded-full bg-emerald-700 text-white font-black text-lg hover:bg-emerald-800 shadow-xl shadow-emerald-700/25 transition-all hover:-translate-y-0.5"
              >
                Daftar PPDB
              </Link>
              <a
                href="#alur"
                className="inline-flex items-center justify-center gap-3 px-8 md:px-10 py-4.5 rounded-full bg-white border border-slate-200 text-slate-800 font-bold text-lg hover:bg-slate-50 transition-all shadow-sm hover:-translate-y-0.5"
              >
                Lihat Alur Seleksi
              </a>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 md:gap-6 mt-12 sm:mt-16 md:mt-20">
            {stats.map((stat, idx) => (
              <StatCard key={idx} {...stat} delay={0.4 + idx * 0.1} />
            ))}
          </div>
        </Container>
      </section>

      {/* 2. Timeline Section - Modern & Clean */}
      <section id="alur" className="py-24 md:py-32 bg-surface-50/50">
        <Container>
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* Sticky Content */}
            <div className="lg:w-2/5 lg:sticky lg:top-32 h-fit flex flex-col items-center text-center lg:items-start lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-surface-200 text-primary-700 text-xs font-black uppercase tracking-widest mb-8 shadow-premium-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>Tahapan Pendaftaran</span>
              </div>
              <h2 className="text-3xl md:text-2xl sm:text-3xl lg:text-5xl font-display font-black text-ink-950 mb-8 leading-tight">
                Alur Seleksi <br />{" "}
                <span className="text-primary-600">Lengkap & Transparan</span>
              </h2>
              <p className="text-xl text-ink-600 leading-relaxed font-medium mb-10 text-center lg:text-left">
                Kami memastikan setiap proses pendaftaran berlangsung dengan
                adil dan informatif bagi calon santri dan orang tua.
              </p>

              <div className="bg-white p-6 sm:p-5 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-surface-100 shadow-premium-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 flex items-center gap-5">
                  <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center text-ink-950 shadow-premium-md">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-display font-black text-ink-950 mb-0.5">
                      Siap Menjadi Santri?
                    </h4>
                    <p className="text-ink-500 font-medium">
                      Yuk, segera daftarkan ananda sekarang juga.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex-1">
              <div className="max-w-2xl">
                {timeline.map((item, idx) => (
                  <TimelineItem key={idx} item={item} index={idx} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

            {/* 3. Costs Section (Visual 3-Step Installment Stepper & Bank Card) */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white via-slate-50/60 to-white border-y border-surface-100">
        <Container>
          <div className="text-center mb-14 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-primary-900 text-xs font-black uppercase tracking-widest mb-4 shadow-2xs">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Investasi Masa Depan Santri</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-black text-ink-950 mb-4 tracking-tight">
              Informasi Pembiayaan <br />
              <span className="text-primary-600">Pendidikan T.A 2027/2028</span>
            </h2>
            <p className="text-base md:text-lg text-ink-600 max-w-2xl mx-auto font-medium">
              Transparan, berkualitas internasional, dan berkah dengan skema cicilan fleksibel untuk santri putra.
            </p>
          </div>

          {/* 3 Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-7 sm:p-8 rounded-[2rem] border border-primary-100 shadow-premium-sm hover:shadow-premium-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-900 mb-6 group-hover:scale-110 transition-transform shadow-2xs">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-xs text-ink-400 font-black uppercase tracking-widest mb-2">
                Biaya Pendaftaran
              </h3>
              <p className="text-3xl sm:text-4xl font-display font-black text-ink-950 mb-3">
                Rp 500.000
              </p>
              <p className="text-xs text-ink-500 font-medium leading-relaxed">
                Biaya registrasi &amp; seleksi masuk santri baru (Tahsin, Tahfidz, Cambridge &amp; Wawancara). Bersifat non-refundable.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-b from-primary-50/70 via-white to-white p-7 sm:p-8 rounded-[2rem] border-2 border-primary-500 shadow-premium-md hover:shadow-premium-lg transition-all flex flex-col items-center text-center relative group"
            >
              <div className="absolute -top-3.5 px-4 py-1 rounded-full bg-primary-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                Bisa Dicicil 3x
              </div>
              <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-900 mb-6 group-hover:scale-110 transition-transform shadow-2xs">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xs text-primary-700 font-black uppercase tracking-widest mb-2">
                Uang Pangkal (Daftar Ulang)
              </h3>
              <p className="text-3xl sm:text-4xl font-display font-black text-primary-700 mb-3">
                Rp 35.000.000
              </p>
              <p className="text-xs text-ink-500 font-medium leading-relaxed">
                Termasuk sarana prasarana, seragam, fasilitas asrama, buku &amp; modul kurikulum Cambridge &amp; Nasional.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-7 sm:p-8 rounded-[2rem] border border-primary-100 shadow-premium-sm hover:shadow-premium-md transition-all flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-700 mb-6 group-hover:scale-110 transition-transform shadow-2xs">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-xs text-ink-400 font-black uppercase tracking-widest mb-2">
                SPP Bulanan (All-In)
              </h3>
              <p className="text-3xl sm:text-4xl font-display font-black text-ink-950 mb-3">
                Rp 3.000.000
              </p>
              <p className="text-xs text-ink-500 font-medium leading-relaxed">
                Per bulan (Total Rp 36.000.000/tahun All-In sudah termasuk asrama, makan 3x sehari bergizi, laundry, &amp; seluruh program).
              </p>
            </motion.div>
          </div>

          {/* Visual 3-Step Installment Stepper */}
          <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-primary-200 p-6 sm:p-10 shadow-premium-sm mb-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 mb-8 border-b border-surface-100 text-center sm:text-left">
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-primary-900 bg-primary-50 px-3 py-1 rounded-full border border-primary-200 inline-block mb-1">
                  Skema Pembayaran Transparan
                </span>
                <h3 className="text-xl sm:text-2xl font-display font-black text-ink-950">
                  Tahapan Cicilan Uang Pangkal (Rp 35.000.000)
                </h3>
              </div>
              <div className="text-xs font-bold text-slate-500 bg-surface-50 px-4 py-2 rounded-xl border border-surface-200">
                Maksimal 3 Kali Pembayaran
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative">
              {/* Step 1 */}
              <div className="bg-gradient-to-b from-primary-50/80 to-white rounded-2xl p-6 border-2 border-primary-500 shadow-sm relative space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-primary-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    1
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary-900 bg-primary-100/80 px-2.5 py-1 rounded-full">
                    Kunci Kuota
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-ink-500">Cicilan 1 (50%)</div>
                  <div className="text-2xl font-display font-black text-ink-950">Rp 17.500.000</div>
                </div>
                <p className="text-xs text-ink-600 leading-relaxed font-normal">
                  Wajib dibayarkan paling lambat <strong>sepekan (7 hari)</strong> setelah menerima Surat Pengumuman Kelulusan Seleksi sebagai konfirmasi daftar ulang santri.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-surface-50/60 rounded-2xl p-6 border border-surface-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-surface-200 text-ink-700 font-black text-sm flex items-center justify-center">
                    2
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-ink-600 bg-surface-200/80 px-2.5 py-1 rounded-full">
                    Termin Kedua
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-ink-500">Cicilan 2 (25%)</div>
                  <div className="text-2xl font-display font-black text-ink-950">Rp 8.750.000</div>
                </div>
                <p className="text-xs text-ink-600 leading-relaxed font-normal">
                  Pembayaran termin kedua diselesaikan paling lambat <strong>1 Maret 2027</strong> untuk memberikan kenyamanan dan kelonggaran bagi orang tua.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-surface-50/60 rounded-2xl p-6 border border-surface-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-surface-200 text-ink-700 font-black text-sm flex items-center justify-center">
                    3
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                    Batas Akhir 1 Juli 2027
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-ink-500">Cicilan 3 (Pelunasan 25%)</div>
                  <div className="text-2xl font-display font-black text-ink-950">Rp 8.750.000</div>
                </div>
                <p className="text-xs text-ink-600 leading-relaxed font-normal">
                  Pelunasan sisa uang pangkal sebelum santri mulai masuk asrama, dengan batas waktu maksimal <strong>1 Juli 2027</strong>.
                </p>
              </div>
            </div>

            {/* Garansi Uang Pangkal */}
            <div className="mt-8 pt-6 border-t border-surface-100 flex items-center gap-4 bg-primary-50/60 p-4 sm:p-5 rounded-2xl border border-primary-100">
              <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-primary-900 font-bold leading-relaxed">
                Garansi 100% Pengembalian Dana: Uang pangkal dikembalikan 100% penuh jika calon santri mengundurkan diri dalam kurun waktu 14 hari setelah tanggal pengumuman kelulusan seleksi.
              </p>
            </div>
          </div>

          {/* Rekening Resmi BSI Card with Copy Button */}
          <div className="max-w-5xl mx-auto bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="text-xs font-black uppercase tracking-widest text-primary-300">
                Rekening Resmi Pembayaran PPDB Al-Andalus Putra
              </span>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-0.5">
                <span className="text-lg font-bold text-slate-200">Bank Syariah Indonesia (BSI):</span>
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-primary-400">7667777783</span>
              </div>
              <p className="text-xs text-slate-400">
                Atas Nama: <strong className="text-white">Yayasan Darul Iman Wattaqwa</strong> • Kode Bank: <span className="font-mono text-slate-300">451</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => handleCopyRekening("7667777783")}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                {copiedBank ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-primary-300" />
                    <span>Salin No. Rekening</span>
                  </>
                )}
              </button>
              <div className="text-[11px] text-slate-400 bg-white/5 px-3.5 py-2.5 rounded-xl border border-white/10 text-center">
                Konfirmasi otomatis di Dashboard
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. Requirements & FAQ */}
      <section className="py-24 md:py-32 bg-surface-50/50">
        <Container>
          <div className="grid lg:grid-cols-1 md:grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-24 items-start">
            {/* Requirements */}
            <div className="space-y-12">
              <h2 className="text-3xl md:text-4xl font-display font-black text-ink-950 text-center lg:text-left">
                Persyaratan{" "}
                <span className="text-primary-600">Administrasi</span>
              </h2>
              <div className="space-y-6 md:space-y-8">
                {requirements.map((req, idx) => {
                  const ReqIcon = req.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="bg-white p-6 sm:p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-surface-100 shadow-premium-md"
                    >
                      <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-primary-50 rounded-xl flex items-center justify-center text-primary-900 shadow-premium-sm shrink-0">
                          <ReqIcon className="w-6 h-6 md:w-7 md:h-7" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-display font-black text-ink-950 leading-tight">
                          {req.title}
                        </h3>
                      </div>
                      <ul className="space-y-3 md:space-y-5">
                        {req.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-3 md:gap-4 bg-surface-50/50 p-3 md:p-4 rounded-xl md:rounded-xl border border-surface-100 group hover:bg-white transition-all"
                          >
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-premium-xs ${
                                item.type === "Wajib" ||
                                item.type === "Required"
                                  ? "bg-primary-500 text-ink-950"
                                  : "bg-surface-200 text-ink-600"
                              } shrink-0`}
                            >
                              <Check className="w-5 h-5" />
                            </div>
                            <span className="flex-1 font-bold text-ink-700 text-sm md:text-base leading-tight">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-ink-300 group-hover:text-primary-600 shrink-0">
                              {item.type}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {(req as any).note && (
                        <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-surface-100">
                          <p className="text-sm text-ink-500 font-medium leading-relaxed italic text-left">
                            {(req as any).note}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Why Al-Andalus Putra & FAQ */}
            <div className="space-y-12 md:space-y-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-primary-900 rounded-[2rem] md:rounded-[4rem] p-6 md:p-16 text-white relative overflow-hidden shadow-premium-2xl"
              >
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-display font-black mb-8 md:mb-10 text-white tracking-tight text-center lg:text-left">
                    Kenapa Pilih Kami?
                  </h3>
                  <div className="grid gap-4 md:gap-6">
                    {[
                      {
                        icon: BookOpen,
                        title: "Kurikulum Mutakhir",
                        desc: "Perpaduan kurikulum Nasional & kurikulum khas Andalus." },
                      {
                        icon: GraduationCap,
                        title: "Guru Berkompeten",
                        desc: "Alumni Perguruan Tinggi Terbaik Dalam & Luar Negeri serta Pondok Pesantren Unggulan." },
                      {
                        icon: MapPin,
                        title: "Lingkungan Asri",
                        desc: "Suasana belajar yang tenang & udara bersih." },
                    ].map((feat, i) => {
                      const FeatIcon = feat.icon;
                      return (
                        <div
                          key={i}
                          className="flex gap-4 md:gap-5 items-start bg-white/5 p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border border-white/5  group transition-all duration-300"
                        >
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                            <FeatIcon className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                          </div>
                          <div>
                            <h4 className="font-display font-black text-lg md:text-xl mb-1 text-white">
                              {feat.title}
                            </h4>
                            <p className="text-sm md:text-base text-white/80 font-medium leading-relaxed">
                              {feat.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              <div className="space-y-6 md:space-y-8">
                <h3 className="text-2xl md:text-3xl font-display font-black text-ink-950 px-2 text-center lg:text-left">
                  Pertanyaan Populer
                </h3>
                <div className="space-y-3 md:space-y-4">
                  {[
                    {
                      q: "Apakah santri wajib asrama?",
                      a: "Ya, seluruh santri di Pesantren Islam Internasional Al-Andalus Putra wajib tinggal di asrama untuk mengikuti seluruh rangkaian kegiatan tarbiyah, halaqah tahfidz, dan pembelajaran kitab turots secara maksimal." },
                    {
                      q: "Kapan batas akhir pendaftaran?",
                      a: "Pendaftaran PPDB Tahun Ajaran 2027/2028 dibuka mulai tanggal 10 September 2026 sampai dengan 30 Desember 2026. Namun, pendaftaran dapat ditutup lebih awal jika kuota santri baru sudah terpenuhi." },
                    {
                      q: "Bagaimana sistem kurikulumnya?",
                      a: "Kami menerapkan Kurikulum Terpadu yang menggabungkan kurikulum Nasional dengan kurikulum khas Andalus yang berfokus pada penguasaan Bahasa Arab, Tahfidz Al-Qur'an, dan Kitab Turots." },
                  ].map((faq, i) => (
                    <motion.div key={i} className="group">
                      <details className="bg-white rounded-xl border border-surface-100 shadow-premium-sm transition-all duration-300 open:shadow-premium-lg">
                        <summary className="p-5 md:p-6 flex items-center gap-4 md:gap-5 cursor-pointer list-none">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-900 group-hover:bg-primary-600 group-hover:text-white transition-all shrink-0">
                            <HelpCircle className="w-4 h-4 md:w-5 md:h-5" />
                          </div>
                          <span className="flex-1 font-black text-ink-950 tracking-tight text-sm md:text-base">
                            {faq.q}
                          </span>
                          <ChevronRight className="w-5 h-5 text-surface-200 group-open:rotate-90 transition-transform duration-300 shrink-0" />
                        </summary>
                        <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0 md:pt-2 pl-5 md:pl-20">
                          <p className="text-sm md:text-base text-ink-600 font-medium leading-relaxed text-left">
                            {faq.a}
                          </p>
                        </div>
                      </details>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Final CTA */}
      <section className="py-16 md:py-24 lg:py-32 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-primary-900 bg-linear-to-br from-primary-800 to-primary-950 rounded-[2rem] md:rounded-[3rem] lg:rounded-[4rem] p-6 sm:p-5 md:p-8 lg:p-24 text-center text-white relative overflow-hidden shadow-premium-2xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 md:w-96 md:h-96 bg-white/5 rounded-full blur-[60px] md:blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />

            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-3xl xl:text-3xl font-display font-black mb-4 sm:mb-6 md:mb-8 text-white leading-tight">
                Mulai Perjalanan <br />{" "}
                <span className="text-amber-400">Ananda Di Sini</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-primary-100 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 lg:mb-12 font-medium leading-relaxed px-2">
                Jangan lewatkan kesempatan emas untuk memberikan pendidikan terbaik bagi masa depan putra Anda. Segera daftarkan ananda sebelum kuota terpenuhi.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center px-4">
                <Link href="/daftar">
                  <span className="w-full sm:w-auto inline-block px-6 sm:px-5 md:px-8 py-3.5 sm:py-4 md:py-5 rounded-pill bg-white text-primary-900 font-black text-sm sm:text-base md:text-lg xl:text-xl hover:bg-amber-400 hover:text-ink-950 shadow-premium-xl transition-all cursor-pointer min-h-[48px] sm:min-h-[52px]">
                    Daftar Sekarang
                  </span>
                </Link>
                <a
                  href="https://wa.me/6283811515951"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-5 md:px-8 py-3.5 sm:py-4 md:py-5 rounded-pill bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all text-sm sm:text-base md:text-lg min-h-[48px] sm:min-h-[52px]"
                >
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  Hubungi Admin PPDB
                </a>
              </div>

              {/* Trust microcopy */}
              <p className="mt-6 text-[11px] text-primary-300 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Pendaftaran Gratis&nbsp;&nbsp;•&nbsp;&nbsp;Proses Mudah&nbsp;&nbsp;•&nbsp;&nbsp;Langsung Konfirmasi</span>
              </p>

                            {/* Legalitas badges */}
              <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-primary-100/80">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Terakreditasi A
                  </span>
                </div>
                <div className="flex items-center gap-2 text-primary-100/80">
                  <Award className="w-4 h-4 text-gold-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Akreditasi Univ. Islam Madinah
                  </span>
                </div>
                <div className="flex items-center gap-2 text-primary-100/80">
                  <GraduationCap className="w-4 h-4 text-primary-300" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Akreditasi Univ. Al-Azhar Mesir
                  </span>
                </div>
                <div className="flex items-center gap-2 text-primary-100/80">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Sejak 2013 • 13 Tahun Melayani
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 text-primary-600 mb-4"
      >
        <Loader2 className="w-12 h-12" />
      </motion.div>
      <p className="text-ink-500 font-black uppercase tracking-widest text-xs animate-pulse">
        Memuat Info PPDB...
      </p>
    </div>
  );
}

export default function PPDBPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PPDBContent />
    </Suspense>
  );
}



