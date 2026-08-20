/**
 * EXPORT DATA SANTRI - UNTUK KEPALA BAGIAN KEPENGASUHAN & KESANTRIAN
 * Tahun Ajaran 2026/2027
 *
 * Data yang di-export:
 * - Data Identitas Santri (nama, NIS, NIK, jenis kelamin, TTL, dll)
 * - Asal sekolah / asal daerah
 * - Kontak (no HP santri, email)
 * - Data Orang Tua (ayah, ibu, wali)
 * - Data Kesehatan (tinggi, berat, penyakit, alergi)
 * - Data Asrama (pilihan asrama, preferensi)
 * - Status Pembayaran Daftar Ulang
 * - Hafalan Al-Quran
 * - Ukuran Seragam
 *
 * Cara pakai:
 *   node scripts/export-data-kepengasuhan.js
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const TAHUN_AJARAN_ID = '33acea8f-5049-4a0a-a064-ede3db6d133f'; // 2026/2027

function escCsv(val) {
  if (val === null || val === undefined) return '';
  const s = String(val).trim();
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function row(arr) {
  return arr.map(escCsv).join(',') + '\n';
}

async function main() {
  console.log('⏳ Mengambil data santri Al-Imam 2026/2027...\n');

  const santriList = await prisma.pendaftar.findMany({
    where: {
      tahun_ajaran_id: TAHUN_AJARAN_ID,
      deleted_at: null,
      status_pendaftaran: { not: 'mengundurkan_diri' },
      NOT: [
        { nama_lengkap: { startsWith: 'TEST ', mode: 'insensitive' } },
        { nama_lengkap: { contains: 'BYPASS', mode: 'insensitive' } },
      ],
      OR: [
        { status_pendaftaran: { in: ['accepted', 'announced', 'cadangan', 'passed', 'enrolled'] } },
        { hasil_seleksi: { status_seleksi: { in: ['DITERIMA', 'CADANGAN'] } } },
        { pengumuman: { status_kelulusan: { in: ['Lulus', 'Diterima', 'Cadangan'] } } },
        { tipe_pendaftaran: 'PINDAHAN' },
        { nilai_ujian: { some: { status_kelulusan: { in: ['LULUS', 'DITERIMA'] } } } },
      ],
    },
    include: {
      orang_tua: true,
      kesehatan: true,
      asrama: true,
      pembayaran: {
        where: {
          jenis_pembayaran: 'DAFTAR_ULANG',
          status_pembayaran: { in: ['verified', 'success'] },
        },
        orderBy: { created_at: 'asc' },
        take: 1,
      },
      pengajuan_beasiswa: true,
      hasil_seleksi: true,
      pengumuman: true,
    },
    orderBy: [
      { jenis_kelamin: 'asc' },
      { nama_lengkap: 'asc' },
    ],
  });

  console.log(`✅ Ditemukan ${santriList.length} santri diterima.\n`);

  // ============================================================
  // FILE 1: DATA UTAMA SANTRI
  // ============================================================
  const f1Header = [
    'No', 'No Pendaftaran', 'NIS', 'NIK',
    'Nama Lengkap', 'Jenis Kelamin', 'Jenjang',
    'Tempat Lahir', 'Tanggal Lahir', 'Umur',
    'Alamat Lengkap', 'RT', 'RW', 'Kelurahan/Desa', 'Kecamatan', 'Kabupaten/Kota', 'Provinsi', 'Kode Pos',
    'Asal Sekolah', 'NPSN Sekolah', 'Alamat Sekolah', 'Tahun Lulus',
    'NISN', 'Golongan Darah',
    'No HP Santri/Ortu', 'Email',
    'Anak Ke', 'Jumlah Saudara', 'Hobi', 'Cita-cita',
    'Jumlah Hafalan', 'Sumber Informasi',
    'Ukuran Baju', 'Ukuran Celana', 'Ukuran Almamater',
    'Tipe Pendaftaran', 'Status Pendaftaran',
    'Beasiswa/Keringanan',
  ];

  let f1 = '\uFEFF'; // BOM untuk Excel
  f1 += row(f1Header);

  let noUrut = 1;
  const now = new Date();

  for (const s of santriList) {
    const umur = s.tanggal_lahir
      ? Math.floor((now - new Date(s.tanggal_lahir)) / (365.25 * 24 * 3600 * 1000))
      : '';

    const tglLahir = s.tanggal_lahir
      ? new Date(s.tanggal_lahir).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : '';

    let beasiswaInfo = '';
    if (s.pengajuan_beasiswa) {
      const pb = s.pengajuan_beasiswa;
      if (pb.status === 'DISETUJUI') {
        if (pb.tipe_potongan === 'PERSENTASE' && pb.persentase_potongan) {
          beasiswaInfo = `${pb.jenis_pengajuan} - ${pb.persentase_potongan}%`;
        } else if (pb.tipe_potongan === 'NOMINAL' && pb.nominal_potongan) {
          beasiswaInfo = `${pb.jenis_pengajuan} - Rp${Number(pb.nominal_potongan).toLocaleString('id-ID')}`;
        } else {
          beasiswaInfo = `${pb.jenis_pengajuan} - DISETUJUI`;
        }
      } else {
        beasiswaInfo = `${pb.jenis_pengajuan} - ${pb.status}`;
      }
    }

    f1 += row([
      noUrut,
      s.nomor_pendaftaran,
      s.nis || '',
      s.nik || '',
      s.nama_lengkap,
      s.jenis_kelamin === 'L' ? 'Laki-laki' : s.jenis_kelamin === 'P' ? 'Perempuan' : s.jenis_kelamin,
      s.jenjang || '',
      s.tempat_lahir || '',
      tglLahir,
      umur,
      s.alamat || '',
      s.rt || '',
      s.rw || '',
      s.kelurahan || '',
      s.kecamatan || '',
      s.kabupaten || '',
      s.provinsi || '',
      s.kode_pos || '',
      s.asal_sekolah || '',
      s.npsn || '',
      s.alamat_sekolah || '',
      s.tahun_lulus || '',
      s.nisn || '',
      s.golongan_darah || '',
      s.no_hp || '',
      s.email || '',
      s.anak_ke || '',
      s.jumlah_saudara || '',
      s.hobi || '',
      s.cita_cita || '',
      s.jumlah_hafalan || '',
      s.sumber_informasi || '',
      s.ukuran_seragam_baju || '',
      s.ukuran_seragam_celana || '',
      s.ukuran_seragam_almamater || '',
      s.tipe_pendaftaran || 'BARU',
      s.status_pendaftaran || '',
      beasiswaInfo,
    ]);
    noUrut++;
  }

  const f1Name = 'DataSantri_AlImam_2026/2027_UTAMA.csv';
  fs.writeFileSync(path.join('/tmp', f1Name), f1, 'utf8');
  console.log(`📄 File 1 selesai: ${f1Name}`);

  // ============================================================
  // FILE 2: DATA ORANG TUA / WALI
  // ============================================================
  const f2Header = [
    'No', 'No Pendaftaran', 'Nama Santri', 'Jenis Kelamin', 'Provinsi Asal',
    // AYAH
    'Nama Ayah', 'NIK Ayah', 'TTL Ayah', 'Pendidikan Ayah', 'Pekerjaan Ayah',
    'Penghasilan Ayah', 'No HP Ayah', 'Email Ayah', 'Status Ayah', 'Status Pernikahan',
    // IBU
    'Nama Ibu', 'NIK Ibu', 'TTL Ibu', 'Pendidikan Ibu', 'Pekerjaan Ibu',
    'Penghasilan Ibu', 'No HP Ibu', 'Email Ibu', 'Status Ibu',
    // WALI
    'Nama Wali', 'Hubungan Wali', 'No HP Wali', 'Alamat Wali',
    'Kecamatan Wali', 'Kabupaten Wali', 'Provinsi Wali',
  ];

  let f2 = '\uFEFF';
  f2 += row(f2Header);
  let no2 = 1;

  for (const s of santriList) {
    const ot = s.orang_tua;
    const tglAyah = ot?.tanggal_lahir_ayah
      ? new Date(ot.tanggal_lahir_ayah).toLocaleDateString('id-ID')
      : '';
    const tglIbu = ot?.tanggal_lahir_ibu
      ? new Date(ot.tanggal_lahir_ibu).toLocaleDateString('id-ID')
      : '';

    f2 += row([
      no2, s.nomor_pendaftaran, s.nama_lengkap,
      s.jenis_kelamin === 'L' ? 'Laki-laki' : s.jenis_kelamin === 'P' ? 'Perempuan' : s.jenis_kelamin,
      s.provinsi || '',
      // Ayah
      ot?.nama_ayah || '', ot?.nik_ayah || '',
      (ot?.tempat_lahir_ayah || '') + (tglAyah ? ', ' + tglAyah : ''),
      ot?.pendidikan_ayah || '', ot?.pekerjaan_ayah || '',
      ot?.penghasilan_ayah || '', ot?.no_hp_ayah || '', ot?.email_ayah || '',
      ot?.status_ayah || '', ot?.status_pernikahan_ayah || '',
      // Ibu
      ot?.nama_ibu || '', ot?.nik_ibu || '',
      (ot?.tempat_lahir_ibu || '') + (tglIbu ? ', ' + tglIbu : ''),
      ot?.pendidikan_ibu || '', ot?.pekerjaan_ibu || '',
      ot?.penghasilan_ibu || '', ot?.no_hp_ibu || '', ot?.email_ibu || '',
      ot?.status_ibu || '',
      // Wali
      ot?.nama_wali || '', ot?.hubungan_wali || '', ot?.no_hp_wali || '',
      ot?.alamat_wali || '', ot?.kecamatan_wali || '', ot?.kabupaten_wali || '', ot?.provinsi_wali || '',
    ]);
    no2++;
  }

  const f2Name = 'DataSantri_AlImam_2026/2027_ORANGTUA.csv';
  fs.writeFileSync(path.join('/tmp', f2Name), f2, 'utf8');
  console.log(`📄 File 2 selesai: ${f2Name}`);

  // ============================================================
  // FILE 3: DATA KESEHATAN & ASRAMA
  // ============================================================
  const f3Header = [
    'No', 'No Pendaftaran', 'Nama Santri', 'Jenis Kelamin',
    // Kesehatan
    'Tinggi Badan (cm)', 'Berat Badan (kg)',
    'Riwayat Penyakit', 'Penyakit Kronis', 'Alergi', 'Disabilitas',
    'Hasil HBsAg', 'Tgl Tes HBsAg', 'Status Imunisasi',
    'Status Verif Kesehatan',
    // Asrama
    'Pilihan Asrama', 'Bersedia Cabang', 'Pilihan Cabang', 'Preferensi Teman Sekamar',
  ];

  let f3 = '\uFEFF';
  f3 += row(f3Header);
  let no3 = 1;

  for (const s of santriList) {
    const ks = s.kesehatan;
    const as = s.asrama;

    const tglHbsag = ks?.hbsag_test_date
      ? new Date(ks.hbsag_test_date).toLocaleDateString('id-ID')
      : '';

    f3 += row([
      no3, s.nomor_pendaftaran, s.nama_lengkap,
      s.jenis_kelamin === 'L' ? 'Laki-laki' : s.jenis_kelamin === 'P' ? 'Perempuan' : s.jenis_kelamin,
      ks?.tinggi_badan || '', ks?.berat_badan || '',
      ks?.riwayat_penyakit || '-', ks?.penyakit_kronis || '-',
      ks?.alergi || '-', ks?.disabilitas || '-',
      ks?.hbsag_result || '', tglHbsag, ks?.status_imunisasi || '',
      ks?.is_verified ? 'Terverifikasi' : 'Belum Diverifikasi',
      as?.pilihan_asrama === true ? 'Ya (Asrama)' : as?.pilihan_asrama === false ? 'Tidak (Tidak Asrama)' : '-',
      as?.bersedia_cabang ? 'Ya' : 'Tidak',
      as?.pilihan_cabang || '',
      as?.preferensi_teman_sekamar || '',
    ]);
    no3++;
  }

  const f3Name = 'DataSantri_AlImam_2026/2027_KESEHATAN.csv';
  fs.writeFileSync(path.join('/tmp', f3Name), f3, 'utf8');
  console.log(`📄 File 3 selesai: ${f3Name}`);

  // ============================================================
  // FILE 4: REKAPITULASI ASAL DAERAH
  // ============================================================
  const provinsiMap = {};
  const kabupatenMap = {};
  const sekolahMap = {};

  for (const s of santriList) {
    const prov = s.provinsi || 'Tidak Diisi';
    provinsiMap[prov] = (provinsiMap[prov] || 0) + 1;

    const kab = (s.kabupaten || 'Tidak Diisi') + (s.provinsi ? ` (${s.provinsi})` : '');
    kabupatenMap[kab] = (kabupatenMap[kab] || 0) + 1;

    const sekolah = s.asal_sekolah || 'Tidak Diisi';
    if (!sekolahMap[sekolah]) sekolahMap[sekolah] = { count: 0, kab: s.kabupaten || '-', prov: s.provinsi || '-' };
    sekolahMap[sekolah].count++;
  }

  let f4 = '\uFEFF';
  f4 += '=== REKAPITULASI ASAL PROVINSI ===\n';
  f4 += row(['No', 'Provinsi', 'Jumlah Santri', 'Persentase']);
  const sortedProv = Object.entries(provinsiMap).sort((a, b) => b[1] - a[1]);
  let no4 = 1;
  for (const [prov, cnt] of sortedProv) {
    f4 += row([no4, prov, cnt, ((cnt / santriList.length) * 100).toFixed(1) + '%']);
    no4++;
  }

  f4 += '\n=== REKAPITULASI ASAL KABUPATEN/KOTA ===\n';
  f4 += row(['No', 'Kabupaten/Kota', 'Jumlah Santri']);
  const sortedKab = Object.entries(kabupatenMap).sort((a, b) => b[1] - a[1]);
  let no5 = 1;
  for (const [kab, cnt] of sortedKab) {
    f4 += row([no5, kab, cnt]);
    no5++;
  }

  f4 += '\n=== REKAPITULASI ASAL SEKOLAH ===\n';
  f4 += row(['No', 'Asal Sekolah', 'Kabupaten', 'Provinsi', 'Jumlah']);
  const sortedSekolah = Object.entries(sekolahMap).sort((a, b) => b[1].count - a[1].count);
  let no6 = 1;
  for (const [sekolah, data] of sortedSekolah) {
    f4 += row([no6, sekolah, data.kab, data.prov, data.count]);
    no6++;
  }

  const f4Name = 'DataSantri_AlImam_2026/2027_REKAP_ASAL.csv';
  fs.writeFileSync(path.join('/tmp', f4Name), f4, 'utf8');
  console.log(`📄 File 4 selesai: ${f4Name}`);

  // ============================================================
  // FILE 5: KONTAK DARURAT (WhatsApp santri & ortu)
  // ============================================================
  const f5Header = [
    'No', 'No Pendaftaran', 'NIS', 'Nama Santri', 'Jenis Kelamin',
    'No HP Santri', 'Nama Ayah', 'No HP Ayah', 'Nama Ibu', 'No HP Ibu',
    'Nama Wali', 'Hubungan Wali', 'No HP Wali',
    'Provinsi', 'Kabupaten', 'Asal Sekolah',
  ];

  let f5 = '\uFEFF';
  f5 += row(f5Header);
  let no7 = 1;

  for (const s of santriList) {
    const ot = s.orang_tua;
    f5 += row([
      no7, s.nomor_pendaftaran, s.nis || '', s.nama_lengkap,
      s.jenis_kelamin === 'L' ? 'Laki-laki' : s.jenis_kelamin === 'P' ? 'Perempuan' : s.jenis_kelamin,
      s.no_hp || '',
      ot?.nama_ayah || '', ot?.no_hp_ayah || '',
      ot?.nama_ibu || '', ot?.no_hp_ibu || '',
      ot?.nama_wali || '', ot?.hubungan_wali || '', ot?.no_hp_wali || '',
      s.provinsi || '', s.kabupaten || '', s.asal_sekolah || '',
    ]);
    no7++;
  }

  const f5Name = 'DataSantri_AlImam_2026/2027_KONTAK.csv';
  fs.writeFileSync(path.join('/tmp', f5Name), f5, 'utf8');
  console.log(`📄 File 5 selesai: ${f5Name}`);

  // ============================================================
  // RINGKASAN
  // ============================================================
  const totalL = santriList.filter(s => s.jenis_kelamin === 'L').length;
  const totalP = santriList.filter(s => s.jenis_kelamin === 'P').length;
  const totalDenganNIS = santriList.filter(s => s.nis).length;
  const totalDenganDarulang = santriList.filter(s => s.pembayaran && s.pembayaran.length > 0).length;

  console.log('\n========================================');
  console.log('📊 RINGKASAN DATA SANTRI AL-IMAM 2026/2027');
  console.log('========================================');
  console.log(`Total Santri    : ${santriList.length}`);
  console.log(`Laki-laki       : ${totalL}`);
  console.log(`Perempuan       : ${totalP}`);
  console.log(`Sudah dapat NIS : ${totalDenganNIS}`);
  console.log(`Lunas Daftar Ulang : ${totalDenganDarulang}`);
  console.log('\n📁 FILE YANG DIHASILKAN (di /tmp):');
  console.log(`  1. ${f1Name} - Data Identitas Lengkap`);
  console.log(`  2. ${f2Name} - Data Orang Tua & Wali`);
  console.log(`  3. ${f3Name} - Data Kesehatan & Asrama`);
  console.log(`  4. ${f4Name} - Rekap Asal Daerah`);
  console.log(`  5. ${f5Name} - Kontak Darurat`);
  console.log('\n✅ SELESAI!');
}

main()
  .catch(err => { console.error('ERROR:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
