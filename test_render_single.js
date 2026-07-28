const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 9999;
const pdfPath = 'C:\\Users\\itpua\\Dev\Work\\al-andalus\\alandalus-alimam\\public\\documents\\roundown.pdf';
const outPath = path.join(__dirname, 'test_rundown.png');
const logPath = path.join(__dirname, 'chrome_log.txt');

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
  <script type="module">
    import * as pdfjsLib from './pdf.mjs';
    pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';
    
    console.log("PDFJS: Loading document...");
    pdfjsLib.getDocument('./doc.pdf').promise.then(pdf => {
      console.log("PDFJS: Document loaded, pages:", pdf.PageCount);
      return pdf.getPage(1);
    }).then(page => {
      console.log("PDFJS: Page 1 loaded");
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');

      const viewport = page.getViewport({ scale: 1 });
      console.log("PDFJS: Viewport dimensions:", viewport.width, "x", viewport.height);
      
      canvas.width = 1920;
      canvas.height = 1080;

      const renderContext = {
        canvasContext: ctx,
        viewport: page.getViewport({ scale: Math.min(1920 / viewport.width, 1080 / viewport.height) })
      };

      return page.render(renderContext).promise;
    }).then(() => {
      console.log("PDFJS: Render finished");
      const script = document.createElement('script');
      script.src = './sleep.js';
      document.body.appendChild(script);
    }).catch(err => {
      console.error("PDFJS ERROR:", err);
      const script = document.createElement('script');
      script.src = './sleep.js';
      document.body.appendChild(script);
    });
  </script>
</body>
</html>
`;

if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
if (fs.existsSync(logPath)) fs.unlinkSync(logPath);

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
    res.writeHead(200, { 'Content-Type': 'application/pdf' });
    res.end(fs.readFileSync(pdfPath));
  } else if (pathname === '/sleep.js') {
    setTimeout(() => {
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end('// done');
    }, 4000);
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Local server listening on port ${PORT}`);
  
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const targetUrl = `http://localhost:${PORT}/render.html`;
  
  // Launch Edge with logging enabled
  const cmd = `"${edgePath}" --headless --disable-gpu --hide-scrollbars --enable-logging --log-file="${logPath}" --screenshot="${outPath}" --window-size=1920,1080 "${targetUrl}"`;
  
  console.log('Running Edge...');
  exec(cmd, (err, stdout, stderr) => {
    if (err) console.error('Edge execution error:', err);
    
    // Check if screenshot was created
    setTimeout(() => {
      if (fs.existsSync(outPath)) {
        console.log(`Success! Created screenshot: ${fs.statSync(outPath).size} bytes`);
      } else {
        console.log('Screenshot was not created.');
      }
      server.close();
    }, 1000);
  });
});
