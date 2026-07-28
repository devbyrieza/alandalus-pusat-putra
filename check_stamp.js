const sharp = require('sharp');
const path = require('path');

async function check() {
  const meta = await sharp(path.resolve(__dirname, 'public/documents/Stempel 1.png')).metadata();
  console.log(`Stempel 1.png: ${meta.width}x${meta.height}`);
}
check().catch(console.error);
