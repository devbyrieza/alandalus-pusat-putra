const { PrismaClient } = require('@prisma/client');

async function testPort(port) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `postgresql://postgres:nhzYTBmfqk8RUhOoYHmvkbzoN2OhN@127.0.0.1:${port}/ppdb_alimam`
      },
    },
  });
  
  try {
    const count = await prisma.pendaftar.count();
    console.log(`Connection successful on port ${port}. Total pendaftar:`, count);
    return true;
  } catch (error) {
    console.error(`Connection failed on port ${port}:`, error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function run() {
  await testPort(5432);
}

run();
