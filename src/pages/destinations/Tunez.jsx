import { Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTours } from '../../hooks/useTours';
import { allTours } from '../../data/tours';
import TourCard from '../../components/tour/TourCard';
import Button from '../../components/ui/Button';

const Tunez = () => {
  const { t, i18n } = useTranslation();

  const staticTunisiaTours = allTours.filter(
    (tour) => tour.destination === 'tunisia' && (tour.language === 'multi' || tour.language === i18n.language)
  );
  const { tours: tunisiaToursList, loading } = useTours({ destination: 'tunisia' }, staticTunisiaTours);

  return (
    <div className="w-full min-h-screen bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('dest.tunisia.seoTitle', 'Luxury Tunisia Tours & Vacations | Dunas Travel')}</title>
        <meta name="description" content={t('dest.tunisia.seoDesc', 'Explore luxury journeys in Tunisia. From ancient Roman ruins to the Sahara Desert, discover our exclusive travel experiences.')} />
      </Helmet>

      <section className="relative pt-32 pb-16 text-center px-6 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/imgs/destinations/tunisia.webp')" }} />
        <div className="absolute inset-0 bg-obsidian-900/70" />
        <div className="relative z-10 container mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display-xl text-ivory-50 mb-4 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.tunisia.title', 'Tunisia')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-body-lg text-gold-400 font-medium tracking-wide max-w-2xl mx-auto"
          >
            {t('dest.tunisia.subtitle', 'Where ancient history meets the boundless Sahara in ultimate luxury.')}
          </motion.p>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
            </div>
          ) : tunisiaToursList.length > 0 ? (
            tunisiaToursList.map((tour, idx) => (
              <Suspense key={tour.id} fallback={<div className="h-[400px] bg-obsidian-100 rounded-xl animate-pulse"></div>}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <TourCard tour={tour} />
                </motion.div>
              </Suspense>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-body-lg text-obsidian-500">{t('dest.tunisia.noTours', 'Tours are currently being updated. Please check back soon.')}</p>
            </div>
          )}
        </div>
      </section>

      <section className="relative py-24 mt-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/imgs/destinations/tunisia.webp')" }} />
        <div className="absolute inset-0 bg-obsidian-900/75" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t('dest.tunisia.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?")}
          </span>
          <h2 className="text-display-xl text-ivory-50 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.tunisia.ctaTitle', 'Let us design your perfect Tunisia tour')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t('dest.tunisia.ctaDesc', 'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.')}
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

export default Tunez;
