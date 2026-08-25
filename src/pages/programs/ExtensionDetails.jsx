import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaCheck, FaCalendarAlt, FaChevronRight, FaSun } from 'react-icons/fa';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import RouteMap from '../../components/tour/RouteMap';
import { fadeInUp } from '../../animations/variants';

const EXTENSIONS_DATA = {
  'extension-hurghada': {
    id: 'extension-hurghada',
    titleKey: 'extensions.hurghadaTitle',
    titleDefault: 'Hurghada Red Sea Extension',
    overviewKey: 'extensions.hurghadaOverview',
    overviewDefault: 'Transform your historical trip into a complete beach getaway. Enjoy 3 nights at a 5-star All-Inclusive resort in Hurghada. Explore vibrant coral reefs, crystal waters, or simply unwind by the sea.',
    duration: '4 Days / 3 Nights',
    destinations: 'Hurghada Resort',
    img: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1783030445/Gemini_Generated_Image_kenvzkkenvzkkenv_h9kz07.png',
    price: 490,
    itinerary: [
      {
        day: 1,
        titleDefault: 'Arrival in Hurghada & Resort Check-in',
        descDefault: 'Transfer from Cairo or Nile Cruise to your 5-star beachfront resort in Hurghada. Check-in, enjoy all-inclusive amenities, and spend a relaxing evening by the Red Sea beach.'
      },
      {
        day: 2,
        titleDefault: 'Red Sea Coral Reef Snorkeling & Boat Cruise',
        descDefault: 'Embark on a private or regular yacht trip to Giftun Island. Swim and snorkel in crystal-clear waters among colorful coral reefs and exotic marine life.'
      },
      {
        day: 3,
        titleDefault: 'Day at Leisure & Beachfront Spa Relaxation',
        descDefault: 'Enjoy a full free day at leisure. Relax by the infinity pool, pamper yourself at the resort spa, or join an optional sunset desert quad bike safari.'
      },
      {
        day: 4,
        titleDefault: 'Hurghada Airport Transfer & Departure',
        descDefault: 'Breakfast at the resort. At the scheduled time, private transfer to Hurghada Airport for your domestic flight to Cairo or international connection.'
      }
    ]
  },
  'extension-sharm': {
    id: 'extension-sharm',
    titleKey: 'extensions.sharmTitle',
    titleDefault: 'Sharm El Sheikh VIP Resort Extension',
    overviewKey: 'extensions.sharmOverview',
    overviewDefault: 'Indulge in maximum luxury in Sharm El Sheikh. Visit the world-famous Ras Mohammed marine park, enjoy luxury spa treatments, and experience a romantic desert sunset quad safari.',
    duration: '4 Days / 3 Nights',
    destinations: 'Sharm El Sheikh',
    img: 'https://images.unsplash.com/photo-1544971587-b842c27f8c14?q=80&w=1200',
    price: 550,
    itinerary: [
      {
        day: 1,
        titleDefault: 'Arrival in Sharm El Sheikh VIP Resort',
        descDefault: 'Transfer to your luxury 5-star spa resort in Sharm El Sheikh. Afternoon at leisure enjoying private beach access and evening dining.'
      },
      {
        day: 2,
        titleDefault: 'Ras Mohammed Marine Reserve Yacht Cruise',
        descDefault: 'Full-day luxury yacht excursion to Ras Mohammed National Park and White Island. World-class diving and snorkeling in pristine coral gardens.'
      },
      {
        day: 3,
        titleDefault: 'Luxury Spa Morning & Desert Quad Sunset Safari',
        descDefault: 'Morning spa treatment and relaxation at the resort. In the late afternoon, ride quad bikes into the Sinai desert for sunset tea at a Bedouin camp.'
      },
      {
        day: 4,
        titleDefault: 'Departure from Sharm El Sheikh',
        descDefault: 'Breakfast at resort. Transfer to Sharm El Sheikh International Airport for your return flight.'
      }
    ]
  },
  'extension-siwa': {
    id: 'extension-siwa',
    titleKey: 'extensions.siwaTitle',
    titleDefault: 'Siwa Oasis & Western Desert Safari Extension',
    overviewKey: 'extensions.siwaOverview',
    overviewDefault: 'Step into an ancient mystical world. Journey into the Western Desert to Siwa Oasis. Float in turquoise salt lakes, explore the ancient Shali Fortress, and watch desert sunsets over the Great Sand Sea.',
    duration: '4 Days / 3 Nights',
    destinations: 'Siwa Oasis • Salt Lakes • Great Sand Sea',
    img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
    price: 680,
    itinerary: [
      {
        day: 1,
        titleDefault: 'Journey from Cairo to Siwa Oasis',
        descDefault: 'Early morning private 4x4 drive from Cairo through Marsa Matrouh to Siwa Oasis. Check-in to an authentic eco-lodge and evening walk through palm groves.'
      },
      {
        day: 2,
        titleDefault: 'Turquoise Salt Lakes, Cleopatra Springs & Shali Fortress',
        descDefault: 'Float effortlessly in Siwa’s famous turquoise salt pools. Visit Cleopatra’s Bath, the Temple of the Oracle of Amun, and the historic mud-brick Shali Fortress.'
      },
      {
        day: 3,
        titleDefault: 'Great Sand Sea 4x4 Safari & Hot Springs Sunset',
        descDefault: 'Thrilling 4x4 dune bashing safari in the Great Sand Sea. Visit natural hot springs and sandboard down giant dunes, ending with a campfire Bedouin dinner.'
      },
      {
        day: 4,
        titleDefault: 'Return Drive to Cairo / Airport Transfer',
        descDefault: 'Breakfast at eco-lodge. Scenic return drive to Cairo or transfer to airport for final departure.'
      }
    ]
  }
};

