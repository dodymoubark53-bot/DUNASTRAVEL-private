import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaClock, FaTag, FaUsers, FaChevronRight, FaCheck, FaTimes, FaMapMarkerAlt, FaBed, FaCheckCircle
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

const CLASSIC_PROGRAM_DATA = {
  id: 'classic-program',
  slug: 'classic-program',
  title: 'Classic Egypt Tour: Cairo & 5-Star Nile Cruise',
  titleAr: 'البرنامج الكلاسيكي: القاهرة وكروز النيل 5 نجوم',
  subtitle: '8 Days / 7 Nights • Cairo, Pyramids, GEM, Luxor, Edfu, Kom Ombo & Aswan',
  subtitleAr: '8 أيام / 7 ليالي • القاهرة، الأهرامات، المتحف الكورني، الأقصر، إدفو، كوم أمبو وأسوان',
  overview: 'Experience the timeless beauty of Egypt with our signature classic itinerary. Explore the Pyramids of Giza, the Grand Egyptian Museum, and sail along the Nile on a luxury 5-star cruise visiting Luxor, Karnak, Edfu, Kom Ombo, Philae Temple, and Abu Simbel.',
  overviewAr: 'استمتع بسحر مصر الخالد مع برنامجنا الكلاسيكي المميز. اكتشف أهرامات الجيزة والمتحف المصري الكبير، وقم بالإبحار في نهر النيل على متن كروز فاخر 5 نجوم ممرًا بالأقصر، الكرنك، إدفو، كوم أمبو، معبد فيلة وأبو سمبل.',
  duration: '8 Days / 7 Nights',
  durationAr: '8 أيام / 7 ليالي',
  type: 'Classic / Cruise & City',
  groupSize: '2-16 Pax',
  price: 0,
  images: [
    'https://res.cloudinary.com/degbrq3ck/image/upload/v1783029636/Classic_Program_gfal0s.jpg',
    'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1572252821143-035a024856f2?auto=format&fit=crop&w=1200&q=80'
  ],
  highlights: [
    'Pyramids of Giza, Sphinx, Memphis & Sakkara',
    'Grand Egyptian Museum (GEM) & Alabaster Mosque',
    '5-Star Nile Cruise from Luxor to Aswan (4 Nights)',
    'Valley of the Kings, Hatshepsut Temple & Colossi of Memnon',
    'Edfu Temple of Horus & Kom Ombo Temple of Sobek',
    'Philae Temple of Isis, High Dam & Abu Simbel Temples'
  ],
  highlightsAr: [
    'أهرامات الجيزة، أبو الهول، ممفيس وسقارة',
    'المتحف المصري الكبير ومسجد الفيروز والقلعة',
    'كروز فاخر 5 نجوم في النيل من الأقصر إلى أسوان (4 ليالي)',
    'وادي الملوك، معبد حتشبسوت وتمثالا ممنون',
    'معبد حورس بإدفو ومعبد سوبيك بكوم أمبو',
    'معبد فيلة، السد العالي ومعابد أبو سمبل'
  ],
  included: [
    'VIP Airport Assistance & Transfers throughout',
    'Entry Visa to Egypt included',
    'Domestic Flights (Cairo-Luxor & Aswan-Cairo)',
    '3 Nights in 5-Star Cairo Hotel with Daily Breakfast',
    '4 Nights on 5-Star Luxury Nile Cruise with Full Board',
    'All Sightseeing Tours with Certified English/Arabic Speaking Guide',
    'Entrance Fees to all listed archaeological sites'
  ],
  includedAr: [
    'استقبال ومساعدة VIP والتنقلات طوال الرحلة',
    'تأشيرة الدخول لمصر شاملة',
    'الطيران الداخلي (القاهرة-الأقصر وأسوان-القاهرة)',
    'إقامة 3 ليالي في فندق 5 نجوم بالقاهرة مع الإفطار',
    'إقامة 4 ليالي على متن كروز فاخر 5 نجوم بالنيل مع إقامة كاملة',
    'جميع الجولات السياحية مع مرشد سياحي مرخص',
    'رسوم الدخول لجميع المواقع الأثرية المذكورة'
  ],
  excluded: [
    'International Airfare',
    'Beverages during meals & cruise',
    'Tipping & Gratuities',
    'Optional Excursions'
  ],
  excludedAr: [
    'الطيران الدولي',
    'المشروبات أثناء الوجبات والكروز',
    'الإكراميات',
    'الجولات الاختيارية'
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival in Cairo - Welcome to Egypt',
      titleAr: 'الوصول إلى القاهرة - الترحيب في مصر',
      description: 'Arrival at Cairo International Airport. Our VIP representative will greet you before passport control, assist with visa issuance and luggage, and transfer you to your 5-star hotel in Cairo.',
      descriptionAr: 'الوصول إلى مطار القاهرة الدولي. مندوبنا سيكون في استقبالكم قبل مراقبة الجوازات للمساعدة في التأشيرة والأمتعة والانتقال بالفندق.'
    },
    {
      day: 2,
      title: 'Giza Pyramids, Sphinx, Memphis & Sakkara',
      titleAr: 'أهرامات الجيزة، أبو الهول، ممفيس وسقارة',
      description: 'Breakfast at hotel. Marvel at the Great Pyramids of Cheops, Chephren, and Mykerinos. Visit the Sphinx, Papyrus Institute, Memphis (the ancient capital), and Sakkara Step Pyramid.',
      descriptionAr: 'الإفطار بالفندق. زيارة أهرامات الجيزة الخالدة، تمثال أبو الهول، معهد البردي، مدينة ممفيس القديمة وهرم سقارة المدرج.'
    },
    {
      day: 3,
      title: 'Grand Egyptian Museum, Citadel & Khan El Khalili',
      titleAr: 'المتحف المصري الكبير، القلعة وخان الخليلي',
      description: 'Discover the Grand Egyptian Museum (GEM), the Citadel of Saladin, the Mohamed Ali Alabaster Mosque, the Coptic Cairo Quarter, and stroll through Khan El Khalili Bazaar.',
      descriptionAr: 'جولة إلى المتحف المصري الكبير، قلعة صلاح الدين، مسجد محمد علي باشا، القاهرة القبطية والتسوق في خان الخليلي.'
    },
    {
      day: 4,
      title: 'Fly to Luxor - Embarkation on 5-Star Nile Cruise & East Bank',
      titleAr: 'الطيران إلى الأقصر - الصعود على الكروز والبر الشرقي',
      description: 'Flight from Cairo to Luxor. Transfer to your 5-Star Luxury Nile Cruise ship. After lunch on board, explore Karnak Temple Complex and Luxor Temple.',
      descriptionAr: 'السفر طيراناً إلى الأقصر والتسكين على متن كروز النيل 5 نجوم. بعد الغداء زيارة مجمع معابد الكرنك ومعبد الأقصر.'
    },
    {
      day: 5,
      title: 'Luxor West Bank: Valley of the Kings & Sail to Edfu',
      titleAr: 'البر الغربي بالأقصر: وادي الملوك والإبحار لإدفو',
      description: 'Visit the Valley of the Kings, Mortuary Temple of Queen Hatshepsut, and the Colossi of Memnon. Return to ship, lunch on board, and sail towards Edfu through Esna Lock.',
      descriptionAr: 'زيارة وادي الملوك، معبد الملكة حتشبسوت وتمثالا ممنون. العودة للكروز للغداء والإبحار باتجاه إدفو عبر هويس إسنا.'
    },
    {
      day: 6,
      title: 'Edfu & Kom Ombo Temples - Sail to Aswan',
      titleAr: 'معبدا إدفو وكوم أمبو - الإبحار إلى أسوان',
      description: 'Visit Edfu Temple dedicated to Horus by horse carriage. Sail to Kom Ombo and visit the twin temple of Sobek & Haroeris. Continue sailing to Aswan.',
      descriptionAr: 'زيارة معبد حورس بإدفو بالحطور، ثم الإبحار إلى كوم أمبو لزيارة معبد سوبيك وهارويريس المزدوج ومواصلة الإبحار لأسوان.'
    },
    {
      day: 7,
      title: 'Abu Simbel Excursion, Philae Temple & Felucca Ride',
      titleAr: 'رحلة أبو سمبل، معبد فيلة وجولة بالفلوكة',
      description: 'Overland excursion to the iconic Temples of Abu Simbel. Return to Aswan to visit the Philae Temple of Isis and the Aswan High Dam. Enjoy a sunset felucca sailboat ride on the Nile.',
      descriptionAr: 'رحلة إلى معابدا أبو سمبل العظيمة. العودة لأسوان لزيارة معبد فيلة والسد العالي، والاستمتاع بجولة الفلوكة في النيل عند الغروب.'
    },
    {
      day: 8,
      title: 'Disembarkation, Flight to Cairo & International Departure',
      titleAr: 'مغادرة الكروز، الطيران للقاهرة والمغادرة الدولية',
      description: 'Breakfast on cruise, transfer to Aswan Airport for flight back to Cairo, and connection for your final international departure flight.',
      descriptionAr: 'الإفطار وتنسيق المغادرة إلى مطار أسوان للطيران للقاهرة والمغادرة للوطن.'
    }
  ]
};

