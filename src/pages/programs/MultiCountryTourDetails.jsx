import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaClock, FaTag, FaUsers, FaChevronRight, FaCheck, FaTimes, FaMapMarkerAlt, FaBed, FaCheckCircle
} from 'react-icons/fa';
import TourCard from '../../components/tour/TourCard';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import RouteMap from '../../components/tour/RouteMap';
import ReviewsMap from '../../components/tour/ReviewsMap';
import multiCountryTours from '../../data/multiCountryTours';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function MultiCountryTourDetails() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { slug } = useParams();

  const tour = multiCountryTours.find(
    (item) => item.slug === slug || item.id.toLowerCase() === (slug || '').toLowerCase()
  ) || multiCountryTours[0];

  const title = tour ? t(`data.${tour.title}`, tour.title) : 'Multi-Country Tour';
  const subtitle = tour?.subtitle ? t(`data.${tour.subtitle}`, tour.subtitle) : '';
  const overview = tour?.overview ? t(`data.${tour.overview}`, tour.overview) : '';
  const duration = tour?.duration ? t(`data.${tour.duration}`, tour.duration) : '';

  const shuffledTours = useMemo(() => [...multiCountryTours].sort(() => Math.random() - 0.5), []);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const step = (el.querySelector('.related-carousel-item')?.offsetWidth || 300) + 24;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  if (!tour) return null;

  return (
    <div className="w-full bg-obsidian-50 min-h-screen">
      <Helmet>
        <title>{`${title} | Dunas Travel`}</title>
        <meta name="description" content={overview.substring(0, 150) + '...'} />
      </Helmet>

      {/* Header Banner */}
      <section className="pt-32 pb-10 bg-obsidian-900 text-center px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-2 text-caption text-gold-500 mb-4 uppercase tracking-wider text-xs">
            <Link to="/" className="hover:text-ivory-50 transition-colors">
              {t('nav.home', 'Home')}
            </Link>
            <span className="rtl-flip text-[10px]">
              <FaChevronRight />
            </span>
            <Link to="/programs/multi-country" className="hover:text-ivory-50 transition-colors">
              {t('programs.multiCountryTitle', 'Multi-Country Tours')}
            </Link>
            <span className="rtl-flip text-[10px]">
              <FaChevronRight />
            </span>
            <span className="text-ivory-300">{title}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display-xl text-ivory-50 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-body-lg text-gold-400 font-medium tracking-wide"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </section>

      {/* Hero Lightbox Gallery */}
      <section
        className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden group cursor-pointer"
        onClick={() => setIsLightboxOpen(true)}
      >
        <motion.img
          src={tour.images && tour.images[0] ? tour.images[0] : 'https://theglobetrottingdetective.com/wp-content/uploads/2022/03/best-places-in-the-middle-east-traveling-the-middle-east-cappadocia-turkey.jpg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        <div className="absolute bottom-6 right-6 bg-obsidian-900/80 backdrop-blur-md px-4 py-2 rounded-full text-ivory-50 text-caption border border-gold-500/20 text-xs">
          {t('tour.clickGallery', 'Click to open gallery')}
        </div>
      </section>

      {/* Quick Info Bar */}
      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-ivory-50 rounded-2xl shadow-card overflow-hidden border border-obsidian-200">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-x rtl:divide-x-reverse divide-gray-100 bg-obsidian-50">
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaClock className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs">{t('tour.duration', 'Duration')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{duration}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaTag className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs">{t('tour.tourType', 'Tour Type')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{tour.type || 'Multi-Country'}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaUsers className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs">{t('tour.groupSize', 'Group Size')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">2-16 Pax</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content & Sidebar Grid */}
      <section className="container mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Column */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-display-lg text-obsidian-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('tourDetail.overview', 'Overview')}
              </h2>
              <p className="text-body-lg text-obsidian-600 leading-relaxed">{overview}</p>
            </motion.div>

            {/* Highlights */}
            {Array.isArray(tour.highlights) && tour.highlights.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-16"
              >
                <h2 className="text-display-lg text-obsidian-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('tourDetail.highlights', 'Key Highlights')}
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.highlights.map((itemKey, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-gold-500/10">
                      <FaCheck className="text-gold-500 mt-1 shrink-0" />
                      <span className="text-body-sm text-obsidian-700">{t(`data.${itemKey}`, itemKey)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Day-by-Day Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <motion.div
                variants={fadeInUp}
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
                  <div className="absolute left-[1.1rem] rtl:left-auto rtl:right-[1.1rem] top-0 bottom-0 w-1 bg-gold-400" />
                  <div className="space-y-6">
                    {tour.itinerary.map((day) => (
                      <div key={day.day} className="relative pl-10 rtl:pl-0 rtl:pr-10 md:pl-12 md:rtl:pr-12">
                        <div className="absolute left-[0.1rem] rtl:left-auto rtl:right-[0.1rem] top-1 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                          {day.day}
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gold-100 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-semibold text-obsidian-900">
                              {t('tour.day', 'Day')} {day.day}
                            </span>
                            {day.title && (
                              <span className="text-body-sm text-obsidian-600 font-medium">
                                {t(`data.${day.title}`, day.title)}
                              </span>
                            )}
                          </div>

                          {day.description && (
                            <p className="text-body-sm text-obsidian-600 leading-relaxed">
                              {t(`data.${day.description}`, day.description)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Inclusions & Exclusions */}
            {((tour.included && tour.included.length > 0) || (tour.excluded && tour.excluded.length > 0) || (tour.includes && tour.includes.length > 0) || (tour.excludes && tour.excludes.length > 0)) && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-16"
              >
                <div className="mb-8">
                  <span className="text-caption text-gold-500 uppercase tracking-[4px] font-semibold block mb-2 text-xs">
                    {t('tourDetail.details', 'TOUR SPECIFICATIONS')}
                  </span>
                  <h2 className="text-display-lg text-2xl md:text-3xl text-obsidian-900 font-display font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t('tourDetail.incExc', "What's Included & Excluded")}
                  </h2>
                  <div className="w-20 h-1 bg-gold-500 mt-3 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(tour.included || tour.includes) && (
                    <div className="bg-emerald-50/80 p-6 md:p-8 rounded-2xl border border-emerald-200/80 shadow-sm">
                      <h3 className="text-display-md text-xl font-bold text-emerald-950 mb-6 flex items-center gap-2.5 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <FaCheckCircle className="text-emerald-600 flex-shrink-0" />
                        {t('tourDetail.included', 'What is Included')}
                      </h3>
                      <ul className="flex flex-col gap-3.5">
                        {(tour.included || tour.includes).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-body-md text-emerald-900">
                            <FaCheck className="text-emerald-600 mt-1 flex-shrink-0 text-sm" />
                            <span className="leading-relaxed">{t(`data.${item}`, item)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(tour.excluded || tour.excludes) && (
                    <div className="bg-rose-50/80 p-6 md:p-8 rounded-2xl border border-rose-200/80 shadow-sm">
                      <h3 className="text-display-md text-xl font-bold text-rose-950 mb-6 flex items-center gap-2.5 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <FaTimes className="text-rose-600 flex-shrink-0" />
                        {t('tourDetail.excluded', 'What is Excluded')}
                      </h3>
                      <ul className="flex flex-col gap-3.5">
                        {(tour.excluded || tour.excludes).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-body-md text-rose-900">
                            <FaTimes className="text-rose-500 mt-1 flex-shrink-0 text-sm" />
                            <span className="leading-relaxed">{t(`data.${item}`, item)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Route Map */}
            {tour.itinerary && <RouteMap itinerary={tour.itinerary} />}
          </div>

          {/* Sticky Sidebar Booking Column */}
          <div className="lg:col-span-1 sticky top-24 self-start z-40">
            <div>
              <AdvancedBooking tourTitle={title} />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Map */}
      <ReviewsMap tourId={tour.slug} />

      {/* Related Tours Carousel */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-display-lg text-obsidian-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('tourDetail.relatedTitle', 'You May Also Like')}
          </h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto mb-4" />
        </div>

        <div className="related-carousel" ref={carouselRef}>
          {shuffledTours.map((tItem) => (
            <div key={tItem.id} className="related-carousel-item">
              <TourCard tour={tItem} linkBase="/programs/multi-country" />
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .related-carousel {
          display: flex;
          overflow-x: auto;
          overflow-y: hidden;
          gap: 24px;
          padding-top: 12px;
          padding-bottom: 24px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .related-carousel-item {
          flex: 0 0 auto;
          width: 300px;
          scroll-snap-align: start;
          display: flex;
          flex-direction: column;
        }
        @media (min-width: 768px) {
          .related-carousel-item { width: 330px; }
        }
      `}</style>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button className="absolute top-6 right-6 text-ivory-50 hover:text-gold-500 z-[101] text-2xl font-bold">
              ✕
            </button>
            <img
              src={tour.images && tour.images[0] ? tour.images[0] : 'https://theglobetrottingdetective.com/wp-content/uploads/2022/03/best-places-in-the-middle-east-traveling-the-middle-east-cappadocia-turkey.jpg'}
              alt={title}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
