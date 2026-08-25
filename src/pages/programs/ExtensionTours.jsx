import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaChevronRight } from 'react-icons/fa';
import { staggerContainer, fadeInUp } from '../../animations/variants';

export const EXTENSION_PACKAGES = [
  {
    id: 'extension-hurghada',
    titleKey: 'extensions.hurghadaTitle',
    titleDefault: 'Hurghada Red Sea Extension',
    duration: '4 Days / 3 Nights',
    destinations: 'Hurghada Resort',
    img: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1783030445/Gemini_Generated_Image_kenvzkkenvzkkenv_h9kz07.png',
    descKey: 'extensions.hurghadaDesc',
    descDefault: 'Extend your Egypt holiday with 3 nights in an all-inclusive luxury resort on the Hurghada coast. Snorkeling, diving & beach relaxation.',
    price: 490
  },
  {
    id: 'extension-sharm',
    titleKey: 'extensions.sharmTitle',
    titleDefault: 'Sharm El Sheikh VIP Resort Extension',
    duration: '4 Days / 3 Nights',
    destinations: 'Sharm El Sheikh',
    img: 'https://images.unsplash.com/photo-1544971587-b842c27f8c14?q=80&w=1200',
    descKey: 'extensions.sharmDesc',
    descDefault: 'Unwind at Ras Mohammed National Park coral reefs, luxury spa resort, and desert quad safari.',
    price: 550
  },
  {
    id: 'extension-siwa',
    titleKey: 'extensions.siwaTitle',
    titleDefault: 'Siwa Oasis & Western Desert Safari Extension',
    duration: '4 Days / 3 Nights',
    destinations: 'Siwa Oasis • Salt Lakes • Great Sand Sea',
    img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
    descKey: 'extensions.siwaDesc',
    descDefault: 'Discover Cleopatra Springs, Shali Fortress, pristine turquoise salt pools, and sand dunes camping.',
    price: 680
  }
];

export default function ExtensionTours() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-obsidian-50 pb-24">
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

      {/* Hero Header */}
      <section className="relative w-full h-[500px] md:h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783030445/Gemini_Generated_Image_kenvzkkenvzkkenv_h9kz07.png"
            alt="Egypt Extensions"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(15,13,11,0.35), rgba(15,13,11,0.75))',
            }}
          />
        </div>

        <motion.div
          className="relative z-10 text-center px-6 mt-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={fadeInUp}
            className="text-gold-400 uppercase tracking-[4px] text-sm block mb-4 font-semibold"
          >
            {t('extensions.subtitle', 'Egypt Extensions')}
          </motion.span>
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-6xl lg:text-7xl text-ivory-50 mb-6 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('extensions.heading', 'Extend Your Egypt Experience')}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-body-lg text-ivory-200 max-w-2xl mx-auto leading-relaxed"
          >
            {t(
              'extensions.heroDesc',
              'Enhance your holiday with extra nights on the Red Sea coast or an authentic safari adventure in the Western Desert.'
            )}
          </motion.p>
        </motion.div>
      </section>

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
            {t('extensions.subtitle', 'Egypt Extensions')}
          </span>
        </div>
      </div>

      {/* Packages Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h2
            className="text-3xl md:text-4xl text-obsidian-900 font-display mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('extensions.sectionTitle', 'Available Extension Packages')}
          </h2>
          <p className="text-body-md text-obsidian-500 max-w-xl mx-auto">
            {t(
              'extensions.sectionDesc',
              'Select an extension add-on to pair seamlessly with your Egypt itinerary.'
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
          {EXTENSION_PACKAGES.map((pkg) => (
            <motion.div
              key={pkg.id}
              variants={fadeInUp}
              className="bg-ivory-50 dark:bg-[#1a1a30] rounded-2xl overflow-hidden shadow-card group h-full flex flex-col transition-all border border-gold-500/10 hover:border-gold-500/40 hover:shadow-2xl"
            >
              <div className="relative h-64 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-gold-500 text-obsidian-900 text-xs uppercase px-3 py-1 rounded-full shadow-md font-bold">
                  {t('extensions.addOnAvailable', 'Add-on Available')}
                </div>
                <img
                  src={pkg.img}
                  alt={t(pkg.titleKey, pkg.titleDefault)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-2">
                  <span className="text-xs text-gold-500 uppercase tracking-widest font-semibold">
                    {pkg.duration}
                  </span>
                </div>
                <h3
                  className="text-xl text-obsidian-900 dark:text-white mb-2 font-display line-clamp-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t(pkg.titleKey, pkg.titleDefault)}
                </h3>
                <p className="text-xs text-gold-600 dark:text-gold-400 mb-3 font-medium">
                  {pkg.destinations}
                </p>
                <p className="text-body-sm text-obsidian-500 dark:text-gray-300 mb-6 leading-relaxed flex-grow">
                  {t(pkg.descKey, pkg.descDefault)}
                </p>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="text-[11px] text-obsidian-400 block uppercase">
                      {t('extensions.startingFrom', 'Starting From')}
                    </span>
                    <span className="text-xl font-bold text-gold-600">${pkg.price}</span>
                  </div>

                  <Link
                    to={`/programs/extension/${pkg.id}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-900 font-bold px-5 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md text-xs border border-gold-400"
                  >
                    {t('extensions.viewDetails', 'View Details')}
                    <FaChevronRight className="rtl-flip text-[10px]" />
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
