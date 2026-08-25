import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tour/TourCard';
import tours from '../../data/tours.js';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function Egipto() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const egyptTours = tours.filter((tour) => tour && tour.destination === 'egypt');

  return (
    <div className="w-full min-h-screen bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('dest.egypt.seoTitle', 'Luxury Egypt Tours & Vacations | Dunas Travel')}</title>
        <meta
          name="description"
          content={t(
            'dest.egypt.seoDesc',
            'Discover Egypt in grand style. From the majestic Pyramids of Giza to the temples of Luxor and the Red Sea coast, embark on an unforgettable luxury journey.'
          )}
        />
      </Helmet>

      {/* Hero Header */}
      <section className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/imgs/egyothero.png"
            alt={t('dest.egypt.title', 'Egypt')}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'linear-gradient(to bottom, rgba(15,13,11,0.3), rgba(15,13,11,0.65))',
            }}
          />
        </div>

        <motion.div
          className="relative z-10 container mx-auto px-6 text-center mt-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-4"
          >
            {t('dest.egypt.subtitle', 'Land of the Pharaohs')}
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-display-xl text-ivory-50 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.egypt.title', 'Egypt')}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-body-lg text-ivory-300 max-w-2xl mx-auto"
          >
            {t(
              'dest.egypt.desc',
              'From the timeless Pyramids of Giza to the golden temples of Luxor and the crystal waters of the Red Sea, Egypt offers a journey through history like no other.'
            )}
          </motion.p>
        </motion.div>
      </section>

      {/* Brief Overview & 9 Egypt Tours Grid */}
      <section className="container mx-auto px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-body-lg text-obsidian-500 dark:text-black leading-relaxed">
            {t(
              'dest.egypt.brief',
              'A civilisation that has captivated the world for millennia. Egypt blends monumental history with warm hospitality and breathtaking landscapes — from the iconic Pyramids and the Nile cruise to the coral reefs of the Red Sea. Every itinerary is crafted to deliver maximum comfort, luxury and authentic cultural immersion.'
            )}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {egyptTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </motion.div>
      </section>

      {/* Exclusive Egypt Experiences & Packages (5 Packages) */}
      <section className="container mx-auto px-6 mt-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="text-center mb-12"
        >
          <motion.span
            variants={itemVariants}
            className="inline-block font-body text-gold-500 tracking-[0.2em] uppercase text-sm mb-4"
          >
            {t('dest.egypt.programsSubtitle', 'Egypt Programs')}
          </motion.span>
          <motion.h2
            variants={itemVariants}
            className="text-display-lg text-obsidian-900 dark:text-black mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.egypt.programsTitle', 'Exclusive Egypt Experiences')}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-body-lg text-obsidian-500 dark:text-black max-w-2xl mx-auto"
          >
            {t(
              'dest.egypt.programsDesc',
              'Discover our curated programs designed to make your Egypt journey truly unforgettable.'
            )}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Card 1: Classic Program */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl overflow-hidden flex flex-col h-full group shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-obsidian-200 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative"
          >
            <Link to="/programs/classic/classic-program" className="block relative h-[240px] overflow-hidden">
              <img
                src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783029636/Classic_Program_gfal0s.jpg"
                alt="Classic Program"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700"
                loading="lazy"
              />
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-caption text-gold-600 uppercase tracking-widest font-semibold mb-1">
                {t('nav.classic', 'Classic')}
              </span>
              <Link to="/programs/classic/classic-program">
                <h3
                  className="text-display-md text-obsidian-900 dark:text-black mt-1 mb-3 group-hover:text-gold-700 transition-colors line-clamp-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('nav.classicProgram', 'Classic Program')}
                </h3>
              </Link>
              <p className="text-body-sm text-obsidian-500 dark:text-black line-clamp-3 mb-4 flex-grow">
                {t(
                  'classic.shortDesc',
                  'Experience the timeless beauty of Egypt with our signature classic itinerary covering all the iconic landmarks.'
                )}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gold-500/10 mt-auto">
                <div />
                <Link to="/programs/classic/classic-program">
                  <Button as="span" variant="outline-gold" className="px-6 py-2 flex items-center gap-2">
                    {t('tourCard.viewDetails', 'View Details')}{' '}
                    <span className="rtl-flip">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Honeymooners Package */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl overflow-hidden flex flex-col h-full group shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-obsidian-200 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative"
          >
            <Link to="/programs/honeymooners" className="block relative h-[240px] overflow-hidden">
              <img
                src="https://hl-tourism.com/media/typecms/Honeymoon_Planning_Guide_2025_Complete_Resource.webp"
                alt="Honeymooners"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700"
                loading="lazy"
              />
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-caption text-gold-600 uppercase tracking-widest font-semibold mb-1">
                {t('nav.honeymooners', 'Honeymooners Package')}
              </span>
              <Link to="/programs/honeymooners">
                <h3
                  className="text-display-md text-obsidian-900 dark:text-black mt-1 mb-3 group-hover:text-gold-700 transition-colors line-clamp-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('nav.honeymooners', 'Honeymooners Package')}
                </h3>
              </Link>
              <p className="text-body-sm text-obsidian-500 dark:text-black line-clamp-3 mb-4 flex-grow">
                {t(
                  'dest.egypt.honeymoonersDesc',
                  'Celebrate your love with intimate candlelit dinners, private yacht cruises, and unmatched romantic luxury.'
                )}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gold-500/10 mt-auto">
                <div />
                <Link to="/programs/honeymooners">
                  <Button as="span" variant="outline-gold" className="px-6 py-2 flex items-center gap-2">
                    {t('tourCard.viewDetails', 'View Details')}{' '}
                    <span className="rtl-flip">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Religious Programs */}
          <Link
            to="/services/religious/egypt-jordan-combined-14d"
            className="block h-full group"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl overflow-hidden flex flex-col h-full shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-obsidian-200 group-hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] group-hover:border-gold-500 group-hover:-translate-y-2 transition-all duration-300 ease-out z-10 group-hover:z-20 relative cursor-pointer"
            >
              <div className="block relative h-[240px] overflow-hidden">
                <img
                  src="https://sft-nationaltours.com/wp-content/uploads/2024/11/holy-family-egypt_tg_1397-870x555.jpg"
                  alt="Religious Programs"
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-caption text-gold-600 uppercase tracking-widest font-semibold mb-1">
                  {t('nav.religious', 'Religious Programs')}
                </span>
                <h3
                  className="text-display-md text-obsidian-900 dark:text-black mt-1 mb-3 group-hover:text-gold-700 transition-colors line-clamp-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('nav.religious', 'Religious Programs')}
                </h3>
                <p className="text-body-sm text-obsidian-500 dark:text-black line-clamp-3 mb-4 flex-grow">
                  {t(
                    'dest.egypt.religiousDesc',
                    'A spiritual journey through Egypt tracing ancient Coptic monasteries and sacred sites.'
                  )}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gold-500/10 mt-auto">
                  <div />
                  <Button as="span" variant="outline-gold" className="px-6 py-2 flex items-center gap-2">
                    {t('tourCard.viewDetails', 'View Details')}{' '}
                    <span className="rtl-flip">→</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Card 4: Multi-Country Tours */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl overflow-hidden flex flex-col h-full group shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-obsidian-200 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative"
          >
            <Link to="/programs/multi-country" className="block relative h-[240px] overflow-hidden">
              <img
                src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783030113/Gemini_Generated_Image_cb2enncb2enncb2e_wvyejn.jpg"
                alt="Multi-Country Tours"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700"
                loading="lazy"
              />
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-caption text-gold-600 uppercase tracking-widest font-semibold mb-1">
                {t('nav.multiCountry', 'Multi-Country Tours')}
              </span>
              <Link to="/programs/multi-country">
                <h3
                  className="text-display-md text-obsidian-900 dark:text-black mt-1 mb-3 group-hover:text-gold-700 transition-colors line-clamp-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('nav.multiCountry', 'Multi-Country Tours')}
                </h3>
              </Link>
              <p className="text-body-sm text-obsidian-500 dark:text-black line-clamp-3 mb-4 flex-grow">
                {t(
                  'dest.egypt.multiCountryDesc',
                  'Explore combined itineraries spanning Egypt, Jordan, Turkey and beyond for a truly grand adventure.'
                )}
              </p>
              <div className="flex items-center justify-between pt-4 border-t border-gold-500/10 mt-auto">
                <div />
                <Link to="/programs/multi-country">
                  <Button as="span" variant="outline-gold" className="px-6 py-2 flex items-center gap-2">
                    {t('tourCard.viewDetails', 'View Details')}{' '}
                    <span className="rtl-flip">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Card 5: Egypt Extensions */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl overflow-hidden flex flex-col h-full group shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-obsidian-200 hover:shadow-[0_12px_32px_rgba(245,166,35,0.25)] hover:border-gold-500 hover:-translate-y-2 transition-all duration-300 ease-out z-10 hover:z-20 relative"
          >
            <Link to="/programs/extension" className="block relative h-[240px] overflow-hidden">
              <img
                src="https://res.cloudinary.com/degbrq3ck/image/upload/v1783030445/Gemini_Generated_Image_kenvzkkenvzkkenv_h9kz07.png"
                alt="Egypt Extensions"
                className="w-full h-full object-cover transform scale-100 group-hover:scale-[1.06] transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute top-3 right-3 bg-gold-500 text-obsidian-900 font-bold text-xs uppercase px-3 py-1 rounded-full shadow-md">
                3 {t('extensions.tripsAvailable', 'Trips Available')}
              </div>
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <span className="text-caption text-gold-600 uppercase tracking-widest font-semibold mb-1">
                EXTENSION
              </span>
              <Link to="/programs/extension">
                <h3
                  className="text-display-md text-obsidian-900 dark:text-black mt-1 mb-3 group-hover:text-gold-700 transition-colors line-clamp-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t('dest.egypt.extensionTitle', 'Egypt Extensions')}
                </h3>
              </Link>
              <p className="text-body-sm text-obsidian-500 dark:text-black line-clamp-3 mb-4 flex-grow">
                {t(
                  'dest.egypt.extensionDesc',
                  'Extend your Egypt journey with added destinations like Hurghada, Sharm El Sheikh, or Siwa Oasis.'
                )}
              </p>
              
              {/* Trip Tags Preview */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <Link to="/programs/extension/hurghada-4d3n" className="text-[11px] bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 px-2.5 py-1 rounded-md font-medium border border-gold-200/50 hover:bg-gold-500 hover:text-obsidian-900 transition-colors">
                  {t('trip.hurghada.title', 'Hurghada')} ($0)
                </Link>
                <Link to="/programs/extension/sharm-4d3n" className="text-[11px] bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 px-2.5 py-1 rounded-md font-medium border border-gold-200/50 hover:bg-gold-500 hover:text-obsidian-900 transition-colors">
                  {t('trip.sharm.title', 'Sharm El Sheikh')} ($0)
                </Link>
                <Link to="/programs/extension/siwa-oasis-alexandria" className="text-[11px] bg-gold-50 dark:bg-gold-900/20 text-gold-700 dark:text-gold-400 px-2.5 py-1 rounded-md font-medium border border-gold-200/50 hover:bg-gold-500 hover:text-obsidian-900 transition-colors">
                  {t('tour_siwa_title', 'Siwa & Alexandria')} ($0)
                </Link>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gold-500/10 mt-auto">
                <div>
                  <span className="text-[11px] text-obsidian-400 block uppercase">
                    {t('extensions.startingFrom', 'Starting From')}
                  </span>
                  <span className="text-xl font-bold text-gold-600">$0</span>
                </div>
                <Link to="/programs/extension">
                  <Button variant="outline-gold" className="px-6 py-2 flex items-center gap-2">
                    {t('tourCard.viewDetails', 'View Details')}{' '}
                    <span className="rtl-flip">→</span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 mt-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/imgs/egyothero.png)' }}
        />
        <div className="absolute inset-0 bg-obsidian-900/75" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t('dest.egypt.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?")}
          </span>
          <h2
            className="text-display-xl text-ivory-50 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.egypt.ctaTitle', 'Let us design your perfect Egypt tour')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t(
              'dest.egypt.ctaDesc',
              'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.'
            )}
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
}
