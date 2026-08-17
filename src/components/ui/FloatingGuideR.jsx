import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useJaiderChat } from '../../context/JaiderChatContext';

const TOOLTIP_TEXT = {
  ar: 'اسأل جايدر • المستشار السياحي الذكي',
  'ar-eg': 'اسأل جايدر • مستشارك السياحي الذكي',
  en: 'Ask GuideR • AI Travel Concierge',
  es: 'Pregunta a GuideR • Conserje IA',
  pt: 'Pergunte ao GuideR • Concierge IA',
  it: 'Chiedi a GuideR • Concierge IA',
};

const FloatingGuideR = () => {
  const { i18n } = useTranslation();
  const { isOpen, setIsOpen } = useJaiderChat();
  const [isHovered, setIsHovered] = useState(false);

  const isRtl = i18n.dir() === 'rtl';
  const langKey = i18n.language ? (i18n.language === 'ar-eg' ? 'ar-eg' : i18n.language.split('-')[0]) : 'en';
  const tooltip = TOOLTIP_TEXT[langKey] || TOOLTIP_TEXT.en;

  // Don't render the launcher when the chat modal is already open
  if (isOpen) return null;

  return (
    <div
      className={`fixed bottom-5 z-[9998] flex items-center ${
        isRtl ? 'left-5 flex-row-reverse' : 'right-5 flex-row'
      }`}
    >
      {/* Speech Bubble / Tooltip on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: isRtl ? -15 : 15 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: isRtl ? -15 : 15 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-none hidden sm:flex items-center px-4 py-2 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-gold-500/40 shadow-[0_8px_25px_rgba(0,0,0,0.4)] text-ivory-50 text-xs font-semibold whitespace-nowrap ${
              isRtl ? 'ml-3' : 'mr-3'
            }`}
          >
            <span className="text-gold-400 mr-1 font-bold">✦</span>
            <span>{tooltip}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot Button (Transparent Background) */}
      <motion.button
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        aria-label={tooltip}
        title={tooltip}
        className="relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-full select-none"
      >
        {/* Ambient Golden Glow Aura */}
        <div className="absolute inset-0 rounded-full bg-gold-500/20 blur-xl group-hover:bg-gold-500/35 transition-all duration-500 scale-125" />

        {/* Mascot Avatar Image with Floating Physics */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center animate-[float_3s_ease-in-out_infinite]">
          <img
            src="/imgs/tito-mascot.webp"
            alt="GuideR Luxury Travel Concierge"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_18px_rgba(245,166,35,0.45)] group-hover:drop-shadow-[0_12px_24px_rgba(245,166,35,0.65)] transition-all duration-300"
            loading="eager"
            decoding="async"
            width="80"
            height="80"
          />

          {/* Online Live Status Pulse */}
          <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-950 shadow-sm"></span>
          </span>
        </div>
      </motion.button>
    </div>
  );
};

export default FloatingGuideR;
