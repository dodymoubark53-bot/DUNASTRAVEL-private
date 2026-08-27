const fs = require('fs');

const file = 'd:/@@project/LUXURY-PROJECT/frontend/src/pages/services/ServiceDetails.jsx';
let content = fs.readFileSync(file, 'utf8');

// Insert safe derived variables
const targetAnchor = '  const [activeForm, setActiveForm] = useState(null);\n';
const safeVariables = `  const [activeForm, setActiveForm] = useState(null);

  const serviceOverview = Array.isArray(service?.overview) && service.overview.length > 0
    ? service.overview
    : typeof service?.overview === 'string' && service.overview
      ? [service.overview]
      : typeof service?.shortDesc === 'string' && service.shortDesc
        ? [service.shortDesc]
        : ['Experience the pinnacle of luxury with our signature bespoke travel service.'];

  const serviceHighlights = Array.isArray(service?.highlights) && service.highlights.length > 0
    ? service.highlights
    : ['Luxury Experience', 'Premium Service', 'Dedicated Support'];

  const serviceIncluded = Array.isArray(service?.included) && service.included.length > 0
    ? service.included
    : ['Premium VIP Service', 'Professional Coordination', 'Full Customer Support'];

  const serviceExcluded = Array.isArray(service?.excluded) && service.excluded.length > 0
    ? service.excluded
    : ['Personal Expenses', 'Optional Extras'];

  const serviceImages = Array.isArray(service?.images) && service.images.length > 0
    ? service.images
    : [service?.image || service?.heroImage || '/imgs/services/transportation-cover.webp'];

  const serviceRating = typeof service?.rating === 'number' && !isNaN(service.rating) ? service.rating : 5;
`;

content = content.replace(targetAnchor, safeVariables);

// Replace occurrences of raw unsafe properties
content = content.replace(/service\.overview\.map\(/g, 'serviceOverview.map(');
content = content.replace(/service\.highlights\.map\(/g, 'serviceHighlights.map(');
content = content.replace(/service\.included\.map\(/g, 'serviceIncluded.map(');
content = content.replace(/service\.excluded\.map\(/g, 'serviceExcluded.map(');
content = content.replace(/service\.images\.map\(/g, 'serviceImages.map(');
content = content.replace(/service\.images\[0\]/g, 'serviceImages[0]');
content = content.replace(/Math\.floor\(service\.rating\)/g, 'Math.floor(serviceRating)');
content = content.replace(/\{service\.rating\}/g, '{serviceRating}');
content = content.replace(/relService\.images\[0\]/g, "(relService.images?.[0] || relService.image || '/imgs/services/transportation-cover.webp')");

fs.writeFileSync(file, content);
console.log('Harden ServiceDetails.jsx successfully');
