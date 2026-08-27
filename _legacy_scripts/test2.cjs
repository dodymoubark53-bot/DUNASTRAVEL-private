const fs = require('fs');
const strings = JSON.parse(fs.readFileSync('./_extracted_strings.json','utf8'));
const i18next = require('i18next');
const ar = require('./src/i18n/locales/ar.json');

i18next.init({
  resources: { ar: { translation: ar } },
  lng: 'ar',
  keySeparator: '.',
  interpolation: { escapeValue: false }
}, () => {
  // Find strings with curly braces, dollar signs, or other interpolation-breaking chars
  const curly = strings.filter(s => s.includes('{') || s.includes('}'));
  const dollar = strings.filter(s => s.includes('$'));
  const specialQuotes = strings.filter(s => s.includes('"'));
  console.log('Strings with { or } :', curly.length);
  console.log('Strings with $ :', dollar.length);
  console.log('Strings with double quotes " :', specialQuotes.length);

  console.log('\n=== Testing curly-brace strings (DO THESE TRANSLATE?) ===');
  curly.slice(0,10).forEach(s => {
    const result = i18next.t('data.'+s, s);
    const ok = ar.data[s] !== undefined;
    console.log('  inDict='+ok+' | result='+JSON.stringify(result).slice(0,80));
    console.log('       src='+JSON.stringify(s).slice(0,70));
  });

  console.log('\n=== Testing $ strings ===');
  dollar.slice(0,10).forEach(s => {
    const result = i18next.t('data.'+s, s);
    const ok = ar.data[s] !== undefined;
    console.log('  inDict='+ok+' | result='+JSON.stringify(result).slice(0,80));
  });
});
