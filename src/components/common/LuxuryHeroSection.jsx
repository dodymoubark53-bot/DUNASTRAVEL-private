import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCompass, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function LuxuryHeroSection({
  badge = 'تجارب سياحية فاخرة',
  title = 'اكتشف روعة السفر الملكي',
  subtitle = '',
  description = '',
  highlights = [],
  primaryCta = { text: 'استكشف الباقات', link: '#tours' },
  secondaryCta = { text: 'صمّم رحلتك الخاصة', link: '/tailor-tour' },
  bgImage = '/imgs/egyothero.png',
  stats = []
}) {
  const isRtl = document.dir === 'rtl' || true;

  const handleCtaClick = (e, target) => {
    if (target?.onClick) {
      e.preventDefault();
      target.onClick();
    } else if (target?.link && target.link.startsWith('#')) {
      e.preventDefault();
      const el = document.getElementById(target.link.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative w-full min-h-[580px] md:min-h-[680px] flex items-center justify-center overflow-hidden bg-obsidian-950 text-ivory-50 select-none">
      {/* Background Image Container with Cinematic Zoom & Multi-layer Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-obsidian-950">
        <motion.img
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }}
          src={bgImage || 'https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_1920/v1783023886/3776ecde-249e-4183-9840-e9fd900ad96b_xvmumu.jpg'}
          onError={(e) => {
            e.currentTarget.src = 'https://res.cloudinary.com/degbrq3ck/image/upload/f_auto,q_auto,w_1920/v1783023886/3776ecde-249e-4183-9840-e9fd900ad96b_xvmumu.jpg';
          }}
          alt={title}
          className="w-full h-full object-cover object-center filter brightness-105 contrast-[1.05]"
          loading="eager"
        />

        {/* Gradient Layer: Lightened overlay for maximum image clarity and text legibility */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(6, 13, 26, 0.25) 0%,
              rgba(6, 13, 26, 0.45) 50%,
              rgba(6, 13, 26, 0.82) 100%
            )`
          }}
        />

        {/* Ambient Gold Radial Flare */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold-500/15 blur-[120px] rounded-full pointer-events-none z-10" />
      </div>

      {/* Main Content Area */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-20 container mx-auto px-4 sm:px-6 text-center max-w-5xl pt-24 pb-16"
      >
        {/* Eyebrow Glass Badge */}
        {badge && (
          <motion.div variants={itemVariants} className="inline-block mb-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-gold-500/15 border border-gold-500/40 backdrop-blur-xl shadow-lg shadow-gold-500/10">
              <FaCompass className="text-gold-400 text-sm" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-gold-300 uppercase">
                {badge}
              </span>
            </div>
          </motion.div>
        )}

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-ivory-50 leading-[1.25] tracking-tight mb-4 font-serif text-balance"
        >
          {title}
        </motion.h1>

        {/* Subtitle / English Tagline */}
        {subtitle && (
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-lg md:text-xl font-medium text-gold-400/90 tracking-widest uppercase mb-6 font-sans drop-shadow-sm"
          >
            {subtitle}
          </motion.p>
        )}

        {/* Detailed Description */}
        {description && (
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-ivory-200/90 max-w-3xl mx-auto leading-relaxed mb-8 font-light"
          >
            {description}
          </motion.p>
        )}

        {/* Highlight Tags / Quick Badges */}
        {highlights && highlights.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-2.5 sm:gap-3 mb-10 max-w-4xl mx-auto"
          >
            {highlights.map((tag, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md text-ivory-100 text-xs sm:text-sm font-medium border border-white/20 hover:border-gold-500/50 hover:bg-gold-500/10 transition-all duration-300 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </motion.div>
        )}

        {/* Call to Actions (CTAs) */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5"
        >
          {primaryCta && (
            primaryCta.link?.startsWith('#') || primaryCta.onClick ? (
              <a
                href={primaryCta.link || '#'}
                onClick={(e) => handleCtaClick(e, primaryCta)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 via-amber-500 to-gold-600 text-obsidian-950 font-bold text-base sm:text-lg shadow-xl shadow-gold-500/25 hover:scale-105 hover:shadow-gold-500/40 active:scale-95 transition-all duration-300 group cursor-pointer"
              >
                <span>{primaryCta.text}</span>
                {isRtl ? (
                  <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                )}
              </a>
            ) : (
              <Link
                to={primaryCta.link || '/tours'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 via-amber-500 to-gold-600 text-obsidian-950 font-bold text-base sm:text-lg shadow-xl shadow-gold-500/25 hover:scale-105 hover:shadow-gold-500/40 active:scale-95 transition-all duration-300 group cursor-pointer"
              >
                <span>{primaryCta.text}</span>
                {isRtl ? (
                  <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
                )}
              </Link>
            )
          )}

          {secondaryCta && (
            secondaryCta.link?.startsWith('#') || secondaryCta.onClick ? (
              <a
                href={secondaryCta.link || '#'}
                onClick={(e) => handleCtaClick(e, secondaryCta)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-ivory-50 font-semibold text-base sm:text-lg backdrop-blur-md border border-white/25 hover:border-gold-400/60 shadow-lg hover:shadow-white/10 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>{secondaryCta.text}</span>
              </a>
            ) : (
              <Link
                to={secondaryCta.link || '/tailor-tour'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-ivory-50 font-semibold text-base sm:text-lg backdrop-blur-md border border-white/25 hover:border-gold-400/60 shadow-lg hover:shadow-white/10 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span>{secondaryCta.text}</span>
              </Link>
            )
          )}
        </motion.div>

        {/* Optional Stats Bar */}
        {stats && stats.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mt-14 pt-8 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-gold-400 font-serif">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm text-ivory-300 mt-1 font-light">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
