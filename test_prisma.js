const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.pendaftar.findFirst({
    where: { nama_lengkap: { contains: 'Haidar' } },
    include: {
      nilai_ujian: true,
      hasil_seleksi: true,
      pengumuman: true
    }
  });
  console.log(JSON.stringify(user, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
