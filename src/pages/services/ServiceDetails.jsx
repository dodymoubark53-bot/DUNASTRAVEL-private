import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, FaTimes, FaStar, FaMapMarkerAlt, FaTimesCircle, 
  FaBed, FaClock, FaTag, FaUserFriends, FaGlobe, FaChevronRight
} from 'react-icons/fa';
import Button from '../../components/ui/Button';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import { services } from '../../data/services';
import BookingForm from '../../components/booking/BookingForm';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import { useCurrency } from '../../context/CurrencyContext';
import RouteMap from '../../components/tour/RouteMap';
import ReviewsMap from '../../components/tour/ReviewsMap';

const ServiceDetails = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();
  const { category: urlCategory, slug } = useParams();
  const service = services.find((s) => (urlCategory ? s.category === urlCategory : true) && s.slug === slug);
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

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian-50">
        <h1 className="text-display-lg text-obsidian-900">{t('programs.notFound', 'Program not found')}</h1>
      </div>
    );
  }

  const relatedServices = services.filter((s) => s.category === category && s.id !== service.id).slice(0, 3);
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
              <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-y md:divide-y-0 divide-gray-100 border-b border-gray-100 bg-obsidian-50">
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
                <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
                  <FaUserFriends className="text-gold-500 text-2xl mb-1" />
                  <span className="text-caption text-obsidian-500 uppercase">{t('tour.groupSize', 'Group Size')}</span>
                  <span className="text-body-md font-semibold text-obsidian-900">2-16</span>
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
                  <h2 className="text-display-md text-obsidian-900 mb-6 font-display animate-none" style={{ fontFamily: "'Playfair Display', serif" }}>{t('tourDetail.overview', 'Overview')}</h2>
                  <div className="prose prose-lg prose-p:text-obsidian-500 prose-p:font-body prose-p:mb-6 text-left">
                    {service.overview.map((para, idx) => (
                      <p key={idx}>{translateData(para, para)}</p>
                    ))}
                  </div>
                </motion.div>

                {/* Key Highlights */}
                <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 text-left">
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
                  <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 text-left">
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
                        <div className="p-4 border-r border-ivory-50/10">{t('tour.destination', 'Destino')}</div>
                        <div className="p-4 border-r border-ivory-50/10 text-center">{t('tour.nights', 'Noches')}</div>
                        <div className="p-4 text-center">{t('tour.regime', 'Régimen')}</div>
                      </div>
                      {service.accommodations.map((row, idx) => (
                        <div
                          key={idx}
                          className={`grid grid-cols-3 border-b border-gold-500/10 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-obsidian-50/50'}`}
                        >
                          <div className="p-4 border-r border-gold-500/10 font-semibold text-obsidian-900 flex items-center gap-2 text-sm md:text-base">
                            <FaMapMarkerAlt className="text-gold-500 flex-shrink-0" />
                            {translateData(row.destination, row.destination)}
                          </div>
                          <div className="p-4 border-r border-gold-500/10 text-center font-bold text-gold-700 text-base md:text-lg">
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
                    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16">
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
                      <div className="absolute left-[1.1rem] top-0 bottom-0 w-1 bg-gold-400"></div>
                      <div className="space-y-6">
                        {service.itinerary.map((day) => (
                          <div key={day.day} className="relative pl-10 md:pl-12">
                            <div className="absolute left-[0.1rem] top-1 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                              {day.day}
                            </div>

                            <div className="bg-ivory-50 rounded-2xl p-6 shadow-sm border border-gold-100 hover:shadow-md transition-shadow">
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

                {/* Included / Excluded summary */}
                {service.slug === 'egypt-jordan-combined-14d' ? (
                  <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16 bg-ivory-50 dark:bg-[#1a1a30] p-8 rounded-2xl shadow-sm border border-obsidian-900/5 dark:border-gray-700 text-left space-y-12">
                    
                    {/* Included Section */}
                    <div>
                      <h2 className="text-display-md text-obsidian-900 dark:text-black mb-6 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {translateData('tour_jordan_includes_title', 'Package Includes')}
                      </h2>
                      <ul className="space-y-3 mb-8">
                        {['tour_jordan_includes_1', 'tour_jordan_includes_2', 'tour_jordan_includes_3', 'tour_jordan_includes_4', 'tour_jordan_includes_5', 'tour_jordan_includes_6'].map((key, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-obsidian-500 dark:text-black">
                            <FaCheckCircle className="text-sage-500 dark:text-green-400 mt-1 flex-shrink-0" />
                            <span>{translateData(key, key)}</span>
                          </li>
                        ))}
                      </ul>

                      <h3 className="text-body-lg font-semibold text-sage-700 dark:text-green-400 mb-4 flex items-center gap-2 font-display">
                        {translateData('tour_jordan_visited_title', 'Included Visits')}
                      </h3>
                      <ul className="space-y-3">
                        {['tour_jordan_visited_1', 'tour_jordan_visited_2', 'tour_jordan_visited_3'].map((key, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-obsidian-500 dark:text-black">
                            <FaMapMarkerAlt className="text-gold-500 mt-1 flex-shrink-0" />
                            <span>{translateData(key, key)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Excluded Section */}
                    <div>
                      <h2 className="text-display-md text-obsidian-900 dark:text-black mb-6 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {translateData('tour_jordan_excludes_title', 'Package Does Not Include')}
                      </h2>
                      <ul className="space-y-3">
                        {['tour_jordan_excludes_1', 'tour_jordan_excludes_2'].map((key, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-obsidian-500 dark:text-black">
                            <FaTimesCircle className="text-red-500 dark:text-red-300 mt-1 flex-shrink-0" />
                            <span>{translateData(key, key)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Accommodations Section */}
                    <div>
                      <h2 className="text-display-md text-obsidian-900 dark:text-black mb-6 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {translateData('tour_jordan_hotels_title', 'Previewed Hotels')}
                      </h2>
                      <ul className="space-y-3">
                        {['tour_jordan_hotel_1', 'tour_jordan_hotel_2'].map((key, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-obsidian-500 dark:text-black">
                            <FaBed className="text-gold-500 mt-1 flex-shrink-0" />
                            <span>{translateData(key, key)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price Section */}
                    <div>
                      <h2 className="text-display-md text-obsidian-900 dark:text-black mb-6 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {translateData('tour_jordan_price_title', 'The Value (Price)')}
                      </h2>
                      <ul className="space-y-3">
                        {['tour_jordan_price_double', 'tour_jordan_price_single'].map((key, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-obsidian-500 dark:text-black">
                            <FaTag className="text-gold-500 mt-1 flex-shrink-0" />
                            <span>{translateData(key, key)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </motion.div>
                ) : service.slug === 'siwa-oasis-alexandria' ? (
                  <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16 bg-ivory-50 dark:bg-[#1a1a30] p-8 rounded-2xl shadow-sm border border-obsidian-900/5 dark:border-gray-700 text-left">
                    <h2 className="text-display-md text-obsidian-900 dark:text-black mb-6 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {translateData(service.title, service.title)} — {translateData('tour_siwa_includes_title', 'Package Includes')}
                    </h2>
                    <ul className="space-y-3">
                      {service.included.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-obsidian-500 dark:text-black">
                          <FaCheckCircle className="text-sage-500 dark:text-green-400 mt-1 flex-shrink-0" />
                          <span>{translateData(item, item)}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-16 bg-ivory-50 dark:bg-[#1a1a30] p-8 rounded-2xl shadow-sm border border-obsidian-900/5 dark:border-gray-700 text-left">
                <h2 className="text-display-md text-obsidian-900 dark:text-black mb-8 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>{t('tourDetail.incExc', "What's Included & Excluded")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-body-lg font-semibold text-sage-700 dark:text-green-400 mb-4 flex items-center gap-2 font-display">{t('tourDetail.included', 'Included')}</h3>
                        <ul className="space-y-3">
                          {service.included.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-obsidian-500 dark:text-black">
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
                            <li key={idx} className="flex items-start gap-3 text-obsidian-500 dark:text-black">
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
                <div className="prose prose-lg prose-p:text-obsidian-500 prose-p:font-body prose-p:mb-6 text-left">
                  {service.overview.map((para, idx) => (
                    <p key={idx}>{translateData(para, para)}</p>
                  ))}
                </div>
              </motion.div>

              {/* Highlights */}
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 text-left">
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
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 bg-ivory-50 dark:bg-[#1a1a30] p-8 rounded-2xl shadow-sm border border-obsidian-900/5 dark:border-gray-700 text-left">
                <h2 className="text-display-md text-obsidian-900 dark:text-black mb-8 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>{t('tourDetail.incExc', "What's Included & Excluded")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-body-lg font-semibold text-sage-700 dark:text-green-400 mb-4 flex items-center gap-2 font-display">{t('tourDetail.included', 'Included')}</h3>
                    <ul className="space-y-3">
                      {service.included.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-obsidian-500 dark:text-black">
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
                        <li key={idx} className="flex items-start gap-3 text-obsidian-500 dark:text-black">
                          <FaTimesCircle className="text-red-500 dark:text-red-300 mt-1" />
                          <span>{translateData(item, item)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Photo Gallery */}
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12 text-left">
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
      <ReviewsMap tourId={slug} />

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
                  <div className="relative h-60 overflow-hidden text-left">
                    <div className="absolute top-4 left-4 z-10 bg-gold-500 text-obsidian-900 text-caption uppercase px-3 py-1 rounded-full">{translateData(relService.location, relService.location)}</div>
                    <img src={relService.images[0]} alt={translateData(relService.title, relService.title)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  </div>
                  <div className="p-8 flex flex-col flex-grow text-left">
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
    </div>
  );
};

export default ServiceDetails;
