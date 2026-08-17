import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaWhatsapp, FaInstagram, FaPhone, FaEnvelope, FaTimes, FaHeadset } from 'react-icons/fa';
import { useJaiderChat } from '../../context/JaiderChatContext';

const FloatingContact = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: isJaiderOpen } = useJaiderChat();

  const isRtl = i18n.dir() === 'rtl';

  const options = [
    { icon: FaWhatsapp, href: 'https://wa.me/201000000000', label: 'WhatsApp', bg: 'bg-[#25D366] text-white hover:bg-[#1ebd5a]' },
    { icon: FaInstagram, href: 'https://www.instagram.com/dunas_travel?igsh=bWkyb2FhY2hoNnNo', label: 'Instagram', bg: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-90' },
    { icon: FaPhone, href: 'tel:+20233746643', label: 'Call us', bg: 'bg-[#1E3A8A] text-white hover:bg-[#172554]' },
    { icon: FaEnvelope, href: 'mailto:info@dunas-travel.com', label: 'Email', bg: 'bg-slate-900 border border-gold-500/50 text-gold-400 hover:bg-gold-500 hover:text-slate-950' },
  ];

  const itemVariants = {
    closed: { opacity: 0, x: 0, y: 0, scale: 0 },
    open: (index) => {
      const angle = isRtl ? (180 - (index * 30)) : (index * 30);
      const radius = 68;
      const x = isRtl ? Math.sin((index + 1) * 0.4) * radius : -Math.sin((index + 1) * 0.4) * radius;
      const y = -(index + 1) * 52;
      return {
        opacity: 1,
        x: x,
        y: y,
        scale: 1,
        transition: {
          type: 'spring',
          stiffness: 300,
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
      className={`floating-contact fixed bottom-[88px] sm:bottom-[98px] z-[9997] flex items-center justify-center ${
        isRtl ? 'left-6' : 'right-6'
      }`}
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
              title={item.label}
              aria-label={item.label}
              className={`absolute w-11 h-11 rounded-full flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-all duration-300 ${item.bg}`}
            >
              <Icon size={18} />
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
        className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-gold-300 bg-slate-950/90 backdrop-blur-md border border-gold-500/50 shadow-[0_4px_20px_rgba(0,0,0,0.45)] hover:border-gold-400 hover:text-gold-200 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 transition-all duration-300"
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
