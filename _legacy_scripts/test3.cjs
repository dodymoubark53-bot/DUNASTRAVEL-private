const fs = require('fs');
const strings = JSON.parse(fs.readFileSync('./_extracted_strings.json','utf8'));
const i18next = require('i18next');
const ar = require('./src/i18n/locales/ar.json');
const en = require('./src/i18n/locales/en.json');
const es = require('./src/i18n/locales/es.json');

i18next.init({
  resources: { ar: { translation: ar }, en:{translation:en}, es:{translation:es} },
  lng: 'ar', fallbackLng:'en',
  keySeparator: '.', interpolation: { escapeValue: false }
}, () => {
  const quoted = strings.filter(s => s.includes('"'));
  console.log('=== Quoted strings test ===');
  quoted.forEach(s => {
    const inAR = ar.data[s]!==undefined;
    const resAR = i18next.t('data.'+s, s);
    console.log('  inDict='+inAR+' | AR='+JSON.stringify(resAR).slice(0,60));
    console.log('    src='+JSON.stringify(s));
  });

  // Now the REAL test: simulate EXACTLY what the component does for ALL strings
  // The component calls t('data.'+value, value). Let's see which ones return the SPANISH original (untranslated)
  console.log('\n=== FULL SCAN: strings that FAIL to translate to AR (return Spanish) ===');
  const failing = [];
  strings.forEach(s => {
    const result = i18next.t('data.'+s, s);
    // If result equals the original Spanish string AND it's not actually Spanish-only, it failed
    if (ar.data[s] !== undefined && result !== ar.data[s]) {
      failing.push({s, result, expected: ar.data[s]});
    } else if (ar.data[s] === undefined && result === s) {
      // key not in dict at all
    }
  });
  console.log('Strings where t() result != ar.data[s] :', failing.length);
  failing.slice(0,15).forEach(f => {
    console.log('  SRC: '+JSON.stringify(f.s).slice(0,70));
    console.log('  GOT: '+JSON.stringify(f.result).slice(0,70));
    console.log('  EXP: '+JSON.stringify(f.expected).slice(0,70));
  });
});
