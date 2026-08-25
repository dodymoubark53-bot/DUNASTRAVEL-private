import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaClock, FaCheck, FaTimes, FaBed, FaMapMarkerAlt } from 'react-icons/fa';
import AdvancedBooking from '../../components/booking/AdvancedBooking';
import RouteMap from '../../components/tour/RouteMap';
import multiCountryTours from '../../data/multiCountryTours';

export default function MultiCountryTourDetails() {
  const { t } = useTranslation();
  const { slug } = useParams();

  const tour = multiCountryTours.find(
    (item) => item.slug === slug || item.id.toLowerCase() === (slug || '').toLowerCase()
  ) || multiCountryTours[0];

  const title = tour.title || 'Multi-Country Grand Tour';

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{`${title} | Dunas Travel`}</title>
        <meta name="description" content={tour.overview || tour.description || title} />
      </Helmet>

      {/* Hero Header */}
      <section className="relative w-full h-[400px] md:h-[550px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={tour.images && tour.images[0] ? tour.images[0] : 'https://theglobetrottingdetective.com/wp-content/uploads/2022/03/best-places-in-the-middle-east-traveling-the-middle-east-cappadocia-turkey.jpg'}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/60 to-obsidian-900/30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-ivory-50 mt-16">
          <span className="inline-flex items-center gap-2 text-gold-400 uppercase tracking-widest text-xs font-semibold mb-3">
            <FaGlobe className="text-gold-500" /> Multi-Country Grand Tour
          </span>
          <h1 className="text-display-xl text-ivory-50 mb-4 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            {title}
          </h1>
          <p className="text-body-lg text-ivory-300 max-w-2xl mx-auto">
            {tour.duration} • {tour.destinations || 'Egypt & Beyond'}
          </p>
        </div>
      </section>

      {/* Content & Booking Grid */}
      <section className="container mx-auto px-6 pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 mb-6 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('tourDetail.overview', 'Overview')}
              </h2>
              <p className="text-body-lg text-obsidian-600 dark:text-ivory-300 leading-relaxed">
                {tour.overview || tour.description || 'Embark on an unforgettable grand journey spanning iconic highlights across multiple countries.'}
              </p>
            </div>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <div>
                <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 mb-6 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('tourDetail.highlights', 'Highlights')}
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-white dark:bg-[#1a1a30] p-4 rounded-xl shadow-sm border border-gold-500/10">
                      <FaCheck className="text-gold-500 mt-1 shrink-0" />
                      <span className="text-body-sm text-obsidian-700 dark:text-ivory-200">{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Day-by-Day Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div>
                <h2 className="text-display-lg text-obsidian-900 dark:text-ivory-50 mb-8 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('tourDetail.itinerary', 'Day by Day Itinerary')}
                </h2>
                <div className="space-y-4">
                  {tour.itinerary.map((day) => (
                    <div key={day.day} className="bg-white dark:bg-[#1a1a30] p-6 rounded-2xl shadow-card border border-gold-500/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gold-600 uppercase text-xs">Day {day.day}</span>
                        {day.meals && (
                          <span className="text-caption text-obsidian-400 text-xs flex items-center gap-1">
                            <FaBed className="text-gold-500" /> {day.meals}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-serif font-bold text-obsidian-900 dark:text-ivory-50 mb-2">
                        {day.title}
                      </h3>
                      {day.description && (
                        <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 leading-relaxed">
                          {day.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Route Map */}
            {tour.itinerary && <RouteMap itinerary={tour.itinerary} />}
          </div>

          {/* Sidebar Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 self-start z-30">
              <AdvancedBooking tourTitle={title} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
