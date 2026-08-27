const i18next = require('i18next');
const ar = require('./src/i18n/locales/ar.json');
const en = require('./src/i18n/locales/en.json');
const es = require('./src/i18n/locales/es.json');

i18next.init({
  resources: { ar: { translation: ar }, en: { translation: en }, es: { translation: es } },
  lng: 'ar',
  fallbackLng: 'en',
  keySeparator: '.',
  interpolation: { escapeValue: false }
}, () => {
  console.log('=== TEST: strings WITHOUT a dot (should translate) ===');
  const noDot = ['Estrellas del Medio Oriente','19 Días / 18 Noches','Turquía','Petra'];
  noDot.forEach(s => {
    console.log('  t("data.'+s+'") =>', JSON.stringify(i18next.t('data.'+s, s)));
  });

  console.log('\n=== TEST: strings WITH a dot (will they translate?) ===');
  const withDot = [
    'Desayuno. Día completamente libre para explorar la ciudad a su ritmo.',
    'Cena libre. Noche en El Cairo.',
    'Día 2'
  ];
  withDot.forEach(s => {
    console.log('  t("data.'+s+'") =>', JSON.stringify(i18next.t('data.'+s, s)));
  });

  console.log('\n=== Direct data lookup (bypassing keySeparator) ===');
  withDot.forEach(s => {
    // Access the value directly from the data object
    console.log('  ar.data["'+s.slice(0,30)+'..."] =>', JSON.stringify(ar.data[s]));
  });
});
