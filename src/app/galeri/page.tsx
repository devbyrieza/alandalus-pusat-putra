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
  Maximize2,
  ChevronLeft,
  ChevronRight
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
  angles?: string[];
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    src: "/images/gedung-utama-putra.jpeg",
    title: "Gedung Utama & Kompleks Pesantren Putra",
    category: "gedung",
    categoryLabel: "Gedung & Fasilitas",
    description: "Bangunan megah dan modern pusat administrasi serta kegiatan pembelajaran santri Al-Andalus Putra."
  },
  {
    id: "2",
    src: "/images/masjid-1.jpg",
    title: "Masjid Area Putra",
    category: "masjid",
    categoryLabel: "Masjid Pesantren",
    description: "Sentra spiritual dan halaqoh tahfidz santri dengan kubah megah, tangga akses utama, pelataran luas, tata cahaya alami sejuk, dan sarana wudhu yang higienis.",
    angles: [
      "/images/masjid-1.jpg",
      "/images/masjid-2.jpg",
      "/images/masjid-3.jpg",
      "/images/masjid-4.jpg",
      "/images/tangga-selasar.jpeg"
    ]
  },
  {
    id: "3",
    src: "/images/drone-pesantren-1.jpeg",
    title: "Panorama Udara Kawasan Pesantren (Foto Drone)",
    category: "drone",
    categoryLabel: "Panorama Udara",
    description: "Tampak atas keasrian kawasan hijau Pesantren Al-Andalus Putra dengan fasilitas gedung dan sarana olahraga terpadu di Jonggol Bogor.",
    angles: [
      "/images/drone-pesantren-1.jpeg",
      "/images/drone-pesantren-2.jpeg"
    ]
  },
  {
    id: "4",
    src: "/images/lapangan-futsal-1.jpeg",
    title: "Lapangan Futsal Pesantren Putra",
    category: "olahraga",
    categoryLabel: "Sarana Olahraga",
    description: "Fasilitas olahraga futsal outdoor dengan rumput berkualitas dan pagar pengaman modern untuk kebugaran jasmani santri.",
    angles: [
      "/images/lapangan-futsal-1.jpeg",
      "/images/lapangan-futsal-2.jpeg",
      "/images/lapangan-futsal-3.jpeg",
      "/images/lapangan-futsal-4.jpeg"
    ]
  },
  {
    id: "5",
    src: "/images/lapangan-basket-1.jpeg",
    title: "Lapangan Basket Santri Putra",
    category: "olahraga",
    categoryLabel: "Sarana Olahraga",
    description: "Sarana olahraga basket outdoor serbaguna pendukung pembinaan fisik, sportivitas, dan kebersamaan santri.",
    angles: [
      "/images/lapangan-basket-1.jpeg",
      "/images/lapangan-basket-2.jpeg"
    ]
  }
];

const CATEGORIES = [
  { key: "semua", label: "Semua Foto", icon: Images },
  { key: "gedung", label: "Gedung & Fasilitas", icon: Building },
  { key: "masjid", label: "Masjid Pesantren", icon: Building2 },
  { key: "drone", label: "Panorama Udara", icon: Globe },
  { key: "olahraga", label: "Sarana Olahraga", icon: Trophy },
];

export default function GaleriPage() {
  const [activeCategory, setActiveCategory] = useState<string>("semua");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeAngleIndex, setActiveAngleIndex] = useState<number>(0);

  const filteredItems =
    activeCategory === "semua"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const handleOpenLightbox = (item: GalleryItem) => {
    setSelectedImage(item);
    setActiveAngleIndex(0);
  };

  const currentDisplaySrc =
    selectedImage && selectedImage.angles && selectedImage.angles.length > 0
      ? selectedImage.angles[activeAngleIndex]
      : selectedImage?.src || "";

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
            Koleksi dokumentasi visual resmi kawasan pesantren, masjid, asrama, sarana olahraga, dan panorama udara Al-Andalus Putra.
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
                onClick={() => handleOpenLightbox(item)}
                className="group relative cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-slate-200/90 hover:border-emerald-400 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-xs font-bold text-slate-800 shadow-xs">
                    <span>{item.categoryLabel}</span>
                    {item.angles && item.angles.length > 1 && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                        {item.angles.length} Sudut Foto
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-5 sm:p-6 space-y-1.5 bg-white">
                  <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* LIGHTBOX MODAL WITH MULTI-ANGLE SELECTOR */}
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
                    src={currentDisplaySrc}
                    alt={selectedImage.title}
                    fill
                    className="object-contain"
                  />
                  
                  {/* Prev/Next arrows if multiple angles */}
                  {selectedImage.angles && selectedImage.angles.length > 1 && (
                    <>
                      <button
                        onClick={() => setActiveAngleIndex((prev) => (prev > 0 ? prev - 1 : selectedImage.angles!.length - 1))}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-all cursor-pointer border border-white/10"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setActiveAngleIndex((prev) => (prev < selectedImage.angles!.length - 1 ? prev + 1 : 0))}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white transition-all cursor-pointer border border-white/10"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails row if multiple angles */}
                {selectedImage.angles && selectedImage.angles.length > 1 && (
                  <div className="flex items-center gap-2 p-3 bg-slate-950/80 border-t border-slate-800 overflow-x-auto justify-center">
                    {selectedImage.angles.map((angleSrc, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => setActiveAngleIndex(aIdx)}
                        className={"relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer " + (
                          activeAngleIndex === aIdx
                            ? "border-emerald-500 scale-105"
                            : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <Image src={angleSrc} alt="" fill className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-6 sm:p-8 bg-slate-900 border-t border-slate-800 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-600/30 text-emerald-400 border border-emerald-500/30">
                      {selectedImage.categoryLabel}
                    </span>
                    {selectedImage.angles && selectedImage.angles.length > 1 && (
                      <span className="text-xs text-slate-400">
                        Foto {activeAngleIndex + 1} dari {selectedImage.angles.length}
                      </span>
                    )}
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
                Ingin Mengunjungi Pesantren Al-Andalus Putra Langsung?
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
