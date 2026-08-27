const fs = require('fs');
const file = 'd:/@@project/LUXURY-PROJECT/frontend/src/hooks/useServices.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /location: String\(service\.serviceType\)\.replaceAll\('_', ' '\),\s*images: \[\],\s*image: null,/,
  `location: String(service.serviceType).replaceAll('_', ' '),
    images: service.heroImage ? [service.heroImage] : ['/imgs/services/transportation-cover.webp'],
    image: service.heroImage || '/imgs/services/transportation-cover.webp',`
);

fs.writeFileSync(file, content);
console.log('Fixed transport image fallback.');
