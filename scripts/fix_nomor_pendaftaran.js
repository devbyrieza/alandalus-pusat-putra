const { PrismaClient } = require('@prisma/client');
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

async function fixNomorPendaftaran() {
  const tahunAjaran = await prisma.tahunAjaran.findFirst({
    where: { is_active: true }
  });

  const students = await prisma.pendaftar.findMany({
    where: { 
      catatan_pindahan: 'Limpahan Mimbar dari file Bendahara',
      tahun_ajaran_id: tahunAjaran.id
    },
    orderBy: { created_at: 'asc' }
  });

  console.log(`Ditemukan ${students.length} santri yang perlu diperbaiki nomor pendaftarannya.`);

  for (const student of students) {
    const prefix = generatePrefix(student.jenjang, student.jenis_kelamin);
    const tahun = String(tahunAjaran.tahun_mulai).slice(-2);
    
    // Cari nomor terakhir untuk prefix ini
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
      if (match) {
        nextNumber = parseInt(match[0], 10) + 1;
      }
    }

    const nomorBaru = `${prefix}${tahun}${String(nextNumber).padStart(5, "0")}`;
    
    await prisma.pendaftar.update({
      where: { id: student.id },
      data: { nomor_pendaftaran: nomorBaru }
    });

    console.log(`[UPDATE] ${student.nama_lengkap}: ${student.nomor_pendaftaran} -> ${nomorBaru}`);
  }
  console.log('Selesai!');
}

fixNomorPendaftaran().catch(console.error).finally(() => prisma.$disconnect());
