const mongoose = require('mongoose');
const ChatSession = require('../models/ChatSession');
const Tour = require('../models/Tour');
const CompanyInfo = require('../models/CompanyInfo');
const memoryDb = require('../utils/memoryDb');
const { searchTours, searchFaqs } = require('./searchService');
const {
  detectLanguage,
  mapColloquialToMsa,
  toEgyptianColloquial,
  extractFilters
} = require('../utils/nlpHelper');

// Fallback messages by language
const FALLBACK_MESSAGES = {
  en: "I'm sorry, I couldn't find an answer to your question. Would you like to check: ",
  es: "Lo siento, no pude encontrar una respuesta a tu pregunta. ¿Te gustaría consultar: ",
  pt: "Desculpe, não consegui encontrar uma resposta para a sua pergunta. Gostaria de verificar: ",
  it: "Mi dispiace, non ho trovato una risposta alla tua domanda. Ti piacerebbe verificare: ",
  ar: "عذراً، لم أتمكن من العثور على إجابة لسؤالك. هل تود الاستفسار عن: ",
  'ar-eg': "معلش يا فندم، ملقتش إجابة لسؤالك. تحب تسأل عن: "
};

// Default topic suggestions by language
const TOPIC_SUGGESTIONS = {
  en: ["About Dunas Travel", "Available Tours", "Booking Process", "Cancellation Policy", "Contact Us"],
  es: ["Sobre Dunas Travel", "Tours Disponibles", "Proceso de Reserva", "Política de Cancelación", "Contacto"],
  pt: ["Sobre a Dunas Travel", "Tours Disponíveis", "Processo de Reserva", "Política de Cancelamento", "Contato"],
  it: ["Informazioni su Dunas Travel", "Tour Disponibili", "Processo di Prenotazione", "Politica di Cancellazione", "Contatti"],
  ar: ["عن دوناس ترافيل", "الرحلات المتاحة", "خطوات الحجز", "سياسة الإلغاء", "اتصل بنا"]
};

// Localized helper phrases for response formatting
const LOCALIZED_PHRASES = {
  en: {
    price: "Price: ",
    duration: "Duration: ",
    highlights: "Highlights:\n",
    included: "Included:\n",
    excluded: "Excluded:\n",
    hotels: "Accommodations:\n",
    bookNow: "👉 Book Now: ",
    viewDetails: "👉 Tour Details: ",
    noToursFound: "I couldn't find any tours matching your preferences. Here are some of our popular options instead:",
    similarTours: "Here are some tours you might like based on your search:",
    contactPrompt: "For direct assistance, please contact us at info@dunas-travel.com or visit our Contact page."
  },
  es: {
    price: "Precio: ",
    duration: "Duración: ",
    highlights: "Puntos Destacados:\n",
    included: "Incluye:\n",
    excluded: "No Incluye:\n",
    hotels: "Alojamientos:\n",
    bookNow: "👉 Reservar Ahora: ",
    viewDetails: "👉 Detalles del Tour: ",
    noToursFound: "No pude encontrar tours que coincidan con tus preferencias. Aquí tienes algunas de nuestras opciones más populares:",
    similarTours: "Aquí tienes algunos tours recomendados para ti:",
    contactPrompt: "Para asistencia directa, contáctanos en info@dunas-travel.com o visita nuestra página de Contacto."
  },
  pt: {
    price: "Preço: ",
    duration: "Duração: ",
    highlights: "Destaques:\n",
    included: "Inclui:\n",
    excluded: "Não Inclui:\n",
    hotels: "Hospedagem:\n",
    bookNow: "👉 Reservar Agora: ",
    viewDetails: "👉 Detalhes do Tour: ",
    noToursFound: "Não consegui encontrar pacotes com as suas preferências. Aqui estão algumas das nossas opções mais populares:",
    similarTours: "Aqui estão alguns tours recomendados para você:",
    contactPrompt: "Para assistência direta, entre em contato em info@dunas-travel.com ou visite nossa página de Contato."
  },
  it: {
    price: "Prezzo: ",
    duration: "Durata: ",
    highlights: "Punti Salienti:\n",
    included: "Incluso:\n",
    excluded: "Escluso:\n",
    hotels: "Alloggi:\n",
    bookNow: "👉 Prenota Ora: ",
    viewDetails: "👉 Dettagli del Tour: ",
    noToursFound: "Non ho trovato tour corrispondenti alle tue preferenze. Ecco alcune delle nostre opzioni più popolari:",
    similarTours: "Ecco alcuni tour consigliati per te:",
    contactPrompt: "Per assistenza diretta, contattaci a info@dunas-travel.com o visita la nostra pagina Contatti."
  },
  ar: {
    price: "السعر: ",
    duration: "المدة: ",
    highlights: "أبرز المعالم:\n",
    included: "الخدمات المشمولة:\n",
    excluded: "الخدمات غير المشمولة:\n",
    hotels: "الفنادق والإقامة:\n",
    bookNow: "👉 احجز الآن: ",
    viewDetails: "👉 تفاصيل الرحلة: ",
    noToursFound: "لم أجد رحلات تطابق تفضيلاتك بالضبط. إليك بعض رحلاتنا الأكثر شعبية:",
    similarTours: "إليك بعض الرحلات المقترحة بناءً على بحثك:",
    contactPrompt: "للمساعدة المباشرة، يرجى التواصل معنا على info@dunas-travel.com أو زيارة صفحة اتصل بنا."
  }
};

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Main chatbot conversation processor
 */
