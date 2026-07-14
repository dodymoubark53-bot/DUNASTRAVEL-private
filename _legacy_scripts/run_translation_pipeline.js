import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { tours } from './src/data/tours.js';
import { services } from './src/data/services.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.join(__dirname, 'src', 'i18n', 'locales');

// Load missing static keys
const missingKeys = JSON.parse(fs.readFileSync(path.join(__dirname, 'missing_keys.json'), 'utf8'));

// Load extracted tour strings
const tourStrings = JSON.parse(fs.readFileSync(path.join(__dirname, 'extracted_strings.json'), 'utf8'));

// Build mapping of tour string -> source language ('pt' or 'it' or 'en' or 'es')
const tourStringLangs = {};
tours.forEach(tour => {
  const lang = tour.language === 'pt-BR' ? 'pt' : 'it';
  const addString = (str) => {
    if (str && typeof str === 'string') {
      tourStringLangs[str] = lang;
    }
  };
  addString(tour.title);
  addString(tour.overview);
  addString(tour.duration);
  addString(tour.type);
  addString(tour.departures);
  if (tour.highlights) tour.highlights.forEach(addString);
  if (tour.included) tour.included.forEach(addString);
  if (tour.excluded) tour.excluded.forEach(addString);
  if (tour.itinerary) {
    tour.itinerary.forEach(day => {
      addString(day.title);
      addString(day.morning);
      addString(day.afternoon);
      addString(day.evening);
    });
  }
});

services.forEach(service => {
  const lang = 'en';
  const addString = (str) => {
    if (str && typeof str === 'string') {
      tourStringLangs[str] = lang;
    }
  };
  addString(service.title);
  addString(service.shortDesc);
  addString(service.location);
  if (service.overview) service.overview.forEach(addString);
  if (service.highlights) service.highlights.forEach(addString);
  if (service.included) service.included.forEach(addString);
  if (service.excluded) service.excluded.forEach(addString);
  if (service.accommodations) {
    service.accommodations.forEach(acc => {
      addString(acc.destination);
      addString(acc.regime);
    });
  }
  if (service.itinerary) {
    service.itinerary.forEach(day => {
      addString(day.title);
      addString(day.morning);
      addString(day.afternoon);
      addString(day.evening);
    });
  }
});

// Load existing locales
const locales = {
  en: JSON.parse(fs.readFileSync(path.join(localesDir, 'en.json'), 'utf8')),
  ar: JSON.parse(fs.readFileSync(path.join(localesDir, 'ar.json'), 'utf8')),
  es: JSON.parse(fs.readFileSync(path.join(localesDir, 'es.json'), 'utf8')),
  pt: JSON.parse(fs.readFileSync(path.join(localesDir, 'pt.json'), 'utf8')),
  it: JSON.parse(fs.readFileSync(path.join(localesDir, 'it.json'), 'utf8'))
};

// Helper to check if nested key exists
function hasKeyPath(obj, pathStr) {
  const parts = pathStr.split('.');
  let current = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return false;
    }
    if (!(part in current)) {
      return false;
    }
    current = current[part];
  }
  return true;
}

// Helper to set nested key
function setNestedKey(obj, pathStr, value) {
  const parts = pathStr.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

// Translation helpers
async function translateText(text, targetLang, sourceLang = 'auto') {
  if (!text || text.trim() === '') return '';
  // Clean text and encode
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json[0].map(item => item[0]).join('').trim();
  } catch (err) {
    console.error(`Error translating "${text.substring(0, 20)}": ${err.message}`);
    return text; // fallback to original
  }
}

async function translateBatch(texts, targetLang, sourceLang = 'auto') {
  if (texts.length === 0) return [];
  if (texts.length === 1) {
    const res = await translateText(texts[0], targetLang, sourceLang);
    return [res];
  }
  
  const cleanTexts = texts.map(t => t.trim().replace(/\n/g, ' '));
  const textPayload = cleanTexts.join('\n');
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(textPayload)}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const translatedText = json[0].map(item => item[0]).join('');
    const translatedLines = translatedText.split('\n').map(l => l.trim());
    
    if (translatedLines.length === texts.length) {
      return translatedLines;
    } else {
      console.warn(`Batch size mismatch for ${targetLang}: expected ${texts.length}, got ${translatedLines.length}. Translating individually.`);
      const results = [];
      for (const t of texts) {
        results.push(await translateText(t, targetLang, sourceLang));
        await new Promise(r => setTimeout(r, 150));
      }
      return results;
    }
  } catch (err) {
    console.error(`Batch translation failed: ${err.message}. Translating individually.`);
    const results = [];
    for (const t of texts) {
      results.push(await translateText(t, targetLang, sourceLang));
      await new Promise(r => setTimeout(r, 150));
    }
    return results;
  }
}

