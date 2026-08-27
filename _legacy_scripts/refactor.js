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

replaceInFile('components/tour/TourCard.jsx', /src=\{tour\.images\[0\]\}/g, 'src={`${tour.images[0]}?w=600&q=80&fit=crop&crop=center`}');
replaceInFile('components/tour/TourCard.jsx', /alt=\{tour\.title\}/g, 'alt={`${tour.title} in ${tour.destination}`}');

replaceInFile('pages/tours/TourDetails.jsx', /src=\{tour\.images\[0\]\}/g, 'src={`${tour.images[0]}?w=1600&q=90&fit=crop`}');
replaceInFile('pages/tours/TourDetails.jsx', /src=\{img\}/g, 'src={`${img}?w=400&q=75&fit=crop`}');
replaceInFile('pages/tours/TourDetails.jsx', /src=\{activeImage\}/g, 'src={`${activeImage}?w=1600&q=90&fit=crop`}');
replaceInFile('pages/tours/TourDetails.jsx', /alt="Gallery preview"/g, 'alt={`${tour.title} gallery preview`}');

replaceInFile('pages/Blogs.jsx', /src=\{blog\.img\}/g, 'src={`${blog.img}?w=600&q=80&fit=crop&crop=center`}');
replaceInFile('pages/Blogs.jsx', /alt=\{blog\.title\}/g, 'alt={`${blog.title} - ${blog.category} blog cover`}');

replaceInFile('pages/blogs/BlogDetails.jsx', /src=\{blog\.img\}/g, 'src={`${blog.img}?w=1600&q=90&fit=crop`}');
replaceInFile('pages/blogs/BlogDetails.jsx', /src=\{relBlog\.img\}/g, 'src={`${relBlog.img}?w=600&q=80&fit=crop&crop=center`}');

replaceInFile('pages/Services.jsx', /src=\{item\.images\[0\]\}/g, 'src={`${item.images[0]}?w=600&q=80&fit=crop&crop=center`}');

replaceInFile('pages/services/ServiceDetails.jsx', /src=\{service\.images\[0\]\}/g, 'src={`${service.images[0]}?w=1600&q=90&fit=crop`}');
replaceInFile('pages/services/ServiceDetails.jsx', /src=\{img\}/g, 'src={`${img}?w=400&q=75&fit=crop`}');
replaceInFile('pages/services/ServiceDetails.jsx', /src=\{activeImage\}/g, 'src={`${activeImage}?w=1600&q=90&fit=crop`}');
replaceInFile('pages/services/ServiceDetails.jsx', /src=\{relService\.images\[0\]\}/g, 'src={`${relService.images[0]}?w=600&q=80&fit=crop&crop=center`}');

