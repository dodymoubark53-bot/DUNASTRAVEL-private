const fs = require('fs');
const strings = JSON.parse(fs.readFileSync('./_extracted_strings.json','utf8'));
const i18next = require('i18next');
const ar = require('./src/i18n/locales/ar.json');

i18next.init({
  resources: { ar: { translation: ar } },
  lng: 'ar', keySeparator: '.', interpolation: { escapeValue: false }
}, () => {
  const failing = [];
  strings.forEach(s => {
    const result = i18next.t('data.'+s, s);
    if (ar.data[s] !== undefined && result !== ar.data[s]) {
      failing.push(s);
    }
  });
  console.log('Total failing:', failing.length);

  // Classify the failures
  const hasColon = failing.filter(s => s.includes(':'));
  const hasEmDash = failing.filter(s => s.includes('—'));
  const hasQuote = failing.filter(s => s.includes('"'));
  const hasParen = failing.filter(s => s.includes('('));
  const hasWarning = failing.filter(s => s.includes('⚠️'));
  const hasEnDash = failing.filter(s => s.includes('–'));
  console.log('With colon ":"        :', hasColon.length);
  console.log('With em-dash "—"      :', hasEmDash.length);
  console.log('With double-quote "\"" :', hasQuote.length);
  console.log('With parenthesis "("  :', hasParen.length);
  console.log('With warning emoji ⚠️ :', hasWarning.length);
  console.log('With en-dash "–"      :', hasEnDash.length);

  // Pick a few and compare the EXACT key vs dict key byte-by-byte
  console.log('\n=== Byte-level comparison for failing keys ===');
  failing.slice(0,5).forEach(s => {
    // Find the dict key that the component SHOULD have matched
    // Show lengths and char codes of first divergence
    const dictKeys = Object.keys(ar.data);
    // find a dict key that is "close"
    const close = dictKeys.find(k => k.length === s.length && k.slice(0,30) === s.slice(0,30) && k !== s);
    console.log('  SRC len='+s.length+': '+JSON.stringify(s).slice(0,60));
    if (close) {
      console.log('  CLOSE dict len='+close.length+': '+JSON.stringify(close).slice(0,60));
      // find first diff char
      for (let i=0;i<Math.min(s.length,close.length);i++){
        if(s[i]!==close[i]){ 
          console.log('  First diff at idx '+i+': src='+s.charCodeAt(i)+' ('+JSON.stringify(s[i])+') | dict='+close.charCodeAt(i)+' ('+JSON.stringify(close[i])+')');
          break;
        }
      }
    } else {
      console.log('  (no close match found by length)');
    }
    console.log('');
  });
});
