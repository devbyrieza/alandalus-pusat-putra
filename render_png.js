const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 9991;
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const server = http.createServer((req, res) => {
  let pathname = req.url;
  const filePath = path.join(__dirname, pathname.substring(1));
  if (fs.existsSync(filePath)) {
    let ext = path.extname(filePath);
    let contentType = ext === '.html' ? 'text/html' : (ext === '.png' ? 'image/png' : 'text/plain');
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(filePath));
  } else {
    res.writeHead(404); res.end();
  }
});

server.listen(PORT, () => {
  const tasks = [
    { in: 'public/poster-mosa-cup/poster_wali_santri.html', out: 'public/poster-mosa-cup/01_poster_WALI_SANTRI.jpg' },
    { in: 'public/poster-mosa-cup/poster_asatidzah.html', out: 'public/poster-mosa-cup/02_poster_ASATIDZAH.jpg' },
    { in: 'public/poster-mosa-cup/poster_status_wa.html', out: 'public/poster-mosa-cup/03_poster_STATUS_WA.jpg' }
  ];

  let current = 0;
  
  function runNext() {
    if (current >= tasks.length) {
      server.close();
      return;
    }
    const t = tasks[current++];
    const targetUrl = `http://localhost:${PORT}/${t.in}`;
    const outPath = path.join(__dirname, t.out);
    const cmd = `"${edgePath}" --headless=new --disable-gpu --no-sandbox --disable-dev-shm-usage --window-size=1000,2800 --screenshot="${outPath}" "${targetUrl}"`;
    
    exec(cmd, (err) => {
      console.log('Rendered ' + t.out);
      runNext();
    });
  }
  
  runNext();
});
