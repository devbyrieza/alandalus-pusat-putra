const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const fathi = await prisma.jadwalUjian.findMany({
        where: {
            pendaftar: {
                nama_lengkap: {
                    contains: "Fathi Muhammad"
                }
            }
        },
        include: {
            exam_session: true,
            pendaftar: true
        }
    });

    console.log("Fathi's Schedules:");
    fathi.forEach(f => {
        console.log(`- ID: ${f.id}`);
        console.log(`  Exam Session Start: ${f.exam_session?.start_time}`);
        console.log(`  Waktu Mulai: ${f.waktu_mulai_santri}`);
        console.log(`  Quran: ${f.penguji_quran_id}, Santri: ${f.penguji_santri_id}`);
    });
}
run();
