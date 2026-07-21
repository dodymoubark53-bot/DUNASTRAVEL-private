/**
 * NLP Helper Utilities for Jaider Chatbot
 * Handles language detection, text normalization, Arabic transformations, and smart filter extraction.
 */

const STOPWORDS = {
  ar: ['من', 'في', 'على', 'إلى', 'هذا', 'هل', 'كيف', 'أين', 'ما', 'يا', 'مع', 'عن', 'هو', 'هي', 'تم', 'كان'],
  en: ['the', 'is', 'are', 'of', 'to', 'and', 'a', 'in', 'how', 'what', 'where', 'can', 'you', 'i', 'do', 'my', 'want', 'to', 'go', 'show', 'me'],
  es: ['el', 'la', 'los', 'las', 'de', 'y', 'en', 'un', 'una', 'como', 'que', 'donde', 'puedo', 'mi', 'para', 'con', 'quiero', 'ir'],
  pt: ['o', 'a', 'os', 'as', 'de', 'e', 'em', 'um', 'uma', 'como', 'que', 'onde', 'posso', 'meu', 'para', 'com', 'quero', 'ir'],
  it: ['il', 'la', 'i', 'gli', 'di', 'e', 'in', 'un', 'una', 'come', 'che', 'dove', 'posso', 'mio', 'per', 'con', 'voglio', 'andare']
};

const EGYPTIAN_KEYWORDS = [
  'عايز', 'عايزة', 'عاوز', 'عاوزة', 'عايزين', 'عاوزين', 'بكام', 'فين', 'ازاي', 'إزاي', 'ايه', 'إيه', 'ليه', 'مين', 'ده',
  'دي', 'دول', 'عشان', 'علشان', 'مش', 'اوي', 'أوي', 'كده', 'كدا', 'شغال', 'دلوقتي', 'دلوأتي',
  'بتاع', 'bta3', 'بتاعت', 'بتوع', 'لسه', 'لسة', 'خالص', 'حاجة', 'معلش', 'تمام', 'احجز', 'أحجز', 'بينا',
  'يافندم', 'يا فندم', 'بأد', 'بقد', 'بكام', 'فنادق', 'أوضة', 'اوضة', 'شنط', 'هدوم', 'عربية', 'أتوبيس'
];

const DESTINATIONS = [
  { id: 'egypt', names: { en: 'egypt', es: 'egipto', pt: 'egito', it: 'egitto', ar: 'مصر' } },
  { id: 'luxor', names: { en: 'luxor', es: 'luxor', pt: 'luxor', it: 'luxor', ar: 'الأقصر' } },
  { id: 'cairo', names: { en: 'cairo', es: 'el cairo', pt: 'cairo', it: 'il cairo', ar: 'القاهرة' } },
  { id: 'aswan', names: { en: 'aswan', es: 'asuan', pt: 'aswan', it: 'assuan', ar: 'أسوان' } },
  { id: 'alexandria', names: { en: 'alexandria', es: 'alejandría', pt: 'alexandria', it: 'alessandria', ar: 'الإسكندرية' } },
  { id: 'sharm', names: { en: 'sharm', es: 'sharm', pt: 'sharm', it: 'sharm', ar: 'شرم' } },
  { id: 'hurghada', names: { en: 'hurghada', es: 'hurghada', pt: 'hurghada', it: 'hurghada', ar: 'الغردقة' } },
  { id: 'greece', names: { en: 'greece', es: 'grecia', pt: 'grécia', it: 'grecia', ar: 'اليونان' } },
  { id: 'turkey', names: { en: 'turkey', es: 'turquía', pt: 'turquia', it: 'turchia', ar: 'تركيا' } },
  { id: 'tunisia', names: { en: 'tunisia', es: 'túnez', pt: 'tunísia', it: 'tunisia', ar: 'تونس' } },
  { id: 'jordan', names: { en: 'jordan', es: 'jordania', pt: 'jordânia', it: 'giordania', ar: 'الأردن' } }
];

