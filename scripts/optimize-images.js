import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminPngquant from 'imagemin-pngquant';
import imageminMozjpeg from 'imagemin-mozjpeg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = join(__dirname, '../public');
const optimizedDir = join(publicDir, 'optimized');

async function optimizeImages() {
  console.log('🖼️  Optimizing images...');
  
  try {
    // Ensure optimized directory exists
    if (!existsSync(optimizedDir)) {
      mkdirSync(optimizedDir, { recursive: true });
    }

    // Optimize PNG files and create WebP versions
    await imagemin([`${publicDir}/*.png`], {
      destination: optimizedDir,
      plugins: [
        imageminPngquant({
          quality: [0.6, 0.8]
        }),
        imageminWebp({
          quality: 80
        })
      ]
    });

    // Optimize JPEG files and create WebP versions
    await imagemin([`${publicDir}/*.{jpg,jpeg}`], {
      destination: optimizedDir,
      plugins: [
        imageminMozjpeg({
          quality: 80
        }),
        imageminWebp({
          quality: 80
        })
      ]
    });

    // Copy original PNG files to optimized directory as fallbacks
    const pngFiles = ['black_circle_360x360.png'];
    pngFiles.forEach(file => {
      const srcPath = join(publicDir, file);
      const destPath = join(optimizedDir, file);
      if (existsSync(srcPath)) {
        copyFileSync(srcPath, destPath);
        console.log(`📋 Copied ${file} to optimized directory`);
      }
    });

    console.log('✅ Images optimized successfully!');
    console.log('📁 Optimized images saved to public/optimized/');
    
  } catch (error) {
    console.error('❌ Error optimizing images:', error);
    process.exit(1); // Exit with error code for build failure
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeImages();
}

export default optimizeImages;