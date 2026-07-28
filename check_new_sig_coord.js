const fs = require('fs');
const { PDFDocument, PDFName, PDFRawStream } = require('pdf-lib');
const zlib = require('zlib');

async function checkFinal() {
  const fileBytes = fs.readFileSync('clean_fixed.pdf');
  const pdfDoc = await PDFDocument.load(fileBytes);
  const page = pdfDoc.getPage(0);
  
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
  fs.writeFileSync('new_sp_stream.txt', text);
  console.log("Dumped new_sp_stream.txt");
}

checkFinal().catch(console.error);