const INCLUDES_LIST = [
  { key: 'extensions.inc1', default: '3 Nights luxury resort/hotel accommodation' },
  { key: 'extensions.inc2', default: 'All-Inclusive or Breakfast board as specified' },
  { key: 'extensions.inc3', default: 'Private airport/resort transfers' },
  { key: 'extensions.inc4', default: 'Guided excursions & local tours' },
  { key: 'extensions.inc5', default: '24-hour customer support' }
];

export default function ExtensionDetails() {
  const { t } = useTranslation();
  const { id } = useParams();

  const tour = EXTENSIONS_DATA[id] || EXTENSIONS_DATA['extension-hurghada'];
  const title = t(tour.titleKey, tour.titleDefault);

  return (
    <div className="w-full bg-obsidian-50 min-h-screen">
      <Helmet>
        <title>{`${title} | Dunas Travel`}</title>
        <meta
          name="description"
          content={t(tour.overviewKey, tour.overviewDefault)}
        />
      </Helmet>

      {/* Header Banner */}
      <section className="pt-32 pb-10 bg-gradient-to-r from-amber-900 via-obsidian-900 to-obsidian-900 text-center px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-2 text-caption text-gold-500 mb-4 uppercase tracking-wider">
            <Link to="/" className="hover:text-ivory-50 transition-colors">
              {t('nav.home', 'Home')}
            </Link>
            <span className="rtl-flip text-[10px]">
              <FaChevronRight />
            </span>
            <Link to="/programs/extension" className="hover:text-ivory-50 transition-colors">
              {t('extensions.subtitle', 'Egypt Extensions')}
            </Link>
            <span className="rtl-flip text-[10px]">
              <FaChevronRight />
            </span>
            <span className="text-ivory-300">{title}</span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display-xl text-ivory-50 mb-4 font-serif"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-body-lg text-gold-400 font-medium"
          >
            {tour.duration}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-body-md text-ivory-300 mt-2"
          >
            {tour.destinations}
          </motion.p>
        </div>
      </section>

      {/* Hero Image Section */}
      <section className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden">
        <motion.img
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={tour.img}
          alt={title}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/60 via-transparent to-transparent" />
      </section>

      {/* Content Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <motion.div variants={fadeInUp} className="mb-12">
              <h2
                className="text-display-lg text-obsidian-900 dark:text-white mb-6 font-serif"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t('extensions.overviewTitle', 'Overview')}
              </h2>
              <p className="text-body-lg text-obsidian-500 dark:text-gray-300 leading-relaxed">
                {t(tour.overviewKey, tour.overviewDefault)}
              </p>
            </motion.div>

            {/* Itinerary */}
            <motion.div variants={fadeInUp}>
              <h3
                className="text-display-md text-obsidian-900 dark:text-white mb-8 text-center font-serif"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t('extensions.itinerary', 'Itinerary')}
              </h3>

              <div className="relative">
                <div className="absolute left-[1.1rem] top-0 bottom-0 w-1 bg-gold-400" />
                <div className="space-y-8">
                  {tour.itinerary.map((day) => (
                    <motion.div
                      key={day.day}
                      variants={fadeInUp}
                      className="relative pl-10 md:pl-12"
                    >
                      <div className="absolute left-[0.1rem] top-1 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                        {day.day}
                      </div>
                      <div className="bg-ivory-50 dark:bg-[#1a1a30] rounded-2xl p-6 shadow-sm border border-gold-100 dark:border-gold-900/50 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <h4
                            className="text-display-md text-obsidian-900 dark:text-white text-lg font-serif font-bold"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                          >
                            {day.titleDefault}
                          </h4>
                        </div>
                        <p className="text-body-md text-obsidian-500 dark:text-gray-300 leading-relaxed">
                          {day.descDefault}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Route Map */}
            <RouteMap itinerary={tour.itinerary} />
          </div>

          {/* Sidebar Booking Form */}
          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <div className="sticky top-28">
              <AdvancedBooking tourTitle={title} />
            </div>
          </motion.div>
        </div>

        {/* Includes Section */}
        <motion.div variants={fadeInUp} className="mt-16 max-w-4xl mx-auto">
          <h3
            className="text-display-md text-obsidian-900 dark:text-black mb-6 font-serif"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('extensions.includesTitle', 'Includes')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {INCLUDES_LIST.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 bg-ivory-50 dark:bg-[#1a1a30] rounded-xl p-4 shadow-sm border border-gold-500/10"
              >
                <FaCheck className="text-gold-500 shrink-0" size={18} />
                <span className="text-body-md text-obsidian-700 dark:text-black font-medium">
                  {t(item.key, item.default)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Customization CTA Banner */}
        <motion.div variants={fadeInUp} className="mt-16 text-center">
          <div className="bg-gradient-to-r from-amber-50 to-gold-50 dark:from-[#2a241a] dark:to-[#1a1a30] rounded-3xl p-10 shadow-lg border border-gold-200 dark:border-gold-900/50">
            <FaSun className="text-gold-500 text-4xl mx-auto mb-4" />
            <h3
              className="text-display-md text-obsidian-900 dark:text-white mb-3 font-serif"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('extensions.ctaTitle', 'Want to Customize Your Extension?')}
            </h3>
            <p className="text-body-md text-obsidian-500 dark:text-gray-300 mb-6 max-w-lg mx-auto">
              {t(
                'extensions.ctaDesc',
                'Our travel experts can tailor your extension duration, resort category, and private activities.'
              )}
            </p>
            <Link
              to="/tailor-a-tour"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-900 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {t('extensions.ctaBtn', 'Tailor Your Extension')}
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
