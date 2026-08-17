import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import enJson from '../i18n/locales/en.json';
import arJson from '../i18n/locales/ar.json';
import esJson from '../i18n/locales/es.json';
import ptJson from '../i18n/locales/pt.json';
import itJson from '../i18n/locales/it.json';

import api from '../utils/api';

const JaiderChatContext = createContext(null);

const SUPPORTED_LANGS = ['en', 'ar', 'es', 'pt', 'it'];

const WELCOME_MESSAGES = {
  en: "Hi there! 👋 I'm GuideR, your luxury AI Travel Concierge for Dunas Travel. How can I assist you with planning your dream trip today?",
  es: "¡Hola! 👋 Soy GuideR, tu conserje de viajes de lujo para Dunas Travel. ¿Cómo puedo ayudarte a planificar tu viaje soñado hoy?",
  pt: "Olá! 👋 Sou o GuideR, seu concierge de viagens de luxo da Dunas Travel. Como posso ajudar a planejar a sua viagem dos sonhos hoje?",
  it: "Ciao! 👋 Sono GuideR, il tuo concierge di viaggio di lusso per Dunas Travel. Come posso aiutarti a pianificare il tuo viaggio ideale oggi?",
  ar: "أهلاً بك! 👋 أنا جايدر (GuideR)، مستشارك السياحي الذكي في دوناس ترافيل. كيف يمكنني مساعدتك في التخطيط لرحلتك الفاخرة اليوم؟",
  'ar-eg': "أهلاً بيك يا فندم! 👋 أنا جايدر (GuideR)، مستشارك السياحي الذكي في دوناس ترافيل. تؤمرني بإيه النهارده عشان نخطط لأحلى رحلة؟"
};

const FALLBACK_MESSAGES = {
  en: "I'd be delighted to help you with that! You can explore our signature tour packages, request a tailor-made luxury itinerary, or connect directly with our senior travel specialists.",
  es: "¡Con gusto te ayudo! Puedes explorar nuestros paquetes turísticos, solicitar un itinerario de lujo personalizado o contactar a nuestros especialistas.",
  pt: "Terei todo o prazer em ajudar! Pode explorar os nossos pacotes turísticos, solicitar um itinerário personalizado ou falar com os nossos especialistas.",
  it: "Sarò lieto di aiutarti! Puoi esplorare i nostri pacchetti turistici, richiedere un itinerario personalizzato o contattare i nostri specialisti.",
  ar: "يسعدني جداً مساعدتك! يمكنك استعراض باقات رحلاتنا الفاخرة، أو طلب تصميم برنامج مخصص لعائلتك، أو التواصل المباشر مع خبراء المبيعات لدينا.",
  'ar-eg': "تحت أمرك يا فندم! تقدر تشوف رحلاتنا المميزة، أو نصمملك برنامج مخصوص لحضرتك ولعيلتك، أو تكلم فريق المبيعات مباشرة."
};