async function processMessage(sessionId, messageText, clientLanguage, requestOrigin) {
  const baseUrl = requestOrigin || 'https://www.dunas-travel2026.com';
  const online = isDbConnected();

  // 1. Fetch or create session
  let session;
  if (online) {
    session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = new ChatSession({ sessionId, history: [] });
    }
  } else {
    session = memoryDb.getMemorySession(sessionId);
  }

  // 2. Language & colloquial detection
  const detectedLang = detectLanguage(messageText);
  const activeLang = detectedLang.startsWith('ar') ? detectedLang : (clientLanguage || detectedLang);
  const searchLang = activeLang === 'ar-eg' ? 'ar' : activeLang;

  // 3. Normalize Egyptian Arabic colloquial to MSA for matching
  const normalizedMessage = activeLang === 'ar-eg' ? mapColloquialToMsa(messageText) : messageText;

  // 4. Extract query filters and update session context
  const newFilters = extractFilters(normalizedMessage, activeLang);
  session.context.filters = { ...(session.context.filters || {}), ...newFilters };

  // Save the user's message in the history
  session.history.push({ sender: 'user', text: messageText });
  if (online) {
    await session.save();
  } else {
    memoryDb.saveMemorySession(sessionId, session);
  }

  let responseText = '';
  let similarQuestions = [];
  let tours = [];

  const baseLang = activeLang.split('-')[0]; // Base language e.g. 'ar'
  const phrases = LOCALIZED_PHRASES[baseLang] || LOCALIZED_PHRASES['en'];

  // 5. Check if query is a follow-up about the last tour in context
  const isFollowUp = isQueryFollowUp(normalizedMessage, baseLang);
  const hasLastTour = session.context.lastTourSlug && session.context.lastTourSlug !== '';

  if (isFollowUp && hasLastTour) {
    let lastTour;
    if (online) {
      lastTour = await Tour.findOne({ slug: session.context.lastTourSlug, language: searchLang });
    } else {
      lastTour = memoryDb.getMemoryTours(searchLang).find(t => t.slug === session.context.lastTourSlug);
    }

    if (lastTour) {
      responseText = formatFollowUpResponse(normalizedMessage, lastTour, baseLang, phrases, baseUrl);
      
      // Save and return
      session.history.push({ sender: 'jaider', text: responseText });
      if (online) {
        await session.save();
      } else {
        memoryDb.saveMemorySession(sessionId, session);
      }

      return {
        text: responseText,
        language: activeLang,
        sessionId
      };
    }
  }

  // 6. Direct CompanyInfo Policy/About Lookup
  const policyKey = matchPolicyKeywords(normalizedMessage, baseLang);
  if (policyKey) {
    let policyInfo;
    if (online) {
      policyInfo = await CompanyInfo.findOne({ key: policyKey, language: searchLang });
    } else {
      policyInfo = memoryDb.getMemoryCompanyInfo(policyKey, searchLang);
    }

    if (policyInfo) {
      if (Array.isArray(policyInfo.content)) {
        responseText = `${policyInfo.title}:\n\n` + policyInfo.content.map(item => `• ${item}`).join('\n');
      } else {
        responseText = `${policyInfo.title}:\n\n${policyInfo.content}`;
      }

      // Add a call to action link for booking or contact
      if (policyKey === 'booking_process') {
        responseText += `\n\n${phrases.bookNow}${baseUrl}/bookings`;
      } else if (policyKey !== 'about_us') {
        responseText += `\n\n${phrases.contactPrompt}`;
      }

      if (activeLang === 'ar-eg') {
        responseText = toEgyptianColloquial(responseText);
      }

      session.history.push({ sender: 'jaider', text: responseText });
      if (online) {
        await session.save();
      } else {
        memoryDb.saveMemorySession(sessionId, session);
      }

      return {
        text: responseText,
        language: activeLang,
        sessionId
      };
    }
  }

  // 6.5. Destinations query check
  if (isDestinationsQuery(normalizedMessage, baseLang)) {
    responseText = await buildDestinationsResponse(online, searchLang, baseLang, phrases, baseUrl);
    
    if (activeLang === 'ar-eg') {
      responseText = toEgyptianColloquial(responseText);
    }

    session.history.push({ sender: 'jaider', text: responseText });
    if (online) {
      await session.save();
    } else {
      memoryDb.saveMemorySession(sessionId, session);
    }

    return {
      text: responseText,
      language: activeLang,
      sessionId
    };
  }

  // 7. Search Tours
  if (online) {
    tours = await searchTours(normalizedMessage, searchLang, session.context.filters);
  } else {
    // Basic local filter match fallback
    tours = memoryDb.getMemoryTours(searchLang, session.context.filters);
    // Simple custom title matching
    if (normalizedMessage.trim().length > 2) {
      const q = normalizedMessage.toLowerCase();
      tours = tours.filter(t => t.title.toLowerCase().includes(q) || t.destination.toLowerCase().includes(q));
    }
  }

  // If a single tour is queried specifically or matches with high similarity
  if (tours.length === 1) {
    const matchedTour = tours[0];
    // Update session context
    session.context.lastTourId = matchedTour.id;
    session.context.lastTourSlug = matchedTour.slug;
    session.context.lastDestination = matchedTour.destination;
    
    if (online) {
      await session.save();
    } else {
      memoryDb.saveMemorySession(sessionId, session);
    }

    responseText = formatTourDetails(matchedTour, baseLang, phrases, baseUrl);

    if (activeLang === 'ar-eg') {
      responseText = toEgyptianColloquial(responseText);
    }

    session.history.push({ sender: 'jaider', text: responseText });
    if (online) {
      await session.save();
    } else {
      memoryDb.saveMemorySession(sessionId, session);
    }

    return {
      text: responseText,
      language: activeLang,
      sessionId
    };
  } else if (tours.length > 1) {
    // Return a list of matching tours
    responseText = `${phrases.similarTours}\n\n`;
    tours.slice(0, 4).forEach(tour => {
      responseText += `• *${tour.title}* (${tour.duration})\n  ${phrases.price}${tour.price} USD\n  ${phrases.viewDetails}${baseUrl}/tours/${tour.slug}\n\n`;
    });

    if (activeLang === 'ar-eg') {
      responseText = toEgyptianColloquial(responseText);
    }

    session.history.push({ sender: 'jaider', text: responseText });
    if (online) {
      await session.save();
    } else {
      memoryDb.saveMemorySession(sessionId, session);
    }

    return {
      text: responseText,
      language: activeLang,
      sessionId
    };
  }

  // 8. Search FAQs
  let faqMatches = [];
  if (online) {
    faqMatches = await searchFaqs(normalizedMessage, searchLang);
  } else {
    // Search FAQs in memory
    const inMemFaqs = memoryDb.getMemoryFaqs(searchLang);
    const q = normalizedMessage.toLowerCase();
    faqMatches = inMemFaqs.filter(f => f.question.toLowerCase().includes(q));
  }

  if (faqMatches.length > 0) {
    const bestFaq = faqMatches[0];
    responseText = bestFaq.answer;

    if (activeLang === 'ar-eg') {
      responseText = toEgyptianColloquial(responseText);
    }

    session.history.push({ sender: 'jaider', text: responseText });
    if (online) {
      await session.save();
    } else {
      memoryDb.saveMemorySession(sessionId, session);
    }

    return {
      text: responseText,
      language: activeLang,
      sessionId
    };
  }

  // 9. Fallback & Suggestion Engine
  const fallback = FALLBACK_MESSAGES[activeLang] || FALLBACK_MESSAGES['en'];
  const defaultSuggestions = TOPIC_SUGGESTIONS[baseLang] || TOPIC_SUGGESTIONS['en'];
  
  // Find up to 3 popular tours to append as dynamic suggestions
  let popularTours;
  if (online) {
    popularTours = await Tour.find({ language: searchLang }).limit(3);
  } else {
    popularTours = memoryDb.getMemoryTours(searchLang).slice(0, 3);
  }
  const dynamicSuggestions = popularTours.map(t => t.title).concat(defaultSuggestions);
  similarQuestions = dynamicSuggestions.slice(0, 4);

  responseText = fallback;

  if (activeLang === 'ar-eg') {
    responseText = toEgyptianColloquial(responseText);
  }

  session.history.push({ sender: 'jaider', text: responseText });
  if (online) {
    await session.save();
  } else {
    memoryDb.saveMemorySession(sessionId, session);
  }

  return {
    text: responseText,
    similarQuestions,
    language: activeLang,
    sessionId
  };
}

