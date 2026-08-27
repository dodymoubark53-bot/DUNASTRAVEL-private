/**
 * titleHelper.js — Unified Title & Localized Text Resolver for Dunas Travel
 *
 * Ensures that any tour, program, destination, or service title/description
 * resolves cleanly into the active language without leaking raw keys (like "mct001.title", "data.xyz")
 * or falling back to raw keys.
 */

// Fallback dictionary for known static and multi-country tour codes
const staticTourTitles = {
  'mct001.title': {
    en: 'Egypt & Turkey Grand Discovery 15 Days',
    es: 'Gran Descubrimiento de Egipto y Turquía 15 Días',
    ar: 'اكتشاف مصر وتركيا الكبرى 15 يوماً',
    pt: 'Grande Descoberta do Egito e Turquia 15 Dias',
    it: 'Grande Scoperta d\'Egitto e Turchia 15 Giorni',
  },
  'mct002.title': {
    en: 'Egypt, Jordan & Jerusalem Sacred Odyssey 14 Days',
    es: 'Odisea Sagrada de Egipto, Jordania y Jerusalén 14 Días',
    ar: 'رحلة مصر والأردن والقدس المقدسة 14 يوماً',
    pt: 'Odisseia Sagrada de Egito, Jordânia e Jerusalém 14 Dias',
    it: 'Odissea Sacra d\'Egitto, Giordania e Gerusalemme 14 Giorni',
  },
  'mct003.title': {
    en: 'Egypt & Dubai Luxury Highlights 12 Days',
    es: 'Lo Mejor del Lujo en Egipto y Dubái 12 Días',
    ar: 'أبرز معالم الفخامة في مصر ودبي 12 يوماً',
    pt: 'Destaques de Luxo do Egito e Dubai 12 Dias',
    it: 'Il Meglio del Lusso d\'Egitto e Dubai 12 Giorni',
  },
  'mct004.title': {
    en: 'Egypt & Morocco Imperial Horizons 16 Days',
    es: 'Horizontes Imperiales de Egipto y Marruecos 16 Días',
    ar: 'آفاق مصر والمغرب الإمبراطورية 16 يوماً',
    pt: 'Horizontes Imperiais do Egito e Marrocos 16 Dias',
    it: 'Orizzonti Imperiali d\'Egitto e Marocco 16 Giorni',
  },
  'mct005.title': {
    en: 'Stars of the Middle East 16 Days',
    es: 'Estrellas del Medio Oriente 16 Días',
    ar: 'نجوم الشرق الأوسط 16 يوماً',
    pt: 'Estrelas do Oriente Médio 16 Dias',
    it: 'Stelle del Medio Oriente 16 Giorni',
  },
  'mct006.title': {
    en: 'Treasures of Egypt & Tunisia 16 Days',
    es: 'Tesoros de Egipto y Túnez 16 Días',
    ar: 'كنوز مصر وتونس 16 يوماً',
    pt: 'Tesouros do Egito e Tunísia 16 Dias',
    it: 'Tesori d\'Egitto e Tunisia 16 Giorni',
  },
  'mct007.title': {
    en: 'Egypt & Dubai Oasis Journey 13 Days',
    es: 'Egipto y Dubái Viaje de Oasis 13 Días',
    ar: 'رحلة واحة مصر ودبي 13 يوماً',
    pt: 'Egito e Dubai Viagem Oásis 13 Dias',
    it: 'Egitto e Dubai Viaggio Oasi 13 Giorni',
  },
  'mct008.title': {
    en: 'Spices of Egypt & Morocco 14 Days',
    es: 'Especias de Egipto y Marruecos 14 Días',
    ar: 'توابل مصر والمغرب 14 يوماً',
    pt: 'Especiarias do Egito e Marrocos 14 Dias',
    it: 'Spezie d\'Egitto e Marocco 14 Giorni',
  },
  'mct009.title': {
    en: 'Jewels of Egypt & Jordan 11 Days',
    es: 'Joyas de Egipto y Jordania 11 Días',
    ar: 'جواهر مصر والأردن 11 يوماً',
    pt: 'Jóias do Egito e Jordânia 11 Dias',
    it: 'Gioielli d\'Egitto e Giordania 11 Giorni',
  },
  'tunisia_tour_title': {
    ar: 'برنامج تونس الخضراء المتميز',
    es: 'Circuito Túnez Verde Premium - 8 Días / 7 Noches',
    en: 'Premium Green Tunisia Tour - 8 Days / 7 Nights',
    it: 'Tour Tunisia Verde Premium - 8 Giorni / 7 Notti',
    pt: 'Circuito Tunísia Verde Premium - 8 Dias / 7 Noites',
  },
  'Circuito Túnez - 8 Días / 7 Noches': {
    ar: 'برنامج تونس الخضراء المتميز',
    es: 'Circuito Túnez Verde Premium - 8 Días / 7 Noches',
    en: 'Premium Green Tunisia Tour - 8 Days / 7 Nights',
    it: 'Tour Tunisia Verde Premium - 8 Giorni / 7 Notti',
    pt: 'Circuito Tunísia Verde Premium - 8 Dias / 7 Noites',
  },
  'completoEgypt.title': {
    en: 'Complete Egypt Grand Tour 8 Days',
    es: 'Gran Tour Completo de Egipto 8 Días',
    ar: 'جولة مصر الكبرى الشاملة 8 أيام',
    pt: 'Grande Tour Completo pelo Egito 8 Dias',
    it: 'Gran Tour Completo dell\'Egitto 8 Giorni',
  },
};

