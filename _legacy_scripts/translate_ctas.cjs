const fs = require('fs');
const path = './src/i18n/locales/';

const newKeys = {};

// ── Shared translations (same text for all destinations) ──────
const ctaLabel = {
  ar: '\u0644\u0645 \u062A\u062C\u062F \u0645\u0627 \u062A\u0628\u062D\u062B \u0639\u0646\u0647\u061F',
  es: '\u00BFNO ENCUENTRAS LO QUE BUSCAS?',
  it: 'NON HAI TROVATO QUELLO CHE CERCHI?',
  pt: 'N\u00C3O ENCONTROU O QUE PROCURA?',
};

const ctaDescBase = {
  ar: '\u0623\u062E\u0628\u0631\u0646\u0627 \u0628\u062A\u0641\u0636\u064A\u0644\u0627\u062A\u0643\u060C \u0648\u0633\u064A\u0642\u0648\u0645 \u0645\u0635\u0645\u0645\u0648 \u0631\u062D\u0644\u0627\u062A\u0646\u0627 \u0627\u0644\u062E\u0628\u0631\u0627\u0621 \u0628\u0635\u064A\u0627\u063A\u0629 \u0631\u062D\u0644\u0629 \u0645\u062E\u0635\u0635\u0629 \u062A\u0646\u0627\u0633\u0628\u0643 \u062A\u0645\u0627\u0645\u0627\u064B.',
  es: 'Cu\u00E9ntanos tus preferencias, y nuestros dise\u00F1adores de viajes expertos crear\u00E1n un itinerario a medida para ti.',
  it: 'Raccontaci le tue preferenze e i nostri esperti designer di viaggi creeranno un itinerario su misura per te.',
  pt: 'Conte-nos suas prefer\u00EAncias, e nossos designers de viagens especializados criar\u00E3o um roteiro personalizado sob medida para voc\u00EA.',
};

// ── Country names in each language for ctaTitle ───────────────
const countryNames = {
  egypt:   { ar: '\u0645\u0635\u0631', es: 'Egipto', it: 'Egitto', pt: 'Egito' },
  turkey:  { ar: '\u062A\u0631\u0643\u064A\u0627', es: 'Turqu\u00EDa', it: 'Turchia', pt: 'Turquia' },
  jordan:  { ar: '\u0627\u0644\u0623\u0631\u062F\u0646', es: 'Jordania', it: 'Giordania', pt: 'Jord\u00E2nia' },
  dubai:   { ar: '\u062F\u0628\u064A', es: 'Dub\u00E1i', it: 'Dubai', pt: 'Dubai' },
  greece:  { ar: '\u0627\u0644\u064A\u0648\u0646\u0627\u0646', es: 'Grecia', it: 'Grecia', pt: 'Gr\u00E9cia' },
  tunisia: { ar: '\u062A\u0648\u0646\u0633', es: 'T\u00FAnez', it: 'Tunisia', pt: 'Tun\u00EDsia' },
  brazil:  { ar: '\u0627\u0644\u0628\u0631\u0627\u0632\u064A\u0644', es: 'Brasil', it: 'Brasile', pt: 'Brasil' },
  italy:   { ar: '\u0625\u064A\u0637\u0627\u0644\u064A\u0627', es: 'Italia', it: 'Italia', pt: 'It\u00E1lia' },
  morocco: { ar: '\u0627\u0644\u0645\u063A\u0631\u0628', es: 'Marruecos', it: 'Marocco', pt: 'Marrocos' },
};

const langs = ['en', 'ar', 'es', 'it', 'pt'];

// Build CTA keys for all destinations
Object.keys(countryNames).forEach(dest => {
  const prefix = 'dest.' + dest + '.';
  langs.forEach(l => {
    if (l === 'en') return; // keep English as-is
    // ctaLabel
    newKeys[l] = newKeys[l] || {};
    newKeys[l][prefix + 'ctaLabel'] = ctaLabel[l];
    // ctaTitle
    newKeys[l][prefix + 'ctaTitle'] = l === 'ar'
      ? '\u062F\u0639\u0646\u0627 \u0646\u0635\u0645\u0645 \u0631\u062D\u0644\u062A\u0643 \u0627\u0644\u0645\u062B\u0627\u0644\u064A\u0629 \u0625\u0644\u0649 ' + countryNames[dest][l]
      : l === 'es'
        ? 'D\u00E9janos dise\u00F1ar tu tour perfecto por ' + countryNames[dest][l]
        : l === 'it'
          ? 'Lasciaci progettare il tuo tour perfetto in ' + countryNames[dest][l]
          : 'Deixe-nos projetar seu tour perfeito por ' + countryNames[dest][l];
    // ctaDesc
    newKeys[l][prefix + 'ctaDesc'] = ctaDescBase[l];
  });
});

// ── Morocco-specific new keys ─────────────────────────────────
langs.forEach(l => {
  newKeys[l] = newKeys[l] || {};
});

