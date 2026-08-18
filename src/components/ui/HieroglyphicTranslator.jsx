import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaCrown, FaMagic, FaCopy, FaCheck } from 'react-icons/fa';
import api from '../../utils/api';

// Hieroglyphic phonetic alphabet mapping
const GLYPH_MAP = {
  a: '𓄿', b: '𓃀', c: '𓎡', d: '𓂧', e: '𓇋', f: '𓆑', g: '𓎼', h: '𓉔',
  i: '𓇋', j: '𓆓', k: '𓎡', l: '𓃭', m: '𓅓', n: '𓈖', o: '𓍯', p: '𓊪',
  q: '𓈎', r: '𓂋', s: '𓋴', t: '𓏏', u: '𓍯', v: '𓆑', w: '𓅱', x: '𓎡𓋴',
  y: '𓇌', z: '𓊃', ' ': ' '
};

export default function HieroglyphicTranslator() {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const getLocalGlyphs = (inputName) => {
    return inputName
      .toLowerCase()
      .split('')
      .map((char) => GLYPH_MAP[char] || char)
      .join(' ');
  };

  const handleTranslate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setCopied(false);

    try {
      const res = await api.post('/tools/hieroglyphics', { name: name.trim() });
      const glyphs = res?.glyphs || res?.translation || getLocalGlyphs(name.trim());
      setResult({ name: name.trim(), glyphs });
    } catch {
      // Graceful local fallback mapping
      setResult({ name: name.trim(), glyphs: getLocalGlyphs(name.trim()) });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.glyphs) return;
    navigator.clipboard.writeText(result.glyphs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-8 rounded-3xl bg-gradient-to-b from-[#0F1535] to-[#070B1E] border border-gold-500/30 shadow-2xl relative overflow-hidden text-center">
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs tracking-widest uppercase mb-4">
        <FaCrown size={12} />
        <span>{t('hieroglyphics.badge', 'Ancient Royal Scribe Tool')}</span>
      </div>

      <h3 className="text-2xl sm:text-3xl font-serif text-ivory-50 mb-2">
        {t('hieroglyphics.title', 'Write Your Name in Royal Hieroglyphics')}
      </h3>
      <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto mb-6 font-light">
        {t('hieroglyphics.subtitle', 'Translate your name into ancient Egyptian pharaonic script engraved in a royal cartouche.')}
      </p>

      {/* Form */}
      <form onSubmit={handleTranslate} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('hieroglyphics.placeholder', 'Enter your name (e.g. Ramses, Sarah)...')}
          maxLength={30}
          className="flex-1 px-4 py-3 bg-[#0A0E27] border border-gold-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-gold-400 transition-colors text-sm"
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="px-6 py-3 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-obsidian-900 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50 shadow-lg shadow-gold-500/20 cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-obsidian-900 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <FaMagic size={14} />
              <span>{t('hieroglyphics.translateBtn', 'Engrave')}</span>
            </>
          )}
        </button>
      </form>

      {/* Result Royal Cartouche */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative mx-auto max-w-md p-6 rounded-2xl bg-gradient-to-b from-[#141A3D] to-[#0A0F2B] border-2 border-gold-500/40 shadow-inner"
          >
            {/* Pharaonic Cartouche Outline Style */}
            <div className="text-xs uppercase tracking-widest text-gold-400/80 mb-2 font-serif">
              👑 Royal Cartouche of {result.name}
            </div>

            <div className="py-4 px-6 my-2 bg-[#05081A]/80 border border-gold-500/30 rounded-xl flex items-center justify-center min-h-[70px]">
              <span className="text-3xl sm:text-4xl text-gold-400 tracking-wider select-all font-serif">
                {result.glyphs}
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-gold-500/30 rounded-lg text-xs text-gold-400 transition-colors"
              >
                {copied ? <FaCheck className="text-green-400" /> : <FaCopy />}
                <span>{copied ? t('hieroglyphics.copied', 'Copied!') : t('hieroglyphics.copy', 'Copy Glyphs')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
