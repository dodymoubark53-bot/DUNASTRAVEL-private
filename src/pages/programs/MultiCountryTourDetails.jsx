import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronRight, FaClock, FaUserFriends, FaTag,
  FaCheckCircle, FaTimesCircle, FaTimes
} from 'react-icons/fa';
import TourCard from '../../components/tour/TourCard';
import { fadeInUp } from '../../animations/variants';
import BookingForm from '../../components/booking/BookingForm';
import IncludedNotIncluded from '../../components/tour/IncludedNotIncluded';
import ReviewsMap from '../../components/tour/ReviewsMap';
import RouteMap from '../../components/tour/RouteMap';
import { useTour } from '../../hooks/useTour';
import { useTours } from '../../hooks/useTours';

const MultiCountryTourDetails = () => {
  const { t } = useTranslation();
  const { slug } = useParams();

  const { tour } = useTour(slug);
  const { tours: multiTours } = useTours({ category: 'multi-country' });
  const shuffledTours = useMemo(() => multiTours.filter(t => t.slug !== slug), [multiTours, slug]);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const id = setInterval(() => {
      const itemW = el.querySelector('.related-carousel-item')?.offsetWidth || 300;
      const gap = 24;
      const step = itemW + gap;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 3500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-obsidian-50 dark:bg-[#0f0f1a] px-6">
        <h1 className="text-display-lg text-obsidian-900 dark:text-ivory-100 mb-4">{t('programs.notFound', 'Trip no longer available')}</h1>
        <p className="text-body-md text-obsidian-500 dark:text-obsidian-300 mb-8">{t('programs.notFoundDesc', 'The trip you are looking for does not exist or has been removed.')}</p>
        <Link to="/programs/multi-country" className="bg-gold-500 hover:bg-gold-600 text-obsidian-900 px-6 py-3 rounded-full font-semibold transition-colors">
          {t('programs.viewAllTours', 'View All Multi-Country Tours')}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full bg-obsidian-50 min-h-screen">
      <Helmet>
        <title>{t(`data.${tour.title}`, tour.title)} | Dunas Travel</title>
        <meta name="description" content={t(`data.${tour.overview}`, tour.overview).substring(0, 150) + '...'} />
      </Helmet>

      {/* 1. Breadcrumb & Title */}
      <section className="pt-32 pb-10 bg-obsidian-900 text-center px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-2 text-caption text-gold-500 mb-4 uppercase tracking-wider">
            <Link to="/" className="hover:text-ivory-50 transition-colors">{t('nav.home', 'Home')}</Link>
            <span className="rtl-flip"><FaChevronRight className="text-[10px]" /></span>
            <Link to="/programs/multi-country" className="hover:text-ivory-50 transition-colors">
              {t('programs.multiCountryTitle', 'Multi-Country Tours')}
            </Link>
            <span className="rtl-flip"><FaChevronRight className="text-[10px]" /></span>
            <span className="text-ivory-300">{t(`data.${tour.title}`, tour.title)}</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display-xl text-ivory-50 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t(`data.${tour.title}`, tour.title)}
          </motion.h1>
          {tour.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-body-lg text-gold-400 font-medium tracking-wide"
            >
              {t(`data.${tour.subtitle}`, tour.subtitle)}
            </motion.p>
          )}
        </div>
      </section>

      {/* 2. Photo Gallery */}
      <section
        className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500"
        onClick={() => setIsLightboxOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsLightboxOpen(true);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={t('tour.clickGallery', 'Click to open gallery')}
      >
        <motion.img
          src={(tour.images && tour.images[0]) || '/images/tour-1.png'}
          alt={t(`data.${tour.title}`, tour.title)}
          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
        <div className="absolute bottom-6 right-6 bg-obsidian-900/80 backdrop-blur-md px-4 py-2 rounded-full text-ivory-50 text-caption border border-gold-500/20">
          {t('tour.clickGallery', 'Click to open gallery')}
        </div>
      </section>

      {/* 3. Quick Info Bar */}
      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-ivory-50 rounded-2xl shadow-card overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y md:divide-y-0 divide-gray-100 border-b border-gray-100 bg-obsidian-50">
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaClock className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase">{t('tour.duration', 'Duration')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{t(`data.${tour.duration}`, tour.duration)}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaTag className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase">{t('tour.tourType', 'Tour Type')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{t(`data.${tour.type}`, tour.type)}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaUserFriends className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase">{t('tour.groupSize', 'Group Size')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">2-16</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Content Section */}
      <section className="container mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          <div className="lg:col-span-2">

            {/* Overview */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-display-lg text-obsidian-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('tourDetail.overview', 'Overview')}
              </h2>
              <p className="text-body-lg text-obsidian-500 leading-relaxed">{t(`data.${tour.overview}`, tour.overview)}</p>
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
                  {tour.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-ivory-50 p-4 rounded-xl shadow-sm border border-gold-500/10">
                      <FaCheckCircle className="text-gold-500 mt-1 shrink-0" />
                      <span className="text-body-sm text-obsidian-700">{t(`data.${highlight}`, highlight)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Itinerary */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16">
              <div className="mb-10 text-center">
                <span className="text-caption text-gold-500 uppercase tracking-[4px] font-semibold block mb-3">
                  {t('tour.journeyDayByDay', 'YOUR JOURNEY DAY BY DAY')}
                </span>
                <h2 className="text-display-lg text-obsidian-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('tourDetail.itinerary', 'Itinerary')}
                </h2>
                <div className="w-24 h-1 bg-gold-500 mx-auto mt-3"></div>
              </div>

              <div className="relative max-w-full">
                <div className="absolute left-[1.1rem] top-0 bottom-0 w-1 bg-gold-400"></div>
                <div className="space-y-6">
                  {tour.itinerary && tour.itinerary.map((day) => (
                    <div key={day.day} className="relative pl-10 md:pl-12">
                      <div className="absolute left-[0.1rem] top-1 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                        {day.day}
                      </div>
                      <div className="bg-ivory-50 rounded-2xl p-6 shadow-sm border border-gold-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-semibold text-obsidian-900">{t('tour.day', 'Day')} {day.day}</span>
                          {day.title && (
                            <span className="text-body-sm text-obsidian-500">{t(`data.${day.title}`, day.title)}</span>
                          )}
                        </div>
                        {day.description && (
                          <p className="text-body-sm text-obsidian-500 leading-relaxed">{t(`data.${day.description}`, day.description)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <RouteMap itinerary={tour.itinerary} />
          </div>

          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <div>
              <BookingForm tourId={tour.id} tourTitle={tour.title} />
            </div>
          </div>
        </div>

        <div className="relative mt-24 mb-8">
          <div className="relative z-10 px-4 md:px-12 py-16">

            {/* Included / Excluded - Country Split (mct-006) or Standard */}
            {tour.tunisiaIncluded ? (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-16 bg-ivory-50 dark:bg-[#1a1a30] p-8 rounded-2xl shadow-sm border border-obsidian-900/5 dark:border-gray-700 text-left max-w-4xl mx-auto"
              >
                <h2
                  className="text-display-md text-obsidian-900 dark:text-black mb-8 font-display font-semibold"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('tourDetail.incExc', "What's Included & Excluded")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Country 1 (e.g. Tunisia/Morocco) */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-obsidian-900 dark:text-black border-b border-gold-500/20 pb-2 font-display">
                      {tour.slug.includes('morocco') ? t('dest.morocco', 'Morocco') : t('dest.tunisia', 'Tunisia')}
                    </h3>
                    
                    <div>
                      <h4 className="text-body-lg font-semibold text-sage-700 dark:text-green-400 mb-4 flex items-center gap-2 font-display">
                        {tour.tunisiaInclTitle ? t(`data.${tour.tunisiaInclTitle}`, tour.tunisiaInclTitle) : t('tourDetail.included', 'Included')}
                      </h4>
                      <ul className="space-y-3">
                        {tour.tunisiaIncluded.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-obsidian-500 dark:text-black">
                            <FaCheckCircle className="text-sage-500 dark:text-green-400 mt-1 flex-shrink-0" />
                            <span>{t(`data.${item}`, item)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {tour.tunisiaExcluded && tour.tunisiaExcluded.length > 0 && (
                      <div>
                        <h4 className="text-body-lg font-semibold text-red-700 dark:text-red-300 mb-4 flex items-center gap-2 font-display">
                          {tour.tunisiaExclTitle ? t(`data.${tour.tunisiaExclTitle}`, tour.tunisiaExclTitle) : t('tourDetail.excluded', 'Not Included')}
                        </h4>
                        <ul className="space-y-3">
                          {tour.tunisiaExcluded.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-obsidian-500 dark:text-black">
                              <FaTimesCircle className="text-red-500 dark:text-red-300 mt-1 flex-shrink-0" />
                              <span>{t(`data.${item}`, item)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Country 2 (Egypt) */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-obsidian-900 dark:text-black border-b border-gold-500/20 pb-2 font-display">
                      {t('dest.egypt', 'Egypt')}
                    </h3>

                    <div>
                      <h4 className="text-body-lg font-semibold text-sage-700 dark:text-green-400 mb-4 flex items-center gap-2 font-display">
                        {tour.egyptInclTitle ? t(`data.${tour.egyptInclTitle}`, tour.egyptInclTitle) : t('tourDetail.included', 'Included')}
                      </h4>
                      <ul className="space-y-3">
                        {tour.egyptIncluded.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-obsidian-500 dark:text-black">
                            <FaCheckCircle className="text-sage-500 dark:text-green-400 mt-1 flex-shrink-0" />
                            <span>{t(`data.${item}`, item)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {tour.egyptExcluded && tour.egyptExcluded.length > 0 && (
                      <div>
                        <h4 className="text-body-lg font-semibold text-red-700 dark:text-red-300 mb-4 flex items-center gap-2 font-display">
                          {tour.egyptExclTitle ? t(`data.${tour.egyptExclTitle}`, tour.egyptExclTitle) : t('tourDetail.excluded', 'Not Included')}
                        </h4>
                        <ul className="space-y-3">
                          {tour.egyptExcluded.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-obsidian-500 dark:text-black">
                              <FaTimesCircle className="text-red-500 dark:text-red-300 mt-1 flex-shrink-0" />
                              <span>{t(`data.${item}`, item)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <IncludedNotIncluded
                includedItems={tour.included}
                excludedItems={tour.excluded}
                excursionsItems={tour.excursions}
                inclusionsTitle={tour.inclusionsTitle ? t(`data.${tour.inclusionsTitle}`, tour.inclusionsTitle) : undefined}
                exclusionsTitle={tour.exclusionsTitle ? t(`data.${tour.exclusionsTitle}`, tour.exclusionsTitle) : undefined}
              />
            )}

            {/* Selected Hotels */}
            {tour.selectedHotels && tour.selectedHotels.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-16 max-w-4xl mx-auto"
              >
                <h3 className="text-display-md text-2xl mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('tourDetail.selectedHotels', 'Selected Hotels')}
                </h3>
                <div className="bg-ivory-50 rounded-2xl overflow-hidden shadow-sm border border-gold-100">
                  <div className="overflow-x-auto">
                    <table className="w-full text-body-sm">
                      <thead>
                        <tr className="bg-gold-500 text-obsidian-900">
                          <th className="px-6 py-4 text-left font-semibold">{t('tour.hotelCity', 'City')}</th>
                          <th className="px-6 py-4 text-left font-semibold">{t('tour.hotelNights', 'Nights')}</th>
                          <th className="px-6 py-4 text-left font-semibold">{t('tour.hotelName', 'Hotel')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tour.selectedHotels.map((hotel, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-ivory-50' : 'bg-obsidian-50/50'}>
                            <td className="px-6 py-4 text-obsidian-700">{t(`data.${hotel.city}`, hotel.city)}</td>
                            <td className="px-6 py-4 text-obsidian-700">{t(`data.${hotel.nights}`, hotel.nights)}</td>
                            <td className="px-6 py-4 text-obsidian-900 font-medium">{t(`data.${hotel.name}`, hotel.name)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <ReviewsMap tourId={slug} />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-obsidian-900/95 flex items-center justify-center backdrop-blur-sm"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button className="absolute top-6 right-6 text-ivory-50 hover:text-gold-500 z-[101]"><FaTimes size={32} /></button>
            <img src={tour.images[0]} alt={t(`data.${tour.title}`, tour.title)} className="max-w-[90vw] max-h-[90vh] object-contain" onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Tours */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-display-lg text-obsidian-900 dark:text-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('tourDetail.relatedTitle', 'You May Also Like')}
          </h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto mb-4"></div>
        </div>
        <div className="related-carousel" ref={carouselRef}>
          {shuffledTours.map((tour) => (
            <div key={tour.id} className="related-carousel-item">
              <TourCard tour={tour} />
            </div>
          ))}
        </div>
      </section>

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
    </div>
  );
};

export default MultiCountryTourDetails;