// Translate and merge missing static keys
async function processStaticKeys() {
  console.log('--- Processing Static Keys ---');
  const targetLanguages = ['en', 'ar', 'es', 'pt', 'it'];
  
  for (const lang of targetLanguages) {
    console.log(`Checking missing static keys for language: ${lang}`);
    const missingForLang = [];
    
    for (const [key, defaultVal] of Object.entries(missingKeys)) {
      if (!hasKeyPath(locales[lang], key)) {
        missingForLang.push({ key, defaultVal });
      }
    }
    
    console.log(`Found ${missingForLang.length} keys to translate for ${lang}`);
    if (missingForLang.length === 0) continue;
    
    // Group into batches of 30
    const batchSize = 30;
    for (let i = 0; i < missingForLang.length; i += batchSize) {
      const chunk = missingForLang.slice(i, i + batchSize);
      const textsToTranslate = chunk.map(c => c.defaultVal);
      
      console.log(`  Translating static batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(missingForLang.length/batchSize)} (${chunk.length} keys)`);
      const translations = await translateBatch(textsToTranslate, lang, 'auto');
      
      for (let j = 0; j < chunk.length; j++) {
        const key = chunk[j].key;
        const transVal = translations[j] || chunk[j].defaultVal;
        setNestedKey(locales[lang], key, transVal);
      }
      
      await new Promise(r => setTimeout(r, 500)); // Rate limit buffer
    }
  }
}

// Translate and merge tour strings into data section
async function processTourStrings() {
  console.log('\n--- Processing Tour Strings ---');
  const targetLanguages = ['en', 'ar', 'es', 'pt', 'it'];
  
  // Group tour strings by source language (pt or it or en or es)
  const stringsBySrc = {
    pt: [],
    it: [],
    en: [],
    es: []
  };
  
  tourStrings.forEach(str => {
    const srcLang = tourStringLangs[str] || 'pt';
    if (!stringsBySrc[srcLang]) stringsBySrc[srcLang] = [];
    stringsBySrc[srcLang].push(str);
  });
  
  console.log(`Tour strings group size: PT: ${stringsBySrc.pt.length}, IT: ${stringsBySrc.it.length}, EN: ${stringsBySrc.en.length}, ES: ${stringsBySrc.es.length}`);
  
  for (const lang of targetLanguages) {
    console.log(`Processing tour strings for language: ${lang}`);
    
    if (!locales[lang].data) {
      locales[lang].data = {};
    }
    
    for (const srcLang of ['pt', 'it', 'en', 'es']) {
      const strings = stringsBySrc[srcLang];
      const stringsToTranslate = [];
      
      // Filter out strings that are already in the target language (no need to translate pt -> pt)
      // and strings that are already translated in the JSON file
      strings.forEach(str => {
        if (srcLang === lang) {
          locales[lang].data[str] = str; // Map directly
        } else if (!locales[lang].data[str]) {
          stringsToTranslate.push(str);
        }
      });
      
      console.log(`  Source language: ${srcLang} -> ${lang}. Need to translate: ${stringsToTranslate.length}/${strings.length}`);
      if (stringsToTranslate.length === 0) continue;
      
      // Batch translate in chunks of 30
      const batchSize = 30;
      for (let i = 0; i < stringsToTranslate.length; i += batchSize) {
        const chunk = stringsToTranslate.slice(i, i + batchSize);
        console.log(`    Translating tours batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(stringsToTranslate.length/batchSize)} (${chunk.length} strings)`);
        
        const translations = await translateBatch(chunk, lang, srcLang);
        
        for (let j = 0; j < chunk.length; j++) {
          const original = chunk[j];
          const translation = translations[j] || original;
          locales[lang].data[original] = translation;
        }
        
        await new Promise(r => setTimeout(r, 500)); // Rate limit buffer
      }
    }
  }
}

