const sharp = require('sharp');
const fs = require('fs');

async function editStamp() {
  const imgPath = 'c:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/public/images/stempel-pesantren.png';
  const img = sharp(imgPath);
  const metadata = await img.metadata();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  
  const width = info.width;
  const height = info.height;
  
  // Edit baris demi baris di dalam area rounded box (y=15 s.d y=93)
  for (let y = 15; y < 94; y++) {
    // Salin piksel segmen konten di dalam box [108, 278] ke array sementara
    const segment = [];
    for (let x = 108; x <= 278; x++) {
      const idx = (y * width + x) * 4;
      segment.push({
        r: data[idx],
        g: data[idx+1],
        b: data[idx+2],
        a: data[idx+3]
      });
    }
    
    // Hapus teks 'PF' (x=108 s.d x=155, yaitu indeks 0 s.d 47 di array segmen)
    for (let i = 0; i <= 47; i++) {
      segment[i] = { r: 0, g: 0, b: 0, a: 0 };
    }
    
    // Geser teks 'PPDB' (asal x=180 s.d x=278, indeks 72 s.d 170) ke kiri sebanyak 26 piksel
    const shift = 26;
    for (let i = 48; i <= 170; i++) {
      const targetIdx = i - shift;
      if (targetIdx >= 0) {
        segment[targetIdx] = { ...segment[i] };
      }
    }
    
    // Bersihkan sisa geseran di sebelah kanan (indeks 170-shift+1 s.d 170)
    for (let i = 170 - shift + 1; i <= 170; i++) {
      segment[i] = { r: 0, g: 0, b: 0, a: 0 };
    }
    
    // Tulis kembali segmen ke buffer data asli
    for (let x = 108; x <= 278; x++) {
      const idx = (y * width + x) * 4;
      const pixel = segment[x - 108];
      data[idx] = pixel.r;
      data[idx+1] = pixel.g;
      data[idx+2] = pixel.b;
      data[idx+3] = pixel.a;
    }
  }
  
  // Tulis kembali ke file stempel-pesantren.png
  await sharp(data, {
    raw: {
      width: width,
      height: height,
      channels: 4
    }
  }).png().toFile(imgPath);
  console.log('Stempel berhasil diedit: PF dihapus dan PPDB digeser ke tengah!');
}

editStamp().catch(console.error);
