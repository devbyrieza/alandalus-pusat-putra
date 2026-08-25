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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 py-16">
      {/* HEADER SECTION */}
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold tracking-wide"
          >
            <Sparkles className="w-4 h-4" />
            <span>DOKUMENTASI FOTO AL-ANDALUS PUTRA</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-white"
          >
            Galeri Pesantren & Fasilitas <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              {BRANDING.schoolName}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-lg"
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
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? "bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/25 scale-105"
                    : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800"
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
                className="group relative cursor-pointer rounded-xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/50 shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-semibold text-emerald-400">
                    {item.categoryLabel}
                  </div>

                  <div className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-5 space-y-1">
                  <h3 className="font-bold text-lg text-white group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA BOTTOM SECTION */}
        <div className="mt-20 p-8 rounded-xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/30 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ingin Kunjungan Langsung ke Pesantren Putra?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Daftar PPDB Online sekarang atau hubungi tim administrasi kami untuk mengonfirmasi jadwal kunjungan santri.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/ppdb"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold shadow-lg shadow-emerald-500/25 transition-all"
            >
              <span>Daftar PPDB Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/program"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700 transition-all"
            >
              <span>Lihat Program Pendidikan</span>
            </Link>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-3 rounded-full bg-slate-950/80 hover:bg-emerald-500 text-white hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[16/10] w-full bg-slate-950">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-contain"
                  priority
                />
              </div>

              <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-2">
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  {selectedImage.categoryLabel}
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {selectedImage.title}
                </h3>
                <p className="text-slate-300">
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
