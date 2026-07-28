import Footer from "@/components/layout/Footer";
import { BRANDING, IS_PUTRA } from "@/config/branding";
import { GraduationCap, BookOpen, Globe, Sparkles, CheckCircle2 } from "lucide-react";

export default function ProgramPage() {
  const programs = [
    {
      title: "Madrasah Tsanawiyah (MTs)",
      desc: "Kurikulum Terpadu yang menggabungkan standar Nasional dengan khas Andalus, berfokus pada penguasaan Tahfidz Al-Qur'an serta pembentukan karakter Leadership.",
      icon: GraduationCap,
      points: ["Target Hafalan 12 Juz Mutqin", "Leadership & Character Building", "Bahasa Arab & Inggris Yaumiyah", "Kurikulum Nasional Lengkap"]
    },
    {
      title: "I'dad Lughowi (Persiapan SMA)",
      desc: "Program persiapan intensif menuju jenjang Aliyah, berfokus pada pemantapan Bahasa Arab, Tahfidz, dan kematangan leadership organisasi.",
      icon: BookOpen,
      points: ["Tahun I'dad: Intensif Bahasa Arab", "Target Hafalan 16 Juz", "Kajian Kitab Turots Dasar", "Pembinaan Dakwah Lapangan"]
    },
    {
      title: "International Program (IPA)",
      desc: "Program unggulan untuk mempersiapkan kelanjutan studi santri ke Universitas Internasional di 3 benua (Asia, Eropa, Afrika).",
      icon: Globe,
      points: ["Bimbingan Studi Timur Tengah, Turki & Malaysia", "Persiapan TOEFL/IELTS & Muadalah", "Pengembangan Portofolio Global"]
    },
    {
      title: "Entrepreneurship & Digital",
      desc: "Program membekali santri dengan wawasan kewirausahaan dan skill digital sesuai dengan misi menjadi generasi mandiri.",
      icon: Sparkles,
      points: ["Market Day Dalam & Luar Negeri", "Program Jurnalistik & Coding Dasar", "Praktik Bisnis Langsung"]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Program Pendidikan</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Kurikulum terintegrasi komprehensif yang menyelaraskan standar Nasional dengan khas {BRANDING.schoolName}.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {programs.map((prog, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${IS_PUTRA ? "bg-primary-50 text-primary-600" : "bg-sky-50 text-sky-600"}`}>
                  <prog.icon className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-4">{prog.title}</h2>
                <p className="text-slate-600 mb-6 leading-relaxed">{prog.desc}</p>
                <ul className="space-y-3">
                  {prog.points.map((pt, idx) => (
                    <li key={idx} className="flex gap-3 items-center">
                      <CheckCircle2 className={`w-5 h-5 shrink-0 ${IS_PUTRA ? "text-primary-500" : "text-sky-500"}`} />
                      <span className="text-sm font-semibold text-slate-700">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Ekskul Section */}
          <div className="mt-24 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 text-center">
             <h2 className="text-3xl font-black text-slate-900 mb-6">Ekstrakurikuler</h2>
             <p className="text-slate-600 mb-8 max-w-2xl mx-auto">Pengembangan minat dan bakat santri yang terarah dan profesional.</p>
             <div className="flex flex-wrap justify-center gap-3">
               {["Berkuda", "Pramuka", "Wushu", "Basket", "Futsal", "Panahan", "Voli", "Badminton", "Tenis Meja", "Renang", "Arabic & English Club", "Science Club", "Multimedia-Design & Coding", "Kaligrafi", "KIR"].map(e => <span key={e} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-semibold text-slate-700">{e}</span>)}
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
