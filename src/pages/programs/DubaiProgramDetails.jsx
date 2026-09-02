import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FaClock,
  FaUsers,
  FaTag,
  FaMapMarkerAlt,
  FaCheck,
  FaChevronRight,
  FaUtensils,
  FaTimes as FaClose,
  FaHotel,
  FaCalendarAlt,
  FaDollarSign,
  FaTimes
} from 'react-icons/fa';
import { getDubaiProgramBySlug, useDubaiPrograms } from '../../hooks/useDubaiPrograms';
import RouteMap from '../../components/tour/RouteMap';
import ReviewsMap from '../../components/tour/ReviewsMap';
import TourCard from '../../components/tour/TourCard';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import SuggestedTours from '../../components/tour/SuggestedTours';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function DubaiProgramDetails() {
  const { t, i18n } = useTranslation();
  const { programId, slug } = useParams();
  const targetSlug = programId || slug;

  const locale = ['ar', 'en', 'es', 'pt', 'it'].includes(i18n.language) ? i18n.language : 'en';
  const program = getDubaiProgramBySlug(targetSlug, locale);
  const allDubaiPrograms = useDubaiPrograms();

  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [targetSlug]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const itemWidth = (el.querySelector('.related-carousel-item')?.offsetWidth || 300) + 24;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: itemWidth, behavior: 'smooth' });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-obsidian-50 dark:bg-[#0f0f1a] px-6 py-24 text-center">
        <h1 className="text-display-lg text-obsidian-900 dark:text-ivory-100 mb-4 font-serif">
          {t('programs.notFound', 'Trip no longer available')}
        </h1>
        <p className="text-body-md text-obsidian-500 dark:text-obsidian-300 mb-8 max-w-md">
          {t('programs.notFoundDesc', 'The trip you are looking for does not exist or has been removed.')}
        </p>
        <Link
          to="/destinations/dubai"
          className="bg-gold-500 hover:bg-gold-600 text-obsidian-900 px-6 py-3 rounded-full font-semibold transition-colors"
        >
          {t('programs.viewAllDubaiTours', 'View All Dubai Tours')}
        </Link>
      </div>
    );
  }

  const { title, overview, duration, highlights, days, images, code, minPax, id, pricing, extraNightPrices, exhibitionSurcharges, includes, excludes } = program;
  const relatedPrograms = allDubaiPrograms.filter((p) => p.id !== id);

  return (
    <div className="w-full bg-obsidian-50 min-h-screen">
      <Helmet>
        <title>{`${title} | Dunas Travel`}</title>
        <meta name="description" content={overview} />
      </Helmet>

      {/* Top Breadcrumb & Header */}
      <section className="pt-32 pb-10 bg-obsidian-900 text-center px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-2 text-caption text-gold-500 mb-4 uppercase tracking-wider text-xs md:text-sm font-semibold">
            <Link to="/" className="hover:text-ivory-50 transition-colors underline-offset-4 hover:underline">
              {t('nav.home', 'Home')}
            </Link>
            <span className="rtl:rotate-180">
              <FaChevronRight className="text-[10px]" />
            </span>
            <Link to="/destinations/dubai" className="hover:text-ivory-50 transition-colors underline-offset-4 hover:underline">
              {t('dest.dubai.title', 'Dubai')}
            </Link>
            <span className="rtl:rotate-180">
              <FaChevronRight className="text-[10px]" />
            </span>
            <span className="text-ivory-300 truncate max-w-[220px] md:max-w-none">{title}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display-xl text-ivory-50 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-body-lg text-gold-400 font-medium tracking-wide"
          >
            {code}
          </motion.p>
        </div>
      </section>

      {/* Main Hero Image */}
      <section
        className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500"
        onClick={() => setActiveImageIndex(0)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActiveImageIndex(0);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={t('tour.clickGallery', 'Click to open gallery')}
      >
        <motion.img
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={images[activeImageIndex || 0] || images[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute bottom-6 right-6 bg-obsidian-900/80 backdrop-blur-md px-4 py-2 rounded-full text-ivory-50 text-caption border border-gold-500/20 text-xs font-medium">
          {t('tour.clickGallery', 'Click to open gallery')}
        </div>
      </section>

      {/* Key Stats Bar */}
      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-ivory-50 rounded-2xl shadow-card overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 border-b border-gray-100 bg-obsidian-50">
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaClock className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs font-semibold">{t('tour.duration', 'Duration')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{duration}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaUsers className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs font-semibold">{t('tour.tourType', 'Program')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{minPax}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaTag className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs font-semibold">{t('tour.code', 'Code')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{code}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaMapMarkerAlt className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs font-semibold">{t('tour.destination', 'Destination')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{t('dest.dubai.title', 'Dubai')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <section className="container mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-16">
            {/* Overview */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-display-lg text-obsidian-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('tourDetail.overview', 'Overview')}
              </h2>
              <p className="text-body-lg text-obsidian-500 leading-relaxed whitespace-pre-line">
                {overview}
              </p>
            </motion.div>

            {/* Key Highlights */}
            {Array.isArray(highlights) && highlights.length > 0 && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <h2 className="text-display-lg text-obsidian-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('tourDetail.highlights', 'Key Highlights')}
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-ivory-50 p-4 rounded-xl shadow-sm border border-gold-500/10">
                      <FaCheck className="text-gold-500 mt-1 shrink-0" />
                      <span className="text-body-sm text-obsidian-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Day-by-Day Itinerary */}
            {Array.isArray(days) && days.length > 0 && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="mb-10 text-center">
                  <span className="text-caption text-gold-500 uppercase tracking-[4px] font-semibold block mb-3 text-xs">
                    {t('tour.journeyDayByDay', 'YOUR JOURNEY DAY BY DAY')}
                  </span>
                  <h2 className="text-display-lg text-obsidian-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t('tourDetail.itinerary', 'Itinerary')}
                  </h2>
                  <div className="w-24 h-1 bg-gold-500 mx-auto mt-3" />
                </div>

                <div className="relative max-w-full">
                  <div className="absolute left-[1.1rem] top-0 bottom-0 w-1 bg-gold-400" />
                  <div className="space-y-6">
                    {days.map((d) => (
                      <div key={d.day} className="relative pl-10 md:pl-12">
                        <div className="absolute left-[0.1rem] top-1 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                          {d.day}
                        </div>
                        <div className="bg-ivory-50 rounded-2xl p-6 shadow-sm border border-gold-100 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-semibold text-obsidian-900">
                              {t('tour.day', 'Day')} {d.day}
                            </span>
                            {d.meals && (
                              <span className="text-caption text-obsidian-400 flex items-center gap-1.5 ml-auto text-xs">
                                <FaUtensils className="text-gold-500" />
                                {d.meals}
                              </span>
                            )}
                          </div>
                          <p className="text-body-sm text-obsidian-500 leading-relaxed whitespace-pre-line">
                            {d.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Route Map */}
            {Array.isArray(days) && days.length > 0 && (
              <RouteMap itinerary={days} />
            )}

            {/* Pricing Tables */}
            {pricing && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-ivory-50 rounded-2xl p-8 border border-gold-500/20 shadow-sm"
              >
                <div className="mb-6">
                  <h3 className="text-display-md text-2xl text-obsidian-900 mb-2 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t('dest.dubai.pricingTitle', 'Pricing')}
                  </h3>
                  <p className="text-xs text-gold-600 uppercase font-semibold tracking-wider mb-4">
                    {t('dest.dubai.netPrices', 'NET PRICES PER PERSON (MINIMUM 2 PASSENGERS TOGETHER)')}
                  </p>
                  <p className="text-xs text-obsidian-400 italic">
                    {t('dest.dubai.priceNote', '(DBL: Double Room / SGL SUP: Single Supplement)')}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-obsidian-900 text-gold-500 text-xs uppercase tracking-wider">
                        <th className="p-3.5 border-b border-obsidian-800">{t('dest.dubai.hotelOrSimilar', 'HOTEL OR SIMILAR')}</th>
                        <th className="p-3.5 border-b border-obsidian-800 text-center" colSpan={2}>
                          {t('dest.dubai.pricesWinter', 'WINTER')}
                          {pricing.winterDates && <span className="block text-[10px] text-ivory-300 normal-case font-normal">{pricing.winterDates}</span>}
                        </th>
                        <th className="p-3.5 border-b border-obsidian-800 text-center" colSpan={2}>
                          {t('dest.dubai.pricesSummer', 'SUMMER')}
                          {pricing.summerDates && <span className="block text-[10px] text-ivory-300 normal-case font-normal">{pricing.summerDates}</span>}
                        </th>
                      </tr>
                      <tr className="bg-obsidian-800 text-ivory-200 text-xs text-center border-b border-obsidian-700">
                        <th className="p-2 text-left"></th>
                        <th className="p-2 border-r border-obsidian-700">{t('dest.dubai.pricesDbl', 'DBL')}</th>
                        <th className="p-2 border-r border-obsidian-700">{t('dest.dubai.pricesSglSup', 'SGL SUP')}</th>
                        <th className="p-2 border-r border-obsidian-700">{t('dest.dubai.pricesDbl', 'DBL')}</th>
                        <th className="p-2">{t('dest.dubai.pricesSglSup', 'SGL SUP')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-500/10">
                      {pricing.hotels.map((hotelName, idx) => {
                        const w = pricing.winter?.[idx] || {};
                        const s = pricing.summer?.[idx] || {};
                        return (
                          <tr key={idx} className="hover:bg-gold-500/5 transition-colors">
                            <td className="p-3.5 font-medium text-obsidian-800 flex items-center gap-2">
                              <FaHotel className="text-gold-500 shrink-0 text-xs" />
                              <span>{hotelName}</span>
                            </td>
                            <td className="p-3.5 text-center font-semibold text-obsidian-900 border-r border-gold-500/10">
                              {w.dbl ? `$${w.dbl}` : '-'}
                            </td>
                            <td className="p-3.5 text-center text-obsidian-600 border-r border-gold-500/10">
                              {w.sgl ? `+$${w.sgl}` : '-'}
                            </td>
                            <td className="p-3.5 text-center font-semibold text-obsidian-900 border-r border-gold-500/10">
                              {s.dbl ? `$${s.dbl}` : '-'}
                            </td>
                            <td className="p-3.5 text-center text-obsidian-600">
                              {s.sgl ? `+$${s.sgl}` : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Extra Night Prices */}
            {extraNightPrices && extraNightPrices.hotels && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-ivory-50 rounded-2xl p-8 border border-gold-500/20 shadow-sm"
              >
                <div className="mb-6">
                  <h3 className="text-display-md text-2xl text-obsidian-900 mb-2 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t('dest.dubai.extraNightTitle', 'Extra Night Prices')}
                  </h3>
                  <p className="text-xs text-obsidian-500">
                    {t('dest.dubai.extraNightDesc', 'Per person per night supplement for extra nights before or after the program.')}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-obsidian-900 text-gold-500 text-xs uppercase tracking-wider">
                        <th className="p-3.5 border-b border-obsidian-800">{t('dest.dubai.hotelTier', 'Hotel')}</th>
                        <th className="p-3.5 border-b border-obsidian-800 text-center" colSpan={2}>{t('dest.dubai.pricesWinter', 'WINTER')}</th>
                        <th className="p-3.5 border-b border-obsidian-800 text-center" colSpan={2}>{t('dest.dubai.pricesSummer', 'SUMMER')}</th>
                        {extraNightPrices.other && <th className="p-3.5 border-b border-obsidian-800 text-center" colSpan={2}>{t('dest.dubai.otherSeason', 'OTHER')}</th>}
                      </tr>
                      <tr className="bg-obsidian-800 text-ivory-200 text-xs text-center border-b border-obsidian-700">
                        <th className="p-2 text-left"></th>
                        <th className="p-2 border-r border-obsidian-700">{t('dest.dubai.pricesDbl', 'DBL')}</th>
                        <th className="p-2 border-r border-obsidian-700">{t('dest.dubai.pricesSglSup', 'SGL SUP')}</th>
                        <th className="p-2 border-r border-obsidian-700">{t('dest.dubai.pricesDbl', 'DBL')}</th>
                        <th className="p-2 border-r border-obsidian-700">{t('dest.dubai.pricesSglSup', 'SGL SUP')}</th>
                        {extraNightPrices.other && <>
                          <th className="p-2 border-r border-obsidian-700">{t('dest.dubai.pricesDbl', 'DBL')}</th>
                          <th className="p-2">{t('dest.dubai.pricesSglSup', 'SGL SUP')}</th>
                        </>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-500/10">
                      {extraNightPrices.hotels.map((hotelName, idx) => {
                        const w = extraNightPrices.winter?.[idx] || {};
                        const s = extraNightPrices.summer?.[idx] || {};
                        const o = extraNightPrices.other?.[idx] || {};
                        return (
                          <tr key={idx} className="hover:bg-gold-500/5 transition-colors">
                            <td className="p-3.5 font-medium text-obsidian-800">{hotelName}</td>
                            <td className="p-3.5 text-center font-semibold border-r border-gold-500/10">{w.dbl ? `$${w.dbl}` : '-'}</td>
                            <td className="p-3.5 text-center border-r border-gold-500/10">{w.sgl ? `$${w.sgl}` : '-'}</td>
                            <td className="p-3.5 text-center font-semibold border-r border-gold-500/10">{s.dbl ? `$${s.dbl}` : '-'}</td>
                            <td className="p-3.5 text-center border-r border-gold-500/10">{s.sgl ? `$${s.sgl}` : '-'}</td>
                            {extraNightPrices.other && <>
                              <td className="p-3.5 text-center font-semibold border-r border-gold-500/10">{o.dbl ? `$${o.dbl}` : '-'}</td>
                              <td className="p-3.5 text-center">{o.sgl ? `$${o.sgl}` : '-'}</td>
                            </>}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* Exhibition Surcharges */}
            {exhibitionSurcharges && (exhibitionSurcharges.dubai || exhibitionSurcharges.abuDhabi) && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-ivory-50 rounded-2xl p-8 border border-gold-500/20 shadow-sm space-y-6"
              >
                <div>
                  <h3 className="text-display-md text-2xl text-obsidian-900 mb-2 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t('dest.dubai.exhibitionTitle', 'Exhibition Surcharges')}
                  </h3>
                  <p className="text-xs text-obsidian-500">
                    {t('dest.dubai.exhibitionDesc', 'Per person per night surcharges applicable during exhibition periods.')}
                  </p>
                </div>

                {exhibitionSurcharges.dubai && (
                  <div>
                    <h4 className="text-sm font-bold text-gold-600 uppercase tracking-wider mb-3">
                      {t('dest.dubai.dubai', 'Dubai')}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-obsidian-900 text-gold-500 uppercase">
                            <th className="p-2.5">{t('dest.dubai.event', 'Event')}</th>
                            <th className="p-2.5">{t('dest.dubai.dates', 'Dates')}</th>
                            <th className="p-2.5 text-center">3★ (DBL/SGL)</th>
                            <th className="p-2.5 text-center">4★ (DBL/SGL)</th>
                            <th className="p-2.5 text-center">5★ (DBL/SGL)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gold-500/10">
                          {exhibitionSurcharges.dubai.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gold-500/5">
                              <td className="p-2.5 font-bold text-obsidian-900">{item.event}</td>
                              <td className="p-2.5 text-obsidian-600">{item.dates}</td>
                              <td className="p-2.5 text-center">${item['3star']?.dbl} / ${item['3star']?.sgl}</td>
                              <td className="p-2.5 text-center">${item['4star']?.dbl} / ${item['4star']?.sgl}</td>
                              <td className="p-2.5 text-center">${item['5star']?.dbl} / ${item['5star']?.sgl}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {exhibitionSurcharges.abuDhabi && (
                  <div>
                    <h4 className="text-sm font-bold text-gold-600 uppercase tracking-wider mb-3">
                      {t('dest.dubai.abuDhabi', 'Abu Dhabi')}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-obsidian-900 text-gold-500 uppercase">
                            <th className="p-2.5">{t('dest.dubai.event', 'Event')}</th>
                            <th className="p-2.5">{t('dest.dubai.dates', 'Dates')}</th>
                            <th className="p-2.5 text-center">4★ (DBL/SGL)</th>
                            <th className="p-2.5 text-center">5★ (DBL/SGL)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gold-500/10">
                          {exhibitionSurcharges.abuDhabi.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gold-500/5">
                              <td className="p-2.5 font-bold text-obsidian-900">{item.event}</td>
                              <td className="p-2.5 text-obsidian-600">{item.dates}</td>
                              <td className="p-2.5 text-center">${item['4star']?.dbl} / ${item['4star']?.sgl}</td>
                              <td className="p-2.5 text-center">${item['5star']?.dbl} / ${item['5star']?.sgl}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* What is Included / Excluded */}
            {(includes || excludes) && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {includes && (
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/20 rounded-2xl p-6 md:p-8 border border-emerald-200/70 dark:border-emerald-800/40 shadow-sm">
                    <h3 className="text-display-md text-2xl text-emerald-950 dark:text-emerald-300 mb-6 font-serif flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      <FaCheck className="text-emerald-600 dark:text-emerald-400" />
                      {t('tourDetail.included', 'What is Included')}
                    </h3>
                    {Array.isArray(includes) ? (
                      <ul className="space-y-3">
                        {includes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-body-md text-emerald-900 dark:text-emerald-100">
                            <FaCheck className="text-emerald-600 dark:text-emerald-400 mt-1 shrink-0 text-sm" />
                            <span>{typeof item === 'object' ? (item[locale] || item.en || item.ar) : item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-body-md text-emerald-900 dark:text-emerald-100 whitespace-pre-line leading-relaxed">
                        {typeof includes === 'string' ? includes : ''}
                      </p>
                    )}
                  </div>
                )}

                {excludes && (
                  <div className="bg-rose-50/70 dark:bg-rose-950/20 rounded-2xl p-6 md:p-8 border border-rose-200/70 dark:border-rose-800/40 shadow-sm">
                    <h3 className="text-display-md text-2xl text-rose-950 dark:text-rose-300 mb-6 font-serif flex items-center gap-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                      <FaTimes className="text-rose-600 dark:text-rose-400" />
                      {t('tourDetail.excluded', 'What is Excluded')}
                    </h3>
                    {Array.isArray(excludes) ? (
                      <ul className="space-y-3">
                        {excludes.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-body-md text-rose-900 dark:text-rose-100">
                            <FaTimes className="text-rose-500 dark:text-rose-400 mt-1 shrink-0 text-sm" />
                            <span>{typeof item === 'object' ? (item[locale] || item.en || item.ar) : item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-body-md text-rose-900 dark:text-rose-100 whitespace-pre-line leading-relaxed">
                        {typeof excludes === 'string' ? excludes : ''}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Column: Advanced Booking Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 self-start z-30">
              <AdvancedBooking tourTitle={title} />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Map */}
      <section className="mt-16">
        <ReviewsMap />
      </section>

      {/* Related Programs Carousel */}
      {relatedPrograms.length > 0 && (
        <section className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-display-lg text-obsidian-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('tourDetail.relatedTitle', 'You May Also Like')}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mb-4" />
          </div>

          <div className="related-carousel" ref={carouselRef}>
            {relatedPrograms.map((rel) => (
              <div key={rel.id} className="related-carousel-item">
                <TourCard
                  tour={{
                    id: rel.id,
                    slug: `dubai/${rel.slug}`,
                    title: rel.title,
                    images: rel.images,
                    duration: rel.duration,
                    overview: rel.overview,
                    destination: 'Dubai',
                    badge: rel.code,
                    price: Number(rel.pricing?.winter?.[0]?.dbl || 899),
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Lightbox Modal */}
      {activeImageIndex !== null && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-6 right-6 text-white text-2xl p-2 hover:text-gold-500 transition-colors"
            aria-label="Close modal"
          >
            <FaClose />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl">
            <img
              src={images[activeImageIndex] || images[0]}
              alt={title}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      <style>{`
        .related-carousel {
          display: flex;
          overflow-x: auto;
          gap: 24px;
          padding-bottom: 16px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .related-carousel::-webkit-scrollbar {
          display: none;
        }
        .related-carousel-item {
          flex: 0 0 auto;
          width: 280px;
          scroll-snap-align: start;
        }
        @media (min-width: 768px) {
          .related-carousel-item {
            width: 320px;
          }
        }
        @media (min-width: 1024px) {
          .related-carousel-item {
            width: 350px;
          }
        }
      `}</style>

      {/* Suggested Tours Strip */}
      <SuggestedTours currentDestination="dubai" currentSlug={programId} />
    </div>
  );
}
