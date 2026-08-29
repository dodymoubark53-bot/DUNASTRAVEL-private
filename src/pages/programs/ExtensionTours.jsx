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

export default function ExtensionTours() {
  const { t } = useTranslation();
  // Fetch all Egypt destination tours then filter to extensions (Hurghada, Sharm, Siwa)
  const { tours, loading, error, retry } = useTours({ destination: 'egypt', limit: 20 });
  const extensionSlugs = ['hurghada-4d3n', 'sharm-4d3n', 'siwa-oasis-alexandria'];
  const extensionTours = tours.filter((tour) => extensionSlugs.includes(tour.slug));

  return (
    <div className="w-full min-h-screen bg-obsidian-50 dark:bg-[#0c0d19] pb-24 text-start">
      <Helmet>
        <title>{t('extensions.title', 'Egypt Extensions | Dunas Travel')}</title>
        <meta
          name="description"
          content={t(
            'extensions.desc',
            'Extend your Egypt holiday with added beach resorts in Hurghada, Sharm El Sheikh, or desert adventures in Siwa Oasis.'
          )}
        />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('extensions.badge', '🏖️ إضافات وامتدادات إقامة فاخرة')}
        title={t('extensions.heading', 'امتدادات الرحلات.. طوّل متعة الاسترخاء والاستكشاف')}
        subtitle={t('extensions.subtitle', 'Egypt Extensions: Beach Resorts & Oasis Escapes')}
        description={t(
          'extensions.heroDesc',
          'مدّد رحلتك السياحية بأيام إضافية من الاستجمام الشاطئي على منتجعات الغردقة وشرم الشيخ 5 نجوم، أو مغامرات واحة سيوة وسيناء التاريخية مع طيران وتنقلات سريعة.'
        )}
        highlights={[
          t('extensions.tag1', '🏖️ منتجعات الغردقة وشرم الشيخ الشاملة All-Inclusive'),
          t('extensions.tag2', '🌴 رحلات واحة سيوة والإسكندرية الاستكشافية'),
          t('extensions.tag3', '✈️ طيران داخلي مريح من وإلى القاهرة')
        ]}
        primaryCta={{
          text: t('extensions.ctaPrimary', 'تصفّح باقات التمديد ←'),
          link: '#extensions-list'
        }}
        secondaryCta={{
          text: t('extensions.ctaSecondary', 'إضافة أيام لرحلتك الحالية'),
          link: '/tailor-tour'
        }}
        bgImage="https://res.cloudinary.com/degbrq3ck/image/upload/v1783030445/Gemini_Generated_Image_kenvzkkenvzkkenv_h9kz07.png"
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
            {t('dest.egypt.extensionTitle', 'Egypt Extensions')}
          </span>
        </div>
      </div>

      {/* Extension Packages List */}
      <section className="container mx-auto px-6 py-16" id="extensions-list">
        <div className="text-center mb-14">
          <span className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-3">
            EXTENSIONS & SHORT STAYS
          </span>
          <h2
            className="text-3xl md:text-4xl text-obsidian-900 dark:text-ivory-50 font-display mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('extensions.sectionTitle', 'Egypt Extension Trips')}
          </h2>
          <p className="text-body-md text-obsidian-600 dark:text-ivory-300 max-w-xl mx-auto">
            {t(
              'extensions.sectionDesc',
              'Extend your holiday by adding a Red Sea beach escape or a desert adventure to your Egypt itinerary.'
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
              title={t('common.errorOccurred', 'Unable to load extension packages')}
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
            {(extensionTours.length > 0 ? extensionTours : tours).map((tour) => (
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
          style={{ backgroundImage: 'url(https://res.cloudinary.com/degbrq3ck/image/upload/v1783030445/Gemini_Generated_Image_kenvzkkenvzkkenv_h9kz07.png)' }}
        />
        <div className="absolute inset-0 bg-obsidian-900/85" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-3">
            CUSTOM EXTENSIONS
          </span>
          <h2
            className="text-display-xl text-ivory-50 mb-6 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('extensions.customTitle', 'هل ترغب في تمديد رحلتك لوجهة أخرى؟')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t(
              'extensions.customDesc',
              'يمكننا إضافة ليالٍ في الإسكندرية، أسوان، طابا، أو مرسى علم بكل سهولة وتنسيق تنقلاتك وطيرانك الداخلي.'
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
