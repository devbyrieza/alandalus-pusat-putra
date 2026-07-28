const fs = require('fs');
const path = require('path');

const pdfPath = path.join(__dirname, 'public', 'documents', 'CETAK KOP SURAT VERSI 1 DAN 2.pdf');
const outDir = path.join(__dirname, 'public', 'documents');

function extractImages() {
  console.log('Reading PDF file...');
  const data = fs.readFileSync(pdfPath);
  let index = 0;
  let imgCount = 0;

  // Search for stream objects
  while (true) {
    // Find stream start
    const streamStart = data.indexOf('stream', index);
    if (streamStart === -1) break;

    // Find stream end
    const streamEnd = data.indexOf('endstream', streamStart);
    if (streamEnd === -1) break;

    // Extract search window before stream to check metadata
    const searchWindow = data.slice(Math.max(0, streamStart - 300), streamStart).toString('ascii');
    
    // Check if this stream is an image
    if (searchWindow.includes('/Subtype/Image') || searchWindow.includes('/Subtype /Image')) {
      imgCount++;
      console.log(`Found image #${imgCount} at stream offset ${streamStart}`);
      
      // The stream data starts after 'stream\r\n' or 'stream\n'
      let dataStart = streamStart + 6;
      if (data[dataStart] === 13 && data[dataStart + 1] === 10) { // \r\n
        dataStart += 2;
      } else if (data[dataStart] === 10) { // \n
        dataStart += 1;
      }
      
      const streamData = data.slice(dataStart, streamEnd);
      
      // Determine file extension
      let ext = 'bin';
      if (searchWindow.includes('/DCTDecode')) {
        ext = 'jpg';
      } else if (searchWindow.includes('/FlateDecode')) {
        ext = 'png';
      }
      
      const outPath = path.join(outDir, `extracted_img_${imgCount}.${ext}`);
      fs.writeFileSync(outPath, streamData);
      console.log(`Saved: ${outPath} (${streamData.length} bytes)`);
    }

    index = streamEnd + 9;
  }
  console.log(`Done! Extracted ${imgCount} images.`);
}

extractImages();
