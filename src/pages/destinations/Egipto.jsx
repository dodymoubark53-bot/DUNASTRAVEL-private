import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tour/TourCard';
import { tours } from '../../data/tours';

const Egipto = () => {
  const { t } = useTranslation();
  const egyptTours = tours.filter((tour) => tour.destination === 'egypt');

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('dest.egypt.seoTitle', 'Luxury Egypt Tours & Vacations | Dunas Travel')}</title>
        <meta name="description" content={t('dest.egypt.seoDesc', 'Discover Egypt in grand style. From the majestic Pyramids of Giza to the temples of Luxor and the Red Sea coast, embark on an unforgettable luxury journey.')} />
      </Helmet>

      {/* Destination Hero */}
      <section className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/imgs/egyothero.png"
            alt="Pyramids of Giza Egypt Hero"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: 'linear-gradient(to bottom, rgba(15,13,11,0.3), rgba(15,13,11,0.65))' }}
          ></div>
        </div>

        <motion.div
          className="relative z-10 container mx-auto px-6 text-center mt-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={fadeInUp} className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-4">
            {t('dest.egypt.subtitle', 'Land of the Pharaohs')}
          </motion.span>
          <motion.h1
            variants={fadeInUp}
            className="text-display-xl text-ivory-50 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.egypt.title', 'Egypt')}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body-lg text-ivory-300 max-w-2xl mx-auto">
            {t('dest.egypt.desc', 'From the timeless Pyramids of Giza to the golden temples of Luxor and the crystal waters of the Red Sea, Egypt offers a journey through history like no other.')}
          </motion.p>
        </motion.div>
      </section>

      {/* Destination Brief & Tours Grid */}
      <section className="container mx-auto px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-body-lg text-obsidian-500 dark:text-black leading-relaxed">
            {t('dest.egypt.brief', 'A civilisation that has captivated the world for millennia. Egypt blends monumental history with warm hospitality and breathtaking landscapes — from the iconic Pyramids and the Nile cruise to the coral reefs of the Red Sea. Every itinerary is crafted to deliver maximum comfort, luxury and authentic cultural immersion.')}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {egyptTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </motion.div>
      </section>

      {/* Egypt Programs Section */}
      <section className="container mx-auto px-6 mt-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mb-12"
        >
          <motion.span variants={fadeInUp} className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-4">
            {t('dest.egypt.programsSubtitle', 'Egypt Programs')}
          </motion.span>
          <motion.h2 variants={fadeInUp} className="text-display-lg text-obsidian-900 dark:text-black mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.egypt.programsTitle', 'Exclusive Egypt Experiences')}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-body-lg text-obsidian-500 dark:text-black max-w-2xl mx-auto">
            {t('dest.egypt.programsDesc', 'Discover our curated programs designed to make your Egypt journey truly unforgettable.')}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Classic Program */}
          <motion.div variants={fadeInUp} className="bg-white rounded-xl overflow-hidden flex flex-col h-full group shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-obsidian-200 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative">
            <Link to="/programs/classic/classic-program" className="block relative h-[240px] overflow-hidden">
              <img src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783029636/Classic_Program_gfal0s.jpg" alt="Classic Program" className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700" loading="lazy" />
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-caption text-gold-600 uppercase tracking-widest font-semibold mb-1">{t('nav.classic', 'Classic')}</span>
              <Link to="/programs/classic/classic-program">
                <h3 className="text-display-md text-obsidian-900 dark:text-black mt-1 mb-3 group-hover:text-gold-700 transition-colors line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('nav.classicProgram', 'Classic Program')}
                </h3>
              </Link>
              <p className="text-body-sm text-obsidian-500 dark:text-black line-clamp-3 mb-4 flex-grow">
                {t('classic.shortDesc', 'Experience the timeless beauty of Egypt with our signature classic itinerary covering all the iconic landmarks.')}
              </p>
              <div className="flex items-center justify-end pt-4 border-t border-gold-500/10 mt-auto">
                <Link to="/programs/classic/classic-program" aria-label={`${t('tourCard.viewDetails', 'View Details')} - ${t('nav.classicProgram', 'Classic Program')}`}>
                  <Button variant="outline-gold" className="px-6 py-2 flex items-center gap-2" tabIndex={-1}>
                    {t('tourCard.viewDetails', 'View Details')} <span className="rtl-flip">&rarr;</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Honeymooners Package */}
          <motion.div variants={fadeInUp} className="bg-white rounded-xl overflow-hidden flex flex-col h-full group shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-obsidian-200 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative">
            <Link to="/programs/honeymooners" className="block relative h-[240px] overflow-hidden">
              <img src="https://thfvnext.bing.com/th/id/R.ddcd0b2a355a2267797bf6cd444de51d?rik=Lv4r4rM4ltmLhg&pid=ImgRaw&r=0" alt="Honeymooners" className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700" loading="lazy" />
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-caption text-gold-600 uppercase tracking-widest font-semibold mb-1">{t('nav.honeymooners', 'Honeymooners Package')}</span>
              <Link to="/programs/honeymooners">
                <h3 className="text-display-md text-obsidian-900 dark:text-black mt-1 mb-3 group-hover:text-gold-700 transition-colors line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('nav.honeymooners', 'Honeymooners Package')}
                </h3>
              </Link>
              <p className="text-body-sm text-obsidian-500 dark:text-black line-clamp-3 mb-4 flex-grow">
                {t('dest.egypt.honeymoonersDesc', 'Celebrate your love with intimate candlelit dinners, private yacht cruises, and unmatched romantic luxury.')}
              </p>
              <div className="flex items-center justify-end pt-4 border-t border-gold-500/10 mt-auto">
                <Link to="/programs/honeymooners" aria-label={`${t('tourCard.viewDetails', 'View Details')} - ${t('nav.honeymooners', 'Honeymooners Package')}`}>
                  <Button variant="outline-gold" className="px-6 py-2 flex items-center gap-2" tabIndex={-1}>
                    {t('tourCard.viewDetails', 'View Details')} <span className="rtl-flip">&rarr;</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Religious Programs */}
          <motion.div variants={fadeInUp} className="bg-white rounded-xl overflow-hidden flex flex-col h-full group shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-obsidian-200 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative">
            <Link to="/programs/religious" className="block relative h-[240px] overflow-hidden">
              <img src="https://www.saintjeromechurch.org/wp-content/uploads/2025/03/14714-what-is-ccd-in-catholic-church-religious-education-programs-explained.png" alt="Religious Programs" className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700" loading="lazy" />
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-caption text-gold-600 uppercase tracking-widest font-semibold mb-1">{t('nav.religious', 'Religious Programs')}</span>
              <Link to="/programs/religious">
                <h3 className="text-display-md text-obsidian-900 dark:text-black mt-1 mb-3 group-hover:text-gold-700 transition-colors line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('nav.religious', 'Religious Programs')}
                </h3>
              </Link>
              <p className="text-body-sm text-obsidian-500 dark:text-black line-clamp-3 mb-4 flex-grow">
                {t('dest.egypt.religiousDesc', 'A spiritual journey through Egypt tracing ancient Coptic monasteries and sacred sites.')}
              </p>
              <div className="flex items-center justify-end pt-4 border-t border-gold-500/10 mt-auto">
                <Link to="/programs/religious" aria-label={`${t('tourCard.viewDetails', 'View Details')} - ${t('nav.religious', 'Religious Programs')}`}>
                  <Button variant="outline-gold" className="px-6 py-2 flex items-center gap-2" tabIndex={-1}>
                    {t('tourCard.viewDetails', 'View Details')} <span className="rtl-flip">&rarr;</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Multi-Country Tours */}
          <motion.div variants={fadeInUp} className="bg-white rounded-xl overflow-hidden flex flex-col h-full group shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-obsidian-200 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative">
            <Link to="/programs/multi-country" className="block relative h-[240px] overflow-hidden">
              <img src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783030113/Gemini_Generated_Image_cb2enncb2enncb2e_wvyejn.jpg" alt="Multi-Country Tours" className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700" loading="lazy" />
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-caption text-gold-600 uppercase tracking-widest font-semibold mb-1">{t('nav.multiCountry', 'Multi-Country Tours')}</span>
              <Link to="/programs/multi-country">
                <h3 className="text-display-md text-obsidian-900 dark:text-black mt-1 mb-3 group-hover:text-gold-700 transition-colors line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('nav.multiCountry', 'Multi-Country Tours')}
                </h3>
              </Link>
              <p className="text-body-sm text-obsidian-500 dark:text-black line-clamp-3 mb-4 flex-grow">
                {t('dest.egypt.multiCountryDesc', 'Explore combined itineraries spanning Egypt, Jordan, Turkey and beyond for a truly grand adventure.')}
              </p>
              <div className="flex items-center justify-end pt-4 border-t border-gold-500/10 mt-auto">
                <Link to="/programs/multi-country" aria-label={`${t('tourCard.viewDetails', 'View Details')} - ${t('nav.multiCountry', 'Multi-Country Tours')}`}>
                  <Button variant="outline-gold" className="px-6 py-2 flex items-center gap-2" tabIndex={-1}>
                    {t('tourCard.viewDetails', 'View Details')} <span className="rtl-flip">&rarr;</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* EXTENSION */}
          <motion.div variants={fadeInUp} className="bg-white rounded-xl overflow-hidden flex flex-col h-full group shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-obsidian-200 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative">
            <Link to="/programs/extension" className="block relative h-[240px] overflow-hidden">
              <img src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783030445/Gemini_Generated_Image_kenvzkkenvzkkenv_h9kz07.png" alt="Extension" className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700" loading="lazy" />
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-caption text-gold-600 uppercase tracking-widest font-semibold mb-1">EXTENSION</span>
              <Link to="/programs/extension">
                <h3 className="text-display-md text-obsidian-900 dark:text-black mt-1 mb-3 group-hover:text-gold-700 transition-colors line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t('dest.egypt.extensionTitle', 'Egypt Extensions')}
                </h3>
              </Link>
              <p className="text-body-sm text-obsidian-500 dark:text-black line-clamp-3 mb-4 flex-grow">
                {t('dest.egypt.extensionDesc', 'Extend your Egypt journey with added destinations like Hurghada, Sharm El Sheikh, or Siwa Oasis.')}
              </p>
              <div className="flex items-center justify-end pt-4 border-t border-gold-500/10 mt-auto">
                <Link to="/programs/extension" aria-label={`${t('tourCard.viewDetails', 'View Details')} - ${t('dest.egypt.extensionTitle', 'Egypt Extensions')}`}>
                  <Button variant="outline-gold" className="px-6 py-2 flex items-center gap-2" tabIndex={-1}>
                    {t('tourCard.viewDetails', 'View Details')} <span className="rtl-flip">&rarr;</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative py-24 mt-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/imgs/egyothero.webp)' }} />
        <div className="absolute inset-0 bg-obsidian-900/75" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t('dest.egypt.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?")}
          </span>
          <h2 className="text-display-xl text-ivory-50 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.egypt.ctaTitle', 'Let us design your perfect Egypt tour')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t('dest.egypt.ctaDesc', 'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.')}
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

export default Egipto;