import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaChevronRight, FaCheckCircle, FaHeart } from 'react-icons/fa';
import { fadeInUp } from '../animations/variants';
import BookingForm from '../components/booking/BookingForm';
import RouteMap from '../components/tour/RouteMap';
import ReviewsMap from '../components/tour/ReviewsMap';

const days = [
  {
    day: 1,
    titleKey: 'honeymooners.day1Title',
    titleDefault: 'Arrival in Cairo',
    descKey: 'honeymooners.day1Desc',
    descDefault: 'Arrival at Cairo International Airport. Reception by our representative and private transfer to the hotel. Check-in and accommodation.'
  },
  {
    day: 2,
    titleKey: 'honeymooners.day2Title',
    titleDefault: 'Pyramids of Giza and Saqqara',
    descKey: 'honeymooners.day2Desc',
    descDefault: 'After breakfast, depart to visit the famous Pyramids of Giza: Cheops, Chephren, and Mycerinus, as well as the Sphinx. Continue to Saqqara, where we will visit the Step Pyramid of Djoser and Memphis, the ancient capital of Egypt. Return to the hotel and accommodation in Cairo.'
  },
  {
    day: 3,
    titleKey: 'honeymooners.day3Title',
    titleDefault: 'Historic Cairo',
    descKey: 'honeymooners.day3Desc',
    descDefault: 'Breakfast at the hotel. Visit to the Grand Egyptian Museum (GEM) with its incredible pharaonic collections. Continue to the Citadel of Saladin, the Alabaster Mosque, Coptic Cairo, and the famous Khan El Khalili market. Return to the hotel.'
  },
  {
    day: 4,
    titleKey: 'honeymooners.day4Title',
    titleDefault: 'Cairo – Luxor – Nile Cruise',
    descKey: 'honeymooners.day4Desc',
    descDefault: 'Breakfast. Transfer to the airport for a domestic flight to Luxor. Arrival and embarkation on the Nile Cruise. Visit to the majestic temples of Karnak and Luxor. Dinner and overnight on board.'
  },
  {
    day: 5,
    titleKey: 'honeymooners.day5Title',
    titleDefault: 'Luxor – Edfu',
    descKey: 'honeymooners.day5Desc',
    descDefault: 'Visit to the Valley of the Kings, where the tombs of the pharaohs are located, including a visit to the Temple of Queen Hatshepsut and the Colossi of Memnon. Sailing on the Nile towards Edfu. Full board and overnight on board.'
  },
  {
    day: 6,
    titleKey: 'honeymooners.day6Title',
    titleDefault: 'Edfu – Kom Ombo – Aswan',
    descKey: 'honeymooners.day6Desc',
    descDefault: 'Visit to the Temple of Edfu dedicated to the god Horus. Sailing to Kom Ombo and visit to the temple dedicated to the gods Sobek and Horus. Continue sailing to Aswan. Full board and overnight on board.'
  },
  {
    day: 7,
    titleKey: 'honeymooners.day7Title',
    titleDefault: 'Aswan – Hurghada',
    descKey: 'honeymooners.day7Desc',
    descDefault: 'After breakfast, disembark from the cruise. Panoramic visit of Aswan (according to flight schedule). Transfer to the airport for a flight to Hurghada. Arrival and transfer to the hotel. Accommodation on All Inclusive basis.'
  },
  {
    day: 8,
    titleKey: 'honeymooners.day8Title',
    titleDefault: 'Hurghada',
    descKey: 'honeymooners.day8Desc',
    descDefault: 'Free day to enjoy the Red Sea beaches. Possibility of optional activities such as snorkeling, diving, or boat trips.'
  },
  {
    day: 9,
    titleKey: 'honeymooners.day9Title',
    titleDefault: 'Hurghada / Cairo',
    descKey: 'honeymooners.day9Desc',
    descDefault: 'Free day to relax and enjoy the hotel, beach, and resort facilities. At the scheduled time, transfer to the airport for a flight to Cairo.'
  },
  {
    day: 10,
    titleKey: 'honeymooners.day10Title',
    titleDefault: 'Departure',
    descKey: 'honeymooners.day10Desc',
    descDefault: 'Breakfast at the hotel. At the scheduled time, transfer to the airport for the return flight.'
  }
];

const includes = [
  { key: 'honeymooners.inc1', default: '5-star hotels' },
  { key: 'honeymooners.inc2', default: 'Nile Cruise' },
  { key: 'honeymooners.inc3', default: 'All Inclusive in Hurghada' },
  { key: 'honeymooners.inc4', default: 'Breakfast in Cairo' },
  { key: 'honeymooners.inc5', default: 'Regular transfers' },
  { key: 'honeymooners.inc6', default: 'Professional Portuguese-speaking guide' },
  { key: 'honeymooners.inc7', default: 'Entrance fees to mentioned monuments' },
  { key: 'honeymooners.inc8', default: '24-hour assistance' }
];

const HoneymoonersDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();


  return (
    <div className="w-full bg-obsidian-50 min-h-screen">
      <Helmet>
        <title>{t('honeymooners.egyptTitle', 'Honeymoon in Egypt')} | Dunas Travel</title>
        <meta name="description" content={t('honeymooners.egyptTagline', 'A perfect trip to celebrate love, combining history, culture, romance, and unforgettable moments on the Red Sea.')} />
      </Helmet>

      {/* Breadcrumb & Title */}
      <section className="pt-32 pb-10 bg-gradient-to-r from-rose-900 via-obsidian-900 to-obsidian-900 text-center px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-center gap-2 text-caption text-gold-500 mb-4 uppercase tracking-wider">
            <Link to="/" className="hover:text-ivory-50 transition-colors">{t('nav.home', 'Home')}</Link>
            <span className="rtl-flip"><FaChevronRight className="text-[10px]" /></span>
            <Link to="/programs/honeymooners" className="hover:text-ivory-50 transition-colors">{t('honeymooners.title', 'Honeymooners Package')}</Link>
            <span className="rtl-flip"><FaChevronRight className="text-[10px]" /></span>
            <span className="text-ivory-300">{t('honeymooners.egyptTitle', 'Honeymoon in Egypt')}</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display-xl text-ivory-50 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('honeymooners.egyptTitle', 'Honeymoon in Egypt')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-body-lg text-gold-400 font-medium"
          >
            10 Days / 09 Nights
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-body-md text-ivory-300 mt-2"
          >
            Cairo • Nile Cruise • Hurghada
          </motion.p>
        </div>
      </section>

      {/* Hero Image */}
      <section className="relative w-full h-[50vh] lg:h-[70vh] overflow-hidden">
        <motion.img
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          src="https://hl-tourism.com/media/typecms/Honeymoon_Planning_Guide_2025_Complete_Resource.webp"
          alt="Honeymoon in Egypt"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/60 via-transparent to-transparent"></div>
      </section>

      {/* Overview + Includes + Sidebar */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <motion.div variants={fadeInUp} className="mb-12">
              <h2 className="text-display-lg text-obsidian-900 dark:text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('honeymooners.overviewTitle', 'Overview')}
              </h2>
              <p className="text-body-lg text-obsidian-500 dark:text-gray-300 leading-relaxed">
                {t('honeymooners.overviewDesc', 'A perfect trip to celebrate your love, combining the grandeur of ancient Egypt with the serene beauty of the Red Sea. From the majestic Pyramids of Giza to the tranquil beaches of Hurghada, every moment is designed for romance and discovery. Sail the timeless Nile, explore magnificent temples, and relax in luxury resorts — all crafted to create unforgettable memories for you and your loved one.')}
              </p>
            </motion.div>

            {/* Itinerary */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-display-md text-obsidian-900 dark:text-white mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('honeymooners.itinerary', 'Itinerary')}
              </h3>
              <div className="relative">
                <div className="absolute left-[1.1rem] top-0 bottom-0 w-1 bg-gold-400"></div>
                <div className="space-y-8">
                  {days.map((d) => (
                    <motion.div
                      key={d.day}
                      variants={fadeInUp}
                      className="relative pl-10 md:pl-12"
                    >
                      <div className="absolute left-[0.1rem] top-1 w-8 h-8 rounded-full bg-gold-500 text-white flex items-center justify-center text-sm font-bold shadow-md z-10">
                        {d.day}
                      </div>
                      <div className="bg-ivory-50 dark:bg-[#1a1a30] rounded-2xl p-6 shadow-sm border border-gold-100 dark:border-gold-900/50 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="text-display-md text-obsidian-900 dark:text-white text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                            {t(d.titleKey, d.titleDefault)}
                          </h4>
                        </div>
                        <p className="text-body-md text-obsidian-500 dark:text-gray-300 leading-relaxed">
                          {t(d.descKey, d.descDefault)}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            <RouteMap itinerary={days} />
          </div>

          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <div>
              <BookingForm tourId="honeymoon-01" tourTitle={t('honeymooners.egyptTitle', 'Honeymoon in Egypt')} />
            </div>
          </motion.div>
        </div>

        {/* Includes */}
        <motion.div variants={fadeInUp} className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-display-md text-obsidian-900 dark:text-ivory-50 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('honeymooners.includes', 'Includes')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {includes.map((inc, i) => (
              <div key={i} className="flex items-center gap-3 bg-ivory-50 dark:bg-[#1a1a30] rounded-xl p-4 shadow-sm">
                <FaCheckCircle className="text-gold-500 shrink-0" size={18} />
                <span className="text-body-md text-obsidian-700 dark:text-ivory-100 font-medium">{t(inc.key, inc.default)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={fadeInUp} className="mt-16 text-center">
          <div className="bg-gradient-to-r from-rose-50 to-gold-50 dark:from-[#2a1a2e] dark:to-[#1a1a30] rounded-3xl p-10 shadow-lg border border-rose-200 dark:border-rose-900/50">
            <FaHeart className="text-rose-400 text-4xl mx-auto mb-4" />
            <h3 className="text-display-md text-obsidian-900 dark:text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('honeymooners.ctaTitle', 'Ready to Celebrate Your Love?')}
            </h3>
            <p className="text-body-md text-obsidian-500 dark:text-gray-300 mb-6 max-w-lg mx-auto">
              {t('honeymooners.ctaDesc', 'Let our expert travel designers craft the perfect romantic getaway tailored just for you.')}
            </p>
            <Link
              to="/tailor-a-tour"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <FaHeart />
              {t('honeymooners.ctaBtn', 'Start Planning Your Honeymoon')}
            </Link>
          </div>
        </motion.div>
      </section>

      <ReviewsMap tourId={id} />
    </div>
  );
};

export default HoneymoonersDetails;
