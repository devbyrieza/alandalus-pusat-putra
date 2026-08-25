"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Images,
  ArrowRight,
  X,
  Building,
  Building2,
  Globe,
  Trophy,
  Sparkles,
  Maximize2
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { BRANDING } from "@/config/branding";

interface GalleryItem {
  id: string;
  src: string;
  title: string;
  category: "gedung" | "masjid" | "drone" | "olahraga";
  categoryLabel: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    src: "/images/Gedung Utama Andalus Putra.jpeg",
    title: "Gedung Utama & Kompleks Kampus Putra",
    category: "gedung",
    categoryLabel: "Gedung & Kampus",
    description: "Bangunan megah dan modern pusat administrasi serta pembelajaran santri Al-Andalus Putra."
  },
  {
    id: "2",
    src: "/images/TANGGA.jpeg",
    title: "Akses Tangga & Koridor Pembelajaran",
    category: "gedung",
    categoryLabel: "Gedung & Kampus",
    description: "Arsitektur tangga dan selasar kampus yang bersih, representatif, dan bernuansa islami."
  },
  {
    id: "3",
    src: "/images/MASJID-1.jpg",
    title: "Masjid Area Putra (Tampak Depan)",
    category: "masjid",
    categoryLabel: "Masjid Area Putra",
    description: "Fasad depan Masjid Pesantren Putra yang megah sebagai sentra spiritual dan halaqoh tahfidz."
  },
  {
    id: "4",
    src: "/images/MASJID-2.jpg",
    title: "Arsitektur & Kubah Masjid Putra",
    category: "masjid",
    categoryLabel: "Masjid Area Putra",
    description: "Keindahan kubah dan tata cahaya alami masjid yang menyejukkan hati santri dalam beribadah."
  },
  {
    id: "5",
    src: "/images/MASJID-3.jpg",
    title: "Pelataran & Serambi Masjid",
    category: "masjid",
    categoryLabel: "Masjid Area Putra",
    description: "Area serambi masjid yang lapang untuk kegiatan dzikir, tilawah, dan pertemuan ilmiah."
  },
  {
    id: "6",
    src: "/images/MASJID-4.jpg",
    title: "Area Wudhu & Fasilitas Ibadah",
    category: "masjid",
    categoryLabel: "Masjid Area Putra",
    description: "Fasilitas bersuci yang bersih, higienis, dan mengalir deras untuk kenyamanan shalat berjamaah."
  },
  {
    id: "7",
    src: "/images/SUASANA PESANTREN & LAPANGAN DARI ATAS-1.jpeg",
    title: "Panorama Kawasan Pesantren & Lapangan Olahraga (Drone 1)",
    category: "drone",
    categoryLabel: "Panorama Udara (Drone)",
    description: "Tampak atas keasrian lingkungan kampus hijau Al-Andalus Putra dengan fasilitas olahraga terpadu."
  },
  {
    id: "8",
    src: "/images/SUASANA PESANTREN & LAPANGAN DARI ATAS-2.jpeg",
    title: "Lanskap Terpadu Kawasan Kampus Putra (Drone 2)",
    category: "drone",
    categoryLabel: "Panorama Udara (Drone)",
    description: "Tata ruang kampus yang terencana rapi, asri, dan aman di dataran sejuk Jonggol Bogor."
  },
  {
    id: "9",
    src: "/images/LAPANGAN-FUTSAL-1.jpeg",
    title: "Lapangan Futsal Outdoor Santri (Sudut 1)",
    category: "olahraga",
    categoryLabel: "Sarana Olahraga",
    description: "Sarana olahraga futsal outdoor dengan rumput sintetis/lapangan standar untuk pembinaan fisik santri."
  },
  {
    id: "10",
    src: "/images/LAPANGAN-FUTSAL-2.jpeg",
    title: "Lapangan Futsal & Suasana Asri (Sudut 2)",
    category: "olahraga",
    categoryLabel: "Sarana Olahraga",
    description: "Area lapangan futsal yang dikelilingi pepohonan hijau dan lingkungan belajar yang menyegarkan."
  },
  {
    id: "11",
    src: "/images/LAPANGAN-FUTSAL-3.jpeg",
    title: "Fasilitas Futsal & Aktivitas Jasmani (Sudut 3)",
    category: "olahraga",
    categoryLabel: "Sarana Olahraga",
    description: "Fasilitas latihan tim futsal santri untuk turnamen internal dan kejuaraan antar pesantren."
  },
  {
    id: "12",
    src: "/images/LAPANGAN-FUTSAL-4.jpeg",
    title: "Lapangan Futsal dengan Pagar Pengaman (Sudut 4)",
    category: "olahraga",
    categoryLabel: "Sarana Olahraga",
    description: "Keamanan dan kenyamanan olahraga santri dengan instalasi jaring pengaman modern."
  },
  {
    id: "13",
    src: "/images/LAPANGAN-BASKET-1.jpeg",
    title: "Lapangan Basket Santri Putra (Sudut 1)",
    category: "olahraga",
    categoryLabel: "Sarana Olahraga",
    description: "Sarana olahraga basket outdoor serbaguna untuk latihan teknik dan kompetisi basket santri."
  },
  {
    id: "14",
    src: "/images/LAPANGAN-BASKET-2.jpeg",
    title: "Lapangan Basket & Area Latihan (Sudut 2)",
    category: "olahraga",
    categoryLabel: "Sarana Olahraga",
    description: "Fasilitas basket santri dengan ring standar dan permukaan lapangan yang terawat prima."
  }
];

