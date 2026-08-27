import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

const usedUrls = new Set();

function searchPexels(query, count = 1) {
  return new Promise((resolve, reject) => {
    https.get(`https://www.pexels.com/search/${encodeURIComponent(query)}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        // Pexels image URLs look like: https://images.pexels.com/photos/123/pexels-photo-123.jpeg
        const matches = [...data.matchAll(/https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.jpeg/g)];
        const allUrls = [...new Set(matches.map(m => m[0]))];
        const selected = [];
        for (const url of allUrls) {
          if (!usedUrls.has(url)) {
            usedUrls.add(url);
            selected.push(url);
            if (selected.length === count) break;
          }
        }
        
        // Fallback if Pexels fails to return enough images
        while(selected.length < count) {
          const fallback = `https://images.pexels.com/photos/${Math.floor(Math.random()*10000000)}/pexels-photo-fallback.jpeg`;
          usedUrls.add(fallback);
          selected.push(fallback);
        }
        
        resolve(selected);
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching images from Pexels...');

  const toursMapping = [
    { id: 'eg-001', query: 'aerial Nile river with felucca boats' },
    { id: 'eg-002', query: 'Giza pyramids golden hour' },
    { id: 'eg-003', query: 'Karnak temple columns' },
    { id: 'eg-004', query: 'Cairo skyline at night' },
    { id: 'eg-005', query: 'Sinai mountains and sea' },
    { id: 'eg-006', query: 'white rock formations Farafra' },
    { id: 'jo-001', query: 'Petra treasury facade' },
    { id: 'jo-002', query: 'red desert Wadi Rum landscape' },
    { id: 'jo-003', query: 'Dead Sea floating person' },
    { id: 'jo-004', query: 'Roman columns Jerash' },
    { id: 'jo-005', query: 'Amman city hills overview' },
    { id: 'jo-006', query: 'Red Sea coral underwater' },
    { id: 'tr-001', query: 'Istanbul Bosphorus bridge' },
    { id: 'tr-002', query: 'hot air balloons Cappadocia sunrise' },
    { id: 'tr-003', query: 'Ephesus ancient library' },
    { id: 'tr-004', query: 'turquoise coast Antalya' },
    { id: 'tr-005', query: 'Blue Mosque interior' },
    { id: 'tr-006', query: 'white travertine terraces Pamukkale' }
  ];

  let toursContent = fs.readFileSync(path.join(srcDir, 'data/tours.js'), 'utf8');
  for (const tour of toursMapping) {
    const urls = await searchPexels(tour.query, 1);
    const regex = new RegExp(`(id:\\s*'${tour.id}'[\\s\\S]*?images:\\s*\\[)'[^']*'\\]`);
    toursContent = toursContent.replace(regex, `$1'${urls[0]}']`);
    console.log(`Tour ${tour.id} -> ${urls[0]}`);
  }
  fs.writeFileSync(path.join(srcDir, 'data/tours.js'), toursContent);

  const servicesMapping = [
    { id: 'srv-hot-1', query: 'luxury hotel pyramids view' },
    { id: 'srv-hot-2', query: 'infinity pool Dead Sea resort' },
    { id: 'srv-hot-3', query: 'Ottoman palace Bosphorus waterfront' },
    { id: 'srv-saf-1', query: 'jeep desert Sinai' },
    { id: 'srv-saf-2', query: 'red sand dunes jeep Jordan' },
    { id: 'srv-saf-3', query: 'ATV ride valleys Cappadocia' },
    { id: 'srv-cmp-1', query: 'camping white desert Egypt night' },
    { id: 'srv-cmp-2', query: 'transparent dome tent stars desert' },
    { id: 'srv-cmp-3', query: 'mountain campfire ancient ruins' },
    { id: 'srv-cru-1', query: 'luxury cruise ship Nile river Egypt' },
    { id: 'srv-cru-2', query: 'glass bottom boat Red Sea' },
    { id: 'srv-cru-3', query: 'dinner cruise Istanbul night lights' }
  ];

  let servicesContent = fs.readFileSync(path.join(srcDir, 'data/services.js'), 'utf8');
  for (const srv of servicesMapping) {
    const urls = await searchPexels(srv.query, 3);
    const regex = new RegExp(`(id:\\s*'${srv.id}'[\\s\\S]*?images:\\s*\\[)'[^']*',\\s*'[^']*',\\s*'[^']*'\\]`);
    servicesContent = servicesContent.replace(regex, `$1'${urls[0]}', '${urls[1]}', '${urls[2]}']`);
    console.log(`Service ${srv.id} -> ${urls[0]}`);
  }
  fs.writeFileSync(path.join(srcDir, 'data/services.js'), servicesContent);

  const blogsMapping = [
    { slug: 'hidden-temples-of-luxor', query: 'temple of Luxor at dusk' },
    { slug: 'petra-by-night-guide', query: 'Petra candles night ceremony' },
    { slug: 'istanbul-grand-bazaar', query: 'Grand Bazaar Istanbul colorful' },
    { slug: 'sailing-the-nile-felucca', query: 'felucca sailing sunset Nile' },
    { slug: 'wadi-rum-desert-camping', query: 'starry sky desert Jordan camping' },
    { slug: 'turkish-cuisine-must-try', query: 'Turkish food spread traditional' },
    { slug: 'best-time-visit-egypt', query: 'Egypt travel landscape overview' },
    { slug: 'dead-sea-health-benefits', query: 'Dead Sea salt shore aerial' },
    { slug: 'cappadocia-hot-air-balloons', query: 'Cappadocia balloons dawn sky' }
  ];

  let blogsContent = fs.readFileSync(path.join(srcDir, 'data/blogs.js'), 'utf8');
  for (const blog of blogsMapping) {
    const urls = await searchPexels(blog.query, 1);
    const regex = new RegExp(`(slug:\\s*'${blog.slug}'[\\s\\S]*?img:\\s*)'[^']*'`);
    blogsContent = blogsContent.replace(regex, `$1'${urls[0]}'`);
    console.log(`Blog ${blog.slug} -> ${urls[0]}`);
  }
  fs.writeFileSync(path.join(srcDir, 'data/blogs.js'), blogsContent);

  console.log('All images updated with unique Pexels photos!');
}

run();
