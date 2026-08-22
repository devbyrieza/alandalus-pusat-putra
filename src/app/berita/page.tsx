"use client";

import { useState } from "react";
import { BRANDING, IS_PUTRA } from "@/config/branding";
import { Calendar, Play, ImageIcon, FileText } from "lucide-react";

export default function BeritaPage() {
  const [activeTab, setActiveTab] = useState("semua");

  const DUMMY_BERITA = [
    { type: "berita", title: "Kunjungan Studi UIM ke Al-Andalus", date: "05 Juni 2026", cat: "Kegiatan" },
    { type: "galeri", title: "Ujian Tasmi' 5 Juz Sekali Duduk", date: "20 Mei 2026", cat: "Tahfizh" },
    { type: "video", title: "Profil Pesantren Al-Andalus", date: "01 April 2026", cat: "Profil" },
    { type: "berita", title: "Santri Al-Andalus Juara MHQ", date: "10 Maret 2026", cat: "Prestasi" },
    { type: "galeri", title: "Market Day Santri", date: "12 Feb 2026", cat: "Entrepreneurship" },
  ];

  const filtered = DUMMY_BERITA.filter(b => activeTab === "semua" || b.type === activeTab);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-2xl sm:text-3xl lg:text-5xl font-black text-slate-900 mb-6 tracking-tight">Berita & Kegiatan</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Pusat informasi, kegiatan, dan dokumentasi visual keseharian santri {BRANDING.schoolName}.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: "semua", label: "Semua", icon: FileText },
              { id: "berita", label: "Berita", icon: FileText },
              { id: "galeri", label: "Galeri Foto", icon: ImageIcon },
              { id: "video", label: "Video", icon: Play }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all
                  ${activeTab === tab.id 
                    ? (IS_PUTRA ? "bg-primary-600 text-white shadow-md" : "bg-pink-600 text-white shadow-md") 
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-emerald-900/20 overflow-hidden group hover:shadow-md transition-all">
                <div className="aspect-[4/3] bg-slate-200 relative flex items-center justify-center">
                  <span className="text-slate-400 font-medium">Image/Thumbnail Placeholder</span>
                  {item.type === "video" && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                       <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className={`w-5 h-5 ml-1 ${IS_PUTRA ? "text-primary-600" : "text-pink-600"}`} />
                       </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-widest rounded-full text-slate-700">
                      {item.cat}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <Calendar className={`w-3.5 h-3.5 ${IS_PUTRA ? "text-primary-500" : "text-pink-500"}`} />
                    {item.date}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
