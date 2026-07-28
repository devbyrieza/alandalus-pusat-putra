const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const pdfPath = path.join(__dirname, 'Surat_Pengantar_BSI_Stempel.pdf');
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found at ${pdfPath}`);
    }

    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const { width, height } = firstPage.getSize();
    console.log(`PDF Page Size: ${width}x${height}`);

    const sigMuhlisPath = path.join(__dirname, 'public/images/ttd-muhlis.png');

    if (!fs.existsSync(sigMuhlisPath)) {
      throw new Error(`Muhlis Signature not found at ${sigMuhlisPath}`);
    }

    const sigMuhlisBytes = fs.readFileSync(sigMuhlisPath);
    const sigMuhlisImage = await pdfDoc.embedPng(sigMuhlisBytes);

    // Muhlis Signature (Right Column): center around x = 410
    const sigMuhlisWidth = 100;
    const sigMuhlisHeight = 71;
    const sigMuhlisX = 360;
    const sigMuhlisY = 215;

    // Draw Muhlis signature
    firstPage.drawImage(sigMuhlisImage, {
      x: sigMuhlisX,
      y: sigMuhlisY,
      width: sigMuhlisWidth,
      height: sigMuhlisHeight,
    });

    const modifiedPdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, modifiedPdfBytes);
    console.log('Successfully added Pak Muhlis signature to Surat_Pengantar_BSI_Stempel.pdf!');
  } catch (error) {
    console.error('Error applying signature:', error);
  }
}

main();
