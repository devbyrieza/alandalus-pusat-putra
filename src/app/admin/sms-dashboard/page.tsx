"use client";

import { useState, useEffect } from "react";
import { RefreshCw, Check, Smartphone, User, Key, ClipboardList, CheckCircle2, FileText, BarChart3, Calendar, Sparkles, Send } from "lucide-react";

interface PendingSMS {
  id: string;
  phone: string;
  otp: string;
  nama: string;
  status: string;
  created_at: string;
}

export default function AdminSMSDashboard() {
  const [pendingSMS, setPendingSMS] = useState<PendingSMS[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingSMS = async () => {
    try {
      const response = await fetch("/api/admin/pending-sms?status=pending");
      const data = await response.json();
      if (data.success) {
        setPendingSMS(data.data);
      }
    } catch (error) {
      console.error("Error fetching pending SMS:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsSent = async (id: string) => {
    try {
      const response = await fetch("/api/admin/pending-sms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "sent" }),
      });

      if (response.ok) {
        fetchPendingSMS(); // Refresh list
      }
    } catch (error) {
      console.error("Error marking as sent:", error);
    }
  };

  useEffect(() => {
    fetchPendingSMS();
    const interval = setInterval(fetchPendingSMS, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary-600" />
          <p className="mt-4 text-slate-600 font-bold">Memuat data SMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Dashboard Admin - SMS Manual
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Sistem dalam{" "}
              <span className="font-bold text-amber-600">Simulation Mode</span>.
              Kirim SMS manual ke user berikut:
            </p>
          </div>
        </div>

        <div className="bg-primary-50/80 border border-primary-200/80 rounded-2xl p-5">
          <h3 className="font-black text-primary-900 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
            <ClipboardList className="w-4 h-4 text-primary-700" />
            Instruksi Pengiriman
          </h3>
          <ol className="list-decimal list-inside text-primary-800 text-sm font-medium space-y-1.5 leading-relaxed">
            <li>Salin nomor HP dan OTP di bawah</li>
            <li>Kirim SMS dari HP Admin ke nomor tersebut</li>
            <li>Pesan: &quot;PPDB AL-IMAM: Kode OTP: [OTP] untuk [NAMA]&quot;</li>
            <li>Klik tombol &quot;Sudah Dikirim&quot; setelah selesai</li>
          </ol>
        </div>

        <div className="flex justify-between items-center pt-2">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Send className="w-5 h-5 text-primary-600" />
            Daftar SMS Perlu Dikirim ({pendingSMS.length})
          </h2>
          <button
            onClick={fetchPendingSMS}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-95 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {pendingSMS.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="text-slate-700 font-black text-lg">
              Tidak Ada SMS yang Perlu Dikirim
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Semua OTP sudah terkirim atau belum ada pendaftaran baru.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingSMS.map((item) => (
              <div
                key={item.id}
                className="border border-slate-200/80 bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <div className="p-2.5 bg-primary-100 rounded-xl">
                      <Smartphone className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Nomor HP</p>
                      <p className="font-black text-slate-900 text-base">{item.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <div className="p-2.5 bg-emerald-100 rounded-xl">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Nama Santri</p>
                      <p className="font-black text-slate-900 text-base">{item.nama}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                    <div className="p-2.5 bg-rose-100 rounded-xl">
                      <Key className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Kode OTP</p>
                      <p className="font-black text-2xl text-rose-600">
                        {item.otp}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-5 mb-5 text-white">
                  <p className="text-xs font-bold text-slate-400 mb-2 uppercase flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> Pesan yang Dikirim
                  </p>
                  <pre className="font-mono text-sm leading-relaxed text-slate-200 whitespace-pre-wrap">
                    {`PPDB AL-IMAM
Kode OTP: ${item.otp}
Untuk: ${item.nama}

Jangan bagikan kode ini.
Hubungi 0851-1152-4441 jika ada masalah.`}
                  </pre>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => markAsSent(item.id)}
                    className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" /> Sudah Dikirim
                  </button>

                  <a
                    href={`sms:${item.phone}&body=PPDB AL-IMAM: Kode OTP: ${item.otp} untuk ${item.nama}`}
                    className="py-3 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Smartphone className="w-5 h-5" /> Buka Aplikasi SMS
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
        <h3 className="font-black text-slate-900 mb-5 flex items-center gap-2 text-lg">
          <BarChart3 className="w-5 h-5 text-primary-600" /> Status Sistem
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-primary-50/80 p-5 rounded-2xl border border-primary-100">
            <p className="text-xs font-bold text-primary-700 uppercase">SMS Service</p>
            <p className="text-xl font-black text-primary-950 mt-1 flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4 text-primary-600 animate-spin" /> Simulation
            </p>
          </div>
          <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-100">
            <p className="text-xs font-bold text-emerald-700 uppercase">Telegram</p>
            <p className="text-xl font-black text-emerald-950 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Ready
            </p>
          </div>
          <div className="bg-purple-50/80 p-5 rounded-2xl border border-purple-100">
            <p className="text-xs font-bold text-purple-700 uppercase">Email</p>
            <p className="text-xl font-black text-purple-950 mt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" /> Ready
            </p>
          </div>
          <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-100">
            <p className="text-xs font-bold text-amber-700 uppercase">Launch Date</p>
            <p className="text-xl font-black text-amber-950 mt-1 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-600" /> 22 Jan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
