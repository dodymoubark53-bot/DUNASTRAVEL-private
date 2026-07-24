import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../animations/variants';
import { FaChevronRight } from 'react-icons/fa';
import { useCmsBlock } from '../hooks/useCmsBlock';

const tours = [
  {
    id: 'honeymoon-egypt',
    titleKey: 'honeymooners.egyptTitle',
    titleDefault: 'Honeymoon in Egypt',
    duration: '10 Days / 9 Nights',
    destinations: 'Cairo • Nile Cruise • Hurghada',
    img: 'https://hl-tourism.com/media/typecms/Honeymoon_Planning_Guide_2025_Complete_Resource.webp',
    taglineKey: 'honeymooners.egyptTagline',
    taglineDefault: 'A perfect trip to celebrate love, combining history, culture, romance, and unforgettable moments on the Red Sea.'
  }
];

const Honeymooners = () => {
  const { t } = useTranslation();
  const { data: cmsData } = useCmsBlock('destination_honeymooners');

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('honeymooners.title', 'Honeymooners Package | Dunas Travel')}</title>
        <meta name="description" content={t('honeymooners.desc', 'Celebrate your love with an unforgettable honeymoon in Egypt. Romance, history, and luxury await you.')} />
      </Helmet>

      {/* Hero */}
      <section className="relative w-full h-[500px] md:h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://hl-tourism.com/media/typecms/Honeymoon_Planning_Guide_2025_Complete_Resource.webp"
            alt="Romantic sunset"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,13,11,0.3), rgba(15,13,11,0.7))' }}></div>
        </div>
        <motion.div className="relative z-10 text-center px-6 mt-20" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.span variants={fadeInUp} className="text-gold-400 uppercase tracking-[4px] text-sm block mb-4 font-semibold">
            {cmsData?.subtitle || t('honeymooners.subtitle', 'Honeymooners Package')}
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl text-ivory-50 mb-6 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
            {cmsData?.heading || t('honeymooners.heading', 'Love Stories Begin Here')}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body-lg text-ivory-200 max-w-2xl mx-auto leading-relaxed">
            {cmsData?.heroDesc || t('honeymooners.heroDesc', 'Let us craft the most romantic chapter of your life. From the timeless pyramids to the tranquil Red Sea, every moment is designed for two.')}
          </motion.p>
        </motion.div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-obsidian-950 border-y border-gold-500/10 py-4 px-6 text-caption text-ivory-300">
        <div className="container mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-gold-500 transition-colors">{t('nav.home', 'Home')}</Link>
          <span className="rtl-flip text-[10px] text-gold-500/50"><FaChevronRight /></span>
          <Link to="/destinations/egypt" className="hover:text-gold-500 transition-colors">{t('dest.egypt.title', 'Egypt')}</Link>
          <span className="rtl-flip text-[10px] text-gold-500/50"><FaChevronRight /></span>
          <span className="text-gold-500 font-medium">{t('honeymooners.title', 'Honeymooners Package')}</span>
        </div>
      </div>

      {/* Tours Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl text-obsidian-900 font-display mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('honeymooners.sectionTitle', 'Our Honeymoon Packages')}
          </h2>
          <p className="text-body-md text-obsidian-500 max-w-xl mx-auto">
            {t('honeymooners.sectionDesc', 'Hand-picked romantic escapes designed for couples seeking magic, intimacy, and adventure.')}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {tours.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeInUp}
              className="bg-ivory-50 dark:bg-[#1a1a30] rounded-2xl overflow-hidden shadow-card group h-full flex flex-col transition-all md:col-span-2 lg:col-span-3 max-w-2xl mx-auto"
            >
              <div className="relative h-72 overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-gold-500 text-obsidian-900 text-sm uppercase px-4 py-1.5 rounded-full shadow-md font-bold">
                  {t('honeymooners.featured', 'Featured')}
                </div>
                <img
                  src={item.img}
                  alt={t(item.titleKey, item.titleDefault)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <div className="mb-3">
                  <span className="text-sm text-gold-500 uppercase tracking-widest font-semibold">{item.duration}</span>
                </div>
                <h3 className="text-2xl text-obsidian-900 dark:text-white mb-2 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t(item.titleKey, item.titleDefault)}
                </h3>
                <p className="text-sm text-obsidian-400 dark:text-gray-300 mb-3 font-medium">{item.destinations}</p>
                <p className="text-body-sm text-obsidian-500 dark:text-gray-300 mb-6 leading-relaxed">
                  {t(item.taglineKey, item.taglineDefault)}
                </p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <Link
                    to={`/programs/honeymooners/${item.id}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-obsidian-900 gold-btn-text font-bold px-6 py-3 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md border-2 border-gold-400"
                  >
                    {t('honeymooners.viewDetails', 'View Details')}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Honeymooners;
