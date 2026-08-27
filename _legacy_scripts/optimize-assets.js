import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = __dirname;

// 1. Install dependencies if needed
const installDeps = () => {
  console.log('Checking dependencies (sharp, ffmpeg-static)...');
  try {
    // Check if sharp and ffmpeg-static are already in package.json or node_modules
    const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
    const hasSharp = pkg.devDependencies?.sharp || pkg.dependencies?.sharp;
    const hasFfmpeg = pkg.devDependencies?.['ffmpeg-static'] || pkg.dependencies?.['ffmpeg-static'];
    
    if (!hasSharp || !hasFfmpeg) {
      console.log('Installing sharp and ffmpeg-static as devDependencies...');
      execSync('npm install -D sharp ffmpeg-static', { stdio: 'inherit', cwd: projectRoot });
    } else {
      console.log('Dependencies already declared in package.json.');
    }
  } catch (err) {
    console.error('Failed to parse package.json or install packages, trying npm install anyway...', err);
    execSync('npm install -D sharp ffmpeg-static', { stdio: 'inherit', cwd: projectRoot });
  }
};

installDeps();

// Dynamically import dependencies after installation
const sharp = (await import('sharp')).default;
const ffmpegPath = (await import('ffmpeg-static')).default;

// 2. Setup folders
const ensureDir = (dirPath) => {
  const fullPath = path.join(projectRoot, dirPath);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
};

ensureDir('public/imgs/destinations');
ensureDir('public/imgs/services');
ensureDir('public/imgs/programs');

