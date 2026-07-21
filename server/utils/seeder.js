const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const Tour = require('../models/Tour');
const Faq = require('../models/Faq');
const CompanyInfo = require('../models/CompanyInfo');

// Supported languages
const SUPPORTED_LANGS = ['en', 'es', 'pt', 'it', 'ar'];

// Mappings for languages
const LANG_MAP = {
  'en-US': 'en',
  'pt-BR': 'pt',
  'ar-EG': 'ar',
  'en': 'en',
  'es': 'es',
  'pt': 'pt',
  'it': 'it',
  'ar': 'ar'
};

/**
 * Clean and load a JavaScript file that uses ES module export syntax
 */
function loadEsModuleFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Strip import statements
  const importRegex = /import\s+[\s\S]*?from\s+'[^']+'\s*;?/g;
  content = content.replace(importRegex, '/* stripped import */');
  
  // Replace export statements
  content = content.replace(/export\s+const\s+(\w+)\s*=/g, 'const $1 =');
  content = content.replace(/export\s+default\s+/g, '');
  
  // Find target variable name
  const varMatch = content.match(/(?:const|let|var)\s+(\w+)\s*=/);
  const varName = varMatch ? varMatch[1] : null;
  
  if (varName) {
    content += `\nmodule.exports = ${varName};`;
  }
  
  const tempPath = filePath.replace(/\.js$/, '.temp.cjs');
  fs.writeFileSync(tempPath, content, 'utf8');
  
  let data;
  try {
    data = require(tempPath);
    delete require.cache[require.resolve(tempPath)];
  } finally {
    try {
      fs.unlinkSync(tempPath);
    } catch (e) {
      // ignore
    }
  }
  return data;
}

/**
 * Resolves translation keys inside an object/array recursively
 */
function resolveTranslations(obj, localeJson) {
  if (typeof obj === 'string') {
    // If the string starts with classic. or tour_ or general. or is a key in the json
    if (localeJson[obj]) {
      return localeJson[obj];
    }
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(item => resolveTranslations(item, localeJson));
  } else if (typeof obj === 'object' && obj !== null) {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = resolveTranslations(obj[key], localeJson);
    }
    return newObj;
  }
  return obj;
}

/**
 * Flat language-specific fields out of multi-lingual objects in programs.json
 */
function extractLanguageFields(obj, lang) {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    const keys = Object.keys(obj);
    const hasLangKeys = SUPPORTED_LANGS.some(lk => keys.includes(lk));
    if (hasLangKeys) {
      return obj[lang] || obj['en'] || '';
    }
    
    const newObj = {};
    for (const key in obj) {
      newObj[key] = extractLanguageFields(obj[key], lang);
    }
    return newObj;
  } else if (Array.isArray(obj)) {
    return obj.map(item => extractLanguageFields(item, lang));
  }
  return obj;
}

/**
 * Extracts numeric duration in days from duration string
 */
function parseDurationDays(durationStr) {
  if (!durationStr || typeof durationStr !== 'string') return 1;
  const match = durationStr.match(/(\d+)\s*(?:day|days|dias|dia|giorni|giorno|يوم|أيام|ايام|ليال)/i);
  return match ? parseInt(match[1], 10) : 1;
}

/**
 * Main seeding function
 */
