import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import TourCard from '../../components/tour/TourCard';
import Button from '../../components/ui/Button';
import { tours } from '../../data/tours';
import { useTours } from '../../hooks/useTours';
import { trackEvent } from '../../utils/analytics';
import { useEffect } from 'react';

// ── destination image constants ────────────────────────────────────────────
const HERO_IMG =
  'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1920&q=80';
const SANTORINI_IMG =
  'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80';

const Grecia = () => {
  const { t } = useTranslation();

  useEffect(() => {
    sessionStorage.setItem('dunas_origin_interface', 'greece');
    trackEvent('interface_view', { interfaceSlug: 'greece' });
  }, []);

  const staticgreekTours = tours.filter((tour) => tour.destination === 'greece');
  const { tours: greekTours, loading } = useTours({ destination: 'greece' }, staticgreekTours);

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('dest.greece.seoTitle', 'Luxury Greece Tours & Vacations | Dunas Travel')}</title>
        <meta
          name="description"
          content={t(
            'dest.greece.seoDesc',
            'Discover the best of Greece with Dunas Travel — Athens, Mykonos, Santorini and Crete in one luxury itinerary with Spanish-speaking guides.',
          )}
        />
      </Helmet>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMG}
            alt={t('dest.greece.heroAlt', 'Santorini, Greece')}
            className="w-full h-full object-cover object-center"
            loading="eager"
            fetchpriority="high"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(to bottom, rgba(15,13,11,0.3), rgba(15,13,11,0.70))',
            }}
          />
        </div>

        <motion.div
          className="relative z-10 container mx-auto px-6 text-center mt-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={fadeInUp}
            className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-4"
          >
            {t('dest.greece.subtitle', 'Mitos & Horizontes Azules')}
          </motion.span>
          <motion.h1
            variants={fadeInUp}
            className="text-display-xl text-ivory-50 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.greece.title', 'Grecia')}
          </motion.h1>
          <motion.p
            variants={fadeInUp}
            className="text-body-lg text-ivory-300 max-w-2xl mx-auto mb-8"
          >
            {t(
              'dest.greece.desc',
              'De la majestuosa Acrópolis de Atenas a los atardeceres eternos de Santorini y las playas cristalinas de Mykonos y Creta, Grecia es el viaje que siempre soñaste.',
            )}
          </motion.p>
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 bg-gold-500/20 border border-gold-500/40 text-gold-400 px-6 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
              {t('dest.greece.departures', '🗓 Salidas diarias · 1 Abril – 9 Octubre')}
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Destination Highlights Strip ────────────────────────────────── */}
      <section className="bg-obsidian-900 py-3">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-ivory-300 text-sm">
            {[
              { key: 'athens', icon: '🏛', label: 'Atenas' },
              { key: 'mykonos', icon: '🌊', label: 'Mykonos' },
              { key: 'santorini', icon: '🌅', label: 'Santorini' },
              { key: 'crete', icon: '🏖', label: 'Creta' }
            ].map((item) => (
              <span key={item.key} className="flex items-center gap-2 font-medium">
                <span>{item.icon}</span> {t(`dest.greece.city.${item.key}`, item.label)}
              </span>
            ))}
            <span className="border-l border-ivory-50/10 pl-8 text-gold-500 font-semibold">
              {t('dest.greece.duration', '9 Días / 8 Noches')}
            </span>
            <span className="text-gold-500 font-semibold">{t('dest.greece.category', 'Primera Clase')}</span>
          </div>
        </div>
      </section>

      {/* ── Brief & Tours Grid ──────────────────────────────────────────── */}
      <section className="container mx-auto px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t('dest.greece.ourJourneys', 'NUESTROS PROGRAMAS')}
          </span>
          <h2
            className="text-display-lg text-obsidian-900 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.greece.toursTitle', 'Programas a Grecia')}
          </h2>
          <p className="text-body-lg text-obsidian-500 leading-relaxed">
            {t(
              'dest.greece.brief',
              'Grecia es el destino perfecto para quienes buscan historia milenaria, paisajes de ensueño y gastronomía mediterránea. Nuestros programas combinan las principales islas con la capital en un único viaje sin complicaciones, con guías en español y todos los ferries incluidos.',
            )}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
            </div>
          ) : (
            greekTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))
          )}
        </motion.div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${SANTORINI_IMG})` }}
        />
        <div className="absolute inset-0 bg-obsidian-900/75" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t('dest.greece.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?")}
          </span>
          <h2
            className="text-display-xl text-ivory-50 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.greece.ctaTitle', 'Let us design your perfect Greece tour')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t('dest.greece.ctaDesc', 'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tours/lo-mejor-de-grecia-9d">
              <Button variant="gold-glow" className="w-full sm:w-auto px-10 py-4">
                {t('dest.greece.ctaBtn', 'Ver Programa Completo')}
              </Button>
            </Link>
            <Link to="/tailor-a-tour">
              <Button variant="glass" className="w-full sm:w-auto px-10 py-4">
                {t('home.tailorTour', 'Personalizar Viaje')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Grecia;

