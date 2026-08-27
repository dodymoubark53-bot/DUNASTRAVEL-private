import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaChevronRight } from 'react-icons/fa';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';

export const HONEYMOON_PACKAGES = [
  {
    id: 'honeymoon-egypt',
    titleKey: 'honeymooners.egyptTitle',
    titleDefault: 'Honeymoon in Egypt',
    duration: '10 Days / 9 Nights',
    destinations: 'Cairo • Nile Cruise • Hurghada',
    img: 'https://hl-tourism.com/media/typecms/Honeymoon_Planning_Guide_2025_Complete_Resource.webp',
    taglineKey: 'honeymooners.egyptTagline',
    taglineDefault: 'A perfect trip to celebrate love, combining history, culture, romance, and unforgettable moments on the Red Sea.',
  }
];

export default function Honeymooners() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('honeymooners.title', 'Honeymooners Package | Dunas Travel')}</title>
        <meta
          name="description"
          content={t('honeymooners.desc', 'Celebrate your love with an unforgettable honeymoon in Egypt. Romance, history, and luxury await you.')}
        />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('honeymooners.badge', '💖 لحظات للعمر وتجارب مصممة لشخصين')}
        title={t('honeymooners.heading', 'شهر العسل.. بداية حكاية حب في أجمل وجهات العالم')}
        subtitle={t('honeymooners.subtitle', 'Honeymoon: Begin Your Story in Unrivaled Paradise')}
        description={t(
          'honeymooners.heroDesc',
          'اصنعا ذكريات لا تُنسى في أكثر الأماكن رومانسية؛ من الأكواخ المائية الفاخرة وعشاء الشموع على النيل، إلى ليالي النجوم في صحراء وادي رم وجولات البسفور الخاصة.'
        )}
        highlights={[
          t('honeymooners.tag1', '🍾 استقبال بالورد وعشاء رومانسي خاص'),
          t('honeymooners.tag2', '📸 جلسات تصوير احترافية للزوجين'),
          t('honeymooners.tag3', '🏨 ترقية مجانية للغرف والأجنحة (حسب الإمكانية)')
        ]}
        primaryCta={{
          text: t('honeymooners.ctaPrimary', 'استكشف باقات شهر العسل ←'),
          link: '#packages-list'
        }}
        secondaryCta={{
          text: t('honeymooners.ctaSecondary', 'صمّم رحلة أحلامكما'),
          link: '/tailor-tour'
        }}
        bgImage="https://hl-tourism.com/media/typecms/Honeymoon_Planning_Guide_2025_Complete_Resource.webp"
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-obsidian-950 border-y border-gold-500/10 py-4 px-6 text-caption text-ivory-300">
        <div className="container mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-gold-500 transition-colors">
            {t('nav.home', 'Home')}
          </Link>
          <span className="rtl-flip text-[10px] text-gold-500/50">
            <FaChevronRight />
          </span>
          <Link to="/destinations/egypt" className="hover:text-gold-500 transition-colors">
            {t('dest.egypt.title', 'Egypt')}
          </Link>
          <span className="rtl-flip text-[10px] text-gold-500/50">
            <FaChevronRight />
          </span>
          <span className="text-gold-500 font-medium">
            {t('honeymooners.title', 'Honeymooners Package')}
          </span>
        </div>
      </div>

      {/* Package Cards List */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl text-obsidian-900 font-display mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('honeymooners.sectionTitle', 'Our Honeymoon Packages')}
          </h2>
          <p className="text-body-md text-obsidian-500 max-w-xl mx-auto">
            {t(
              'honeymooners.sectionDesc',
              'Hand-picked romantic escapes designed for couples seeking magic, intimacy, and adventure.'
            )}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {HONEYMOON_PACKAGES.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={fadeInUp}
              className="bg-ivory-50 dark:bg-[#1a1a30] rounded-2xl overflow-hidden shadow-card group h-full flex flex-col transition-all md:col-span-2 lg:col-span-3 max-w-2xl mx-auto"
            >
              <div className="relative h-72 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-gold-500 text-obsidian-900 text-sm uppercase px-4 py-1.5 rounded-full shadow-md font-bold">
                  {t('honeymooners.featured', 'Featured')}
                </div>
                <img
                  src={pkg.img}
                  alt={t(pkg.titleKey, pkg.titleDefault)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="mb-3">
                  <span className="text-sm text-gold-500 uppercase tracking-widest font-semibold">
                    {pkg.duration}
                  </span>
                </div>
                <h3
                  className="text-2xl text-obsidian-900 dark:text-white mb-2 font-display"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t(pkg.titleKey, pkg.titleDefault)}
                </h3>
                <p className="text-sm text-obsidian-400 dark:text-gray-300 mb-3 font-medium">
                  {pkg.destinations}
                </p>
                <p className="text-body-sm text-obsidian-500 dark:text-gray-300 mb-6 leading-relaxed">
                  {t(pkg.taglineKey, pkg.taglineDefault)}
                </p>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <Link
                    to={`/programs/honeymooners/${pkg.id}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-900 gold-btn-text font-bold px-6 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md border-2 border-gold-400"
                  >
                    {t('honeymooners.viewDetails', 'View Details')}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