const FILTER_KEYWORDS = {
  family: {
    en: ['family', 'children', 'kids', 'family-friendly', 'child'],
    es: ['familia', 'niños', 'hijos', 'familiar', 'niño'],
    pt: ['família', 'crianças', 'filhos', 'familiar', 'criança'],
    it: ['famiglia', 'bambini', 'figli', 'familiare', 'bambino'],
    ar: ['عائلة', 'عائلي', 'أطفال', 'اطفال', 'اولاد', 'أولاد']
  },
  honeymoon: {
    en: ['honeymoon', 'romantic', 'honeymooners', 'couple', 'love'],
    es: ['luna de miel', 'romántico', 'romantico', 'novios', 'pareja'],
    pt: ['lua de mel', 'romântico', 'romantico', 'casal', 'namorados'],
    it: ['luna di miele', 'romantico', 'coppia', 'sposi'],
    ar: ['شهر عسل', 'شهر العسل', 'رومانسي', 'كوبل', 'زوجين']
  },
  adventure: {
    en: ['adventure', 'safari', 'desert', 'hiking', 'trekking', '4x4', 'active'],
    es: ['aventura', 'safari', 'desierto', 'senderismo', 'trekking', 'adrenalina'],
    pt: ['aventura', 'safári', 'safari', 'deserto', 'trilha', 'trekking'],
    it: ['avventura', 'safari', 'deserto', 'trekking', 'escursione'],
    ar: ['مغامرة', 'سفاري', 'صحراء', 'مغامرات', 'جبل']
  },
  luxury: {
    en: ['luxury', '5 star', 'premium', 'deluxe', 'luxurious', 'vip'],
    es: ['lujo', '5 estrellas', 'premium', 'deluxe', 'lujoso', 'vip'],
    pt: ['luxo', '5 estrelas', 'premium', 'deluxe', 'luxuoso', 'vip'],
    it: ['lusso', '5 stelle', 'premium', 'deluxe', 'lussuoso', 'vip'],
    ar: ['فاخر', '5 نجوم', 'مميز', 'راقي', 'في اي بي']
  },
  cultural: {
    en: ['cultural', 'history', 'historical', 'museum', 'ruins', 'temple', 'temples', 'pyramid', 'pyramids'],
    es: ['cultural', 'historia', 'histórico', 'museo', 'ruinas', 'templo', 'templos', 'pirámide', 'pirámides'],
    pt: ['cultural', 'história', 'histórico', 'museu', 'ruínas', 'templo', 'templos', 'pirâmide', 'pirâmides'],
    it: ['culturale', 'storia', 'storico', 'museo', 'rovine', 'tempio', 'templi', 'piramide', 'piramidi'],
    ar: ['تاريخي', 'ثقافي', 'معبد', 'معابد', 'متحف', 'متاحف', 'أهرامات', 'آثار', 'اثار']
  }
};

/**
 * Normalizes Arabic letters for consistent matching
 */
const normalizeArabic = (text) => {
  if (!text) return '';
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ئ/g, 'ء')
    .replace(/ؤ/g, 'ء')
    .replace(/[\u064B-\u0652]/g, ''); // Remove tashkeel
};

/**
 * Tokenizes text with normalization and punctuation removal
 */
const tokenize = (text) => {
  if (!text) return [];
  const normalized = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // removes accents
    .replace(/[\u064B-\u0652]/g, "") // removes Arabic Tashkeel
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'¿¡]/g, " "); // removes punctuation
    
  return normalized.split(/\s+/).filter(word => word.length > 0);
};

/**
 * Detects the language of a user message
 */
const detectLanguage = (text) => {
  if (!text) return 'en';
  
  // 1. Check for Arabic characters
  if (/[\u0600-\u06FF]/.test(text)) {
    const rawWords = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u064B-\u0652]/g, "")
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'¿¡]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 0)
      .map(normalizeArabic);

    const hasEgyptian = rawWords.some(word => 
      EGYPTIAN_KEYWORDS.map(normalizeArabic).includes(word)
    );
    
    return hasEgyptian ? 'ar-eg' : 'ar';
  }

  // 2. Count matching stop words
  const tokens = tokenize(text);
  const scores = { en: 0, es: 0, pt: 0, it: 0 };
  
  tokens.forEach(token => {
    ['en', 'es', 'pt', 'it'].forEach(lang => {
      if (STOPWORDS[lang] && STOPWORDS[lang].includes(token)) {
        scores[lang]++;
      }
    });
  });

  let bestLang = 'en';
  let maxScore = 0;
  Object.keys(scores).forEach(lang => {
    if (scores[lang] > maxScore) {
      maxScore = scores[lang];
      bestLang = lang;
    }
  });

  return maxScore > 0 ? bestLang : 'en';
};

