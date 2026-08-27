import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, FaTimes, FaStar, FaMapMarkerAlt, FaTimesCircle, 
  FaBed, FaClock, FaTag, FaChevronRight, FaHotel, FaMoneyBillWave
} from 'react-icons/fa';
import Button from '../../components/ui/Button';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import { useServices } from '../../hooks/useServices';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import ErrorState from '../../components/ui/ErrorState';
import NotFound from '../NotFound';
import BookingForm from '../../components/booking/BookingForm';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import { useCurrency } from '../../context/CurrencyContext';
import RouteMap from '../../components/tour/RouteMap';
import ReviewsMap from '../../components/tour/ReviewsMap';
import SuggestedTours from '../../components/tour/SuggestedTours';
import { services as staticServices } from '../../data/services';

const ServiceDetails = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { category: urlCategory, slug } = useParams();
  const { services: apiServices, loading, error } = useServices(urlCategory);
  
  const allServices = [...(apiServices || []), ...staticServices];
  const service = allServices.find((s) => s.slug === slug) || allServices.find((s) => (urlCategory ? s.category === urlCategory : true) && s.slug === slug);
  const category = service ? service.category : urlCategory;
  const [activeImage, setActiveImage] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const translateData = (key, fallback) => {
    if (!key) return fallback || '';
    if (key.startsWith('trip.') || key.startsWith('tour_')) {
      const translated = t(key);
      if (translated !== key) return translated;
    }
    const dataObj = t('data', { returnObjects: true });
    if (dataObj && typeof dataObj === 'object' && key in dataObj) {
      return dataObj[key];
    }
    const translatedDirect = t(key);
    if (translatedDirect !== key) return translatedDirect;
    return fallback || key;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveImage(null);
        setActiveForm(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!service && loading) return <SkeletonLoader count={4} />;
  if (!service && error) return <ErrorState message={error.message || 'Failed to load service details'} />;
  if (!service) return <NotFound />;

  const relatedServices = allServices.filter((s) => s.category === category && s.id !== service.id).slice(0, 3);
  const hasItinerary = !!service.itinerary;

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>
          {translateData(service.title, service.title)} | {t('programs.luxuryCat', 'Luxury {{category}}', { category: t(`nav.${category}`, category.charAt(0).toUpperCase() + category.slice(1)) })}
        </title>
        <meta name="description" content={translateData(service.shortDesc, service.shortDesc)} />
      </Helmet>

      {hasItinerary ? (
        <>
          {/* Header & Breadcrumb for Itinerary Tours */}
          <section className="pt-32 pb-10 bg-obsidian-900 text-center px-6">
            <div className="container mx-auto">
              <div className="flex flex-wrap items-center justify-center gap-2 text-caption text-gold-500 mb-4 uppercase tracking-wider">
                <Link to="/" className="hover:text-ivory-50 transition-colors">{t('nav.home', 'Home')}</Link>
                <span className="rtl-flip text-[10px]"><FaChevronRight /></span>
                {category === 'classic' || category === 'extension' ? (
                  <>
                    <Link to="/destinations/egypt" className="hover:text-ivory-50 transition-colors">{t('dest.egypt.title', 'Egypt')}</Link>
                    <span className="rtl-flip text-[10px]"><FaChevronRight /></span>
                  </>
                ) : (
                  <>
                    <Link to={`/programs/${category}`} className="hover:text-ivory-50 transition-colors">
                      {t(`nav.${category}`, category)}
                    </Link>
                    <span className="rtl-flip text-[10px]"><FaChevronRight /></span>
                  </>
                )}
                <span className="text-ivory-300">{translateData(service.title, service.title)}</span>
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-display-xl text-ivory-50 mb-6 font-display"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {translateData(service.title, service.title)}
              </motion.h1>
            </div>
          </section>

          {/* Large Image Showcase */}
          <section
            className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500"
            onClick={() => setActiveImage(service.images[0])}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveImage(service.images[0]);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={t('tour.clickGallery', 'Click to open gallery')}
          >
            <motion.img
              src={service.images[0]}
              alt={translateData(service.title, service.title)}
              className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <div className="absolute bottom-6 right-6 bg-obsidian-900/80 backdrop-blur-md px-4 py-2 rounded-full text-ivory-50 text-caption border border-gold-500/20">
              {t('tour.clickGallery', 'Click to open gallery')}
            </div>
          </section>

          {/* Quick Info Bar - standalone overlapping */}
          <div className="container mx-auto px-6 -mt-12 relative z-20">
            <div className="bg-ivory-50 rounded-2xl shadow-card overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100 bg-obsidian-50">
                <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
                  <FaClock className="text-gold-500 text-2xl mb-1" />
                  <span className="text-caption text-obsidian-500 uppercase">{t('tour.duration', 'Duration')}</span>
                  <span className="text-body-md font-semibold text-obsidian-900">{service.itinerary ? `${service.itinerary.length} ${t('tour.days', 'Days')}` : ''}</span>
                </div>
                <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
                  <FaTag className="text-gold-500 text-2xl mb-1" />
                  <span className="text-caption text-obsidian-500 uppercase">{t('tour.tourType', 'Tour Type')}</span>
                  <span className="text-body-md font-semibold text-obsidian-900">{t(`nav.${category}`, category)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content - grid layout */}
          <section className="container mx-auto px-6 pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                {/* Overview */}
                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <h2 className="text-display-md text-obsidian-900 mb-6 font-display animate-none text-start" style={{ fontFamily: "'Playfair Display', serif" }}>{t('tourDetail.overview', 'Overview')}</h2>
                  <div className="prose prose-lg prose-p:text-obsidian-500 prose-p:font-body prose-p:mb-6 text-start">
                    {service.overview.map((para, idx) => (
                      <p key={idx}>{translateData(para, para)}</p>
                    ))}
                  </div>
                </motion.div>

                {/* Key Highlights */}
                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 text-start">
                  <h2 className="text-display-md text-obsidian-900 mb-6 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>{t('tourDetail.highlights', 'Key Highlights')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <FaCheckCircle className="text-gold-500 mt-1 flex-shrink-0" />
                        <span className="text-body-md text-obsidian-700">{translateData(highlight, highlight)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Accommodations Table */}
                {service.accommodations && (
                  <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 text-start">
                    <div className="mb-6">
                      <span className="text-caption text-gold-500 uppercase tracking-widest font-semibold block mb-2">
                        {t('tour.accommodation', 'ALOJAMIENTO')}
                      </span>
                      <h2 className="text-display-md text-3xl text-obsidian-900 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {t('dest.greece.accTitle', 'Resumen de Alojamientos')}
                      </h2>
                    </div>
                    <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gold-500/10">
                      <div className="grid grid-cols-3 bg-obsidian-900 text-ivory-50 text-xs md:text-sm font-semibold uppercase tracking-wider">
                        <div className="p-4 border-r rtl:border-r-0 rtl:border-l border-ivory-50/10 text-start">{t('tour.destination', 'Destino')}</div>
                        <div className="p-4 border-r rtl:border-r-0 rtl:border-l border-ivory-50/10 text-center">{t('tour.nights', 'Noches')}</div>
                        <div className="p-4 text-center">{t('tour.regime', 'Régimen')}</div>
                      </div>
                      {service.accommodations.map((row, idx) => (
                        <div
                          key={idx}
                          className={`grid grid-cols-3 border-b border-gold-500/10 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-obsidian-50/50'}`}
                        >
                          <div className="p-4 border-r rtl:border-r-0 rtl:border-l border-gold-500/10 font-semibold text-obsidian-900 flex items-center gap-2 text-sm md:text-base text-start">
                            <FaMapMarkerAlt className="text-gold-500 flex-shrink-0" />
                            {translateData(row.destination, row.destination)}
                          </div>
                          <div className="p-4 border-r rtl:border-r-0 rtl:border-l border-gold-500/10 text-center font-bold text-gold-700 text-base md:text-lg">
                            {row.nights}
                          </div>
                          <div className="p-4 text-center text-obsidian-700 flex items-center justify-center gap-2 text-sm md:text-base">
                            <FaBed className="text-gold-500 flex-shrink-0" />
                            {translateData(row.regime, row.regime)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Itinerary Section */}
                {service.itinerary && (
                  <>
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16 text-start">
                    <div className="mb-10">
                      <span className="text-caption text-gold-500 uppercase tracking-widest font-semibold block mb-2">
                        {t('tour.stepByStep', 'SUA JORNADA PASSO A PASSO')}
                      </span>
                      <h2 className="text-display-md text-3xl text-obsidian-900 font-display font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {service.slug === 'egypt-jordan-combined-14d' 
                          ? translateData('tour_jordan_itinerary_title', 'Itinerary: Journey of the Holy Family – 10 Days – 09 Nights') 
                          : t('tour.detailedItinerary', 'Detailed Itinerary')}
                      </h2>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                      <div className="absolute left-[1.1rem] rtl:left-auto rtl:right-[1.1rem] top-0 bottom-0 w-1 bg-gold-400"></div>
                      <div className="space-y-6">
                        {service.itinerary.map((day) => (
                          <div key={day.day} className="relative pl-10 md:pl-12 rtl:pl-0 rtl:pr-10 rtl:md:pr-12">
                            <div className="absolute left-[0.1rem] rtl:left-auto rtl:right-[0.1rem] top-1 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                              {day.day}
                            </div>

                            <div className="bg-ivory-50 rounded-2xl p-6 shadow-sm border border-gold-100 hover:shadow-md transition-shadow text-start">
                              <div className="flex items-center gap-3 mb-3">
                                <span className="font-semibold text-obsidian-900">{t('tour.day', 'Day')} {day.day}</span>
                                {day.title && (
                                  <span className="text-body-sm text-obsidian-500">{translateData(day.title, day.title)}</span>
                                )}
                              </div>

                              <div className="space-y-2">
                                {day.body && (
                                  <p className="text-body-sm text-obsidian-500 leading-relaxed">{translateData(day.body, day.body)}</p>
                                )}
                                {day.morning && (
                                  <p className="text-body-sm text-obsidian-500 leading-relaxed">{translateData(day.morning, day.morning)}</p>
                                )}
                                {day.afternoon && (
                                  <p className="text-body-sm text-obsidian-500 leading-relaxed">{translateData(day.afternoon, day.afternoon)}</p>
                                )}
                                {day.evening && (
                                  <p className="text-body-sm text-obsidian-500 leading-relaxed">{translateData(day.evening, day.evening)}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                  <RouteMap itinerary={service.itinerary} />
                </>
                )}

                {/* Included / Excluded / Hotels / Pricing summary */}
                {service.slug === 'egypt-jordan-combined-14d' ? (
                  <motion.div
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="mt-16 space-y-8"
                  >
                    {/* 1. Includes & Visits Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Includes Card */}
                      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold-500/10 to-transparent rounded-bl-full pointer-events-none" />
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold shrink-0">
                            <FaCheckCircle />
                          </div>
                          <div>
                            <span className="text-caption text-gold-600 uppercase tracking-widest font-semibold block">
                              {translateData('tour_jordan_includes_badge', 'المزايا المشمولة')}
                            </span>
                            <h2 className="text-display-sm text-obsidian-900 font-display text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {translateData('tour_jordan_includes_title', 'الباقة تشمل')}
                            </h2>
                          </div>
                        </div>

                        <ul className="space-y-3.5">
                          {[
                            'tour_jordan_includes_1',
                            'tour_jordan_includes_2',
                            'tour_jordan_includes_3',
                            'tour_jordan_includes_4',
                            'tour_jordan_includes_5',
                            'tour_jordan_includes_6'
                          ].map((key, idx) => (
                            <li key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-obsidian-50/70 hover:bg-emerald-50/50 transition-colors border border-gold-500/10">
                              <span className="w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                                ✓
                              </span>
                              <span className="text-body-sm text-obsidian-800 leading-relaxed font-medium">
                                {translateData(key, key)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Included Visits Card */}
                      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold-500/10 to-transparent rounded-bl-full pointer-events-none" />
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 flex items-center justify-center text-xl font-bold shrink-0">
                            <FaMapMarkerAlt />
                          </div>
                          <div>
                            <span className="text-caption text-gold-600 uppercase tracking-widest font-semibold block">
                              {translateData('tour_jordan_visited_badge', 'مسار المزارات')}
                            </span>
                            <h2 className="text-display-sm text-obsidian-900 font-display text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {translateData('tour_jordan_visited_title', 'الزيارات المشمولة')}
                            </h2>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {[
                            { key: 'tour_jordan_visited_1', city: 'القاهرة' },
                            { key: 'tour_jordan_visited_2', city: 'الدلتا والقناة' },
                            { key: 'tour_jordan_visited_3', city: 'المنيا وصعيد مصر' }
                          ].map((item, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-gradient-to-r from-obsidian-50 via-white to-gold-50/20 border border-gold-500/15 hover:border-gold-500/30 transition-all shadow-sm">
                              <div className="flex items-center gap-2 mb-1 text-gold-600 font-semibold text-xs uppercase tracking-wider">
                                <FaMapMarkerAlt className="text-gold-500" />
                                <span>{item.city}</span>
                              </div>
                              <p className="text-body-sm text-obsidian-800 font-medium leading-relaxed">
                                {translateData(item.key, item.key)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 2. Exclusions & Hotels Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Exclusions Card */}
                      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-rose-500/20 hover:border-rose-500/40 transition-all duration-300 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-xl font-bold shrink-0">
                            <FaTimesCircle />
                          </div>
                          <div>
                            <span className="text-caption text-rose-500 uppercase tracking-widest font-semibold block">
                              {translateData('tour_jordan_excludes_badge', 'ملاحظات هامة')}
                            </span>
                            <h2 className="text-display-sm text-obsidian-900 font-display text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {translateData('tour_jordan_excludes_title', 'الباقة لا تشمل')}
                            </h2>
                          </div>
                        </div>

                        <ul className="space-y-3.5">
                          {['tour_jordan_excludes_1', 'tour_jordan_excludes_2'].map((key, idx) => (
                            <li key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50/60 border border-rose-100 text-obsidian-800">
                              <span className="w-5 h-5 rounded-full bg-rose-500/15 text-rose-500 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">
                                ✕
                              </span>
                              <span className="text-body-sm leading-relaxed font-medium">
                                {translateData(key, key)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Hotels Card */}
                      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-card border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 flex items-center justify-center text-xl font-bold shrink-0">
                            <FaHotel />
                          </div>
                          <div>
                            <span className="text-caption text-gold-600 uppercase tracking-widest font-semibold block">
                              {translateData('tour_jordan_hotels_badge', 'أماكن الإقامة')}
                            </span>
                            <h2 className="text-display-sm text-obsidian-900 font-display text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                              {translateData('tour_jordan_hotels_title', 'الفنادق المتوقعة')}
                            </h2>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3.5">
                          {[
                            { key: 'tour_jordan_hotel_1', city: 'القاهرة', stars: 5 },
                            { key: 'tour_jordan_hotel_2', city: 'المنيا', stars: 4 }
                          ].map((item, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-gradient-to-r from-obsidian-900 via-obsidian-950 to-obsidian-900 text-ivory-50 flex items-center justify-between gap-4 shadow-md border border-gold-500/25">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                                  <FaBed className="text-lg" />
                                </div>
                                <div>
                                  <span className="text-[11px] uppercase tracking-wider text-gold-400 font-semibold block">
                                    {item.city}
                                  </span>
                                  <span className="text-body-sm font-semibold text-ivory-100">
                                    {translateData(item.key, item.key)}
                                  </span>
                                </div>
                              </div>
                              <div className="flex text-gold-400 text-xs gap-0.5 shrink-0">
                                {[...Array(item.stars)].map((_, i) => (
                                  <FaStar key={i} />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 3. Pricing Banner / Premium Luxury Gold Box */}
                    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-gradient-to-r dark:from-obsidian-950 dark:via-obsidian-900 dark:to-obsidian-950 text-obsidian-900 dark:text-ivory-50 p-6 md:p-10 shadow-card border border-gold-500/30">
                      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-48 h-48 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/15 text-gold-800 dark:bg-gold-500/20 dark:text-gold-400 text-xs font-semibold uppercase tracking-widest border border-gold-500/30 mb-3">
                            <FaMoneyBillWave />
                            {translateData('tour_jordan_price_badge', 'أسعار الباقة')}
                          </span>
                          <h2 className="text-display-md text-3xl md:text-4xl text-obsidian-900 dark:text-ivory-50 font-display font-bold mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {translateData('tour_jordan_price_title', 'القيمة (السعر)')}
                          </h2>
                          <p className="text-body-sm text-obsidian-800 dark:text-ivory-300 font-medium">
                            {translateData('tour_jordan_price_subtitle', 'أسعار تنافسية شاملة للإقامة والزيارات وتسهيلات الرحلة')}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                          {/* Double / Triple Price Card */}
                          <div className="flex-1 md:flex-initial bg-obsidian-50/80 dark:bg-white/10 backdrop-blur-md border border-gold-500/40 rounded-2xl p-5 text-center min-w-[210px] shadow-sm">
                            <span className="text-xs uppercase tracking-wider text-obsidian-800 dark:text-ivory-300 font-semibold block mb-1">
                              غرفة مزدوجة / ثلاثية
                            </span>
                            <div className="text-3xl font-extrabold text-obsidian-900 dark:text-gold-400 font-display">
                              $944 <span className="text-xs text-obsidian-700 dark:text-ivory-300 font-normal">/ للشخص</span>
                            </div>
                            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 block mt-1 font-bold">
                              ✓ شاملة الفنادق والزيارات
                            </span>
                          </div>

                          {/* Single Supplement Card */}
                          <div className="flex-1 md:flex-initial bg-obsidian-50/80 dark:bg-white/5 backdrop-blur-md border border-obsidian-200 dark:border-white/15 rounded-2xl p-5 text-center min-w-[210px] shadow-sm">
                            <span className="text-xs uppercase tracking-wider text-obsidian-800 dark:text-ivory-300 font-semibold block mb-1">
                              غرفة مفردة (سنجل)
                            </span>
                            <div className="text-3xl font-extrabold text-obsidian-900 dark:text-ivory-100 font-display">
                              +$340 <span className="text-xs text-obsidian-700 dark:text-ivory-300 font-normal">/ إضافي</span>
                            </div>
                            <span className="text-[11px] text-obsidian-700 dark:text-ivory-400 block mt-1 font-medium">
                              إقامة خاصة طوال الرحلة
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : service.slug === 'siwa-oasis-alexandria' ? (
                  <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16 bg-ivory-50 dark:bg-[#1a1a30] p-8 rounded-2xl shadow-sm border border-obsidian-900/5 dark:border-gray-700 text-left">
                    <h2 className="text-display-md text-obsidian-900 dark:text-ivory-50 mb-6 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {translateData(service.title, service.title)} — {translateData('tour_siwa_includes_title', 'Package Includes')}
                    </h2>
                    <ul className="space-y-3">
                      {service.included.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-obsidian-600 dark:text-ivory-300">
                          <FaCheckCircle className="text-sage-500 dark:text-green-400 mt-1 flex-shrink-0" />
                          <span>{translateData(item, item)}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16 bg-ivory-50 dark:bg-[#1a1a30] p-8 rounded-2xl shadow-sm border border-obsidian-900/5 dark:border-gray-700 text-left">
                <h2 className="text-display-md text-obsidian-900 dark:text-ivory-50 mb-8 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>{t('tourDetail.incExc', "What's Included & Excluded")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-body-lg font-semibold text-sage-700 dark:text-green-400 mb-4 flex items-center gap-2 font-display">{t('tourDetail.included', 'Included')}</h3>
                        <ul className="space-y-3">
                          {service.included.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-obsidian-600 dark:text-ivory-300">
                              <FaCheckCircle className="text-sage-500 dark:text-green-400 mt-1" />
                              <span>{translateData(item, item)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-body-lg font-semibold text-red-700 dark:text-red-300 mb-4 flex items-center gap-2 font-display">{t('tourDetail.excluded', 'Not Included')}</h3>
                        <ul className="space-y-3">
                          {service.excluded.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-obsidian-600 dark:text-ivory-300">
                              <FaTimesCircle className="text-red-500 dark:text-red-300 mt-1" />
                              <span>{translateData(item, item)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar - Booking Form */}
              <div className="lg:col-span-1">
<div>
                  <BookingForm tourId={service.id} tourTitle={service.title} />
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        /* Original Non-Itinerary Hero Section */
        <section className="relative h-[65vh] flex items-end justify-center overflow-hidden pb-16">
          <div className="absolute inset-0 z-0">
            <img
              src={service.images[0]}
              alt={translateData(service.title, service.title)}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-obsidian-900/60 bg-gradient-to-t from-obsidian-900 via-obsidian-900/30 to-transparent"></div>
          </div>

          <motion.div
            className="relative z-10 container mx-auto px-6 max-w-5xl flex flex-col md:flex-row justify-between items-end"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <div className="mb-6 md:mb-0">
              <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4 text-caption text-gold-500 uppercase tracking-widest font-medium">
                <span>{t(`nav.${category}`, category)}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                <span className="flex items-center gap-1"><FaMapMarkerAlt /> {translateData(service.location, service.location)}</span>
              </motion.div>
              <motion.h1 variants={fadeInUp} className="text-display-lg md:text-display-xl text-ivory-50 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                {translateData(service.title, service.title)}
              </motion.h1>
            </div>

            <motion.div variants={fadeInUp} className="flex flex-col items-start md:items-end bg-obsidian-900/80 backdrop-blur-md p-6 rounded-2xl border border-ivory-50/10">
              <div className="flex text-gold-500 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(service.rating) ? "text-gold-500" : "text-obsidian-300"} />
                ))}
                <span className="text-ivory-50 ml-2 text-body-sm font-medium">{service.rating}</span>
              </div>
              <div className="text-[#F5EDD6] text-caption uppercase tracking-wider mb-1">{t('tourCard.startingFrom', 'Starting From')}</div>
              <div className="text-display-md text-ivory-50">{formatPrice(service.price)}</div>
            </motion.div>
          </motion.div>
        </section>
      )}

      {/* Main Content - only rendered for non-itinerary */}
      {!hasItinerary && (
        <section className="container mx-auto px-6 max-w-5xl mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* Overview */}
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2 className="text-display-md text-obsidian-900 mb-6 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>{t('tourDetail.overview', 'Overview')}</h2>
                <div className="prose prose-lg prose-p:text-obsidian-500 prose-p:font-body prose-p:mb-6 text-start">
                  {service.overview.map((para, idx) => (
                    <p key={idx}>{translateData(para, para)}</p>
                  ))}
                </div>
              </motion.div>

              {/* Highlights */}
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 text-start">
                <h2 className="text-display-md text-obsidian-900 mb-6 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>{t('tourDetail.highlights', 'Key Highlights')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {service.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <FaCheckCircle className="text-gold-500 mt-1 flex-shrink-0" />
                      <span className="text-body-md text-obsidian-700">{translateData(highlight, highlight)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Inclusions / Exclusions */}
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 bg-ivory-50 dark:bg-[#1a1a30] p-8 rounded-2xl shadow-sm border border-obsidian-900/5 dark:border-gray-700 text-start">
                <h2 className="text-display-md text-obsidian-900 dark:text-ivory-50 mb-8 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>{t('tourDetail.incExc', "What's Included & Excluded")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-body-lg font-semibold text-sage-700 dark:text-green-400 mb-4 flex items-center gap-2 font-display">{t('tourDetail.included', 'Included')}</h3>
                    <ul className="space-y-3">
                      {service.included.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-obsidian-600 dark:text-ivory-300">
                          <FaCheckCircle className="text-sage-500 dark:text-green-400 mt-1" />
                          <span>{translateData(item, item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-body-lg font-semibold text-red-700 dark:text-red-300 mb-4 flex items-center gap-2 font-display">{t('tourDetail.excluded', 'Not Included')}</h3>
                    <ul className="space-y-3">
                      {service.excluded.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-obsidian-600 dark:text-ivory-300">
                          <FaTimesCircle className="text-red-500 dark:text-red-300 mt-1" />
                          <span>{translateData(item, item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Photo Gallery */}
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 text-start">
                <h2 className="text-display-md text-obsidian-900 mb-6 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>{t('tourDetail.gallery', 'Gallery')}</h2>
                <div className="grid grid-cols-3 gap-4">
                  {service.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl overflow-hidden cursor-pointer group relative focus:outline-none focus:ring-2 focus:ring-gold-500 ${idx === 0 ? 'col-span-3 h-80' : 'col-span-1 h-40'}`}
                      onClick={() => setActiveImage(img)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveImage(img);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${t('tourDetail.gallery', 'Gallery')} image ${idx + 1}`}
                    >
                      <img src={img} alt={`${service.title} ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Booking Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <BookingForm tourId={service.id} tourTitle={service.title} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {service?.id && !['hotels', 'transportation'].includes(service.category) && (
        <ReviewsMap tourId={service.slug} />
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="bg-ivory-50 py-24 mt-24 border-t border-obsidian-900/5">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-display-lg text-obsidian-900" style={{ fontFamily: "'Playfair Display', serif" }}>{t('programs.moreCat', 'More {{category}}', { category: t(`nav.${category}`, category.charAt(0).toUpperCase() + category.slice(1)) })}</h2>
              <div className="w-24 h-1 bg-gold-500 mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedServices.map((relService) => (
                <div key={relService.id} className="bg-obsidian-50 rounded-2xl overflow-hidden group h-full flex flex-col shadow-sm border border-obsidian-900/5 hover:shadow-card transition-all">
                  <div className="relative h-60 overflow-hidden text-start">
                    <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10 bg-gold-500 text-obsidian-900 text-caption uppercase px-3 py-1 rounded-full">{translateData(relService.location, relService.location)}</div>
                    <img src={relService.images[0]} alt={translateData(relService.title, relService.title)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-8 flex flex-col flex-grow text-start">
                    <h3 className="text-display-md text-obsidian-900 mb-3 text-xl line-clamp-1">{translateData(relService.title, relService.title)}</h3>
                    <p className="text-body-sm text-obsidian-500 line-clamp-2 mb-6">{translateData(relService.shortDesc, relService.shortDesc)}</p>
                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-obsidian-900/10">
                      <div>
                        <span className="text-caption text-obsidian-300 block">{t('tourCard.from', 'From')}</span>
                        <span className="text-body-lg font-semibold text-obsidian-900">{formatPrice(relService.price)}</span>
                      </div>
                      <Link to={['hurghada-4d3n', 'sharm-4d3n', 'siwa-oasis-alexandria'].includes(relService.slug) ? `/trips/${relService.slug}` : `/programs/${relService.category}/${relService.slug}`}>
                        <Button variant="outline-gold" className="px-4 py-2 text-sm">{t('tourCard.viewDetails', 'View Details')}</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Booking Modal */}
      <AnimatePresence>
        {activeForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-obsidian-900/80 flex items-start sm:items-center justify-center backdrop-blur-sm p-4 overflow-y-auto"
            onClick={() => setActiveForm(null)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              {activeForm === 'booking' && <AdvancedBooking onClose={() => setActiveForm(null)} tourTitle={service.title} basePricePerPerson={service.price} />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Lightbox */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-obsidian-900/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setActiveImage(null)}
          >
            <button className="absolute top-6 right-6 text-ivory-50 hover:text-gold-500 z-50">
              <FaTimes size={32} />
            </button>
            <img src={activeImage} className="max-w-full max-h-[90vh] object-contain rounded-lg" alt="Gallery preview" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suggested Tours Strip */}
      <SuggestedTours currentDestination={service?.location || 'egypt'} currentSlug={slug} />
    </div>
  );
};

export default ServiceDetails;
