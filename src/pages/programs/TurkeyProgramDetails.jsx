import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaMapMarkerAlt, FaBed, FaClock, FaTag, FaChevronRight } from 'react-icons/fa';
import { fadeInUp } from '../../animations/variants';
import Button from '../../components/ui/Button';
import BookingForm from '../../components/booking/BookingForm';
import { useTurkeyProgram } from '../../hooks/useTurkeyPrograms';
import ReviewsMap from '../../components/tour/ReviewsMap';
import RouteMap from '../../components/tour/RouteMap';
import { tours } from '../../data/tours';
import TourCard from '../../components/tour/TourCard';

const TurkeyProgramDetails = () => {
  const { t } = useTranslation();
  const { programId } = useParams();
  const program = useTurkeyProgram(programId);
  const [activeImage, setActiveImage] = useState(null);
  const [transportChoice, setTransportChoice] = useState(null);
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
    window.scrollTo(0, 0);
  }, [programId]);

  if (!program) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-obsidian-50 dark:bg-[#0f0f1a] px-6">
        <h1 className="text-display-lg text-obsidian-900 dark:text-ivory-100 mb-4">{t('programs.notFound', 'Trip no longer available')}</h1>
        <p className="text-body-md text-obsidian-500 dark:text-obsidian-300 mb-8">{t('programs.notFoundDesc', 'The trip you are looking for does not exist or has been removed.')}</p>
        <Link to="/destinations/turkey" className="bg-gold-500 hover:bg-gold-600 text-obsidian-900 px-6 py-3 rounded-full font-semibold transition-colors">
          {t('programs.viewAllTurkeyTours', 'View All Turkey Tours')}
        </Link>
      </div>
    );
  }

  const { title, overview, duration, highlights, days, images, code, minPax, transportOptions } = program;

  const shuffledTours = [...tours].sort(() => Math.random() - 0.5);

  return (
    <div className="w-full bg-obsidian-50 dark:bg-[#0f0f1a] min-h-screen">
      <Helmet>
        <title>{title} | Dunas Travel</title>
        <meta name="description" content={overview} />
      </Helmet>

      {/* 1. Breadcrumb & Title */}
      <section className="pt-32 pb-10 bg-obsidian-900 dark:bg-[#0a0a15] text-center px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-2 text-caption text-gold-500 mb-4 uppercase tracking-wider">
            <Link to="/" className="hover:text-ivory-50 dark:hover:text-ivory-100 transition-colors">{t('nav.home', 'Home')}</Link>
            <span className="rtl-flip"><FaChevronRight className="text-[10px]" /></span>
            <Link to="/destinations/turkey" className="hover:text-ivory-50 dark:hover:text-ivory-100 transition-colors">{t('dest.turkey.title', 'Turkey')}</Link>
            <span className="rtl-flip"><FaChevronRight className="text-[10px]" /></span>
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

      {/* 2. Photo Gallery */}
      <section
        className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden group cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-500"
        onClick={() => setActiveImage(0)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setActiveImage(0);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={t('tour.clickGallery', 'Click to open gallery')}
      >
        <motion.img
          key={activeImage}
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={images[activeImage || 0]}
          alt={title}
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
        <div className="bg-ivory-50 dark:bg-[#1a1a30] rounded-2xl shadow-card overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 dark:divide-obsidian-600 border-b border-gray-100 dark:border-obsidian-600 bg-obsidian-50 dark:bg-obsidian-800">
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaClock className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 dark:text-obsidian-300 uppercase">{t('tour.duration', 'Duration')}</span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-100">{duration}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaBed className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 dark:text-obsidian-300 uppercase">{t('tour.tourType', 'Program')}</span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-100">{minPax}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaTag className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 dark:text-obsidian-300 uppercase">{t('tour.code', 'Code')}</span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-100">{code}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaMapMarkerAlt className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 dark:text-obsidian-300 uppercase">{t('tour.destination', 'Destination')}</span>
              <span className="text-body-md font-semibold text-obsidian-900 dark:text-ivory-100">{t('dest.turkey.title', 'Turkey')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Transport Options Selector */}
      {transportOptions && (
        <section id="transport-selector" className="container mx-auto px-6 pt-12">
          <div className="bg-gradient-to-r from-gold-50 via-gold-100/50 to-gold-50 dark:from-obsidian-700 dark:via-obsidian-600 dark:to-obsidian-700 border-2 border-gold-400 dark:border-gold-600 rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-display-md text-obsidian-900 dark:text-ivory-50 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
                {program.transportOptions}
              </h3>
              <p className="text-body-sm text-obsidian-500 dark:text-obsidian-300">
                {t('tour.transportNote', 'Choose your preferred transport between Istanbul and Ankara')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <button
                type="button"
                onClick={() => setTransportChoice('train')}
                className={`flex-1 p-5 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer ${
                  transportChoice === 'train'
                    ? 'border-gold-500 bg-gold-500/10 dark:bg-gold-500/20 shadow-lg shadow-gold-500/20 scale-[1.02]'
                    : 'border-gold-300/50 dark:border-gold-600/50 bg-white/60 dark:bg-obsidian-800/60 hover:border-gold-400 hover:bg-gold-50/80 dark:hover:bg-obsidian-700/80'
                }`}
              >
                <span className="text-4xl block mb-2">🚄</span>
                <span className={`text-body-md font-bold block ${transportChoice === 'train' ? 'text-gold-700 dark:text-gold-300' : 'text-obsidian-700 dark:text-ivory-100'}`}>
                  {t('tour.highSpeedTrain', 'High-Speed Train')}
                </span>
                <span className={`text-caption block mt-1 ${transportChoice === 'train' ? 'text-gold-600 dark:text-gold-400' : 'text-obsidian-400 dark:text-obsidian-300'}`}>
                  ~4 {t('tour.hours', 'hours')}
                </span>
                {transportChoice === 'train' && (
                  <span className="inline-block mt-2 text-[11px] font-semibold text-gold-700 dark:text-gold-300 bg-gold-200 dark:bg-gold-800 px-3 py-1 rounded-full">
                    ✓ {t('tour.selected', 'Selected')}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setTransportChoice('bus')}
                className={`flex-1 p-5 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer ${
                  transportChoice === 'bus'
                    ? 'border-gold-500 bg-gold-500/10 dark:bg-gold-500/20 shadow-lg shadow-gold-500/20 scale-[1.02]'
                    : 'border-gold-300/50 dark:border-gold-600/50 bg-white/60 dark:bg-obsidian-800/60 hover:border-gold-400 hover:bg-gold-50/80 dark:hover:bg-obsidian-700/80'
                }`}
              >
                <span className="text-4xl block mb-2">🚌</span>
                <span className={`text-body-md font-bold block ${transportChoice === 'bus' ? 'text-gold-700 dark:text-gold-300' : 'text-obsidian-700 dark:text-ivory-100'}`}>
                  {t('tour.bus', 'Bus')}
                </span>
                <span className={`text-caption block mt-1 ${transportChoice === 'bus' ? 'text-gold-600 dark:text-gold-400' : 'text-obsidian-400 dark:text-obsidian-300'}`}>
                  ~6 {t('tour.hours', 'hours')} · {t('tour.viaGrandBazaar', 'via Grand Bazaar')}
                </span>
                {transportChoice === 'bus' && (
                  <span className="inline-block mt-2 text-[11px] font-semibold text-gold-700 dark:text-gold-300 bg-gold-200 dark:bg-gold-800 px-3 py-1 rounded-full">
                    ✓ {t('tour.selected', 'Selected')}
                  </span>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="container mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main content */}
          <div className="lg:col-span-2">

            {/* Overview */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-100 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('tourDetail.overview', 'Overview')}
              </h2>
              <p className="text-body-lg text-obsidian-500 dark:text-obsidian-300 leading-relaxed">{overview}</p>
            </motion.div>

            {/* Highlights */}
            {Array.isArray(highlights) && highlights.length > 0 && (
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mt-16"
              >
                <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-100 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('tourDetail.highlights', 'Key Highlights')}
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {highlights.map((hl, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-ivory-50 dark:bg-obsidian-800 p-4 rounded-xl shadow-sm border border-gold-500/10 dark:border-gold-500/20">
                      <FaCheckCircle className="text-gold-500 mt-1 shrink-0" />
                      <span className="text-body-sm text-obsidian-700 dark:text-obsidian-200">{hl}</span>
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
                <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-100" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('tourDetail.itinerary', 'Itinerary')}
                </h2>
                <div className="w-24 h-1 bg-gold-500 mx-auto mt-3"></div>
              </div>

              <div className="relative max-w-full">
                <div className="absolute left-[1.1rem] top-0 bottom-0 w-1 bg-gold-400"></div>
                <div className="space-y-6">
                  {days.map((day) => (
                    <div key={day.day} className="relative pl-10 md:pl-12">
                      <div className="absolute left-[0.1rem] top-1 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                        {day.day}
                      </div>
                      <div className="bg-ivory-50 dark:bg-obsidian-800 rounded-2xl p-6 shadow-sm border border-gold-100 dark:border-obsidian-600 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-semibold text-obsidian-900 dark:text-ivory-100">{t('tour.day', 'Day')} {day.day}</span>
                          {day.meals && (
                            <span className="text-caption text-obsidian-400 dark:text-obsidian-300 flex items-center gap-1 ml-auto">
                              <FaBed className="text-gold-500" /> {day.meals}
                            </span>
                          )}
                        </div>
                        <p className="text-body-sm text-obsidian-500 dark:text-obsidian-300 leading-relaxed">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <RouteMap itinerary={days} />
          </div>

          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1">
            <div>
              <BookingForm tourId={program.id} tourTitle={title} transportChoice={transportChoice} requireTransportChoice={!!transportOptions} />
            </div>
          </div>
        </div>
      </section>

      <ReviewsMap />

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

export default TurkeyProgramDetails;
