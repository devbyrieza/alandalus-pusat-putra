const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function findText() {
  const data = new Uint8Array(fs.readFileSync('public/documents/Surat Pemberitahuan Kedatangan Santri Baru 2026-2027.pdf'));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  const page = await doc.getPage(1);
  const textContent = await page.getTextContent();
  
  for (const item of textContent.items) {
    if (item.str.includes('Wahab') || item.str.includes('Ust') || item.str.includes('M.Pd')) {
      console.log(`Found "${item.str}" at x: ${item.transform[4]}, y: ${item.transform[5]}`);
    }
  }
}
findText().catch(console.error);
