import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronRight, FaChevronLeft, FaClock, FaTag,
  FaMapMarkerAlt, FaBed, FaCheckCircle, FaUsers, FaStar,
  FaGlobeAmericas, FaShieldAlt,
  FaTimes, FaExternalLinkAlt, FaHeart, FaRegHeart,
  FaTrain, FaBus, FaExclamationTriangle
} from 'react-icons/fa';
import { fadeInUp } from '../../animations/variants';
import BookingForm from '../../components/booking/BookingForm';
import { useCurrency } from '../../context/CurrencyContext';
import { useTour } from '../../hooks/useTour';
import { useWishlist } from '../../hooks/useWishlist';
import { trackEvent } from '../../utils/analytics';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ErrorState from '../../components/ui/ErrorState';
import { resolveTourTitle, resolveTourDuration, resolveTourOverview, resolveLocalizedText, resolveItineraryDayTitle } from '../../utils/titleHelper';
import SEOHead from '../../components/seo/SEOHead';
import SuggestedTours from '../../components/tour/SuggestedTours';
import IncludedNotIncluded from '../../components/tour/IncludedNotIncluded';

const ReviewsMap = lazy(() => import('../../components/tour/ReviewsMap'));
const RouteMap = lazy(() => import('../../components/tour/RouteMap'));

const marketFlag = (market) => {
  const flags = { Brasil: '🇧🇷', Italia: '🇮🇹', Spain: '🇪🇸', Portugal: '🇵🇹', USA: '🇺🇸', UK: '🇬🇧' };
  return flags[market] ?? '🌍';
};

/**
 * Tours that require the customer to choose a transport method (Train vs Bus)
 * BEFORE completing their booking. Only these two Turkey-route tours use this feature.
 */
const TRANSPORT_REQUIRED_SLUGS = [
  'reg-01-legendary-turkey',
  'marvels-of-dubai-and-turkey-14-days',
];

const SLUG_ALIASES = {
  'classic': 'complete-egypt-8d',
  'classic-program': 'complete-egypt-8d',
  'honeymoon-in-egypt': 'cairo-cruzeiro-sharm-11d',
  'honeymooners': 'cairo-cruzeiro-sharm-11d',
  'journey-of-the-holy-family-10-days': 'egito-historico-10d',
  'holy-family-in-egypt-and-jordan-14-days': 'mct-004',
  'egypt-jordan-combined-14d': 'jewels-of-egypt-and-jordan-11-days',
  'hurghada-4d3n': 'cairo-cruzeiro-sharm-11d',
  'sharm-4d3n': 'cairo-cruzeiro-sharm-11d',
  'siwa-oasis-alexandria': 'cairo-express-alexandria-5d',
  'siwa-oasis': 'cairo-express-alexandria-5d'
};

