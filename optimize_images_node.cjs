const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Step 1: Ensure sharp is installed
try {
  require.resolve('sharp');
} catch (e) {
  console.log('sharp module is not installed. Installing sharp...');
  try {
    execSync('npm install sharp --no-save', { stdio: 'inherit' });
    console.log('sharp installed successfully.');
  } catch (err) {
    console.error('Failed to install sharp automatically. Please run: npm install sharp');
    process.exit(1);
  }
}

const sharp = require('sharp');

async function optimizeImage({ input, output, width, height, quality = 75 }) {
  try {
    if (!fs.existsSync(input)) {
      console.log(`Source not found: {input}`);
      return;
    }

    let pipeline = sharp(input);

    if (width && height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'cover',
        position: 'center'
      });
    }

    await pipeline
      .webp({ quality })
      .toFile(output);

    console.log(`Optimized: ${input} -> ${output} (quality=${quality}${width ? `, size=${width}x${height}` : ''})`);
  } catch (err) {
    console.error(`Error optimizing ${input}:`, err.message);
  }
}

async function run() {
  const baseDir = __dirname;
  
  // 1. hero-poster.webp
  const heroIn = fs.existsSync(path.join(baseDir, 'public', 'images', 'hero.jpg'))
    ? path.join(baseDir, 'public', 'images', 'hero.jpg')
    : path.join(baseDir, 'public', 'imgs', 'hero-poster.webp');
  const heroOut = path.join(baseDir, 'public', 'imgs', 'hero-poster.webp');
  
  // 2. crafting-journeys.webp
  const craftIn = path.join(baseDir, 'public', 'images', 'crafting-journeys.jpg');
  const craftOut = path.join(baseDir, 'public', 'images', 'crafting-journeys.webp');
  
  // 3. tito-mascot.webp
  const mascotIn = path.join(baseDir, 'public', 'imgs', 'tito-mascot.png');
  const mascotOut = path.join(baseDir, 'public', 'imgs', 'tito-mascot.webp');

  console.log('Starting image optimization...');
  
  // Temporarily rename output if input is same as output to prevent read/write conflicts
  const isSameHero = heroIn === heroOut;
  let tempHeroIn = heroIn;
  if (isSameHero && fs.existsSync(heroIn)) {
    tempHeroIn = path.join(baseDir, 'public', 'imgs', 'hero-poster-temp.webp');
    fs.renameSync(heroIn, tempHeroIn);
  }

  await optimizeImage({
    input: tempHeroIn,
    output: heroOut,
    width: 1440,
    height: 812,
    quality: 70
  });

  if (isSameHero && fs.existsSync(tempHeroIn)) {
    fs.unlinkSync(tempHeroIn);
  }

  await optimizeImage({
    input: craftIn,
    output: craftOut,
    quality: 75
  });

  await optimizeImage({
    input: mascotIn,
    output: mascotOut,
    width: 300,
    height: 300,
    quality: 75
  });

  console.log('Image optimization finished!');
}

run();
