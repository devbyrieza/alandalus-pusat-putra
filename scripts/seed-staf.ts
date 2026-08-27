import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Format password default: Andalus[TanggalLahirDDMMYYYY]
// Karena tanggal lahir tidak tersedia, password default sementara: Andalus2026
// Admin Super masing-masing dapat langsung ganti password setelah login pertama

const stafList = [
  // === ADMIN SUPER (sudah ada Wahab Rajasam tersembunyi) ===
  {
    username: 'fatikjundullah',
    email: 'fatikjundullah@gmail.com',
    full_name: 'Fatik Jundullah',
    role: 'admin_super',
    phone: '085883410653',
    plain_password: "Andalus2026!"
  },
  {
    username: 'lalutegar',
    email: 'sekreandalusputra@gmail.com',
    full_name: 'Lalu Tegar Dwiki Putra',
    role: 'admin_super',
    phone: '081296869854',
    plain_password: "Andalus2026!"
  },
  // === ADMIN KEUANGAN ===
  {
    username: 'keuanganpa',
    email: 'aiisbendaharabanin@gmail.com',
    full_name: 'Muhammad Hidayatullah',
    role: 'admin_keuangan',
    phone: '085894111050',
    plain_password: "Andalus2026!"
  },
  // === ADMIN BERKAS ===
  {
    username: 'berkaspa',
    email: 'alandalushumas@gamil.com',
    full_name: 'Aldiansyah',
    role: 'admin_berkas',
    phone: '08113920135',
    plain_password: "Andalus2026!"
  },
  // === PENGUJI QURAN ===
  {
    username: 'quranpa',
    email: 'harisel910@gmail.com',
    full_name: 'Abdul Haris',
    role: 'penguji',
    phone: '081934852737',
    plain_password: "Andalus2026!"
  },
  // === PEWAWANCARA CALON SANTRI ===
  {
    username: 'santriPA',
    email: 'khomunhaaldiansyah@gmail.com',
    full_name: 'Aldiansyah',
    role: 'pewawancara_calsan',
    phone: '08113920135',
    plain_password: "Andalus2026!"
  },
  // === PEWAWANCARA CALON WALI SANTRI ===
  {
    username: 'walisantriPA',
    email: 'lalutegardwikiputra@gmail.com',
    full_name: 'Lalu Tegar Dwiki Putra',
    role: 'pewawancara_cawalsan',
    phone: '081296869854',
    plain_password: "Andalus2026!"
  },
];

async function main() {
  console.log('Seeding staff accounts for PPDB Al-Andalus Pusat Putra...');
  
  for (const staf of stafList) {
    const existing = await prisma.profile.findFirst({
      where: {
        OR: [
          { email: staf.email },
          { username: staf.username.toLowerCase() },
        ]
      }
    });

    if (existing) {
      console.log(`  [SKIP] ${staf.full_name} (${staf.email}) - sudah ada`);
      continue;
    }

    const password_hash = await bcrypt.hash(staf.plain_password, 10);

    await prisma.profile.create({
      data: {
        username: staf.username.toLowerCase(),
        email: staf.email.toLowerCase(),
        full_name: staf.full_name,
        role: staf.role,
        phone: staf.phone,
        password_hash,
        must_change_password: true,
        plain_password: staf.plain_password,
      }
    });

    console.log(`  [OK] ${staf.full_name} - ${staf.role} - ${staf.email}`);
  }

  console.log('\nSeeding selesai!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
