import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '../public');
const distDir = join(__dirname, '../dist');

async function optimizeImages() {
  console.log('🖼️  Optimizing images...');
  
  try {
    // Optimize PNG files
    await imagemin([`${publicDir}/*.png`], {
      destination: `${publicDir}/optimized`,
      plugins: [
        imageminPngquant({
          quality: [0.6, 0.8]
        }),
        imageminWebp({
          quality: 80
        })
      ]
    });

    // Optimize JPEG files
    await imagemin([`${publicDir}/*.{jpg,jpeg}`], {
      destination: `${publicDir}/optimized`,
      plugins: [
        imageminMozjpeg({
          quality: 80
        }),
        imageminWebp({
          quality: 80
        })
      ]
    });

    console.log('✅ Images optimized successfully!');
    console.log('📁 Optimized images saved to public/optimized/');
    console.log('💡 Consider replacing original images with optimized versions');
    
  } catch (error) {
    console.error('❌ Error optimizing images:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeImages();
}

export default optimizeImages;