export default function ClassicProgramDetails() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const isAr = lang === 'ar';

  const title = isAr ? CLASSIC_PROGRAM_DATA.titleAr : CLASSIC_PROGRAM_DATA.title;
  const subtitle = isAr ? CLASSIC_PROGRAM_DATA.subtitleAr : CLASSIC_PROGRAM_DATA.subtitle;
  const overview = isAr ? CLASSIC_PROGRAM_DATA.overviewAr : CLASSIC_PROGRAM_DATA.overview;
  const duration = isAr ? CLASSIC_PROGRAM_DATA.durationAr : CLASSIC_PROGRAM_DATA.duration;
  const highlights = isAr ? CLASSIC_PROGRAM_DATA.highlightsAr : CLASSIC_PROGRAM_DATA.highlights;
  const included = isAr ? CLASSIC_PROGRAM_DATA.includedAr : CLASSIC_PROGRAM_DATA.included;
  const excluded = isAr ? CLASSIC_PROGRAM_DATA.excludedAr : CLASSIC_PROGRAM_DATA.excluded;

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
            {subtitle}
          </motion.p>
        </div>
      </section>

      {/* Hero Lightbox Gallery */}
      <section
        className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden group cursor-pointer"
        onClick={() => setIsLightboxOpen(true)}
      >
        <motion.img
          src={CLASSIC_PROGRAM_DATA.images[0]}
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
              <span className="text-body-md font-semibold text-obsidian-900">{CLASSIC_PROGRAM_DATA.type}</span>
            </div>
            <div className="p-6 flex flex-col items-center justify-center text-center gap-2">
              <FaUsers className="text-gold-500 text-2xl mb-1" />
              <span className="text-caption text-obsidian-500 uppercase text-xs">{t('tour.groupSize', 'Group Size')}</span>
              <span className="text-body-md font-semibold text-obsidian-900">{CLASSIC_PROGRAM_DATA.groupSize}</span>
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
                  {CLASSIC_PROGRAM_DATA.itinerary.map((day) => (
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
                            {isAr ? day.titleAr : day.title}
                          </span>
                        </div>

                        <p className="text-body-sm text-obsidian-600 leading-relaxed">
                          {isAr ? day.descriptionAr : day.description}
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
            <RouteMap itinerary={CLASSIC_PROGRAM_DATA.itinerary} />
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
      <ReviewsMap tourId="classic-program" />

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
              src={CLASSIC_PROGRAM_DATA.images[0]}
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
