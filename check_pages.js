const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function checkPages() {
  const fileBytes = fs.readFileSync('public/documents/Surat Pemberitahuan Kedatangan Santri Baru 2026/2027.pdf');
  const pdfDoc = await PDFDocument.load(fileBytes);
  console.log('Page count:', pdfDoc.getPageCount());
}
checkPages().catch(console.error);
