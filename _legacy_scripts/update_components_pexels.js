import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

function replaceInFile(filePath, regex, replacement) {
  const fullPath = path.join(srcDir, filePath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(fullPath, content);
}

// 1. TourCard
replaceInFile('components/tour/TourCard.jsx', 
  /src=\{tour\.images\[0\]\}/g, 
  'src={`${tour.images[0]}?auto=compress&cs=tinysrgb&w=800&fit=crop&crop=center`}'
);

// 2. TourDetails
replaceInFile('pages/tours/TourDetails.jsx',
  /src=\{tour\.images\[0\]\}/g,
  'src={`${tour.images[0]}?auto=compress&cs=tinysrgb&w=1600&fit=crop`}'
);
replaceInFile('pages/tours/TourDetails.jsx',
  /src=\{img\}/g,
  'src={`${img}?auto=compress&cs=tinysrgb&w=400&fit=crop`}'
);
replaceInFile('pages/tours/TourDetails.jsx',
  /src=\{activeImage\}/g,
  'src={`${activeImage}?auto=compress&cs=tinysrgb&w=1600&fit=crop`}'
);

// 3. Blogs
replaceInFile('pages/Blogs.jsx',
  /src=\{blog\.img\}/g,
  'src={`${blog.img}?auto=compress&cs=tinysrgb&w=800&fit=crop&crop=center`}'
);

// 4. BlogDetails
replaceInFile('pages/blogs/BlogDetails.jsx',
  /src=\{blog\.img\}/g,
  'src={`${blog.img}?auto=compress&cs=tinysrgb&w=1600&fit=crop`}'
);
replaceInFile('pages/blogs/BlogDetails.jsx',
  /src=\{relBlog\.img\}/g,
  'src={`${relBlog.img}?auto=compress&cs=tinysrgb&w=800&fit=crop&crop=center`}'
);

// 5. Services
replaceInFile('pages/Services.jsx',
  /src=\{item\.images\[0\]\}/g,
  'src={`${item.images[0]}?auto=compress&cs=tinysrgb&w=800&fit=crop&crop=center`}'
);

// 6. ServiceDetails
replaceInFile('pages/services/ServiceDetails.jsx',
  /src=\{service\.images\[0\]\}/g,
  'src={`${service.images[0]}?auto=compress&cs=tinysrgb&w=1600&fit=crop`}'
);
replaceInFile('pages/services/ServiceDetails.jsx',
  /src=\{img\}/g,
  'src={`${img}?auto=compress&cs=tinysrgb&w=400&fit=crop`}'
);
replaceInFile('pages/services/ServiceDetails.jsx',
  /src=\{activeImage\}/g,
  'src={`${activeImage}?auto=compress&cs=tinysrgb&w=1600&fit=crop`}'
);
replaceInFile('pages/services/ServiceDetails.jsx',
  /src=\{relService\.images\[0\]\}/g,
  'src={`${relService.images[0]}?auto=compress&cs=tinysrgb&w=800&fit=crop&crop=center`}'
);

// 7. Pages Hero Images
const pexelsData = {
  'hero-home': '2387877',
  'hero-egypt': '262780',
  'hero-jordan': '1658967',
  'hero-turkey': '1481180',
  'hero-services': '258154',
  'hero-blogs': '3373201',
  'hero-about': '2275955',
  'hero-contact': '4386339'
};

const getPexelsUrl = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop`;

const pagesWithHero = [
  { path: 'pages/Home.jsx', alt: 'DUNAS TRAVEL Hero', url: getPexelsUrl(pexelsData['hero-home']) },
  { path: 'pages/destinations/Egypt.jsx', alt: 'Egypt Pyramids Hero', url: getPexelsUrl(pexelsData['hero-egypt']) },
  { path: 'pages/destinations/Jordan.jsx', alt: 'Jordan Petra Hero', url: getPexelsUrl(pexelsData['hero-jordan']) },
  { path: 'pages/destinations/Turkey.jsx', alt: 'Turkey Cappadocia Hero', url: getPexelsUrl(pexelsData['hero-turkey']) },
  { path: 'pages/Services.jsx', alt: 'Luxury Services Hero', url: getPexelsUrl(pexelsData['hero-services']) },
  { path: 'pages/Blogs.jsx', alt: 'Travel Journal Hero', url: getPexelsUrl(pexelsData['hero-blogs']) },
  { path: 'pages/About.jsx', alt: 'About Us Hero', url: getPexelsUrl(pexelsData['hero-about']) },
  { path: 'pages/Contact.jsx', alt: 'Contact Us Hero', url: getPexelsUrl(pexelsData['hero-contact']) }
];

pagesWithHero.forEach(({ path: p, url }) => {
  // We need to replace the old URL we set earlier (which could be unsplash or AI)
  // Let's just find any <img ... src="http..." alt="..." /> that acts as hero.
  // Actually, previously we changed src="/images/hero-bg.png" to src="https://images.unsplash..."
  let content = fs.readFileSync(path.join(srcDir, p), 'utf8');
  content = content.replace(/src="https:\/\/[^"]+"/g, (match) => {
    // only replace if it's not a small icon
    if (match.includes('unsplash') || match.includes('pollinations')) {
      return `src="${url}"`;
    }
    return match;
  });
  fs.writeFileSync(path.join(srcDir, p), content);
});

console.log('Components updated to append Pexels parameters and use high-res images.');
