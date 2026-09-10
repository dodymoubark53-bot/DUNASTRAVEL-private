import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaPhone, FaEnvelope, FaTimes, FaHeadset } from 'react-icons/fa';
import { useJaiderChat } from '../../context/JaiderChatContext';

const FloatingContact = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: isJaiderOpen } = useJaiderChat();

  const options = [
    { icon: FaWhatsapp, href: 'https://wa.me/201149401111', label: t('contact.whatsapp', 'WhatsApp'), bg: 'bg-[#25D366] text-white hover:bg-[#1ebd5a]' },
    { icon: FaFacebookF, href: 'https://www.facebook.com/DunasTravelOficial?rdid=QDCCsuShSrLFmX8x&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1EsALYq8cg%2F#', label: t('contact.facebook', 'Facebook'), bg: 'bg-[#1877F2] text-white hover:bg-[#0f64d1]' },
    { icon: FaInstagram, href: 'https://www.instagram.com/dunas_travel?igsh=bWkyb2FhY2hoNnNo', label: t('contact.instagram', 'Instagram'), bg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-90' },
    { icon: FaPhone, href: 'tel:+20233746643', label: t('contact.call', 'Call us'), bg: 'bg-[#1E3A8A] text-white hover:bg-[#172554]' },
    { icon: FaEnvelope, href: 'mailto:info@dunas-travel.com', label: t('contact.email', 'Email'), bg: 'bg-[#EA4335] text-white hover:bg-[#d3382c]' },
  ];

  const itemVariants = {
    closed: { opacity: 0, x: 0, y: 0, scale: 0 },
    open: (index) => {
      const radius = 72;
      const angleDeg = 90 + index * 24; // 90° (top) to 186° (left)
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = Math.cos(angleRad) * radius;
      const y = -Math.sin(angleRad) * radius;
      return {
        opacity: 1,
        x: Math.round(x),
        y: Math.round(y),
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 380,
          damping: 22,
          delay: index * 0.04
        }
      };
    }
  };

  if (isJaiderOpen) return null;

  return (
    <div
      id="floating-contact-container"
      className="floating-contact fixed bottom-[88px] sm:bottom-[98px] right-6 z-[9997] flex items-center justify-center"
    >
      <AnimatePresence>
        {isOpen && options.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              custom={idx}
              variants={itemVariants}
              initial="closed"
              animate="open"
              exit="closed"
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.92 }}
              title={item.label}
              aria-label={item.label}
              className={`absolute w-10 h-10 rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-all duration-200 group ${item.bg}`}
            >
              <Icon size={18} />
              <span className="absolute hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-md bg-slate-950/90 text-ivory-100 border border-gold-500/30 whitespace-nowrap -top-7 shadow-md">
                {item.label}
              </span>
            </motion.a>
          );
        })}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close contact options" : "Open contact options"}
        aria-expanded={isOpen}
        aria-haspopup="true"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-gold-300 bg-slate-950/90 backdrop-blur-md border border-gold-500/50 shadow-[0_4px_20px_rgba(0,0,0,0.45)] hover:border-gold-400 hover:text-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 transition-all duration-300 cursor-pointer"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          {isOpen ? <FaTimes size={18} /> : <FaHeadset size={20} />}
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FloatingContact;

