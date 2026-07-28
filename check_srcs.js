const fs = require('fs');
const content = fs.readFileSync('id-card-panitia.html', 'utf8');
const srcs = content.match(/src=["']([^"']+)["']/g) || [];
const nonBase64 = srcs.filter(s => !s.includes('data:'));
console.log('Non-base64 images found:', nonBase64);
