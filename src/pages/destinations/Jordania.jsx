import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaHotel, FaCheck, FaTimes } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import { useJordanPrograms } from '../../hooks/useJordanPrograms';

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

import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';

const HERO_IMAGE = 'https://cdn.al-ain.com/lg/images/2022/11/24/62-021616-best-tourist-areas-jordan-4.jpeg';

export default function Jordania() {
  const { t } = useTranslation();
  const programs = useJordanPrograms();

  const hotelCities = ['amman', 'petra', 'wadiRum', 'aqaba', 'deadSea'];

  const includedItems = t('dest.jordan.includesList', { returnObjects: true });
  const excludedItems = t('dest.jordan.excludesList', { returnObjects: true });

  const safeIncludes = Array.isArray(includedItems) ? includedItems : [];
  const safeExcludes = Array.isArray(excludedItems) ? excludedItems : [];

  return (
    <div className="w-full min-h-screen bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('dest.jordan.seoTitle', 'Luxury Jordan Tours & Vacations | Dunas Travel')}</title>
        <meta
          name="description"
          content={t('dest.jordan.seoDesc', 'Explore luxury journeys in Jordan. Custom itineraries coming soon.')}
        />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('dest.jordan.badge', '🏜️ عجيبة العالم الوردية ووديان النجوم')}
        title={t('dest.jordan.headline', 'الأردن.. سحر البتراء وأسرار وادي رم الأسطورية')}
        subtitle={t('dest.jordan.subtitle', 'Jordan: Petra’s Rose Beauty & Cosmic Desert Nights')}
        description={t(
          'dest.jordan.desc',
          'من منحوتات السيق الوردية في البتراء إلى هدوء البحر الميت الذي لا يُقاوم، وصولاً إلى التخييم الفاخر تحت قبة نجوم وادي رم. تجربة استكشافية تجمع بين المغامرة والراحة الاستثنائية.'
        )}
        highlights={[
          t('dest.jordan.tag1', '🏛️ زيارة البتراء ودخول خاص'),
          t('dest.jordan.tag2', '🌌 مخيمات البابليك الفاخرة بوادي رم'),
          t('dest.jordan.tag3', '🌊 منتجعات علاجية على البحر الميت')
        ]}
        primaryCta={{
          text: t('dest.jordan.ctaPrimary', 'استكشف سحر الأردن ←'),
          link: '#jordan-tours'
        }}
        secondaryCta={{
          text: t('dest.jordan.ctaSecondary', 'تواصل مع مستشار السفر'),
          link: '/tailor-tour'
        }}
        bgImage={HERO_IMAGE}
      />

      {/* Introduction & Programs Grid */}
      <section className="container mx-auto px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-body-lg text-obsidian-500 leading-relaxed">
            {t(
              'dest.jordan.brief',
              'Jordan is a treasure trove of ancient history and natural beauty. Our programs take you from the bustling streets of Amman to the silent deserts of Wadi Rum, the magnificent ruins of Petra, and the rejuvenating shores of the Dead Sea and Red Sea.'
            )}
          </p>
        </div>

        <div className="text-center mb-12">
          <h2
            className="text-display-lg text-obsidian-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.jordan.ourPrograms', 'Our Programs')}
          </h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto mt-4" />
        </div>

        {/* Programs Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {programs.map((program) => (
            <motion.div
              key={program.id}
              variants={itemVariants}
              className="bg-ivory-50 rounded-xl overflow-hidden flex flex-col h-full group shadow-card border border-gold-500/10 hover:shadow-lg transition-shadow"
            >
              <Link
                to={`/programs/jordan/${program.slug}`}
                className="block relative h-[240px] overflow-hidden"
              >
                <div className="absolute top-4 left-4 z-10 bg-obsidian-900/80 backdrop-blur-md text-gold-500 text-caption px-4 py-1.5 rounded-full border border-gold-500/30 shadow-glass text-xs font-semibold">
                  {program.minPax} · {program.duration?.split('/')[0]?.trim()}
                </div>
                <img
                  src={program.images[0]}
                  alt={program.title}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <div className="p-6 flex flex-col flex-grow">
                <span className="text-caption text-gold-600 uppercase tracking-widest mb-1 block text-xs font-semibold">
                  {program.code}
                </span>

                <Link to={`/programs/jordan/${program.slug}`}>
                  <h3 className="text-display-md text-obsidian-900 mb-3 line-clamp-2 group-hover:text-gold-700 transition-colors font-bold text-xl">
                    {program.title}
                  </h3>
                </Link>

                <p className="text-body-sm text-obsidian-500 line-clamp-3 mb-4 flex-grow">
                  {program.overview}
                </p>

                {/* Highlights List */}
                <div className="border-t border-gold-500/10 pt-4 mb-4">
                  <ul className="grid grid-cols-1 gap-y-1.5">
                    {(Array.isArray(program.highlights) ? program.highlights : [])
                      .slice(0, 3)
                      .map((hl, idx) => (
                        <li key={idx} className="text-[12px] text-obsidian-500 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                          <span className="truncate">{hl}</span>
                        </li>
                      ))}
                  </ul>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gold-500/10 mt-auto">
                  <span className="text-caption text-obsidian-300 text-xs">
                    {program.duration}
                  </span>
                  <Link to={`/programs/jordan/${program.slug}`}>
                    <Button variant="outline-gold" className="px-6 py-2 flex items-center gap-2 text-xs">
                      {t('tourCard.viewDetails', 'View Details')}
                      <span className="rtl:rotate-180">→</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Accommodation Section */}
      <section className="container mx-auto px-6 mt-24">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2
              className="text-display-lg text-obsidian-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('dest.jordan.hotelsTitle', 'Accommodation')}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-4" />
            <p className="text-body-md text-obsidian-500 mt-6 max-w-2xl mx-auto">
              {t(
                'dest.jordan.hotelsDesc',
                'Based on availability, accommodation in one of the following hotels in each destination.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {hotelCities.map((city) => {
              const keyName = `hotelList${city.charAt(0).toUpperCase()}${city.slice(1)}`;
              return (
                <div
                  key={city}
                  className="bg-ivory-50 rounded-xl shadow-sm border border-gold-500/10 overflow-hidden"
                >
                  <div className="bg-obsidian-900 px-4 py-3">
                    <h3 className="text-gold-500 font-semibold text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
                      <FaHotel className="flex-shrink-0 text-xs" />
                      {t(`dest.jordan.hotelCities.${city}`, city)}
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-body-sm text-obsidian-700">
                      {t(`dest.jordan.${keyName}`, '')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* What is Included / Excluded */}
      <section className="container mx-auto px-6 mt-24">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {/* Included */}
          <div className="bg-ivory-50 dark:bg-[#1a1a30] rounded-xl p-8 border border-gold-500/10 dark:border-amber-700">
            <h3
              className="text-display-md text-2xl text-obsidian-900 dark:text-black mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('tourDetail.included', 'What is Included')}
            </h3>
            <ul className="flex flex-col gap-3">
              {safeIncludes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-body-md text-obsidian-700 dark:text-black">
                  <FaCheck className="text-sage-500 dark:text-green-400 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-caption text-obsidian-400 mt-4 italic">
              {t('dest.jordan.mandatoryFees', '')}
            </p>
          </div>

          {/* Excluded */}
          <div className="bg-ivory-50 dark:bg-[#1a1a30] rounded-xl p-8 border border-gold-500/10 dark:border-amber-700">
            <h3
              className="text-display-md text-2xl text-obsidian-900 dark:text-black mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('tourDetail.excluded', 'What is Excluded')}
            </h3>
            <ul className="flex flex-col gap-3">
              {safeExcludes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-body-md text-obsidian-700 dark:text-black">
                  <FaTimes className="text-red-400 dark:text-red-300 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* Children Policy */}
      <section className="container mx-auto px-6 mt-24">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2
              className="text-display-lg text-obsidian-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('dest.jordan.childrenTitle', 'Children Policy')}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-4" />
          </div>

          <div className="bg-ivory-50 rounded-xl p-6 border border-gold-500/10 space-y-3 max-w-2xl mx-auto">
            {['children_0to2', 'children_3to10', 'children_11plus'].map((key) => {
              const text = t(`dest.jordan.${key}`, '');
              if (!text) return null;
              return (
                <div key={key} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
                  <p className="text-body-md text-obsidian-700">{text}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Cancellation Policy */}
      <section className="container mx-auto px-6 mt-24">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2
              className="text-display-lg text-obsidian-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('dest.jordan.cancellationTitle', 'Cancellation Policy')}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-4" />
          </div>

          <div className="bg-ivory-50 rounded-xl p-6 border border-gold-500/10 space-y-3 max-w-2xl mx-auto">
            {['cancellationHighSeason', 'cancellationLowSeason'].map((key) => {
              const text = t(`dest.jordan.${key}`, '');
              if (!text) return null;
              return (
                <div key={key} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
                  <p className="text-body-md text-obsidian-700">{text}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Visa Policy & Notes */}
      <section className="container mx-auto px-6 mt-24">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2
              className="text-display-lg text-obsidian-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('dest.jordan.visaTitle', 'Visa Policy & Notes')}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-4" />
          </div>

          <div className="bg-ivory-50 rounded-xl p-6 border border-gold-500/10 space-y-3 max-w-2xl mx-auto">
            {[
              'visaFreeGroup',
              'visaPassport',
              'visaLatinNationalities',
              'visaTransportNote',
              'visaPriceValidity',
            ].map((key) => {
              const text = t(`dest.jordan.${key}`, '');
              if (!text) return null;
              return (
                <div key={key} className="flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
                  <p className="text-body-md text-obsidian-700">{text}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Bottom CTA Section */}
      <section className="relative py-24 mt-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-obsidian-900/75" />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t('dest.jordan.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?")}
          </span>
          <h2
            className="text-display-xl text-ivory-50 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.jordan.ctaTitle', 'Let us design your perfect Jordan tour')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t(
              'dest.jordan.ctaDesc',
              'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.'
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