/**
 * Checks if a query is a relative follow-up like "How much is it?"
 */
function isQueryFollowUp(message, baseLang) {
  const tokens = tokenize(message);
  
  const followUpKeywords = {
    en: ['it', 'cost', 'price', 'much', 'include', 'hotel', 'accommodations', 'stay', 'details', 'more'],
    es: ['cuesta', 'precio', 'cuestan', 'vale', 'valen', 'incluye', 'hotel', 'hoteles', 'alojamiento', 'detalles'],
    pt: ['custa', 'preço', 'custam', 'vale', 'valem', 'inclui', 'hotel', 'hotéis', 'hospedagem', 'detalhes'],
    it: ['costa', 'prezzo', 'costano', 'vale', 'valgono', 'include', 'hotel', 'albergo', 'alloggio', 'dettagli'],
    ar: ['بكم', 'سعر', 'تكلفة', 'تكلفه', 'شامل', 'مشمول', 'فندق', 'فنادق', 'تفاصيل']
  };

  const keywords = followUpKeywords[baseLang] || followUpKeywords['en'];
  return tokens.some(token => keywords.includes(token));
}

/**
 * Formats a response answering a specific field of the last tour referenced
 */
function formatFollowUpResponse(query, tour, baseLang, phrases, baseUrl) {
  const normalizedQuery = query.toLowerCase();

  // Price query
  if (normalizedQuery.includes('price') || normalizedQuery.includes('cost') || normalizedQuery.includes('much') || 
      normalizedQuery.includes('precio') || normalizedQuery.includes('cuesta') || normalizedQuery.includes('vale') ||
      normalizedQuery.includes('preço') || normalizedQuery.includes('custa') || normalizedQuery.includes('prezzo') ||
      normalizedQuery.includes('costa') || normalizedQuery.includes('بكم') || normalizedQuery.includes('سعر') || normalizedQuery.includes('تكلفة')) {
    
    return `${tour.title}: ${phrases.price}${tour.price} USD.\n\n${phrases.bookNow}${baseUrl}/book?tour=${tour.slug}`;
  }

  // Inclusions query
  if (normalizedQuery.includes('include') || normalizedQuery.includes('exclude') || 
      normalizedQuery.includes('incluye') || normalizedQuery.includes('excluye') ||
      normalizedQuery.includes('inclui') || normalizedQuery.includes('exclui') ||
      normalizedQuery.includes('include') || normalizedQuery.includes('esclude') ||
      normalizedQuery.includes('شامل') || normalizedQuery.includes('مشمول')) {
    
    let res = `*${tour.title}*\n\n`;
    if (tour.included && tour.included.length > 0) {
      res += `${phrases.included}${tour.included.map(i => `• ${i}`).join('\n')}\n\n`;
    }
    if (tour.excluded && tour.excluded.length > 0) {
      res += `${phrases.excluded}${tour.excluded.map(e => `• ${e}`).join('\n')}`;
    }
    return res;
  }

  // Accommodation query
  if (normalizedQuery.includes('hotel') || normalizedQuery.includes('stay') || normalizedQuery.includes('accommodation') ||
      normalizedQuery.includes('alojamiento') || normalizedQuery.includes('hospedagem') || normalizedQuery.includes('alloggi') ||
      normalizedQuery.includes('فندق') || normalizedQuery.includes('فنادق')) {
    
    let res = `*${tour.title} — ${phrases.hotels}*\n`;
    if (tour.hotelCategory) {
      res += `Category: ${tour.hotelCategory}\n\n`;
    }
    if (tour.hotels) {
      if (Array.isArray(tour.hotels)) {
        res += tour.hotels.map(h => `• ${h}`).join('\n');
      } else if (typeof tour.hotels === 'object') {
        for (const key in tour.hotels) {
          res += `*${key}*:\n` + tour.hotels[key].map(h => `  • ${h}`).join('\n') + '\n';
        }
      }
    } else {
      res += "Standard 4* & 5* hotels are included in this tour.";
    }
    return res;
  }

  // Default fallback: return general overview
  return formatTourDetails(tour, baseLang, phrases, baseUrl);
}

