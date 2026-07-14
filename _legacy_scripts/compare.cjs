const fs = require('fs');
const strings = JSON.parse(fs.readFileSync('./_extracted_strings.json','utf8'));
const locales = ['ar','en','es','pt','it'];

// Load each locale's data section
const data = {};
locales.forEach(l => {
  const j = require('./src/i18n/locales/'+l+'.json');
  data[l] = j.data || {};
});

// i18next lookup: t('data.'+value) -> looks up data[value] but the value may contain dots/escapes
// Important: i18next treats '.' as key separator. So if the Spanish value contains a '.', the lookup fails!
// Let's check how many strings contain dots or special chars
const withDots = strings.filter(s => s.includes('.'));
const withSpecialStart = strings.filter(s => /^[—\-_@:]/.test(s));
console.log('Strings containing a DOT (.) :', withDots.length);
console.log('Strings starting with special char:', withSpecialStart.length);
if (withDots.length) {
  console.log('\n--- Examples of strings with dots (these BREAK the t() lookup) ---');
  withDots.slice(0,15).forEach(s => console.log('  •', JSON.stringify(s)));
}

// For each locale, count missing
console.log('\n=== Missing strings per locale (key exists in data section) ===');
locales.forEach(l => {
  const d = data[l];
  let present = 0, missing = [];
  strings.forEach(s => {
    if (d[s] !== undefined) present++;
    else missing.push(s);
  });
  console.log(l.toUpperCase()+': present='+present+'/'+strings.length+', missing='+missing.length);
});

// Show missing for AR specifically (the problem locale)
console.log('\n=== Missing in AR (first 25) ===');
const arMissing = strings.filter(s => data.ar[s] === undefined);
arMissing.slice(0,25).forEach(s => console.log('  •', JSON.stringify(s)));
