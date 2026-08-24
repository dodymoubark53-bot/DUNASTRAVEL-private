import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tour/TourCard';
import { useTours } from '../../hooks/useTours';
import { useCmsBlock } from '../../hooks/useCmsBlock';
import { trackEvent } from '../../utils/analytics';
import { useEffect } from 'react';
import SEOHead from '../../components/seo/SEOHead';

const HERO_IMG = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80';

const Dubai = () => {
  const { t } = useTranslation();

  useEffect(() => {
    sessionStorage.setItem('dunas_origin_interface', 'dubai');
    trackEvent('interface_view', { interfaceSlug: 'dubai' });
  }, []);

  const { tours: programs, loading } = useTours({ destination: 'dubai' });
  const { data: cmsData } = useCmsBlock('destination_dubai');

  const dubaiSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: 'Dubai & Emirates',
    description: t('dest.dubai.seoDesc', 'Discover the dazzling metropolis of Dubai — a city of futuristic skyscrapers, golden deserts, and world-class luxury.'),
    image: HERO_IMG,
    touristType: 'Luxury Travelers',
    includesAttraction: [
      { '@type': 'TouristAttraction', name: 'Burj Khalifa' },
      { '@type': 'TouristAttraction', name: 'Palm Jumeirah' },
      { '@type': 'TouristAttraction', name: 'Dubai Desert Safari' },
      { '@type': 'TouristAttraction', name: 'Dubai Marina Luxury Yacht' },
      { '@type': 'TouristAttraction', name: 'Museum of the Future' }
    ]
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dunastravel.com/' },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: 'https://dunastravel.com/destinations' },
      { '@type': 'ListItem', position: 3, name: 'Dubai', item: 'https://dunastravel.com/destinations/dubai' }
    ]
  };

  return (
    <div className="w-full min-h-screen bg-obsidian-50 pb-24">
      <SEOHead
        title={t('dest.dubai.seoTitle', 'Luxury Dubai Tours & Vacations')}
        description={t('dest.dubai.seoDesc', 'Discover the dazzling metropolis of Dubai — a city of futuristic skyscrapers, golden deserts, and world-class luxury.')}
        ogImage={HERO_IMG}
        schema={[dubaiSchema, breadcrumbSchema]}
      />

      {/* Hero */}
      <section className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt={t('dest.dubai.title', 'Dubai')} className="w-full h-full object-cover object-center" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15,13,11,0.3), rgba(15,13,11,0.65))' }}></div>
        </div>
        <motion.div className="relative z-10 container mx-auto px-6 text-center mt-20" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.span variants={fadeInUp} className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-4">
            {cmsData?.subtitle || t('dest.dubai.subtitle', 'Modern luxury redefined')}
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-display-xl text-ivory-50 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {cmsData?.title || t('dest.dubai.title', 'Dubai')}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body-lg text-ivory-300 max-w-2xl mx-auto">
            {cmsData?.desc || t('dest.dubai.desc', 'From the towering Burj Khalifa to the golden dunes of the Arabian Desert, Dubai is a city that defies imagination.')}
          </motion.p>
        </motion.div>
      </section>

      {/* Brief & Programs Grid */}
      <section className="container mx-auto px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-body-lg text-obsidian-500 leading-relaxed">
            {t('dest.dubai.brief', 'Dubai blends futuristic innovation with timeless Arabian hospitality. Whether you are exploring the historic Al Bastakiya district, dune bashing in the desert, or dining at a Michelin-starred restaurant, every moment in Dubai is extraordinary.')}
          </p>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-display-lg text-obsidian-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.dubai.ourPrograms', 'Our Programs')}
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
              destination: 'dubai',
              title: prog.title,
              description: prog.overview,
              duration: prog.duration,
              price: prog.price,
              images: prog.images,
              type: prog.raw?.type || 'Dubai Tour',
              code: prog.code,
              minPax: prog.minPax,
            };
            return (
              <TourCard
                key={prog.id}
                tour={tourObj}
                linkBase="/programs/dubai"
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
            {t('dest.dubai.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?")}
          </span>
          <h2 className="text-display-xl text-ivory-50 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.dubai.ctaTitle', 'Let us design your perfect Dubai tour')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t('dest.dubai.ctaDesc', 'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.')}
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

export default Dubai;
