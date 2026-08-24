import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import { useDestinations } from '../../hooks/useDestinations';

const Destinations = () => {
  const { t } = useTranslation();
  const { destinations, loading, error } = useDestinations();

  return <main className="min-h-screen bg-obsidian-50 pb-24">
    <Helmet>
      <title>{t('destinations.title', 'All Destinations | Luxury Travel')}</title>
      <meta name="description" content={t('destinations.metaDesc', 'Explore our handpicked luxury tours across our active destinations.')} />
    </Helmet>

    <section className="bg-obsidian-900 px-6 py-24 text-center text-ivory-50 md:py-32">
      <motion.div className="container mx-auto" variants={staggerContainer} initial="hidden" animate="visible">
        <motion.span variants={fadeInUp} className="inline-block font-body text-sm uppercase tracking-[0.2em] text-gold-500">{t('destinations.worldCurated', 'The World, Curated')}</motion.span>
        <motion.h1 variants={fadeInUp} className="mt-4 text-display-xl">{t('destinations.heading', 'Our Destinations')}</motion.h1>
      </motion.div>
    </section>

    <section className="container mx-auto px-6 py-16">
      {loading ? <div className="flex justify-center py-24"><div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-gold-500" /></div> : error ? <div className="mx-auto max-w-2xl rounded-2xl border border-red-300 bg-red-50 p-6 text-center text-red-800">{t('destinations.loadError', 'Destinations could not be loaded. Please try again later.')}</div> : destinations.length === 0 ? <div className="mx-auto max-w-2xl rounded-2xl border border-obsidian-200 bg-white p-8 text-center text-obsidian-600">{t('destinations.empty', 'No destinations are currently available.')}</div> : <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {destinations.map((destination) => <motion.article key={destination.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="group overflow-hidden rounded-2xl bg-white shadow-card">
          <div className="relative h-80 bg-obsidian-800">
            {destination.image ? <img src={destination.image} alt={destination.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : null}
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-obsidian-900/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8 text-ivory-50"><p className="text-sm font-semibold uppercase tracking-widest text-gold-400">{destination.toursCount} {t('destinations.tours', 'Tours')}</p><h2 className="mt-2 text-display-lg">{destination.name}</h2></div>
          </div>
          <div className="p-8"><p className="line-clamp-3 text-obsidian-600">{destination.brief || destination.description || t('destinations.descriptionPending', 'Explore our curated journeys for this destination.')}</p><Link to={`/destinations/${destination.slug}`} className="mt-6 inline-flex font-semibold uppercase tracking-wider text-gold-700 hover:text-gold-500">{t('destinations.viewGuide', 'View Destination Guide')} <span className="ml-2 rtl-flip">→</span></Link></div>
        </motion.article>)}
      </div>}
    </section>
  </main>;
};

export default Destinations;
