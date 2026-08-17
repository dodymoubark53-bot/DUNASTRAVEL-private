import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaRedoAlt, FaUserTie, FaMapMarkerAlt, FaCalendarAlt, FaTag } from 'react-icons/fa';
import { useJaiderChat } from '../../context/JaiderChatContext';

const JaiderChatWindow = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.dir() === 'rtl';
  const {
    isOpen,
    setIsOpen,
    messages,
    sendMessage,
    startNewChat,
    requestHandoff,
    isTyping,
    loadingKnowledge,
    suggestions,
    leadFormState,
    submitLead
  } = useJaiderChat();

  const [input, setInput] = React.useState('');
  const [leadName, setLeadName] = React.useState('');
  const [leadEmail, setLeadEmail] = React.useState('');
  const [leadPhone, setLeadPhone] = React.useState('');
  const [isSubmittingLead, setIsSubmittingLead] = React.useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const messagesLength = messages.length;

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messagesLength, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    sendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNavigateToTour = (publicUrl) => {
    if (publicUrl) {
      navigate(publicUrl);
    }
  };

  const handleOutsideClick = (e) => {
    if (!isOpen) return;

    if (chatWindowRef.current && chatWindowRef.current.contains(e.target)) {
      return;
    }
    const footerTrigger = document.getElementById('jaider-footer-trigger');
    if (footerTrigger && footerTrigger.contains(e.target)) {
      return;
    }
    const floatTrigger = document.getElementById('askJaiderFloat');
    if (floatTrigger && floatTrigger.contains(e.target)) {
      return;
    }
    const floatingContact = document.getElementById('floating-contact-container');
    if (floatingContact && floatingContact.contains(e.target)) {
      return;
    }

    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const activeLang = i18n.language;

  const getPlaceholder = () => {
    if (activeLang === 'ar' || activeLang === 'ar-eg') return 'اكتب استفسارك لجايدر هنا...';
    if (activeLang === 'es') return 'Escribe tu pregunta aquí...';
    if (activeLang === 'pt') return 'Digite sua pergunta aqui...';
    if (activeLang === 'it') return 'Scrivi la tua domanda qui...';
    return 'Ask GuideR anything about your dream trip...';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={chatWindowRef}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 240 }}
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 30px rgba(201, 162, 39, 0.15)',
          position: 'fixed',
          zIndex: 999,
        }}
        className={`
          inset-0 sm:inset-auto sm:bottom-6 lg:bottom-8
          ${isRtl ? 'sm:left-6' : 'sm:right-6'}
          w-full sm:w-[410px] lg:w-[450px]
          max-h-[100dvh] sm:max-h-[calc(100dvh-3rem)] lg:max-h-[calc(100dvh-4rem)]
          h-full sm:h-[650px]
          rounded-none sm:rounded-3xl
          overflow-hidden flex flex-col
          border-0 sm:border border-white/20 dark:border-gold-500/30
          bg-slate-950/95 backdrop-blur-xl
          ${isRtl ? 'rounded-bl-none' : 'rounded-br-none'}
          sm:pt-0 pt-[104px]
        `}
      >
        <style>{`
          .chat-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .chat-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .chat-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(201, 162, 39, 0.35);
            border-radius: 9999px;
          }
          .chat-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(201, 162, 39, 0.6);
          }
        `}</style>

        {/* Header */}
        <div
          className="px-5 py-3.5 sm:py-4 flex items-center justify-between text-white shrink-0 border-b border-gold-500/20"
          style={{
            background: 'linear-gradient(135deg, rgb(10,25,105) 0%, rgb(6,29,93) 100%)'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/imgs/tito-mascot.webp"
                alt="GuideR"
                className="w-10 h-10 object-contain bg-white/10 rounded-full p-0.5 border border-gold-400/40 shadow-inner"
                width="40"
                height="40"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#061d5d] flex items-center justify-center">
                <span className="absolute w-full h-full rounded-full bg-emerald-400 animate-ping opacity-75" />
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display font-bold tracking-wide text-base truncate text-white">
                {isRtl ? 'جايدر | GuideR Concierge' : 'GuideR AI Concierge'}
              </span>
              <span className="text-[11px] text-gold-400 font-semibold tracking-wider flex items-center gap-1.5">
                {loadingKnowledge ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                    {isRtl ? 'جاري الاتصال...' : 'Connecting...'}
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {isRtl ? 'مستشارك السياحي الفاخر' : 'Luxury Sales Advisor'}
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => requestHandoff()}
              title={isRtl ? 'طلب التحدث مع مستشار مبيعات' : 'Speak to Sales Specialist'}
              className="text-[11px] bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40 px-2.5 py-1 rounded-full font-bold transition-all flex items-center gap-1 hover:scale-105 active:scale-95"
            >
              <FaUserTie size={10} />
              <span>{isRtl ? 'مستشار' : 'Consultant'}</span>
            </button>
            <button
              onClick={() => startNewChat()}
              title={isRtl ? 'محادثة جديدة' : 'New Chat'}
              className="p-2 rounded-full hover:bg-white/15 text-gold-300 hover:text-white transition-all hover:scale-110 active:scale-95"
            >
              <FaRedoAlt size={13} />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              title={isRtl ? 'إغلاق' : 'Close'}
              className="p-2 rounded-full hover:bg-white/15 text-white/80 hover:text-white transition-all hover:scale-110 active:scale-95"
            >
              <FaTimes size={15} />
            </button>
          </div>
        </div>

        {/* Message Transcript Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 sm:py-4 flex flex-col gap-3.5 chat-scrollbar bg-[#070e24]/60 min-h-0">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isJaider = msg.sender === 'jaider';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 max-w-[92%] sm:max-w-[88%] ${
                    isJaider ? 'self-start' : 'self-end flex-row-reverse'
                  }`}
                >
                  {isJaider && (
                    <img
                      src="/imgs/tito-mascot.webp"
                      alt="GuideR"
                      className="w-7 h-7 object-contain bg-white/10 rounded-full p-0.5 border border-gold-400/30 shrink-0 self-end mb-1"
                      width="28"
                      height="28"
                    />
                  )}
                  <div className="flex flex-col space-y-2 max-w-full">
                    {/* Text Message Bubble */}
                    <div
                      dir="auto"
                      className={`px-4 py-3 rounded-2xl text-sm sm:text-[13.5px] leading-relaxed shadow-sm font-medium ${
                        isJaider
                          ? 'bg-slate-900/90 border border-gold-500/20 text-slate-100 rounded-bl-xs'
                          : 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-br-xs border border-blue-500/30'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    {/* Grounded Tour Recommendation Cards */}
                    {msg.tours && msg.tours.length > 0 && (
                      <div className="flex flex-col gap-2.5 pt-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                          <FaTag size={10} />
                          {isRtl ? 'الرحلات المقترحة المتاحة:' : 'Recommended Luxury Tours:'}
                        </span>
                        {msg.tours.map((t) => (
                          <div
                            key={t.id}
                            onClick={() => handleNavigateToTour(t.publicUrl)}
                            className="flex gap-3 bg-slate-900/95 hover:bg-slate-800/95 p-3 rounded-2xl border border-gold-500/30 hover:border-gold-400 transition-all shadow-md group cursor-pointer"
                          >
                            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-800 relative">
                              <img
                                src={t.image || '/imgs/tito-mascot.webp'}
                                alt={t.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex flex-col justify-between min-w-0 flex-1 py-0.5">
                              <div>
                                <h4 className="text-xs sm:text-[13px] font-bold text-white group-hover:text-gold-300 transition-colors truncate">
                                  {t.title}
                                </h4>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                                  <FaMapMarkerAlt size={9} className="text-gold-400 shrink-0" />
                                  {t.destination}
                                </p>
                              </div>
                              <div className="flex items-center justify-between mt-1 pt-1 border-t border-slate-800">
                                <span className="text-xs font-bold text-gold-400">
                                  ${t.price} {t.currency}
                                </span>
                                <span className="text-[10px] bg-gold-500/20 text-gold-300 font-bold px-2 py-0.5 rounded-md group-hover:bg-gold-500 group-hover:text-slate-950 transition-all">
                                  {isRtl ? 'عرض الرحلة ←' : 'View Tour →'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Grounded Destination Recommendation Pills */}
                    {msg.destinations && msg.destinations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.destinations.map((d) => (
                          <button
                            key={d.id}
                            onClick={() => handleNavigateToTour(d.publicUrl)}
                            className="px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-bold hover:bg-gold-500/25 transition-all flex items-center gap-1.5"
                          >
                            <FaMapMarkerAlt size={9} />
                            <span>{d.title}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Suggested Follow-up Replies */}
                    {msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedReplies.map((reply, rIdx) => (
                          <button
                            key={rIdx}
                            onClick={() => sendMessage(reply)}
                            className="text-xs px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-gold-300 transition-all hover:scale-102 shadow-xs"
                          >
                            {reply}
                          </button>
                        ))}
                      </div>
                    )}

                    <span
                      className={`text-[10px] text-slate-500 mt-1 ${
                        isJaider ? 'self-start pl-1' : 'self-end pr-1'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5 max-w-[80%] self-start"
            >
              <img
                src="/imgs/tito-mascot.webp"
                alt="GuideR"
                className="w-7 h-7 object-contain bg-white/10 rounded-full p-0.5 border border-gold-400/30 shrink-0 self-end mb-1"
                width="28"
                height="28"
              />
              <div className="px-4 py-3 rounded-2xl bg-slate-900/90 border border-gold-500/20 rounded-bl-xs flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Inline Lead Capture Form */}
        {leadFormState?.required && (
          <div className="px-4 py-3 bg-gradient-to-r from-[#102a71] to-[#0a1969] border-t border-gold-500/30 flex flex-col gap-2 shrink-0">
            <span className="text-xs font-bold text-gold-300">
              {isRtl ? 'أدخل تفاصيلك ليصلك عرض أسعار مخصص وتواصل مباشر:' : 'Enter your details to receive a custom quote & specialist contact:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder={isRtl ? 'الاسم' : 'Name'}
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-gold-500"
              />
              <input
                type="email"
                placeholder={isRtl ? 'البريد الإلكتروني' : 'Email'}
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-gold-500"
              />
              <input
                type="tel"
                placeholder={isRtl ? 'رقم الهاتف' : 'Phone'}
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-gold-500"
              />
            </div>
            <button
              disabled={isSubmittingLead || !leadEmail}
              onClick={async () => {
                setIsSubmittingLead(true);
                await submitLead({ name: leadName, email: leadEmail, phone: leadPhone });
                setIsSubmittingLead(false);
              }}
              className="mt-1 py-1.5 bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-bold text-xs rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isSubmittingLead ? (isRtl ? 'جاري الإرسال...' : 'Submitting...') : (isRtl ? 'إرسال الطلب' : 'Submit Request')}
            </button>
          </div>
        )}

        {/* Suggestion Chips */}
        {messages.length === 1 && !isTyping && (
          <div className="px-4 sm:px-5 py-3 flex flex-wrap gap-2 justify-center border-t border-white/10 bg-slate-950/80 shrink-0">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(suggestion)}
                className="px-3.5 py-2 rounded-full bg-slate-900 border border-gold-500/20 hover:border-gold-400 text-left text-xs font-semibold text-gold-300 hover:bg-gold-500/10 transition-all duration-200 hover:scale-102 shadow-sm truncate max-w-full"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-gold-500/20 bg-slate-950/90 flex items-center gap-2.5 shrink-0 pb-safe">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            placeholder={getPlaceholder()}
            className="flex-1 px-4 py-3 rounded-full bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-400 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            style={{
              background: 'linear-gradient(135deg, #f5a623 0%, #d4921e 100%)'
            }}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-obsidian-950 shadow-md transition-all active:scale-95 ${
              !input.trim() || isTyping
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 hover:shadow-[0_0_15px_rgba(245,166,35,0.5)]'
            }`}
          >
            <FaPaperPlane className={`text-sm ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JaiderChatWindow;