/**
 * Maps Egyptian Colloquial Arabic terms to Modern Standard Arabic for similarity matching
 */
const mapColloquialToMsa = (query) => {
  let mapped = query;
  const mappings = [
    [/\b(عايز|عاوز|حابب)\b/g, 'أريد'],
    [/\b(عايزة|عاوزة)\b/g, 'أريد'],
    [/\b(عايزين|عاوزين)\b/g, 'نريد'],
    [/\bبكام\b/g, 'بكم سعر'],
    [/\b(ازاي|إزاي)\b/g, 'كيف'],
    [/\bفين\b/g, 'أين'],
    [/\b(ايه|إيه)\b/g, 'ما'],
    [/\bليه\b/g, 'لماذا'],
    [/\b(امتى|إمتى)\b/g, 'متى'],
    [/\b(عشان|علشان)\b/g, 'لأن'],
    [/\bمش\b/g, 'لا'],
    [/\b(اوضة|أوضة)\b/g, 'غرفة'],
    [/\b(شنط|حقائب)\b/g, 'حقائب'],
    [/\bعربية\b/g, 'سيارة']
  ];
  mappings.forEach(([pattern, repl]) => {
    mapped = mapped.replace(pattern, repl);
  });
  return mapped;
};

/**
 * Translates Modern Standard Arabic answers back to Egyptian Colloquial
 */
const toEgyptianColloquial = (text) => {
  if (!text) return text;
  
  let egText = text;
  const replacements = [
    [/\bنعم\b/g, 'أيوة طبعاً'],
    [/\bيمكنك\b/g, 'تقدر'],
    [/\bيمكنكم\b/g, 'تقدروا'],
    [/\bتستطيع\b/g, 'تقدر'],
    [/\bتستطيعون\b/g, 'تقدروا'],
    [/\bيرجى\b/g, 'يا ريت'],
    [/\bالرجاء\b/g, 'لو سمحت'],
    [/\bسوف\b/g, 'هنـ'],
    [/\bسوف نقوم\b/g, 'هنقوم'],
    [/\bسوف يتم\b/g, 'هييتم'],
    [/\bلكن\b/g, 'بس'],
    [/\bالذي\b/g, 'اللي'],
    [/\bالتي\b/g, 'اللي'],
    [/\bالذين\b/g, 'اللي'],
    [/\bهذا\b/g, 'ده'],
    [/\bهذه\b/g, 'دي'],
    [/\bهؤلاء\b/g, 'دول'],
    [/\bأريد\b/g, 'عايز'],
    [/\bنريد\b/g, 'عايزين'],
    [/\bلماذا\b/g, 'ليه'],
    [/\bكيف\b/g, 'إزاي'],
    [/\bمتى\b/g, 'إمتى'],
    [/\bأين\b/g, 'فين'],
    [/\bماذا\b/g, 'إيه'],
    [/\bبكم\b/g, 'بكام'],
    [/\bسنوات\b/g, 'سنين'],
    [/\bأيام\b/g, 'أيام'],
    [/\bيوم\b/g, 'يوم'],
    [/\bجداً\b/g, 'أوي'],
    [/\bإطلاقاً\b/g, 'خالص'],
    [/\bمرحباً\b/g, 'أهلاً بيك'],
    [/\bأهلاً بك\b/g, 'أهلاً بيك يا فندم'],
    [/\bشكراً لك\b/g, 'شكراً ليك جداً'],
    [/\bتواصل معنا\b/g, 'كلمّنا'],
    [/\bاتصل بنا\b/g, 'اتصل بينا'],
    [/\bإلغاء\b/g, 'إلغاء'],
    [/\bالدفع\b/g, 'الدفع'],
    [/\bبطاقة الائتمان\b/g, 'الفيزا أو الكارت'],
    [/\bتأشيرة\b/g, 'فيزا'],
    [/\bتأشيرات\b/g, 'فيز'],
    [/\bغرفة\b/g, 'أوضة'],
    [/\bغرف\b/g, 'أوض'],
    [/\bحقائب\b/g, 'شنط'],
    [/\bملابس\b/g, 'هدوم'],
    [/\bتذكرة\b/g, 'تذكرة'],
    [/\bتذاكر\b/g, 'تذاكر'],
    [/\bسيارة\b/g, 'عربية'],
    [/\bسيارات\b/g, 'عربيات'],
    [/\bحافلة\b/g, 'أتوبيس'],
    [/\bحافلات\b/g, 'أتوبيسات'],
    [/\bشخص\b/g, 'فرد'],
    [/\bأشخاص\b/g, 'أفراد'],
    [/\bطفل\b/g, 'طفل'],
    [/\bأطفال\b/g, 'أطفال'],
    [/\bجواز سفر\b/g, 'الباسبور'],
    [/\bجوازات سفر\b/g, 'باسبورات']
  ];

  replacements.forEach(([pattern, repl]) => {
    egText = egText.replace(pattern, repl);
  });

  if (!egText.includes('يا فندم')) {
    egText = egText.replace(/(أيوة طبعاً|أهلاً بيك|شكراً ليك)/g, '$1 يا فندم');
  }

  egText = egText.replace(/هنـ(ن|ت|ي|أ)/g, 'هنـ$1');
  return egText;
};

