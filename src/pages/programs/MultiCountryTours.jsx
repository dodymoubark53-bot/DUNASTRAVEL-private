import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa';
import TourCard from '../../components/tour/TourCard';
import { useTours } from '../../hooks/useTours';
import { multiCountryTours } from '../../data/multiCountryTours';
import { trackEvent } from '../../utils/analytics';
import { useEffect } from 'react';

const MultiCountryTours = () => {
  const { t } = useTranslation();

  useEffect(() => {
    sessionStorage.setItem('dunas_origin_interface', 'multi-country');
    trackEvent('interface_view', { interfaceSlug: 'multi-country' });
  }, []);

  const { tours: apiTours, loading } = useTours({ category: 'multi-country' }, multiCountryTours);

  return (
    <>
      <Helmet>
        <title>{t('programs.multiCountryTitle', 'Multi-Country Tours')} | Dunas Travel</title>
        <meta name="description" content={t('programs.multiCountryDesc', 'Multi-Country Tours')} />
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-obsidian-950 border-y border-gold-500/10 py-4 px-6 text-caption text-ivory-300">
        <div className="container mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-gold-500 transition-colors">{t('nav.home', 'Home')}</Link>
          <span className="rtl-flip text-[10px] text-gold-500/50"><FaChevronRight /></span>
          <Link to="/destinations/egypt" className="hover:text-gold-500 transition-colors">{t('dest.egypt.title', 'Egypt')}</Link>
          <span className="rtl-flip text-[10px] text-gold-500/50"><FaChevronRight /></span>
          <span className="text-gold-500 font-medium">{t('nav.multiCountry', 'Multi-Country Tours')}</span>
        </div>
      </div>

      <section className="relative min-h-screen bg-ivory-50 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-display-xl text-obsidian-900 font-display font-bold mb-4">
              {t('programs.multiCountryTitle', 'Multi-Country Tours')}
            </h1>
            <p className="text-body-lg text-obsidian-500 max-w-2xl mx-auto">
              {t('programs.multiCountrySubtitle', 'Epic Cross-Border Odysseys')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
              </div>
            ) : (
              apiTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  linkBase="/programs/multi-country"
                />
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default MultiCountryTours;