// dest.morocco.desc
newKeys.ar['dest.morocco.desc'] = '\u0645\u0646 \u0645\u062F\u0646 \u0641\u0627\u0633 \u0627\u0644\u0642\u062F\u064A\u0645\u0629 \u0625\u0644\u0649 \u0623\u0633\u0648\u0627\u0642 \u0645\u0631\u0627\u0643\u0634 \u0627\u0644\u0646\u0627\u0628\u0636\u0629 \u0628\u0627\u0644\u062D\u064A\u0627\u0629\u060C \u0627\u0644\u0645\u063A\u0631\u0628 \u0648\u0644\u064A\u0645\u0629 \u0644\u0644\u062D\u0648\u0627\u0633.';
newKeys.es['dest.morocco.desc'] = 'Desde las medinas de Fez hasta los vibrantes zocos de Marrakech, Marruecos es un fest\u00EDn para los sentidos.';
newKeys.it['dest.morocco.desc'] = 'Dalle medine di Fez ai vivaci suk di Marrakech, il Marocco \u00E8 un festino per i sensi.';
newKeys.pt['dest.morocco.desc'] = 'Das medinas de Fez aos vibrantes souks de Marrakesh, Marrocos \u00E9 um banquete para os sentidos.';
newKeys.en['dest.morocco.desc'] = 'From the medinas of Fez to the vibrant souks of Marrakech, Morocco is a feast for the senses.';

// dest.morocco.brief
newKeys.ar['dest.morocco.brief'] = '\u062A\u0642\u062F\u0645 \u0627\u0644\u0645\u063A\u0631\u0628 \u0646\u0633\u064A\u062C\u064B\u0627 \u0645\u0646 \u0627\u0644\u0645\u062F\u0646 \u0627\u0644\u0625\u0645\u0628\u0631\u0627\u0637\u0648\u0631\u064A\u0629 \u0648\u0627\u0644\u0645\u062F\u0646 \u0627\u0644\u0642\u062F\u064A\u0645\u0629 \u0648\u0627\u0644\u0645\u0646\u0627\u0638\u0631 \u0627\u0644\u0637\u0628\u064A\u0639\u064A\u0629 \u0627\u0644\u062E\u0644\u0627\u0628\u0629. \u0627\u0633\u062A\u0643\u0634\u0641 \u0627\u0644\u0634\u0648\u0627\u0631\u0639 \u0627\u0644\u0645\u062A\u0639\u0631\u062C\u0629 \u0641\u064A \u0641\u0627\u0633 \u0648\u0639\u0638\u0645\u0629 \u0627\u0644\u062F\u0627\u0631 \u0627\u0644\u0628\u064A\u0636\u0627\u0621 \u0648\u0627\u0644\u0637\u0627\u0642\u0629 \u0627\u0644\u0646\u0627\u0628\u0636\u0629 \u0628\u0627\u0644\u062D\u064A\u0627\u0629 \u0641\u064A \u0645\u0631\u0627\u0643\u0634.';
newKeys.es['dest.morocco.brief'] = 'Marruecos ofrece un tapiz de ciudades imperiales, medinas antiguas y paisajes impresionantes. Explora las sinuosas calles de Fez, la grandeza de Casablanca y la vibrante energ\u00EDa de Marrakech.';
newKeys.it['dest.morocco.brief'] = 'Il Marocco offre un arazzo di citt\u00E0 imperiali, medine antiche e paesaggi mozzafiato. Esplora le tortuose strade di Fez, la grandiosit\u00E0 di Casablanca e l\u2019energia vibrante di Marrakech.';
newKeys.pt['dest.morocco.brief'] = 'Marrocos oferece uma tape\u00E7aria de cidades imperiais, medinas antigas e paisagens deslumbrantes. Explore as ruas sinuosas de Fez, a grandiosidade de Casablanca e a energia vibrante de Marrakesh.';
newKeys.en['dest.morocco.brief'] = 'Morocco offers a tapestry of imperial cities, ancient medinas, and stunning landscapes. Explore the winding streets of Fez, the grandeur of Casablanca, and the vibrant energy of Marrakech.';

// dest.morocco.ourPrograms
newKeys.ar['dest.morocco.ourPrograms'] = '\u0628\u0631\u0627\u0645\u062C\u0646\u0627';
newKeys.es['dest.morocco.ourPrograms'] = 'Nuestros Programas';
newKeys.it['dest.morocco.ourPrograms'] = 'I Nostri Programmi';
newKeys.pt['dest.morocco.ourPrograms'] = 'Nossos Programas';
newKeys.en['dest.morocco.ourPrograms'] = 'Our Programs';

// Write files
langs.forEach(l => {
  const filePath = path + l + '.json';
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  Object.assign(data, newKeys[l]);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  const count = Object.keys(newKeys[l]).length;
  console.log(l + ': updated ' + count + ' keys, total = ' + Object.keys(data).length);
});

console.log('Done!');
