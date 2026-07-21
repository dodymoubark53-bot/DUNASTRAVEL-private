const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'i18n', 'locales', 'en.json');
const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const keys = Object.keys(content);

const keywords = ['cancel', 'visa', 'payment', 'book', 'contact', 'about', 'phone', 'email', 'policy'];
const matches = {};

keywords.forEach(kw => {
  matches[kw] = keys.filter(k => k.toLowerCase().includes(kw)).slice(0, 10);
});

console.log('Matches:', JSON.stringify(matches, null, 2));