/**
 * Resolves any text, translation key, or multi-language object into localized string
 */
export function resolveLocalizedText(val, t = (k) => k, lang = 'en') {
  if (!val) return '';

  // If it's already an object { en: '...', ar: '...' }
  if (typeof val === 'object' && val !== null) {
    return val[lang] || val.en || val.ar || val.es || Object.values(val)[0] || '';
  }

  if (typeof val !== 'string') return String(val);

  const cleanVal = val.trim();

  // Check known hardcoded dictionary
  if (staticTourTitles[cleanVal]) {
    const entry = staticTourTitles[cleanVal];
    return entry[lang] || entry.en || cleanVal;
  }

  if (typeof t === 'function') {
    // 1. Try exact key lookup
    const direct = t(cleanVal);
    if (direct && direct !== cleanVal) return direct;

    // 2. Try with "data." prefix
    if (!cleanVal.startsWith('data.')) {
      const dataPrefixed = t(`data.${cleanVal}`);
      if (dataPrefixed && dataPrefixed !== `data.${cleanVal}`) return dataPrefixed;
    }

    // 3. Try with "data." stripped
    if (cleanVal.startsWith('data.')) {
      const stripped = cleanVal.replace(/^data\./, '');
      const translatedStripped = t(stripped);
      if (translatedStripped && translatedStripped !== stripped) return translatedStripped;
    }
  }

  return cleanVal.startsWith('data.') ? cleanVal.replace(/^data\./, '') : cleanVal;
}

/**
 * Resolves a tour's title safely
 */
export function resolveTourTitle(tour, t, lang = 'en') {
  if (!tour) return '';
  if (tour.titleKey && typeof t === 'function') {
    const translated = t(tour.titleKey);
    if (translated && translated !== tour.titleKey) return translated;
  }
  return resolveLocalizedText(tour.title || tour.name || tour.slug, t, lang);
}

/**
 * Resolves a tour's overview / description safely
 */
export function resolveTourOverview(tour, t, lang = 'en') {
  if (!tour) return '';
  const val = tour.overview || tour.description || tour.desc || tour.overviewKey;
  return resolveLocalizedText(val, t, lang);
}

/**
 * Resolves a tour's duration safely
 */
export function resolveTourDuration(tour, t, lang = 'en') {
  if (!tour) return '';
  const val = tour.duration || tour.durationKey;
  return resolveLocalizedText(val, t, lang);
}

export default {
  resolveLocalizedText,
  resolveTourTitle,
  resolveTourOverview,
  resolveTourDuration,
};
