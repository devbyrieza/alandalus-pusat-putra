const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 9999;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  
  const filePath = path.join(__dirname, pathname === '/' ? 'Surat_Pengantar_BSI.html' : pathname.substring(1));
  console.log(`Serving: ${filePath}`);
  
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath);
    let contentType = 'text/plain';
    if (ext === '.html') contentType = 'text/html';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.css') contentType = 'text/css';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  
  const targetUrl = `http://localhost:${PORT}/Surat_Pengantar_BSI.html`;
  const outPath = path.join(__dirname, 'Surat_Pengantar_BSI.pdf');
  
  const cmd = `"${edgePath}" --headless=new --disable-gpu --no-sandbox --disable-dev-shm-usage --print-to-pdf="${outPath}" "${targetUrl}"`;
  
  console.log(`Executing Edge print-to-pdf...`);
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error('Edge print error:', err);
    } else {
      console.log('Edge print complete!');
    }
    server.close(() => {
      console.log('Server closed');
    });
  });
});