/**
 * Matches company policy/about keywords and returns their key
 */
function matchPolicyKeywords(message, baseLang) {
  const query = message.toLowerCase();

  const keywords = {
    about_us: {
      en: ['about us', 'about you', 'about the company', 'who are you', 'what is dunas travel', 'dunas travel', 'dunas-travel', 'agency', 'company profile'],
      es: ['sobre nosotros', 'quienes somos', 'sobre la empresa', 'quiénes sois', 'qué es dunas travel', 'dunas travel', 'agencia'],
      pt: ['sobre nós', 'quem somos', 'sobre a empresa', 'quem são vocês', 'o que é dunas travel', 'dunas travel', 'agência'],
      it: ['su di noi', 'chi siamo', 'sulla società', 'chi siete', 'cos\'è dunas travel', 'dunas travel', 'agenzia'],
      ar: ['عن الشركة', 'من انتم', 'من أنتم', 'معلومات عن الشركة', 'دوناس ترافيل', 'مين انت', 'مين انتوا', 'دونات ترافيل', 'الشركة بتاعتكم', 'وكالة', 'شركتكم']
    },
    booking_process: {
      en: ['book', 'booking', 'reserve', 'reservation', 'how to book'],
      es: ['reservar', 'reserva', 'reservación', 'como reservar'],
      pt: ['reservar', 'reserva', 'como reservar', 'agendar'],
      it: ['prenotare', 'prenotazione', 'come prenotare'],
      ar: ['حجز', 'احجز', 'طريقة الحجز']
    },
    cancellation_policy: {
      en: ['cancel', 'cancellation', 'refund', 'cancel policy'],
      es: ['cancelar', 'cancelación', 'reembolso', 'política de cancelación'],
      pt: ['cancelar', 'cancelamento', 'reembolso', 'política de cancelamento'],
      it: ['cancellare', 'cancellazione', 'rimborso', 'politica di cancellazione'],
      ar: ['الغاء', 'إلغاء', 'استرداد', 'استرجاع', 'سياسة الإلغاء']
    },
    payment_methods: {
      en: ['payment', 'pay', 'credit card', 'stripe', 'paypal', 'deposit'],
      es: ['pago', 'pagar', 'tarjeta', 'métodos de pago', 'depósito'],
      pt: ['pagamento', 'pagar', 'cartão', 'métodos de pagamento', 'depósito'],
      it: ['pagamento', 'pagare', 'carta', 'metodi di pagamento', 'acconto'],
      ar: ['دفع', 'الدفع', 'طرق الدفع', 'فيزا', 'كارت']
    },
    visa_services: {
      en: ['visa', 'visas', 'passport', 'visa service'],
      es: ['visado', 'visados', 'visa', 'visas', 'pasaporte'],
      pt: ['visto', 'vistos', 'passaporte'],
      it: ['visto', 'visti', 'passaporto'],
      ar: ['فيزا', 'الفيزا', 'تأشيرة', 'تاشيرة', 'تأشيرات', 'جواز']
    },
    contact_info: {
      en: ['contact', 'email', 'phone', 'whatsapp', 'address', 'office', 'number'],
      es: ['contacto', 'email', 'correo', 'teléfono', 'whatsapp', 'dirección', 'oficina'],
      pt: ['contato', 'email', 'telefone', 'whatsapp', 'endereço', 'escritório'],
      it: ['contatto', 'email', 'telefono', 'whatsapp', 'indirizzo', 'ufficio'],
      ar: ['اتصال', 'اتصل', 'تواصل', 'رقم', 'تليفون', 'عنوان', 'واتساب', 'ايميل']
    }
  };

  let matchedKey = null;
  Object.keys(keywords).forEach(key => {
    const list = keywords[key][baseLang] || keywords[key]['en'];
    const matched = list.some(kw => query.includes(kw));
    if (matched) matchedKey = key;
  });

  return matchedKey;
}