const TourDetails = () => {
  const { t, i18n } = useTranslation();
  const { formatPrice } = useCurrency();
  const lang = i18n.language || 'en';
  const params = useParams();
  const rawSlug = params.slug || params.programId || params.id || params['*'];
  const extractedSlug = rawSlug ? String(rawSlug).split('/').filter(Boolean).pop().trim() : '';
  const slug = SLUG_ALIASES[extractedSlug] || extractedSlug || 'complete-egypt-8d';

  const { tour, loading, error, retry } = useTour(slug);
  const { isFavorite, toggleFavorite } = useWishlist();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState(null); // 'train' | 'bus' | null — only for TRANSPORT_REQUIRED_SLUGS


  useEffect(() => {
    if (tour?.slug) {
      trackEvent('tour_view', { tourSlug: tour.slug });
    }
  }, [tour?.slug]);

  useEffect(() => {
    if (!isLightboxOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') setActiveImageIndex((prev) => (prev + 1) % (tour?.galleryImages?.length || 1));
      if (e.key === 'ArrowLeft') setActiveImageIndex((prev) => (prev - 1 + (tour?.galleryImages?.length || 1)) % (tour?.galleryImages?.length || 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, tour?.galleryImages?.length]);

  if (loading) {
    return (
      <div className="w-full bg-obsidian-50 dark:bg-[#0f0f1a] min-h-screen pt-32 px-6 container mx-auto">
        <SkeletonLoader count={1} type="card" />
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="w-full bg-obsidian-50 dark:bg-[#0f0f1a] min-h-screen pt-32 px-6 container mx-auto">
        <ErrorState
          title={t('common.errorOccurred', 'Tour not found')}
          message={error?.message || t('tour.notFoundDesc', 'We could not find the requested luxury tour.')}
          actionLabel={t('common.tryAgain', 'Try again')}
          onRetry={retry}
        />
      </div>
    );
  }

  const title = resolveTourTitle(tour, t, lang);
  const overview = resolveTourOverview(tour, t, lang);
  const duration = resolveTourDuration(tour, t, lang);
  const gallery = tour.galleryImages || [];
  const heroImg = gallery[0]?.imageUrl || tour.heroImage || null;
  const destinationSlug = typeof tour.destination === 'string' && tour.destination.trim()
    ? tour.destination
    : null;
  const destinationLabel = resolveLocalizedText(destinationSlug || tour.country, t, lang)
    || t('tour.destinationNotSpecified', 'Destination not specified');

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
      priceCurrency: tour.currency || 'USD',
      availability: 'https://schema.org/InStock',
    },
    provider: {
      '@type': 'TravelAgency',
      name: 'Dunas Travel',
      url: 'https://dunastravel.com',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dunastravel.com/' },
      ...(destinationSlug ? [{ '@type': 'ListItem', position: 2, name: destinationLabel, item: `https://dunastravel.com/destinations/${destinationSlug}` }] : []),
      { '@type': 'ListItem', position: 3, name: title, item: `https://dunastravel.com/tours/${tour.slug}` },
    ],
  };

  const seasonPricingObj = tour.seasonPricing?.pricing || null;
  const pricingTiers = tour.pricingTiers || [];
  const accommodationList = Array.isArray(tour.accommodation) ? tour.accommodation : [];
  const hotelListMap = tour.hotels && typeof tour.hotels === 'object' ? tour.hotels : null;

  return (
    <div className="w-full bg-obsidian-50 dark:bg-[#0f0f1a] min-h-screen text-start">
      <SEOHead
        title={title}
        description={overview}
        ogImage={heroImg}
        ogType="product"
        schema={[tourSchema, breadcrumbSchema]}
      />

      <section className="pt-32 pb-10 bg-obsidian-900 text-center px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-2 text-caption text-gold-500 mb-4 uppercase tracking-wider">
            <Link to="/" className="hover:text-ivory-50 transition-colors">{t('nav.home', 'Home')}</Link>
            <span className="rtl-flip"><FaChevronRight className="text-[10px]" /></span>
            {destinationSlug ? (
              <Link to={`/destinations/${destinationSlug}`} className="hover:text-ivory-50 transition-colors">
                {destinationLabel}
              </Link>
            ) : <span className="text-ivory-300">{destinationLabel}</span>}
            <span className="rtl-flip"><FaChevronRight className="text-[10px]" /></span>
            <span className="text-ivory-300 truncate max-w-[200px] sm:max-w-none">{title}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display-xl text-ivory-50 mb-4 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </motion.h1>

          {tour.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-body-lg text-gold-400 font-medium tracking-wide mb-6 max-w-3xl mx-auto"
            >
              {resolveLocalizedText(tour.subtitle, t, lang)}
            </motion.p>
          )}
        </div>
      </section>

      <section className="container mx-auto px-6 pt-4">
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-obsidian-900">
          <div
            className="relative h-[45vh] lg:h-[65vh] overflow-hidden group cursor-pointer"
            onClick={() => {
              setActiveImageIndex(0);
              setIsLightboxOpen(true);
            }}
          >
            {heroImg ? (
              <motion.img
                src={heroImg}
                alt={gallery[0]?.altText || title}
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-obsidian-800 px-6 text-center text-ivory-300">
                {t('tour.imageUnavailable', 'No image has been added for this tour.')}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 group-hover:opacity-80 transition-opacity"></div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(tour);
              }}
              aria-label="Toggle wishlist"
              className="absolute top-6 right-6 rtl:right-auto rtl:left-6 z-20 w-11 h-11 rounded-full bg-obsidian-900/80 backdrop-blur-md flex items-center justify-center border border-gold-500/40 text-gold-500 hover:scale-110 transition-all shadow-lg cursor-pointer"
            >
              {isFavorite(tour.id || tour.slug) ? <FaHeart className="text-red-500 text-lg" /> : <FaRegHeart className="text-lg" />}
            </button>
            <div className="absolute bottom-6 right-6 rtl:right-auto rtl:left-6 bg-obsidian-900/85 backdrop-blur-md px-5 py-2.5 rounded-full text-ivory-50 text-caption font-semibold border border-gold-500/30 flex items-center gap-2 shadow-lg">
              <FaExternalLinkAlt className="text-gold-400 text-xs" />
              <span>{t('tour.clickGallery', 'View Gallery')} ({gallery.length || 1})</span>
            </div>
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-2 p-3 bg-obsidian-950/80 backdrop-blur-md overflow-x-auto border-t border-gold-500/10">
              {gallery.slice(0, 6).map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setIsLightboxOpen(true);
                  }}
                  className="relative h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden border border-white/20 hover:border-gold-500 transition-all opacity-80 hover:opacity-100"
                >
                  <img src={img.imageUrl} alt={img.altText || `${title} preview ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-ivory-50 dark:bg-[#1a1a30] rounded-2xl shadow-card overflow-hidden border border-obsidian-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 divide-x rtl:divide-x-reverse divide-gray-100 dark:divide-gray-800 bg-obsidian-50 dark:bg-[#1a1a30]">
            <div className="p-5 flex flex-col items-center justify-center text-center gap-1.5">
              <FaClock className="text-gold-500 text-xl mb-0.5" />
              <span className="text-[11px] text-obsidian-500 dark:text-ivory-400 uppercase tracking-wider">{t('tour.duration', 'Duration')}</span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-50">{duration}</span>
            </div>
            <div className="p-5 flex flex-col items-center justify-center text-center gap-1.5">
              <FaTag className="text-gold-500 text-xl mb-0.5" />
              <span className="text-[11px] text-obsidian-500 dark:text-ivory-400 uppercase tracking-wider">{t('tour.tourType', 'Category')}</span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-50">{resolveLocalizedText(tour.category || tour.type, t, lang) || t('tour.standard', 'Standard')}</span>
            </div>
            <div className="p-5 flex flex-col items-center justify-center text-center gap-1.5">
              <FaUsers className="text-gold-500 text-xl mb-0.5" />
              <span className="text-[11px] text-obsidian-500 dark:text-ivory-400 uppercase tracking-wider">{t('tour.minPax', 'Group Size')}</span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-50">{resolveLocalizedText(tour.minPax, t, lang) || (tour.market === 'Brasil' ? '2-16 Pax' : '2-12 Pax')}</span>
            </div>
            <div className="p-5 flex flex-col items-center justify-center text-center gap-1.5">
              <FaStar className="text-gold-500 text-xl mb-0.5" />
              <span className="text-[11px] text-obsidian-500 dark:text-ivory-400 uppercase tracking-wider">{t('tour.rating', 'Rating')}</span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-50">
                {tour.sourceRating ? `${tour.sourceRating} / 5` : '4.9 / 5'}
                {tour.sourceReviewCount ? <span className="text-xs text-obsidian-400 ml-1">({tour.sourceReviewCount})</span> : null}
              </span>
            </div>
            {tour.difficultyLevel && (
              <div className="p-5 flex flex-col items-center justify-center text-center gap-1.5">
                <FaShieldAlt className="text-gold-500 text-xl mb-0.5" />
                <span className="text-[11px] text-obsidian-500 dark:text-ivory-400 uppercase tracking-wider">{t('tour.difficulty', 'Difficulty')}</span>
                <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-50">{resolveLocalizedText(tour.difficultyLevel, t, lang)}</span>
              </div>
            )}
            <div className="p-5 flex flex-col items-center justify-center text-center gap-1.5">
              <FaGlobeAmericas className="text-gold-500 text-xl mb-0.5" />
              <span className="text-[11px] text-obsidian-500 dark:text-ivory-400 uppercase tracking-wider">{t('tour.languages', 'Languages')}</span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-50 uppercase">
                {Array.isArray(tour.languages) ? tour.languages.join(' · ') : 'EN · ES · PT · IT · AR'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

          <div className="lg:col-span-2 space-y-16">

            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="mb-6">
                <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-widest font-semibold block mb-2">
                  {t('tourDetail.overviewBadge', 'EXCLUSIVE ITINERARY')}
                </span>
                <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('tourDetail.overview', 'Overview')}
                </h2>
              </div>
              <p className="text-body-lg text-obsidian-600 dark:text-ivory-300 leading-relaxed whitespace-pre-line">
                {overview}
              </p>
            </motion.div>

            {Array.isArray(tour.highlights) && tour.highlights.length > 0 && (
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="mb-6">
                  <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-widest font-semibold block mb-2">
                    {t('tourDetail.highlightsBadge', 'UNFORGETTABLE MOMENTS')}
                  </span>
                  <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t('tourDetail.highlights', 'Key Highlights')}
                  </h2>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-ivory-50 dark:bg-[#1a1a30] p-4 rounded-xl shadow-sm border border-gold-500/10 dark:border-gray-700">
                      <FaCheckCircle className="text-gold-500 mt-1 shrink-0 text-base" />
                      <span className="text-body-sm text-obsidian-700 dark:text-ivory-200">{resolveLocalizedText(highlight, t, lang)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="mb-10 text-center md:text-start">
                <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-[4px] font-semibold block mb-3">
                  {t('tour.journeyDayByDay', 'YOUR JOURNEY DAY BY DAY')}
                </span>
                <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('tourDetail.itinerary', 'Detailed Itinerary')}
                </h2>
                <div className="w-24 h-1 bg-gold-500 mt-3 md:mx-0 mx-auto"></div>
              </div>

              <div className="relative max-w-full">
                <div className="absolute left-[1.1rem] rtl:left-auto rtl:right-[1.1rem] top-0 bottom-0 w-1 bg-gold-400/60 dark:bg-gold-500/40"></div>
                <div className="space-y-6">
                  {tour.itinerary && tour.itinerary.map((day) => (
                    <div key={day.id || day.day} className="relative pl-10 rtl:pl-0 rtl:pr-10 md:pl-12 md:rtl:pr-12">
                      <div className="absolute left-[0.1rem] rtl:left-auto rtl:right-[0.1rem] top-1 w-8 h-8 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center text-sm font-bold shadow-md z-10">
                        {day.day}
                      </div>

                      <div className="bg-ivory-50 dark:bg-[#1a1a30] rounded-2xl p-6 shadow-sm border border-gold-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-gold-500/10 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-obsidian-900 dark:text-ivory-50 text-base">{t('tour.day', 'Day')} {day.day}</span>
                            {day.title && (
                              <span className="text-body-sm font-semibold text-gold-700 dark:text-gold-400">{resolveItineraryDayTitle(day, t, lang)}</span>
                            )}
                          </div>
                          {day.meals && (
                            <span className="text-caption text-obsidian-500 dark:text-ivory-300 flex items-center gap-1.5 bg-gold-500/10 px-3 py-1 rounded-full border border-gold-500/20">
                              <FaBed className="text-gold-500 text-xs" />
                              <span>{resolveLocalizedText(day.meals, t, lang)}</span>
                            </span>
                          )}
                        </div>

                        {day.description && (
                          <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 leading-relaxed whitespace-pre-line">
                            {resolveLocalizedText(day.description, t, lang)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <IncludedNotIncluded
              includedItems={tour.included}
              excludedItems={tour.excluded}
              excursionsItems={tour.excursions}
              inclusionsTitle={t('tourDetail.included', 'What is Included')}
              exclusionsTitle={t('tourDetail.excluded', 'What is Not Included')}
              excursionsTitle={t('tour.optionalExcursions', 'Optional Excursions')}
            />

            {tour.itinerary && tour.itinerary.length > 0 && (
              <Suspense fallback={<div className="h-80 rounded-2xl bg-obsidian-200/40 dark:bg-obsidian-800/40 animate-pulse my-8" />}>
                <RouteMap itinerary={tour.itinerary} />
              </Suspense>
            )}

            {(seasonPricingObj || pricingTiers.length > 0) && (
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="mb-6">
                  <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-widest font-semibold block mb-2">
                    {t('tour.pricingScheduleBadge', 'TRANSPARENT TARIFFS')}
                  </span>
                  <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t('tour.seasonPricingTitle', 'Seasonal Rates & Pricing Tiers')}
                  </h2>
                </div>

                {seasonPricingObj && (
                  <div className="bg-white dark:bg-[#1a1a30] rounded-2xl shadow-card overflow-hidden border border-gold-500/20 mb-8">
                    <div className="bg-obsidian-900 px-6 py-4 text-ivory-50 font-display font-semibold text-lg flex items-center justify-between">
                      <span>{t('tour.seasonalRates', 'Official Seasonal Rates')}</span>
                      <span className="text-xs text-gold-400 uppercase tracking-wider font-sans">{tour.currency || 'USD'}</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left rtl:text-right border-collapse text-sm">
                        <thead>
                          <tr className="bg-obsidian-50 dark:bg-obsidian-900/60 text-obsidian-700 dark:text-ivory-300 border-b border-gold-500/10 font-semibold uppercase text-xs">
                            <th className="p-4 border-r border-gold-500/10">{t('tour.hotelCategory', 'Hotel Category')}</th>
                            <th className="p-4 border-r border-gold-500/10 text-center">
                              <div>{t('tour.summerSeason', 'Summer Season')}</div>
                              {seasonPricingObj.summerDates && (
                                <div className="text-[10px] text-gold-600 font-normal mt-0.5">{seasonPricingObj.summerDates}</div>
                              )}
                            </th>
                            <th className="p-4 text-center">
                              <div>{t('tour.winterSeason', 'Winter Season')}</div>
                              {seasonPricingObj.winterDates && (
                                <div className="text-[10px] text-gold-600 font-normal mt-0.5">{seasonPricingObj.winterDates}</div>
                              )}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(seasonPricingObj.hotels) && seasonPricingObj.hotels.map((hotelName, idx) => {
                            const summerRate = seasonPricingObj.summer?.[idx];
                            const winterRate = seasonPricingObj.winter?.[idx];
                            return (
                              <tr key={idx} className={`border-b border-gold-500/10 last:border-0 ${idx % 2 === 0 ? 'bg-white dark:bg-[#1a1a30]' : 'bg-obsidian-50/40 dark:bg-[#151528]'}`}>
                                <td className="p-4 border-r border-gold-500/10 font-semibold text-obsidian-900 dark:text-ivory-50">
                                  {hotelName}
                                </td>
                                <td className="p-4 border-r border-gold-500/10 text-center text-obsidian-800 dark:text-ivory-200">
                                  {summerRate ? (
                                    <div className="flex justify-center gap-4">
                                      <span><strong className="text-gold-600">DBL:</strong> {formatPrice(summerRate.dbl)}</span>
                                      {summerRate.sgl ? <span><strong className="text-gold-600">SGL:</strong> {formatPrice(summerRate.sgl)}</span> : null}
                                    </div>
                                  ) : '—'}
                                </td>
                                <td className="p-4 text-center text-obsidian-800 dark:text-ivory-200">
                                  {winterRate ? (
                                    <div className="flex justify-center gap-4">
                                      <span><strong className="text-gold-600">DBL:</strong> {formatPrice(winterRate.dbl)}</span>
                                      {winterRate.sgl ? <span><strong className="text-gold-600">SGL:</strong> {formatPrice(winterRate.sgl)}</span> : null}
                                    </div>
                                  ) : '—'}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {pricingTiers.length > 0 && (
                  <div className="bg-white dark:bg-[#1a1a30] rounded-2xl shadow-card overflow-hidden border border-gold-500/20">
                    <div className="bg-obsidian-900 px-6 py-4 text-ivory-50 font-display font-semibold text-lg">
                      {t('tour.pricingTiers', 'Group Volume Pricing Tiers')}
                    </div>
                    <div className="grid grid-cols-2 bg-obsidian-50 dark:bg-obsidian-900/60 text-obsidian-700 dark:text-ivory-300 text-xs font-semibold uppercase tracking-wider border-b border-gold-500/10">
                      <div className="p-4 border-r border-gold-500/10">{t('tour.groupSize', 'Group Size')}</div>
                      <div className="p-4 text-center">{t('tour.pricePerPerson', 'Price Per Person')}</div>
                    </div>
                    {pricingTiers.map((tier, idx) => (
                      <div key={idx} className={`grid grid-cols-2 border-b border-gold-500/10 last:border-0 ${idx % 2 === 0 ? 'bg-white dark:bg-[#1a1a30]' : 'bg-obsidian-50/30 dark:bg-[#151528]'}`}>
                        <div className="p-4 border-r border-gold-500/10 font-medium text-obsidian-900 dark:text-ivory-100 flex items-center">
                          {tier.minPax === tier.maxPax ? `${tier.minPax} Pax` : `${tier.minPax} - ${tier.maxPax} Pax`}
                        </div>
                        <div className="p-4 text-center font-bold text-gold-600 dark:text-gold-400">
                          {formatPrice(tier.pricePerPax || tier.price)}
                        </div>
                      </div>
                    ))}
                    {tour.optionalExcursionsPricing && (
                      <div className="p-4 bg-obsidian-50/50 dark:bg-obsidian-950/40 border-t border-gold-500/10 text-body-sm text-obsidian-500 dark:text-ivory-400">
                        * {t('tour.excursionsCurrency', 'Optional excursions are priced in')} {tour.optionalExcursionsPricing.currency || 'USD'}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {(accommodationList.length > 0 || hotelListMap) && (
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="mb-6">
                  <span className="text-caption text-gold-600 dark:text-gold-400 uppercase tracking-widest font-semibold block mb-2">
                    {tour.hotelCategory ? `${t('tour.category', 'CATEGORY')} — ${resolveLocalizedText(tour.hotelCategory, t, lang)}` : t('tour.accommodationBadge', 'LUXURY STAYS')}
                  </span>
                  <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t('tour.accommodationTitle', 'Accommodation Schedule & Hotels')}
                  </h2>
                </div>

                {accommodationList.length > 0 && (
                  <div className="bg-white dark:bg-[#1a1a30] rounded-2xl shadow-card overflow-hidden border border-gold-500/20 mb-8">
                    <div className="grid grid-cols-3 bg-obsidian-900 text-ivory-50 text-xs md:text-sm font-semibold uppercase tracking-wider">
                      <div className="p-4 border-r border-ivory-50/10">{t('tour.destination', 'Destination')}</div>
                      <div className="p-4 border-r border-ivory-50/10 text-center">{t('tour.nights', 'Nights')}</div>
                      <div className="p-4 text-center">{t('tour.regime', 'Meal Plan / Board')}</div>
                    </div>
                    {accommodationList.map((row, idx) => (
                      <div key={idx} className={`grid grid-cols-3 border-b border-gold-500/10 last:border-0 ${idx % 2 === 0 ? 'bg-white dark:bg-[#1a1a30]' : 'bg-obsidian-50/50 dark:bg-[#151528]'}`}>
                        <div className="p-4 border-r border-gold-500/10 font-semibold text-obsidian-900 dark:text-ivory-50 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gold-500 flex-shrink-0" />
                          <span>{resolveLocalizedText(row.destination, t, lang)}</span>
                        </div>
                        <div className="p-4 border-r border-gold-500/10 text-center font-bold text-gold-600 dark:text-gold-400 text-base md:text-lg">
                          {row.nights}
                        </div>
                        <div className="p-4 text-center text-obsidian-700 dark:text-ivory-200 flex items-center justify-center gap-2">
                          <FaBed className="text-gold-500 flex-shrink-0" />
                          <span>{resolveLocalizedText(row.regime, t, lang)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {hotelListMap && Object.keys(hotelListMap).length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(hotelListMap).map(([city, hotelList]) => (
                      <div key={city} className="bg-white dark:bg-[#1a1a30] rounded-2xl shadow-card border border-gold-500/15 overflow-hidden">
                        <div className="bg-obsidian-900 px-5 py-3 flex items-center gap-2">
                          <FaMapMarkerAlt className="text-gold-400 text-sm flex-shrink-0" />
                          <h3 className="text-gold-400 font-semibold text-xs md:text-sm uppercase tracking-widest">
                            {resolveLocalizedText(city, t, lang)}
                          </h3>
                        </div>
                        <ul className="p-4 flex flex-col gap-2">
                          {Array.isArray(hotelList) && hotelList.map((hotel, hIdx) => (
                            <li key={hIdx} className="flex items-center gap-2.5 text-body-sm text-obsidian-700 dark:text-ivory-200 py-1 border-b border-gold-500/5 last:border-0">
                              <span className="w-2 h-2 rounded-full bg-gold-500 flex-shrink-0" />
                              <span>{resolveLocalizedText(hotel, t, lang)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </div>

          <div className="lg:col-span-1 sticky top-28 space-y-6">
            {/* ── Transport Selector (Turkey tours only) ── */}
            {TRANSPORT_REQUIRED_SLUGS.includes(slug) && (
              <motion.div
                id="transport-selector"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-ivory-50 dark:bg-[#1a1a30] rounded-2xl shadow-sm border border-obsidian-200 dark:border-gray-700 p-6 text-left rtl:text-right"
              >
                <h3 className="text-display-md text-obsidian-900 dark:text-ivory-50 mb-1 font-display font-semibold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  🚄 {t('tour.transportOrBus', 'High-Speed Train or Bus')} 🚌
                </h3>
                <p className="text-body-sm text-obsidian-500 dark:text-ivory-400 mb-5">
                  {t('tour.chooseTransport', 'Choose your preferred transport between Istanbul and Ankara')}
                </p>

                {/* Validation warning */}
                {selectedTransport === null && (
                  <div className="mb-4 flex items-center gap-2 text-[12px] text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3.5 py-2.5">
                    <FaExclamationTriangle className="shrink-0 text-amber-500" />
                    <span>{t('booking.transportRequired', 'Please select a transport option before booking.')}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {/* Train Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedTransport('train')}
                    className={`relative w-full text-center p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer group ${
                      selectedTransport === 'train'
                        ? 'border-gold-500 bg-gold-500/10 shadow-[0_0_20px_rgba(201,162,39,0.2)]'
                        : 'border-obsidian-200 dark:border-gray-700 bg-white dark:bg-[#12121f] hover:border-gold-500/50 hover:bg-gold-500/5'
                    }`}
                  >
                    <div className="text-4xl mb-3">🚄</div>
                    <p className="font-semibold text-obsidian-900 dark:text-ivory-50 text-base font-display">
                      {t('tour.highSpeedTrain', 'High-Speed Train')}
                    </p>
                    <p className="text-body-sm text-obsidian-500 dark:text-ivory-400 mt-1">
                      ~{t('tour.trainDuration', '4 hours')}
                    </p>
                    {selectedTransport === 'train' && (
                      <span className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                        <FaCheckCircle className="text-obsidian-900 text-[10px]" />
                      </span>
                    )}
                  </button>

                  {/* Bus Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedTransport('bus')}
                    className={`relative w-full text-center p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer group ${
                      selectedTransport === 'bus'
                        ? 'border-gold-500 bg-gold-500/10 shadow-[0_0_20px_rgba(201,162,39,0.2)]'
                        : 'border-obsidian-200 dark:border-gray-700 bg-white dark:bg-[#12121f] hover:border-gold-500/50 hover:bg-gold-500/5'
                    }`}
                  >
                    <div className="text-4xl mb-3">🚌</div>
                    <p className="font-semibold text-obsidian-900 dark:text-ivory-50 text-base font-display">
                      {t('tour.bus', 'Bus')}
                    </p>
                    <p className="text-body-sm text-obsidian-500 dark:text-ivory-400 mt-1">
                      ~{t('tour.busDuration', '6 hours')} · {t('tour.viaGrandBazaar', 'via Grand Bazaar')}
                    </p>
                    {selectedTransport === 'bus' && (
                      <span className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center">
                        <FaCheckCircle className="text-obsidian-900 text-[10px]" />
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Booking Form ── */}
            <BookingForm
              tourId={tour.id}
              tourSlug={tour.slug}
              tourTitle={title}
              price={tour.basePriceUsd || tour.price}
              {...(TRANSPORT_REQUIRED_SLUGS.includes(slug)
                ? { transportChoice: selectedTransport, requireTransportChoice: true }
                : {})}
            />
          </div>

        </div>
      </section>

      <Suspense fallback={null}>
        <ReviewsMap tourId={tour.slug || tour.id} />
      </Suspense>

      <SuggestedTours currentDestination={tour?.destination || 'egypt'} currentSlug={slug} />

      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-obsidian-950/95 flex flex-col items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setIsLightboxOpen(false)}
          >
            <div className="absolute top-6 right-6 flex items-center gap-4 z-[102]" onClick={(e) => e.stopPropagation()}>
              <span className="text-ivory-300 text-caption font-mono">
                {activeImageIndex + 1} / {gallery.length || 1}
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="text-ivory-50 hover:text-gold-500 text-2xl transition-colors cursor-pointer"
                aria-label="Close Lightbox"
              >
                <FaTimes />
              </button>
            </div>

            <div className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              {gallery.length > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length)}
                  className="absolute left-2 md:-left-16 text-ivory-50 hover:text-gold-400 text-2xl p-3 bg-obsidian-900/60 rounded-full backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                  aria-label="Previous image"
                >
                  <FaChevronLeft className="rtl-flip" />
                </button>
              )}

              <img
                src={gallery[activeImageIndex]?.imageUrl || heroImg}
                alt={gallery[activeImageIndex]?.altText || title}
                className="max-w-[85vw] max-h-[75vh] object-contain rounded-xl shadow-2xl border border-gold-500/20"
              />

              {gallery.length > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev + 1) % gallery.length)}
                  className="absolute right-2 md:-right-16 text-ivory-50 hover:text-gold-400 text-2xl p-3 bg-obsidian-900/60 rounded-full backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                  aria-label="Next image"
                >
                  <FaChevronRight className="rtl-flip" />
                </button>
              )}
            </div>

            {gallery[activeImageIndex]?.altText && (
              <p className="text-ivory-300 text-body-sm mt-4 text-center max-w-xl">
                {gallery[activeImageIndex].altText}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TourDetails;