const SUGGESTIONS = {
  en: [
    "Recommend top Nile Cruise packages",
    "How can I customize a private tour?",
    "What payment methods do you accept?",
    "What is your cancellation policy?",
    "Airport transfer services"
  ],
  es: [
    "Recomienda paquetes de Crucero por el Nilo",
    "¿Cómo personalizar un tour privado?",
    "¿Qué métodos de pago aceptan?",
    "¿Cuál es su política de cancelación?",
    "Servicios de traslado al aeropuerto"
  ],
  pt: [
    "Recomende cruzeiros no Nilo",
    "Como personalizar um tour privado?",
    "Quais métodos de pagamento aceitam?",
    "Qual é a política de cancelamento?",
    "Serviços de transporte e aeroporto"
  ],
  it: [
    "Consigliami crociere sul Nilo",
    "Come posso personalizzare un tour privato?",
    "Quali metodi di pagamento accettate?",
    "Qual è la vostra politica di cancellazione?",
    "Servizi di trasferimento aeroportuale"
  ],
  ar: [
    "اقترح علي أفضل رحلات النيل البحرية",
    "كيف يمكنني تصميم رحلة مخصصة؟",
    "ما هي طرق الدفع المتاحة؟",
    "ما هي سياسة الإلغاء لديكم؟",
    "خدمات التوصيل من وإلى المطار"
  ],
  'ar-eg': [
    "عايز أحسن رحلة نايل كروز في مصر",
    "إزاي أعمل برنامج سياحي مخصوص لعيلتي؟",
    "إيه طرق الدفع المتاحة عندكم؟",
    "إيه سياسة الإلغاء والاسترداد؟",
    "بتوفروا توصيل من وإلى المطار؟"
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
  const [sessionId, setSessionId] = useState(() => {
    if (typeof window === 'undefined') return '';
    let id = localStorage.getItem('jaider_chat_session_id');
    if (!id) {
      id = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      localStorage.setItem('jaider_chat_session_id', id);
    }
    return id;
  });

  const [leadFormState, setLeadFormState] = useState({ required: false, fields: [] });
  const [handoffState, setHandoffState] = useState({ requested: false, status: null });

  // Knowledge base client-side index for offline/instant fallback
  const faqDataRef = useRef({});
  const vocabIdfRef = useRef({});
  const isLoadedRef = useRef(false);

  const normalizeArabic = (text) => {
    if (!text) return '';
    return text
      .replace(/[أإآ]/g, 'ا')
      .replace(/ى/g, 'ي')
      .replace(/ة/g, 'ه')
      .replace(/ئ/g, 'ء')
      .replace(/ؤ/g, 'ء')
      .replace(/[\u064B-\u0652]/g, '');
  };

  const tokenize = (text) => {
    if (!text) return [];
    const normalized = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'¿¡]/g, " ");

    const rawTokens = normalized.split(/\s+/).filter(word => word.length > 0);
    const isArabic = /[\u0600-\u06FF]/.test(text);

    if (isArabic) {
      return rawTokens.map(token => {
        let stemmed = normalizeArabic(token);
        if (stemmed.startsWith('ال') && stemmed.length > 3) stemmed = stemmed.substring(2);
        if (stemmed.startsWith('بال') && stemmed.length > 4) stemmed = stemmed.substring(3);
        if (stemmed.startsWith('وال') && stemmed.length > 4) stemmed = stemmed.substring(3);
        if (stemmed.startsWith('كال') && stemmed.length > 4) stemmed = stemmed.substring(3);
        if (stemmed.startsWith('لل') && stemmed.length > 3) stemmed = stemmed.substring(2);
        if (stemmed.startsWith('و') && stemmed.length > 3) stemmed = stemmed.substring(1);
        if (stemmed.startsWith('ب') && stemmed.length > 3) stemmed = stemmed.substring(1);
        if (stemmed.startsWith('ل') && stemmed.length > 3) stemmed = stemmed.substring(1);
        return stemmed;
      });
    }
    return rawTokens;
  };

  const detectLanguage = (text) => {
    if (/[\u0600-\u06FF]/.test(text)) {
      const isEg = /(عايز|عاوز|بكام|فين|ازاي|ايه|ليه|ده|دي|عشان|شغال|يا فندم|أوضة|عربية)/.test(text);
      return isEg ? 'ar-eg' : 'ar';
    }
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

    if (bestLang && maxScore > 0) return bestLang;
    const activeLang = i18n.language ? i18n.language.split('-')[0] : 'en';
    return SUPPORTED_LANGS.includes(activeLang) ? activeLang : 'en';
  };

  const flattenObject = (ob) => {
    const toReturn = {};
    for (const i in ob) {
      if (!Object.prototype.hasOwnProperty.call(ob, i)) continue;
      if ((typeof ob[i]) === 'object' && ob[i] !== null && !Array.isArray(ob[i])) {
        const flatObject = flattenObject(ob[i]);
        for (const x in flatObject) {
          if (!Object.prototype.hasOwnProperty.call(flatObject, x)) continue;
          toReturn[i + '.' + x] = flatObject[x];
        }
      } else {
        toReturn[i] = ob[i];
      }
    }
    return toReturn;
  };

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

      SUPPORTED_LANGS.forEach(lang => {
        const trans = locales[lang];
        const faqItems = [];
        const docFreq = {};

        Object.keys(trans).forEach(key => {
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
        });

        faqItems.forEach(item => {
          const uniqueTokens = new Set(item.tokens);
          uniqueTokens.forEach(token => {
            docFreq[token] = (docFreq[token] || 0) + 1;
          });
        });

        const vocabIdf = {};
        const N = Math.max(1, faqItems.length);
        Object.keys(docFreq).forEach(token => {
          vocabIdf[token] = Math.log(1 + (N / docFreq[token]));
        });
        vocabIdfRef.current[lang] = vocabIdf;
        faqDataRef.current[lang] = faqItems;
      });

      isLoadedRef.current = true;
    } catch (error) {
      console.warn("Failed to load FAQ knowledge for GuideR:", error);
    } finally {
      setLoadingKnowledge(false);
    }
  };

  // Restore previous chat history from backend on initial mount
  const restoreConversationHistory = useCallback(async (currentSessionId) => {
    if (!currentSessionId) return;
    try {
      const res = await api.get(`/ai/chat/history?sessionId=${currentSessionId}`);
      const data = res?.data?.data || res?.data || res;
      if (data && data.messages && data.messages.length > 0) {
        const mapped = data.messages.map((m) => ({
          id: m.id,
          sender: m.role === 'user' ? 'user' : 'jaider',
          text: m.content,
          timestamp: new Date(m.createdAt),
          tours: m.tours,
          sources: m.sources,
        }));
        setMessages(mapped);
        if (data.status === 'HANDED_OFF') {
          setHandoffState({ requested: true, status: 'HANDED_OFF' });
        }
      } else {
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
    } catch (err) {
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
  }, [i18n.language]);

  useEffect(() => {
    loadFaqKnowledge();
    if (sessionId) {
      restoreConversationHistory(sessionId);
    }
  }, [sessionId, restoreConversationHistory]);

  const handleSetIsOpen = (open) => {
    const nextOpen = typeof open === 'function' ? open(isOpen) : open;
    setIsOpen(nextOpen);
    if (nextOpen && messages.length === 0) {
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
  };

  // Send message
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
      const response = await api.post('/ai/chat/message', {
        message: text,
        sessionId,
        locale: i18n.language,
        pageContext: {
          pathname: typeof window !== 'undefined' ? window.location.pathname : '/'
        }
      });

      const data = response?.data?.data || response?.data || response;
      const assistantText = data?.message?.content || data?.text || FALLBACK_MESSAGES[i18n.language] || FALLBACK_MESSAGES.en;
      const tours = data?.recommendations?.tours || [];
      const destinations = data?.recommendations?.destinations || [];
      const sources = data?.sources || [];
      const suggestedReplies = data?.suggestedReplies || [];

      if (data?.leadCapture?.required) {
        setLeadFormState({ required: true, fields: data.leadCapture.fields });
      }

      if (data?.handoff?.requested) {
        setHandoffState({ requested: true, status: data.handoff.status });
      }

      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-jaider`,
          sender: 'jaider',
          text: assistantText,
          timestamp: new Date(),
          tours,
          destinations,
          sources,
          suggestedReplies,
        }
      ]);
    } catch (err) {
      console.warn("GuideR backend call encountered network/fallback mode:", err);

      const userLang = detectLanguage(text);
      const replyText = FALLBACK_MESSAGES[userLang] || FALLBACK_MESSAGES.en;

      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-jaider`,
          sender: 'jaider',
          text: replyText,
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const submitLead = async (visitorInfo) => {
    try {
      await api.post('/ai/chat/lead', {
        sessionId,
        ...visitorInfo
      });
      setLeadFormState({ required: false, fields: [] });
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-lead-sys`,
          sender: 'jaider',
          text: i18n.language.startsWith('ar')
            ? 'شكراً لك! تم استلام بياناتك بنجاح وسيقوم مستشار السفر بالتواصل معك قريباً لتزويدك بكافة التفاصيل وعرض الأسعار.'
            : 'Thank you! Your details have been submitted. A senior travel specialist will contact you shortly.',
          timestamp: new Date()
        }
      ]);
      return true;
    } catch (err) {
      console.error("Failed to submit lead:", err);
      return false;
    }
  };

  const requestHandoff = async () => {
    try {
      await api.post('/ai/chat/handoff', { sessionId });
      setHandoffState({ requested: true, status: 'HANDED_OFF' });
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-handoff-sys`,
          sender: 'jaider',
          text: i18n.language.startsWith('ar')
            ? 'تم إرسال طلب التحدث مع مستشار مبيعات. سيتواصل معك أحد خبرائنا فوراً عبر الدردشة أو البريد.'
            : 'Sales specialist requested. A senior travel advisor has been notified.',
          timestamp: new Date()
        }
      ]);
      return true;
    } catch (err) {
      console.error("Failed to request handoff:", err);
      return false;
    }
  };

  const getSuggestions = () => {
    const activeLang = i18n.language ? i18n.language.split('-')[0] : 'en';
    const isEg = i18n.language === 'ar-eg';
    if (isEg) return SUGGESTIONS['ar-eg'];
    const lang = SUPPORTED_LANGS.includes(activeLang) ? activeLang : 'en';
    return SUGGESTIONS[lang] || SUGGESTIONS.en;
  };

  const startNewChat = () => {
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem('jaider_chat_session_id', newSessionId);
    setSessionId(newSessionId);
    setLeadFormState({ required: false, fields: [] });
    setHandoffState({ requested: false, status: null });

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
        setIsOpen: handleSetIsOpen,
        messages,
        sendMessage,
        submitLead,
        requestHandoff,
        leadFormState,
        handoffState,
        clearMessages: startNewChat,
        startNewChat,
        isTyping,
        loadingKnowledge,
        suggestions: getSuggestions(),
        detectLanguage,
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