/**
 * Formats a clean text response detailing a single tour
 */
function formatTourDetails(tour, baseLang, phrases, baseUrl) {
  let details = `✨ *${tour.title}* ✨\n`;
  if (tour.subtitle) {
    details += `${tour.subtitle}\n`;
  }
  
  details += `\n📅 ${phrases.duration}${tour.duration}\n💰 ${phrases.price}${tour.price} USD\n\n`;

  if (tour.overview) {
    details += `*Overview:*\n${tour.overview}\n\n`;
  }

  if (tour.highlights && tour.highlights.length > 0) {
    details += `*${phrases.highlights}*`;
    tour.highlights.slice(0, 5).forEach(h => {
      details += `• ${h}\n`;
    });
    details += '\n';
  }

  if (tour.included && tour.included.length > 0) {
    details += `*${phrases.included}*`;
    tour.included.slice(0, 4).forEach(i => {
      details += `• ${i}\n`;
    });
    details += '\n';
  }

  details += `${phrases.viewDetails}${baseUrl}/tours/${tour.slug}\n`;
  details += `${phrases.bookNow}${baseUrl}/book?tour=${tour.slug}`;

  return details;
}

function tokenize(text) {
  return text.toLowerCase().split(/[\s,.?!():;•\-\/*]+/);
}

/**
 * Checks if query is asking for a list of travel destinations
 */
function isDestinationsQuery(message, baseLang) {
  const query = message.toLowerCase();
  const keywords = {
    en: ['destinations', 'countries', 'where do you travel', 'where do you go', 'where can i go', 'places', 'list of destinations', 'packages for which countries'],
    es: ['destinos', 'países', 'países', 'dónde viajan', 'dónde ir', 'lugares', 'lista de destinos'],
    pt: ['destinos', 'países', 'para onde viajam', 'onde ir', 'lugares', 'lista de destinos'],
    it: ['destinazioni', 'paesi', 'dove viaggiate', 'dove andare', 'luoghi', 'lista delle destinazioni'],
    ar: ['وجهات', 'واجهات', 'بلاد', 'دول', 'اماكن', 'أماكن', 'بتسافروا فين', 'بتروحوا فين', 'الوجهات', 'البلدان', 'المناطق']
  };
  const list = keywords[baseLang] || keywords['en'];
  return list.some(kw => query.includes(kw));
}

/**
 * Builds a dynamic, localized summary of available destinations and package counts
 */
async function buildDestinationsResponse(online, searchLang, baseLang, phrases, baseUrl) {
  let destText = '';
  if (baseLang === 'ar') {
    destText = '📍 وجهاتنا السياحية المتاحة والرحلات لكل وجهة:\n\n';
  } else if (baseLang === 'es') {
    destText = '📍 Nuestros destinos turísticos y tours disponibles:\n\n';
  } else if (baseLang === 'pt') {
    destText = '📍 Nossos destinos turísticos e pacotes disponíveis:\n\n';
  } else if (baseLang === 'it') {
    destText = '📍 Le nostre destinazioni turistiche e i tour disponibili:\n\n';
  } else {
    destText = '📍 Our travel destinations and available tours:\n\n';
  }

  const availableDests = ['egypt', 'turkey', 'jordan', 'tunisia', 'greece'];
  const DEST_DETAILS = {
    egypt: {
      name: { en: 'Egypt 🇪🇬', es: 'Egipto 🇪🇬', pt: 'Egito 🇪🇬', it: 'Egitto 🇪🇬', ar: 'جمهورية مصر العربية 🇪🇬' },
      desc: {
        en: 'Discover ancient wonders, Pyramids, Nile Cruises (Luxor & Aswan), and resorts in Hurghada/Sharm.',
        es: 'Descubre maravillas antiguas, las Pirámides, cruceros por el Nilo y resorts en Hurgada/Sharm.',
        pt: 'Descubra maravilhas antigas, Pirâmides, Cruzeiros no Nilo e resorts em Hurghada/Sharm.',
        it: 'Scopri antiche meraviglie, le Piramidi, crociere sul Nilo e resort a Hurghada/Sharm.',
        ar: 'اكتشف الأهرامات العريقة، رحلات كروز النيل (الأقصر وأسوان)، ومنتجعات الغردقة وشرم الشيخ.'
      }
    },
    turkey: {
      name: { en: 'Turkey 🇹🇷', es: 'Turquía 🇹🇷', pt: 'Turquia 🇹🇷', it: 'Turchia 🇹🇷', ar: 'تركيا 🇹🇷' },
      desc: {
        en: 'Explore Istanbul, Cappadocia hot air balloons, and Ephesus ruins.',
        es: 'Explora Estambul, globos en Capadocia y ruinas de Éfeso.',
        pt: 'Explore Istambul, balões na Capadócia e ruínas de Éfeso.',
        it: 'Esplora Istanbul, mongolfiere in Cappadocia e le rovine di Efeso.',
        ar: 'استمتع بإسطنبول الساحرة، مناطيد كابادوكيا، وآثار إفسس.'
      }
    },
    jordan: {
      name: { en: 'Jordan 🇯🇴', es: 'Jordania 🇯🇴', pt: 'Jordânia 🇯🇴', it: 'Giordania 🇯🇴', ar: 'الأردن 🇯🇴' },
      desc: {
        en: 'Visit the rose-red city of Petra, Wadi Rum desert, and float in the Dead Sea.',
        es: 'Visita Petra, el desierto de Wadi Rum y flota en el Mar Muerto.',
        pt: 'Visite Petra, o deserto de Wadi Rum e flutue no Mar Morto.',
        it: 'Visita Petra, il desierto di Wadi Rum e il Mar Morto.',
        ar: 'شاهد المدينة الوردية البتراء، وادي رم، واستمتع بالبحر الميت.'
      }
    },
    tunisia: {
      name: { en: 'Tunisia 🇹🇳', es: 'Túnez 🇹🇳', pt: 'Tunísia 🇹🇳', it: 'Tunisia 🇹🇳', ar: 'تونس 🇹🇳' },
      desc: {
        en: 'Enjoy Carthage history, Sidi Bou Said, and Sahara desert safaris.',
        es: 'Disfruta de la historia de Cartago, Sidi Bou Said y safaris en el Sahara.',
        pt: 'Desfrute da história de Cartago, Sidi Bou Said e safáris no Saara.',
        it: 'Goditi la storia di Cartagine, Sidi Bou Said e i safari nel Sahara.',
        ar: 'اكتشف آثار قرطاج، قرية سيدي بو سعيد، وسفاري الصحراء التونسية.'
      }
    },
    greece: {
      name: { en: 'Greece 🇬🇷', es: 'Grecia 🇬🇷', pt: 'Grécia 🇬🇷', it: 'Grecia 🇬🇷', ar: 'اليونان 🇬🇷' },
      desc: {
        en: 'Experience romantic getaways in Santorini and history in Athens.',
        es: 'Experimenta escapadas románticas en Santorini e historia en Atenas.',
        pt: 'Viva viagens românticas em Santorini e a história em Atenas.',
        it: 'Vivi fughe romantiche a Santorini e la storia ad Atene.',
        ar: 'عش أجمل الأجواء الرومانسية في سانتوريني واستكشف التاريخ في أثينا.'
      }
    }
  };

  for (const d of availableDests) {
    let count = 0;
    if (online) {
      count = await Tour.countDocuments({ language: searchLang, destination: d });
    } else {
      count = memoryDb.getMemoryTours(searchLang).filter(t => t.destination === d).length;
    }
    
    if (count > 0) {
      const name = DEST_DETAILS[d]?.name[baseLang] || DEST_DETAILS[d]?.name['en'];
      const desc = DEST_DETAILS[d]?.desc[baseLang] || DEST_DETAILS[d]?.desc['en'];
      destText += `📍 *${name}*\n${desc}\n  • ${phrases.similarTours.replace(':', '')}: ${count} packages\n  👉 ${phrases.viewDetails}${baseUrl}/destinations/${d}\n\n`;
    }
  }

  if (baseLang === 'ar') {
    destText += 'اكتب لي اسم الوجهة التي تفضلها (مثال: "رحلات مصر" أو "رحلات تركيا") وسأعرض لك البرامج المتاحة وأسعارها!';
  } else if (baseLang === 'es') {
    destText += '¡Escríbeme el nombre del destino que prefieras (ej. "tours en Egipto") y te mostraré los programas y precios disponibles!';
  } else {
    destText += 'Just type the name of the destination you prefer (e.g. "Egypt tours") and I will show you the available packages and prices!';
  }

  return destText;
}

module.exports = {
  processMessage
};
