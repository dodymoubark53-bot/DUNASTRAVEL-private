import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaClock, FaTag, FaUsers, FaChevronRight, FaCheck, FaTimes, FaCheckCircle
} from 'react-icons/fa';
import TourCard from '../../components/tour/TourCard';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import RouteMap from '../../components/tour/RouteMap';
import ReviewsMap from '../../components/tour/ReviewsMap';
import tours from '../../data/tours';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const CLASSIC_IMAGES = [
  'https://res.cloudinary.com/degbrq3ck/image/upload/v1783029636/Classic_Program_gfal0s.jpg',
  'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1572252821143-035a024856f2?auto=format&fit=crop&w=1200&q=80'
];

export default function ClassicProgramDetails() {
  const { t } = useTranslation();

  const title = t('data.completoEgypt.title', 'Egito Completo');
  const overview = t('data.completoEgypt.overview', 'Uma viagem completa de 8 dias pelos maiores tesouros do Egito.');
  const duration = t('data.completoEgypt.duration', '8 Dias / 7 Noites');
  const tourType = t('data.completoEgypt.type', 'Tour Completo pelo Egito');

  const highlights = useMemo(() => [
    t('data.completoEgypt.highlight.1', 'Pirâmides de Gizé e Esfinge com visita ao interior da pirâmide'),
    t('data.completoEgypt.highlight.2', 'Cairo antigo, Khan El Khalili e Café dos Espelhos'),
    t('data.completoEgypt.highlight.3', 'Cidadela de Saladino, Mesquita de Alabastro e Museu Egípcio'),
    t('data.completoEgypt.highlight.4', 'Templo de Luxor, Templo de Karnak e Vale dos Reis'),
    t('data.completoEgypt.highlight.5', 'Templo de Edfu e Templo de Kom Ombo'),
    t('data.completoEgypt.highlight.6', 'Templos de Abu Simbel, Represa de Assuã e Templo de Filae')
  ], [t]);

  const included = useMemo(() => [
    t('data.completoEgypt.incl.1', 'Todos os transfers, desde a chegada até a saída'),
    t('data.completoEgypt.incl.2', 'Visto e assistência desde o primeiro momento'),
    t('data.completoEgypt.incl.3', 'Guia em seu idioma para todas as visitas'),
    t('data.completoEgypt.incl.4', '3 ou 4 noites de hotel no Cairo'),
    t('data.completoEgypt.incl.5', '3 ou 4 noites de cruzeiro pelo Nilo'),
    t('data.completoEgypt.incl.6', 'Pensão completa desde o jantar do dia de chegada ao café da manhã do dia de saída'),
    t('data.completoEgypt.incl.7', 'Voos domésticos entre Cairo-Luxor e Assuã-Cairo'),
    t('data.completoEgypt.incl.8', 'Taxas portuárias e gorjetas')
  ], [t]);

  const excluded = useMemo(() => [
    t('data.completoEgypt.excl.1', 'Bebidas')
  ], [t]);

  const itinerary = useMemo(() => [
    {
      day: 1,
      title: t('data.completoEgypt.day1.title', 'Chegada ao Cairo'),
      description: t('data.completoEgypt.day1.desc')
    },
    {
      day: 2,
      title: t('data.completoEgypt.day2.title', 'Pirâmides, Esfinge e Mêmfis'),
      description: t('data.completoEgypt.day2.desc')
    },
    {
      day: 3,
      title: t('data.completoEgypt.day3.title', 'Tour pelo Cairo'),
      description: t('data.completoEgypt.day3.desc')
    },
    {
      day: 4,
      title: t('data.completoEgypt.day4.title', 'Voo para Luxor e Cruzeiro no Nilo'),
      description: t('data.completoEgypt.day4.desc')
    },
    {
      day: 5,
      title: t('data.completoEgypt.day5.title', 'Karnak e Vale dos Reis'),
      description: t('data.completoEgypt.day5.desc')
    },
    {
      day: 6,
      title: t('data.completoEgypt.day6.title', 'Edfu e Kom Ombo'),
      description: t('data.completoEgypt.day6.desc')
    },
    {
      day: 7,
      title: t('data.completoEgypt.day7.title', 'Abu Simbel e Assuã'),
      description: t('data.completoEgypt.day7.desc')
    },
    {
      day: 8,
      title: t('data.completoEgypt.day8.title', 'Partida do Cairo'),
      description: t('data.completoEgypt.day8.desc')
    }
  ], [t]);

  const shuffledTours = useMemo(() => [...tours].sort(() => Math.random() - 0.5), []);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const carouselRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            <Link to="/destinations/egypt" className="hover:text-ivory-50 transition-colors">
              {t('dest.egypt.title', 'Egypt')}
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

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-body-lg text-gold-400 font-medium tracking-wide"
          >
            {duration}
          </motion.p>
        </div>
      </section>

      {/* Hero Lightbox Gallery */}
      <section
        className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden group cursor-pointer"
        onClick={() => setIsLightboxOpen(true)}
      >
        <motion.img
          src={CLASSIC_IMAGES[0]}
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
              <span className="text-body-md font-semibold text-obsidian-900">{tourType}</span>
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
          <div className="lg:col-span-2 space-y-16">
            {/* Overview */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-display-lg text-obsidian-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('tourDetail.overview', 'Overview')}
              </h2>
              <p className="text-body-lg text-obsidian-600 leading-relaxed">{overview}</p>
            </motion.div>

            {/* Highlights */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-display-lg text-obsidian-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('tourDetail.highlights', 'Key Highlights')}
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-gold-500/10">
                    <FaCheck className="text-gold-500 mt-1 shrink-0" />
                    <span className="text-body-sm text-obsidian-700">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Day-by-Day Itinerary */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
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
                  {itinerary.map((day) => (
                    <div key={day.day} className="relative pl-10 rtl:pl-0 rtl:pr-10 md:pl-12 md:rtl:pr-12">
                      <div className="absolute left-[0.1rem] rtl:left-auto rtl:right-[0.1rem] top-1 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                        {day.day}
                      </div>

                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gold-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-semibold text-obsidian-900">
                            {t('tour.day', 'Day')} {day.day}
                          </span>
                          <span className="text-body-sm text-obsidian-600 font-medium">
                            {day.title}
                          </span>
                        </div>

                        <p className="text-body-sm text-obsidian-600 leading-relaxed">
                          {day.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Included & Excluded */}
            <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200/60">
                <h3 className="text-body-lg font-bold text-emerald-950 mb-4 flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-600" />
                  {t('tourDetail.included', 'What is Included')}
                </h3>
                <ul className="space-y-3">
                  {included.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-body-sm text-emerald-900">
                      <FaCheck className="text-emerald-600 mt-1 shrink-0 text-xs" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-200/60">
                <h3 className="text-body-lg font-bold text-rose-950 mb-4 flex items-center gap-2">
                  <FaTimes className="text-rose-600" />
                  {t('tourDetail.excluded', 'What is Excluded')}
                </h3>
                <ul className="space-y-3">
                  {excluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-body-sm text-rose-900">
                      <FaTimes className="text-rose-500 mt-1 shrink-0 text-xs" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Route Map */}
            <RouteMap itinerary={itinerary} />
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
      <ReviewsMap tourId="complete-egypt-8d" />

      {/* Related Tours Carousel */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-display-lg text-obsidian-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('tourDetail.relatedTitle', 'You May Also Like')}
          </h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto mb-4" />
        </div>

        <div className="related-carousel" ref={carouselRef}>
          {shuffledTours.slice(0, 8).map((tItem) => (
            <div key={tItem.id} className="related-carousel-item">
              <TourCard tour={tItem} linkBase="/tours" />
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
          width: 300px;
          scroll-snap-align: start;
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
              src={CLASSIC_IMAGES[0]}
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
