const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function test() {
  const hs = await prisma.hasilSeleksi.findFirst();
  console.log(hs);
}
test().catch(console.error).finally(() => prisma.$disconnect());
