import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaHeart, FaCalendarAlt, FaCheck, FaBed, FaMapMarkerAlt } from 'react-icons/fa';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import RouteMap from '../../components/tour/RouteMap';

const HONEYMOON_ITINERARY = [
  {
    day: 1,
    titleDefault: 'Arrival in Cairo',
    descDefault: 'Arrival at Cairo International Airport. Reception by our representative and private transfer to the hotel. Check-in and accommodation.',
    meals: 'Dinner included'
  },
  {
    day: 2,
    titleDefault: 'Pyramids of Giza, Sphinx & Saqqara',
    descDefault: 'After breakfast, depart to visit the famous Pyramids of Giza: Cheops, Chephren, and Mycerinus, as well as the Great Sphinx. Continue to Saqqara and Memphis.',
    meals: 'Breakfast & Lunch'
  },
  {
    day: 3,
    titleDefault: 'Grand Egyptian Museum & Historic Cairo',
    descDefault: 'Visit to the Grand Egyptian Museum (GEM), Citadel of Saladin, Alabaster Mosque, Coptic Cairo, and Khan El Khalili bazaar.',
    meals: 'Breakfast & Lunch'
  },
  {
    day: 4,
    titleDefault: 'Cairo – Flight to Luxor – Nile Cruise Embarkation',
    descDefault: 'Transfer to Cairo airport for flight to Luxor. Board luxury 5-star Nile cruise. Visit Karnak and Luxor temples.',
    meals: 'Breakfast, Lunch & Dinner'
  },
  {
    day: 5,
    titleDefault: 'Luxor West Bank – Sail to Edfu',
    descDefault: 'Visit Valley of the Kings, Temple of Queen Hatshepsut, and Colossi of Memnon. Sail to Edfu via Esna lock.',
    meals: 'Breakfast, Lunch & Dinner'
  },
  {
    day: 6,
    titleDefault: 'Edfu & Kom Ombo Temples – Sail to Aswan',
    descDefault: 'Visit Edfu Temple of Horus by horse carriage. Sail to Kom Ombo and visit double temple of Sobek and Haroeris. Sail to Aswan.',
    meals: 'Breakfast, Lunch & Dinner'
  },
  {
    day: 7,
    titleDefault: 'Aswan Philae Temple & Felucca Ride',
    descDefault: 'Visit High Dam and Philae Temple dedicated to Goddess Isis. Enjoy a romantic sunset felucca ride around Elephantine Island.',
    meals: 'Breakfast, Lunch & Dinner'
  },
  {
    day: 8,
    titleDefault: 'Aswan – Transfer to Red Sea (Hurghada / Sharm)',
    descDefault: 'Disembarkation from cruise. Private transfer to Red Sea luxury resort. Check-in and evening at leisure by the sea.',
    meals: 'All Inclusive'
  },
  {
    day: 9,
    titleDefault: 'Red Sea Romantic Day at Leisure',
    descDefault: 'Day free for snorkeling, diving, private yacht cruise, or candlelit seaside dinner.',
    meals: 'All Inclusive'
  },
  {
    day: 10,
    titleDefault: 'Red Sea – Flight to Cairo & Final Departure',
    descDefault: 'Breakfast at resort. Transfer to airport for domestic flight to Cairo and connecting international flight home.',
    meals: 'Breakfast'
  }
];

export default function HoneymoonersDetails() {
  const { t } = useTranslation();
  const { id } = useParams();

  const title = t('honeymooners.egyptTitle', 'Honeymoon in Egypt & Red Sea Luxury');

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{`${title} | Dunas Travel`}</title>
        <meta name="description" content="Exclusive luxury honeymoon package in Egypt including Nile cruise and Red Sea resort." />
      </Helmet>

      {/* Hero Header */}
      <section className="relative w-full h-[400px] md:h-[550px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://hl-tourism.com/media/typecms/Honeymoon_Planning_Guide_2025_Complete_Resource.webp"
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/60 to-obsidian-900/30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-ivory-50 mt-16">
          <span className="inline-flex items-center gap-2 text-gold-400 uppercase tracking-widest text-xs font-semibold mb-3">
            <FaHeart className="text-gold-500" /> Romantic Luxury Package
          </span>
          <h1 className="text-display-xl text-ivory-50 mb-4 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h1>
          <p className="text-body-lg text-ivory-300 max-w-2xl mx-auto">
            10 Days / 9 Nights • Cairo, 5-Star Nile Cruise & Red Sea VIP Resort
          </p>
        </div>
      </section>

      {/* Content & Booking Grid */}
      <section className="container mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 mb-6 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('tourDetail.overview', 'Overview')}
              </h2>
              <p className="text-body-lg text-obsidian-600 dark:text-ivory-300 leading-relaxed">
                Celebrate your romance in Egypt. This 10-day luxury honeymoon package combines private guided tours of the ancient Pyramids and Egyptian Museum in Cairo, a romantic 5-star Nile River Cruise from Luxor to Aswan, and relaxing luxury beachfront resort stays on the Red Sea.
              </p>
            </div>

            {/* Itinerary */}
            <div>
              <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 mb-8 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('tourDetail.itinerary', 'Day by Day Itinerary')}
              </h2>
              <div className="space-y-6">
                {HONEYMOON_ITINERARY.map((day) => (
                  <div key={day.day} className="bg-white dark:bg-[#1a1a30] p-6 rounded-2xl shadow-card border border-gold-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gold-600 uppercase text-xs">Day {day.day}</span>
                      <span className="text-caption text-obsidian-400 text-xs flex items-center gap-1">
                        <FaBed className="text-gold-500" /> {day.meals}
                      </span>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-obsidian-900 dark:text-ivory-50 mb-2">
                      {day.titleDefault}
                    </h3>
                    <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 leading-relaxed">
                      {day.descDefault}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Route Map */}
            <RouteMap itinerary={HONEYMOON_ITINERARY} />
          </div>

          {/* Sidebar Booking Form */}
          <div className="lg:col-span-1 sticky top-24 self-start z-40">
            <div>
              <AdvancedBooking tourTitle={title} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
