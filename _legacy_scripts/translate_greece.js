import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tours } from './src/data/tours.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');

const tour = tours.find(t => t.id === 'gr-es-001');
if (!tour) {
  console.error("Greece tour gr-es-001 not found!");
  process.exit(1);
}

// Extract all strings
const strings = new Set();
const add = (str) => {
  if (str && typeof str === 'string') {
    strings.add(str.trim());
  }
};

add(tour.title);
add(tour.subtitle);
add(tour.description);
add(tour.duration);
add(tour.type);
add(tour.departures);

// Highlights
if (tour.highlights) tour.highlights.forEach(add);

// Included
if (tour.included) tour.included.forEach(add);

// Excluded
if (tour.excluded) tour.excluded.forEach(add);

// Itinerary
if (tour.itinerary) {
  tour.itinerary.forEach(day => {
    add(day.title);
    add(day.morning);
    add(day.afternoon);
    add(day.evening);
  });
}

// Accommodation summary table destinations & regimes
if (tour.accommodation) {
  tour.accommodation.forEach(acc => {
    add(acc.destination);
    add(acc.regime);
  });
}

const stringsArray = Array.from(strings);
console.log(`Extracted ${stringsArray.length} unique strings to translate.`);

// Translation helper
async function translateText(text, targetLang, sourceLang = 'es') {
  if (!text || text.trim() === '') return '';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json[0].map(item => item[0]).join('').trim();
  } catch (err) {
    console.error(`Error translating "${text.substring(0, 20)}" to ${targetLang}: ${err.message}`);
    return text;
  }
}

async function run() {
  const targetLanguages = ['en', 'ar', 'es', 'pt', 'it'];
  const locales = {};
  
  // Load existing files
  for (const lang of targetLanguages) {
    const filePath = path.join(localesDir, `${lang}.json`);
    locales[lang] = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  
  // Translate
  for (const lang of targetLanguages) {
    console.log(`Translating for language: ${lang}`);
    if (!locales[lang].data) {
      locales[lang].data = {};
    }
    
    for (const str of stringsArray) {
      if (lang === 'es') {
        // Self-mapping
        locales[lang].data[str] = str;
      } else {
        // Check if already translated to avoid duplicate API calls
        if (!locales[lang].data[str]) {
          console.log(`  Translating: "${str.substring(0, 30)}..."`);
          const translation = await translateText(str, lang, 'es');
          locales[lang].data[str] = translation;
          await new Promise(r => setTimeout(r, 150)); // rate limiting delay
        } else {
          console.log(`  Already translated: "${str.substring(0, 30)}..."`);
        }
      }
    }
  }
  
  // Save back
  console.log('\nSaving translation files...');
  for (const lang of targetLanguages) {
    const filePath = path.join(localesDir, `${lang}.json`);
    fs.writeFileSync(filePath, JSON.stringify(locales[lang], null, 2));
    console.log(`Saved ${filePath}`);
  }
  
  console.log('\nTranslation complete!');
}

run().catch(console.error);
