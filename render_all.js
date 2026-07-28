const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const sharp = require('sharp');

const PORT = 9999;
let currentPdfPath = '';

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background-color: white; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <img id="sleeper" style="display:none">
  
  <script type="module">
    import * as pdfjsLib from './pdf.mjs';
    pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';
    
    const urlParams = new URLSearchParams(window.location.search);
    const pageNum = parseInt(urlParams.get('page')) || 1;
    const width = parseInt(urlParams.get('width')) || 1200;
    const height = parseInt(urlParams.get('height')) || 1700;

    const pdfUrl = './doc.pdf?cb=' + Date.now();

    console.log("PDFJS: Loading document url: " + pdfUrl);
    pdfjsLib.getDocument({ url: pdfUrl }).promise.then(pdf => {
      console.log("PDFJS: Document loaded, pages: " + pdf.numPages);
      
      // Extract text of page 1
      pdf.getPage(1).then(page => {
        page.getTextContent().then(textContent => {
          console.log("=== RUNDOWN EXTRACTED TEXT START ===");
          textContent.items.forEach(item => {
            if (item.str.trim()) {
              console.log("TXT: " + item.str);
            }
          });
          console.log("=== RUNDOWN EXTRACTED TEXT END ===");
        });
      });
      
      return pdf.getPage(pageNum);
    }).then(page => {
      console.log("PDFJS: Page loaded: " + pageNum);
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      const viewport = page.getViewport({ scale: 1 });
      console.log("PDFJS: Viewport size: " + viewport.width + "x" + viewport.height);
      
      const scaleX = width / viewport.width;
      const scaleY = height / viewport.height;
      
      canvas.width = width;
      canvas.height = height;

      const renderContext = {
        canvasContext: ctx,
        viewport: page.getViewport({ scale: Math.min(scaleX, scaleY) })
      };

      console.log("PDFJS: Starting page render...");
      return page.render(renderContext).promise;
    }).then(() => {
      console.log("PDFJS: Rendering complete!");
    }).catch(err => {
      console.error("PDFJS ERROR: " + err.message + "\\n" + err.stack);
    });

    // Load the slow image to delay the window load event and wait for rendering to finish
    document.getElementById('sleeper').src = './sleep.png?cb=' + Date.now();
  </script>
</body>
</html>
`;

// Create HTTP server
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  
  if (pathname === '/render.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
  } else if (pathname === '/pdf.mjs') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(fs.readFileSync(path.join(__dirname, 'node_modules/pdfjs-dist/build/pdf.min.mjs')));
  } else if (pathname === '/pdf.worker.mjs') {
    res.writeHead(200, { 'Content-Type': 'application/javascript' });
    res.end(fs.readFileSync(path.join(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs')));
  } else if (pathname === '/doc.pdf') {
    res.writeHead(200, { 
      'Content-Type': 'application/pdf',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
    });
    res.end(fs.readFileSync(currentPdfPath));
  } else if (pathname === '/sleep.png') {
    // Delay response by 4 seconds to block window.onload event
    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': 'image/png' });
      const buf = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
      res.end(buf);
    }, 4000);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Local server listening on port ${PORT}`);
  run();
});

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function renderPage(pdfPath, page, width, height, outPath, logFileName) {
  return new Promise((resolve, reject) => {
    currentPdfPath = pdfPath;
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    
    const logPath = path.join(__dirname, logFileName);
    if (fs.existsSync(logPath)) fs.unlinkSync(logPath);
    
    const targetUrl = `http://localhost:${PORT}/render.html?page=${page}&width=${width}&height=${height}&cb=${Date.now()}`;
    const cmd = `"${edgePath}" --headless --disable-gpu --disable-software-rasterizer --disable-dev-shm-usage --no-sandbox --hide-scrollbars --enable-logging --log-file="${logPath}" --screenshot="${outPath}" --window-size=${width},${height} "${targetUrl}"`;
    
    console.log(`Rendering ${pdfPath} to ${outPath}...`);
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error('Edge error:', err);
        return reject(err);
      }
      
      // Wait for file to exist and be fully written
      let attempts = 0;
      const interval = setInterval(() => {
        if (fs.existsSync(outPath)) {
          const size = fs.statSync(outPath).size;
          console.log(`Checking ${outPath} size: ${size} bytes`);
          clearInterval(interval);
          console.log(`Rendered successfully to ${outPath} (${size} bytes)`);
          resolve();
          return;
        }
        attempts++;
        if (attempts > 20) { // Wait up to 10 seconds
          clearInterval(interval);
          reject(new Error(`Timeout waiting for screenshot file: ${outPath}`));
        }
      }, 500);
    });
  });
}

async function run() {
  try {
    // 1. Render Kop Surat
    const tempKopPng = path.join(__dirname, 'temp_kop.png');
    await renderPage(
      path.join(__dirname, 'public/documents/CETAK KOP SURAT VERSI 1 DAN 2.pdf'),
      1,
      2261,
      3200,
      tempKopPng,
      'chrome_log_kop.txt'
    );
    
    // Convert to JPG
    await sharp(tempKopPng)
      .jpeg({ quality: 95 })
      .toFile(path.join(__dirname, 'public/images/kop-surat-full.jpg'));
    console.log('Saved kop-surat-full.jpg');
    fs.unlinkSync(tempKopPng);
    
    // 2. Render Rundown
    await renderPage(
      path.join(__dirname, 'public/documents/roundown.pdf'),
      1,
      1920,
      1080,
      path.join(__dirname, 'public/images/welcome-day/rundown.png'),
      'chrome_log_rundown.txt'
    );
    
    console.log('All renderings complete!');
  } catch (error) {
    console.error('Run error:', error);
  } finally {
    server.close();
  }
}
