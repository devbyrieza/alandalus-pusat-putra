const { PrismaClient } = require('@prisma/client');

async function testRemote(ip, port, user, pass, db) {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `postgresql://${user}:${pass}@${ip}:${port}/${db}`
      },
    },
  });
  
  try {
    const count = await prisma.pendaftar.count();
    console.log(`Connection successful on ${ip}:${port}. Total pendaftar:`, count);
    return true;
  } catch (error) {
    console.error(`Connection failed on ${ip}:${port}:`, error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

async function run() {
  // Test port 5432 with coolify user
  await testRemote('72.61.141.50', 5432, 'coolify', 'FfJ8to6XLZ1LooULnKW7ULXDbIfQn3KxMUPAUXz15Q0=', 'ppdb_alimam');
  // Test port 5433 with postgres user
  await testRemote('72.61.141.50', 5433, 'postgres', 'nhzYTBmfqk8RUhOoYHmvkbzoN2OhN', 'ppdb_alimam');
}

run();
