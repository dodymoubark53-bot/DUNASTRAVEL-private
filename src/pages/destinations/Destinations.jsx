import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import { useDestinations } from '../../hooks/useDestinations';
import { useTours } from '../../hooks/useTours';
import TourCard from '../../components/tour/TourCard';

const Destinations = () => {
  const { t } = useTranslation();
  const { destinations, loading: destsLoading, error } = useDestinations();
  const { tours: allToursList, loading: toursLoading } = useTours({ limit: 100 });
  
  const loading = destsLoading || toursLoading;

  return <main className="min-h-screen bg-obsidian-50 pb-24">
    <Helmet>
      <title>{t('destinations.title', 'All Destinations | Luxury Travel')}</title>
      <meta name="description" content={t('destinations.metaDesc', 'Explore our handpicked luxury tours across our active destinations.')} />
    </Helmet>

    {/* Main Hero */}
    <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80"
          alt="Destinations Hero"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-obsidian-900/60 bg-gradient-to-t from-obsidian-900 to-transparent"></div>
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-6 text-center mt-12"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.span variants={fadeInUp} className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-4">
          {t('destinations.worldCurated', 'The World, Curated')}
        </motion.span>
        <motion.h1 variants={fadeInUp} className="text-display-xl text-ivory-50 mb-6">
          {t('destinations.heading', 'Our Destinations')}
        </motion.h1>
      </motion.div>
    </section>

    {/* Destinations Iteration */}
    <section className="container mx-auto px-6 -mt-16 relative z-20">
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
        </div>
      ) : error ? (
        <div className="mx-auto max-w-2xl rounded-2xl border border-red-300 bg-red-50 p-6 text-center text-red-800">
          {t('destinations.loadError', 'Destinations could not be loaded. Please try again later.')}
        </div>
      ) : destinations.length === 0 ? (
        <div className="mx-auto max-w-2xl rounded-2xl border border-obsidian-200 bg-white p-8 text-center text-obsidian-600">
          {t('destinations.empty', 'No destinations are currently available.')}
        </div>
      ) : (
        <div className="flex flex-col gap-24">
          {destinations.map((destination) => {
            const destTours = allToursList.filter(tour => tour.destination === destination.slug || tour.destination === destination.id);

            return (
              <motion.article 
                key={destination.id} 
                initial={{ opacity: 0, y: 40 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                {/* Destination Card / Header */}
                <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-12 shadow-card group">
                  {destination.image ? (
                    <img 
                      src={destination.image} 
                      alt={destination.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full bg-obsidian-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/90 via-obsidian-900/30 to-transparent flex flex-col justify-end p-8 md:p-12">
                    <span className="text-gold-500 uppercase tracking-widest text-caption mb-2">
                      {destination.toursCount} {t('destinations.tours', 'Tours')}
                    </span>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <h2 className="text-display-xl text-ivory-50 m-0 leading-none">
                        {destination.name}
                      </h2>
                      <Link to={`/destinations/${destination.slug}`} className="text-ivory-300 hover:text-gold-500 transition-colors uppercase tracking-widest text-sm font-semibold flex items-center gap-2">
                        {t('destinations.viewGuide', 'View Destination Guide')}
                        <span className="rtl-flip">&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Destination Brief */}
                <div className="mb-10 px-4 md:px-8">
                  <p className="text-obsidian-600 max-w-4xl text-body-lg">
                    {destination.brief || destination.description || t('destinations.descriptionPending', 'Explore our curated journeys for this destination.')}
                  </p>
                </div>

                {/* Tours Grid */}
                {destTours.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destTours.map((tour) => (
                      <TourCard key={tour.id} tour={tour} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-ivory-50 rounded-2xl border border-obsidian-900/5 shadow-sm">
                    <p className="text-obsidian-500 text-body-md font-medium">
                      {t('destinations.toursComingSoon', 'Bespoke itineraries for {{destination}} are currently being curated by our concierges. Contact us to design a custom journey.', { destination: destination.name })}
                    </p>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      )}
    </section>
  </main>;
};

export default Destinations;
