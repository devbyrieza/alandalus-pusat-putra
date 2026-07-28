const fs = require('fs');
const files = [
  'C:/Users/itpua/Dev/Work/al-andalus/andalus-pusat-putra/src/app/berita/page.tsx',
  'C:/Users/itpua/Dev/Work/al-andalus/andalus-pusat-putra/src/app/fasilitas/page.tsx',
  'C:/Users/itpua/Dev/Work/al-andalus/andalus-pusat-putra/src/app/program/page.tsx',
  'C:/Users/itpua/Dev/Work/al-andalus/andalus-pusat-putra/src/app/tentang/page.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\s*<Navbar \/>/g, '');
    content = content.replace(/import Navbar from ["']@\/components\/layout\/Navbar["'];\n?/g, '');
    fs.writeFileSync(file, content);
    console.log('Fixed:', file);
  }
});
