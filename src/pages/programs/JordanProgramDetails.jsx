import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FaClock,
  FaUsers,
  FaTag,
  FaMapMarkerAlt,
  FaCheck,
  FaChevronRight,
  FaUtensils,
  FaTimes as FaClose
} from 'react-icons/fa';
import { getJordanProgramBySlug, useJordanPrograms } from '../../hooks/useJordanPrograms';
import RouteMap from '../../components/tour/RouteMap';
import ReviewsMap from '../../components/tour/ReviewsMap';
import TourCard from '../../components/tour/TourCard';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import SuggestedTours from '../../components/tour/SuggestedTours';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function JordanProgramDetails() {
  const { t, i18n } = useTranslation();
  const { programId, slug } = useParams();
  const targetSlug = programId || slug;

  const locale = ['ar', 'en', 'es', 'pt', 'it'].includes(i18n.language) ? i18n.language : 'en';
  const program = getJordanProgramBySlug(targetSlug, locale);
  const allJordanPrograms = useJordanPrograms();

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
          to="/destinations/jordan"
          className="bg-gold-500 hover:bg-gold-600 text-obsidian-900 px-6 py-3 rounded-full font-semibold transition-colors"
        >
          {t('programs.viewAllJordanTours', 'View All Jordan Tours')}
        </Link>
      </div>
    );
  }

  const { title, overview, duration, highlights, days, images, code, minPax, id, included, excluded } = program;
  const relatedPrograms = allJordanPrograms.filter((p) => p.id !== id);

  return (
    <div className="w-full bg-obsidian-50 min-h-screen">
      <Helmet>
        <title>{`${title} | Dunas Travel`}</title>
        <meta name="description" content={overview} />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('dest.jordan.title', 'Jordan') + ' • ' + (code || duration)}
        title={title}
        subtitle={duration}
        bgImage={images[activeImageIndex || 0] || images[0]}
        onImageClick={() => setActiveImageIndex(0)}
        breadcrumbs={
          <div className="flex flex-wrap items-center justify-center gap-2 text-caption text-gold-400 mb-2 uppercase tracking-wider text-xs md:text-sm font-semibold">
            <Link to="/" className="hover:text-ivory-50 transition-colors underline-offset-4 hover:underline">
              {t('nav.home', 'Home')}
            </Link>
            <span className="rtl:rotate-180">
              <FaChevronRight className="text-[10px]" />
            </span>
            <Link to="/destinations/jordan" className="hover:text-ivory-50 transition-colors underline-offset-4 hover:underline">
              {t('dest.jordan.title', 'Jordan')}
            </Link>
            <span className="rtl:rotate-180">
              <FaChevronRight className="text-[10px]" />
            </span>
            <span className="text-ivory-300 truncate max-w-[220px] md:max-w-none">{title}</span>
          </div>
        }
        primaryCta={null}
        secondaryCta={null}
      />

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
              <span className="text-body-md font-semibold text-obsidian-900">{t('dest.jordan.title', 'Jordan')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
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
                className="mt-16"
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

            {/* Itinerary */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-16"
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

            {/* Inclusions & Exclusions */}
            {((Array.isArray(included) && included.length > 0) || (Array.isArray(excluded) && excluded.length > 0)) && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {Array.isArray(included) && included.length > 0 && (
                  <div className="bg-emerald-50/70 dark:bg-emerald-950/20 p-6 md:p-8 rounded-2xl border border-emerald-200/70 dark:border-emerald-800/40 shadow-sm">
                    <h3 className="text-display-md text-xl font-bold text-emerald-950 dark:text-emerald-300 mb-4 flex items-center gap-2 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                      <FaCheck className="text-emerald-600 dark:text-emerald-400 text-sm" />
                      {t('tourDetail.included', 'What is Included')}
                    </h3>
                    <ul className="space-y-3">
                      {included.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-body-md text-emerald-900 dark:text-emerald-100">
                          <FaCheck className="text-emerald-600 dark:text-emerald-400 mt-1 shrink-0 text-sm" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {Array.isArray(excluded) && excluded.length > 0 && (
                  <div className="bg-rose-50/70 dark:bg-rose-950/20 p-6 md:p-8 rounded-2xl border border-rose-200/70 dark:border-rose-800/40 shadow-sm">
                    <h3 className="text-display-md text-xl font-bold text-rose-950 dark:text-rose-300 mb-4 flex items-center gap-2 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                      <FaClose className="text-rose-600 dark:text-rose-400 text-sm" />
                      {t('tourDetail.excluded', 'What is Excluded')}
                    </h3>
                    <ul className="space-y-3">
                      {excluded.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-body-md text-rose-900 dark:text-rose-100">
                          <FaClose className="text-rose-500 dark:text-rose-400 mt-1 shrink-0 text-sm" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Route Map */}
            {Array.isArray(days) && days.length > 0 && (
              <RouteMap itinerary={days} />
            )}
          </div>

          {/* Right Column: Advanced Booking Component Sidebar */}
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
            <h2 className="text-display-lg text-obsidian-900 dark:text-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
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
                    slug: `jordan/${rel.slug}`,
                    title: rel.title,
                    images: rel.images,
                    duration: rel.duration,
                    overview: rel.overview,
                    destination: 'Jordan',
                    badge: rel.code,
                    price: Number(rel.price || rel.basePriceUsd || 0),
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Modal */}
      {activeImageIndex !== null && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setActiveImageIndex(null)}
            className="absolute top-6 right-6 text-white text-2xl p-2 hover:text-gold-500 transition-colors"
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

      {/* CSS for Carousel */}
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
      <SuggestedTours currentDestination="jordan" currentSlug={targetSlug} />
    </div>
  );
}
