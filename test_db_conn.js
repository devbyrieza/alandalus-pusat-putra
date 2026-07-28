const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://coolify:FfJ8to6XLZ1LooULnKW7ULXDbIfQn3KxMUPAUXz15Q0=@coolify-db:5432/ppdb_alimam"
    },
  },
});

async function main() {
  try {
    const count = await prisma.pendaftar.count();
    console.log("Connection successful. Total pendaftar:", count);
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
