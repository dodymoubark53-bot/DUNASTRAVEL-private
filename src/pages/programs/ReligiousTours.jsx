import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FaStar, FaRegStar, FaStarHalfAlt, FaChevronRight, FaMapMarkerAlt,
  FaClock, FaPray
} from 'react-icons/fa';
import { services } from '../../data/services';
import Button from '../../components/ui/Button';
import { useCurrency } from '../../context/CurrencyContext';
import { staggerContainer, cardHover, fadeInUp } from '../../animations/variants';

// Filter only religious category
const religiousTours = services.filter(s => s.category === 'religious');

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-gold-500" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-gold-500" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-obsidian-300" />);
    }
  }
  return <div className="flex items-center gap-1 text-sm">{stars}</div>;
};

const ReligiousTours = () => {
  const { t } = useTranslation();
  const { formatPrice } = useCurrency();

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('nav.religious', 'Religious Programs')} | {t('site.luxuryTravel', 'Dunas Travel')}</title>
        <meta
          name="description"
          content={t(
            'programs.religiousMetaDesc',
            'Embark on a sacred journey through ancient Coptic monasteries in Egypt and the holy sites of Jordan. Deeply spiritual, meticulously organized pilgrimages with expert guides.'
          )}
        />
      </Helmet>

      {/* 1. Parallax Hero Section */}
      <section className="relative w-full h-[450px] md:h-[650px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://thf.bing.com/th/id/R.e047649d8bd183efbdd320d17de8a8b1?rik=d18ZW0xT%2fK31lQ&pid=ImgRaw&r=0"
            alt="Religious Tours & Pilgrimages"
            className="w-full h-full object-cover object-center scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-900/60 via-obsidian-900/75 to-obsidian-950" />
        </div>

        <motion.div
          className="relative z-10 text-center px-6 mt-20 max-w-4xl"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={fadeInUp}
            className="text-gold-500 uppercase tracking-widest text-caption font-semibold block mb-4"
          >
            {t('programs.religiousSubtitle', 'Sacred Journeys & Pilgrimages')}
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="text-display-xl md:text-display-2xl text-ivory-50 font-display mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('nav.religious', 'Religious Programs')}
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-body-lg md:text-xl text-ivory-200 max-w-2xl mx-auto leading-relaxed"
          >
            {t(
              'programs.religiousLead',
              'Walk in the footsteps of the Holy Family through Egypt\'s ancient Coptic monasteries and discover the sacred wonders of the Holy Land. Expertly guided, spiritually enriching journeys crafted with absolute care.'
            )}
          </motion.p>
        </motion.div>
      </section>

      {/* 2. Breadcrumb Navigation */}
      <div className="bg-obsidian-950 border-y border-gold-500/10 py-4 px-6 text-caption text-ivory-300">
        <div className="container mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-gold-500 transition-colors">{t('nav.home', 'Home')}</Link>
          <span className="rtl-flip text-[10px] text-gold-500/50"><FaChevronRight /></span>
          <Link to="/destinations/egypt" className="hover:text-gold-500 transition-colors">{t('dest.egypt.title', 'Egypt')}</Link>
          <span className="rtl-flip text-[10px] text-gold-500/50"><FaChevronRight /></span>
          <span className="text-gold-500 font-medium">{t('nav.religious', 'Religious Programs')}</span>
        </div>
      </div>

      {/* 3. Spiritual Values Banner */}
      <section className="container mx-auto px-6 py-12">
        <div className="bg-ivory-50 rounded-xl border border-gold-500/10 shadow-card p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              {
                icon: '✝️',
                title: t('programs.relVal1Title', 'Coptic Heritage'),
                desc: t('programs.relVal1Desc', 'Trace ancient routes of the Holy Family through Egypt\'s sacred monasteries')
              },
              {
                icon: '🕊️',
                title: t('programs.relVal2Title', 'Spiritual Immersion'),
                desc: t('programs.relVal2Desc', 'Deeply meaningful visits with expert theologian guides who bring history to life')
              },
              {
                icon: '🙏',
                title: t('programs.relVal3Title', 'Complete Care'),
                desc: t('programs.relVal3Desc', 'All logistics handled — visas, hotels, transfers and full pilgrimage support included')
              }
            ].map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-3">
                <span className="text-4xl">{val.icon}</span>
                <h3 className="text-display-sm text-obsidian-900 font-semibold">{val.title}</h3>
                <p className="text-body-sm text-obsidian-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Tours Grid */}
      <section className="container mx-auto px-6 pb-16">
        {religiousTours.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {religiousTours.map((tour) => (
              <motion.div
                key={tour.id}
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="bg-ivory-50 rounded-xl overflow-hidden flex flex-col h-full group shadow-card border border-gold-500/10"
              >
                {/* Image */}
                <div className="relative h-[280px] overflow-hidden">
                  {/* Type Badge (top-left) */}
                  <div className="absolute top-4 left-4 z-10 bg-obsidian-900/80 backdrop-blur-md text-gold-500 text-caption px-4 py-1.5 rounded-full border border-gold-500/30 shadow-glass">
                    {t('programs.religiousType', 'Religious Tour')}
                  </div>

                  {/* Location badge (top-right) */}
                  <div className="absolute top-4 right-4 z-10 bg-obsidian-900/60 backdrop-blur-md text-ivory-50 text-caption px-3 py-1 rounded-full border border-white/10 shadow-glass flex items-center gap-1.5">
                    <FaMapMarkerAlt size={10} className="text-gold-500" />
                    <span className="text-[11px] font-medium">{t(`data.${tour.location}`, tour.location)}</span>
                  </div>

                  <img
                    src={tour.images[0]}
                    alt={t(`data.${tour.title}`, tour.title)}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] cinematic-transition"
                    loading="lazy"
                  />

                  {/* Cinematic dark hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Duration overlay (bottom) */}
                  {tour.itinerary && (
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="bg-obsidian-950/80 backdrop-blur-sm border border-gold-500/20 text-ivory-50 text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-glass">
                        <FaClock size={10} className="text-gold-500" />
                        <span>{tour.itinerary.length} {t('tour.days', 'Days')}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-caption text-gold-600 uppercase tracking-widest mb-1 block">
                    {tour.location}
                  </span>

                  <Link to={`/services/religious/${tour.slug}`}>
                    <h3
                      className="text-display-md text-obsidian-900 mb-3 line-clamp-2 group-hover:text-gold-700 transition-colors"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {t(tour.title, tour.title)}
                    </h3>
                  </Link>

                  <p className="text-body-sm text-obsidian-500 line-clamp-3 mb-4 flex-grow">
                    {t(tour.shortDesc, tour.shortDesc)}
                  </p>

                  {/* Star Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    {renderStars(tour.rating)}
                    <span className="text-caption text-obsidian-900 font-semibold ml-1">
                      {tour.rating.toFixed(1)}
                    </span>
                    {tour.reviewCount && (
                      <span className="text-caption text-obsidian-300">
                        ({tour.reviewCount} {t('tourCard.reviews', 'reviews')})
                      </span>
                    )}
                  </div>

                  {/* Key Highlights */}
                  {tour.highlights && tour.highlights.length > 0 && (
                    <div className="border-t border-gold-500/10 pt-4 mb-4">
                      <ul className="grid grid-cols-1 gap-y-1.5">
                        {tour.highlights.slice(0, 3).map((hl, idx) => (
                          <li key={idx} className="text-[12px] text-obsidian-500 flex items-start gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0 mt-1.5 flex-shrink-0"></span>
                            <span className="line-clamp-1">{t(hl, hl)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Price & CTA Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gold-500/10 mt-auto">
                    <div>
                      <span className="block text-caption text-obsidian-300 mb-1">
                        {t('tourCard.from', 'from')}
                      </span>
                      <span className="text-display-md text-gold-700">
                        {formatPrice(tour.price)}
                      </span>
                    </div>

                    <Link to={`/services/religious/${tour.slug}`}>
                      <Button variant="outline-gold" className="px-6 py-2 flex items-center gap-2">
                        {t('tourCard.book', 'Book')} <span className="rtl-flip">&rarr;</span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 bg-ivory-50 rounded-xl border border-gold-500/10 p-8 shadow-card">
            <FaPray size={48} className="text-gold-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-display-md text-2xl text-obsidian-900 font-display mb-2">
              {t('programs.noReligiousFound', 'No Religious Programs Found')}
            </h3>
            <p className="text-body-md text-obsidian-500 max-w-md mx-auto mb-6">
              {t('programs.noReligiousDesc', 'We are currently updating our religious programs catalog. Please contact us for a tailor-made pilgrimage itinerary.')}
            </p>
            <Link to="/tailor-a-tour">
              <Button variant="gold-glow">{t('nav.tailorMade', 'Request Custom Tour')}</Button>
            </Link>
          </div>
        )}
      </section>

      {/* 5. CTA Section */}
      <section className="bg-obsidian-900 text-ivory-50 py-20 px-6 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('https://thf.bing.com/th/id/R.e047649d8bd183efbdd320d17de8a8b1?rik=d18ZW0xT%2fK31lQ&pid=ImgRaw&r=0')" }}
        />
        <div className="container mx-auto text-center relative z-10 max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-caption font-semibold block mb-4">
            {t('programs.religiousCTALabel', 'Bespoke Sacred Journeys')}
          </span>
          <h2
            className="text-display-lg text-4xl font-display mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('programs.religiousCTATitle', 'Need a custom pilgrimage itinerary?')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10 leading-relaxed">
            {t(
              'programs.religiousCTADesc',
              'Our spiritual travel specialists will craft a personalized pilgrimage itinerary just for you — combining sacred sites across Egypt, Jordan, and the Holy Land with premium accommodation and expert theological guides.'
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tailor-a-tour">
              <Button variant="gold-glow" className="w-full sm:w-auto px-8 py-4">
                {t('nav.tailorMade', 'Design Your Pilgrimage')}
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline-gold" className="w-full sm:w-auto px-8 py-4">
                {t('nav.contact', 'Contact Our Team')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReligiousTours;

