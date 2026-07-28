import { generateSuratPernyataan } from './src/lib/utils/pdf-generator';

const data = {
  nomor_pendaftaran: 'TEST001',
  nama_lengkap: 'Ahmad bin Fulan'
};

async function test() {
  await generateSuratPernyataan(data as any);
}
test();
