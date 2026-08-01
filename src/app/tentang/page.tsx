import { BRANDING, IS_PUTRA } from "@/config/branding";
import { Target, Compass, BookOpen, ShieldCheck, Award } from "lucide-react";

export default function TentangPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Profil & Sejarah</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Mengenal lebih dekat perjalanan dan landasan dasar pendidikan {BRANDING.schoolName}.
            </p>
          </div>

          {/* Visi & Misi */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className={`p-8 rounded-3xl shadow-sm border ${IS_PUTRA ? "bg-primary-50 border-primary-100" : "bg-pink-50 border-pink-100"}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white shadow-sm ${IS_PUTRA ? "text-primary-600" : "text-pink-600"}`}>
                <Target className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">Visi Kami</h2>
              <p className={`text-xl font-bold italic leading-relaxed ${IS_PUTRA ? "text-primary-800" : "text-pink-800"}`}>
                &quot;Kaderisasi Umat Rabbani, Cendekia, dan Mandiri.&quot;
              </p>
            </div>

            <div className="p-8 rounded-3xl shadow-sm border bg-white border-slate-100">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-slate-100 shadow-sm ${IS_PUTRA ? "text-primary-600" : "text-pink-600"}`}>
                <Compass className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-6">Misi Utama</h2>
              <ul className="space-y-4">
                {[
                  "Menyelenggarakan pendidikan berbasis TICE — Tahfizh, International Curriculum, dan Entrepreneurship.",
                  "Mencetak hamalatul Qur&apos;an dengan bekal ilmu syar&apos;i yang mumpuni.",
                  "Menanamkan jiwa entrepreneurship yang berwawasan global.",
                  "Menanamkan jiwa dakwah melalui keteladanan para pendidik."
                ].map((misi, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 ${IS_PUTRA ? "bg-primary-500" : "bg-pink-500"}`}>
                      <span className="text-xs font-bold">{i+1}</span>
                    </div>
                    <span className="text-slate-700 font-medium leading-relaxed">{misi}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sejarah & Identitas */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-6">Sejarah Berdiri</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                <p>
                  Pesantren Al-Andalus Putra berdiri pada tahun <strong>2013</strong>.
                </p>
                <p>
                  Berlokasi di wilayah Sukamakmur, Bogor, kampus kami berdiri di atas lahan seluas 
                  <strong> 5.5 hektar</strong>.
                </p>
                <p>
                  Kami berkomitmen mencetak generasi Qur&apos;ani yang memiliki bekal ilmu syar&apos;i mumpuni
                  serta berwawasan global, membekali santri tidak hanya
                  dengan hafalan dan pemahaman agama yang lurus, tetapi juga kemandirian dan jiwa entrepreneurship.
                </p>
              </div>
              <div className="mt-8 flex gap-4">
                <div className="flex items-center gap-2 text-slate-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                  <ShieldCheck className={`w-5 h-5 ${IS_PUTRA ? "text-primary-500" : "text-pink-500"}`} />
                  <span className="font-bold text-sm uppercase">Akreditasi A</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-sm uppercase">Muadalah UIM & Al-Azhar</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-100 rounded-3xl aspect-square flex items-center justify-center relative overflow-hidden">
               <img src={BRANDING.logoPath} alt="Logo Al-Andalus" className="w-1/2 h-1/2 object-contain relative z-10 drop-shadow-2xl" />
               <div className={`absolute inset-0 opacity-20 blur-3xl ${IS_PUTRA ? "bg-primary-400" : "bg-pink-400"}`} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
