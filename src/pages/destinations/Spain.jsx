import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tour/TourCard';
import { useTours } from '../../hooks/useTours';

const Spain = () => {
  const { t } = useTranslation();
  const { tours: spainTours, loading } = useTours({ destination: 'spain' });

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('dest.spain.seoTitle', 'Luxury Spain Tours & Vacations | Dunas Travel')}</title>
        <meta name="description" content={t('dest.spain.seoDesc', 'Explore luxury journeys in Spain. Discover Andalusian charm, vibrant Barcelona, and Royal Madrid in bespoke comfort.')} />
      </Helmet>

      {/* Hero */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1600&q=80"
            alt="Spain Hero"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-obsidian-900/60"></div>
        </div>

        <motion.div
          className="relative z-10 container mx-auto px-6 text-center mt-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={fadeInUp} className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-4">
            {t('dest.spain.subtitle', 'Passión y Elegancia')}
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-display-xl text-ivory-50 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.spain.title', 'España')}
          </motion.h1>
        </motion.div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-ivory-50 rounded-2xl p-8 md:p-12 shadow-card mb-12 text-center">
          <h2 className="text-display-lg text-obsidian-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.spain.gridTitle', 'Discover Spain')}
          </h2>
          <p className="text-body-md text-obsidian-500 max-w-2xl mx-auto">
            {t('dest.spain.gridDesc', 'Immerse yourself in Spain’s extraordinary art, architecture, and gastronomy with our hand-crafted luxury travel experiences.')}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
            </div>
          ) : spainTours.length > 0 ? (
            spainTours.map((tour) => (
              <motion.div key={tour.id || tour.slug} variants={fadeInUp}>
                <TourCard tour={tour} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-obsidian-500">
              {t('dest.noTours', 'Custom Spain itineraries available on request.')}
            </div>
          )}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative py-24 mt-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1600&q=80')" }} />
        <div className="absolute inset-0 bg-obsidian-900/75" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t('dest.spain.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?")}
          </span>
          <h2 className="text-display-xl text-ivory-50 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.spain.ctaTitle', 'Let us design your perfect Spain tour')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t('dest.spain.ctaDesc', 'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tailor-a-tour">
              <Button variant="gold-glow" className="w-full sm:w-auto px-10 py-4">
                {t('home.tailorTour', 'Tailor Your Tour')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="glass" className="w-full sm:w-auto px-10 py-4">
                {t('nav.contact', 'Contact Us')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Spain;
