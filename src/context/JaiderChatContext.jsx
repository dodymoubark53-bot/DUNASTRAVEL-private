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
    "Recommend top 5-star Nile Cruise packages",
    "Curate a 7-day luxury Cairo & Luxor itinerary",
    "Design a bespoke family tour in Egypt",
    "Compare Nile Dahabiya vs Grand Nile Cruiser"
  ],
  es: [
    "Recomienda los mejores cruceros 5 estrellas por el Nilo",
    "Diseña un itinerario de lujo de 7 días en El Cairo y Luxor",
    "Organiza un viaje familiar exclusivo en Egipto",
    "Compara Dahabiya privada vs Crucero de lujo por el Nilo"
  ],
  pt: [
    "Recomende os melhores cruzeiros 5 estrelas no Nilo",
    "Planeje um roteiro de luxo de 7 dias no Cairo e Luxor",
    "Crie uma viagem personalizada para a família no Egito",
    "Compare Dahabiya privativa vs Cruzeiro de luxo no Nilo"
  ],
  it: [
    "Consigliami le migliori crociere 5 stelle sul Nilo",
    "Pianifica un tour di lusso di 7 giorni tra Il Cairo e Luxor",
    "Organizza un viaggio su misura per famiglie in Egitto",
    "Confronta Dahabiya privata vs Crociera di lusso sul Nilo"
  ],
  ar: [
    "اقترح علي أفضل رحلات النايل كروز الفاخرة 5 نجوم",
    "صمم لي برنامج سياحي 7 أيام بين القاهرة والأقصر",
    "صمم رحلة عائلية فاخرة مخصصة في مصر",
    "ما الفرق بين الإبحار بالدهبية النيلية الفاخرة والكروز الكبير؟"
  ],
  'ar-eg': [
    "عايز أحسن رحلة نايل كروز فاخرة 5 نجوم في مصر",
    "صمملي برنامج 7 أيام ممتع وفخم في القاهرة والأقصر",
    "عايز رحلة عائلية مميزة ومريحة لكل العيلة",
    "إيه الفرق بين الدهبية النيلية الخاصة والكروز العادي؟"
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
  const isSendingRef = useRef(false);

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

  const sanitizeTours = (toursList) => {
    if (!Array.isArray(toursList)) return [];
    return toursList
      .filter((t) => t && typeof t === 'object' && t.title)
      .map((t) => ({
        ...t,
        price: 0,
        basePriceUsd: 0,
      }));
  };

  const sanitizeProposal = (p) => {
    if (!p) return null;
    return {
      ...p,
      estimatedPricePerPerson: 0,
    };
  };

  const sanitizeComparison = (c) => {
    if (!c) return null;
    return {
      ...c,
      tours: Array.isArray(c.tours) ? c.tours.map((t) => ({ ...t, price: 0 })) : [],
      differences: Array.isArray(c.differences)
        ? c.differences.map((d) => {
            if (d.aspect && (d.aspect.includes('سعر') || d.aspect.toLowerCase().includes('price'))) {
              return { ...d, tourAValue: '$0 USD', tourBValue: '$0 USD' };
            }
            return d;
          })
        : c.differences,
    };
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
          const cleanTours = sanitizeTours(rawTours);

          return {
            id: m.id,
            sender: m.role === 'user' ? 'user' : (m.role === 'staff' ? 'staff' : 'jaider'),
            text: m.content,
            structuredContent: m.structuredContent,
            timestamp: new Date(m.createdAt),
            tours: cleanTours,
            destinations: m.destinations || m.structuredContent?.destinations || [],
            sources: m.sources,
            proposal: sanitizeProposal(m.proposal || m.structuredContent?.proposal || null),
            comparison: sanitizeComparison(m.comparison || m.structuredContent?.comparison || null),
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

  // Send message with real SSE streaming + progressive tokens + cancellation + fallback
  const sendMessage = async (text) => {
    if (!text || !text.trim() || isSendingRef.current) return;
    const cleanText = text.trim();
    isSendingRef.current = true;

    const userMsg = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: cleanText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);
    setIsStreaming(true);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const botMsgId = `msg-${Date.now()}-jaider`;
    const initialBotMsg = {
      id: botMsgId,
      sender: 'jaider',
      text: '',
      timestamp: new Date(),
      tours: [],
      destinations: [],
      sources: [],
      suggestedReplies: [],
      isStreaming: true,
    };

    // Add empty placeholder for progressive streaming
    setMessages((prev) => [...prev, initialBotMsg]);

    const activeLang = i18n.language || 'en';
    const baseUrl = api.defaults?.baseURL || (typeof window !== 'undefined' ? '/api' : 'https://dunastravel-backend-seven.vercel.app/api');
    const streamUrl = `${String(baseUrl).replace(/\/+$/, '')}/ai/chat/stream`;

    let streamSucceeded = false;
    let accumulatedText = '';

    try {
      const response = await fetch(streamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: cleanText,
          sessionId,
          locale: activeLang,
          personaCode: selectedPersona,
          pageContext: {
            pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
          },
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Stream HTTP error ${response.status}`);
      }

      if (!response.body) {
        throw new Error('ReadableStream not supported');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split('\n\n');
        buffer = blocks.pop() || '';

        for (const block of blocks) {
          if (!block.trim()) continue;
          let eventType = 'message';
          let dataStr = '';

          const lines = block.split('\n');
          for (const line of lines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim();
            } else if (line.startsWith('data: ')) {
              dataStr = line.slice(6).trim();
            }
          }

          if (!dataStr) continue;

          try {
            const parsedData = JSON.parse(dataStr);

            if (eventType === 'token' && parsedData.delta) {
              streamSucceeded = true;
              accumulatedText += parsedData.delta;
              setMessages((prev) =>
                prev.map((m) => (m.id === botMsgId ? { ...m, text: accumulatedText, isStreaming: true } : m)),
              );
            } else if (eventType === 'structured') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === botMsgId
                    ? {
                        ...m,
                        proposal: sanitizeProposal(parsedData.proposal || m.proposal),
                        comparison: sanitizeComparison(parsedData.comparison || m.comparison),
                        tours: sanitizeTours(parsedData.tours || m.tours),
                      }
                    : m,
                ),
              );
            } else if (eventType === 'complete') {
              streamSucceeded = true;
              if (parsedData.conversationId) {
                setConversationId(parsedData.conversationId);
              }
              const finalText = parsedData.message?.content || parsedData.text || accumulatedText;
              const rawTours =
                parsedData.recommendations?.tours || parsedData.message?.structuredContent?.tours || [];
              const cleanTours = sanitizeTours(rawTours);
              const destinations =
                parsedData.recommendations?.destinations ||
                parsedData.message?.structuredContent?.destinations ||
                [];
              const proposal = sanitizeProposal(
                parsedData.recommendations?.proposal ||
                parsedData.message?.structuredContent?.proposal ||
                null
              );
              const comparison = sanitizeComparison(
                parsedData.recommendations?.comparison ||
                parsedData.message?.structuredContent?.comparison ||
                null
              );
              const sources = parsedData.sources || [];
              const suggestedReplies = parsedData.suggestedReplies || [];

              if (parsedData.leadCapture?.required) {
                setLeadFormState({ required: true, fields: parsedData.leadCapture.fields });
              }
              if (parsedData.handoff?.requested) {
                setHandoffState({ requested: true, status: parsedData.handoff.status });
              }

              setMessages((prev) =>
                prev.map((m) =>
                  m.id === botMsgId
                    ? {
                        ...m,
                        id: parsedData.message?.id || botMsgId,
                        text: finalText,
                        tours: cleanTours,
                        destinations,
                        proposal,
                        comparison,
                        sources,
                        suggestedReplies,
                        isStreaming: false,
                        isError: false,
                      }
                    : m,
                ),
              );
            } else if (eventType === 'error') {
              throw new Error(parsedData.message || 'Stream processing failed');
            }
          } catch (jsonErr) {
            // ignore non-json SSE frames
          }
        }
      }
    } catch (err) {
      if (err.name === 'AbortError' || err.name === 'CanceledError' || err.message === 'canceled') {
        // User aborted: keep what was streamed
        setMessages((prev) =>
          prev.map((m) => (m.id === botMsgId ? { ...m, isStreaming: false } : m)),
        );
        return;
      }

      // If stream didn't produce tokens, fallback to standard POST /ai/chat/message
      if (!streamSucceeded || !accumulatedText) {
        console.warn('GuideR SSE streaming failed, falling back to message endpoint:', err);
        try {
          const response = await api.post('/ai/chat/message', {
            message: cleanText,
            sessionId,
            locale: activeLang,
            personaCode: selectedPersona,
            pageContext: {
              pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
            },
          });

          const data = response;
          if (data?.conversationId) setConversationId(data.conversationId);
          const assistantText = data?.message?.content || data?.text;
          const rawTours = data?.recommendations?.tours || data?.message?.structuredContent?.tours || [];
          const cleanTours = sanitizeTours(rawTours);

          if (data?.leadCapture?.required) {
            setLeadFormState({ required: true, fields: data.leadCapture.fields });
          }
          if (data?.handoff?.requested) {
            setHandoffState({ requested: true, status: data.handoff.status });
          }

          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId
                ? {
                    ...m,
                    id: data?.message?.id || botMsgId,
                    text: assistantText,
                    tours: cleanTours,
                    destinations: data?.recommendations?.destinations || [],
                    proposal: sanitizeProposal(data?.recommendations?.proposal || null),
                    comparison: sanitizeComparison(data?.recommendations?.comparison || null),
                    sources: data?.sources || [],
                    suggestedReplies: data?.suggestedReplies || [],
                    isStreaming: false,
                    isError: false,
                  }
                : m,
            ),
          );
        } catch (fallbackErr) {
          console.error('GuideR standard message call also failed:', fallbackErr);
          const isAr = (activeLang || '').startsWith('ar');
          const replyText = isAr
            ? 'عذراً، خدمة مستشار السفر الذكي غير متاحة حالياً. يرجى المحاولة مرة أخرى أو التواصل مباشرة مع فريق خدمة العملاء.'
            : 'GuideR travel concierge is temporarily unavailable. Please try again or reach out to our senior travel advisors directly.';

          setMessages((prev) =>
            prev.map((m) =>
              m.id === botMsgId
                ? {
                    ...m,
                    text: replyText,
                    isError: true,
                    failedMessageText: cleanText,
                    isStreaming: false,
                  }
                : m,
            ),
          );
        }
      } else {
        // Stream received partial tokens but connection closed prematurely
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? {
                  ...m,
                  isStreaming: false,
                  isInterrupted: true,
                }
              : m,
          ),
        );
      }
    } finally {
      setIsTyping(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
      isSendingRef.current = false;
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
        const isAr = (i18n.language || '').startsWith('ar');
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
      const isAr = (i18n.language || '').startsWith('ar');
      const errorText = isAr
        ? 'عذراً، حدث خطأ أثناء إتمام الحجز. يرجى مراجعة البيانات والمحاولة مجدداً أو التواصل مع خدمة العملاء.'
        : 'Sorry, an error occurred while processing your booking. Please try again or reach out to customer support.';
      setMessages((prev) => [
        ...prev,
        {
          id: `booking-err-${Date.now()}`,
          sender: 'jaider',
          text: errorText,
          timestamp: new Date(),
          isError: true,
        },
      ]);
      return { success: false, error: err.message };
    } finally {
      setIsTyping(false);
    }
  };

  const submitCustomTripInquiry = async (customTripData) => {
    try {
      setIsTyping(true);
      const activeLang = i18n.language ? i18n.language.split('-')[0] : 'en';
      const validLang = ['en', 'ar', 'es', 'pt', 'it'].includes(activeLang) ? activeLang : 'en';

      const payload = {
        fullName: customTripData.fullName || 'Guest Traveler',
        email: customTripData.email,
        phone: customTripData.phone || 'N/A',
        preferredLanguage: validLang,
        destinations: Array.isArray(customTripData.destinations) && customTripData.destinations.length > 0
          ? customTripData.destinations
          : [customTripData.destination || 'Custom Egypt & Regional Tour'],
        startDate: customTripData.startDate || null,
        endDate: customTripData.endDate || null,
        adults: parseInt(customTripData.adults, 10) || 2,
        children: parseInt(customTripData.children, 10) || 0,
        budgetAmount: customTripData.budgetAmount ? parseFloat(customTripData.budgetAmount) : undefined,
        budgetCurrency: customTripData.budgetCurrency || 'USD',
        notes: customTripData.notes || customTripData.itineraryTitle || 'Custom Itinerary requested via GuideR AI Concierge',
      };

      const res = await api.post('/inquiries', payload);
      const refCode = res?.referenceCode || `INQ-${Date.now().toString(36).toUpperCase()}`;

      const isAr = activeLang === 'ar';
      const isEs = activeLang === 'es';
      const isPt = activeLang === 'pt';
      const isIt = activeLang === 'it';

      let successText = `🎉 **تم استلام طلب رحلتك المخصصة بنجاح!**\n\nرقم الطلب المرجعي: **#${refCode}**\n\nتم إرسال تفاصيل برنامج رحلتك المخصصة فوراً إلى لوحة تحكم فريق خبراء دوناس ترافيل وتم ربطها بحسابك. سيتواصل معك مستشار السفر الخاص بك لتأكيد كافة الترتيبات الفاخرة.`;
      if (isEs) {
        successText = `🎉 **¡Hemos recibido tu solicitud de viaje personalizado con éxito!**\n\nNúmero de referencia: **#${refCode}**\n\nLos detalles de tu itinerario se han enviado a nuestro equipo y se han guardado en tu cuenta. Un asesor se comunicará contigo en breve.`;
      } else if (isPt) {
        successText = `🎉 **Recebemos seu pedido de viagem personalizada com sucesso!**\n\nCódigo de referência: **#${refCode}**\n\nOs detalhes foram enviados para nossos especialistas e salvos na sua conta. Um consultor entrará em contato em breve.`;
      } else if (isIt) {
        successText = `🎉 **La tua richiesta di viaggio personalizzato è stata ricevuta con successo!**\n\nCodice di riferimento: **#${refCode}**\n\nI dettagli dell'itinerario sono stati inviati ai nostri specialisti e registrati nel tuo account. Ti contatteremo al più presto.`;
      } else if (!isAr) {
        successText = `🎉 **Your custom trip request has been successfully received!**\n\nReference Code: **#${refCode}**\n\nYour customized itinerary details have been sent to our Dunas Travel specialists and registered to your account. Our senior travel concierge will contact you shortly.`;
      }

      const confirmationMsg = {
        id: `custom-inq-conf-${Date.now()}`,
        sender: 'jaider',
        text: successText,
        timestamp: new Date(),
        customInquiry: {
          referenceCode: refCode,
          ...res,
        },
        structuredContent: {
          type: 'custom_inquiry_confirmation',
          referenceCode: refCode,
          inquiry: res,
        },
      };

      setMessages((prev) => [...prev, confirmationMsg]);
      return { success: true, referenceCode: refCode, data: res };
    } catch (err) {
      console.error('Failed to submit custom trip inquiry:', err);
      const isAr = (i18n.language || '').startsWith('ar');
      const errorText = isAr
        ? 'عذراً، حدث خطأ أثناء إرسال طلب الرحلة المخصصة. يرجى مراجعة البيانات والمحاولة مجدداً.'
        : 'Sorry, an error occurred while submitting your custom trip request. Please check details and try again.';
      setMessages((prev) => [
        ...prev,
        {
          id: `custom-inq-err-${Date.now()}`,
          sender: 'jaider',
          text: errorText,
          timestamp: new Date(),
          isError: true,
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
        submitCustomTripInquiry,
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
