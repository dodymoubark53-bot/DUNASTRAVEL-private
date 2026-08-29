import fs from 'fs';
import path from 'path';

const locales = ['ar', 'en', 'es', 'pt', 'it'];
const legacyI18nDir = 'D:/@@project/LUXURY-PROJECT/DUNASTRAVEL-private-main/src/i18n/locales';
const newI18nDir = 'D:/@@project/LUXURY-PROJECT/frontend/src/i18n/locales';

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const k in obj) {
    const full = prefix ? prefix + '.' + k : k;
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(getAllKeys(obj[k], full));
    } else {
      keys.push(full);
    }
  }
  return keys;
}

for (const loc of locales) {
  const legPath = path.join(legacyI18nDir, loc + '.json');
  const newPath = path.join(newI18nDir, loc + '.json');
  const legData = fs.existsSync(legPath) ? JSON.parse(fs.readFileSync(legPath, 'utf8')) : {};
  const newData = fs.existsSync(newPath) ? JSON.parse(fs.readFileSync(newPath, 'utf8')) : {};

  const legKeys = getAllKeys(legData);
  const newKeys = getAllKeys(newData);

  const missingInNew = legKeys.filter(k => !newKeys.includes(k));
  console.log(`[Locale: ${loc}] Legacy keys: ${legKeys.length}, New keys: ${newKeys.length}, Missing in New: ${missingInNew.length}`);
  if (missingInNew.length > 0) {
    console.log('   Sample missing keys (first 10):', missingInNew.slice(0, 10));
  }
}
