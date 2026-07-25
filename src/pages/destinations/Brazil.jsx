import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tour/TourCard';
import { useTours } from '../../hooks/useTours';

const Brazil = () => {
  const { t } = useTranslation();
  const { tours: brazilTours, loading } = useTours({ destination: 'brazil' });

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('dest.brazil.seoTitle', 'Viagens e Roteiros de Luxo no Brasil | Dunas Travel')}</title>
        <meta name="description" content={t('dest.brazil.seoDesc', 'Descubra o Brasil em grande estilo. Das praias deslumbrantes do Rio de Janeiro ao coração da Amazônia, embarque em uma jornada de luxo inesquecível.')} />
      </Helmet>

      {/* Destination Hero */}
      <section className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1920&q=80"
            alt="Rio de Janeiro Brazil Hero"
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
            {t('dest.brazil.subtitle', 'Terra do Sol e do Samba')}
          </motion.span>
          <motion.h1 
            variants={fadeInUp} 
            className="text-display-xl text-ivory-50 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.brazil.title', 'Brasil')}
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-body-lg text-ivory-300 max-w-2xl mx-auto">
            {t('dest.brazil.desc', 'Do charme histórico do Rio de Janeiro às belezas naturais da Amazônia, embarque em uma viagem de luxo inesquecível pelo coração do Brasil.')}
          </motion.p>
        </motion.div>
      </section>

      {/* Destination Brief & Tours Grid */}
      <section className="container mx-auto px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-body-lg text-obsidian-500 leading-relaxed">
            {t('dest.brazil.brief', 'Uma mistura vibrante de belezas naturais, cultura rica e hospitalidade calorosa. O Brasil oferece experiências inesquecíveis, desde a energia contagiante do Rio de Janeiro e Salvador até a imensidão verde da Amazônia. Cada momento é planejado para proporcionar o máximo de conforto, luxo e imersão cultural verdadeira.')}
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
            </div>
          ) : brazilTours.length > 0 ? (
            brazilTours.map((tour) => (
              <TourCard key={tour.id || tour.slug} tour={tour} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-obsidian-500">
              {t('dest.noTours', 'Custom Brazil itineraries available on request.')}
            </div>
          )}
        </motion.div>
      </section>

      <section className="relative py-24 mt-24 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1920&q=80')" }} />
        <div className="absolute inset-0 bg-obsidian-900/75" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t('dest.brazil.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?")}
          </span>
          <h2 className="text-display-xl text-ivory-50 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t('dest.brazil.ctaTitle', 'Let us design your perfect Brazil tour')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t('dest.brazil.ctaDesc', 'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.')}
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

export default Brazil;
