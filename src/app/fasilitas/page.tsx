import { BRANDING, IS_PUTRA } from "@/config/branding";
import { Building2, Stethoscope, Droplets, Laptop, ShieldCheck, Home } from "lucide-react";

export default function FasilitasPage() {
  const fasilitas = [
    {
      title: "Masjid Kapasitas 1500+ Jama'ah",
      desc: "Pusat kegiatan ibadah dan halaqah tahfidz Al-Qur'an dengan suasana yang nyaman, luas, dan kondusif untuk menunjang hafalan santri.",
      icon: Building2,
    },
    {
      title: "Klinik Kesehatan",
      desc: "Pelayanan kesehatan optimal dengan jadwal kunjungan dokter rutin untuk santri yang sedang sakit, dilengkapi dengan perawat siaga.",
      icon: Stethoscope,
    },
    {
      title: "Air Minum Reverse Osmosis (RO)",
      desc: "Fasilitas penyediaan air minum RO yang higienis, menyehatkan dan aman dikonsumsi oleh seluruh santri dan staf.",
      icon: Droplets,
    },
    {
      title: "Asrama Santri yang Nyaman",
      desc: "Kamar asrama berstandar tinggi yang bersih, nyaman, dan ber-AC (pada area tertentu) dengan tata letak yang representatif.",
      icon: Home,
    },
    {
      title: "Keamanan CCTV 24 Jam",
      desc: "Lingkungan pesantren dipantau penuh dengan sistem CCTV di berbagai titik rawan dan dikelola oleh satuan pengamanan.",
      icon: ShieldCheck,
    },
    {
      title: "Lab Komputer & Perpustakaan",
      desc: "Akses teknologi dan literasi yang memadai untuk menunjang kurikulum diniah, umum, serta pelatihan coding.",
      icon: Laptop,
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Fasilitas Pesantren</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Infrastruktur dan fasilitas unggulan untuk mendukung kenyamanan kegiatan belajar dan keseharian santri di {BRANDING.schoolName}.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fasilitas.map((fas, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${IS_PUTRA ? "bg-primary-50 text-primary-600" : "bg-pink-50 text-pink-600"}`}>
                  <fas.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{fas.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{fas.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
