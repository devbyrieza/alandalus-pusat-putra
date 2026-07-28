const fs = require('fs');
const files = [
    'public/poster-mosa-cup/poster_wali_santri.html',
    'public/poster-mosa-cup/poster_asatidzah.html',
    'public/poster-mosa-cup/poster_status_wa.html',
    'mosa_cup_poster.html'
];

files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf8');

    // Replace AL ANDALUS IBS
    content = content.replace(/AL ANDALUS IBS/g, 'Managed by Al Andalus IIBS');
    
    // Replace Putra/i
    content = content.replace(/Putra\/i/g, 'Putra');
    content = content.replace(/PUTRA\/I/g, 'PUTRA');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
});
