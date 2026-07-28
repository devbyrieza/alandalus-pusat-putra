/**
 * EXPORT DATA SANTRI KE EXCEL
 * Tahun Ajaran 2026/2027
 */

const { PrismaClient } = require('@prisma/client');
const ExcelJS = require('exceljs');
const path = require('path');

const prisma = new PrismaClient();
const TAHUN_AJARAN_ID = '33acea8f-5049-4a0a-a064-ede3db6d133f'; // 2026/2027

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
        where: { jenis_pembayaran: 'DAFTAR_ULANG', status_pembayaran: { in: ['verified', 'success'] } },
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

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Admin Al-Imam';
  workbook.created = new Date();

  // Helper for styling headers
  const styleHeader = (worksheet, headers) => {
    worksheet.columns = headers.map(h => ({ header: h, key: h, width: Math.max(h.length + 5, 15) }));
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } }; 
    worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  };

  const now = new Date();

  // ==========================================
  // SHEET 1: UTAMA
  // ==========================================
  const sheetUtama = workbook.addWorksheet('Data Utama');
  styleHeader(sheetUtama, [
    'No', 'No Pendaftaran', 'NIS', 'NIK', 'Nama Lengkap', 'Jenis Kelamin', 'Jenjang',
    'Tempat Lahir', 'Tanggal Lahir', 'Umur', 'Alamat Lengkap', 'RT', 'RW', 'Kelurahan/Desa', 
    'Kecamatan', 'Kabupaten/Kota', 'Provinsi', 'Kode Pos', 'Asal Sekolah', 'NPSN Sekolah', 
    'Alamat Sekolah', 'Tahun Lulus', 'NISN', 'Golongan Darah', 'No HP Santri/Ortu', 'Email',
    'Anak Ke', 'Jumlah Saudara', 'Hobi', 'Cita-cita', 'Jumlah Hafalan', 'Sumber Informasi',
    'Ukuran Baju', 'Ukuran Celana', 'Ukuran Almamater', 'Tipe Pendaftaran', 'Status Pendaftaran',
    'Beasiswa/Keringanan'
  ]);

  let no = 1;
  for (const s of santriList) {
    const umur = s.tanggal_lahir ? Math.floor((now - new Date(s.tanggal_lahir)) / (365.25 * 24 * 3600 * 1000)) : '';
    const tglLahir = s.tanggal_lahir ? new Date(s.tanggal_lahir).toLocaleDateString('id-ID') : '';
    let beasiswaInfo = '';
    if (s.pengajuan_beasiswa && s.pengajuan_beasiswa.status === 'DISETUJUI') {
        beasiswaInfo = `${s.pengajuan_beasiswa.jenis_pengajuan} - ${s.pengajuan_beasiswa.tipe_potongan === 'PERSENTASE' ? s.pengajuan_beasiswa.persentase_potongan + '%' : 'Rp' + Number(s.pengajuan_beasiswa.nominal_potongan).toLocaleString('id-ID')}`;
    }
    
    sheetUtama.addRow([
      no++, s.nomor_pendaftaran, s.nis || '', s.nik || '', s.nama_lengkap, 
      s.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan', s.jenjang || '',
      s.tempat_lahir || '', tglLahir, umur, s.alamat || '', s.rt || '', s.rw || '', 
      s.kelurahan || '', s.kecamatan || '', s.kabupaten || '', s.provinsi || '', s.kode_pos || '',
      s.asal_sekolah || '', s.npsn || '', s.alamat_sekolah || '', s.tahun_lulus || '', s.nisn || '',
      s.golongan_darah || '', s.no_hp || '', s.email || '', s.anak_ke || '', s.jumlah_saudara || '',
      s.hobi || '', s.cita_cita || '', s.jumlah_hafalan || '', s.sumber_informasi || '',
      s.ukuran_seragam_baju || '', s.ukuran_seragam_celana || '', s.ukuran_seragam_almamater || '',
      s.tipe_pendaftaran || 'BARU', s.status_pendaftaran || '', beasiswaInfo
    ]);
  }

  // ==========================================
  // SHEET 2: KESEHATAN & ASRAMA
  // ==========================================
  const sheetKesehatan = workbook.addWorksheet('Kesehatan & Asrama');
  styleHeader(sheetKesehatan, [
    'No', 'No Pendaftaran', 'Nama Santri', 'Tinggi Badan (cm)', 'Berat Badan (kg)',
    'Riwayat Penyakit', 'Penyakit Kronis', 'Alergi', 'Disabilitas', 'Hasil HBsAg', 
    'Tgl Tes HBsAg', 'Status Imunisasi', 'Pilihan Asrama', 'Bersedia Cabang', 
    'Pilihan Cabang', 'Preferensi Teman Sekamar'
  ]);

  no = 1;
  for (const s of santriList) {
    const ks = s.kesehatan;
    const as = s.asrama;
    const tglHbsag = ks?.hbsag_test_date ? new Date(ks.hbsag_test_date).toLocaleDateString('id-ID') : '';
    
    sheetKesehatan.addRow([
      no++, s.nomor_pendaftaran, s.nama_lengkap,
      ks?.tinggi_badan || '', ks?.berat_badan || '', ks?.riwayat_penyakit || '-',
      ks?.penyakit_kronis || '-', ks?.alergi || '-', ks?.disabilitas || '-',
      ks?.hbsag_result || '', tglHbsag, ks?.status_imunisasi || '',
      as?.pilihan_asrama === true ? 'Asrama' : 'Tidak Asrama',
      as?.bersedia_cabang ? 'Ya' : 'Tidak', as?.pilihan_cabang || '', as?.preferensi_teman_sekamar || ''
    ]);
  }

  // ==========================================
  // SHEET 3: ORANG TUA
  // ==========================================
  const sheetOrangTua = workbook.addWorksheet('Data Orang Tua');
  styleHeader(sheetOrangTua, [
    'No', 'No Pendaftaran', 'Nama Santri', 'Nama Ayah', 'NIK Ayah', 'TTL Ayah', 
    'Pekerjaan Ayah', 'No HP Ayah', 'Nama Ibu', 'NIK Ibu', 'TTL Ibu', 
    'Pekerjaan Ibu', 'No HP Ibu', 'Nama Wali', 'Hubungan Wali', 'No HP Wali'
  ]);

  no = 1;
  for (const s of santriList) {
    const ot = s.orang_tua;
    const ttlAyah = (ot?.tempat_lahir_ayah || '') + (ot?.tanggal_lahir_ayah ? ', ' + new Date(ot.tanggal_lahir_ayah).toLocaleDateString('id-ID') : '');
    const ttlIbu = (ot?.tempat_lahir_ibu || '') + (ot?.tanggal_lahir_ibu ? ', ' + new Date(ot.tanggal_lahir_ibu).toLocaleDateString('id-ID') : '');
    
    sheetOrangTua.addRow([
      no++, s.nomor_pendaftaran, s.nama_lengkap,
      ot?.nama_ayah || '', ot?.nik_ayah || '', ttlAyah, ot?.pekerjaan_ayah || '', ot?.no_hp_ayah || '',
      ot?.nama_ibu || '', ot?.nik_ibu || '', ttlIbu, ot?.pekerjaan_ibu || '', ot?.no_hp_ibu || '',
      ot?.nama_wali || '', ot?.hubungan_wali || '', ot?.no_hp_wali || ''
    ]);
  }
  
  // ==========================================
  // SHEET 4: KONTAK DARURAT
  // ==========================================
  const sheetKontak = workbook.addWorksheet('Kontak Darurat');
  styleHeader(sheetKontak, [
    'No', 'Nama Santri', 'No HP Santri', 'Nama Ayah', 'No HP Ayah', 
    'Nama Ibu', 'No HP Ibu', 'Nama Wali', 'No HP Wali'
  ]);

  no = 1;
  for (const s of santriList) {
    const ot = s.orang_tua;
    sheetKontak.addRow([
      no++, s.nama_lengkap, s.no_hp || '',
      ot?.nama_ayah || '', ot?.no_hp_ayah || '',
      ot?.nama_ibu || '', ot?.no_hp_ibu || '',
      ot?.nama_wali || '', ot?.no_hp_wali || ''
    ]);
  }

  // ==========================================
  // FORMATTING (Auto-fit row heights and basic borders)
  // ==========================================
  workbook.eachSheet((worksheet) => {
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        };
      });
    });
  });

  // Generate File
  const filePath = path.join('/tmp', 'Data_Santri_Kepengasuhan_2026-2027.xlsx');
  await workbook.xlsx.writeFile(filePath);
  console.log(`✅ File Excel berhasil dibuat: ${filePath}`);
}

main()
  .catch(err => { console.error('ERROR:', err); process.exit(1); })
  .finally(() => prisma.$disconnect());
