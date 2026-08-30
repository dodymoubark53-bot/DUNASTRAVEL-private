import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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

const _FALLBACK_MESSAGES = {
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
    "Compare Egypt Classic and Historic Egypt",
    "Design a 10-day custom luxury Egypt tour",
    "What payment methods & deposit rules apply?",
    "What is your cancellation & refund policy?"
  ],
  es: [
    "Recomienda paquetes de Crucero por el Nilo",
    "Compara Egipto Clásico e Histórico",
    "Diseña un tour personalizado de 10 días en Egipto",
    "¿Qué métodos de pago y anticipos aplican?",
    "¿Cuál es su política de cancelación y reembolso?"
  ],
  pt: [
    "Recomende os melhores cruzeiros no Nilo",
    "Compare Egito Clássico e Egito Histórico",
    "Planeje um roteiro de luxo de 10 dias no Egito",
    "Quais métodos de pagamento e sinal são aceitos?",
    "Qual é a política de cancelamento e reembolso?"
  ],
  it: [
    "Consigliami le migliori crociere sul Nilo",
    "Confronta Egitto Classico ed Egitto Storico",
    "Pianifica un tour di lusso su misura di 10 giorni",
    "Quali metodi di pagamento e acconti accettate?",
    "Qual è la vostra politica di cancellazione?"
  ],
  ar: [
    "اقترح علي أفضل رحلات النايل كروز الفاخرة",
    "قارن بين رحلة مصر الكلاسيكية ومصر التاريخية",
    "صمم لي برنامج سياحي خاص 10 أيام في مصر",
    "ما هي طرق الدفع وشروط الإيداع المعتمدة؟",
    "ما هي سياسة الإلغاء والاسترداد المعتمدة؟"
  ],
  'ar-eg': [
    "عايز أحسن رحلة نايل كروز فاخرة في مصر",
    "قارن بين الرحلة الكلاسيكية والتاريخية",
    "صمملي برنامج 10 أيام مخصص لعيلتي",
    "إيه طرق الدفع ونسبة المقدم المطلوبة؟",
    "إيه سياسة الإلغاء واسترداد الفلوس؟"
  ]
};

