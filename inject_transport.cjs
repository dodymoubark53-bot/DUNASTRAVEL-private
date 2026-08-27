const fs = require('fs');
const file = 'd:/@@project/LUXURY-PROJECT/frontend/src/hooks/useServices.js';
let content = fs.readFileSync(file, 'utf8');

const staticTransData = `
const STATIC_TRANSPORTATION = [
  {
    "id": "bad7be22-b084-44ce-ba63-ac63ca8be068",
    "name": "VIP Airport Chauffeur & Fast Track",
    "serviceType": "AIRPORT",
    "isActive": true,
    "basePriceUsd": "120"
  },
  {
    "id": "e4603fa5-1df5-443f-b48d-2963b3bd1cd2",
    "name": "Private Intercity Executive Transfer",
    "serviceType": "CITY_TO_CITY",
    "isActive": true,
    "basePriceUsd": "250"
  },
  {
    "id": "0e3f7ff3-2994-418a-8b16-9f9da796bdf7",
    "name": "Full-Day Private Chauffeur & Luxury Vehicle",
    "serviceType": "HOTEL",
    "isActive": true,
    "basePriceUsd": "350"
  }
];
`;

if (!content.includes('STATIC_TRANSPORTATION')) {
  // Inject the constant at the top after imports
  content = content.replace('import api from \'../utils/api\';', 'import api from \'../utils/api\';\n' + staticTransData);
  
  // Replace the fetch block in category === 'transportation'
  content = content.replace(
    /items = readItems\(await api\.get\('\/transportation\/services'\), 'transportation'\)[\s\S]*?\.map\(transformTransportToService\);/,
    `try {
            items = readItems(await api.get('/transportation/services'), 'transportation')
              .map(transformTransportToService);
          } catch (err) {
            items = STATIC_TRANSPORTATION.map(transformTransportToService);
          }`
  );
  
  // Replace the promise.allSettled error handling
  content = content.replace(
    /if \(transportResult\.status === 'rejected'\) throw transportResult\.reason;\s*const transportation = readItems\(transportResult\.value, 'transportation'\)\s*\.map\(transformTransportToService\);/,
    `const transportation = transportResult.status === 'fulfilled'
            ? readItems(transportResult.value, 'transportation').map(transformTransportToService)
            : STATIC_TRANSPORTATION.map(transformTransportToService);`
  );

  fs.writeFileSync(file, content);
  console.log('Injected STATIC_TRANSPORTATION fallback');
} else {
  console.log('STATIC_TRANSPORTATION already exists');
}
