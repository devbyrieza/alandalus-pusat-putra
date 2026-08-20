const fs = require('fs');
const path = require('path');
const { PDFDocument, PDFArray } = require('pdf-lib');
const zlib = require('zlib');

async function search() {
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
    
    // Look for Begitu
    const index = rawStr.indexOf('Begitu');
    if (index !== -1) {
      console.log('Found Begitu at index', index);
      console.log('Context:');
      console.log(rawStr.substring(index - 200, index + 200));
    } else {
        // Maybe it's hex encoded like <426567697475> ?
        const hex = Buffer.from('Begitu').toString('hex').toUpperCase();
        const hexIndex = rawStr.indexOf(hex);
        if (hexIndex !== -1) {
            console.log('Found hex Begitu at index', hexIndex);
            console.log('Context:');
            console.log(rawStr.substring(hexIndex - 200, hexIndex + 200));
        }
    }
  }
}

search().catch(console.error);
