const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:nhzYTBmfqk8RUhOoYHmvkbzoN2OhN@127.0.0.1:5433/ppdb_alimam"
    },
  },
});

async function main() {
  try {
    const list = await prisma.nilaiUjian.findMany({
      take: 5,
      include: {
        pendaftar: true
      }
    });
    
    console.log("Sample NilaiUjian rows:");
    list.forEach(n => {
      console.log({
        nama: n.pendaftar.nama_lengkap,
        nomor: n.pendaftar.nomor_pendaftaran,
        akademik: n.score_akademik,
        kepribadian: n.score_kepribadian,
        kesiapan: n.score_kesiapan,
        quran: n.score_quran,
        wawancara_santri: n.nilai_wawancara_santri || n.score_wawancara,
        wawancara_ortu: n.nilai_wawancara_ortu,
        total_score: n.total_score,
        nilai_total: n.nilai_total
      });
    });
  } catch (error) {
    console.error("Failed to read database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
