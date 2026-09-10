import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaChevronRight, FaSun } from 'react-icons/fa';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import RouteMap from '../../components/tour/RouteMap';
import SuggestedTours from '../../components/tour/SuggestedTours';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';
import { fadeInUp } from '../../animations/variants';
import { services } from '../../data/services';

const ALIAS_MAP = {
  'extension-hurghada': 'hurghada-4d3n',
  'extension-sharm': 'sharm-4d3n',
  'extension-siwa': 'siwa-oasis-alexandria'
};

export default function ExtensionDetails() {
  const { t } = useTranslation();
  const params = useParams();
  const rawParam = params.id || params.slug || params.programId || params['*'] || '';
  const targetSlug = ALIAS_MAP[rawParam] || rawParam;

  // Find tour from services data or default to hurghada-4d3n
  const tourData = services.find((s) => s.slug === targetSlug) || services.find((s) => s.slug === 'hurghada-4d3n');

  const title = t(tourData.title, tourData.title);
  const duration = t(`${tourData.slug === 'siwa-oasis-alexandria' ? 'tour_siwa_duration' : tourData.slug === 'sharm-4d3n' ? 'trip.sharm.duration' : 'trip.hurghada.duration'}`, '04 Days / 03 Nights');
  const destination = t(tourData.location, tourData.location);
  const overviewText = tourData.overview && tourData.overview[0] ? t(tourData.overview[0], tourData.overview[0]) : '';
  const mainImage = tourData.images && tourData.images[0] ? tourData.images[0] : 'https://1.bp.blogspot.com/-HqmKDzZ73hY/XgSOtrhSAOI/AAAAAAAARdc/cxtywSwZxLIaZPfw98FzQHYtiPblmzg2gCLcBGAsYHQ/w1200-h630-p-k-no-nu/%D8%A3%D9%81%D8%B6%D9%84-%D8%A7%D9%84%D8%A3%D9%86%D8%B4%D8%B7%D8%A9-%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D9%8A%D8%A9-%D9%81%D9%89-%D8%A7%D9%84%D8%BA%D8%B1%D8%AF%D9%82%D8%A9-825x510.jpg';

  return (
    <div className="w-full bg-obsidian-50 dark:bg-obsidian-950 min-h-screen text-obsidian-900 dark:text-ivory-50">
      <Helmet>
        <title>{`${title} | Dunas Travel`}</title>
        <meta name="description" content={overviewText} />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={destination || t('extensions.badge', '🏖️ إضافات وامتدادات إقامة فاخرة')}
        title={title}
        subtitle={duration}
        bgImage={mainImage}
        breadcrumbs={
          <div className="flex flex-wrap items-center justify-center gap-2 text-caption text-gold-400 mb-2 uppercase tracking-wider text-xs md:text-sm font-semibold">
            <Link to="/" className="hover:text-ivory-50 transition-colors">
              {t('nav.home', 'Home')}
            </Link>
            <span className="rtl-flip text-[10px]">
              <FaChevronRight />
            </span>
            <Link to="/programs/extension" className="hover:text-ivory-50 transition-colors">
              {t('extensions.subtitle', 'Egypt Extensions')}
            </Link>
            <span className="rtl-flip text-[10px]">
              <FaChevronRight />
            </span>
            <span className="text-ivory-300">{title}</span>
          </div>
        }
        primaryCta={null}
        secondaryCta={null}
      />

      {/* Content Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <motion.div variants={fadeInUp} className="mb-12">
              <h2
                className="text-display-lg text-obsidian-900 dark:text-white mb-6 font-serif"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t('extensions.overviewTitle', 'Overview')}
              </h2>
              {tourData.overview && tourData.overview.map((paragraphKey, idx) => (
                <p key={idx} className="text-body-lg text-obsidian-500 dark:text-gray-300 leading-relaxed mb-4">
                  {t(paragraphKey, paragraphKey)}
                </p>
              ))}
            </motion.div>

            {/* Itinerary */}
            {tourData.itinerary && tourData.itinerary.length > 0 && (
              <motion.div variants={fadeInUp} className="mb-12">
                <h3
                  className="text-display-md text-obsidian-900 dark:text-white mb-8 font-serif"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('extensions.itinerary', 'Itinerary')}
                </h3>

                <div className="relative">
                  <div className="absolute left-[1.1rem] top-0 bottom-0 w-1 bg-gold-400" />
                  <div className="space-y-8">
                    {tourData.itinerary.map((dayItem) => {
                      const dayTitle = t(dayItem.title, dayItem.title);
                      const dayBody = dayItem.body ? t(dayItem.body, dayItem.body) : dayItem.morning ? t(dayItem.morning, dayItem.morning) : '';
                      const optTitle = dayItem.afternoon ? t(dayItem.afternoon, dayItem.afternoon) : '';
                      const optDesc = dayItem.evening ? t(dayItem.evening, dayItem.evening) : '';

                      return (
                        <motion.div
                          key={dayItem.day}
                          variants={fadeInUp}
                          className="relative pl-10 md:pl-12"
                        >
                          <div className="absolute left-[0.1rem] top-1 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                            {dayItem.day}
                          </div>
                          <div className="bg-ivory-50 dark:bg-[#1a1a30] rounded-2xl p-6 shadow-sm border border-gold-100 dark:border-gold-900/50 hover:shadow-md transition-shadow">
                            <h4
                              className="text-display-md text-obsidian-900 dark:text-white text-lg font-serif font-bold mb-3"
                              style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                              {dayTitle}
                            </h4>
                            <p className="text-body-md text-obsidian-500 dark:text-gray-300 leading-relaxed mb-3">
                              {dayBody}
                            </p>
                            {optTitle && (
                              <div className="mt-4 p-4 rounded-xl bg-gold-500/10 border border-gold-500/20">
                                <span className="text-xs uppercase font-bold text-gold-600 dark:text-gold-400 block mb-1">
                                  {optTitle}
                                </span>
                                {optDesc && (
                                  <p className="text-sm text-obsidian-600 dark:text-gray-300">
                                    {optDesc}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Route Map */}
            {tourData.itinerary && tourData.itinerary.length > 0 && (
              <RouteMap itinerary={tourData.itinerary} />
            )}
          </div>

          {/* Sidebar Booking Form */}
          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <div className="sticky top-28">
              <AdvancedBooking tourTitle={title} basePricePerPerson={tourData.price} />
            </div>
          </motion.div>
        </div>

        {/* Includes & Excludes Section */}
        <motion.div variants={fadeInUp} className="mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Includes */}
            <div>
              <h3
                className="text-display-md text-obsidian-900 dark:text-white mb-6 font-serif flex items-center gap-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                <FaCheck className="text-emerald-500" />
                {t('extensions.includesTitle', 'Includes')}
              </h3>
              <div className="space-y-3">
                {tourData.included && tourData.included.map((incKey, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-ivory-50 dark:bg-[#1a1a30] rounded-xl p-4 shadow-sm border border-gold-500/10"
                  >
                    <FaCheck className="text-gold-500 shrink-0 mt-1" size={16} />
                    <span className="text-body-md text-obsidian-700 dark:text-gray-200 font-medium">
                      {t(incKey, incKey)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Excludes */}
            {tourData.excluded && tourData.excluded.length > 0 && (
              <div>
                <h3
                  className="text-display-md text-obsidian-900 dark:text-white mb-6 font-serif flex items-center gap-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  <FaTimes className="text-rose-500" />
                  {t('tourDetails.excludes', 'Excludes')}
                </h3>
                <div className="space-y-3">
                  {tourData.excluded.map((excKey, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-ivory-50 dark:bg-[#1a1a30] rounded-xl p-4 shadow-sm border border-rose-500/10"
                    >
                      <FaTimes className="text-rose-400 shrink-0 mt-1" size={16} />
                      <span className="text-body-md text-obsidian-700 dark:text-gray-200 font-medium">
                        {t(excKey, excKey)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Customization CTA Banner */}
        <motion.div variants={fadeInUp} className="mt-16 text-center">
          <div className="bg-gradient-to-r from-amber-50 to-gold-50 dark:from-[#2a241a] dark:to-[#1a1a30] rounded-3xl p-10 shadow-lg border border-gold-200 dark:border-gold-900/50">
            <FaSun className="text-gold-500 text-4xl mx-auto mb-4" />
            <h3
              className="text-display-md text-obsidian-900 dark:text-white mb-3 font-serif"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('extensions.ctaTitle', 'Want to Customize Your Extension?')}
            </h3>
            <p className="text-body-md text-obsidian-500 dark:text-gray-300 mb-6 max-w-lg mx-auto">
              {t(
                'extensions.ctaDesc',
                'Our travel experts can tailor your extension duration, resort category, and private activities.'
              )}
            </p>
            <Link
              to="/tailor-a-tour"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-900 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {t('extensions.ctaBtn', 'Tailor Your Extension')}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Suggested Tours Section */}
      <SuggestedTours currentDestination={tourData.location || 'egypt'} currentSlug={targetSlug} />
    </div>
  );
}
