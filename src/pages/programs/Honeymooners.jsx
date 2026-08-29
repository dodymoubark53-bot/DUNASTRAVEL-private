import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tour/TourCard';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';
import ErrorState from '../../components/ui/ErrorState';
import { useTours } from '../../hooks/useTours';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

export default function Honeymooners() {
  const { t } = useTranslation();
  const { tours, loading, error, retry } = useTours({ category: 'Honeymoon' });

  return (
    <div className="w-full min-h-screen bg-obsidian-50 dark:bg-[#0c0d19] pb-24 text-start">
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
      <section className="container mx-auto px-6 py-16" id="packages-list">
        <div className="text-center mb-14">
          <span className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-3">
            {t('nav.honeymooners', 'Honeymooners')}
          </span>
          <h2
            className="text-3xl md:text-4xl text-obsidian-900 dark:text-ivory-50 font-display mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('honeymooners.sectionTitle', 'Our Honeymoon Packages')}
          </h2>
          <p className="text-body-md text-obsidian-600 dark:text-ivory-300 max-w-xl mx-auto">
            {t(
              'honeymooners.sectionDesc',
              'Hand-picked romantic escapes designed for couples seeking magic, intimacy, and adventure.'
            )}
          </p>
        </div>

        {loading ? (
          <div className="grid min-h-[40vh] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-96 animate-pulse rounded-2xl bg-obsidian-200/70 dark:bg-obsidian-800/50" />
            ))}
          </div>
        ) : error ? (
          <div className="max-w-xl mx-auto text-center">
            <ErrorState
              title={t('common.errorOccurred', 'Unable to load honeymoon packages')}
              message={error.message || t('destinations.retryDescription', 'Please try again in a moment.')}
              actionLabel={t('common.tryAgain', 'Try again')}
              onRetry={retry}
            />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {tours.map((tour) => (
              <TourCard
                key={tour.id || tour.slug}
                tour={{
                  ...tour,
                  price: Number(tour.basePriceUsd || 0),
                  images: Array.isArray(tour.images) ? tour.images : (tour.heroImage ? [tour.heroImage] : []),
                  destination: tour.country || 'Egypt',
                }}
              />
            ))}
          </motion.div>
        )}
      </section>

      {/* Tailor Tour CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://hl-tourism.com/media/typecms/Honeymoon_Planning_Guide_2025_Complete_Resource.webp)' }}
        />
        <div className="absolute inset-0 bg-obsidian-900/85" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-3">
            BESPOKE ROMANCE
          </span>
          <h2
            className="text-display-xl text-ivory-50 mb-6 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('honeymooners.customTitle', 'صمّما شهر العسل الذي تحلمان به')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t(
              'honeymooners.customDesc',
              'أخبرانا عن الوجهات المفضلة لديكما وسيقوم خبراؤنا بتصميم باقة متكاملة تشمل كافة التفاصيل الرومانسية الفاخرة.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tailor-a-tour">
              <Button variant="gold-glow" className="w-full sm:w-auto px-10 py-4">
                {t('home.tailorTour', 'Tailor Your Tour')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="glass" className="w-full sm:w-auto px-10 py-4">
                {t('nav.contact', 'Contact Us')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