// Clean duplicate or incorrect data entries and ensure blogs are correctly mapped to blogs namespace
function processBlogRedirects() {
  console.log('\n--- Normalizing Blog Namespaces ---');
  // Copy blog translations from "data" to "blogs" namespace in locales so that
  // t('blogs.Title') or t('blogs.Paragraph') resolves correctly
  const targetLanguages = ['en', 'ar', 'es', 'pt', 'it'];
  
  for (const lang of targetLanguages) {
    if (!locales[lang].blogs) {
      locales[lang].blogs = {};
    }
    
    // Copy any translations that reside in "data" which are blog strings
    const blogDataKeys = [
      "The Hidden Temples of Luxor", "History", "Amir Hassan",
      "Beyond Karnak and the Valley of the Kings lie incredible, lesser-known temples waiting to be explored. Discover the secrets of ancient Thebes without the crowds.",
      "Luxor, often described as the world's greatest open-air museum, is undeniably famous for the colossal Karnak Temple and the pharaohs' tombs in the Valley of the Kings. However, for the discerning traveler, the true magic of this ancient city lies off the beaten path, hidden amongst the sugar cane fields and lesser-visited desert valleys. These secondary temples offer a profound, uncrowded connection to Egypt's majestic past.",
      "One such marvel is the Temple of Medinet Habu. Second only to Karnak in size, this magnificent mortuary temple of Ramses III is remarkably well-preserved. Its deeply carved hieroglyphs retain much of their original vibrant coloring, providing a vivid glimpse into ancient artistry. The towering pylons and massive courtyards are often devoid of the large tour groups, allowing visitors to wander in serene contemplation.",
      "Further off the traditional tourist trail lies the Ramesseum, the memorial temple of Ramses II. While partially ruined, the sheer scale of the fallen colossal statue of the pharaoh—which inspired Percy Bysshe Shelley's famous poem 'Ozymandias'—is awe-inspiring. The romantic melancholy of these ruins, set against the backdrop of the Theban hills, makes it an essential stop for history enthusiasts and photographers alike.",
      "Finally, the Temple of Seti I at Gurna offers an intimate look at exquisite bas-reliefs and refined artistic techniques. Though smaller than its counterparts, its delicate carvings and peaceful atmosphere offer a stark contrast to the overwhelming grandeur of Karnak. Exploring these hidden gems of Luxor provides a richer, more nuanced understanding of ancient Egyptian civilization, far removed from the bustling crowds.",
      
      "Petra by Night", "Travel Guide", "Sarah Jenkins",
      "Experiencing the rose-red city illuminated by thousands of candles is a bucket-list event. Here is everything you need to know to plan your magical evening.",
      "There are few travel experiences as universally acclaimed yet deeply moving as Petra by Night. Operating only three times a week—Mondays, Wednesdays, and Thursdays—this after-dark excursion transforms the already mystical ancient Nabatean city into a scene straight out of a desert fairy tale. The journey begins at the visitor center, but the true magic starts as you step into the Siq.",
      "The Siq, a narrow 1.2-kilometer gorge flanked by towering 80-meter-high sandstone cliffs, is lit only by the soft, flickering glow of paper lanterns lining the path. Walking through this winding canyon in near silence, accompanied only by the whisper of the wind and the crunch of gravel beneath your feet, builds an incredible sense of anticipation. It is a meditative walk that prepares you for the grand reveal.",
      "As you reach the end of the Siq, the narrow slit in the rocks suddenly opens to reveal The Treasury (Al-Khazneh), illuminated by over 1,500 candles spread across the sandy floor. The sight is nothing short of breathtaking. Visitors are invited to sit on rugs scattered across the ground, served traditional sweet Bedouin tea, and treated to a hauntingly beautiful performance of traditional music played on the Rababa (a stringed instrument) and the Ney (a wooden flute).",
      "To make the most of this experience, arrive early to secure a good spot, and remember to respect the silence of the canyon. Photography can be challenging in the extreme low light; bring a tripod if you wish to capture the scene, but also remember to put the camera down and simply absorb the atmosphere. Petra by Night is not just a visual spectacle; it is a spiritual journey back in time.",
      
      "Istanbul's Grand Bazaar", "Culture & Shopping", "Leyla Yilmaz",
      "Navigate the labyrinthine alleys of one of the world's oldest and largest covered markets. From Turkish delight to antique kilims, here is your ultimate shopping guide.",
      "The Grand Bazaar (Kapalıçarşı) in Istanbul is not merely a market; it is a chaotic, colorful, and sensory labyrinth that has pulsed as the commercial heart of the city for over half a millennium. Spanning 61 covered streets and housing over 4,000 shops, it is one of the largest and oldest covered markets in the world. Stepping through its grand archways is like stepping into an Ottoman era time capsule.",
      "Navigating the bazaar can feel overwhelming to the uninitiated. The key is to embrace the art of getting lost. The market is organized by trade—one alley shimmers with gold jewelry, another is draped in vibrant textiles and carpets, while others are filled with the rich aromas of leather goods or the clinking of hand-painted ceramics. Allow your senses to guide you, and do not be afraid to wander off the main thoroughfares into the quieter, more specialized courtyards (han).",
      "Shopping here is as much about the social interaction as it is about the transaction. Haggling is expected and should be approached with a smile and a sense of humor. When a shopkeeper invites you in for a glass of apple tea (elma çayı), accept it! This hospitality is a cornerstone of Turkish commerce. Sit, sip, chat about your travels, and then begin the friendly negotiation. It is a dance that locals have perfected over centuries.",
      "When looking for authentic souvenirs, seek out high-quality Turkish towels (peshtemals), intricate Iznik ceramics, or a genuine hand-woven kilim rug. Be wary of cheap imports and always ask the vendor about the origin and craftsmanship of their wares. Whether you leave with an antique brass lantern or simply a bag of freshly dusted Turkish delight, the true treasure of the Grand Bazaar is the unforgettable experience of the marketplace itself.",
      
      "Sailing the Nile", "Adventure", "Omar Tariq",
      "Step away from the massive cruise ships and experience the lifeblood of Egypt on a traditional wooden felucca. A peaceful, authentic journey awaits.",
      "While multi-story luxury cruise ships offer undeniable comfort, there is no more authentic or peaceful way to experience the Nile River than aboard a traditional felucca. These simple, wooden sailing boats, distinguished by their lateen (triangular) sails, have navigated the waters of the Nile since the time of the pharaohs. A felucca trip strips away the noise and haste of modern travel, replacing it with the gentle lap of water and the whispering of the wind.",
      "A felucca relies entirely on the wind and the river's current, meaning the journey dictates its own pace. You will recline on soft cushions laid across the deck, shielded from the Egyptian sun by a canvas canopy. As you drift silently past lush riverbanks, local fishermen casting their nets, and the timeless silhouettes of mud-brick villages, you gain a perspective of rural Egyptian life that is impossible to see from the deck of a large ship.",
      "Most travelers opt for a short sunset sail in Aswan or Luxor, which is a magical experience as the sky turns brilliant shades of gold and crimson. However, for the truly adventurous, multi-day felucca journeys are available. These trips involve sleeping on the deck under a blanket of stars and eating simple, delicious meals prepared by your Nubian crew over a small stove. It is a rustic experience, but one that offers unparalleled serenity.",
      "When booking a felucca, especially for overnight trips, ensure you go through a reputable DUNAS TRAVEL concierge to guarantee a well-maintained boat and a highly experienced captain. While you forfeit air conditioning and private bathrooms, the reward is an intimate, eco-friendly, and profoundly peaceful immersion into the very soul of Egypt.",
      
      "Wadi Rum Desert", "Nature & Camping", "David Chen",
      "Towering sandstone mountains, crimson sands, and a sky exploding with stars. Discover why camping in Jordan's Valley of the Moon is the ultimate desert escape.",
      "Wadi Rum, known as the Valley of the Moon, is a landscape of such alien beauty that it has served as the backdrop for countless science fiction films. Located in southern Jordan, this vast expanse of crimson sand and towering, monolith-like sandstone mountains offers one of the most spectacular desert environments on earth. However, a daytime jeep tour only scratches the surface; to truly understand Wadi Rum, you must spend the night.",
      "Luxury glamping has transformed the Wadi Rum experience. You no longer need to sacrifice comfort to immerse yourself in the wilderness. High-end camps offer geodesic dome tents—often referred to as 'Martian Domes'—featuring transparent panoramic panels. From the comfort of a king-sized bed adorned with premium linens, you can watch the sun set the desert ablaze in reds and purples before giving way to the darkest, most star-filled sky you will ever witness.",
      "The evening experience in a Bedouin camp is rich with culture. Traditional Zarb—a meal of meat and vegetables slow-cooked in an underground sand oven—is unearthed and served communally. Following dinner, guests gather around a crackling campfire, sipping sweet sage tea, listening to ancient Bedouin folklore, and staring up at the Milky Way. The silence of the desert at night is profound, offering a rare and deep sense of isolation and peace.",
      "Mornings in Wadi Rum are equally majestic. Waking up early to take a silent camel ride into the desert as the sun rises, casting long, dramatic shadows across the canyons, is an unforgettable experience. Whether you spend your days hiking through narrow gorges, scrambling up rock bridges, or simply meditating in the vast emptiness, camping in Wadi Rum connects you to nature in its most raw and beautiful form.",
      
      "Turkish Cuisine", "Food & Drink", "Aisha Demir",
      "Turkish food is a rich fusion of Central Asian, Middle Eastern, and Mediterranean flavors. Here are the iconic dishes you absolutely must taste during your visit.",
      "Turkish cuisine is a magnificent tapestry woven from the historical influences of the Ottoman Empire, bridging Central Asian traditions with Mediterranean and Middle Eastern flavors. It is a culinary culture that reveres fresh ingredients, masterful spicing, and the joy of communal dining. A journey to Turkey is as much an exploration of taste as it is of history, and missing out on its authentic dishes is missing out on the country's soul.",
      "The day inevitably begins with the legendary Turkish Breakfast (Kahvaltı). This is not merely a meal, but a lavish morning ritual. A traditional kahvaltı spread covers the entire table with small plates: a variety of cheeses (like salty feta and mild kashkaval), black and green olives, fresh tomatoes, cucumbers, thick clotted cream (kaymak) drenched in local honey, spicy sujuk (sausage), and endless glasses of black tea, all accompanied by freshly baked simit—a sesame-encrusted bread ring.",
      "When it comes to main courses, the kebab reigns supreme, but the variety goes far beyond the familiar döner. The Adana Kebab, named after the southern city, is a masterpiece of spicy minced lamb grilled on a wide skewer over charcoal. For something richer, the İskender Kebab from Bursa features thin slices of grilled lamb basted with hot tomato sauce over pieces of pita bread, generously slathered with melted sheep's milk butter and served with yogurt."
    ];
    
    blogDataKeys.forEach(k => {
      if (locales[lang].data && locales[lang].data[k]) {
        locales[lang].blogs[k] = locales[lang].data[k];
      }
    });
    
    // Also copy standard blog dates and read times if they are in "data" or just translate them
    const blogDates = [
      "Oct 12, 2023", "Nov 05, 2023", "Dec 18, 2023", "Jan 22, 2024", "Feb 14, 2024", "Mar 08, 2024",
      "6 min read", "5 min read", "7 min read", "8 min read"
    ];
    
    // Explicitly add translations for dates/read times to "blogs" namespace in locales
    // If not found in data, translate from auto
    for (const d of blogDates) {
      if (locales[lang].data && locales[lang].data[d]) {
        locales[lang].blogs[d] = locales[lang].data[d];
      } else {
        // We will write values in the final JSON directly
      }
    }
  }
}