// Helper to download a file
const downloadFile = async (url, destPath) => {
  console.log(`Downloading: ${url} ...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
  console.log(`Saved temporary file: ${destPath}`);
};

// Main execution
const main = async () => {
  const tempDir = path.join(projectRoot, 'temp_downloads');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  try {
    // 3. Process Destination Flags / Icons (Bing / Heritage)
    const destFlags = [
      { id: 'egypt', url: 'https://tse3.mm.bing.net/th/id/OIP.SQ9E00KSa9ALEdFsXAZ3awHaE7?r=0&cb=thfvnextfalcon4&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 'turkey', url: 'https://tse3.mm.bing.net/th/id/OIP.ACXDe8yEd0eknkCLENbIcQHaD4?r=0&cb=thfvnextfalcon4&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 'dubai', url: 'https://tse2.mm.bing.net/th/id/OIP.FQURzfPWIc9YIW_e6oX_ZAHaDR?r=0&cb=thfvnextfalcon4&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 'jordan', url: 'https://tse3.mm.bing.net/th/id/OIP.PxvXjR1OV2gW8_cTvGN2oQHaH8?r=0&cb=thfvnextfalcon4&w=1280&h=1374&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 'tunisia', url: 'https://www.heritage.org/sites/default/files/styles/facebook_optimized/public/images/2017-06/Tunisia.jpg?itok=trkp0NK9' },
      { id: 'morocco', url: 'https://tse3.mm.bing.net/th/id/OIP.ijumtXxli2BNILpXsgr7HgHaE9?r=0&cb=thfvnextfalcon4&rs=1&pid=ImgDetMain&o=7&rm=3' }
    ];

    for (const flag of destFlags) {
      const tempPath = path.join(tempDir, `${flag.id}_temp`);
      await downloadFile(flag.url, tempPath);
      
      const outPath = path.join(projectRoot, `public/imgs/destinations/${flag.id}.webp`);
      console.log(`Processing flag image with sharp to ${outPath} ...`);
      // Resize to 80x80 max containing or cover, keeping detail for small icon display
      await sharp(tempPath)
        .resize(100, 100, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(outPath);
      console.log(`Saved optimized flag: ${outPath}`);
    }

    // 4. Process other external covers
    const covers = [
      {
        name: 'transportation-cover',
        url: 'https://tse3.mm.bing.net/th/id/OIP._WYWHyRmdSfQ0gePUWh7_AHaEO?r=0&cb=thfc1falcon3&w=1200&h=686&rs=1&pid=ImgDetMain&o=7&rm=3',
        dir: 'public/imgs/services',
        width: 800
      },
      {
        name: 'service-317',
        url: 'https://tse2.mm.bing.net/th/id/OIP.swut4IYCirj6TKWnrO9PDwHaDz?r=0&cb=thfvnextfalcon4&w=1360&h=700&rs=1&pid=ImgDetMain&o=7&rm=3',
        dir: 'public/imgs/services',
        width: 800
      },
      {
        name: 'dubai-reg-23',
        url: 'https://tse3.mm.bing.net/th/id/OIP.S2il63MLxG0zSM8KYvrtywHaFj?r=0&cb=thfc1falcon3&w=2048&h=1536&rs=1&pid=ImgDetMain&o=7&rm=3',
        dir: 'public/imgs/programs',
        width: 800
      },
      {
        name: 'dubai-reg-27',
        url: 'https://tse4.mm.bing.net/th/id/OIP.BNdEDRHmfZhQSUQ9ekXUawHaEg?r=0&cb=thfc1falcon3&w=1200&h=730&rs=1&pid=ImgDetMain&o=7&rm=3',
        dir: 'public/imgs/programs',
        width: 800
      }
    ];

    for (const cover of covers) {
      const tempPath = path.join(tempDir, `${cover.name}_temp`);
      await downloadFile(cover.url, tempPath);
      
      const outPath = path.join(projectRoot, `${cover.dir}/${cover.name}.webp`);
      console.log(`Processing cover image ${cover.name} with sharp...`);
      await sharp(tempPath)
        .resize(cover.width, null, { withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(outPath);
      console.log(`Saved optimized cover: ${outPath}`);
    }

    // 5. Optimize local images
    console.log('Optimizing local images with sharp...');
    
    // Tito Mascot (500x500 -> 220x220)
    const titoMascotPath = path.join(projectRoot, 'public/imgs/tito-mascot.png');
    if (fs.existsSync(titoMascotPath)) {
      const outMascotPath = path.join(projectRoot, 'public/imgs/tito-mascot.webp');
      await sharp(titoMascotPath)
        .resize(220, 220, { fit: 'cover' })
        .webp({ quality: 85 })
        .toFile(outMascotPath);
      console.log(`Saved optimized Tito mascot: ${outMascotPath}`);
    } else {
      console.warn(`Local Tito mascot not found at ${titoMascotPath}`);
    }

    // Hero Hieroglyph (Convert to WebP)
    const heroHieroPath = path.join(projectRoot, 'public/imgs/hero-hiero.png');
    if (fs.existsSync(heroHieroPath)) {
      const outHieroPath = path.join(projectRoot, 'public/imgs/hero-hiero.webp');
      await sharp(heroHieroPath)
        .webp({ quality: 80 })
        .toFile(outHieroPath);
      console.log(`Saved optimized Hero Hiero: ${outHieroPath}`);
    } else {
      console.warn(`Local Hero Hiero not found at ${heroHieroPath}`);
    }

    // Crafting Journeys (Resize & WebP)
    const craftingJourneysPath = path.join(projectRoot, 'public/images/crafting-journeys.jpg');
    if (fs.existsSync(craftingJourneysPath)) {
      const outCraftingPath = path.join(projectRoot, 'public/images/crafting-journeys.webp');
      await sharp(craftingJourneysPath)
        .resize(800, null, { withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(outCraftingPath);
      console.log(`Saved optimized Crafting Journeys: ${outCraftingPath}`);
    } else {
      console.warn(`Local Crafting Journeys not found at ${craftingJourneysPath}`);
    }

    // 6. Compress and re-encode background video using ffmpeg-static
    const videoInPath = path.join(projectRoot, 'public/imgs/hero.mp4');
    if (fs.existsSync(videoInPath)) {
      const videoOutMp4Temp = path.join(tempDir, 'hero_compressed.mp4');
      const videoOutWebm = path.join(projectRoot, 'public/imgs/hero.webm');
      const posterOut = path.join(projectRoot, 'public/imgs/hero-poster.webp');

      console.log(`Re-encoding video using ffmpeg: ${ffmpegPath} ...`);
      
      // Extract a poster frame first (at 2s mark)
      console.log('Extracting poster frame from video...');
      try {
        execSync(`"${ffmpegPath}" -y -i "${videoInPath}" -ss 00:00:02 -vframes 1 -vf scale=1280:-2 "${tempDir}/poster.jpg"`, { stdio: 'inherit' });
        await sharp(`${tempDir}/poster.jpg`)
          .webp({ quality: 70 })
          .toFile(posterOut);
        console.log(`Saved poster image: ${posterOut}`);
      } catch (err) {
        console.error('Failed to extract poster frame, generating from placeholder...', err);
      }

      // Re-encode to MP4: 960x540, CRF 28, with AAC audio
      console.log('Encoding optimized MP4 video (960x540, CRF 28)...');
      execSync(`"${ffmpegPath}" -y -i "${videoInPath}" -vf scale=960:-2 -vcodec libx264 -crf 28 -preset slow -c:a aac -b:a 128k "${videoOutMp4Temp}"`, { stdio: 'inherit' });
      
      // Re-encode to WebM: 960x540, VP9 (crf 36), with Opus audio
      console.log('Encoding optimized WebM video (960x540, VP9)...');
      execSync(`"${ffmpegPath}" -y -i "${videoInPath}" -vf scale=960:-2 -vcodec libvpx-vp9 -crf 36 -b:v 0 -deadline good -cpu-used 2 -c:a libopus -b:a 96k "${videoOutWebm}"`, { stdio: 'inherit' });

      // Overwrite original MP4 with compressed version
      fs.copyFileSync(videoOutMp4Temp, videoInPath);
      console.log(`Video compression finished. Overwrote original MP4 and created WebM: ${videoOutWebm}`);
    } else {
      console.warn(`Local video not found at ${videoInPath}`);
    }

  } catch (err) {
    console.error('Error occurred in asset optimization main process:', err);
  } finally {
    // Cleanup temporary files
    try {
      console.log('Cleaning up temporary downloads...');
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch (cleanupErr) {
      console.error('Failed to clean up temp downloads folder:', cleanupErr);
    }
  }
};

main();
