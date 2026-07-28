const fs = require('fs');
const path = require('path');

async function check() {
  const pdfjsLib = await import('./node_modules/pdfjs-dist/legacy/build/pdf.mjs');
  const workerPath = path.resolve(__dirname, 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'file:///' + workerPath.replace(/\\/g, '/');
  
  const files = [
    'Contoh_SuratKesehatan.pdf',
    'Contoh_SuratPernyataan.pdf',
    'Contoh_PaktaIntegritas.pdf',
    'Surat Pemberitahuan Kedatangan Santri Baru 2026-2027.pdf'
  ];
  
  for (const file of files) {
    console.log(`\n=================== FILE: ${file} ===================`);
    const pdfPath = path.resolve(__dirname, 'public/documents/', file);
    if (!fs.existsSync(pdfPath)) {
      console.log("File not found!");
      continue;
    }
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    console.log(`Pages: ${pdf.numPages}`);
    for (let p = 1; p <= pdf.numPages; p++) {
      console.log(`--- Page ${p} ---`);
      const page = await pdf.getPage(p);
      const textContent = await page.getTextContent();
      textContent.items.forEach(item => {
        if (item.str.trim()) console.log(item.str);
      });
    }
  }
}

check().catch(console.error);