/**
 * Extracts smart filters (budget, duration, destination, category tags) from user text
 */
const extractFilters = (text, lang) => {
  const filters = {};
  if (!text) return filters;
  
  const tokens = tokenize(text);
  const normalizedText = text.toLowerCase();

  // 1. Extract Budget
  // Matches dollar, usd, egp, euro or bare numbers like "I have 800", "budget of 1200", "800$"
  const budgetRegex = /(?:[\$€£]|\busd\b|\beur\b|\begp\b)?\s*(\d{3,5})\s*(?:\bUSD\b|\bEUR\b|\bEGP\b|dollars|dollar|euros|euro|جنيه|دولار)?/i;
  const budgetMatch = normalizedText.match(budgetRegex);
  if (budgetMatch) {
    const budgetVal = parseInt(budgetMatch[1], 10);
    // Sanity check for budget range (excluding years or small IDs)
    if (budgetVal >= 50 && budgetVal <= 25000) {
      filters.maxPrice = budgetVal;
    }
  }

  // 2. Extract Duration
  // Matches "5 days", "5-day", "5 dias", "5 giorni", "5 ليال"
  const durationRegex = /(\d{1,2})\s*(?:day|days|dias|dia|giorni|giorno|يوم|أيام|ايام|ليال|ليالي)/i;
  const durationMatch = normalizedText.match(durationRegex);
  if (durationMatch) {
    filters.durationDays = parseInt(durationMatch[1], 10);
  }

  // 3. Extract Destination
  // Check if any destination name appears in tokens
  const detectedDestinations = [];
  DESTINATIONS.forEach(dest => {
    const names = Object.values(dest.names);
    const matched = names.some(name => {
      const nameTokens = tokenize(name);
      return nameTokens.every(t => tokens.includes(t));
    });
    if (matched) {
      detectedDestinations.push(dest.id);
    }
  });
  if (detectedDestinations.length > 0) {
    filters.destinations = detectedDestinations;
  }

  // 4. Extract Categories/Interests
  const baseLang = lang.split('-')[0]; // Map 'ar-eg' to 'ar'
  Object.keys(FILTER_KEYWORDS).forEach(cat => {
    const keywords = FILTER_KEYWORDS[cat][baseLang] || FILTER_KEYWORDS[cat]['en'];
    const hasCategoryMatch = keywords.some(keyword => normalizedText.includes(keyword));
    if (hasCategoryMatch) {
      filters[cat] = true;
    }
  });

  return filters;
};

module.exports = {
  detectLanguage,
  normalizeArabic,
  mapColloquialToMsa,
  toEgyptianColloquial,
  extractFilters,
  tokenize
};
