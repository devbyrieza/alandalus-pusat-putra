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
  category: "gedung" | "olahraga";
  categoryLabel: string;
  description: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    src: "/images/gedung-utama-putra.webp",
    title: "Gedung Utama & Kompleks Pembelajaran Putra",
    category: "gedung",
    categoryLabel: "Gedung & Kampus",
    description: "Bangunan modern pusat administrasi dan pembelajaran santri Al-Andalus Putra."
  },
  {
    id: "2",
    src: "/images/lapangan-futsal.webp",
    title: "Lapangan Futsal Pesantren Putra",
    category: "olahraga",
    categoryLabel: "Sarana Olahraga",
    description: "Fasilitas olahraga outdoor serbaguna untuk kebugaran jasmani dan ekstrakurikuler santri."
  },
  {
    id: "3",
    src: "/images/lapangan-basket.webp",
    title: "Lapangan Basket Santri Putra",
    category: "olahraga",
    categoryLabel: "Sarana Olahraga",
    description: "Sarana olahraga basket outdoor pendukung kegiatan fisik dan kebersamaan santri."
  }
];

const CATEGORIES = [
  { key: "semua", label: "Semua Foto", icon: Images },
  { key: "gedung", label: "Gedung & Kampus", icon: Building },
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
            <span>DOKUMENTASI FOTO AL-ANDALUS PUTRA</span>
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
            Dokumentasi resmi sarana gedung utama dan sarana olahraga santri Al-Andalus Putra.
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
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-lg shadow-emerald-700/25 scale-105"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100 shadow-xs"
                }`}
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
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-xs font-bold text-slate-800 shadow-xs">
                    {item.categoryLabel}
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

        {/* CTA BOTTOM SECTION */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl sm:rounded-[2.5rem] bg-gradient-to-br from-emerald-800 via-teal-800 to-slate-900 text-center space-y-6 text-white shadow-2xl shadow-emerald-950/20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-white">
              Ingin Kunjungan Langsung ke Pesantren Putra?
            </h2>
            <p className="text-white/90 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-medium">
              Daftar PPDB Online sekarang atau hubungi tim administrasi kami untuk mengonfirmasi jadwal kunjungan santri.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link
                href="/ppdb"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white hover:bg-slate-100 text-emerald-900 font-black text-base shadow-lg transition-all hover:-translate-y-0.5"
              >
                <span>Daftar PPDB Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/program"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold border border-white/20 transition-all text-base hover:-translate-y-0.5"
              >
                <span>Lihat Program Pendidikan</span>
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[16/10] w-full bg-slate-900">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain"
                  priority
                />
              </div>

              <div className="p-6 bg-white border-t border-slate-100 space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  {selectedImage.categoryLabel}
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedImage.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {selectedImage.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
