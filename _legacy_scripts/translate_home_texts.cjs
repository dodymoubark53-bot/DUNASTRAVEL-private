const fs = require('fs');
const path = './src/i18n/locales/';

const newKeys = {};

newKeys.en = {
  'home.transportSub': 'GET AROUND IN STYLE',
  'home.transportTitle': 'Premium Transportation Services',
  'home.transportDesc': 'Luxury vehicles and professional drivers \u2014 available across Egypt, Jordan, Turkey & Tunisia',
  'home.bookTransferDesc': 'Fill out the details below and our concierge will confirm your reservation.',
  'home.ctaDesc': 'Let us craft a journey tailored entirely to you',
};

newKeys.ar = {
  'home.transportSub': '\u062A\u0646\u0642\u0644 \u0628\u0623\u0646\u0627\u0642\u0629',
  'home.transportTitle': '\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u0646\u0642\u0644 \u0627\u0644\u0645\u0645\u062A\u0627\u0632\u0629',
  'home.transportDesc': '\u0633\u064A\u0627\u0631\u0627\u062A \u0641\u0627\u062E\u0631\u0629 \u0648\u0633\u0648\u0627\u0642\u0648\u0646 \u0645\u062D\u062A\u0631\u0641\u0648\u0646 \u2014 \u0645\u062A\u0627\u062D\u0629 \u0641\u064A \u0645\u0635\u0631\u060C \u0627\u0644\u0623\u0631\u062F\u0646\u060C \u062A\u0631\u0643\u064A\u0627 \u0648\u062A\u0648\u0646\u0633',
  'home.bookTransferDesc': '\u0627\u0645\u0644\u0623 \u0627\u0644\u062A\u0641\u0627\u0635\u064A\u0644 \u0623\u062F\u0646\u0627\u0647 \u0648\u0633\u064A\u0624\u0643\u062F \u0645\u0633\u062A\u062E\u062F\u0645\u0646\u0627 \u062D\u062C\u0632\u0643.',
  'home.ctaDesc': '\u062F\u0639\u0646\u0627 \u0646\u0635\u0645\u0645 \u0631\u062D\u0644\u0629 \u0645\u0635\u0645\u0645\u0629 \u062E\u0635\u064A\u0635\u064A\u0627\u064B \u0644\u0643',
};

newKeys.es = {
  'home.transportSub': 'DESPL\u00C1ZATE CON ESTILO',
  'home.transportTitle': 'Servicios de Transporte Premium',
  'home.transportDesc': 'Veh\u00EDculos de lujo y conductores profesionales \u2014 disponibles en Egipto, Jordania, Turqu\u00EDa y T\u00FAnez',
  'home.bookTransferDesc': 'Complete los detalles a continuaci\u00F3n y nuestro conserje confirmar\u00E1 su reserva.',
  'home.ctaDesc': 'D\u00E9janos crear un viaje hecho completamente a tu medida',
};

newKeys.it = {
  'home.transportSub': 'SPOSTATI CON STILE',
  'home.transportTitle': 'Servizi di Trasporto Premium',
  'home.transportDesc': 'Veicoli di lusso e autisti professionisti \u2014 disponibili in Egitto, Giordania, Turchia e Tunisia',
  'home.bookTransferDesc': 'Compila i dettagli qui sotto e il nostro concierge confermer\u00E0 la tua prenotazione.',
  'home.ctaDesc': 'Lasciaci creare un viaggio su misura interamente per te',
};

newKeys.pt = {
  'home.transportSub': 'VIAJE COM ESTILO',
  'home.transportTitle': 'Servi\u00E7os de Transporte Premium',
  'home.transportDesc': 'Ve\u00EDculos de luxo e motoristas profissionais \u2014 dispon\u00EDveis no Egito, Jord\u00E2nia, Turquia e Tun\u00EDsia',
  'home.bookTransferDesc': 'Preencha os detalhes abaixo e nosso concierge confirmar\u00E1 sua reserva.',
  'home.ctaDesc': 'Deixe-nos criar uma viagem sob medida inteiramente para voc\u00EA',
};

const langs = ['en', 'ar', 'es', 'it', 'pt'];
langs.forEach(l => {
  const filePath = path + l + '.json';
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  Object.assign(data, newKeys[l]);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(l + ': updated, total = ' + Object.keys(data).length);
});
console.log('Done!');