const pagesWithHero = [
  { path: 'pages/Home.jsx', alt: 'DUNAS TRAVEL Hero', url: 'https://images.unsplash.com/photo-1539667468225-eebb663053e6?w=1600&q=90&fit=crop' },
  { path: 'pages/destinations/Egypt.jsx', alt: 'Egypt Pyramids Hero', url: 'https://images.unsplash.com/photo-1553835695-1f95aab2e4b4?w=1600&q=90&fit=crop' },
  { path: 'pages/destinations/Jordan.jsx', alt: 'Jordan Petra Hero', url: 'https://images.unsplash.com/photo-1560946285-d85c18e19c36?w=1600&q=90&fit=crop' },
  { path: 'pages/destinations/Turkey.jsx', alt: 'Turkey Cappadocia Hero', url: 'https://images.unsplash.com/photo-1541359695-167d4fdfb08d?w=1600&q=90&fit=crop' },
  { path: 'pages/Services.jsx', alt: 'Luxury Services Hero', url: 'https://images.unsplash.com/photo-1582715155447-9dc4e50882d3?w=1600&q=90&fit=crop' },
  { path: 'pages/Blogs.jsx', alt: 'Travel Journal Hero', url: 'https://images.unsplash.com/photo-1562208034-7043818e3dd6?w=1600&q=90&fit=crop' },
  { path: 'pages/About.jsx', alt: 'About Us Hero', url: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0b?w=1600&q=90&fit=crop' },
  { path: 'pages/Contact.jsx', alt: 'Contact Us Hero', url: 'https://images.unsplash.com/photo-1591106263536-2313dfa47dc3?w=1600&q=90&fit=crop' }
];

pagesWithHero.forEach(({ path: p, alt, url }) => {
  replaceInFile(p, /src="\/images\/hero-bg\.png"([\s\S]*?)alt=".*?"/g, `src="${url}"$1alt="${alt}"`);
  replaceInFile(p, /src="\/images\/hero-bg\.png"/g, `src="${url}"`);
  
  let content = fs.readFileSync(path.join(srcDir, p), 'utf8');
  if (!content.includes('loading="lazy"')) {
     content = content.replace(/<img(.*?)>/g, (match, p1) => {
       if (!p1.includes('loading=')) return `<img${p1} loading="lazy">`;
       return match;
     });
     fs.writeFileSync(path.join(srcDir, p), content);
  }
});

const toursIds = [
  'https://images.unsplash.com/photo-1533924375005-0e6988876ae9', 'https://images.unsplash.com/photo-1539667468225-eebb663053e6', 'https://images.unsplash.com/photo-1584661156699-dc0a6a4f913d', 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee', 'https://images.unsplash.com/photo-1591106263536-2313dfa47dc2', 'https://images.unsplash.com/photo-1584488661608-f10f44485741',
  'https://images.unsplash.com/photo-1560946285-d85c18e19c35', 'https://images.unsplash.com/photo-1591873136294-b772c728eeb0', 'https://images.unsplash.com/photo-1562915801-628d098abaf1', 'https://images.unsplash.com/photo-1612803157297-b3f815049cf1', 'https://images.unsplash.com/photo-1548232924-f72670eefdb3', 'https://images.unsplash.com/photo-1604921605273-0248a37f5d4d',
  'https://images.unsplash.com/photo-1524231757712-2d50e8a71d87', 'https://images.unsplash.com/photo-1543781987-a006c00d860e', 'https://images.unsplash.com/photo-1605896349942-8822607e4d82', 'https://images.unsplash.com/photo-1621008677610-864a7551cc37', 'https://images.unsplash.com/photo-1541359695-167d4fdfb08c', 'https://images.unsplash.com/photo-1598425039575-b6d3a8220bc0'
];
let toursContent = fs.readFileSync(path.join(srcDir, 'data/tours.js'), 'utf8');
let i = 0;
toursContent = toursContent.replace(/images: \['\/images\/tour-1\.png'\]/g, () => {
  return `images: ['${toursIds[i++]}']`;
});
fs.writeFileSync(path.join(srcDir, 'data/tours.js'), toursContent);

const blogsIds = [
  'https://images.unsplash.com/photo-1585065416041-e94d80a15320', 'https://images.unsplash.com/photo-1588693959306-69502b489d21', 'https://images.unsplash.com/photo-1562208034-7043818e3dd5', 'https://images.unsplash.com/photo-1605333552084-5bd26176ee17', 'https://images.unsplash.com/photo-1551632811-561cd9ec1492', 'https://images.unsplash.com/photo-1544365558-35aa4af40b8a', 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a', 'https://images.unsplash.com/photo-1575124113543-c00329b15bfa', 'https://images.unsplash.com/photo-1567115858-f99a3ab65e23'
];
let blogsContent = fs.readFileSync(path.join(srcDir, 'data/blogs.js'), 'utf8');
let j = 0;
blogsContent = blogsContent.replace(/img: '\/images\/tour-1\.png'/g, () => {
  return `img: '${blogsIds[j++]}'`;
});
fs.writeFileSync(path.join(srcDir, 'data/blogs.js'), blogsContent);

const servicesIds = [
  ['https://images.unsplash.com/photo-1580837119756-563d608dd119', 'https://images.unsplash.com/photo-1590418606746-018840f9cb25', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'],
  ['https://images.unsplash.com/photo-1582715155447-9dc4e50882d2', 'https://images.unsplash.com/photo-1566073771259-6a8506099945', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'],
  ['https://images.unsplash.com/photo-1555505019-8c3f1c4ba5ce', 'https://images.unsplash.com/photo-1542314831-c6a4d14d2301', 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd'],
  ['https://images.unsplash.com/photo-1518182170546-07261ec8df28', 'https://images.unsplash.com/photo-1509316785289-025f5b846b35', 'https://images.unsplash.com/photo-1535260172081-067676e279a0'],
  ['https://images.unsplash.com/photo-1534008897995-14c1fa0b5550', 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e', 'https://images.unsplash.com/photo-1549646485-6188dc7e36bd'],
  ['https://images.unsplash.com/photo-1566405763-71822c9b4e7b', 'https://images.unsplash.com/photo-1601007212067-d861619472e3', 'https://images.unsplash.com/photo-1532012197267-da84d127e765'],
  ['https://images.unsplash.com/photo-1552596913-75c1dd5bb97a', 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d'],
  ['https://images.unsplash.com/photo-1612450379135-e10260dddc00', 'https://images.unsplash.com/photo-1534447677768-be436bb09401', 'https://images.unsplash.com/photo-1515876305430-f06ed9820f4c'],
  ['https://images.unsplash.com/photo-1546872583-04e42bf6bc88', 'https://images.unsplash.com/photo-1508873696983-2dfd5898f08b', 'https://images.unsplash.com/photo-1504280390267-33d0b28416d8'],
  ['https://images.unsplash.com/photo-1559825481-912f716ed5b0', 'https://images.unsplash.com/photo-1540946485063-a40da27545f8', 'https://images.unsplash.com/photo-1580556215324-4361bdfa6767'],
  ['https://images.unsplash.com/photo-1575854655490-64350ea615ef', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5', 'https://images.unsplash.com/photo-1682687982501-1e58f81014cc'],
  ['https://images.unsplash.com/photo-1555505019-8c3f1c4ba5cc', 'https://images.unsplash.com/photo-1513622470522-26cb3c8d560f', 'https://images.unsplash.com/photo-1507567888126-7c9c0b021eb3']
];
let servicesContent = fs.readFileSync(path.join(srcDir, 'data/services.js'), 'utf8');
let k = 0;
servicesContent = servicesContent.replace(/images: \['\/images\/tour-1\.png', '\/images\/tour-2\.png', '\/images\/tour-3\.png'\]/g, () => {
  const urls = servicesIds[k++];
  return `images: ['${urls[0]}', '${urls[1]}', '${urls[2]}']`;
});
fs.writeFileSync(path.join(srcDir, 'data/services.js'), servicesContent);

console.log('All replacements completed successfully!');
