"use client";

import { CheckCircle2, FileText, Loader2, RefreshCw, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface PendaftarRingkas {
  id: string;
  nama_lengkap: string;
  nomor_pendaftaran: string;
  jenjang?: string;
}

interface PreviewData {
  nomor_surat: string;
  kelas_diterima: string;
  tanggal_terbit: string;
  pdf_base64: string;
  filename: string;
}

const ASPEK_LABELS = [
  "Tes Tilawah Al-Quran",
  "Tes Kepribadian",
  "Tes Kesiapan",
  "Tes Potensi Akademik",
  "Wawancara Orangtua/wali",
];

/**
 * Dialog "Surat Pengumuman Kelulusan":
 * Tab Utama (Default): Upload Surat Manual — file resmi buatan panitia.
 * Tab Alternatif: Generate Otomatis dari sistem (nomor urut terkunci saat finalisasi).
 */
export function SuratPengumumanDialog({
  pendaftar,
  initialTab = "upload",
  onClose,
  onDone,
}: {
  pendaftar: PendaftarRingkas;
  initialTab?: "generate" | "upload";
  onClose: () => void;
  onDone?: (data?: {
    pendaftarId: string;
    nomorSurat: string;
    kelasDiterima: string;
    suratPath?: string;
  }) => void;
}) {
  const [tab, setTab] = useState<"generate" | "upload">(initialTab);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [kirimWa, setKirimWa] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // field generate
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().slice(0, 10));
  const [kelas, setKelas] = useState("VII");
  const [jenjang, setJenjang] = useState("SMP IT");
  const [gelombang, setGelombang] = useState("1");
  const [hariTanggalTes, setHariTanggalTes] = useState("");
  const [nomorSurat, setNomorSurat] = useState("");
  const [virtualAccount, setVirtualAccount] = useState("");
  const [aspek, setAspek] = useState<{ nilai: string; keterangan: string }[]>(
    ASPEK_LABELS.map(() => ({ nilai: "A", keterangan: "" }))
  );

  // upload manual
  const [file, setFile] = useState<File | null>(null);
  const [nomorManual, setNomorManual] = useState("");
  const [uploading, setUploading] = useState(false);

  // Body Scroll Lock (Mandatory UX Rule)
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow || "unset";
    };
  }, []);

  // Auto-detect jenjang dari data pendaftar
  useEffect(() => {
    const j = (pendaftar.jenjang || "").toUpperCase();
    if (j === "IL" || j.includes("IL") || j.includes("I'DAD") || j.includes("IDAD")) {
      setJenjang("I'dad Lughawiy");
      setKelas("IL");
    } else {
      setJenjang("SMP IT");
      setKelas("VII");
    }
  }, [pendaftar.jenjang]);

  async function loadPreview() {
    setLoadingPreview(true);
    try {
      const res = await fetch("/api/admin/surat-pengumuman/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pendaftar_id: pendaftar.id,
          tanggal_terbit: new Date(`${tanggal}T00:00:00+07:00`).toISOString(),
          kelas_diterima: kelas,
          jenjang,
          gelombang: Number(gelombang) || 1,
          hari_tanggal_tes: hariTanggalTes.trim(),
          virtual_account: virtualAccount.trim(),
          aspek,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal generate preview");
      setPreview(json);
      setNomorSurat(json.nomor_surat);
      setShowEdit(false);
    } catch (e: any) {
      Swal.fire("Gagal", e.message, "error");
    } finally {
      setLoadingPreview(false);
    }
  }

  async function finalize() {
    if (!preview) return;
    const konfirm = await Swal.fire({
      title: "Finalisasi surat?",
      html: `Nomor <b>${nomorSurat}</b> akan <b>terkunci</b>, status pendaftar menjadi <b>Diterima</b>${
        kirimWa ? ", dan surat terkirim ke WhatsApp pendaftar" : ""
      }.<br/><br/>Surat yang sudah final tidak dapat diedit — kesalahan ditangani dengan terbitan ulang bernomor baru.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Finalisasi",
      cancelButtonText: "Batal",
      confirmButtonColor: "#1e5c46",
    });
    if (!konfirm.isConfirmed) return;

    setFinalizing(true);
    try {
      const res = await fetch("/api/admin/surat-pengumuman/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pendaftar_id: pendaftar.id,
          nomor_surat: nomorSurat,
          tanggal_terbit: new Date(`${tanggal}T00:00:00+07:00`).toISOString(),
          kelas_diterima: kelas,
          jenjang,
          gelombang: Number(gelombang) || 1,
          hari_tanggal_tes: hariTanggalTes.trim(),
          virtual_account: virtualAccount.trim(),
          aspek,
          kirim_wa: kirimWa,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal finalisasi");
      await Swal.fire(
        "Terbit!",
        `Surat ${nomorSurat} final${json.data?.wa_sent ? " & terkirim ke WhatsApp" : " (pengiriman WA gagal — kirim manual bila perlu)"}.`,
        "success"
      );
      onDone?.({
        pendaftarId: pendaftar.id,
        nomorSurat: nomorSurat.trim(),
        kelasDiterima: kelas,
      });
      onClose();
    } catch (e: any) {
      Swal.fire("Gagal", e.message, "error");
    } finally {
      setFinalizing(false);
    }
  }

  async function uploadManual() {
    if (!file) {
      Swal.fire(
        "Pilih File Surat",
        "Silakan pilih file PDF surat pengumuman resmi yang akan diunggah.",
        "warning"
      );
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("pendaftar_id", pendaftar.id);
      if (nomorManual.trim()) fd.append("nomor_surat", nomorManual.trim());
      if (kelas.trim()) fd.append("kelas_diterima", kelas.trim());
      fd.append("kirim_wa", String(kirimWa));
      fd.append("file", file);
      const res = await fetch("/api/admin/surat-pengumuman/upload", {
        method: "POST",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal upload");
      await Swal.fire(
        "Alhamdulillah, Tersimpan!",
        `Surat resmi berhasil dipublikasikan untuk ${pendaftar.nama_lengkap}${json.data?.wa_sent ? " dan telah dikirimkan ke WhatsApp" : ""}.`,
        "success"
      );
      onDone?.({
        pendaftarId: pendaftar.id,
        nomorSurat: nomorManual.trim(),
        kelasDiterima: kelas,
        suratPath: json.data?.surat_path,
      });
      onClose();
    } catch (e: any) {
      Swal.fire("Gagal", e.message, "error");
    } finally {
      setUploading(false);
    }
  }

  const pdfUrl = preview ? `data:application/pdf;base64,${preview.pdf_base64}` : null;

  return (
    <div
      onWheel={(e) => e.stopPropagation()}
      data-modal="true"
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 flex items-start md:items-center pt-8 md:pt-0 pb-16 md:pb-0 justify-center bg-black/60 p-4 overflow-y-auto overscroll-contain custom-scrollbar backdrop-blur-sm"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl border border-stone-100 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-stone-100 bg-stone-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-800">
                PSB 2027/2028
              </span>
              <h3 className="text-xl font-black text-stone-900 tracking-tight font-display">
                Surat Pengumuman Kelulusan
              </h3>
            </div>
            <p className="text-sm font-semibold text-stone-600 mt-1">
              {pendaftar.nama_lengkap} <span className="text-stone-400">•</span>{" "}
              {pendaftar.nomor_pendaftaran}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-200/60 rounded-full transition-colors text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3 border-b border-stone-100 bg-stone-50/20">
          <button
            onClick={() => setTab("upload")}
            className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
              tab === "upload"
                ? "bg-white text-primary-700 border-t-2 border-primary-600 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <Upload className="w-4 h-4 inline mr-2 text-primary-600" />
            Upload Surat Manual (Rekomendasi)
          </button>
          <button
            onClick={() => setTab("generate")}
            className={`px-5 py-2.5 text-sm font-bold rounded-t-xl transition-all ${
              tab === "generate"
                ? "bg-white text-primary-700 border-t-2 border-primary-600 shadow-sm"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Generate Otomatis Sistem
          </button>
        </div>

        <div className="p-6">
          {tab === "upload" ? (
            /* TAB UPLOAD MANUAL */
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-emerald-950 text-sm leading-relaxed flex items-start gap-3">
                <div className="p-2 bg-emerald-100 rounded-xl shrink-0 mt-0.5">
                  <Upload className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="font-bold text-emerald-900 mb-0.5">
                    Unggah Surat Keputusan Resmi (Format PDF)
                  </p>
                  <p className="text-xs text-emerald-800">
                    Unggah file PDF surat pengumuman kelulusan yang sudah dibuat rapi oleh
                    Panitia (lengkap dengan kop surat, tanda tangan Ketua Panitia, dan stempel).
                    File asli ini yang akan langsung diunduh santri/wali di portal pendaftar.
                  </p>
                </div>
              </div>

              <label className="text-xs font-bold text-stone-700 block">
                File Surat Pengumuman Resmi (PDF / JPG / PNG){" "}
                <span className="text-red-500">*</span>
                <div className="mt-1.5 border-2 border-dashed border-stone-300 hover:border-primary-500 rounded-2xl p-7 text-center transition-all bg-stone-50/50 hover:bg-primary-50/20 cursor-pointer relative">
                  <input
                    type="file"
                    accept="application/pdf,image/jpeg,image/png"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-10 h-10 mx-auto text-primary-600 mb-2" />
                  {file ? (
                    <div>
                      <p className="text-sm font-bold text-emerald-700">{file.name}</p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Ukuran: {(file.size / 1024).toFixed(1)} KB — Klik untuk mengganti file
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-bold text-stone-700">
                        Klik atau seret file PDF surat resmi ke sini
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        Format yang didukung: .pdf, .jpg, .png (Maksimal 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </label>

              <div className="border border-stone-200/80 rounded-2xl p-3 bg-stone-50/50">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors py-1 px-1"
                >
                  <span className="flex items-center gap-1.5">
                    <span>{showAdvanced ? "▾" : "▸"}</span>
                    <span>Metadata Surat &amp; Kelas (Otomatis Terisi oleh Sistem)</span>
                  </span>
                  <span className="text-[11px] font-normal text-stone-400">
                    {showAdvanced ? "Tutup" : "Lihat / Sesuaikan"}
                  </span>
                </button>

                {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-stone-200/70">
                    <label className="text-xs font-bold text-stone-700 block">
                      Nomor Surat Resmi
                      <input
                        value={nomorManual}
                        onChange={(e) => setNomorManual(e.target.value)}
                        placeholder="Contoh: 001/PSB/G1/X/2728"
                        className="mt-1 w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm font-medium focus:ring-2 focus:ring-primary-500 bg-white"
                      />
                    </label>
                    <label className="text-xs font-bold text-stone-700 block">
                      Kelas Diterima
                      <input
                        value={kelas}
                        onChange={(e) => setKelas(e.target.value)}
                        placeholder="Contoh: VII"
                        className="mt-1 w-full border border-stone-200 rounded-xl px-3.5 py-2 text-sm font-medium focus:ring-2 focus:ring-primary-500 bg-white"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/70 flex items-center justify-between">
                <label className="flex items-center gap-3 text-sm font-semibold text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={kirimWa}
                    onChange={(e) => setKirimWa(e.target.checked)}
                    className="w-4 h-4 rounded text-primary-600 accent-primary-600 focus:ring-primary-500 cursor-pointer"
                  />
                  <span>Kirim surat pengumuman langsung ke WhatsApp pendaftar via Wablas</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-stone-600 hover:bg-stone-100 rounded-xl text-sm font-bold transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={uploadManual}
                  disabled={uploading || !file}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white rounded-xl text-sm font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-sm transition-all active:scale-95 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Mengunggah...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload &amp; Tetapkan Diterima</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* TAB GENERATE OTOMATIS */
            <div className="space-y-4">
              {!preview ? (
                <>
                  <p className="text-sm text-stone-500 max-w-2xl">
                    Sistem membuat surat otomatis dari template resmi panitia dengan nomor urut
                    berikutnya (001, 002, ...). Nomor baru terkunci saat finalisasi. Isi dulu data
                    penilaian di bawah, lalu generate draft untuk dicek.
                  </p>

                  {/* Quick Preset Buttons */}
                  <div className="flex items-center gap-2 my-2 p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0">
                      Pilihan Cepat:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setJenjang("SMP IT");
                        setKelas("VII");
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        jenjang === "SMP IT"
                          ? "bg-primary-600 text-white shadow-xs"
                          : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                      }`}
                    >
                      VII SMP IT
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setJenjang("I'dad Lughawiy");
                        setKelas("IL");
                      }}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        jenjang.includes("I'dad") || jenjang === "IL"
                          ? "bg-amber-600 text-white shadow-xs"
                          : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200"
                      }`}
                    >
                      IL (I&apos;dad Lughawiy)
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <label className="block">
                      Tanggal Terbit:
                      <input
                        type="date"
                        value={tanggal}
                        onChange={(e) => setTanggal(e.target.value)}
                        className="mt-1 w-full border border-stone-200 rounded-xl px-3 py-2 bg-white"
                      />
                    </label>
                    <label className="block">
                      Kelas Diterima:
                      <input
                        value={kelas}
                        onChange={(e) => setKelas(e.target.value)}
                        className="mt-1 w-full border border-stone-200 rounded-xl px-3 py-2 bg-white"
                      />
                    </label>
                    <label className="block">
                      Jenjang:
                      <select
                        value={jenjang}
                        onChange={(e) => setJenjang(e.target.value)}
                        className="mt-1 w-full border border-stone-200 rounded-xl px-3 py-2 bg-white"
                      >
                        <option value="SMP IT">SMP IT</option>
                        <option value="I'dad Lughawiy">I'dad Lughawiy</option>
                      </select>
                    </label>
                    <label className="block">
                      Gelombang:
                      <input
                        type="number"
                        min={1}
                        value={gelombang}
                        onChange={(e) => setGelombang(e.target.value)}
                        className="mt-1 w-full border border-stone-200 rounded-xl px-3 py-2 bg-white"
                      />
                    </label>
                    <label className="block md:col-span-2">
                      Hari, Tanggal Pelaksanaan Tes:
                      <input
                        value={hariTanggalTes}
                        onChange={(e) => setHariTanggalTes(e.target.value)}
                        placeholder="Contoh: Sabtu, 10 Oktober 2026"
                        className="mt-1 w-full border border-stone-200 rounded-xl px-3 py-2 bg-white"
                      />
                    </label>
                    <label className="block md:col-span-2">
                      No. Virtual Account Ananda (lampiran tata cara daftar ulang):
                      <input
                        value={virtualAccount}
                        onChange={(e) => setVirtualAccount(e.target.value)}
                        placeholder="Nomor VA sesuai ketentuan panitia"
                        className="mt-1 w-full border border-stone-200 rounded-xl px-3 py-2 bg-white"
                      />
                    </label>
                  </div>

                  {/* Penilaian per aspek */}
                  <div className="border border-stone-200 rounded-2xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-stone-50 text-stone-500">
                        <tr>
                          <th className="text-left px-3 py-2 font-bold">Aspek Penilaian</th>
                          <th className="text-left px-2 py-2 font-bold w-20">Nilai</th>
                          <th className="text-left px-3 py-2 font-bold">Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ASPEK_LABELS.map((label, i) => (
                          <tr key={label} className="border-t border-stone-100">
                            <td className="px-3 py-2 font-semibold text-stone-700">{label}</td>
                            <td className="px-2 py-2">
                              <select
                                value={aspek[i].nilai}
                                onChange={(e) =>
                                  setAspek((prev) =>
                                    prev.map((a, idx) =>
                                      idx === i ? { ...a, nilai: e.target.value } : a
                                    )
                                  )
                                }
                                className="w-full border border-stone-200 rounded-lg px-2 py-1.5 bg-white"
                              >
                                {["A", "B", "C", "D"].map((n) => (
                                  <option key={n} value={n}>
                                    {n}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-2">
                              <textarea
                                value={aspek[i].keterangan}
                                onChange={(e) =>
                                  setAspek((prev) =>
                                    prev.map((a, idx) =>
                                      idx === i ? { ...a, keterangan: e.target.value } : a
                                    )
                                  )
                                }
                                rows={2}
                                placeholder={
                                  i === 0
                                    ? "Contoh: Bacaan sangat bagus, fasih, dan lancar."
                                    : i === 2 || i === 3
                                      ? "Contoh: Istimewa"
                                      : "Komentar naratif per aspek"
                                }
                                className="w-full border border-stone-200 rounded-lg px-2 py-1.5 bg-white"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-center pt-1">
                    <button
                      onClick={loadPreview}
                      disabled={loadingPreview}
                      className="px-5 py-2.5 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-sm font-black uppercase tracking-wider inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      {loadingPreview ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      Generate Draft Surat
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl text-xs">
                    <div>
                      <span className="font-bold text-stone-600">Nomor draft: </span>
                      <span className="font-mono font-bold text-primary-800">
                        {preview.nomor_surat}
                      </span>
                      <span className="text-stone-400 ml-2">
                        (belum terkunci — akan dikunci saat finalisasi)
                      </span>
                    </div>
                    <div className="text-stone-500">
                      Kelas:{" "}
                      <span className="font-bold text-stone-700">{preview.kelas_diterima}</span>
                    </div>
                  </div>

                  {pdfUrl && (
                    <div className="border border-stone-200 rounded-xl overflow-hidden h-[450px]">
                      <iframe
                        src={`${pdfUrl}#toolbar=0`}
                        title="Preview Surat"
                        className="w-full h-full"
                      />
                    </div>
                  )}

                  {showEdit && (
                    <div className="p-4 bg-amber-50 rounded-xl space-y-3 border border-amber-100">
                      <p className="text-xs font-bold text-amber-800">
                        Koreksi Data Sebelum Finalisasi:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                        <label className="block">
                          Tanggal Terbit:
                          <input
                            type="date"
                            value={tanggal}
                            onChange={(e) => setTanggal(e.target.value)}
                            className="mt-1 w-full border border-stone-200 rounded px-2 py-1 bg-white"
                          />
                        </label>
                        <label className="block">
                          Kelas Diterima:
                          <input
                            value={kelas}
                            onChange={(e) => setKelas(e.target.value)}
                            className="mt-1 w-full border border-stone-200 rounded px-2 py-1 bg-white"
                          />
                        </label>
                        <label className="block">
                          Nomor Surat (koreksi):
                          <input
                            value={nomorSurat}
                            onChange={(e) => setNomorSurat(e.target.value)}
                            className="mt-1 w-full border border-stone-200 rounded px-2 py-1 bg-white font-mono"
                          />
                        </label>
                      </div>
                      <button
                        onClick={loadPreview}
                        disabled={loadingPreview}
                        className="px-3 py-1.5 bg-amber-600 text-white rounded text-xs font-bold inline-flex items-center gap-1.5"
                      >
                        {loadingPreview ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5" />
                        )}
                        Regenerate Preview
                      </button>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={kirimWa}
                        onChange={(e) => setKirimWa(e.target.checked)}
                        className="w-4 h-4 accent-primary-700"
                      />
                      Kirim surat ke WhatsApp pendaftar
                    </label>
                    <div className="flex gap-2">
                      {!showEdit && (
                        <button
                          onClick={() => setShowEdit(true)}
                          className="px-4 py-2 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Koreksi
                        </button>
                      )}
                      <button
                        onClick={finalize}
                        disabled={finalizing}
                        className="px-5 py-2 bg-primary-700 hover:bg-primary-800 text-white rounded-xl text-xs font-black uppercase tracking-wider inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        {finalizing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        Finalisasi &amp; Kirim
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
