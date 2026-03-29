const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');

const sizes = [16, 48, 128];
const dir = path.join(__dirname, '..', 'public', 'icons');

if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

for (const size of sizes) {
  const png = new PNG({ width: size, height: size });
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (size * y + x) * 4;
      png.data[idx]     = 79;   // R  (indigo #4F46E5)
      png.data[idx + 1] = 70;   // G
      png.data[idx + 2] = 229;  // B
      png.data[idx + 3] = 255;  // A
    }
  }
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(path.join(dir, `icon${size}.png`), buffer);
  console.log(`Created icon${size}.png`);
}
