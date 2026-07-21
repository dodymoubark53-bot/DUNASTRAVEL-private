import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import enJson from '../i18n/locales/en.json';
import arJson from '../i18n/locales/ar.json';
import esJson from '../i18n/locales/es.json';
import ptJson from '../i18n/locales/pt.json';
import itJson from '../i18n/locales/it.json';

const API = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api';

const JaiderChatContext = createContext(null);

const SUPPORTED_LANGS = ['en', 'ar', 'es', 'pt', 'it'];

const WELCOME_MESSAGES = {
  en: "Hi there! 👋 I'm Jaider, your AI assistant. Ask me anything and I'll do my best to help you",
  es: "¡Hola! 👋 Soy Jaider, tu asistente de IA. Pregúntame lo que quieras y haré todo lo posible para ayudarte según nuestras preguntas frecuentes.",
  pt: "Olá! 👋 Eu sou o Jaider, seu assistente de IA. Pergunte-me qualquer coisa e farei o meu melhor para ajudar com base no nosso FAQ!",
  it: "Ciao! 👋 Sono Jaider, il tuo assistente AI. Chiedimi qualsiasi cosa e farò del mio meglio per aiutarti in base alle nostre FAQ!",
  ar: "مرحباً! 👋 أنا جايدر، مساعدك الذكي. اسألني عن أي شيء وسأبذل قصارى جهدي للمساعدة بناءً على الأسئلة الشائعة لدينا!",
  'ar-eg': "أهلاً بيك يا فندم! 👋 أنا جايدر، مساعدك الذكي. اسألني على أي حاجة وهعمل اللي عليا عشان أساعدك من الأسئلة الشائعة عندنا!"
};

const FALLBACK_MESSAGES = {
  en: "I'm sorry, I couldn't find an answer to your question in our FAQ. Please feel free to contact our support team at info@dunas-travel.com or via our Contact page.",
  es: "Lo siento, no pude encontrar una respuesta a tu pregunta en nuestras preguntas frecuentes. Por favor, no dudes en ponerte en contacto con nuestro equipo de soporte en info@dunas-travel.com o a través de nuestra página de Contacto.",
  pt: "Desculpe, não consegui encontrar uma resposta para a sua pergunta no nosso FAQ. Por favor, não hesite em entrar em contato com a nossa equipe de suporte em info@dunas-travel.com ou através da nossa página de Contato.",
  it: "Mi dispiace, non ho trovato una risposta alla tua domanda nelle nostre FAQ. Non esitare a contattare il nostro team di supporto all'indirizzo info@dunas-travel.com o tramite la nostra pagina Contatti.",
  ar: "عذراً، لم أتمكن من العثور على إجابة لسؤالك في الأسئلة الشائعة. لا تتردد في الاتصال بفريق الدعم لدينا على info@dunas-travel.com أو من خلال صفحة الاتصال بنا.",
  'ar-eg': "معلش يا فندم، ملقتش إجابة لسؤالك في الأسئلة الشائعة عندنا. تقدر كلم فريق الدعم بتاعنا على info@dunas-travel.com أو من خلال صفحة اتصل بينا."
};

const SUGGESTIONS = {
  en: [
    "How do I book a tour?",
    "What payment methods do you accept?",
    "What is your cancellation policy?",
    "Can you assist with visas?",
    "I need help"
  ],
  es: [
    "¿Cómo reservo un tour?",
    "¿Qué métodos de pago aceptan?",
    "¿Cuál es su política de cancelación?",
    "¿Pueden ayudar con las visas?",
    "Necesito ayuda"
  ],
  pt: [
    "Como faço para reservar um tour?",
    "Quais métodos de pagamento vocês aceitam?",
    "Qual é a sua política de cancelamento?",
    "Vocês podem ajudar com os vistos?",
    "Preciso de ajuda"
  ],
  it: [
    "Come posso prenotare un tour?",
    "Quali metodi di pagamento accettate?",
    "Qual è la vostra politica di cancellazione?",
    "Potete aiutarmi con i visti?",
    "Ho bisogno di aiuto"
  ],
  ar: [
    "كيف يمكنني حجز رحلة؟",
    "ما هي طرق الدفع المقبولة؟",
    "ما هي سياسة الإلغاء لديكم؟",
    "هل يمكنكم المساعدة في الحصول على التأشيرات؟",
    "أنا محتاج مساعدة"
  ],
  'ar-eg': [
    "عايز أحجز رحلة، أعمل إيه؟",
    "إيه طرق الدفع المتاحة؟",
    "إيه سياسة الإلغاء عندكم؟",
    "بتساعدوا في استخراج الفيزا؟",
    "أنا محتاج مساعدة"
  ]
};

