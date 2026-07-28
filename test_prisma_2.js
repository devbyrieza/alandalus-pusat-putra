const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const statuses = await prisma.pendaftar.findMany({
    select: { status_pendaftaran: true },
    distinct: ['status_pendaftaran']
  });
  console.log(statuses);
}
main().catch(console.error).finally(() => prisma.$disconnect());
