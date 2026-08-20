const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFArray } = require('pdf-lib');
const zlib = require('zlib');

async function inspectAlignment() {
  const filePath = path.resolve(__dirname, 'public/documents/Surat Pemberitahuan Kedatangan Santri Baru 2026/2027.pdf');
  const fileBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(fileBytes);
  
  const page = pdfDoc.getPage(1);
  let contents = page.node.Contents();
  let contentsArray = [];
  if (contents instanceof PDFArray) {
    contentsArray = contents.asArray();
  } else {
    contentsArray = [contents];
  }
  
  for (let i = 0; i < contentsArray.length; i++) {
    let stream = pdfDoc.context.lookup(contentsArray[i]);
    let inflated;
    try {
      inflated = zlib.inflateSync(stream.contents);
    } catch(e) {
      inflated = stream.contents;
    }
    const rawStr = Buffer.from(inflated).toString('utf8');
    
    const lines = rawStr.split('\n');
    let lastTm = '';
    
    for (let j = 0; j < lines.length; j++) {
      if (lines[j].endsWith('Tm')) {
        lastTm = lines[j];
      }
      if (lines[j].includes('TJ') || lines[j].includes('Tj')) {
        // Output coordinates for numbers 3, 4, 5
        if (lines[j].includes('4.') || lines[j].includes('5.') || lines[j].includes('3.') || lines[j].includes('Begitu') || lines[j].includes('Konfirmasi')) {
           console.log(`[${lastTm}] -> ${lines[j]}`);
        }
      }
    }
  }
}

inspectAlignment().catch(console.error);
