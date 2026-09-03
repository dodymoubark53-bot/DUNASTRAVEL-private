import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPaperPlane,
  FaTimes,
  FaRedoAlt,
  FaUserTie,
  FaMapMarkerAlt,
  FaTag,
  FaCheckCircle,
  FaCrown,
  FaChevronDown,
  FaChevronUp,
  FaThumbsUp,
  FaThumbsDown,
  FaStopCircle,
  FaBalanceScale,
  FaSlidersH,
  FaWhatsapp,
  FaArrowRight,
  FaCalendarCheck,
  FaCompass,
} from 'react-icons/fa';
import { useJaiderChat } from '../../context/JaiderChatContext';
import FormattedChatMessage from './FormattedChatMessage';

const JaiderChatWindow = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRtl = i18n.dir() === 'rtl';
  const {
    isOpen,
    setIsOpen,
    messages,
    sendMessage,
    refineItinerary,
    submitFeedback,
    stopGenerating,
    startNewChat,
    isTyping,
    suggestions,
    leadFormState,
    submitLead,
  } = useJaiderChat();

  const [input, setInput] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [expandedProposalDay, setExpandedProposalDay] = useState(null);
  const [feedbackState, setFeedbackState] = useState({}); // { [msgId]: { rated: 1 | -1, category?: string } }
  const [activeFeedbackModal, setActiveFeedbackModal] = useState(null); // msgId for negative feedback
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('INCORRECT_INFO');

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
  }, [messagesLength, isOpen, isTyping]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const textToSend = input;
    setInput('');
    sendMessage(textToSend);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNavigateToTour = (publicUrl) => {
    if (publicUrl) {
      navigate(publicUrl);
      setIsOpen(false);
    }
  };

  const handleCustomInquiry = (tourTitle) => {
    const query = tourTitle ? `?tour=${encodeURIComponent(tourTitle)}` : '';
    navigate(`/tailor-a-tour${query}`);
    setIsOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (!isOpen) return;
    if (chatWindowRef.current && chatWindowRef.current.contains(e.target)) {
      return;
    }
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    if (!leadName.trim() || !leadEmail.trim()) return;
    setIsSubmittingLead(true);
    await submitLead({
      name: leadName.trim(),
      email: leadEmail.trim(),
      phone: leadPhone.trim(),
    });
    setIsSubmittingLead(false);
    setLeadName('');
    setLeadEmail('');
    setLeadPhone('');
  };

  const handleRate = async (msgId, rating) => {
    if (rating === 1) {
      setFeedbackState((prev) => ({ ...prev, [msgId]: { rated: 1 } }));
      await submitFeedback(msgId, 1);
    } else {
      setActiveFeedbackModal(msgId);
    }
  };

  const handleConfirmNegativeFeedback = async () => {
    if (!activeFeedbackModal) return;
    setFeedbackState((prev) => ({ ...prev, [activeFeedbackModal]: { rated: -1, category: feedbackCategory } }));
    await submitFeedback(activeFeedbackModal, -1, feedbackCategory, feedbackComment);
    setActiveFeedbackModal(null);
    setFeedbackComment('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={handleOutsideClick}
          className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-[9999] flex flex-col items-end"
          dir={isRtl ? 'rtl' : 'ltr'}
          role="dialog"
          aria-modal="true"
          aria-label={t('jaider.title', 'Dunas Travel AI Concierge')}
        >
          <motion.div
            ref={chatWindowRef}
            style={{ transformOrigin: 'bottom right' }}
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: 'spring', damping: 26, stiffness: 320 }}
            className="w-[94vw] sm:w-[440px] md:w-[480px] h-[640px] max-h-[86vh] bg-slate-950/95 backdrop-blur-2xl border border-gold-500/35 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.65)] flex flex-col overflow-hidden text-slate-100 font-sans"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-obsidian-900 via-slate-900 to-obsidian-900 p-4 border-b border-gold-500/20 flex items-center justify-between relative select-none">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full border border-gold-400/40 p-1 bg-obsidian-950 flex items-center justify-center shadow-inner">
                    <img
                      src="/imgs/tito-mascot.webp"
                      alt="GuideR"
                      className="w-full h-full object-contain filter drop-shadow"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-obsidian-950 rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm sm:text-base text-gold-300 tracking-wide flex items-center gap-1">
                      <bdi>GuideR</bdi>
                      <span className="text-[10px] bg-gold-500/20 text-gold-300 font-semibold px-1.5 py-0.5 rounded border border-gold-500/30">
                        <bdi>AI Concierge</bdi>
                      </span>
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {t('jaider.subtitle', 'Dunas Travel Luxury Travel Concierge')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={startNewChat}
                  title={t('jaider.newChat', 'New Chat')}
                  aria-label={t('jaider.newChat', 'New Chat')}
                  className="p-2 text-slate-400 hover:text-gold-400 transition-colors rounded-full hover:bg-slate-800"
                >
                  <FaRedoAlt size={13} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title={t('jaider.close', 'Close')}
                  aria-label={t('jaider.close', 'Close')}
                  className="p-2 text-slate-400 hover:text-rose-400 transition-colors rounded-full hover:bg-slate-800"
                >
                  <FaTimes size={15} />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div
              className="flex-1 p-4 overflow-y-auto space-y-4 scroll-smooth focus:outline-none relative"
              tabIndex={0}
              aria-live="polite"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  const isStaff = msg.sender === 'staff';
                  const isJaider = msg.sender === 'jaider';
                  const feedback = feedbackState[msg.id];

                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex gap-2.5 max-w-[92%] ${isUser ? 'self-end ml-auto flex-row-reverse' : 'self-start'}`}
                    >
                      {!isUser && (
                        <div className="w-8 h-8 rounded-full border border-gold-400/30 p-0.5 bg-slate-900 shrink-0 self-end mb-1 flex items-center justify-center">
                          {isStaff ? (
                            <FaUserTie className="text-gold-400" size={14} />
                          ) : (
                            <img
                              src="/imgs/tito-mascot.webp"
                              alt="GuideR"
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5 w-full">
                        {isStaff && (
                          <span className="text-[10px] font-bold text-gold-400 bg-gold-500/10 px-2 py-0.5 rounded-md self-start border border-gold-500/30 flex items-center gap-1">
                            <FaCrown size={9} />
                            {t('jaider.humanAgent', 'Dunas Concierge Staff (Human Agent)')}
                          </span>
                        )}

                        <div
                          className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-sm transition-all ${
                            isUser
                              ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-none shadow-md px-4 py-2.5'
                              : isStaff
                              ? 'bg-slate-900/90 text-slate-100 border border-amber-500/40 rounded-tl-none'
                              : msg.isError
                              ? 'bg-rose-950/40 text-rose-200 border border-rose-500/40 rounded-tl-none'
                              : 'bg-slate-900/90 text-slate-200 border border-slate-800 rounded-tl-none'
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap font-bold text-slate-950">{msg.text}</p>
                          ) : (
                            <>
                              {msg.text ? (
                                <FormattedChatMessage text={msg.text} isStreaming={msg.isStreaming} />
                              ) : msg.isStreaming ? (
                                <div className="flex items-center gap-2 py-0.5">
                                  <span className="flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                  </span>
                                  <span className="text-[11px] font-bold text-amber-300">
                                    {isRtl ? 'جاري تحضير الرد والتفاصيل الفاخرة...' : 'Curating personalized luxury details...'}
                                  </span>
                                </div>
                              ) : null}
                            </>
                          )}

                          {msg.isError && (
                            <div className="mt-3 flex flex-wrap gap-2 pt-2.5 border-t border-rose-500/30">
                              {msg.failedMessageText && (
                                <button
                                  onClick={() => sendMessage(msg.failedMessageText)}
                                  className="px-3 py-1.5 bg-gold-500/20 hover:bg-gold-500 hover:text-obsidian-950 text-gold-300 font-bold text-xs rounded-xl border border-gold-500/40 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <FaRedoAlt size={10} />
                                  <span>{isRtl ? 'إعادة المحاولة' : 'Retry'}</span>
                                </button>
                              )}
                              <a
                                href={`https://wa.me/201149401111?text=${encodeURIComponent(
                                  isRtl
                                    ? 'مرحباً دوناس ترافيل، أود المساعدة من مستشار السفر بخصوص رحلتي.'
                                    : 'Hello Dunas Travel, I would like assistance from a senior travel specialist.'
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs rounded-xl border border-emerald-500/40 transition-all flex items-center gap-1.5"
                              >
                                <FaWhatsapp size={12} />
                                <span>{isRtl ? 'تواصل عبر واتساب' : 'Chat on WhatsApp'}</span>
                              </a>
                            </div>
                          )}
                        </div>

                        {/* Structured Tour Comparison Card */}
                        {msg.comparison && msg.comparison.tours && (
                          <div className="mt-2 p-3.5 bg-slate-900/95 border border-gold-500/40 rounded-2xl shadow-lg flex flex-col gap-3">
                            <div className="flex items-center justify-between border-b border-gold-500/20 pb-2">
                              <span className="text-xs font-bold text-gold-300 flex items-center gap-1.5">
                                <FaBalanceScale size={12} className="text-gold-400" />
                                {t('jaider.tourComparison', 'Grounded Tour Comparison:')}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              {msg.comparison.tours.map((tItem, idx) => (
                                <div key={idx} className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 flex flex-col justify-between">
                                  <div>
                                    <h5 className="font-bold text-[11px] text-gold-300 truncate">{tItem.title}</h5>
                                    <p className="text-[10px] text-slate-400 mt-0.5"><bdi dir="ltr">{tItem.durationDays} Days • ${tItem.price} {tItem.currency}</bdi></p>
                                  </div>
                                  <button
                                    onClick={() => handleNavigateToTour(tItem.publicUrl)}
                                    className="mt-2 w-full py-1 bg-gold-500/20 hover:bg-gold-500 hover:text-slate-950 text-gold-300 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                                  >
                                    {t('jaider.viewTour', 'View Tour')}
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* Key Differences Table */}
                            {msg.comparison.differences && (
                              <div className="text-[10px] border-t border-slate-800 pt-2 flex flex-col gap-1.5">
                                {msg.comparison.differences.map((d, dIdx) => (
                                  <div key={dIdx} className="flex justify-between items-center bg-slate-950/50 px-2 py-1 rounded">
                                    <span className="text-slate-400">{d.aspect}</span>
                                    <span className="font-semibold text-slate-200">{d.tourAValue} vs {d.tourBValue}</span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Summary Recommendation */}
                            {msg.comparison.summaryRecommendation && (
                              <p className="text-[11px] text-slate-300 bg-gold-500/10 p-2 rounded-xl border border-gold-500/20 italic">
                                💡 {msg.comparison.summaryRecommendation}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Structured Itinerary Proposal Accordion */}
                        {msg.proposal && (
                          <div className="mt-2 p-3 bg-gradient-to-b from-slate-900 to-obsidian-950 border border-gold-500/40 rounded-2xl shadow-xl flex flex-col gap-2.5">
                            <div className="flex items-center justify-between border-b border-gold-500/20 pb-2">
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1">
                                  <FaCrown size={10} />
                                  {msg.proposal.tier} ITINERARY
                                </span>
                                <h4 className="font-bold text-xs sm:text-sm text-slate-100 mt-0.5">
                                  {msg.proposal.title}
                                </h4>
                              </div>
                              <span className="text-xs font-bold text-gold-300 bg-gold-500/10 px-2.5 py-1 rounded-full border border-gold-500/30 shrink-0">
                                <bdi dir="ltr">~${msg.proposal.estimatedPricePerPerson} {msg.proposal.currency}</bdi>
                              </span>
                            </div>

                            {/* Day-by-day accordion list */}
                            <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
                              {msg.proposal.days?.map((day) => {
                                const isExpanded = expandedProposalDay === day.dayNumber;
                                return (
                                  <div
                                    key={day.dayNumber}
                                    className="bg-slate-950/70 rounded-xl border border-slate-800 overflow-hidden"
                                  >
                                    <button
                                      onClick={() => setExpandedProposalDay(isExpanded ? null : day.dayNumber)}
                                      className="w-full p-2 text-left flex items-center justify-between text-xs hover:bg-slate-800/60 transition-colors cursor-pointer"
                                    >
                                      <div className="flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                                          {day.dayNumber}
                                        </span>
                                        <span className="font-semibold text-slate-200 truncate max-w-[240px]">
                                          {day.title}
                                        </span>
                                      </div>
                                      {isExpanded ? (
                                        <FaChevronUp size={10} className="text-gold-400 shrink-0" />
                                      ) : (
                                        <FaChevronDown size={10} className="text-gold-400 shrink-0" />
                                      )}
                                    </button>
                                    {isExpanded && (
                                      <div className="px-3 pb-2.5 pt-1 text-[11px] text-slate-300 border-t border-slate-800">
                                        <p className="leading-relaxed">{day.description}</p>
                                        {day.meals && (
                                          <span className="inline-block mt-1 text-[10px] text-gold-400 font-medium">
                                            🍽 {day.meals}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Refinement Quick-Action Pills */}
                            <div className="pt-1 flex flex-wrap gap-1.5">
                              <button
                                onClick={() => refineItinerary(isRtl ? 'أضف ليلة إضافية في الأقصر' : 'Add 1 extra night in Luxor')}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-gold-300 text-[10px] font-semibold rounded-lg border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <FaSlidersH size={8} />
                                {t('jaider.addLuxorNight', '+1 Luxor Night')}
                              </button>
                              <button
                                onClick={() => refineItinerary(isRtl ? 'احذف الغردقة وخليها آثار فقط' : 'Remove Hurghada, focus on history')}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold rounded-lg border border-slate-700 transition-all cursor-pointer"
                              >
                                {t('jaider.noBeach', 'No Beach')}
                              </button>
                              <button
                                onClick={() => refineItinerary(isRtl ? 'خفض الميزانية واقترح خيارات بديلة' : 'Reduce budget and suggest best value')}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold rounded-lg border border-slate-700 transition-all cursor-pointer"
                              >
                                {t('jaider.lowerBudget', 'Lower Budget')}
                              </button>
                            </div>

                            {/* Proposal CTA Actions */}
                            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-gold-500/20">
                              <button
                                onClick={() => handleCustomInquiry(msg.proposal.title)}
                                className="flex-1 py-2.5 px-3 bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-bold text-xs rounded-xl hover:brightness-110 transition-all text-center shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <span>{isRtl ? 'تخصيص هذا البرنامج الفاخر' : t('jaider.customizeTrip', 'Customize This Trip')}</span>
                                <span className={isRtl ? 'rotate-180' : ''}>→</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Grounded Tour Recommendation Cards (Only shown when explicitly relevant) */}
                        {msg.tours && msg.tours.filter((tItem) => tItem && typeof tItem === 'object' && tItem.title).length > 0 && (
                          <div className="flex flex-col gap-2.5 pt-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gold-400 flex items-center gap-1.5">
                              <FaTag size={10} />
                              {t('jaider.verifiedTours', 'Verified Catalog Tours:')}
                            </span>
                            {msg.tours.filter((tItem) => tItem && typeof tItem === 'object' && tItem.title).map((tItem) => (
                              <div
                                key={tItem.id || tItem.slug}
                                className="flex flex-col bg-slate-900/95 hover:bg-slate-800/95 p-3 rounded-2xl border border-gold-500/30 hover:border-gold-400/80 transition-all shadow-md group"
                              >
                                <div className="flex gap-3">
                                  <div
                                    onClick={() => handleNavigateToTour(tItem.publicUrl)}
                                    className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-800 relative cursor-pointer"
                                  >
                                    <img
                                      src={tItem.image || 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80'}
                                      alt={tItem.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=800&q=80';
                                      }}
                                    />
                                  </div>
                                  <div className="flex flex-col justify-between min-w-0 flex-1 py-0.5">
                                    <div>
                                      <h4
                                        onClick={() => handleNavigateToTour(tItem.publicUrl)}
                                        className="text-xs sm:text-[13px] font-bold text-white group-hover:text-gold-300 transition-colors truncate cursor-pointer"
                                      >
                                        {tItem.title}
                                      </h4>
                                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                                        <FaMapMarkerAlt size={9} className="text-gold-400 shrink-0" />
                                        {tItem.destination || 'Egypt'}
                                      </p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 gap-1.5">
                                      <span className="text-xs font-bold text-gold-400">
                                        <bdi dir="ltr">${tItem.price || 1490} {tItem.currency || 'USD'}</bdi>
                                      </span>
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          onClick={() => handleCustomInquiry(tItem.title)}
                                          className="text-[10px] bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-extrabold px-2.5 py-1 rounded-lg hover:brightness-110 shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                                        >
                                          <FaCalendarCheck size={9} />
                                          <span>{isRtl ? 'طلب حجز / استفسار' : 'Inquire / Book'}</span>
                                        </button>
                                        <button
                                          onClick={() => handleNavigateToTour(tItem.publicUrl)}
                                          className="text-[10px] bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white font-bold px-2.5 py-1 rounded-lg border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                                        >
                                          <span>{isRtl ? 'التفاصيل' : 'Details'}</span>
                                          <FaArrowRight size={8} className={isRtl ? 'rotate-180' : ''} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {tItem.matchReasons && tItem.matchReasons.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-col gap-1">
                                    {tItem.matchReasons.map((reason, rIdx) => (
                                      <div key={rIdx} className="text-[10px] text-slate-300 flex items-center gap-1.5">
                                        <FaCheckCircle size={9} className="text-emerald-400 shrink-0" />
                                        <span>{reason}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
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
                                className="text-xs px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-gold-300 transition-all hover:scale-102 shadow-xs cursor-pointer"
                              >
                                {reply}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Message Footer: Timestamp & Feedback Rating */}
                        <div className="flex items-center justify-between mt-1 px-1">
                          <span className="text-[10px] text-slate-500">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>

                          {isJaider && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleRate(msg.id, 1)}
                                title="Helpful"
                                className={`p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer ${feedback?.rated === 1 ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
                              >
                                <FaThumbsUp size={10} />
                              </button>
                              <button
                                onClick={() => handleRate(msg.id, -1)}
                                title="Not helpful"
                                className={`p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer ${feedback?.rated === -1 ? 'text-rose-400' : 'text-slate-500 hover:text-slate-300'}`}
                              >
                                <FaThumbsDown size={10} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isTyping && !messages.some((m) => m.sender === 'jaider' && m.isStreaming) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5 max-w-[80%] self-start"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 border border-amber-500/30 p-0.5 shrink-0 self-end mb-1 flex items-center justify-center">
                    <img
                      src="/imgs/tito-mascot.webp"
                      alt="GuideR"
                      className="w-full h-full object-contain"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-amber-300">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></span>
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse delay-200"></span>
                    <span className="text-[11px] text-slate-300 ml-1 font-medium">
                      {t('jaider.searching', 'GuideR is searching catalog...')}
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Stop Generating Banner */}
            {isTyping && (
              <div className="px-4 py-1.5 bg-slate-900/90 border-t border-slate-800 flex justify-center">
                <button
                  onClick={stopGenerating}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1 rounded-full border border-rose-500/30 transition-all font-semibold cursor-pointer"
                >
                  <FaStopCircle size={12} />
                  {t('jaider.stop', 'Stop generating')}
                </button>
              </div>
            )}

            {/* Negative Feedback Modal */}
            {activeFeedbackModal && (
              <div className="p-3 bg-slate-900 border-t border-gold-500/30 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-gold-300">
                  <span>{isRtl ? 'ما المشكلة في هذه الإجابة؟' : 'What was wrong with this answer?'}</span>
                  <button onClick={() => setActiveFeedbackModal(null)} className="text-slate-400 hover:text-white cursor-pointer">
                    <FaTimes size={11} />
                  </button>
                </div>
                <select
                  value={feedbackCategory}
                  onChange={(e) => setFeedbackCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs rounded-lg p-1.5 text-slate-200"
                >
                  <option value="INCORRECT_INFO">{isRtl ? 'معلومات غير دقيقة' : 'Incorrect information'}</option>
                  <option value="NOT_RELEVANT">{isRtl ? 'غير مرتبط بسؤالي' : 'Not relevant to question'}</option>
                  <option value="POOR_RECOMMENDATION">{isRtl ? 'ترشيح غير مناسب' : 'Poor recommendation'}</option>
                  <option value="OUTDATED">{isRtl ? 'بيانات قديمة' : 'Outdated details'}</option>
                </select>
                <input
                  type="text"
                  placeholder={isRtl ? 'ملاحظات إضافية (اختياري)...' : 'Optional comments...'}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs rounded-lg p-1.5 text-slate-200"
                />
                <button
                  onClick={handleConfirmNegativeFeedback}
                  className="w-full py-1.5 bg-gold-500 text-slate-950 font-bold text-xs rounded-lg hover:brightness-110 cursor-pointer"
                >
                  {isRtl ? 'إرسال الملاحظات' : 'Submit Feedback'}
                </button>
              </div>
            )}

            {/* Lead Capture Form */}
            {leadFormState.required && (
              <form onSubmit={handleLeadSubmit} className="p-3.5 bg-slate-900/95 border-t border-gold-500/30 flex flex-col gap-2">
                <span className="text-xs font-bold text-gold-300 flex items-center gap-1.5">
                  <FaCrown size={12} className="text-gold-400" />
                  {isRtl ? '✨ احصل على عرض أسعار رسمي واستشارة VIP:' : '✨ Receive official quote & VIP consultation:'}
                </span>
                <input
                  type="text"
                  placeholder={isRtl ? 'الاسم الكريم' : 'Full Name *'}
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-200 focus:border-gold-400 focus:outline-none"
                />
                <input
                  type="email"
                  placeholder={isRtl ? 'البريد الإلكتروني' : 'Email Address *'}
                  required
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-200 focus:border-gold-400 focus:outline-none"
                />
                <input
                  type="tel"
                  placeholder={isRtl ? 'رقم الهاتف / واتساب (اختياري)' : 'Phone / WhatsApp (Optional)'}
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs rounded-xl px-3 py-2 text-slate-200 focus:border-gold-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="w-full py-2 bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-bold text-xs rounded-xl hover:brightness-110 transition-all shadow-md mt-1 cursor-pointer"
                >
                  {isSubmittingLead ? (isRtl ? 'جاري الإرسال...' : 'Submitting...') : (isRtl ? 'إرسال لمستشار المبيعات' : 'Connect with Travel Designer')}
                </button>
              </form>
            )}

            {/* Input Footer */}
            <div className="p-3 bg-slate-950 border-t border-amber-500/20 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  placeholder={isRtl ? 'اكتب استفسارك أو اطلب تصميم رحلة مخصصة...' : t('jaider.placeholder', 'Ask GuideR about tours, cruises, or custom trips...')}
                  className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-[13px] text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40 shadow-inner"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                    input.trim() && !isTyping
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md font-bold cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                  aria-label={t('jaider.send', 'Send')}
                >
                  <FaPaperPlane size={14} className={isRtl ? 'rotate-180' : ''} />
                </button>
              </div>

              {/* Suggestions row */}
              {messages.length <= 2 && suggestions && suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1 max-h-24 overflow-y-auto">
                  {suggestions.slice(0, 4).map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(s)}
                      className="text-[11px] px-3 py-1 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-gold-500/40 text-slate-300 hover:text-gold-300 rounded-lg transition-colors truncate max-w-full cursor-pointer flex items-center gap-1"
                    >
                      <FaCompass size={9} className="text-gold-400 shrink-0" />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JaiderChatWindow;