const fs = require('fs');

const targetFile = 'src/app/dashboard/pendaftar/welcome-day/page.tsx';
let content = fs.readFileSync(targetFile, 'utf-8');

// 1. Add imports
if (!content.includes('import Image from "next/image";')) {
  content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport Image from "next/image";\nimport { useState } from "react";');
}

// 2. Add state inside the component
if (!content.includes('const [lightbox, setLightbox] = useState')) {
  content = content.replace(/(export default function \w+\(\) \{)/, '$1\n  const [lightbox, setLightbox] = useState<string | null>(null);\n');
}

// 3. Add the UI section
const uiBlock = `
      {/* ─── INFOGRAFIS & PANDUAN VISUAL ─── */}
      <div className="bg-white rounded-3xl border border-ink-100 shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-emerald-100 bg-emerald-50 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h2 className="font-black text-emerald-950 text-base">Infografis & Panduan Visual</h2>
            <p className="text-xs text-emerald-600 font-bold">Panduan lengkap pelaksanaan Welcome Day</p>
          </div>
        </div>
        <div className="p-5 space-y-6">
          {/* Rundown Acara */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shadow-sm">
                1
              </div>
              <h3 className="font-black text-ink-900 text-sm">Rundown Acara</h3>
            </div>
            <div 
              className="relative w-full aspect-[1/1.4] bg-ink-50 rounded-2xl border border-ink-100 overflow-hidden cursor-zoom-in group shadow-sm"
              onClick={() => setLightbox('/images/welcome-day/rundown.png')}
            >
              <Image 
                src="/images/welcome-day/rundown.png" 
                alt="Rundown Acara" 
                fill 
                className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
          </div>
          
          {/* Alur Kedatangan */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shadow-sm">
                2
              </div>
              <h3 className="font-black text-ink-900 text-sm">Alur Kedatangan</h3>
            </div>
            <div 
              className="relative w-full aspect-[1/1.4] bg-ink-50 rounded-2xl border border-ink-100 overflow-hidden cursor-zoom-in group shadow-sm"
              onClick={() => setLightbox('/images/welcome-day/alur_kedatangan.png')}
            >
              <Image 
                src="/images/welcome-day/alur_kedatangan.png" 
                alt="Alur Kedatangan" 
                fill 
                className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <div className="mt-4 flex justify-center">
              <a 
                href="/images/welcome-day/alur_kedatangan_banner.png" 
                target="_blank" 
                rel="noopener noreferrer" 
                download
                className="flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
              >
                <Download className="w-4 h-4" /> Lihat Resolusi Penuh (Banner)
              </a>
            </div>
          </div>
        </div>
      </div>
`;

if (!content.includes('INFOGRAFIS & PANDUAN VISUAL')) {
  content = content.replace('{/* ─── JADWAL ACARA ─── */}', uiBlock + '      {/* ─── JADWAL ACARA ─── */}');
}

// 4. Add the Lightbox portal
const lightboxUI = `
      {/* Lightbox Modal */}
      {lightbox && (
        <div 
          className="fixed inset-0 z-[100] bg-ink-950/95 flex flex-col items-center justify-center p-4 md:p-8 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 md:top-6 md:right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-5xl max-h-[85vh] flex-1">
            <Image 
              src={lightbox} 
              alt="Preview" 
              fill 
              className="object-contain" 
            />
          </div>
          <a 
            href={lightbox} 
            download 
            onClick={(e) => e.stopPropagation()}
            className="mt-6 flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold hover:bg-emerald-500 transition-colors shadow-lg active:scale-95"
          >
            <Download className="w-5 h-5" /> Download Gambar
          </a>
        </div>
      )}
    </div>
  );
}`;

if (!content.includes('Lightbox Modal')) {
  content = content.replace(/    <\/div>\r?\n  \);\r?\n\}/, lightboxUI + '\n}');
}

fs.writeFileSync(targetFile, content);
console.log("Done inserting Infografis UI!");
