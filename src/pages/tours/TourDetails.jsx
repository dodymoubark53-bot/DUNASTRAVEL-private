import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronRight, FaClock, FaTag,
  FaCheck, FaTimes, FaMapMarkerAlt, FaBed, FaCheckCircle, FaUsers
} from 'react-icons/fa';
import { fadeInUp } from '../../animations/variants';
import BookingForm from '../../components/booking/BookingForm';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import { useCurrency } from '../../context/CurrencyContext';

import { useTour } from '../../hooks/useTour';
import { trackEvent } from '../../utils/analytics';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ErrorState from '../../components/ui/ErrorState';
import { resolveTourTitle, resolveTourDuration, resolveTourOverview, resolveLocalizedText } from '../../utils/titleHelper';
import { getTourDestinationSlug, getDestinationName, getDestinationUrl } from '../../utils/destinationHelper';

import SEOHead from '../../components/seo/SEOHead';
import ReviewsMap from '../../components/tour/ReviewsMap';
import RouteMap from '../../components/tour/RouteMap';
import SuggestedTours from '../../components/tour/SuggestedTours';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';

const TourDetails = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const { formatPrice } = useCurrency();
  const params = useParams();
  const rawSlug = params.slug || params['*'] || params.programId || params.id;
  const slug = rawSlug ? String(rawSlug).trim() : 'complete-egypt-8d';

  const { tour, loading, error } = useTour(slug);

  useEffect(() => {
    if (tour?.slug) {
      trackEvent('tour_view', { tourSlug: tour.slug });
    }
  }, [tour?.slug]);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (loading) {
    return (
      <div className="w-full bg-obsidian-50 dark:bg-[#0f0f1a] min-h-screen pt-32 px-6 container mx-auto">
        <SkeletonLoader count={1} type="card" />
      </div>
    );
  }

  if (error || !tour) {
    const errorMessage = typeof error === 'object' && error !== null
      ? (error.message || String(error))
      : (error || t('tour.notFoundDesc', 'We could not find the requested luxury tour.'));

    return (
      <div className="w-full bg-obsidian-50 dark:bg-[#0f0f1a] min-h-screen pt-32 px-6 container mx-auto">
        <ErrorState
          title={t('common.errorOccurred', 'Tour not found')}
          message={errorMessage}
          actionLabel={t('tour.browseAll', 'Browse Tours')}
          actionLink="/tours"
        />
      </div>
    );
  }

  const title = resolveTourTitle(tour, t, lang);
  const overview = resolveTourOverview(tour, t, lang);
  const duration = resolveTourDuration(tour, t, lang);
  const tourImages = Array.isArray(tour?.images) ? tour.images : [];
  const heroImg = tourImages[0] || tour?.heroImage || null;

  const tourSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: title,
    description: overview,
    touristType: 'Luxury Travelers',
    ...(heroImg ? { image: heroImg } : {}),
    offers: {
      '@type': 'Offer',
      price: tour.basePriceUsd,
      priceCurrency: tour.currency,
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'Dunas Travel',
      url: 'https://dunastravel.com',
    },
  };

  const destinationSlug = getTourDestinationSlug(tour);
  const destinationName = getDestinationName(destinationSlug, t, lang);
  const destinationUrl = getDestinationUrl(destinationSlug);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dunastravel.com/' },
      { '@type': 'ListItem', position: 2, name: destinationName, item: `https://dunastravel.com${destinationUrl}` },
      { '@type': 'ListItem', position: 3, name: title, item: `https://dunastravel.com/tours/${tour.slug}` },
    ],
  };

  return (
    <div className="w-full bg-obsidian-50 dark:bg-[#0f0f1a] min-h-screen text-start">
      <SEOHead
        title={title}
        description={overview}
        ogImage={heroImg}
        ogType="product"
        schema={[tourSchema, breadcrumbSchema]}
      />

      {/* Luxury Destination-Style Hero Section */}
      <LuxuryHeroSection
        badge={resolveLocalizedText(tour.type || tour.category, t, lang) || t('tour.luxuryExperience', 'رحلة سياحية فاخرة')}
        title={title}
        subtitle={duration}
        bgImage={heroImg}
        zoomDuration={6}
        zoomScale={1.25}
        ease="easeInOut"
        onImageClick={() => setIsLightboxOpen(true)}
        breadcrumbs={
          <div className="flex flex-wrap items-center justify-center gap-2 text-caption text-gold-400 mb-2 tracking-wider text-xs md:text-sm font-semibold">
            <Link to="/" className="hover:text-ivory-50 transition-colors">{t('nav.home', 'Home')}</Link>
            <span className="rtl-flip"><FaChevronRight className="text-[10px]" /></span>
            <Link to={destinationUrl} className="hover:text-ivory-50 transition-colors">
              {destinationName}
            </Link>
            <span className="rtl-flip"><FaChevronRight className="text-[10px]" /></span>
            <span className="text-ivory-300">{title}</span>
          </div>
        }
        primaryCta={null}
        secondaryCta={null}
      />

      {/* 3. Quick Info Bar */}
      <div className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-ivory-50 dark:bg-[#1a1a30] rounded-2xl shadow-card overflow-hidden border border-obsidian-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-x rtl:divide-x-reverse divide-gray-100 dark:divide-gray-800 bg-obsidian-50 dark:bg-[#1a1a30]">
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaClock className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 dark:text-ivory-400 uppercase">{t('tour.duration', 'Duration')}</span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-50">{duration}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaTag className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 dark:text-ivory-400 uppercase">{t('tour.tourType', 'Tour Type')}</span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-50">{resolveLocalizedText(tour.type || tour.category || 'City Break', t, lang)}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaUsers className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 dark:text-ivory-400 uppercase">{t('tour.minPax', 'Min Pax')}</span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-50">{resolveLocalizedText(tour.minPax, t, lang) || '2 Pax'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Content Section */}
      <section className="container mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

          <div className="lg:col-span-2">

            {/* Overview */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('tourDetail.overview', 'Overview')}
              </h2>
              <p className="text-body-lg text-obsidian-600 dark:text-ivory-300 leading-relaxed">{overview}</p>
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
                <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('tourDetail.highlights', 'Key Highlights')}
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-ivory-50 dark:bg-[#1a1a30] p-4 rounded-xl shadow-sm border border-gold-500/10 dark:border-gray-700">
                      <FaCheckCircle className="text-gold-500 mt-1 shrink-0" />
                      <span className="text-body-sm text-obsidian-700 dark:text-ivory-200">{resolveLocalizedText(highlight, t, lang)}</span>
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
                <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('tourDetail.itinerary', 'Itinerary')}
                </h2>
                <div className="w-24 h-1 bg-gold-500 mx-auto mt-3"></div>
              </div>

              <div className="relative max-w-full">
                <div className="absolute left-[1.1rem] rtl:left-auto rtl:right-[1.1rem] top-0 bottom-0 w-1 bg-gold-400"></div>
                <div className="space-y-6">
                  {tour.itinerary && tour.itinerary.map((day) => (
                    <div key={day.day} className="relative pl-10 rtl:pl-0 rtl:pr-10 md:pl-12 md:rtl:pr-12">
                      <div className="absolute left-[0.1rem] rtl:left-auto rtl:right-[0.1rem] top-1 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                        {day.day}
                      </div>

                      <div className="bg-ivory-50 dark:bg-[#1a1a30] rounded-2xl p-6 shadow-sm border border-gold-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-semibold text-obsidian-900 dark:text-ivory-50">{t('tour.day', 'Day')} {day.day}</span>
                          {day.title && (
                            <span className="text-body-sm text-obsidian-600 dark:text-ivory-300">{resolveLocalizedText(day.title, t, lang)}</span>
                          )}
                          {day.meals && (
                            <span className="text-caption text-obsidian-400 dark:text-ivory-400 flex items-center gap-1 ml-auto rtl:ml-0 rtl:mr-auto">
                              <FaBed className="text-gold-500" /> {resolveLocalizedText(day.meals, t, lang)}
                            </span>
                          )}
                        </div>

                        {day.description && (
                          <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 leading-relaxed">{resolveLocalizedText(day.description, t, lang)}</p>
                        )}

                        {!day.description && (
                          <div className="space-y-2">
                            {day.morning && (
                              <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 leading-relaxed">{resolveLocalizedText(day.morning, t, lang)}</p>
                            )}
                            {day.afternoon && (
                              <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 leading-relaxed">{resolveLocalizedText(day.afternoon, t, lang)}</p>
                            )}
                            {day.evening && (
                              <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 leading-relaxed">{resolveLocalizedText(day.evening, t, lang)}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Inclusions & Exclusions Section */}
            {((tour.included && tour.included.length > 0) || (tour.excluded && tour.excluded.length > 0)) && (
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
                  <h2 className="text-display-lg text-2xl md:text-3xl text-obsidian-900 dark:text-ivory-50 font-display font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t('tourDetail.incExc', "What's Included & Excluded")}
                  </h2>
                  <div className="w-20 h-1 bg-gold-500 mt-3 rounded-full" />
                </div>

                <div className={`grid grid-cols-1 ${tour.excursions && tour.excursions.length > 0 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
                  {/* What is Included */}
                  {tour.included && tour.included.length > 0 && (
                    <div className="bg-emerald-50/80 dark:bg-emerald-950/25 p-6 md:p-8 rounded-2xl border border-emerald-200/80 dark:border-emerald-800/40 shadow-sm">
                      <h3 className="text-display-md text-xl font-bold text-emerald-950 dark:text-emerald-300 mb-6 flex items-center gap-2.5 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <FaCheckCircle className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        {tour.inclusionsTitle ? resolveLocalizedText(tour.inclusionsTitle, t, lang) : t('tourDetail.included', 'What is Included')}
                      </h3>
                      <ul className="flex flex-col gap-3.5">
                        {tour.included.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-body-md text-emerald-900 dark:text-emerald-100">
                            <FaCheck className="text-emerald-600 dark:text-emerald-400 mt-1 flex-shrink-0 text-sm" />
                            <span className="leading-relaxed">{resolveLocalizedText(item, t, lang)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* What is Excluded */}
                  {tour.excluded && tour.excluded.length > 0 && (
                    <div className="bg-rose-50/80 dark:bg-rose-950/25 p-6 md:p-8 rounded-2xl border border-rose-200/80 dark:border-rose-800/40 shadow-sm">
                      <h3 className="text-display-md text-xl font-bold text-rose-950 dark:text-rose-300 mb-6 flex items-center gap-2.5 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <FaTimes className="text-rose-600 dark:text-rose-400 flex-shrink-0" />
                        {tour.exclusionsTitle ? resolveLocalizedText(tour.exclusionsTitle, t, lang) : t('tourDetail.excluded', 'What is Excluded')}
                      </h3>
                      <ul className="flex flex-col gap-3.5">
                        {tour.excluded.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-body-md text-rose-900 dark:text-rose-100">
                            <FaTimes className="text-rose-500 dark:text-rose-400 mt-1 flex-shrink-0 text-sm" />
                            <span className="leading-relaxed">{resolveLocalizedText(item, t, lang)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optional Excursions */}
                  {tour.excursions && tour.excursions.length > 0 && (
                    <div className="bg-gold-50/80 dark:bg-gold-950/25 p-6 md:p-8 rounded-2xl border border-gold-200/80 dark:border-gold-800/40 shadow-sm">
                      <h3 className="text-display-md text-xl font-bold text-gold-950 dark:text-gold-300 mb-6 flex items-center gap-2.5 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                        <FaCheckCircle className="text-gold-600 dark:text-gold-400 flex-shrink-0" />
                        {t('tour.optionalExcursions', 'Optional Excursions')}
                      </h3>
                      <ul className="flex flex-col gap-3.5">
                        {tour.excursions.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-body-md text-gold-950 dark:text-gold-100">
                            <FaCheck className="text-gold-500 mt-1 flex-shrink-0 text-sm" />
                            <span className="leading-relaxed">{resolveLocalizedText(item, t, lang)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}



            {/* Interactive Route Map */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="mt-16">
                <RouteMap itinerary={tour.itinerary} tourTitle={title} />
              </div>
            )}

          </div>

          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <BookingForm tourId={tour.id} tourSlug={tour.slug} tourTitle={title} initialPrice={tour.basePriceUsd || tour.price} />
            </div>
          </div>

        </div>

        {/* Hotels Section */}
        {tour.hotels && (
          <div className="relative mt-20 mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian-50 via-gold-50/20 to-obsidian-50 dark:from-[#0f0f1a] dark:via-[#1a1a30] dark:to-[#0f0f1a] rounded-3xl"></div>
            <div className="relative z-10 px-4 md:px-12 py-16">

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
                      {t('tour.hotelCategory', 'CATEGORÍA')} — {resolveLocalizedText(tour.hotelCategory, t, lang)}
                    </span>
                    <h2 className="text-display-md text-3xl text-obsidian-900 dark:text-ivory-50" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {t('dest.greece.hotelsTitle', 'Hoteles de Primera Clase')}
                    </h2>
                    <p className="text-body-md text-obsidian-500 dark:text-ivory-300 mt-2">
                      {t('dest.greece.hotelsDesc', 'En función de la disponibilidad, alojamiento en uno de los siguientes hoteles de primera clase en cada destino.')}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(tour.hotels).map(([city, hotelList]) => (
                      <div
                        key={city}
                        className="bg-white dark:bg-[#1a1a30] rounded-2xl shadow-card border border-gold-500/10 dark:border-gray-700 overflow-hidden"
                      >
                        <div className="bg-obsidian-900 px-4 py-3">
                          <h3 className="text-gold-500 font-semibold text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
                            <FaMapMarkerAlt className="flex-shrink-0 text-xs" />
                            {resolveLocalizedText(city, t, lang)}
                          </h3>
                        </div>
                        <ul className="p-4 flex flex-col gap-1.5">
                          {Array.isArray(hotelList) && hotelList.map((hotel, idx) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-body-sm text-obsidian-700 dark:text-ivory-200 py-1 border-b border-gold-500/5 dark:border-gray-800 last:border-0"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                              {resolveLocalizedText(hotel, t, lang)}
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
        )}
      </section>

      {tour?.slug && <ReviewsMap tourId={tour.slug} />}

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
            <img src={heroImg} alt={title} className="max-w-[90vw] max-h-[90vh] object-contain" onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggested Tours Strip */}
      <SuggestedTours currentDestination={tour?.destination || 'egypt'} currentSlug={slug} />
    </div>
  );
};

export default TourDetails;
