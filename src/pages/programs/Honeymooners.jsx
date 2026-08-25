import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import Button from '../../components/ui/Button';

export const HONEYMOON_PACKAGES = [
  {
    id: 'honeymoon-egypt',
    titleKey: 'honeymooners.egyptTitle',
    titleDefault: 'Honeymoon in Egypt & Red Sea Luxury',
    duration: '10 Days / 9 Nights',
    destinations: 'Cairo • Nile Cruise • Hurghada / Sharm',
    img: 'https://hl-tourism.com/media/typecms/Honeymoon_Planning_Guide_2025_Complete_Resource.webp',
    taglineKey: 'honeymooners.egyptTagline',
    taglineDefault: 'A perfect trip to celebrate love, combining history, culture, romance, and unforgettable moments on the Red Sea.',
    price: 2490,
  }
];

export default function Honeymooners() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('honeymooners.title', 'Honeymooners Package | Dunas Travel')}</title>
        <meta
          name="description"
          content={t('honeymooners.desc', 'Celebrate your love with an unforgettable honeymoon in Egypt. Romance, history, and luxury await you.')}
        />
      </Helmet>

      {/* Hero Header */}
      <section className="relative w-full h-[450px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://hl-tourism.com/media/typecms/Honeymoon_Planning_Guide_2025_Complete_Resource.webp"
            alt="Romantic sunset"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/60 to-obsidian-900/30" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center text-ivory-50 mt-16">
          <span className="inline-flex items-center gap-2 font-body text-gold-400 tracking-[0.25em] uppercase text-xs md:text-sm font-semibold mb-4 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30">
            <FaHeart className="text-gold-500" /> {t('honeymooners.badge', 'Romantic Experience')}
          </span>
          <h1
            className="text-display-xl text-ivory-50 mb-6 font-serif"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('honeymooners.heading', 'Luxury Honeymoon Packages')}
          </h1>
          <p className="text-body-lg text-ivory-300 max-w-2xl mx-auto font-light leading-relaxed">
            {t(
              'honeymooners.subtitle',
              'Create everlasting memories together with our bespoke luxury itineraries designed exclusively for couples.'
            )}
          </p>
        </div>
      </section>

      {/* Package Cards List */}
      <section className="container mx-auto px-6 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {HONEYMOON_PACKAGES.map((pkg) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-[#1a1a30] rounded-2xl overflow-hidden shadow-card border border-gold-500/10 hover:border-gold-500 hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={pkg.img}
                  alt={t(pkg.titleKey, pkg.titleDefault)}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-gold-500 text-obsidian-900 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                  VIP Romantic
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3
                  className="text-2xl font-serif text-obsidian-900 dark:text-ivory-50 mb-3"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t(pkg.titleKey, pkg.titleDefault)}
                </h3>

                <div className="flex flex-wrap gap-4 text-xs text-gold-600 font-medium mb-4">
                  <span className="flex items-center gap-1.5 bg-gold-500/10 px-3 py-1 rounded-lg">
                    <FaCalendarAlt /> {pkg.duration}
                  </span>
                  <span className="flex items-center gap-1.5 bg-gold-500/10 px-3 py-1 rounded-lg">
                    <FaMapMarkerAlt /> {pkg.destinations}
                  </span>
                </div>

                <p className="text-body-sm text-obsidian-600 dark:text-ivory-300 leading-relaxed mb-6 flex-grow">
                  {t(pkg.taglineKey, pkg.taglineDefault)}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gold-500/10 mt-auto">
                  <div>
                    <span className="text-caption text-obsidian-400 block text-xs uppercase">Starting From</span>
                    <span className="text-2xl font-bold text-gold-600">${pkg.price}</span>
                  </div>

                  <Link to={`/programs/honeymooners/${pkg.id}`}>
                    <Button variant="gold-glow" className="px-6 py-2.5 text-sm flex items-center gap-2">
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