// Explicitly add missing date translations to blogs section
async function addBlogDates() {
  console.log('\n--- Adding Blog Dates & Read Times to blogs section ---');
  const targetLanguages = ['en', 'ar', 'es', 'pt', 'it'];
  
  const datesAndTimes = [
    { key: "Oct 12, 2023", defaultVal: "Oct 12, 2023" },
    { key: "Nov 05, 2023", defaultVal: "Nov 05, 2023" },
    { key: "Dec 18, 2023", defaultVal: "Dec 18, 2023" },
    { key: "Jan 22, 2024", defaultVal: "Jan 22, 2024" },
    { key: "Feb 14, 2024", defaultVal: "Feb 14, 2024" },
    { key: "Mar 08, 2024", defaultVal: "Mar 08, 2024" },
    { key: "6 min read", defaultVal: "6 min read" },
    { key: "5 min read", defaultVal: "5 min read" },
    { key: "7 min read", defaultVal: "7 min read" },
    { key: "8 min read", defaultVal: "8 min read" }
  ];
  
  for (const lang of targetLanguages) {
    for (const item of datesAndTimes) {
      if (!locales[lang].blogs[item.key]) {
        if (lang === 'en') {
          locales[lang].blogs[item.key] = item.defaultVal;
        } else {
          console.log(`  Translating "${item.key}" to ${lang}`);
          const trans = await translateText(item.defaultVal, lang, 'en');
          locales[lang].blogs[item.key] = trans;
          await new Promise(r => setTimeout(r, 200));
        }
      }
    }
  }
}

// Save all locale files back
function saveLocales() {
  console.log('\n--- Saving Localized JSON Files ---');
  for (const [lang, data] of Object.entries(locales)) {
    const filePath = path.join(localesDir, `${lang}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Saved ${filePath} (${fs.statSync(filePath).size} bytes)`);
  }
}

// Main execution block
async function run() {
  try {
    await processStaticKeys();
    await processTourStrings();
    processBlogRedirects();
    await addBlogDates();
    saveLocales();
    console.log('\nTranslation pipeline completed successfully!');
  } catch (err) {
    console.error('Pipeline failed:', err);
  }
}

run();
