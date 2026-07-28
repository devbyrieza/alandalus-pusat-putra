const fs = require('fs');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const zlib = require('zlib');

async function extractPage2() {
  const fileBytes = fs.readFileSync('clean_fixed.pdf');
  const pdfDoc = await PDFDocument.load(fileBytes);
  const page = pdfDoc.getPage(1);
  
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
  
  fs.writeFileSync('page2_stream.txt', text);
  console.log("Extracted page2_stream.txt");
}

extractPage2().catch(console.error);
