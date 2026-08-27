const fs = require('fs');
const path = require('path');

['ar', 'es', 'it', 'pt'].forEach(l => {
  const j = JSON.parse(fs.readFileSync(
    path.join('D:\\eslam m h\\programming\\my projects\\DUNAS TRAVEL\\src\\i18n\\locales', l + '.json'),
    'utf-8'
  ));
  const keys = Object.keys(j);
  
  // Check specific keys
  const headingKey = 'blogs.## What is Included in This Journey';
  const introKey = keys.find(k => k.includes('Few places on earth capture the imagination'));
  const includedKey = keys.find(k => k.includes('"Cairo Express" package is designed'));
  const closingKey = keys.find(k => k.includes('Are you ready to witness') && k.includes('Cairo Express'));
  
  console.log(l + ':');
  console.log('  heading: ' + (j[headingKey] || 'MISSING').substring(0, 60));
  if (introKey) console.log('  intro (sample): ' + (j[introKey] || 'MISSING').substring(0, 60));
  if (includedKey) console.log('  what\'s included (sample): ' + (j[includedKey] || 'MISSING').substring(0, 60));
  if (closingKey) console.log('  closing (sample): ' + (j[closingKey] || 'MISSING').substring(0, 60));
});

// Count remaining untranslated
const ar = JSON.parse(fs.readFileSync('D:\\eslam m h\\programming\\my projects\\DUNAS TRAVEL\\src\\i18n\\locales\\ar.json', 'utf-8'));
const blogData = fs.readFileSync('D:\\eslam m h\\programming\\my projects\\DUNAS TRAVEL\\src\\data\\blogs.js', 'utf-8');
const contentRegex = /"content":\s*\[([\s\S]*?)\]/g;
const allContent = [];
let match;
while ((match = contentRegex.exec(blogData)) !== null) {
  const paraRegex = /"((?:[^"\\]|\\.)*)"/g;
  let pm;
  while ((pm = paraRegex.exec(match[1])) !== null) {
    const text = pm[1];
    if (text.length > 50 && !text.startsWith('http') && !text.startsWith('/imgs')) {
      allContent.push(text);
    }
  }
}
const uniqueContent = [...new Set(allContent)];
let remaining = 0;
uniqueContent.forEach(text => {
  const prefixedKey = 'blogs.' + text;
  if (!ar[prefixedKey]) remaining++;
});
console.log('\nRemaining untranslated in ar.json: ' + remaining + '/' + uniqueContent.length);
