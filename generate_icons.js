const sharp = require('sharp');
const fs = require('fs');

// Ensure output directory exists
if (!fs.existsSync('images')) {
  fs.mkdirSync('images');
}
if (!fs.existsSync('images/icons')) {
  fs.mkdirSync('images/icons');
}

const svgBuffer = fs.readFileSync('images/icons/logo.svg');

const sizes = [
  { name: 'images/icons/icon-192.png', size: 192 },
  { name: 'images/icons/icon-512.png', size: 512 },
  { name: 'images/icons/apple-touch-icon.png', size: 180 },
  { name: 'images/icons/favicon-32x32.png', size: 32 },
  { name: 'images/icons/favicon-16x16.png', size: 16 },
  { name: 'images/icons/favicon.ico', size: 32 },
  { name: 'favicon.ico', size: 32 }
];

async function generate() {
  for (const s of sizes) {
    await sharp(svgBuffer).resize(s.size, s.size).png().toFile(s.name);
  }
  console.log('Icons generated successfully.');
}
generate().catch(console.error);
