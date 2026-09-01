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
  FaTimes,
  FaTimes as FaClose,
  FaChevronLeft
} from 'react-icons/fa';
import { getTurkeyProgramBySlug, useTurkeyPrograms } from '../../hooks/useTurkeyPrograms';
import RouteMap from '../../components/tour/RouteMap';
import ReviewsMap from '../../components/tour/ReviewsMap';
import TourCard from '../../components/tour/TourCard';
import TurkeySidebarBooking from '../../components/booking/TurkeySidebarBooking';
import SuggestedTours from '../../components/tour/SuggestedTours';

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function TurkeyProgramDetails() {
  const { t, i18n } = useTranslation();
  const { programId, slug } = useParams();
  const targetSlug = programId || slug;

  const locale = ['ar', 'en', 'es', 'pt', 'it'].includes(i18n.language) ? i18n.language : 'en';
  const program = getTurkeyProgramBySlug(targetSlug, locale);
  const allTurkeyPrograms = useTurkeyPrograms();

  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [selectedTransport, setSelectedTransport] = useState(null); // 'train' | 'bus'
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
          to="/destinations/turkey"
          className="bg-gold-500 hover:bg-gold-600 text-obsidian-900 px-6 py-3 rounded-full font-semibold transition-colors"
        >
          {t('programs.viewAllTurkeyTours', 'View All Turkey Tours')}
        </Link>
      </div>
    );
  }

  const { title, overview, duration, highlights, days, images, code, minPax, id, transportOptions, includes, excludes } = program;
  const relatedPrograms = allTurkeyPrograms.filter((p) => p.id !== id);

  return (
    <div className="w-full bg-obsidian-50 dark:bg-[#0f0f1a] min-h-screen">
      <Helmet>
        <title>{`${title} | Dunas Travel`}</title>
        <meta name="description" content={overview} />
      </Helmet>

      {/* Top Breadcrumb & Title Section (Matching Vercel 100%) */}
      <section className="pt-32 pb-10 bg-obsidian-900 dark:bg-[#0a0a15] text-center px-6">
        <div className="container mx-auto">
          {/* Breadcrumb Links */}
          <div className="flex items-center justify-center gap-2 text-caption text-gold-500 mb-4 uppercase tracking-wider text-xs md:text-sm font-semibold">
            <Link to="/" className="hover:text-ivory-50 dark:hover:text-ivory-100 transition-colors">
              {t('nav.home', 'Home')}
            </Link>
            <span className="rtl-flip">
              <FaChevronRight className="text-[10px]" />
            </span>
            <Link to="/destinations/turkey" className="hover:text-ivory-50 dark:hover:text-ivory-100 transition-colors">
              {t('dest.turkey.title', 'Turkey')}
            </Link>
            <span className="rtl-flip">
              <FaChevronRight className="text-[10px]" />
            </span>
            <span className="text-ivory-300">{title}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display-xl text-ivory-50 mb-4 font-serif"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </motion.h1>

          {code && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-body-lg text-gold-400 font-medium tracking-wide"
            >
              {code}
            </motion.p>
          )}
        </div>
      </section>

      {/* Hero Image Banner & Gallery Trigger (Matching Vercel 100%) */}
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
          key={activeImageIndex !== null ? activeImageIndex : 0}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1920&q=80'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute bottom-6 right-6 ltr:right-6 rtl:left-6 bg-obsidian-900/80 backdrop-blur-md px-4 py-2 rounded-full text-ivory-50 text-caption border border-gold-500/20 shadow-lg flex items-center gap-2">
          {t('tour.clickGallery', 'Click to open gallery')}
        </div>
      </section>

      {/* Floating Key Specs Card (-mt-12) (Matching Vercel 100%) */}
      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-ivory-50 dark:bg-[#1a1a30] rounded-2xl shadow-card overflow-hidden border border-gray-100 dark:border-obsidian-600">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 dark:divide-obsidian-600 border-b border-gray-100 dark:border-obsidian-600 bg-obsidian-50 dark:bg-obsidian-800">
            {/* Duration */}
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaClock className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 dark:text-obsidian-300 uppercase font-medium text-xs">
                {t('tour.duration', 'Duration')}
              </span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-100">
                {duration}
              </span>
            </div>

            {/* Program / Min Pax */}
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaUsers className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 dark:text-obsidian-300 uppercase font-medium text-xs">
                {t('tour.tourType', 'Program')}
              </span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-100">
                {minPax}
              </span>
            </div>

            {/* Code */}
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaTag className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 dark:text-obsidian-300 uppercase font-medium text-xs">
                {t('tour.code', 'Code')}
              </span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-100">
                {code}
              </span>
            </div>

            {/* Destination */}
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaMapMarkerAlt className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 dark:text-obsidian-300 uppercase font-medium text-xs">
                {t('tour.destination', 'Destination')}
              </span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-100">
                {t('dest.turkey.title', 'Turkey')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transport Option Selector (High-Speed Train vs Bus) (Matching Vercel 100%) */}
      {transportOptions && (
        <section id="transport-selector" className="container mx-auto px-6 pt-12">
          <div className="bg-gradient-to-r from-gold-50 via-gold-100/50 to-gold-50 dark:from-obsidian-700 dark:via-obsidian-600 dark:to-obsidian-700 border-2 border-gold-400 dark:border-gold-600 rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-display-md text-obsidian-900 dark:text-ivory-50 mb-1 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                {transportOptions}
              </h3>
              <p className="text-body-sm text-obsidian-500 dark:text-obsidian-300">
                {t('tour.transportNote', 'Choose your preferred transport between Istanbul and Ankara')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <button
                type="button"
                onClick={() => setSelectedTransport('train')}
                className={`flex-1 p-5 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer ${
                  selectedTransport === 'train'
                    ? 'border-gold-500 bg-gold-500/10 dark:bg-gold-500/20 shadow-lg shadow-gold-500/20 scale-[1.02]'
                    : 'border-gold-300/50 dark:border-gold-600/50 bg-white/60 dark:bg-obsidian-800/60 hover:border-gold-400 hover:bg-gold-50/80 dark:hover:bg-obsidian-700/80'
                }`}
              >
                <span className="text-4xl block mb-2">🚄</span>
                <span className={`text-body-md font-bold block ${selectedTransport === 'train' ? 'text-gold-700 dark:text-gold-300' : 'text-obsidian-700 dark:text-ivory-100'}`}>
                  {t('tour.highSpeedTrain', 'High-Speed Train')}
                </span>
                <span className={`text-caption block mt-1 ${selectedTransport === 'train' ? 'text-gold-600 dark:text-gold-400' : 'text-obsidian-400 dark:text-obsidian-300'}`}>
                  ~4 {t('tour.hours', 'hours')}
                </span>
                {selectedTransport === 'train' && (
                  <span className="inline-block mt-2 text-[11px] font-semibold text-gold-700 dark:text-gold-300 bg-gold-200 dark:bg-gold-800 px-3 py-1 rounded-full">
                    ✓ {t('tour.selected', 'Selected')}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedTransport('bus')}
                className={`flex-1 p-5 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer ${
                  selectedTransport === 'bus'
                    ? 'border-gold-500 bg-gold-500/10 dark:bg-gold-500/20 shadow-lg shadow-gold-500/20 scale-[1.02]'
                    : 'border-gold-300/50 dark:border-gold-600/50 bg-white/60 dark:bg-obsidian-800/60 hover:border-gold-400 hover:bg-gold-50/80 dark:hover:bg-obsidian-700/80'
                }`}
              >
                <span className="text-4xl block mb-2">🚌</span>
                <span className={`text-body-md font-bold block ${selectedTransport === 'bus' ? 'text-gold-700 dark:text-gold-300' : 'text-obsidian-700 dark:text-ivory-100'}`}>
                  {t('tour.bus', 'Bus')}
                </span>
                <span className={`text-caption block mt-1 ${selectedTransport === 'bus' ? 'text-gold-600 dark:text-gold-400' : 'text-obsidian-400 dark:text-obsidian-300'}`}>
                  ~6 {t('tour.hours', 'hours')} · {t('tour.viaGrandBazaar', 'via Grand Bazaar')}
                </span>
                {selectedTransport === 'bus' && (
                  <span className="inline-block mt-2 text-[11px] font-semibold text-gold-700 dark:text-gold-300 bg-gold-200 dark:bg-gold-800 px-3 py-1 rounded-full">
                    ✓ {t('tour.selected', 'Selected')}
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main Grid Section (Matching Vercel 100%) */}
      <section className="container mx-auto px-6 pt-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Main Left Content (2 Cols) */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Overview */}
            {overview && (
              <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2
                  className="text-display-lg text-obsidian-900 dark:text-ivory-100 mb-6 font-serif"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('tourDetail.overview', 'Overview')}
                </h2>
                <p className="text-body-lg text-obsidian-500 dark:text-obsidian-300 leading-relaxed whitespace-pre-line">
                  {overview}
                </p>
              </motion.div>
            )}

            {/* Key Highlights */}
            {Array.isArray(highlights) && highlights.length > 0 && (
              <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2
                  className="text-display-lg text-obsidian-900 dark:text-ivory-100 mb-6 font-serif"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('tourDetail.highlights', 'Key Highlights')}
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highlights.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 bg-ivory-50 dark:bg-obsidian-800 p-4 rounded-xl shadow-sm border border-gold-500/10 dark:border-gold-500/20"
                    >
                      <FaCheck className="text-gold-500 mt-1 shrink-0" />
                      <span className="text-body-sm text-obsidian-700 dark:text-obsidian-200">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Itinerary Timeline */}
            {days && days.length > 0 && (
              <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="mb-10 text-center">
                  <span className="text-caption text-gold-500 uppercase tracking-[4px] font-semibold block mb-3">
                    {t('tour.journeyDayByDay', 'YOUR JOURNEY DAY BY DAY')}
                  </span>
                  <h2
                    className="text-display-lg text-obsidian-900 dark:text-ivory-100 font-serif"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {t('tourDetail.itinerary', 'Itinerary')}
                  </h2>
                  <div className="w-24 h-1 bg-gold-500 mx-auto mt-3" />
                </div>

                <div className="relative max-w-full">
                  {/* Vertical Line */}
                  <div className="absolute left-[1.1rem] rtl:right-[1.1rem] rtl:left-auto top-0 bottom-0 w-1 bg-gold-400" />
                  
                  <div className="space-y-6">
                    {days.map((d) => (
                      <div key={d.day} className="relative pl-10 md:pl-12 rtl:pr-10 rtl:md:pr-12 rtl:pl-0">
                        <div className="absolute left-[0.1rem] rtl:right-[0.1rem] rtl:left-auto top-1 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                          {d.day}
                        </div>
                        <div className="bg-ivory-50 dark:bg-obsidian-800 rounded-2xl p-6 shadow-sm border border-gold-100 dark:border-obsidian-600 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-semibold text-obsidian-900 dark:text-ivory-100">
                              {t('tour.day', 'Day')} {d.day}
                              {d.title ? `: ${d.title}` : ''}
                            </span>
                            {d.meals && (
                              <span className="text-caption text-obsidian-400 dark:text-obsidian-300 flex items-center gap-1 ltr:ml-auto rtl:mr-auto">
                                <FaUtensils className="text-gold-500" /> {d.meals}
                              </span>
                            )}
                          </div>
                          <p className="text-body-sm text-obsidian-500 dark:text-obsidian-300 leading-relaxed whitespace-pre-line">
                            {d.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Inclusions & Exclusions */}
            {(includes || excludes) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {includes && (
                  <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-6 rounded-2xl border border-emerald-500/20">
                    <h3 className="text-title-md text-emerald-800 dark:text-emerald-300 font-semibold mb-4 flex items-center gap-2">
                      <FaCheck className="text-emerald-500" /> {t('programs.included', 'What is Included')}
                    </h3>
                    <p className="text-body-md text-obsidian-700 dark:text-ivory-200 whitespace-pre-line leading-relaxed">
                      {typeof includes === 'string' ? includes : JSON.stringify(includes)}
                    </p>
                  </div>
                )}
                {excludes && (
                  <div className="bg-rose-500/5 dark:bg-rose-500/10 p-6 rounded-2xl border border-rose-500/20">
                    <h3 className="text-title-md text-rose-800 dark:text-rose-300 font-semibold mb-4 flex items-center gap-2">
                      <FaTimes className="text-rose-500" /> {t('programs.excluded', 'What is Excluded')}
                    </h3>
                    <p className="text-body-md text-obsidian-700 dark:text-ivory-200 whitespace-pre-line leading-relaxed">
                      {typeof excludes === 'string' ? excludes : JSON.stringify(excludes)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Route Map */}
            <RouteMap itinerary={days} />
          </div>

          {/* Sidebar Booking Column (1 Col) */}
          <div className="lg:col-span-1 sticky top-24 self-start z-40">
            <div>
              <TurkeySidebarBooking
                tourTitle={title}
                transportChoice={selectedTransport}
                requireTransportChoice={!!transportOptions}
              />
            </div>
          </div>

        </div>
      </section>

      {/* Reviews Map */}
      <ReviewsMap />

      {/* Related Programs Section */}
      {relatedPrograms.length > 0 && (
        <section className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2
              className="text-display-lg text-obsidian-900 dark:text-ivory-100 mb-4 font-serif"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('tourDetail.relatedTitle', 'You May Also Like')}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mb-4" />
          </div>

          <div className="related-carousel" ref={carouselRef}>
            {relatedPrograms.map((relProg) => (
              <div key={relProg.id} className="related-carousel-item">
                <TourCard
                  tour={{
                    id: relProg.id,
                    slug: relProg.slug,
                    destination: 'turkey',
                    title: relProg.title,
                    overview: relProg.overview,
                    duration: relProg.duration,
                    price: relProg.raw?.price || 899,
                    images: relProg.images,
                    type: relProg.raw?.type || 'Turkey Tour',
                    code: relProg.code,
                    minPax: relProg.minPax,
                    transportOptions: relProg.transportOptions,
                  }}
                  linkBase="/programs/turkey"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Photo Gallery Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4 md:p-8"
            onClick={() => setActiveImageIndex(null)}
          >
            <button
              type="button"
              onClick={() => setActiveImageIndex(null)}
              className="absolute top-6 right-6 text-ivory-100 hover:text-gold-400 text-3xl p-2 z-50 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <FaClose />
            </button>

            <div
              className="relative max-w-5xl max-h-[80vh] w-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {images && images.length > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                  className="absolute left-2 md:-left-12 text-ivory-100 hover:text-gold-400 text-3xl p-3 z-50 transition-colors bg-obsidian-900/60 rounded-full cursor-pointer"
                  aria-label="Previous image"
                >
                  <FaChevronLeft />
                </button>
              )}

              <img
                src={(images && images[activeImageIndex]) || images[0]}
                alt={`${title} - ${activeImageIndex + 1}`}
                className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl"
              />

              {images && images.length > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 md:-right-12 text-ivory-100 hover:text-gold-400 text-3xl p-3 z-50 transition-colors bg-obsidian-900/60 rounded-full cursor-pointer"
                  aria-label="Next image"
                >
                  <FaChevronRight />
                </button>
              )}
            </div>

            <div className="mt-4 text-ivory-300 text-sm font-medium">
              {activeImageIndex + 1} / {images ? images.length : 1}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carousel Styling */}
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
          .related-carousel-item { width: 320px; }
        }
        @media (min-width: 1024px) {
          .related-carousel-item { width: 350px; }
        }
      `}</style>

      {/* Suggested Tours Strip */}
      <SuggestedTours currentDestination="turkey" currentSlug={programId} />
    </div>
  );
}
