import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaGlobe, FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import multiCountryTours from '../../data/multiCountryTours';

export default function MultiCountryTours() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{`${t('nav.multiCountry', 'Multi-Country Tours')} | Dunas Travel`}</title>
        <meta
          name="description"
          content={t('dest.egypt.multiCountryDesc', 'Explore combined itineraries spanning Egypt, Jordan, Turkey and beyond for a truly grand adventure.')}
        />
      </Helmet>

      {/* Hero Banner */}
      <section className="relative w-full h-[450px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783030113/Gemini_Generated_Image_cb2enncb2enncb2e_wvyejn.jpg"
            alt="Multi-Country Grand Tours"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/60 to-obsidian-900/30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-ivory-50 mt-16">
          <span className="inline-flex items-center gap-2 font-body text-gold-400 tracking-[0.25em] uppercase text-xs md:text-sm font-semibold mb-4 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30">
            <FaGlobe className="text-gold-500" /> {t('nav.multiCountry', 'Multi-Country Tours')}
          </span>
          <h1 className="text-display-xl text-ivory-50 mb-6 font-serif" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('programs.multiCountryTitle', 'Grand Multi-Country Journeys')}
          </h1>
          <p className="text-body-lg text-ivory-300 max-w-2xl mx-auto font-light leading-relaxed">
            {t(
              'dest.egypt.multiCountryDesc',
              'Explore combined itineraries spanning Egypt, Jordan, Turkey, Dubai, Greece and Morocco for a truly grand adventure.'
            )}
          </p>
        </div>
      </section>

      {/* Tours Listing Grid */}
      <section className="container mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {multiCountryTours.map((tour) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#1a1a30] rounded-2xl overflow-hidden shadow-card border border-gold-500/10 hover:border-gold-500 hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={tour.images && tour.images[0] ? tour.images[0] : 'https://theglobetrottingdetective.com/wp-content/uploads/2022/03/best-places-in-the-middle-east-traveling-the-middle-east-cappadocia-turkey.jpg'}
                  alt={tour.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-obsidian-900/80 backdrop-blur-md text-gold-400 text-xs font-semibold px-3 py-1 rounded-full border border-gold-500/30 uppercase">
                  {tour.type || 'Multi-Country'}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <span className="text-caption text-gold-600 font-semibold uppercase tracking-wider text-xs mb-2">
                  {tour.duration}
                </span>

                <Link to={`/programs/multi-country/${tour.slug}`}>
                  <h3
                    className="text-xl font-serif font-bold text-obsidian-900 dark:text-ivory-50 mb-3 hover:text-gold-600 transition-colors line-clamp-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {tour.title}
                  </h3>
                </Link>

                <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 line-clamp-3 mb-6 flex-grow">
                  {tour.overview || tour.description || 'Grand luxury tour combining iconic destinations across multiple countries.'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gold-500/10 mt-auto">
                  <div>
                    <span className="text-caption text-obsidian-400 block text-[10px] uppercase">Duration</span>
                    <span className="text-sm font-bold text-obsidian-800 dark:text-ivory-100">{tour.duration}</span>
                  </div>

                  <Link to={`/programs/multi-country/${tour.slug}`}>
                    <Button variant="outline-gold" className="px-5 py-2 text-xs flex items-center gap-2">
                      {t('tourCard.viewDetails', 'View Details')} <FaArrowRight className="rtl-flip" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
