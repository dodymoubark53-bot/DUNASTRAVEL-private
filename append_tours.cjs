const fs = require('fs');
const newTours = [
    {
        "id": "64a68588-5c69-41ce-8bdc-a44297ce172c",
        "slug": "mrc-01-spices-of-morocco",
        "title": "Spices of Morocco",
        "category": "Morocco",
        "basePriceUsd": "799.00",
        "duration": "05 Days / 04 Nights",
        "heroImage": null,
        "country": "Morocco",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "77f50b25-7348-4951-a5fc-d2ddf26d5703",
        "slug": "reg-29-sharm-el-sheikh",
        "title": "Sharm El Sheikh – 04 Days / 03 Nights",
        "category": "Beach & Relaxation",
        "basePriceUsd": "600.00",
        "duration": "04 Days / 03 Nights",
        "heroImage": null,
        "country": "Egypt",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "4895363b-724f-4de0-bbfb-0c6268a32898",
        "slug": "hm002-honeymoon-in-dubai-with-dinner-at-burj-al-arab",
        "title": "Honeymoon in Dubai with Dinner at Burj Al Arab",
        "category": "Honeymoon",
        "basePriceUsd": "1099.00",
        "duration": "4 Nights / 5 Days",
        "heroImage": null,
        "country": "United Arab Emirates",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "ebc6bf4d-883b-4daf-b624-86f2a09c67ed",
        "slug": "hm001-honeymoon-in-dubai",
        "title": "Honeymoon in Dubai",
        "category": "Honeymoon",
        "basePriceUsd": "750.00",
        "duration": "4 Nights / 5 Days",
        "heroImage": null,
        "country": "United Arab Emirates",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "b877b506-426d-43be-adc3-c04773eb084f",
        "slug": "reg-28-the-complete-emirates",
        "title": "The Complete Emirates",
        "category": "United Arab Emirates",
        "basePriceUsd": "799.00",
        "duration": "7 Nights / 8 Days",
        "heroImage": null,
        "country": "United Arab Emirates",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "41ea8cc0-c6c9-4038-8984-b87535f5ba4b",
        "slug": "reg-27-one-week-in-dubai",
        "title": "One Week in Dubai",
        "category": "United Arab Emirates",
        "basePriceUsd": "465.00",
        "duration": "7 Nights / 8 Days",
        "heroImage": null,
        "country": "United Arab Emirates",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "3de9e867-9846-45f3-9e79-3e15a1f47f9a",
        "slug": "reg-26-dubai-with-overnight-in-abu-dhabi",
        "title": "Dubai with Overnight in Abu Dhabi",
        "category": "United Arab Emirates",
        "basePriceUsd": "515.00",
        "duration": "5 Nights / 6 Days",
        "heroImage": null,
        "country": "United Arab Emirates",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "04fbff9e-a632-4ef7-8e75-489cdd8b1119",
        "slug": "reg-25-dubai-and-abu-dhabi",
        "title": "Dubai and Abu Dhabi",
        "category": "United Arab Emirates",
        "basePriceUsd": "409.00",
        "duration": "5 Nights / 6 Days",
        "heroImage": null,
        "country": "United Arab Emirates",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "0a91da31-676f-4f76-ace0-9da8b6d15a15",
        "slug": "reg-24-dubai-city-of-the-future",
        "title": "Dubai, City of the Future",
        "category": "United Arab Emirates",
        "basePriceUsd": "315.00",
        "duration": "4 Nights / 5 Days",
        "heroImage": null,
        "country": "United Arab Emirates",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "ba49c601-ad13-4790-9419-5e71f4c3cfec",
        "slug": "reg-23-dubai-and-its-history",
        "title": "Dubai and Its History",
        "category": "United Arab Emirates",
        "basePriceUsd": "245.00",
        "duration": "3 Nights / 4 Days",
        "heroImage": null,
        "country": "United Arab Emirates",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "4530c8d6-10b3-412e-b404-bba2a172b2dd",
        "slug": "reg-22-stop-over-dubai",
        "title": "Stop Over Dubai",
        "category": "United Arab Emirates",
        "basePriceUsd": "165.00",
        "duration": "2 Nights / 3 Days",
        "heroImage": null,
        "country": "United Arab Emirates",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "923e4e32-3c26-405f-a982-fa392eb8d601",
        "slug": "tunisia-8-days-desert-sea",
        "title": "Tunisia Tour - 8 Days / 7 Nights",
        "category": "Premium Experience",
        "basePriceUsd": "1328.00",
        "duration": "tunisia_tour_duration",
        "heroImage": "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/0b/fb/1c/caption.jpg?w=1200&h=-1&s=1",
        "country": "Tunisia",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "23266376-5193-4c4b-a6ad-91acbabb3cbf",
        "slug": "complete-egypt-8d",
        "title": "Complete Egypt",
        "category": "completoEgypt.type",
        "basePriceUsd": "2890.00",
        "duration": "8 Days / 7 Nights",
        "heroImage": "https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80",
        "country": "Egypt",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "3576a346-4c7d-4efe-a8e5-6a089a0f953e",
        "slug": "lo-mejor-de-grecia-9d",
        "title": "Lo Mejor de Grecia – 09 Días",
        "category": "City & Islands",
        "basePriceUsd": "1490.00",
        "duration": "9 Días / 8 Noches",
        "heroImage": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1920&q=80",
        "country": "Greece",
        "languages": [ "es" ]
    },
    {
        "id": "4547471b-8be7-4ba4-83c6-4abb900ff3f2",
        "slug": "tesouros-egipto-9d",
        "title": "Treasures of Egypt with Alexandria",
        "category": "Cruzeiro + Alexandria",
        "basePriceUsd": "2890.00",
        "duration": "9 Days / 8 Nights",
        "heroImage": "/imgs/Brazil/Treasures of Egypt with Alexandria.jpg",
        "country": "Egypt",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "e360ad1b-b48b-42c0-9b0d-0ba440c2697c",
        "slug": "grande-ramses-10d",
        "title": "Cairo + Cruise + Hotel in Abu Simbel",
        "category": "Cruzeiro + Abu Simbel",
        "basePriceUsd": "3390.00",
        "duration": "10 Days / 9 Nights",
        "heroImage": "/imgs/Brazil/The Great Ramses.png",
        "country": "Egypt",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "9134e779-81a0-48fb-8f9f-e6f66e0faa39",
        "slug": "cairo-cruzeiro-sharm-11d",
        "title": "Cairo with Cruise + Sharm El Sheikh",
        "category": "Cruzeiro + Mar Vermelho",
        "basePriceUsd": "3090.00",
        "duration": "11 Days / 10 Nights",
        "heroImage": "/imgs/Brazil/cairo-with-cruise-sharm-el-sheikh-detail.jpg",
        "country": "Egypt",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "789997e7-7d79-4902-bd86-57f68e123c9e",
        "slug": "egito-historico-10d",
        "title": "Historic Egypt: Cairo + Cruise + Red Sea",
        "category": "Cruzeiro + Mar Vermelho",
        "basePriceUsd": "2790.00",
        "duration": "10 Days / 9 Nights",
        "heroImage": "/imgs/Brazil/cairo-cruzeiro-mar-vermelho.jpg",
        "country": "Egypt",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "f06017ce-323b-4f38-82ab-0627cb730e8a",
        "slug": "egito-classico-ii-9d",
        "title": "Classic Egypt Programme",
        "category": "Cruzeiro + City",
        "basePriceUsd": "2490.00",
        "duration": "8 Days",
        "heroImage": "/imgs/Brazil/cairo-with-cruise-sharm-el-sheikh.jpg",
        "country": "Egypt",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "d7141501-8cf6-42d4-8ddf-3a5400b8603a",
        "slug": "egito-classico-8d",
        "title": "Classic Egypt: Cairo + Nile Cruise",
        "category": "Cruzeiro + City",
        "basePriceUsd": "2190.00",
        "duration": "8 Days / 7 Nights",
        "heroImage": "/imgs/Brazil/egito-classico-cairo-cruzeiro-no-nilo.jpg",
        "country": "Egypt",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "93aedb76-488a-4bab-8341-757cccaddef4",
        "slug": "cairo-express-alexandria-5d",
        "title": "Cairo Express with Alexandria",
        "category": "City Break",
        "basePriceUsd": "1050.00",
        "duration": "5 Days / 4 Nights",
        "heroImage": "/imgs/Brazil/Cairo Express with Alexandria.jpeg",
        "country": "Egypt",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    },
    {
        "id": "98cb34f1-ec69-4ecf-9ebc-c98d72fd66c8",
        "slug": "cairo-express-4d",
        "title": "Cairo Express",
        "category": "City Break",
        "basePriceUsd": "890.00",
        "duration": "4 Days / 3 Nights",
        "heroImage": "/imgs/Brazil/Cairo Express.jpg",
        "country": "Egypt",
        "languages": [ "ar", "en", "es", "pt", "it" ]
    }
];

const file = 'd:/@@project/LUXURY-PROJECT/frontend/src/data/tours.js';
let content = fs.readFileSync(file, 'utf8');

const targetStr = '];\n\nimport { tunisiaTours }';
const idx = content.indexOf('import { tunisiaTours }');

if (idx > -1) {
  const before = content.substring(0, idx);
  const after = content.substring(idx);
  
  // Replace the last `];` before tunisiaTours
  const lastBracketIdx = before.lastIndexOf('];');
  
  const insertion = `
  // ==========================================
  // BACKEND SEED - NEW TOURS
  // ==========================================
`;
  let newToursString = newTours.map(t => JSON.stringify(t, null, 2)).join(',\n  ');
  
  const newBefore = before.substring(0, lastBracketIdx) + `,${insertion}  ${newToursString}\n];\n\n`;
  
  fs.writeFileSync(file, newBefore + after);
  console.log('Tours added successfully.');
} else {
  console.log('Could not find injection point');
}