async function seedDatabase(force = false) {
  try {
    // Self-healing check for outdated seed data
    const oldAbout = await CompanyInfo.findOne({ key: 'about_us', language: 'en' });
    if (oldAbout && oldAbout.content.includes('2018')) {
      console.log('Detected outdated seed data (found 2018 instead of 2010). Forcing re-seed...');
      force = true;
    }

    const tourCount = await Tour.countDocuments();
    if (tourCount > 0 && !force) {
      console.log('Database already seeded. Skipping seeder...');
      return;
    }

    console.log('Starting Database Seeding...');
    
    // Clear existing collections
    await Tour.deleteMany({});
    await Faq.deleteMany({});
    await CompanyInfo.deleteMany({});
    console.log('Cleared existing Tours, FAQs, and CompanyInfo collections.');

    const dataDir = path.join(__dirname, '..', '..', 'src', 'data');
    const localesDir = path.join(__dirname, '..', '..', 'src', 'i18n', 'locales');
    // Helper to flatten nested translation JSON
    const flattenObject = (ob) => {
      const toReturn = {};
      for (const i in ob) {
        if (!ob.hasOwnProperty(i)) continue;
        if ((typeof ob[i]) === 'object' && ob[i] !== null && !Array.isArray(ob[i])) {
          const flatObject = flattenObject(ob[i]);
          for (const x in flatObject) {
            if (!flatObject.hasOwnProperty(x)) continue;
            toReturn[i + '.' + x] = flatObject[x];
          }
        } else {
          toReturn[i] = ob[i];
        }
      }
      return toReturn;
    };

    // 1. Load Locales
    const locales = {};
    SUPPORTED_LANGS.forEach(lang => {
      const filePath = path.join(localesDir, `${lang}.json`);
      if (fs.existsSync(filePath)) {
        const rawJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        locales[lang] = flattenObject(rawJson);
      } else {
        console.warn(`Locale file not found: ${filePath}`);
        locales[lang] = {};
      }
    });

    // 2. Extract & Seed FAQs
    console.log('Seeding FAQs...');
    const faqCountByLang = {};
    SUPPORTED_LANGS.forEach(lang => {
      const trans = locales[lang];
      const faqItems = [];
      
      Object.keys(trans).forEach(key => {
        // Match category-based format e.g. faq.general.q1
        const matchCat = key.match(/^faq\.([a-zA-Z0-9_-]+)\.q(\d+)$/);
        if (matchCat) {
          const catId = matchCat[1];
          const idx = matchCat[2];
          const answerKey = `faq.${catId}.a${idx}`;
          const qText = trans[key];
          const aText = trans[answerKey];
          
          if (qText && aText && !aText.includes('[No answer')) {
            faqItems.push({
              faqId: `${catId}-${idx}`,
              language: lang,
              category: catId,
              question: qText,
              answer: aText
            });
          }
        }

        // Match legacy/flat format e.g. faq.qBookingTailor
        const matchFlat = key.match(/^faq\.q([a-zA-Z0-9_-]+)$/);
        if (matchFlat) {
          const flatId = matchFlat[1];
          const answerKey = `faq.a${flatId}`;
          const qText = trans[key];
          const aText = trans[answerKey];
          
          if (qText && aText && !aText.includes('[No answer')) {
            faqItems.push({
              faqId: `flat-${flatId}`,
              language: lang,
              category: 'general',
              question: qText,
              answer: aText
            });
          }
        }
      });

      faqCountByLang[lang] = faqItems.length;
      
      // Save FAQs to MongoDB
      faqItems.forEach(async (faq) => {
        await Faq.create(faq);
      });
    });
    console.log('FAQs seeded successfully:', faqCountByLang);

    // 3. Seed CompanyInfo
    console.log('Seeding CompanyInfo...');
    const defaultCompanyInfo = {
      booking_process: {
        title: { en: 'Booking Process', es: 'Proceso de Reserva', pt: 'Processo de Reserva', it: 'Processo di Prenotazione', ar: 'خطوات الحجز' },
        content: {
          en: ['Select your preferred tour package from our catalog.', 'Fill in the booking form with travel dates, passenger details, and contact info.', 'Receive a booking invoice and confirmation.', 'Pay a deposit or full amount as specified by our booking team.'],
          es: ['Seleccione su paquete turístico preferido de nuestro catálogo.', 'Complete el formulario de reserva con fechas de viaje, detalles de pasajeros e información de contacto.', 'Reciba una factura de reserva y confirmación.', 'Pague un depósito o el monto total según lo especificado por nuestro equipo de reservas.'],
          pt: ['Selecione o pacote turístico de sua preferência em nosso catálogo.', 'Preencha o formulário de reserva com as datas da viagem, dados dos passageiros e informações de contato.', 'Receba a fatura da reserva e a confirmação.', 'Pague um depósito ou o valor total conforme especificado pela nossa equipe de reservas.'],
          it: ['Seleziona il pacchetto turistico preferito dal nostro catalogo.', 'Compila il modulo di prenotazione con date di viaggio, dettagli dei passeggeri e informazioni di contatto.', 'Ricevi una fattura di prenotazione e conferma.', 'Paga un acconto o l\'intero importo come specificato dal nostro team di prenotazione.'],
          ar: ['اختر برنامجك المفضل من قائمة رحلاتنا.', 'املاً نموذج الحجز بتواريخ السفر، تفاصيل المسافرين وبيانات الاتصال.', 'استلم فاتورة الحجز وتأكيد الحجز.', 'قم بسداد الدفعة المقدمة أو المبلغ بالكامل وفقاً لتعليمات فريق الحجز لدينا.']
        }
      },
      cancellation_policy: {
        title: { en: 'Cancellation Policy', es: 'Política de Cancelación', pt: 'Política de Cancelamento', it: 'Politica di Cancellazione', ar: 'سياسة الإلغاء' },
        content: {
          en: ['Cancellations made more than 45 days prior to departure: 100% refund of deposit.', 'Cancellations 44 to 30 days prior: Loss of deposit.', 'Cancellations 29 to 15 days prior: 50% of the total tour cost.', 'Cancellations less than 14 days prior: No refund.'],
          es: ['Cancelaciones realizadas con más de 45 días de antelación a la salida: reembolso del 100% del depósito.', 'Cancelaciones de 44 a 30 días antes: Pérdida del depósito.', 'Cancelaciones de 29 a 15 días antes: 50% del coste total del viaje.', 'Cancelaciones con menos de 14 días de antelación: Sin reembolso.'],
          pt: ['Cancelamentos feitos com mais de 45 dias de antecedência da partida: reembolso de 100% do depósito.', 'Cancelamentos de 44 a 30 dias de antecedência: perda do depósito.', 'Cancelamentos de 29 a 15 dias de antecedência: 50% do custo total da viagem.', 'Cancelamentos com menos de 14 dias de antecedência: Sem reembolso.'],
          it: ['Cancellazioni effettuate più di 45 giorni prima della partenza: rimborso del 100% dell\'acconto.', 'Cancellazioni da 44 a 30 giorni prima: Perdita dell\'acconto.', 'Cancellazioni da 29 a 15 giorni prima: 50% del costo totale del tour.', 'Cancellazioni a meno di 14 giorni prima: Nessun rimborso.'],
          ar: ['الإلغاء قبل أكثر من 45 يوماً من موعد الرحلة: استرداد 100% من الدفعة المقدمة.', 'الإلغاء من 44 إلى 30 يوماً قبل الرحلة: خسارة الدفعة المقدمة.', 'الإلغاء من 29 إلى 15 يوماً قبل الرحلة: خصم 50% من التكلفة الإجمالية للرحلة.', 'الإلغاء قبل أقل من 14 يوماً من الرحلة: لا يوجد استرداد.']
        }
      },
      payment_methods: {
        title: { en: 'Payment Methods', es: 'Métodos de Pago', pt: 'Métodos de Pagamento', it: 'Metodi di Pagamento', ar: 'طرق الدفع' },
        content: {
          en: ['Bank transfer to our company account.', 'Credit/Debit Card online payment link (Visa, Mastercard).', 'Secure payments processed via Stripe/Paypal.'],
          es: ['Transferencia bancaria a la cuenta de nuestra empresa.', 'Enlace de pago online con tarjeta de Crédito/Débito (Visa, Mastercard).', 'Pagos seguros procesados a través de Stripe/Paypal.'],
          pt: ['Transferência bancária para a conta da nossa empresa.', 'Link de pagamento online por Cartão de Crédito/Débito (Visa, Mastercard).', 'Pagamentos seguros processados via Stripe/Paypal.'],
          it: ['Bonifico bancario sul conto della nossa azienda.', 'Link di pagamento online con Carta di Credito/Debito (Visa, Mastercard).', 'Pagamenti sicuri elaborati tramite Stripe/Paypal.'],
          ar: ['التحويل البنكي إلى حساب حساب شركتنا.', 'رابط الدفع الإلكتروني عبر بطاقات الائتمان/الخصم (فيزا، ماستركارد).', 'المدفوعات الآمنة المعالجة عبر سترايب/بايبال.']
        }
      },
      visa_services: {
        title: { en: 'Visa Services', es: 'Servicios de Visado', pt: 'Serviços de Visto', it: 'Servizi Visti', ar: 'خدمات التأشيرة' },
        content: {
          en: ['We assist in obtaining tourist visas for Egypt, Jordan, and other destinations.', 'For Egypt: Visa on arrival assist is included in premium packages (mandatory visa fee of $35 paid to representative).', 'Passport must be valid for at least 6 months from arrival date.'],
          es: ['Asistimos en la obtención de visados turísticos para Egipto, Jordania y otros destinos.', 'Para Egipto: La asistencia para el visado a la llegada está incluida en los paquetes premium (tasa de visado obligatoria de $35 abonada al representante).', 'El pasaporte debe tener una validez mínima de 6 meses desde la fecha de llegada.'],
          pt: ['Auxiliamos na obtenção de vistos turísticos para o Egito, Jordânia e outros destinos.', 'Para o Egito: A assistência para o visto na chegada está incluída nos pacotes premium (taxa de visto obrigatória de $35 paga ao representante).', 'O passaporte deve ser válido por pelo menos 6 meses a partir da data de chegada.'],
          it: ['Assistiamo nell\'ottenimento di visti turistici per Egitto, Giordania e altre destinazioni.', 'Per l\'Egitto: L\'assistenza per il visto all\'arrivo è inclusa nei pacchetti premium (tassa di visto obbligatoria di $35 pagata al rappresentante).', 'Il passaporto deve essere valido per almeno 6 mesi dalla data di arrivo.'],
          ar: ['نساعد في استخراج التأشيرات السياحية لمصر والأردن ووجهات أخرى.', 'بالنسبة لمصر: خدمة المساعدة في الحصول على التأشيرة عند الوصول مشمولة في الباقات المميزة (رسوم تأشيرة إجبارية بقيمة 35 دولاراً تدفع للمندوب).', 'يجب أن يكون جواز السفر صالحاً لمدة 6 أشهر على الأقل من تاريخ الوصول.']
        }
      },
      contact_info: {
        title: { en: 'Contact Information', es: 'Información de Contacto', pt: 'Informações de Contato', it: 'Informazioni di Contatto', ar: 'بيانات الاتصال' },
        content: {
          en: ['Email: info@dunas-travel.com', 'Phone: +20 123 456 7890 (WhatsApp)', 'Office Address: Cairo, Egypt', 'Opening Hours: 9:00 AM - 6:00 PM (Sunday - Thursday)'],
          es: ['Email: info@dunas-travel.com', 'Teléfono: +20 123 456 7890 (WhatsApp)', 'Dirección de la Oficina: El Cairo, Egipto', 'Horario: 9:00 AM - 6:00 PM (Domingo - Jueves)'],
          pt: ['Email: info@dunas-travel.com', 'Telefone: +20 123 456 7890 (WhatsApp)', 'Endereço do Escritório: Cairo, Egito', 'Horário de Funcionamento: 9h00 - 18h00 (Domingo - Quinta)'],
          it: ['Email: info@dunas-travel.com', 'Telefono: +20 123 456 7890 (WhatsApp)', 'Indirizzo Ufficio: Il Cairo, Egitto', 'Orari di Apertura: 9:00 - 18:00 (Domenica - Giovedì)'],
          ar: ['البريد الإلكتروني: info@dunas-travel.com', 'رقم الهاتف: +20 123 456 7890 (واتساب)', 'عنوان المكتب: القاهرة، مصر', 'ساعات العمل: 9:00 صباحاً - 6:00 مساءً (الأحد - الخميس)']
        }
      },
      about_us: {
        title: { en: 'About Dunas Travel', es: 'Sobre Dunas Travel', pt: 'Sobre a Dunas Travel', it: 'Informazioni su Dunas Travel', ar: 'عن دوناس ترافيل' },
        content: {
          en: 'Dunas Travel is a premium travel agency specializing in luxury tours, Nile cruises, and cultural journeys across Egypt, Jordan, Greece, Turkey, and Tunisia. Founded in 2010, we have guided over 95,000 travelers. We are dedicated to providing personalized itineraries, professional multilingual guides, and seamless private transportation to guarantee an unforgettable travel experience.',
          es: 'Dunas Travel es una agencia de viajes premium especializada en tours de lujo, cruceros por el Nilo y viajes culturales en Egipto, Jordania, Grecia, Turquía y Túnez. Fundada en 2010, hemos guiado a más de 95,000 viajeros. Nos dedicamos a ofrecer itinerarios personalizados, guías profesionales del sector y transporte privado para garantizar un viaje inolvidable.',
          pt: 'A Dunas Travel é uma agência de viagens premium especializada em tours de luxo, cruzeiros no Nilo e viagens culturais pelo Egito, Jordânia, Grécia, Turquia e Tunísia. Fundada em 2010, já guiamos mais de 95.000 viajantes. Dedicamo-nos a oferecer itinerários personalizados, guias profissionais multilíngues e transporte privado de alto padrão para garantir uma experiência de viagem inesquecível.',
          it: 'Dunas Travel è un\'agenzia di viaggi di fascia alta specializzata in tour di lusso, crociere sul Nilo e viaggi culturali in Egitto, Giordania, Grecia, Turchia e Tunisia. Fondata nel 2010, abbiamo guidato oltre 95.000 viaggiatori. Ci dedichiamo a fornire itinerari personalizzati, guide multilingue professionali e trasporti privati impeccabili per garantire un\'esperienza di viaggio indimenticabile.',
          ar: 'دوناس ترافيل هي وكالة سفر مميزة متخصصة في الرحلات الفاخرة، كروز النيل، والرحلات الثقافية في مصر، الأردن، اليونان، وتونس. تأسست في عام 2010، وقمنا بخدمة أكثر من 95,000 مسافر. نحن ملتزمون بتقديم برامج سفر مخصصة، مرشدين سياحيين محترفين يتحدثون عدة لغات، ووسائل نقل خاصة مريحة لضمان تجربة سفر لا تُنسى.'
        }
      }
    };

    for (const key in defaultCompanyInfo) {
      const info = defaultCompanyInfo[key];
      for (const lang of SUPPORTED_LANGS) {
        await CompanyInfo.create({
          key,
          language: lang,
          title: info.title[lang] || info.title['en'],
          content: info.content[lang] || info.content['en']
        });
      }
    }
    console.log('CompanyInfo seeded successfully.');

    // 4. Load & Seed Tours
    console.log('Loading Tours Data...');
    
    const rawBaseTours = loadEsModuleFile(path.join(dataDir, 'tours.js'));
    const rawServices = loadEsModuleFile(path.join(dataDir, 'services.js'));
    const rawTunisia = loadEsModuleFile(path.join(dataDir, 'tunisiaTours.js'));
    const rawTurkey = loadEsModuleFile(path.join(dataDir, 'turkeyTours.js'));
    const rawMulti = loadEsModuleFile(path.join(dataDir, 'multiCountryTours.js'));
    const rawPrograms = JSON.parse(fs.readFileSync(path.join(dataDir, 'programs.json'), 'utf8')).programs;

    console.log(`Found raw data sizes: tours.js (${rawBaseTours.length}), services.js (${rawServices.length}), tunisiaTours.js (${rawTunisia.length}), turkeyTours.js (${rawTurkey.length}), multiCountryTours.js (${rawMulti.length}), programs.json (${rawPrograms.length})`);

    const toursToSave = [];

    // Process language-specific tours from tours.js, tunisiaTours, turkeyTours, multiCountryTours, services.js
    const processSingleTour = (tour, categoryName) => {
      const targetLang = LANG_MAP[tour.language] || 'en';
      const resolved = resolveTranslations(tour, locales[targetLang]);
      
      const durationDays = parseDurationDays(resolved.duration);

      // Determine category flags
      const cat = (categoryName || tour.category || tour.type || '').toLowerCase();
      const tags = {
        category: cat,
        familyFriendly: cat.includes('family') || cat.includes('classic') || (resolved.title && resolved.title.toLowerCase().includes('family')),
        honeymoon: cat.includes('honeymoon') || cat.includes('romantic') || (resolved.title && resolved.title.toLowerCase().includes('honeymoon')),
        adventure: cat.includes('adventure') || cat.includes('safari') || cat.includes('desert') || (resolved.overview && resolved.overview.toLowerCase().includes('safari')),
        luxury: cat.includes('luxury') || cat.includes('premium') || tour.price > 2000,
        cultural: cat.includes('cultural') || cat.includes('religious') || cat.includes('classic') || (resolved.overview && resolved.overview.toLowerCase().includes('history'))
      };

      toursToSave.push({
        id: tour.id || `tour-${tour.slug}-${targetLang}`,
        slug: tour.slug,
        language: targetLang,
        market: tour.market || 'Global',
        type: tour.type || '',
        duration: resolved.duration || '',
        destination: (tour.destination || '').toLowerCase(),
        title: resolved.title,
        subtitle: resolved.subtitle || '',
        overview: Array.isArray(resolved.overview) ? resolved.overview.join('\n') : (resolved.overview || ''),
        departures: resolved.departures || '',
        price: tour.price || 0,
        rating: tour.rating || 5.0,
        reviewCount: tour.reviewCount || 0,
        images: tour.images || [],
        highlights: resolved.highlights || [],
        included: resolved.included || [],
        excluded: resolved.excluded || [],
        itinerary: (resolved.itinerary || []).map(dayItem => ({
          day: dayItem.day ? dayItem.day.toString() : '',
          title: dayItem.title || '',
          description: dayItem.description || dayItem.body || dayItem.morning || '',
          meals: dayItem.meals || ''
        })),
        accommodation: resolved.accommodation || [],
        hotels: tour.hotels || {},
        hotelCategory: tour.hotelCategory || '',
        ...tags
      });
    };

    // Process tours.js
    rawBaseTours.forEach(tour => processSingleTour(tour, tour.type || 'classic'));

    // Process services.js
    rawServices.forEach(tour => processSingleTour(tour, tour.category));

    // Process tunisiaTours.js
    rawTunisia.forEach(tour => {
      // It is marked as language: multi. We seed for all 5 languages
      SUPPORTED_LANGS.forEach(lang => {
        const langTour = { ...tour, language: lang };
        processSingleTour(langTour, 'adventure');
      });
    });

    // Process turkeyTours.js
    rawTurkey.forEach(tour => processSingleTour(tour, 'classic'));

    // Process multiCountryTours.js
    rawMulti.forEach(tour => processSingleTour(tour, 'classic'));

    // Process programs.json (multi-lingual nested data)
    rawPrograms.forEach(program => {
      SUPPORTED_LANGS.forEach(lang => {
        const flatProgram = extractLanguageFields(program, lang);
        
        const durationStr = flatProgram.duration || '';
        const durationDays = parseDurationDays(durationStr);

        const tags = {
          category: 'classic',
          familyFriendly: true,
          honeymoon: false,
          adventure: durationStr.includes('desert') || durationStr.includes('safari'),
          luxury: flatProgram.price > 2000,
          cultural: true
        };

        toursToSave.push({
          id: program.id || `prog-${program.slug}-${lang}`,
          slug: program.slug,
          language: lang,
          market: 'Global',
          type: 'Program',
          duration: durationStr,
          destination: (flatProgram.destination || 'egypt').toLowerCase(),
          title: flatProgram.title || '',
          subtitle: flatProgram.subtitle || '',
          overview: Array.isArray(flatProgram.overview) ? flatProgram.overview.join('\n') : (flatProgram.overview || ''),
          departures: flatProgram.departures || '',
          price: program.price || 0,
          rating: program.rating || 5.0,
          reviewCount: program.reviewCount || 0,
          images: program.images || [],
          highlights: flatProgram.highlights || [],
          included: flatProgram.included || [],
          excluded: flatProgram.excluded || [],
          itinerary: (flatProgram.itinerary || []).map(dayItem => ({
            day: dayItem.day ? dayItem.day.toString() : '',
            title: dayItem.title || '',
            description: dayItem.description || dayItem.body || '',
            meals: dayItem.meals || ''
          })),
          accommodation: flatProgram.accommodation || [],
          hotels: program.hotels || {},
          hotelCategory: program.hotelCategory || '',
          ...tags
        });
      });
    });

    console.log(`Normalizing & writing ${toursToSave.length} Tour documents...`);
    
    // Save to DB in bulk
    await Tour.insertMany(toursToSave);
    console.log('Seeded Tours successfully!');
    console.log('Database Seeding Completed Successfully.');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}

module.exports = {
  seedDatabase
};