const STOPWORDS = {
  ar: ['من', 'في', 'على', 'إلى', 'هذا', 'هل', 'كيف', 'أين', 'ما', 'يا', 'مع', 'عن', 'هو', 'هي', 'تم', 'كان'],
  en: ['the', 'is', 'are', 'of', 'to', 'and', 'a', 'in', 'how', 'what', 'where', 'can', 'you', 'i', 'do', 'my'],
  es: ['el', 'la', 'los', 'las', 'de', 'y', 'en', 'un', 'una', 'como', 'que', 'donde', 'puedo', 'mi', 'para', 'con'],
  pt: ['o', 'a', 'os', 'as', 'de', 'e', 'em', 'um', 'uma', 'como', 'que', 'onde', 'posso', 'meu', 'para', 'com'],
  it: ['il', 'la', 'i', 'gli', 'di', 'e', 'in', 'un', 'una', 'come', 'che', 'dove', 'posso', 'mio', 'per', 'con']
};

export const JaiderChatProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingKnowledge, setLoadingKnowledge] = useState(false);
  const [sessionId, setSessionId] = useState('');

  // Initialize session ID on mount
  useEffect(() => {
    let id = localStorage.getItem('jaider_chat_session_id');
    if (!id) {
      id = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('jaider_chat_session_id', id);
    }
    setSessionId(id);
  }, []);
  
  // Knowledge base index
  const faqDataRef = useRef({}); // { en: [ { q, a, tokens, tfIdfVector, norm } ], es: ... }
  const vocabIdfRef = useRef({}); // { en: { word: idf }, es: ... }
  const isLoadedRef = useRef(false);

  // Helper to normalize Arabic characters
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

  // Helper to tokenize text with language-specific stemming and synonyms
  const tokenize = (text) => {
    if (!text) return [];
    
    const normalized = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // removes accents/diacritics
      .replace(/[\u064B-\u0652]/g, "") // removes Arabic Tashkeel
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'¿¡]/g, " "); // removes punctuation
      
    const rawTokens = normalized.split(/\s+/).filter(word => word.length > 0);
    
    const isArabic = /[\u0600-\u06FF]/.test(text);
    if (isArabic) {
      return rawTokens.map(token => {
        let stemmed = normalizeArabic(token);
        
        // Strip common prefixes
        if (stemmed.startsWith('ال') && stemmed.length > 3) stemmed = stemmed.substring(2);
        if (stemmed.startsWith('بال') && stemmed.length > 4) stemmed = stemmed.substring(3);
        if (stemmed.startsWith('وال') && stemmed.length > 4) stemmed = stemmed.substring(3);
        if (stemmed.startsWith('كال') && stemmed.length > 4) stemmed = stemmed.substring(3);
        if (stemmed.startsWith('لل') && stemmed.length > 3) stemmed = stemmed.substring(2);
        if (stemmed.startsWith('و') && stemmed.length > 3) stemmed = stemmed.substring(1);
        if (stemmed.startsWith('ب') && stemmed.length > 3) stemmed = stemmed.substring(1);
        if (stemmed.startsWith('ل') && stemmed.length > 3) stemmed = stemmed.substring(1);
        if (stemmed.startsWith('ف') && stemmed.length > 3) stemmed = stemmed.substring(1);
        if (stemmed.startsWith('ك') && stemmed.length > 3) stemmed = stemmed.substring(1);
        
        // Normalize common colloquial/MSA conjugations and synonyms
        if (/^(حجز|احجز|احجزلي|الحجز|حجوزات|يحجز|تحجز|نحجز)$/.test(stemmed)) {
          return 'حجز';
        }
        if (/^(الغاء|إلغاء|الغاءات|الالغاء|يلغي|تلغي|نلغي|يلغى)$/.test(stemmed)) {
          return 'لغى';
        }
        if (/^(استرداد|استرجاع|يرجع|يرتجع|استرد|استرجع|ترجع)$/.test(stemmed)) {
          return 'رجع';
        }
        if (/^(دفع|الدفع|يدفع|تدفع|ندفع|مدفوعات)$/.test(stemmed)) {
          return 'دفع';
        }
        if (/^(سعر|اسعار|الاسعار|تسعير|تكلفة|تكلفه)$/.test(stemmed)) {
          return 'سعر';
        }
        if (/^(تأشيرة|تاشيرة|تأشيرات|فيزا|الفيزا)$/.test(stemmed)) {
          return 'فيزا';
        }
        if (/^(طيران|طائره|طيارة|الطيارة|طيارات|مطار|المطار)$/.test(stemmed)) {
          return 'طيران';
        }
        if (/^(تذكرة|تذاكر|التذاكر)$/.test(stemmed)) {
          return 'تذكرة';
        }
        if (/^(فندق|فنادق|الفنادق|الفندق)$/.test(stemmed)) {
          return 'فندق';
        }
        if (/^(غرفة|اوضة|غرف|أوض|الاوض|الاوضة)$/.test(stemmed)) {
          return 'غرفة';
        }
        if (/^(بكم|بكام|كم)$/.test(stemmed)) {
          return 'كم';
        }
        if (/^(اين|فين)$/.test(stemmed)) {
          return 'اين';
        }
        if (/^(كيف|ازاي)$/.test(stemmed)) {
          return 'كيف';
        }
        if (/^(ماذا|ايه)$/.test(stemmed)) {
          return 'ما';
        }
        if (/^(جولة|رحلة|رحلات|جولات)$/.test(stemmed)) {
          return 'رحلة';
        }
        
        return stemmed;
      });
    }
    
    return rawTokens;
  };

  // Keywords indicating Egyptian Colloquial Arabic
  const EGYPTIAN_KEYWORDS = [
    'عايز', 'عايزة', 'عاوز', 'عاوزة', 'عايزين', 'عاوزين', 'بكام', 'فين', 'ازاي', 'إزاي', 'ايه', 'إيه', 'ليه', 'مين', 'ده',
    'دي', 'دول', 'عشان', 'علشان', 'مش', 'اوي', 'أوي', 'كده', 'كدا', 'شغال', 'دلوقتي', 'دلوأتي',
    'بتاع', 'بتاعت', 'بتوع', 'لسه', 'لسة', 'خالص', 'حاجة', 'معلش', 'تمام', 'احجز', 'أحجز', 'بينا',
    'يافندم', 'يا فندم', 'بأد', 'بقد', 'بكام', 'فنادق', 'أوضة', 'اوضة', 'شنط', 'هدوم', 'عربية', 'أتوبيس'
  ];

  // Helper to map Egyptian colloquial keywords to MSA counterparts for better matching
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

  // Helper to translate Standard Arabic answers to Egyptian Colloquial Arabic
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

  // Helper to detect language
  const detectLanguage = (text) => {
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
      SUPPORTED_LANGS.forEach(lang => {
        if (lang === 'ar') return;
        if (STOPWORDS[lang] && STOPWORDS[lang].includes(token)) {
          scores[lang]++;
        }
      });
    });

    let bestLang = null;
    let maxScore = 0;
    Object.keys(scores).forEach(lang => {
      if (scores[lang] > maxScore) {
        maxScore = scores[lang];
        bestLang = lang;
      }
    });

    // If we have a clear stopword winner, return it
    if (bestLang && maxScore > 0) return bestLang;

    // 3. Fallback to active site language if supported, else default to 'en'
    const activeLang = i18n.language ? i18n.language.split('-')[0] : 'en';
    return SUPPORTED_LANGS.includes(activeLang) ? activeLang : 'en';
  };

  // Find similar questions based on keyword matching
  const findSimilarQuestions = (query, lang, limit = 3) => {
    const faqItems = faqDataRef.current[lang] || [];
    const queryTokens = tokenize(query);
    
    if (faqItems.length === 0 || queryTokens.length === 0) return [];

    // Score each FAQ question based on token overlap
    const scoredItems = faqItems.map(item => {
      const itemTokens = new Set(item.tokens);
      let matches = 0;
      queryTokens.forEach(token => {
        if (itemTokens.has(token)) matches++;
      });
      return { item, score: matches };
    });

    // Sort by score descending, filter out zero matches
    scoredItems
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);

    return scoredItems
      .slice(0, limit)
      .map(x => x.item.q);
  };

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

  // Load FAQ data dynamically from all locales
  const loadFaqKnowledge = () => {
    if (isLoadedRef.current) return;
    setLoadingKnowledge(true);
    try {
      const locales = {
        en: flattenObject(enJson),
        ar: flattenObject(arJson),
        es: flattenObject(esJson),
        pt: flattenObject(ptJson),
        it: flattenObject(itJson)
      };

      // Process each language
      SUPPORTED_LANGS.forEach(lang => {
        const trans = locales[lang];
        const faqItems = [];
        const docFreq = {};
        
        // Extract raw Q&As
        Object.keys(trans).forEach(key => {
          // 1. Match category-based format like faq.general.q1
          const matchCat = key.match(/^faq\.([a-zA-Z0-9_-]+)\.q(\d+)$/);
          if (matchCat) {
            const catId = matchCat[1];
            const idx = matchCat[2];
            const answerKey = `faq.${catId}.a${idx}`;
            
            const qText = trans[key];
            const aText = trans[answerKey];
            
            if (qText && aText && !aText.includes('[No answer')) {
              faqItems.push({
                id: `${catId}-${idx}`,
                q: qText,
                a: aText,
                tokens: tokenize(qText)
              });
            }
          }

          // 2. Match legacy/flat format like faq.qBookingTailor
          const matchFlat = key.match(/^faq\.q([a-zA-Z0-9_-]+)$/);
          if (matchFlat) {
            const flatId = matchFlat[1];
            const answerKey = `faq.a${flatId}`;
            
            const qText = trans[key];
            const aText = trans[answerKey];
            
            if (qText && aText && !aText.includes('[No answer')) {
              faqItems.push({
                id: `flat-${flatId}`,
                q: qText,
                a: aText,
                tokens: tokenize(qText)
              });
            }
          }
        });

        // Compute Document Frequency (DF)
        faqItems.forEach(item => {
          const uniqueTokens = new Set(item.tokens);
          uniqueTokens.forEach(token => {
            docFreq[token] = (docFreq[token] || 0) + 1;
          });
        });

        // Compute Inverse Document Frequency (IDF)
        const vocabIdf = {};
        const N = faqItems.length;
        Object.keys(docFreq).forEach(token => {
          vocabIdf[token] = Math.log(1 + (N / docFreq[token]));
        });
        vocabIdfRef.current[lang] = vocabIdf;

        // Represent each question as TF-IDF vector
        faqItems.forEach(item => {
          const vector = {};
          let squareSum = 0;
          
          // Term Frequency (TF)
          const tokenCounts = {};
          item.tokens.forEach(t => {
            tokenCounts[t] = (tokenCounts[t] || 0) + 1;
          });

          Object.keys(tokenCounts).forEach(token => {
            const tf = tokenCounts[token] / item.tokens.length;
            const idf = vocabIdf[token] || 0;
            vector[token] = tf * idf;
            squareSum += vector[token] * vector[token];
          });

          item.tfIdfVector = vector;
          item.norm = Math.sqrt(squareSum);
        });

        faqDataRef.current[lang] = faqItems;
      });

      isLoadedRef.current = true;
    } catch (error) {
      console.error("Failed to load FAQ knowledge for Jaider:", error);
    } finally {
      setLoadingKnowledge(false);
    }
  };

  // Perform cosine similarity matching
  const findBestFaqMatch = (query, lang) => {
    const faqItems = faqDataRef.current[lang] || [];
    const vocabIdf = vocabIdfRef.current[lang] || {};
    const queryTokens = tokenize(query);

    if (faqItems.length === 0 || queryTokens.length === 0) return null;

    // Calculate Query TF-IDF Vector
    const queryTokenCounts = {};
    queryTokens.forEach(t => {
      queryTokenCounts[t] = (queryTokenCounts[t] || 0) + 1;
    });

    const queryVector = {};
    let querySquareSum = 0;
    Object.keys(queryTokenCounts).forEach(token => {
      const tf = queryTokenCounts[token] / queryTokens.length;
      const idf = vocabIdf[token] || 0;
      queryVector[token] = tf * idf;
      querySquareSum += queryVector[token] * queryVector[token];
    });
    const queryNorm = Math.sqrt(querySquareSum);

    if (queryNorm === 0) return null;

    let bestItem = null;
    let maxSim = 0;

    // Compare with all FAQ items
    faqItems.forEach(item => {
      if (item.norm === 0) return;

      let dotProduct = 0;
      Object.keys(queryVector).forEach(token => {
        if (item.tfIdfVector[token]) {
          dotProduct += queryVector[token] * item.tfIdfVector[token];
        }
      });

      const similarity = dotProduct / (queryNorm * item.norm);
      if (similarity > maxSim) {
        maxSim = similarity;
        bestItem = item;
      }
    });

    return { item: bestItem, score: maxSim };
  };

  // Initialize FAQ knowledge on mount
  useEffect(() => {
    loadFaqKnowledge();
  }, []);

  // Trigger welcome message when chat starts
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const activeLang = i18n.language ? i18n.language.split('-')[0] : 'en';
      const lang = SUPPORTED_LANGS.includes(activeLang) ? activeLang : 'en';
      
      setMessages([
        {
          id: 'welcome',
          sender: 'jaider',
          text: WELCOME_MESSAGES[lang],
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, messages.length]);

  // Handle incoming message
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // Fetch response from the backend chatbot API
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: text,
          sessionId,
          language: i18n.language
        })
      });

      if (!res.ok) {
        throw new Error(`Chat API error: ${res.statusText}`);
      }

      const data = await res.json();
      
      // Simulate slight delay for human-like response rhythm
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-jaider`,
          sender: 'jaider',
          text: data.text,
          timestamp: new Date(),
          similarQuestions: data.similarQuestions && data.similarQuestions.length > 0 ? data.similarQuestions : undefined
        }
      ]);
    } catch (err) {
      console.error("Error processing query in Jaider backend:", err);
      
      // Client-side fallback logic in case of network/server failure
      const userLang = detectLanguage(text);
      const searchLang = userLang === 'ar-eg' ? 'ar' : userLang;
      const queryToMatch = userLang === 'ar-eg' ? mapColloquialToMsa(text) : text;
      const result = findBestFaqMatch(queryToMatch, searchLang);
      
      let replyText = '';
      let similarQuestions = [];
      
      if (result && result.item && result.score >= 0.35) {
        replyText = userLang === 'ar-eg' ? toEgyptianColloquial(result.item.a) : result.item.a;
      } else {
        replyText = FALLBACK_MESSAGES[userLang] || FALLBACK_MESSAGES[searchLang];
        similarQuestions = findSimilarQuestions(queryToMatch, searchLang, 3);
      }

      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-jaider`,
          sender: 'jaider',
          text: replyText,
          timestamp: new Date(),
          similarQuestions: similarQuestions.length > 0 ? similarQuestions : undefined
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const getSuggestions = () => {
    const activeLang = i18n.language ? i18n.language.split('-')[0] : 'en';
    const lang = SUPPORTED_LANGS.includes(activeLang) ? activeLang : 'en';
    return SUGGESTIONS[lang] || SUGGESTIONS.en;
  };

  const clearMessages = () => {
    // Generate a fresh session ID to clear history on both frontend and backend
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('jaider_chat_session_id', newSessionId);
    setSessionId(newSessionId);

    const activeLang = i18n.language ? i18n.language.split('-')[0] : 'en';
    const lang = SUPPORTED_LANGS.includes(activeLang) ? activeLang : 'en';
    setMessages([
      {
        id: 'welcome',
        sender: 'jaider',
        text: WELCOME_MESSAGES[lang],
        timestamp: new Date()
      }
    ]);
  };

  return (
    <JaiderChatContext.Provider
      value={{
        isOpen,
        setIsOpen,
        messages,
        sendMessage,
        clearMessages,
        isTyping,
        loadingKnowledge,
        suggestions: getSuggestions(),
        detectLanguage,
        findSimilarQuestions
      }}
    >
      {children}
    </JaiderChatContext.Provider>
  );
};

export const useJaiderChat = () => {
  const context = useContext(JaiderChatContext);
  if (!context) {
    throw new Error('useJaiderChat must be used within a JaiderChatProvider');
  }
  return context;
};
