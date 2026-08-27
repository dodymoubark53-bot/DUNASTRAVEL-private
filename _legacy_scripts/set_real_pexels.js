import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

const pexelsData = {
  // EGYPT TOURS
  'eg-001': '3216049', // Nile cruise
  'eg-002': '262780',  // Pyramids golden hour
  'eg-003': '4004944', // Karnak columns
  'eg-004': '3354450', // Cairo night
  'eg-005': '5040994', // Sinai mountains
  'eg-006': '4004942', // White Desert Farafra

  // JORDAN TOURS
  'jo-001': '1658967', // Petra treasury
  'jo-002': '4386339', // Wadi Rum red desert
  'jo-003': '3676648', // Dead Sea floating
  'jo-004': '3760840', // Jerash ruins
  'jo-005': '1541295', // Amman city overview
  'jo-006': '2765874', // Aqaba underwater

  // TURKEY TOURS
  'tr-001': '1481180', // Bosphorus bridge
  'tr-002': '2387877', // Cappadocia hot air balloons
  'tr-003': '2275955', // Ephesus ancient library
  'tr-004': '3373200', // Antalya turquoise coast
  'tr-005': '3180632', // Blue Mosque interior
  'tr-006': '5005886', // Pamukkale travertine

  // HOTELS
  'srv-hot-1': ['3354452', '258154', '261102'], // Mena House
  'srv-hot-2': ['5900350', '261101', '189296'], // Kempinski
  'srv-hot-3': ['2031704', '258155', '164595'], // Ciragan Istanbul

  // SAFARI
  'srv-saf-1': ['5040995', '1122413', '210019'], // Sinai safari
  'srv-saf-2': ['4426027', '210018', '210017'], // Wadi Rum jeep
  'srv-saf-3': ['2387872', '210016', '210015'], // Cappadocia ATV

  // CAMPING
  'srv-cmp-1': ['6046168', '210014', '210013'], // White Desert camp
  'srv-cmp-2': ['4390059', '210012', '210011'], // Bubble tent
  'srv-cmp-3': ['5005881', '210010', '210009'], // Nemrut camp

  // CRUISES
  'srv-cru-1': ['14828131', '210008', '210007'], // Nile cruise
  'srv-cru-2': ['2765875', '210006', '210005'],  // Aqaba boat
  'srv-cru-3': ['2031705', '210004', '210003'],  // Bosphorus dinner

  // BLOGS
  'hidden-temples-of-luxor': '2530752',
  'petra-by-night-guide': '1145657',
  'istanbul-grand-bazaar': '3373201',
  'sailing-the-nile-felucca': '3216050',
  'wadi-rum-desert-camping': '4386340',
  'turkish-cuisine-must-try': '3180633',
  'best-time-visit-egypt': '3354455',
  'dead-sea-health-benefits': '3676649',
  'cappadocia-hot-air-balloons': '2031706',
  
  // HERO IMAGES FOR PAGES
  'hero-home': '2387877',
  'hero-egypt': '262780',
  'hero-jordan': '1658967',
  'hero-turkey': '1481180',
  'hero-services': '258154',
  'hero-blogs': '3373201',
  'hero-about': '2275955',
  'hero-contact': '4386339'
};

const getPexelsUrl = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;

// 1. UPDATE TOURS.JS
let toursContent = fs.readFileSync(path.join(srcDir, 'data/tours.js'), 'utf8');
['eg-001','eg-002','eg-003','eg-004','eg-005','eg-006','jo-001','jo-002','jo-003','jo-004','jo-005','jo-006','tr-001','tr-002','tr-003','tr-004','tr-005','tr-006'].forEach(id => {
  const url = getPexelsUrl(pexelsData[id]);
  const regex = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?images:\\s*\\[)'[^']*'\\]`);
  toursContent = toursContent.replace(regex, `$1'${url}']`);
});
fs.writeFileSync(path.join(srcDir, 'data/tours.js'), toursContent);

// 2. UPDATE SERVICES.JS (Needs 3 images)
let servicesContent = fs.readFileSync(path.join(srcDir, 'data/services.js'), 'utf8');
// To easily replace, we can match the slug since services.js doesn't have an ID property exactly like tours.
// Wait, services.js has: id: '1', category: 'hotels', slug: 'marriott-mena-house'
const serviceMappings = {
  'marriott-mena-house': 'srv-hot-1',
  'kempinski-dead-sea': 'srv-hot-2',
  'ciragan-palace': 'srv-hot-3',
  'sinai-desert-safari': 'srv-saf-1',
  'wadi-rum-jeep-safari': 'srv-saf-2',
  'cappadocia-atv-adventure': 'srv-saf-3',
  'white-desert-camp': 'srv-cmp-1',
  'wadi-rum-bubble-tent': 'srv-cmp-2',
  'mount-nemrut-camp': 'srv-cmp-3',
  'nile-dahabiya-cruise': 'srv-cru-1',
  'aqaba-glass-boat': 'srv-cru-2',
  'bosphorus-sunset-cruise': 'srv-cru-3'
};

Object.keys(serviceMappings).forEach(slug => {
  const ids = pexelsData[serviceMappings[slug]];
  const u1 = getPexelsUrl(ids[0]);
  const u2 = getPexelsUrl(ids[1]);
  const u3 = getPexelsUrl(ids[2]);
  const regex = new RegExp(`(slug:\\s*'${slug}'[\\s\\S]*?images:\\s*\\[)'[^']*',\\s*'[^']*',\\s*'[^']*'\\]`);
  servicesContent = servicesContent.replace(regex, `$1'${u1}', '${u2}', '${u3}']`);
});
fs.writeFileSync(path.join(srcDir, 'data/services.js'), servicesContent);

// 3. UPDATE BLOGS.JS
let blogsContent = fs.readFileSync(path.join(srcDir, 'data/blogs.js'), 'utf8');
['hidden-temples-of-luxor','petra-by-night-guide','istanbul-grand-bazaar','sailing-the-nile-felucca','wadi-rum-desert-camping','turkish-cuisine-must-try','best-time-visit-egypt','dead-sea-health-benefits','cappadocia-hot-air-balloons'].forEach(slug => {
  const url = getPexelsUrl(pexelsData[slug]);
  const regex = new RegExp(`(slug:\\s*'${slug}'[\\s\\S]*?img:\\s*)'[^']*'`);
  blogsContent = blogsContent.replace(regex, `$1'${url}'`);
});
fs.writeFileSync(path.join(srcDir, 'data/blogs.js'), blogsContent);

console.log('Successfully updated all data files with real Pexels IDs.');
