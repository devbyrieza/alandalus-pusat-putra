const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const prisma = new PrismaClient();

function generatePrefix(jenjang, jenis_kelamin) {
  let prefix = "";
  if (jenjang === "MTs" || jenjang === "SMP") {
    prefix = "MT";
  } else if (jenjang === "IL") {
    prefix = "IL";
  } else if (jenjang === "MA") {
    prefix = "MA";
  }
  
  if (jenis_kelamin === "LAKI-LAKI" || jenis_kelamin === "L") {
    prefix += "A";
  } else {
    prefix += "I";
  }
  return prefix;
}

async function runImport() {
  const filePath = path.join(__dirname, '..', 'public', 'documents', 'Data_Pendaftar_dari_web.csv');
  
  if (!fs.existsSync(filePath)) {
    console.error('File CSV tidak ditemukan di path:', filePath);
    process.exit(1);
  }

  const tahunAjaran = await prisma.tahunAjaran.findFirst({ where: { is_active: true } });
  if (!tahunAjaran) {
    console.error('Tidak ada Tahun Ajaran yang aktif.');
    process.exit(1);
  }
  const tahun = String(tahunAjaran.tahun_mulai).slice(-2);

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  console.log('Mulai mengimport data santri Mimbar dari CSV...');
  let importedCount = 0;
  let isHeader = true;

  // Hash bcrypt hardcoded untuk password '123456'
  const hardcodedPasswordHash = '$2b$10$u0OLXg0kTyVl3fj0YDRGcuTFRD0xYgOcvrycvkBGri4wGc9FsWOM6';

  for await (const line of rl) {
    if (!line.trim()) continue;
    
    // Parse line CSV yang dibungkus quotes ("cell1","cell2")
    const cols = line.startsWith('"') && line.endsWith('"') 
      ? line.slice(1, -1).split('","')
      : line.split(',');

    if (isHeader) {
      isHeader = false;
      continue;
    }

    const namaLengkap = cols[1]?.trim();
    const nik = cols[3]?.trim();
    
    if (!nik || !namaLengkap) continue;
    const nikStr = nik.toString();
    
    const existingPendaftar = await prisma.pendaftar.findFirst({
      where: { nik: nikStr, tahun_ajaran_id: tahunAjaran.id }
    });
    
    if (existingPendaftar) {
      console.log(`[SKIP] NIK ${nikStr} - ${namaLengkap} sudah terdaftar.`);
      continue;
    }

    try {
      const rawJenjang = cols[4]?.trim() || 'SMP';
      const jenjang = rawJenjang.toLowerCase().includes('idad') ? 'IL' : 'SMP';
      const jkRaw = cols[5]?.trim().toLowerCase() || 'laki-laki';
      const jenisKelamin = jkRaw.includes('perempuan') ? 'PEREMPUAN' : 'LAKI-LAKI';
      
      let rawHp = cols[6]?.trim() || '-';
      if (rawHp.startsWith('62')) {
        rawHp = '0' + rawHp.substring(2);
      }
      
      const prefix = generatePrefix(jenjang, jenisKelamin);
      const lastPendaftar = await prisma.pendaftar.findFirst({
        where: {
          tahun_ajaran_id: tahunAjaran.id,
          nomor_pendaftaran: { startsWith: `${prefix}${tahun}` }
        },
        orderBy: { nomor_pendaftaran: "desc" },
      });

      let nextNumber = 1;
      if (lastPendaftar?.nomor_pendaftaran) {
        const match = lastPendaftar.nomor_pendaftaran.match(/\d{5}$/);
        if (match) nextNumber = parseInt(match[0], 10) + 1;
      }
      const nomorPendaftaran = `${prefix}${tahun}${String(nextNumber).padStart(5, "0")}`;

      let user = await prisma.profile.findFirst({ where: { phone: rawHp } });
      if (!user) {
        user = await prisma.profile.create({
          data: { full_name: 'Bapak dari ' + namaLengkap, phone: rawHp, password_hash: hardcodedPasswordHash, role: 'pendaftar' }
        });
      }

      await prisma.$transaction(async (tx) => {
        const pendaftar = await tx.pendaftar.create({
          data: {
            user_id: user.id,
            tahun_ajaran_id: tahunAjaran.id,
            nomor_pendaftaran: nomorPendaftaran,
            nik: nikStr,
            nama_lengkap: namaLengkap,
            jenis_kelamin: jenisKelamin,
            jenjang: jenjang,
            tempat_lahir: '-',
            tanggal_lahir: new Date(),
            no_hp: rawHp,
            asal_sekolah: 'Pesantren Mimbar Nagrak',
            alamat: '-',
            tipe_pendaftaran: 'BARU',
            catatan_pindahan: 'Limpahan Mimbar dari file Bendahara',
            status_pendaftaran: 'submitted',
            verifikasi_status: 'verified'
          }
        });

        await tx.orangTua.create({
          data: {
            pendaftar_id: pendaftar.id,
            nama_ayah: 'Bapak dari ' + namaLengkap,
            nik_ayah: '-',
            no_hp_ayah: rawHp,
            nama_ibu: 'Ibu dari ' + namaLengkap,
            nik_ibu: '-',
            no_hp_ibu: rawHp,
            alamat_ayah: '-',
            alamat_ibu: '-'
          }
        });
        
        await tx.hasilSeleksi.create({
          data: {
            pendaftar_id: pendaftar.id,
            tahun_ajaran_id: tahunAjaran.id,
            status_seleksi: 'DITERIMA',
            catatan_admin: 'Santri Limpahan Mimbar Nagrak',
            ditentukan_pada: new Date()
          }
        });
      });

      console.log(`[SUCCESS] ${namaLengkap} diimport dengan nomor: ${nomorPendaftaran}`);
      importedCount++;
    } catch (err) {
      console.error(`[ERROR] Gagal import ${namaLengkap}:`, err.message);
    }
  }

  console.log(`Selesai! ${importedCount} santri berhasil diimport.`);
}

runImport().catch(console.error).finally(() => prisma.$disconnect());