const _STOPWORDS = {
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
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState(null);
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
  const [personas, setPersonas] = useState([]);
  const [isInChatBookingEnabled, setIsInChatBookingEnabled] = useState(true);
  const [selectedPersona, setSelectedPersona] = useState(() => {
    if (typeof window === 'undefined') return 'luxury_concierge';
    return localStorage.getItem('jaider_selected_persona') || 'luxury_concierge';
  });
  const abortControllerRef = useRef(null);

  const detectLanguage = (text) => {
    if (!text) return 'en';
    if (/[\u0600-\u06FF]/.test(text)) return 'ar';
    if (/[áéíóúüñ¿¡]/i.test(text)) return 'es';
    if (/[ãõâêîôûàèìòùç]/i.test(text)) return 'pt';
    if (/[àèéìíîòóùú]/i.test(text)) return 'it';
    return 'en';
  };

  // Fetch active AI Personas and Chat Config
  const fetchChatConfigAndPersonas = useCallback(async (lang) => {
    try {
      const [personasRes, configRes] = await Promise.all([
        api.get(`/ai/chat/personas?locale=${lang || 'en'}`).catch(() => null),
        api.get(`/ai/chat/config?locale=${lang || 'en'}`).catch(() => null),
      ]);

      if (Array.isArray(personasRes)) {
        setPersonas(personasRes);
      } else if (configRes && Array.isArray(configRes.personas)) {
        setPersonas(configRes.personas);
      }

      if (configRes && configRes.salesPersonality) {
        setSelectedPersona(configRes.salesPersonality);
      }

      if (configRes && typeof configRes.isInChatBookingEnabled === 'boolean') {
        setIsInChatBookingEnabled(configRes.isInChatBookingEnabled);
      }
    } catch (err) {
      console.warn('Could not fetch AI personas or config:', err);
    }
  }, []);

  useEffect(() => {
    const activeLang = i18n.language ? i18n.language.split('-')[0] : 'en';
    fetchChatConfigAndPersonas(activeLang);
  }, [i18n.language, fetchChatConfigAndPersonas]);

  const changePersona = (personaCode) => {
    if (!personaCode || personaCode === selectedPersona) return;
    setSelectedPersona(personaCode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jaider_selected_persona', personaCode);
    }
  };

  // Restore previous chat history from backend on initial mount
  const restoreConversationHistory = useCallback(async (currentSessionId) => {
    if (!currentSessionId) return;
    try {
      const res = await api.get(`/ai/chat/history?sessionId=${currentSessionId}`);
      const data = res;
      if (data && data.messages && data.messages.length > 0) {
        setConversationId(data.conversationId);
        const mapped = data.messages.map((m) => {
          const rawTours = Array.isArray(m.tours) ? m.tours : (Array.isArray(m.structuredContent?.tours) ? m.structuredContent.tours : []);
          const cleanTours = rawTours.filter((t) => t && typeof t === 'object' && t.title);

          return {
            id: m.id,
            sender: m.role === 'user' ? 'user' : (m.role === 'staff' ? 'staff' : 'jaider'),
            text: m.content,
            structuredContent: m.structuredContent,
            timestamp: new Date(m.createdAt),
            tours: cleanTours,
            destinations: m.destinations || m.structuredContent?.destinations || [],
            sources: m.sources,
            proposal: m.proposal || m.structuredContent?.proposal || null,
            comparison: m.comparison || m.structuredContent?.comparison || null,
            booking: m.structuredContent?.type === 'booking_confirmation' ? m.structuredContent.booking : null,
          };
        });
        setMessages(mapped);
        if (data.status === 'HANDED_OFF' || data.status === 'HUMAN_ACTIVE') {
          setHandoffState({ requested: true, status: data.status });
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
    } catch {
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
    if (!sessionId) return undefined;
    const restoreTimer = setTimeout(() => restoreConversationHistory(sessionId), 0);
    return () => clearTimeout(restoreTimer);
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

  const stopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsTyping(false);
    setIsStreaming(false);
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
    abortControllerRef.current = new AbortController();

    try {
      const response = await api.post('/ai/chat/message', {
        message: text,
        sessionId,
        locale: i18n.language,
        personaCode: selectedPersona,
        pageContext: {
          pathname: typeof window !== 'undefined' ? window.location.pathname : '/'
        }
      }, {
        signal: abortControllerRef.current.signal
      });

      const data = response;
      if (data?.conversationId) setConversationId(data.conversationId);

      const assistantText = data?.message?.content || data?.text;
      if (!assistantText) throw new Error('GuideR returned an invalid response');
      const rawTours = data?.recommendations?.tours || data?.message?.structuredContent?.tours || [];
      const tours = (Array.isArray(rawTours) ? rawTours : []).filter((t) => t && typeof t === 'object' && t.title);
      const destinations = data?.recommendations?.destinations || data?.message?.structuredContent?.destinations || [];
      const proposal = data?.recommendations?.proposal || data?.message?.structuredContent?.proposal || null;
      const comparison = data?.recommendations?.comparison || data?.message?.structuredContent?.comparison || null;
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
          id: data?.message?.id || `msg-${Date.now()}-jaider`,
          sender: 'jaider',
          text: assistantText,
          timestamp: new Date(),
          tours,
          destinations,
          proposal,
          comparison,
          sources,
          suggestedReplies,
        }
      ]);
    } catch (err) {
      if (err?.name === 'CanceledError' || err?.message === 'canceled') {
        return;
      }
      console.warn("GuideR backend call failed:", err);

      const userLang = detectLanguage(text);
      const replyText = userLang === 'ar'
        ? 'خدمة GuideR غير متاحة حاليًا. لم يتم إنشاء رد بديل؛ يرجى المحاولة مرة أخرى أو التواصل مع فريق الرحلات.'
        : 'GuideR is currently unavailable. No substitute answer was generated; please try again or contact our travel team.';

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
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const bookTourInChat = async (bookingPayload) => {
    try {
      setIsTyping(true);
      const res = await api.post('/ai/chat/book', {
        sessionId,
        locale: i18n.language,
        ...bookingPayload,
      });

      if (res && res.referenceCode) {
        const isAr = i18n.language.startsWith('ar');
        const confirmationMsg = {
          id: `booking-conf-${Date.now()}`,
          sender: 'jaider',
          text: isAr
            ? `🎉 تم تأكيد طلب حجزك بنجاح برقم مرجعي: **${res.referenceCode}**`
            : `🎉 Booking reservation confirmed with Reference: **${res.referenceCode}**`,
          timestamp: new Date(),
          booking: res,
          structuredContent: {
            type: 'booking_confirmation',
            booking: res,
          },
        };

        setMessages((prev) => [...prev, confirmationMsg]);
        return { success: true, booking: res };
      }
      return { success: false, error: 'Unexpected response from booking engine' };
    } catch (err) {
      console.error('In-chat booking failed:', err);
      const errorText = i18n.language.startsWith('ar')
        ? 'عذراً، حدث خطأ أثناء إتمام الحجز. يرجى مراجعة البيانات والمحاولة مجدداً أو التواصل مع خدمة العملاء.'
        : 'Sorry, an error occurred while processing your booking. Please try again or reach out to customer support.';
      setMessages((prev) => [
        ...prev,
        {
          id: `booking-err-${Date.now()}`,
          sender: 'jaider',
          text: errorText,
          timestamp: new Date(),
        },
      ]);
      return { success: false, error: err.message };
    } finally {
      setIsTyping(false);
    }
  };

  const refineItinerary = (instruction) => {
    sendMessage(instruction);
  };

  const submitFeedback = async (messageId, rating, category, comments) => {
    if (!conversationId) return false;
    try {
      await api.post('/ai/chat/feedback', {
        conversationId,
        messageId,
        rating,
        category,
        comments,
        locale: i18n.language,
      });
      return true;
    } catch (err) {
      console.warn("Could not record feedback:", err);
      return false;
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
    setConversationId(null);
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
        refineItinerary,
        submitFeedback,
        stopGenerating,
        submitLead,
        requestHandoff,
        leadFormState,
        handoffState,
        clearMessages: startNewChat,
        startNewChat,
        isTyping,
        isStreaming,
        loadingKnowledge: false,
        suggestions: getSuggestions(),
        detectLanguage,
        personas,
        selectedPersona,
        changePersona,
        bookTourInChat,
        isInChatBookingEnabled,
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
