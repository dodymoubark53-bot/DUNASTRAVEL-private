import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tour/TourCard';
import { useTours } from '../../hooks/useTours';
import { tours } from '../../data/tours';

const HERO_IMG = 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1920&q=80';

const Turquia = () => {
  const { t } = useTranslation();
  const staticPrograms = tours.filter((t) => t.destination === 'Turquia'.toLowerCase());
  const { tours: programs, loading } = useTours({ destination: 'Turquia'.toLowerCase() }, staticPrograms);

  return (
    <div className="w-full min-h-screen bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('dest.turkey.seoTitle', 'Luxury Turkey Tours & Vacations | Dunas Travel')}</title>
        <meta name="description" content={t('dest.turkey.seoDesc', 'Explore luxury journeys in Turkey. Custom itineraries coming soon.')} />
      </Helmet>

      {/* Hero */}
      <section className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt={t('dest.turkey.title', 'Turkey')} className="w-full h-full object-cover object-center" loading="lazy" />
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15,13,11,0.3), rgba(15,13,11,0.65))' }}></div>
        </div>
        <motion.div className="relative z-10 container mx-auto px-6 text-center mt-20" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.span variants={fadeInUp} className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-4">
            {t('dest.turkey.subtitle', 'Where East meets West')}
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-display-xl text-ivory-50 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.turkey.title', 'Turkey')}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body-lg text-ivory-300 max-w-2xl mx-auto">
            {t('dest.turkey.desc', 'From the majestic Hagia Sophia to the fairy chimneys of Cappadocia and the turquoise waters of the Aegean, Turkey bridges continents and millennia.')}
          </motion.p>
        </motion.div>
      </section>

      {/* Brief & Programs Grid */}
      <section className="container mx-auto px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-body-lg text-obsidian-500 leading-relaxed">
            {t('dest.turkey.brief', 'Turkey is where East meets West, offering a rich tapestry of history, culture, and natural beauty. Our programs span from Istanbul\'s imperial treasures to the surreal landscapes of Cappadocia, the thermal terraces of Pamukkale, and the ancient ruins of Ephesus and Troy.')}
          </p>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-display-lg text-obsidian-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.turkey.ourPrograms', 'Our Programs')}
          </h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto mt-4"></div>
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
            programs.map((prog) => {
            const tourObj = {
              id: prog.id,
              slug: prog.slug,
              destination: 'turkey',
              title: prog.title,
              description: prog.overview,
              duration: prog.duration,
              price: prog.raw?.price || 899,
              images: prog.images,
              type: prog.raw?.type || 'Cultural Tour',
              code: prog.code,
              minPax: prog.minPax,
              transportOptions: prog.transportOptions,
            };
            return (
              <TourCard
                key={prog.id}
                tour={tourObj}
                linkBase="/programs/turkey"
                highlights={Array.isArray(prog.highlights) ? prog.highlights : []}
              />
            );
          })
          )}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative py-24 mt-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="absolute inset-0 bg-obsidian-900/75" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t('dest.turkey.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?")}
          </span>
          <h2 className="text-display-xl text-ivory-50 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.turkey.ctaTitle', 'Let us design your perfect Turkey tour')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t('dest.turkey.ctaDesc', 'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.')}
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

export default Turquia;