const CATEGORIES = [
  { key: "semua", label: "Semua Foto", icon: Images },
  { key: "gedung", label: "Gedung & Kampus", icon: Building },
  { key: "masjid", label: "Masjid Area Putra", icon: Building2 },
  { key: "drone", label: "Panorama Udara (Drone)", icon: Globe },
  { key: "olahraga", label: "Sarana Olahraga", icon: Trophy },
];

export default function GaleriPage() {
  const [activeCategory, setActiveCategory] = useState<string>("semua");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems =
    activeCategory === "semua"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 md:py-24">
      {/* HEADER SECTION */}
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black tracking-widest uppercase shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>DOKUMENTASI FOTO RESMI AL-ANDALUS PUTRA</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight text-slate-950"
          >
            Galeri Pesantren & Fasilitas <br />
            <span className="bg-gradient-to-r from-emerald-700 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
              {BRANDING.schoolName}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-medium"
          >
            Koleksi dokumentasi visual resmi kawasan kampus, masjid, asrama, sarana olahraga, dan panorama udara Al-Andalus Putra.
          </motion.p>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 mb-12">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={"flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 border cursor-pointer " + (
                  isActive
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-lg shadow-emerald-700/25 scale-105"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100 shadow-xs"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* GALLERY GRID */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedImage(item)}
                className="group relative cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200/90 hover:border-emerald-400 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <div className="text-white space-y-1">
                      <span className="inline-block text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-600 text-white mb-1 shadow-xs">
                        {item.categoryLabel}
                      </span>
                      <h3 className="text-base font-bold leading-snug drop-shadow-sm">{item.title}</h3>
                      <p className="text-xs text-slate-200 line-clamp-2 drop-shadow-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3 p-2 rounded-full bg-slate-900/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                      {item.categoryLabel}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 sm:p-6"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-4xl w-full bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl"
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors cursor-pointer border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
                  <Image
                    src={selectedImage.src}
                    alt={selectedImage.title}
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="p-6 sm:p-8 bg-slate-900 border-t border-slate-800 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-600/30 text-emerald-400 border border-emerald-500/30">
                      {selectedImage.categoryLabel}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                    {selectedImage.title}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {selectedImage.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA BOTTOM BANNER */}
        <div className="mt-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-emerald-700/40 text-center space-y-6">
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Ingin Mengunjungi Kampus Al-Andalus Putra Langsung?
              </h2>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Kami menyambut hangat kunjungan silaturahmi calon santri dan wali santri untuk melihat langsung lingkungan belajar, asrama, dan fasilitas pesantren.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/ppdb"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all duration-300 shadow-lg shadow-emerald-950/40 hover:-translate-y-0.5"
              >
                <span>Daftar PPDB Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kontak"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all duration-300 border border-white/20 hover:-translate-y-0.5"
              >
                <span>Hubungi Layanan Informasi</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
