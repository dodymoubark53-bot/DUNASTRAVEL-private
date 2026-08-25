import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaChurch, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import RouteMap from '../../components/tour/RouteMap';

const RELIGIOUS_PROGRAM = {
  id: 'holy-family-egypt',
  title: 'Holy Family Trail & Coptic Monasteries of Egypt',
  duration: '9 Days / 8 Nights',
  destinations: 'Cairo • Wadi El Natrun • St. Catherine Monastery • Mount Sinai',
  img: 'https://www.saintjeromechurch.org/wp-content/uploads/2025/03/14714-what-is-ccd-in-catholic-church-religious-education-programs-explained.png',
  price: 1890,
  itinerary: [
    { day: 1, title: 'Arrival in Cairo – Welcome & Transfer', meals: 'Dinner' },
    { day: 2, title: 'Old Coptic Cairo – Hanging Church, Saints Sergius & Bacchus', meals: 'Breakfast & Lunch' },
    { day: 3, title: 'Wadi El Natrun Monasteries (Deir Anba Bishoy & Deir El Surian)', meals: 'Breakfast & Lunch' },
    { day: 4, title: 'Pyramids of Giza & St. Mercurius Monastery', meals: 'Breakfast & Lunch' },
    { day: 5, title: 'Cairo to Sinai Peninsula – Passage to St. Catherine', meals: 'Breakfast & Dinner' },
    { day: 6, title: 'Mount Sinai Sunrise Pilgrimage & St. Catherine Monastery', meals: 'Breakfast & Lunch' },
    { day: 7, title: 'Return to Cairo – Grand Egyptian Museum', meals: 'Breakfast & Lunch' },
    { day: 8, title: 'Historic Churches of Maadi & Nile Felucca Pilgrimage', meals: 'Breakfast & Farewell Dinner' },
    { day: 9, title: 'Final Breakfast & Airport Transfer for Departure', meals: 'Breakfast' }
  ]
};

export default function ReligiousTours() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{`${t('nav.religious', 'Religious Programs')} | Dunas Travel`}</title>
        <meta
          name="description"
          content="Spiritual and Coptic Christian religious tours in Egypt and St. Catherine."
        />
      </Helmet>

      {/* Hero Header */}
      <section className="relative w-full h-[450px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={RELIGIOUS_PROGRAM.img}
            alt="Religious Pilgrimage"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/60 to-obsidian-900/30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-ivory-50 mt-16">
          <span className="inline-flex items-center gap-2 font-body text-gold-400 tracking-[0.25em] uppercase text-xs md:text-sm font-semibold mb-4 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30">
            <FaChurch className="text-gold-500" /> {t('nav.religious', 'Religious Programs')}
          </span>
          <h1 className="text-display-xl text-ivory-50 mb-6 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            {RELIGIOUS_PROGRAM.title}
          </h1>
          <p className="text-body-lg text-ivory-300 max-w-2xl mx-auto font-light leading-relaxed">
            {t(
              'dest.egypt.religiousDesc',
              'A spiritual journey through Egypt tracing ancient Coptic monasteries, sacred sites, and Mount Sinai.'
            )}
          </p>
        </div>
      </section>

      {/* Program Details & Booking */}
      <section className="container mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 mb-6 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('tourDetail.overview', 'Overview')}
              </h2>
              <p className="text-body-lg text-obsidian-600 dark:text-ivory-300 leading-relaxed">
                Trace the steps of the Holy Family during their refuge in Egypt. This deeply spiritual pilgrimage covers the ancient Coptic churches of Cairo, the sacred 4th-century desert monasteries of Wadi El Natrun, and St. Catherine Monastery at the foot of Mount Sinai.
              </p>
            </div>

            {/* Highlights */}
            <div>
              <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 mb-6 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                Key Pilgrimage Highlights
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Hanging Church & Church of St. Sergius (Holy Crypt)',
                  'Wadi El Natrun Monasteries of St. Bishoy & Syrian Monastery',
                  'Mount Sinai Pilgrimage Hike & Burning Bush site',
                  'St. Catherine Monastery & Transfiguration Church',
                  'Church of the Virgin Mary in Maadi on the Nile',
                  'Private spiritual guide and full transportation'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white dark:bg-[#1a1a30] p-4 rounded-xl shadow-sm border border-gold-500/10">
                    <FaCheckCircle className="text-gold-500 mt-1 shrink-0" />
                    <span className="text-body-sm text-obsidian-700 dark:text-ivory-200">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Day by Day */}
            <div>
              <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 mb-6 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('tourDetail.itinerary', 'Itinerary')}
              </h2>
              <div className="space-y-4">
                {RELIGIOUS_PROGRAM.itinerary.map((day) => (
                  <div key={day.day} className="bg-white dark:bg-[#1a1a30] p-5 rounded-xl shadow-sm border border-gold-500/10 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-gold-600 text-xs uppercase block mb-1">Day {day.day}</span>
                      <h4 className="font-bold text-obsidian-900 dark:text-ivory-50 text-base">{day.title}</h4>
                    </div>
                    <span className="text-xs text-obsidian-400 bg-gold-500/10 px-3 py-1 rounded-full">{day.meals}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Route Map */}
            <RouteMap itinerary={RELIGIOUS_PROGRAM.itinerary} />
          </div>

          {/* Right Column Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 self-start z-30">
              <AdvancedBooking tourTitle={RELIGIOUS_PROGRAM.title} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
