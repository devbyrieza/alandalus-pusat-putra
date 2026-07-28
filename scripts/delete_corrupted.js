const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
  const pendaftar = await prisma.pendaftar.findFirst({
    where: { nomor_pendaftaran: 'MTA2600027' }
  });

  if (!pendaftar) {
    console.log('Tidak ada data corrupted MTA2600027.');
    return;
  }

  console.log('Menghapus data pendaftar corrupted:', pendaftar.nama_lengkap);

  await prisma.hasilSeleksi.deleteMany({ where: { pendaftar_id: pendaftar.id } });
  await prisma.orangTua.deleteMany({ where: { pendaftar_id: pendaftar.id } });
  await prisma.pendaftar.delete({ where: { id: pendaftar.id } });

  console.log('Corrupted data deleted successfully!');
}

clean().catch(console.error).finally(() => prisma.$disconnect());
