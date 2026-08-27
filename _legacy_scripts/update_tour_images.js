import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

// 1. Define the correct images for each tour based on title
const tourImages = {
  'eg-001': 'https://image.pollinations.ai/prompt/Luxury%20cruise%20ship%20sailing%20on%20the%20Nile%20River%20at%20sunset%20Egypt?width=1200&height=800&nologo=true',
  'eg-002': 'https://image.pollinations.ai/prompt/Great%20Pyramids%20of%20Giza%20and%20Sphinx%20Egypt%20golden%20hour?width=1200&height=800&nologo=true',
  'eg-003': 'https://image.pollinations.ai/prompt/Crystal%20clear%20waters%20and%20coral%20reefs%20Red%20Sea%20Egypt?width=1200&height=800&nologo=true',
  'eg-004': 'https://image.pollinations.ai/prompt/Alexandria%20Egypt%20coastline%20and%20Qaitbay%20Citadel?width=1200&height=800&nologo=true',
  'eg-005': 'https://image.pollinations.ai/prompt/White%20Desert%20Egypt%20chalk%20rock%20formations%20at%20sunset?width=1200&height=800&nologo=true',
  'eg-006': 'https://image.pollinations.ai/prompt/Luxor%20Karnak%20Temple%20columns%20Egypt%20ancient%20ruins?width=1200&height=800&nologo=true',
  
  'jo-001': 'https://image.pollinations.ai/prompt/Petra%20Treasury%20Al%20Khazneh%20Jordan%20ancient%20city?width=1200&height=800&nologo=true',
  'jo-002': 'https://image.pollinations.ai/prompt/Wadi%20Rum%20desert%20red%20sand%20dunes%20jeep%20safari%20Jordan?width=1200&height=800&nologo=true',
  'jo-003': 'https://image.pollinations.ai/prompt/Person%20floating%20effortlessly%20in%20the%20Dead%20Sea%20Jordan%20salt%20formations?width=1200&height=800&nologo=true',
  'jo-004': 'https://image.pollinations.ai/prompt/Jerash%20Roman%20ruins%20columns%20Jordan?width=1200&height=800&nologo=true',
  'jo-005': 'https://image.pollinations.ai/prompt/Amman%20Jordan%20cityscape%20view%20from%20Citadel%20hill?width=1200&height=800&nologo=true',
  'jo-006': 'https://image.pollinations.ai/prompt/Aqaba%20Jordan%20Red%20Sea%20coastline%20and%20mountains?width=1200&height=800&nologo=true',
  
  'tr-001': 'https://image.pollinations.ai/prompt/Bosphorus%20strait%20Istanbul%20Turkey%20with%20palaces%20and%20ships?width=1200&height=800&nologo=true',
  'tr-002': 'https://image.pollinations.ai/prompt/Hundreds%20of%20hot%20air%20balloons%20over%20Cappadocia%20Turkey%20at%20sunrise?width=1200&height=800&nologo=true',
  'tr-003': 'https://image.pollinations.ai/prompt/Ancient%20ruins%20of%20Ephesus%20Library%20of%20Celsus%20Turkey?width=1200&height=800&nologo=true',
  'tr-004': 'https://image.pollinations.ai/prompt/Antalya%20Turkey%20Turquoise%20Coast%20beautiful%20beaches%20and%20cliffs?width=1200&height=800&nologo=true',
  'tr-005': 'https://image.pollinations.ai/prompt/Turkish%20cuisine%20spread%20meze%20kebabs%20baklava%20Istanbul?width=1200&height=800&nologo=true',
  'tr-006': 'https://image.pollinations.ai/prompt/Pamukkale%20thermal%20pools%20white%20terraces%20Turkey?width=1200&height=800&nologo=true'
};

// 2. Update tours.js
let toursContent = fs.readFileSync(path.join(srcDir, 'data/tours.js'), 'utf8');

// The regex needs to find "id: 'eg-001', ... images: ['https://images.unsplash.com/photo-1533924375005-0e6988876ae9']" and replace the images array.
// A simpler way: parse it or replace it by finding the id and the next images array.
Object.entries(tourImages).forEach(([id, imgUrl]) => {
  const regex = new RegExp(`(id:\\s*'${id}'[\\s\\S]*?images:\\s*\\[)'[^']*'\\]`);
  toursContent = toursContent.replace(regex, `$1'${imgUrl}']`);
});

fs.writeFileSync(path.join(srcDir, 'data/tours.js'), toursContent);

// 3. Update TourCard.jsx to remove the unsplash query params
let cardContent = fs.readFileSync(path.join(srcDir, 'components/tour/TourCard.jsx'), 'utf8');
cardContent = cardContent.replace(/src=\{`\$\{tour\.images\[0\]\}\?w=600&q=80&fit=crop&crop=center`\}/g, 'src={tour.images[0]}');
fs.writeFileSync(path.join(srcDir, 'components/tour/TourCard.jsx'), cardContent);

// 4. Update TourDetails.jsx to remove unsplash query params
let detailsContent = fs.readFileSync(path.join(srcDir, 'pages/tours/TourDetails.jsx'), 'utf8');
detailsContent = detailsContent.replace(/src=\{`\$\{tour\.images\[0\]\}\?w=1600&q=90&fit=crop`\}/g, 'src={tour.images[0]}');
detailsContent = detailsContent.replace(/src=\{`\$\{img\}\?w=400&q=75&fit=crop`\}/g, 'src={img}');
detailsContent = detailsContent.replace(/src=\{`\$\{activeImage\}\?w=1600&q=90&fit=crop`\}/g, 'src={activeImage}');
fs.writeFileSync(path.join(srcDir, 'pages/tours/TourDetails.jsx'), detailsContent);

console.log('Successfully updated all trips with highly appropriate AI generated images.');
