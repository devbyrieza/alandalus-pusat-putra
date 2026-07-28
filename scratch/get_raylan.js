process.env.DATABASE_URL="postgresql://postgres:nhzYTBmfqk8RUhOoYHmvkbzoN2OhN@127.0.0.1:5433/ppdb_alimam";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pendaftar = await prisma.pendaftar.findFirst({
    where: { nama_lengkap: { contains: 'Raylan Akbar', mode: 'insensitive' } },
    include: { orang_tua: true }
  });
  console.log(JSON.stringify(pendaftar, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
