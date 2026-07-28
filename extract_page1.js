const fs = require('fs');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const zlib = require('zlib');

async function extractPage1() {
  const fileBytes = fs.readFileSync('clean_fixed.pdf');
  const pdfDoc = await PDFDocument.load(fileBytes);
  const page = pdfDoc.getPage(0);
  
  const contents = page.node.Contents();
  let text = '';
  
  if (contents && contents.asArray) {
      for (const ref of contents.asArray()) {
          const obj = pdfDoc.context.lookup(ref);
          if (obj instanceof PDFRawStream) {
             let data = obj.contents;
             if (obj.dict.get(PDFName.of('Filter')) === PDFName.of('FlateDecode')) {
                data = zlib.inflateSync(data);
             }
             text += data.toString('utf8');
          }
      }
  } else if (contents) {
      const obj = pdfDoc.context.lookup(contents);
      if (obj instanceof PDFRawStream) {
          let data = obj.contents;
          if (obj.dict.get(PDFName.of('Filter')) === PDFName.of('FlateDecode')) {
             data = zlib.inflateSync(data);
          }
          text += data.toString('utf8');
      }
  }
  
  fs.writeFileSync('page1_stream.txt', text);
  console.log("Extracted page1_stream.txt");
}

extractPage1().catch(console.error);
