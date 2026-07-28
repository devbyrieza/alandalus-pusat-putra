const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function check() {
  try {
    const pdfPath = 'C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/public/documents/roundown.pdf';
    const bytes = fs.readFileSync(pdfPath);
    const doc = await PDFDocument.load(bytes);
    console.log(`roundown.pdf is VALID! Pages: ${doc.getPageCount()}`);
  } catch (err) {
    console.error('roundown.pdf is CORRUPTED:', err.message);
  }
}

check();
