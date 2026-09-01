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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function ReligiousTours() {
  const { t } = useTranslation();
  const { landingPage, loading, error, retry } = useLandingPage('religious');
  const { tours: allTours } = useTours({ limit: 50 });

  const fallbackReligious = (allTours || []).filter((tour) =>
    ['egito-historico-10d', 'mct-004', 'mct-009', 'egito-classico-ii-9d'].includes(tour.slug)
  );

  const tours = Array.isArray(landingPage?.tours) && landingPage.tours.length > 0
    ? landingPage.tours
    : fallbackReligious;

  return (
    <div className="w-full min-h-screen bg-obsidian-50 dark:bg-[#0c0d19] pb-24 text-start">
      <Helmet>
        <title>{`${t('nav.religious', 'Religious Programs')} | ${t('site.luxuryTravel', 'Dunas Travel')}`}</title>
        <meta
          name="description"
          content={t(
            'programs.religiousMetaDesc',
            'Embark on a sacred journey through ancient Coptic monasteries in Egypt and the holy sites of Jordan. Deeply spiritual, meticulously organized pilgrimages with expert guides.'
          )}
        />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('programs.religiousBadge', '🌐 رحلات الإيمان والتراكم الحضاري الروحي')}
        title={t('programs.religiousHeadline', 'الرحلات الدينية والروحانية.. رحلة الروح والسكينة')}
        subtitle={t('programs.religiousSubtitle', 'الرحلات المقدسة والحج')}
        description={t(
          'programs.religiousLead',
          'قم بالسير على خطى العائلة المقدسة عبر الأديرة القبطية القديمة في مصر واكتشف العجائب المقدسة في الأرض المقدسة. رحلات موجهة بخبرة وإثراء روحي تم تصميمها بعناية مطلقة.'
        )}
        highlights={[
          t('programs.religiousTag1', '🕊️ جولات الأديرة والمواقع القبطية بمصر'),
          t('programs.religiousTag2', '📜 إرشاد تاريخي وروحي متمرس'),
          t('programs.religiousTag3', '✈️ إقامات 5 نجوم وتنقلات مريحة مجهزة بالكامل')
        ]}
        primaryCta={{
          text: t('programs.religiousPrimaryCta', 'تصفّح البرامج الدينية ←'),
          link: '#religious-list'
        }}
        secondaryCta={{
          text: t('programs.religiousSecondaryCta', 'طلب برنامج ديني خاص'),
          link: '/tailor-tour'
        }}
        bgImage="/images/holy-land.webp"
      />

      {/* Breadcrumb Bar */}
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
          <span className="text-gold-500 font-medium">{t('nav.religious', 'Religious Programs')}</span>
        </div>
      </div>

      {/* Value Proposition Cards */}
      <section className="container mx-auto px-6 py-12">
        <div className="bg-white dark:bg-[#151728] rounded-2xl border border-obsidian-200 dark:border-obsidian-800 shadow-card p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: '✝️',
                title: t('programs.relVal1Title', 'Coptic Heritage'),
                desc: t(
                  'programs.relVal1Desc',
                  "Trace ancient routes of the Holy Family through Egypt's sacred monasteries"
                )
              },
              {
                icon: '🕊️',
                title: t('programs.relVal2Title', 'Spiritual Immersion'),
                desc: t(
                  'programs.relVal2Desc',
                  'Deeply meaningful visits with expert theologian guides who bring history to life'
                )
              },
              {
                icon: '🙏',
                title: t('programs.relVal3Title', 'Complete Care'),
                desc: t(
                  'programs.relVal3Desc',
                  'All logistics handled — visas, hotels, transfers and full pilgrimage support included'
                )
              }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <span className="text-4xl">{item.icon}</span>
                <h3 className="text-display-sm text-obsidian-900 dark:text-ivory-50 font-semibold font-display">
                  {item.title}
                </h3>
                <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Religious Programs Grid */}
      <section className="container mx-auto px-6 pb-20" id="religious-list">
        <div className="text-center mb-12">
          <span className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-3">
            {t('nav.religious', 'Religious Programs')}
          </span>
          <h2
            className="text-display-lg text-obsidian-900 dark:text-ivory-50 font-display mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('programs.religiousHeading', 'باقات الرحلات الدينية المتاحة')}
          </h2>
          <p className="text-body-lg text-obsidian-600 dark:text-ivory-300 max-w-2xl mx-auto">
            {t(
              'programs.religiousSubheading',
              'برامج حج وزيارة معدة بأعلى درجات العناية الروحية والخدمية للمجموعات والأفراد.'
            )}
          </p>
        </div>

        {loading ? (
          <div className="grid min-h-[40vh] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1].map((item) => (
              <div key={item} className="h-96 animate-pulse rounded-2xl bg-obsidian-200/70 dark:bg-obsidian-800/50" />
            ))}
          </div>
        ) : error ? (
          <div className="max-w-xl mx-auto text-center">
            <ErrorState
              title={t('common.errorOccurred', 'Unable to load religious tours')}
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
      <section className="relative py-20 mt-12 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/images/holy-land.webp)' }}
        />
        <div className="absolute inset-0 bg-obsidian-900/85" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-3">
            {t('programs.customReligiousLabel', 'PILGRIMAGE & SPIRITUAL TAILOR-MADE')}
          </span>
          <h2
            className="text-display-xl text-ivory-50 mb-6 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('programs.customReligiousTitle', 'صمّم برنامجك الديني الخاص لمجموعتك أو كنيستك')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t(
              'programs.customReligiousDesc',
              'فريقنا المتخصص في الرحلات الدينية يوفر ترتيبات استثنائية تشمل تصاريح الزيارة، القداسات، وأماكن الإقامة القريبة من المعالم المقدسة.'
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
