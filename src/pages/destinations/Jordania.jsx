import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import Button from '../../components/ui/Button';
import { useTours } from '../../hooks/useTours';
import { tours } from '../../data/tours';

const HERO_IMG = 'https://cdn.al-ain.com/lg/images/2022/11/24/62-021616-best-tourist-areas-jordan-4.jpeg';

const Jordania = () => {
  const { t } = useTranslation();
  const staticPrograms = tours.filter((t) => t.destination === 'Jordania'.toLowerCase());
  const { tours: programs, loading } = useTours({ destination: 'Jordania'.toLowerCase() }, staticPrograms);

  return (
    <div className="w-full min-h-screen bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('dest.jordan.seoTitle', 'Luxury Jordan Tours & Vacations | Dunas Travel')}</title>
        <meta name="description" content={t('dest.jordan.seoDesc', 'Explore luxury journeys in Jordan. Custom itineraries coming soon.')} />
      </Helmet>

      <section className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={HERO_IMG} alt={t('dest.jordan.title', 'Jordan')} className="w-full h-full object-cover object-center" loading="lazy" />
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15,13,11,0.3), rgba(15,13,11,0.65))' }}></div>
        </div>
        <motion.div className="relative z-10 container mx-auto px-6 text-center mt-20" variants={staggerContainer} initial="hidden" animate="visible">
          <motion.span variants={fadeInUp} className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-4">
            {t('dest.jordan.subtitle', 'The rose-red kingdom')}
          </motion.span>
          <motion.h1 variants={fadeInUp} className="text-display-xl text-ivory-50 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.jordan.title', 'Jordan')}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body-lg text-ivory-300 max-w-2xl mx-auto">
            {t('dest.jordan.desc', 'From the rose-red city of Petra to the otherworldly desert of Wadi Rum and the healing waters of the Dead Sea, Jordan is a land of timeless wonders.')}
          </motion.p>
        </motion.div>
      </section>

      <section className="container mx-auto px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-body-lg text-obsidian-500 leading-relaxed">
            {t('dest.jordan.brief', 'Jordan is a treasure trove of ancient history and natural beauty. Our programs take you from the bustling streets of Amman to the silent deserts of Wadi Rum, the magnificent ruins of Petra, and the rejuvenating shores of the Dead Sea and Red Sea.')}
          </p>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-display-lg text-obsidian-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.jordan.ourPrograms', 'Our Programs')}
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
            programs.map((prog) => (
            <motion.div
              key={prog.id}
              variants={fadeInUp}
              className="bg-ivory-50 rounded-xl overflow-hidden flex flex-col h-full group shadow-card border border-gold-500/10 hover:shadow-lg transition-shadow"
            >
              <Link to={`/programs/jordan/${prog.slug}`} className="block relative h-[240px] overflow-hidden">
                <div className="absolute top-4 left-4 z-10 bg-obsidian-900/80 backdrop-blur-md text-gold-500 text-caption px-4 py-1.5 rounded-full border border-gold-500/30 shadow-glass">
                  {prog.minPax} · {prog.duration.split('/')[0].trim()}
                </div>
                <img
                  src={prog.images[0]}
                  alt={prog.title}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <div className="p-6 flex flex-col flex-grow">
                <span className="text-caption text-gold-600 uppercase tracking-widest mb-1 block">{prog.code}</span>
                <Link to={`/programs/jordan/${prog.slug}`}>
                  <h3 className="text-display-md text-obsidian-900 mb-3 line-clamp-2 group-hover:text-gold-700 transition-colors">
                    {prog.title}
                  </h3>
                </Link>
                <p className="text-body-sm text-obsidian-500 line-clamp-3 mb-4 flex-grow">{prog.overview}</p>

                <div className="border-t border-gold-500/10 pt-4 mb-4">
                  <ul className="grid grid-cols-1 gap-y-1.5">
                    {(Array.isArray(prog.highlights) ? prog.highlights : []).slice(0, 3).map((hl, idx) => (
                      <li key={idx} className="text-[12px] text-obsidian-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0"></span>
                        <span className="truncate">{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gold-500/10 mt-auto">
                  <span className="text-caption text-obsidian-300">{prog.duration}</span>
                  <Link to={`/programs/jordan/${prog.slug}`}>
                    <Button variant="outline-gold" className="px-6 py-2 flex items-center gap-2">
                      {t('tourCard.viewDetails', 'View Details')} <span className="rtl-flip">&rarr;</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))
          )}
        </motion.div>
      </section>

      {/* Hotels */}
      <section className="container mx-auto px-6 mt-24">
        <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="text-center mb-12">
            <h2 className="text-display-lg text-obsidian-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('dest.jordan.hotelsTitle', 'Accommodation')}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-4"></div>
            <p className="text-body-md text-obsidian-500 mt-6 max-w-2xl mx-auto">
              {t('dest.jordan.hotelsDesc', 'Based on availability, accommodation in one of the following hotels in each destination.')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {['amman', 'petra', 'wadiRum', 'aqaba', 'deadSea'].map((city) => {
              const hotelListKey = `hotelList${city.charAt(0).toUpperCase() + city.slice(1)}`;
              return (
                <div key={city} className="bg-ivory-50 rounded-xl shadow-sm border border-gold-500/10 overflow-hidden">
                  <div className="bg-obsidian-900 px-4 py-3">
                    <h3 className="text-gold-500 font-semibold text-xs md:text-sm uppercase tracking-widest flex items-center gap-2">
                      <FaMapMarkerAlt className="flex-shrink-0 text-xs" />
                      {t(`dest.jordan.hotelCities.${city}`, city)}
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-body-sm text-obsidian-700">
                      {t(`dest.jordan.${hotelListKey}`, '')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Includes / Excludes */}
      <section className="container mx-auto px-6 mt-24">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          <div className="bg-ivory-50 dark:bg-[#1a1a30] rounded-xl p-8 border border-gold-500/10 dark:border-amber-700">
            <h3 className="text-display-md text-2xl text-obsidian-900 dark:text-black mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('tourDetail.included', 'What is Included')}
            </h3>
            <ul className="flex flex-col gap-3">
              {t('dest.jordan.includesList', { returnObjects: true }).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-body-md text-obsidian-700 dark:text-black">
                  <FaCheckCircle className="text-sage-500 dark:text-green-400 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-caption text-obsidian-400 mt-4 italic">
              {t('dest.jordan.mandatoryFees', '')}
            </p>
          </div>
          <div className="bg-ivory-50 dark:bg-[#1a1a30] rounded-xl p-8 border border-gold-500/10 dark:border-amber-700">
            <h3 className="text-display-md text-2xl text-obsidian-900 dark:text-black mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('tourDetail.excluded', 'What is Excluded')}
            </h3>
            <ul className="flex flex-col gap-3">
              {t('dest.jordan.excludesList', { returnObjects: true }).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-body-md text-obsidian-700 dark:text-black">
                  <FaTimes className="text-red-400 dark:text-red-300 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* Children Policy */}
      <section className="container mx-auto px-6 mt-24">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-display-lg text-obsidian-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('dest.jordan.childrenTitle', 'Children Policy')}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-4"></div>
          </div>
          <div className="bg-ivory-50 rounded-xl p-6 border border-gold-500/10 space-y-3 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
              <p className="text-body-md text-obsidian-700">{t('dest.jordan.children_0to2', '')}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
              <p className="text-body-md text-obsidian-700">{t('dest.jordan.children_3to10', '')}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
              <p className="text-body-md text-obsidian-700">{t('dest.jordan.children_11plus', '')}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Cancellation Policy */}
      <section className="container mx-auto px-6 mt-24">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-display-lg text-obsidian-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('dest.jordan.cancellationTitle', 'Cancellation Policy')}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-4"></div>
          </div>
          <div className="bg-ivory-50 rounded-xl p-6 border border-gold-500/10 space-y-3 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
              <p className="text-body-md text-obsidian-700">{t('dest.jordan.cancellationHighSeason', '')}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
              <p className="text-body-md text-obsidian-700">{t('dest.jordan.cancellationLowSeason', '')}</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Visa & General Notes */}
      <section className="container mx-auto px-6 mt-24">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h2 className="text-display-lg text-obsidian-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('dest.jordan.visaTitle', 'Visa Policy & Notes')}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-4"></div>
          </div>
          <div className="bg-ivory-50 rounded-xl p-6 border border-gold-500/10 space-y-3 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
              <p className="text-body-md text-obsidian-700">{t('dest.jordan.visaFreeGroup', '')}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
              <p className="text-body-md text-obsidian-700">{t('dest.jordan.visaPassport', '')}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
              <p className="text-body-md text-obsidian-700">{t('dest.jordan.visaLatinNationalities', '')}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
              <p className="text-body-md text-obsidian-700">{t('dest.jordan.visaTransportNote', '')}</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-gold-500 mt-2 flex-shrink-0" />
              <p className="text-body-md text-obsidian-700">{t('dest.jordan.visaPriceValidity', '')}</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="relative py-24 mt-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_IMG})` }} />
        <div className="absolute inset-0 bg-obsidian-900/75" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t('dest.jordan.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?")}
          </span>
          <h2 className="text-display-xl text-ivory-50 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.jordan.ctaTitle', 'Let us design your perfect Jordan tour')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t('dest.jordan.ctaDesc', 'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.')}
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

export default Jordania;

