const fs = require('fs');
const path = './src/i18n/locales/';

const oldPrefix = 'completoEgypt.';
const newPrefix = 'data.completoEgypt.';

const langs = ['en', 'ar', 'es', 'it', 'pt'];

// Read old keys to map them
const oldKeys = {};
langs.forEach(lang => {
  const filePath = path + lang + '.json';
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  oldKeys[lang] = {};
  Object.keys(data).forEach(k => {
    if (k.startsWith(oldPrefix)) {
      oldKeys[lang][k] = data[k];
      delete data[k];
    }
  });
  // Add with data. prefix
  Object.keys(oldKeys[lang]).forEach(k => {
    const newKey = newPrefix + k.slice(oldPrefix.length);
    data[newKey] = oldKeys[lang][k];
  });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(lang + ': fixed, moved ' + Object.keys(oldKeys[lang]).length + ' keys');
});
