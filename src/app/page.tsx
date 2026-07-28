import { BRANDING, IS_PUTRA } from "@/config/branding";
import { ArrowRight, BookOpen, Users, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50">
      {/* Background Ornaments */}
      <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] pointer-events-none ${IS_PUTRA ? "bg-primary-300/20" : "bg-sky-300/20"}`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] pointer-events-none ${IS_PUTRA ? "bg-accent-500/10" : "bg-teal-500/10"}`} />

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-16 flex flex-col justify-center relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full glass border shadow-sm mx-auto animate-bounce-slow ${IS_PUTRA ? "border-primary-200" : "border-sky-200"}`}>
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${IS_PUTRA ? "bg-primary-400" : "bg-sky-400"}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${IS_PUTRA ? "bg-primary-500" : "bg-sky-500"}`}></span>
            </span>
            <span className={`text-xs font-bold uppercase tracking-widest ${IS_PUTRA ? "text-primary-800" : "text-sky-800"}`}>
              Pendaftaran Santri Baru Telah Dibuka
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Membangun Generasi <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${IS_PUTRA ? "from-primary-600 to-accent-500" : "from-sky-600 to-teal-500"}`}>
              Rabbani, Cendekia, & Mandiri
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Selamat datang di {BRANDING.schoolName}. Bergabunglah bersama kami untuk mencetak kader ulama berstandar internasional melalui kurikulum unggulan TICE.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
              <Link href="/daftar" className="px-8 py-4 text-white rounded-2xl font-bold text-lg shadow-xl bg-primary-600 hover:bg-primary-700 shadow-primary-600/25 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group">
                Daftar Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <Link href="/tentang" className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-bold text-lg shadow-sm border border-slate-200 transition-all flex items-center justify-center gap-2">
              Profil Pesantren
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-5xl mx-auto">
            {[
              { icon: BookOpen, title: "Kurikulum Internasional", desc: "Perpaduan kurikulum nasional dan timur tengah dengan pengakuan Muadalah." },
              { icon: ShieldCheck, title: "Fasilitas Premium", desc: "Lingkungan asrama dan sekolah yang nyaman, aman, dengan fasilitas penunjang lengkap." },
              { icon: Award, title: "Tenaga Pendidik Ahli", desc: "Diasuh oleh asatidz lulusan dalam dan luar negeri (UIM Madinah, Al-Azhar, dsb)." },
            ].map((feat, i) => (
              <div key={i} className={`glass p-6 rounded-3xl text-left border border-white/60 shadow-lg hover:-translate-y-1 transition-transform ${IS_PUTRA ? "shadow-slate-200/50" : "shadow-sky-100/50"}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${IS_PUTRA ? "bg-primary-100 text-primary-600" : "bg-sky-100 text-sky-600"}`}>
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-2">{feat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* Sebaran Alumni Section */}
          <div className="pt-24 pb-8 max-w-5xl mx-auto text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-8">Melangkah ke <span className={IS_PUTRA ? "text-primary-600" : "text-sky-600"}>Kancah Global</span></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Luar Negeri (3 Benua)</h3>
                <p className="text-slate-600 mb-4">Alumni Al-Andalus tersebar di berbagai universitas terkemuka dunia:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className={`w-4 h-4 ${IS_PUTRA ? "text-primary-500" : "text-sky-500"}`} /> Univ. Islam Madinah (KSA)</li>
                  <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className={`w-4 h-4 ${IS_PUTRA ? "text-primary-500" : "text-sky-500"}`} /> Al-Azhar University (Mesir)</li>
                  <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className={`w-4 h-4 ${IS_PUTRA ? "text-primary-500" : "text-sky-500"}`} /> Istanbul University (Turki)</li>
                  <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className={`w-4 h-4 ${IS_PUTRA ? "text-primary-500" : "text-sky-500"}`} /> Mu&apos;tah University (Yordania)</li>
                </ul>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Dalam Negeri (50+ Kampus)</h3>
                <p className="text-slate-600 mb-4">Berkiprah di berbagai Perguruan Tinggi Negeri dan Swasta favorit:</p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className={`w-4 h-4 ${IS_PUTRA ? "text-primary-500" : "text-sky-500"}`} /> Universitas Indonesia (UI)</li>
                  <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className={`w-4 h-4 ${IS_PUTRA ? "text-primary-500" : "text-sky-500"}`} /> Universitas Gadjah Mada (UGM)</li>
                  <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className={`w-4 h-4 ${IS_PUTRA ? "text-primary-500" : "text-sky-500"}`} /> Institut Teknologi Bandung (ITB)</li>
                  <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className={`w-4 h-4 ${IS_PUTRA ? "text-primary-500" : "text-sky-500"}`} /> Universitas Brawijaya (UB)</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
