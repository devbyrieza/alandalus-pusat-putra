const fs = require('fs');
const { PDFDocument, PDFRawStream, PDFName } = require('pdf-lib');
const zlib = require('zlib');

async function main() {
    const fileBytes = fs.readFileSync('clean_fixed.pdf');
    const pdfDoc = await PDFDocument.load(fileBytes);
    const pages = pdfDoc.getPages();
    const page = pages[0];
    
    const contentsRef = page.node.get(PDFName.of('Contents'));
    const contentsArray = (contentsRef.asArray ? contentsRef.asArray() : [contentsRef]);
    
    let fullStream = '';
    for (const ref of contentsArray) {
        const obj = pdfDoc.context.lookup(ref);
        if (obj instanceof PDFRawStream) {
            let data = obj.contents;
            if (obj.dict.get(PDFName.of('Filter')) === PDFName.of('FlateDecode')) {
                try { data = zlib.inflateSync(data); } catch(e){}
            }
            fullStream += data.toString('utf8') + '\n';
        }
    }
    fs.writeFileSync('page_stream_dump.txt', fullStream);
    console.log("Stream dumped to page_stream_dump.txt");
}
main();
