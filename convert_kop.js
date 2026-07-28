const sharp = require('sharp');
sharp('C:/Users/itpua/AppData/Local/Temp/temp_kop.png')
  .jpeg({ quality: 95 })
  .toFile('C:/Users/itpua/Dev/Work/al-andalus/alandalus-alimam/public/images/kop-surat-full.jpg')
  .then(() => console.log('Successfully saved kop-surat-full.jpg'))
  .catch(err => console.error(err));
