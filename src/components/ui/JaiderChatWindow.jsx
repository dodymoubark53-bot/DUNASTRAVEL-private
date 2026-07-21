import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaTrashAlt, FaCommentDots, FaComment, FaChevronDown } from 'react-icons/fa';
import { useJaiderChat } from '../../context/JaiderChatContext';

const JaiderChatWindow = () => {
  const { i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const {
    isOpen,
    setIsOpen,
    messages,
    sendMessage,
    clearMessages,
    isTyping,
    loadingKnowledge,
    suggestions
  } = useJaiderChat();

  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);
  const chatBubbleRef = useRef(null);
  const [showBubble, setShowBubble] = React.useState(false);
  const [visibleSimilarQuestions, setVisibleSimilarQuestions] = React.useState(new Set());

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

  // Auto-hide similar questions after 2 seconds
  useEffect(() => {
    const timers = [];
    visibleSimilarQuestions.forEach(msgId => {
      const timer = setTimeout(() => {
        setVisibleSimilarQuestions(prev => {
          const next = new Set(prev);
          next.delete(msgId);
          return next;
        });
      }, 2000);
      timers.push(timer);
    });
    return () => timers.forEach(t => clearTimeout(t));
  }, [visibleSimilarQuestions]);

  // Show similar questions when new message with similarQuestions arrives
  useEffect(() => {
    messages.forEach(msg => {
      if (msg.similarQuestions && msg.similarQuestions.length > 0 && !visibleSimilarQuestions.has(msg.id)) {
        setVisibleSimilarQuestions(prev => new Set([...prev, msg.id]));
      }
    });
  }, [messages, visibleSimilarQuestions]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
    setShowBubble(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleSimilarQuestionClick = (question) => {
    sendMessage(question);
  };

  const handleOutsideClick = (e) => {
    if (!isOpen) return;
    
    // Check if clicking inside the chat window
    if (chatWindowRef.current && chatWindowRef.current.contains(e.target)) {
      return;
    }
    
    // Check if clicking the chat bubble toggle button
    if (chatBubbleRef.current && chatBubbleRef.current.contains(e.target)) {
      return;
    }
    
    // Check if clicking the footer trigger mascot
    const footerTrigger = document.getElementById('jaider-footer-trigger');
    if (footerTrigger && footerTrigger.contains(e.target)) {
      return;
    }
    
    // Check if clicking the floating robot button
    const floatTrigger = document.getElementById('askJaiderFloat');
    if (floatTrigger && floatTrigger.contains(e.target)) {
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
    if (activeLang === 'ar' || activeLang === 'ar-eg') return 'اكتب سؤالك هنا...';
    return 'Type your question...';
  };

  const ChatBubble = () => (
    <motion.button
      ref={chatBubbleRef}
      onClick={() => { setIsOpen(true); setShowBubble(false); }}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center text-obsidian-900 bg-gradient-to-tr from-gold-700 via-gold-500 to-gold-300 shadow-[0_0_24px_rgba(201,162,39,0.35)] hover:shadow-[0_0_32px_rgba(201,162,39,0.5)] transition-shadow duration-300"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [1, 1.06, 1], opacity: 1 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      exit={{ scale: 0, opacity: 0 }}
    >
      <FaComment size={28} />
      <motion.span
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        1
      </motion.span>
    </motion.button>
  );

  if (!isOpen && !showBubble) return null;

  return (
    <AnimatePresence>
      {!isOpen && showBubble && <ChatBubble />}
      
      <motion.div
        ref={chatWindowRef}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        style={{
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
          position: 'fixed',
          zIndex: 999,
        }}
className={`
          inset-0 sm:inset-auto sm:bottom-6 lg:bottom-8
          ${isRtl ? 'sm:left-6' : 'sm:right-6'}
          w-full sm:w-[380px] lg:w-[420px]
          max-h-[100dvh] sm:max-h-[calc(100dvh-3rem)] lg:max-h-[calc(100dvh-4rem)]
          h-full sm:h-auto
          rounded-none sm:rounded-3xl
          overflow-hidden flex flex-col
          border-0 sm:border border-white/20 dark:border-gold-500/20
          glass-dark
          ${isRtl ? 'rounded-bl-none' : 'rounded-br-none'}
          sm:pt-0 pt-[104px]
        `}
      >
        <style>{`
          .chat-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .chat-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .chat-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(245, 166, 35, 0.35);
            border-radius: 9999px;
          }
          .chat-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(245, 166, 35, 0.6);
          }
        `}</style>

        {/* Header */}
        <div
          className="px-5 py-3 sm:py-4 flex items-center justify-between text-white shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgb(10,25,105) 0%, rgb(6,29,93) 100%)'
          }}
        >
          <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/imgs/tito-mascot.webp"
                  alt="Jaider"
                  className="w-9 h-9 sm:w-10 sm:h-10 object-contain bg-white/10 rounded-full p-0.5 border border-gold-500/30"
                  width="40"
                  height="40"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#061d5d] flex items-center justify-center">
                  <span className="absolute w-full h-full rounded-full bg-emerald-400 animate-ping opacity-75" />
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-display font-semibold tracking-wide text-base sm:text-lg truncate">
                  Jaider
                </span>
                <span className="text-[11px] text-gold-400/90 font-medium tracking-wider uppercase flex items-center gap-1.5">
                {loadingKnowledge ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Online · FAQ Expert
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearMessages}
              title="Clear conversation"
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95"
            >
              <FaTrashAlt size={13} />
            </button>
            <button
              onClick={() => { setIsOpen(false); setShowBubble(true); setTimeout(() => setShowBubble(false), 2000); }}
              className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95"
            >
              <FaTimes size={15} />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 sm:py-4 flex flex-col gap-3 chat-scrollbar bg-[#f8f9ff]/5 dark:bg-obsidian-950/20 min-h-0">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isJaider = msg.sender === 'jaider';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 max-w-[88%] sm:max-w-[85%] ${
                    isJaider ? 'self-start' : 'self-end flex-row-reverse'
                  }`}
                >
                  {isJaider && (
                    <img
                      src="/imgs/tito-mascot.webp"
                      alt="Jaider"
                      className="w-6 h-6 sm:w-7 sm:h-7 object-contain bg-white/20 rounded-full p-0.5 border border-gold-500/20 shrink-0 self-end mb-1"
                      width="28"
                      height="28"
                    />
                  )}
                  <div className="flex flex-col">
                    <div
                      dir="auto"
                      className={`px-4 py-2.5 sm:px-4 sm:py-2.5 rounded-2xl text-sm sm:text-[13px] leading-relaxed shadow-sm font-medium ${
                        isJaider
                          ? 'bg-white dark:bg-obsidian-900 border border-black/[0.04] dark:border-white/5 text-[#1a2a4a] dark:text-gray-100 rounded-bl-sm'
                          : 'bg-[#1e3a8a] text-white rounded-br-sm border border-[#1e3a8a]/20'
                      }`}
                    >
                      {msg.text}
                    </div>
                    
                    {/* Similar Questions - Auto show when fallback message */}
                    {msg.similarQuestions && msg.similarQuestions.length > 0 && visibleSimilarQuestions.has(msg.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2"
                      >
                        <div className="flex flex-wrap gap-2">
                          {msg.similarQuestions.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                handleSimilarQuestionClick(q);
                                setVisibleSimilarQuestions(prev => {
                                  const next = new Set(prev);
                                  next.delete(msg.id);
                                  return next;
                                });
                              }}
                              className="px-3 py-2 rounded-full bg-gold-500/10 dark:bg-gold-500/5 border border-gold-500/30 dark:border-gold-500/20 text-sm font-medium text-gold-500 dark:text-gold-400 hover:bg-gold-500/20 hover:border-gold-500/50 transition-all hover:scale-[1.02] max-w-full truncate min-h-[40px] flex items-center"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                    
                    <span
                      className={`text-[11px] text-gray-400 mt-1.5 ${
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
                alt="Jaider"
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain bg-white/20 rounded-full p-0.5 border border-gold-500/20 shrink-0 self-end mb-1"
                width="28"
                height="28"
              />
              <div className="px-4 py-3 rounded-2xl bg-white dark:bg-obsidian-900 border border-black/[0.04] dark:border-white/5 rounded-bl-sm flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a] dark:bg-gold-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a] dark:bg-gold-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a] dark:bg-gold-500 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length === 1 && !isTyping && (
          <div className="px-4 sm:px-5 py-3 flex flex-wrap gap-2.5 justify-center border-t border-white/5 bg-[#f8f9ff]/10 dark:bg-obsidian-950/15 shrink-0">
            {suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-4 py-2.5 rounded-full bg-white/80 dark:bg-obsidian-900/80 border border-gray-200 dark:border-white/10 hover:border-gold-500 dark:hover:border-gold-500 text-left text-sm font-semibold text-[#1e3a8a] dark:text-gold-400 hover:bg-[#1e3a8a]/5 transition-all duration-200 hover:scale-[1.02] shadow-sm max-w-full truncate min-h-[44px] flex items-center"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-white/10 bg-[#f8f9ff]/20 dark:bg-obsidian-950/40 flex items-center gap-3 shrink-0 pb-safe">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            placeholder={getPlaceholder()}
            className="flex-1 px-4 py-3 rounded-full bg-white dark:bg-obsidian-900 border border-gray-200 dark:border-white/10 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-gold-500 dark:focus:border-gold-500 transition-colors min-h-[48px]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            style={{
              background: 'linear-gradient(135deg, #f5a623 0%, #d4921e 100%)'
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-obsidian-950 shadow-md transition-all active:scale-95 ${
              !input.trim() || isTyping
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 hover:shadow-[0_0_12px_rgba(245,166,35,0.4)]'
            }`}
          >
            <FaPaperPlane className={`text-base ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JaiderChatWindow;