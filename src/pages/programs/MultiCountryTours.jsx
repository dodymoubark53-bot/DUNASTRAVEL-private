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
import { useLandingPage } from '../../hooks/useLandingPage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

export default function MultiCountryTours() {
  const { t } = useTranslation();
  const { landingPage, loading, error, retry } = useLandingPage('multi-country');
  const tours = Array.isArray(landingPage?.tours) ? landingPage.tours : [];

  return (
    <div className="w-full min-h-screen bg-obsidian-50 dark:bg-[#0c0d19] pb-24 text-start">
      <Helmet>
        <title>{`${t('programs.multiCountryTitle', 'Multi-Country Tours')} | Dunas Travel`}</title>
        <meta
          name="description"
          content={t(
            'programs.multiCountryDesc',
            'Explore combined grand itineraries across Egypt, Jordan, Turkey, Dubai, Morocco and beyond.'
          )}
        />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('programs.multiCountryBadge', '🌐 تجارب سياحية عابرة للحدود')}
        title={t('programs.multiCountryTitle', 'الرحلات المجمعة.. اكتشاف عدة حضارات في رحلة واحدة')}
        subtitle={t('programs.multiCountrySubtitle', 'Multi-Country Odysseys: Egypt, Jordan, Turkey & Dubai')}
        description={t(
          'programs.multiCountryHeroDesc',
          'اجمع بين سحر الأهرامات في مصر وورديات البتراء بالأردن، أو ابحر بين بسفور تركيا وأبراج دبي الفاخرة، مع طيران وتنقلات مدمجة أعلى مستويات الترف والراحة.'
        )}
        highlights={[
          t('programs.multiTag1', '✈️ طيران وتنقلات VIP مدمجة بالكامل'),
          t('programs.multiTag2', '🗺️ باقات (مصر + الأردن / تركيا + دبي)'),
          t('programs.multiTag3', '📜 إدارة شاملة للتأشيرات والخدمات')
        ]}
        primaryCta={{
          text: t('programs.multiPrimaryCta', 'استكشف الرحلات المجمعة ←'),
          link: '#multi-tours-list'
        }}
        secondaryCta={{
          text: t('programs.multiSecondaryCta', 'طلب برنامج مخصص للجموع'),
          link: '/tailor-tour'
        }}
        bgImage="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Breadcrumb Header */}
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
          <span className="text-gold-500 font-medium">{t('nav.multiCountry', 'Multi-Country Tours')}</span>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="container mx-auto px-6 pt-16 pb-20" id="multi-tours-list">
        <div className="text-center mb-14">
          <span className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-3">
            {t('nav.multiCountry', 'Multi-Country')}
          </span>
          <h2
            className="text-display-lg text-obsidian-900 dark:text-ivory-50 font-display mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('programs.multiCountryHeading', 'باقات الرحلات المجمعة المتاحة')}
          </h2>
          <p className="text-body-lg text-obsidian-600 dark:text-ivory-300 max-w-2xl mx-auto">
            {t(
              'programs.multiCountrySubheading',
              'اختر وجهتك المفضلة التي تجمع أكثر من بلد ببرنامج سياحي واحد مريح وشامل.'
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
              title={t('common.errorOccurred', 'Unable to load multi-country tours')}
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
                  destination: tour.country || 'Multi-Country',
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
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-obsidian-900/85" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-3">
            CUSTOM MULTI-DESTINATION
          </span>
          <h2
            className="text-display-xl text-ivory-50 mb-6 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('programs.customMultiTitle', 'صمّم باقة تجمع أي دولتين أو أكثر بحرية')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t(
              'programs.customMultiDesc',
              'يمكننا دمج أي وجهات تختارها عبر الشرق الأوسط وأوروبا وشمال أفريقيا بخطوط طيران وتنقلات منسقة بالكامل.'
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
