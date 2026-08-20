const fs = require('fs');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const zlib = require('zlib');
const path = require('path');

async function checkFinal() {
  const fileBytes = fs.readFileSync('public/documents/Surat Pemberitahuan Kedatangan Santri Baru 2026/2027.pdf');
  const pdfDoc = await PDFDocument.load(fileBytes);
  const page = pdfDoc.getPage(0); // Page 1
  
  const contents = page.node.get(PDFName.of('Contents'));
  let text = '';
  
  const contentsArray = contents.asArray ? contents.asArray() : [contents];
  for (const ref of contentsArray) {
      const obj = pdfDoc.context.lookup(ref);
      if (obj instanceof PDFRawStream) {
         let data = obj.contents;
         if (obj.dict.get(PDFName.of('Filter')) === PDFName.of('FlateDecode')) {
            try { data = zlib.inflateSync(data); } catch(e){}
         }
         text += data.toString('utf8');
      }
  }
  
  if (text.includes('/NewStampImg')) {
      console.log("NewStampImg IS in the stream!");
      const idx = text.indexOf('/NewStampImg');
      console.log(text.substring(Math.max(0, idx - 100), idx + 100));
  } else {
      console.log("NewStampImg IS MISSING from the stream!");
  }
  
  if (text.includes('/Image22')) {
      console.log("Image22 IS in the stream!");
  }
}

checkFinal().catch(console.error);
