const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const p = await prisma.pendaftar.findMany({
    where: { nama_lengkap: { contains: 'Ahmad Sobari' } }
  });
  console.log(JSON.stringify(p, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
