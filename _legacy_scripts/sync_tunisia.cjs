const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'src', 'pages', 'destinations', 'tunisia-tour-data.json');
const localesPath = path.join(__dirname, 'src', 'i18n', 'locales');

const rawData = fs.readFileSync(dataPath, 'utf8');
const tourData = JSON.parse(rawData);

const translations = tourData.translations;
const languages = ['ar', 'en', 'es', 'it', 'pt'];

const baseSlug = 'tunisia-tour-8d-7n';

// The JS tour object to generate
let jsTourObject = {
  id: "tn-all-001",
  slug: baseSlug,
  language: "multi", // Special flag or we can duplicate for markets, but let's just make one tour and handle language dynamically if needed.
  // Wait, tours.js is usually split by language. But the system has react-i18next so we can just have ONE tour object and translate everything!
  // In `tours.js` some tours are duplicated per market, but we can just add one universal tour.
  market: "Global",
  type: "Premium Experience",
  duration: "tunisia_tour_duration", // 8 Days / 7 Nights
  destination: "tunisia",
  title: "tunisia_tour_title",
  subtitle: "tunisia_tour_subtitle",
  overview: "tunisia_tour_overview",
  departures: "tunisia_tour_departures", // Let's set a default or add translation
  price: 968, // Starting price from maxPax category
  rating: 4.9,
  reviewCount: 124,
  images: [
    "/IMGS/Tunisia/01.jpg", // We will use placeholder image paths
    "/IMGS/Tunisia/02.jpg",
    "/IMGS/Tunisia/03.jpg"
  ],
  highlights: [],
  included: [],
  excluded: [],
  excursions: [],
  hotels: { "tunisia_tour_hotels_title": [] },
  hotelCategory: "4* & 5*",
  itinerary: [],
  pricingTiers: tourData.pricing.categories,
  optionalExcursionsPricing: tourData.optionalExcursionsPricing
};

languages.forEach(lang => {
  const filePath = path.join(localesPath, `${lang}.json`);
  let localeObj = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!localeObj.data) localeObj.data = {};
  
  const tl = translations[lang];

  localeObj.data['tunisia_tour_title'] = tl.title;
  localeObj.data['tunisia_tour_subtitle'] = tl.subtitle;
  localeObj.data['tunisia_tour_overviewTitle'] = tl.overviewTitle;
  localeObj.data['tunisia_tour_highlightsTitle'] = tl.highlightsTitle;
  localeObj.data['tunisia_tour_overview'] = tl.overview;
  localeObj.data['tunisia_tour_itineraryTitle'] = tl.itineraryTitle;
  localeObj.data['tunisia_tour_duration'] = lang === 'en' ? '8 Days / 7 Nights' : lang === 'ar' ? '8 أيام / 7 ليالي' : lang === 'es' ? '8 Días / 7 Noches' : lang === 'it' ? '8 Giorni / 7 Notti' : '8 Dias / 7 Noites';
  localeObj.data['tunisia_tour_departures'] = lang === 'en' ? 'Daily' : lang === 'ar' ? 'يومياً' : lang === 'es' ? 'Diario' : lang === 'it' ? 'Giornaliero' : 'Diário';

  // Arrays
  tl.highlights.forEach((h, i) => {
    const key = `tunisia_tour_highlight_${i}`;
    localeObj.data[key] = h;
    if (lang === 'en') jsTourObject.highlights.push(key);
  });

  tl.itinerary.forEach((day, i) => {
    const titleKey = `tunisia_tour_day${day.day}_title`;
    const descKey = `tunisia_tour_day${day.day}_desc`;
    const mealsKey = `tunisia_tour_day${day.day}_meals`;
    
    localeObj.data[titleKey] = day.title;
    localeObj.data[descKey] = day.description;
    localeObj.data[mealsKey] = day.meals;

    if (lang === 'en') {
      jsTourObject.itinerary.push({
        day: day.day,
        title: titleKey,
        description: descKey,
        meals: mealsKey
      });
    }
  });

  tl.hotels.list.forEach((h, i) => {
    const key = `tunisia_tour_hotel_${i}`;
    localeObj.data[key] = h;
    if (lang === 'en') jsTourObject.hotels["tunisia_tour_hotels_title"].push(key);
  });
  localeObj.data['tunisia_tour_hotels_title'] = tl.hotels.title;

  tl.inclusions.items.forEach((inc, i) => {
    const key = `tunisia_tour_inclusion_${i}`;
    localeObj.data[key] = inc;
    if (lang === 'en') jsTourObject.included.push(key);
  });
  localeObj.data['tunisia_tour_inclusions_title'] = tl.inclusions.title;

  tl.exclusions.items.forEach((exc, i) => {
    const key = `tunisia_tour_exclusion_${i}`;
    localeObj.data[key] = exc;
    if (lang === 'en') jsTourObject.excluded.push(key);
  });
  localeObj.data['tunisia_tour_exclusions_title'] = tl.exclusions.title;

  tl.excursions.items.forEach((exc, i) => {
    const key = `tunisia_tour_excursion_${i}`;
    localeObj.data[key] = exc;
    if (lang === 'en') jsTourObject.excursions.push(key);
  });
  localeObj.data['tunisia_tour_excursions_title'] = tl.excursions.title;

  fs.writeFileSync(filePath, JSON.stringify(localeObj, null, 2), 'utf8');
});

// Output the jsTourObject string to append to tours.js
fs.writeFileSync('tunisia_tour_object_dump.json', JSON.stringify(jsTourObject, null, 2), 'utf8');

console.log('Successfully synced Tunisia tour data to i18n locales.');
