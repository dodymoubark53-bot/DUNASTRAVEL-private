import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronRight, FaClock, FaUserFriends, FaGlobe, FaTag,
  FaCheck, FaTimes, FaMapMarkerAlt, FaBed, FaCheckCircle
} from 'react-icons/fa';
import { tours } from '../../data/tours';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tour/TourCard';
import { fadeInUp } from '../../animations/variants';
import BookingForm from '../../components/booking/BookingForm';
import { useCurrency } from '../../context/CurrencyContext';

import { useTour } from '../../hooks/useTour';
import { trackEvent } from '../../utils/analytics';

const TourDetails = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { slug } = useParams();

  const { tour: dynamicTour, loading } = useTour(slug);
  const staticTour = tours.find(t => t.slug === slug) || tours[0];
  const tour = dynamicTour || staticTour;

  useEffect(() => {
    if (tour?.slug) {
      trackEvent('tour_view', { tourSlug: tour.slug });
    }
  }, [tour?.slug]);

  const shuffledTours = [...tours].sort(() => Math.random() - 0.5);

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

  return (
    <div className="w-full bg-obsidian-50 min-h-screen">
      <Helmet>
        <title>{t(`data.${tour.title}`, tour.title)} | {t('site.luxuryTravel', 'Luxury Travel')}</title>
        <meta name="description" content={t(`data.${tour.overview}`, tour.overview).substring(0, 150) + '...'} />
      </Helmet>

      {/* 1. Breadcrumb & Title */}
      <section className="pt-32 pb-10 bg-obsidian-900 text-center px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-2 text-caption text-gold-500 mb-4 uppercase tracking-wider">
            <Link to="/" className="hover:text-ivory-50 transition-colors">{t('nav.home', 'Home')}</Link>
            <span className="rtl-flip"><FaChevronRight className="text-[10px]" /></span>
            <Link to={`/destinations/${tour.destination}`} className="hover:text-ivory-50 transition-colors">
              {t(`data.${tour.destination}`, tour.destination)}
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
              className="text-body-lg text-gold-400 font-medium tracking-wide mb-6"
            >
              {t(`data.${tour.subtitle}`, tour.subtitle)}
            </motion.p>
          )}
        </div>
      </section>

      {/* 2. Photo Gallery */}
      <section className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden group cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
        <motion.img
          src={(tour.images && tour.images[0]) || '/images/tour-1.png'}
          alt={t(`data.${tour.title}`, tour.title)}
          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
          loading="lazy"
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
              <span className="text-body-md font-semibold text-obsidian-900">{tour.market === 'Brasil' ? '2-16' : '2-12'}</span>
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
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-16"
            >
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
                          {day.meals && (
                            <span className="text-caption text-obsidian-400 flex items-center gap-1 ml-auto">
                              <FaBed className="text-gold-500" /> {t(`data.${day.meals}`, day.meals)}
                            </span>
                          )}
                        </div>

                        {day.description && (
                          <p className="text-body-sm text-obsidian-500 leading-relaxed">{t(`data.${day.description}`, day.description)}</p>
                        )}

                        {!day.description && (
                          <div className="space-y-2">
                            {day.morning && (
                              <p className="text-body-sm text-obsidian-500 leading-relaxed">{t(`data.${day.morning}`, day.morning)}</p>
                            )}
                            {day.afternoon && (
                              <p className="text-body-sm text-obsidian-500 leading-relaxed">{t(`data.${day.afternoon}`, day.afternoon)}</p>
                            )}
                            {day.evening && (
                              <p className="text-body-sm text-obsidian-500 leading-relaxed">{t(`data.${day.evening}`, day.evening)}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Pricing Tiers */}
            {tour.pricingTiers && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-16"
              >
                <h2 className="text-display-lg text-obsidian-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('tour.pricingTiers', 'Group Pricing Tiers')}
                </h2>
                <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gold-500/10">
                  <div className="bg-obsidian-900 px-6 py-4 text-ivory-50 font-display font-semibold text-lg tracking-wider">
                    {t('tour.pricingTiers', 'Group Pricing Tiers')}
                  </div>
                  <div className="grid grid-cols-2 bg-obsidian-50 text-obsidian-700 text-sm font-semibold uppercase tracking-wider">
                    <div className="p-4 border-r border-gold-500/10">{t('tour.groupSize', 'Group Size')}</div>
                    <div className="p-4 text-center">{t('tour.pricePerPerson', 'Price Per Person')}</div>
                  </div>
                  {tour.pricingTiers.map((tier, idx) => (
                    <div key={idx} className={`grid grid-cols-2 border-b border-gold-500/10 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-obsidian-50/30'}`}>
                      <div className="p-4 border-r border-gold-500/10 font-medium text-obsidian-900 flex items-center">
                        {tier.minPax === tier.maxPax ? `${tier.minPax} Pax` : `${tier.minPax} - ${tier.maxPax} Pax`}
                      </div>
                      <div className="p-4 text-center font-bold text-gold-700">
                        {formatPrice(tier.pricePerPax)}
                      </div>
                    </div>
                  ))}
                  {tour.optionalExcursionsPricing && (
                    <div className="p-6 bg-obsidian-50/50 border-t border-gold-500/10 text-body-sm text-obsidian-500">
                      * {t('tour.excursionsCurrency', 'Optional excursions are priced in')} {tour.optionalExcursionsPricing.currency}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Accommodation Table */}
            {tour.accommodation && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-16"
              >
                <div className="mb-8">
                  <span className="text-caption text-gold-500 uppercase tracking-widest font-semibold block mb-2">
                    {t('tour.accommodation', 'ALOJAMIENTO')}
                  </span>
                  <h2 className="text-display-md text-3xl text-obsidian-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t('dest.greece.accTitle', 'Resumen de Alojamientos')}
                  </h2>
                </div>
                <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gold-500/10">
                  <div className="grid grid-cols-3 bg-obsidian-900 text-ivory-50 text-xs md:text-sm font-semibold uppercase tracking-wider">
                    <div className="p-4 border-r border-ivory-50/10">{t('tour.destination', 'Destino')}</div>
                    <div className="p-4 border-r border-ivory-50/10 text-center">{t('tour.nights', 'Noches')}</div>
                    <div className="p-4 text-center">{t('tour.regime', 'Régimen')}</div>
                  </div>
                  {tour.accommodation.map((row, idx) => (
                    <div
                      key={idx}
                      className={`grid grid-cols-3 border-b border-gold-500/10 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-obsidian-50/50'}`}
                    >
                      <div className="p-4 border-r border-gold-500/10 font-semibold text-obsidian-900 flex items-center gap-2 text-sm md:text-base">
                        <FaMapMarkerAlt className="text-gold-500 flex-shrink-0" />
                        {t(`data.${row.destination}`, row.destination)}
                      </div>
                      <div className="p-4 border-r border-gold-500/10 text-center font-bold text-gold-700 text-base md:text-lg">
                        {row.nights}
                      </div>
                      <div className="p-4 text-center text-obsidian-700 flex items-center justify-center gap-2 text-sm md:text-base">
                        <FaBed className="text-gold-500 flex-shrink-0" />
                        {t(`data.${row.regime}`, row.regime)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>

          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <div>
              <BookingForm tourId={tour.id} tourTitle={tour.title} />
            </div>
          </div>

        </div>

        <div className="relative mt-24 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian-50 via-gold-50/30 to-obsidian-50 rounded-3xl"></div>
          <div className="relative z-10 px-4 md:px-12 py-16">

            {/* Included / Excluded */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="mt-16 max-w-4xl mx-auto"
            >
              <div className={`grid grid-cols-1 md:grid-cols-${tour.excursions && tour.excursions.length > 0 ? '3' : '2'} gap-8`}>
                <div>
                  <h3 className="text-display-md text-2xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {tour.included && tour.included.length > 0 ? (tour.inclusionsTitle ? t(`data.${tour.inclusionsTitle}`, tour.inclusionsTitle) : t('tourDetail.included', 'What is Included')) : ''}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {tour.included && tour.included.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-body-md text-obsidian-700">
                        <FaCheck className="text-sage-500 mt-1 flex-shrink-0" />
                        <span>{t(`data.${item}`, item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-display-md text-2xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {tour.excluded && tour.excluded.length > 0 ? (tour.exclusionsTitle ? t(`data.${tour.exclusionsTitle}`, tour.exclusionsTitle) : t('tourDetail.excluded', 'What is Excluded')) : ''}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {tour.excluded && tour.excluded.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-body-md text-obsidian-700">
                        <FaTimes className="text-red-400 mt-1 flex-shrink-0" />
                        <span>{t(`data.${item}`, item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {tour.excursions && tour.excursions.length > 0 && (
                  <div>
                    <h3 className="text-display-md text-2xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {t('tour.optionalExcursions', 'Optional Excursions')}
                    </h3>
                    <ul className="flex flex-col gap-3">
                      {tour.excursions.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-body-md text-obsidian-700">
                          <FaCheck className="text-gold-500 mt-1 flex-shrink-0" />
                          <span>{t(`data.${item}`, item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Hotels */}
            {tour.hotels && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-16"
              >
                <div className="mb-8">
                  <span className="text-caption text-gold-500 uppercase tracking-widest font-semibold block mb-2">
                    {t('tour.hotelCategory', 'CATEGORÍA')} — {t(`data.${tour.hotelCategory}`, tour.hotelCategory)}
                  </span>
                  <h2 className="text-display-md text-3xl text-obsidian-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t('dest.greece.hotelsTitle', 'Hoteles de Primera Clase')}
                  </h2>
                  <p className="text-body-md text-obsidian-500 mt-2">
                    {t('dest.greece.hotelsDesc', 'En función de la disponibilidad, alojamiento en uno de los siguientes hoteles de primera clase en cada destino.')}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(tour.hotels).map(([city, hotelList]) => (
                    <div
                      key={city}
                      className="bg-white rounded-2xl shadow-card border border-gold-500/10 overflow-hidden"
                    >
                      <div className="bg-obsidian-900 px-4 py-3">
                        <h3 className="text-gold-500 font-semibold text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
                          <FaMapMarkerAlt className="flex-shrink-0 text-xs" />
                          {t(`data.${city}`, city)}
                        </h3>
                      </div>
                      <ul className="p-4 flex flex-col gap-1.5">
                        {Array.isArray(hotelList) && hotelList.map((hotel, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-body-sm text-obsidian-700 py-1 border-b border-gold-500/5 last:border-0"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                            {t(`data.${hotel}`, hotel)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </section>

      {/* Related Tours */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-display-lg text-obsidian-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
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

    </div>
  );
};

export default TourDetails;
