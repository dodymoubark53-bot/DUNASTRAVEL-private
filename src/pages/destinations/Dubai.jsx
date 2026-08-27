import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import TourCard from '../../components/tour/TourCard';
import { useDubaiPrograms } from '../../hooks/useDubaiPrograms';

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

import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80';

export default function Dubai() {
  const { t } = useTranslation();
  const programs = useDubaiPrograms();

  return (
    <div className="w-full min-h-screen bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('dest.dubai.seoTitle', 'Luxury Dubai Tours & Vacations | Dunas Travel')}</title>
        <meta
          name="description"
          content={t('dest.dubai.seoDesc', 'Discover the dazzling metropolis of Dubai — a city of futuristic skyscrapers, golden deserts, and world-class luxury.')}
        />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('dest.dubai.badge', '💎 قمة الرفاهية والتجارب المستقبليّة')}
        title={t('dest.dubai.headline', 'دبي.. عاصمة الفخامة العالمية والمغامرات الحديثة')}
        subtitle={t('dest.dubai.subtitle', 'Dubai: The Global Capital of Luxury & Futuristic Wonders')}
        description={t(
          'dest.dubai.desc',
          'عِش تجربة سياحية لا تُضاهى بين أطول ناطحات السحاب في العالم، والجزر الاصطناعية المذهلة، والتسوق الفاخر، إلى جانب سفاري الصحراء الملكي وتجارب اليخوت الخاصة.'
        )}
        highlights={[
          t('dest.dubai.tag1', '🏙️ تذاكر برج خليفة والمنصات VIP'),
          t('dest.dubai.tag2', '🏎️ سيارات فاخرة ويخوت خاصة'),
          t('dest.dubai.tag3', '🏜️ سفاري صحراوي ملكي مع عشاء VIP')
        ]}
        primaryCta={{
          text: t('dest.dubai.ctaPrimary', 'احجز رحلتك إلى دبي ←'),
          link: '#dubai-tours'
        }}
        secondaryCta={{
          text: t('dest.dubai.ctaSecondary', 'عرض الباقات العائلية'),
          link: '/tailor-tour'
        }}
        bgImage={HERO_IMAGE}
      />

      {/* Brief Overview & Programs Grid */}
      <section className="container mx-auto px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-body-lg text-obsidian-500 leading-relaxed">
            {t(
              'dest.dubai.brief',
              'Dubai blends futuristic innovation with timeless Arabian hospitality. Whether you are exploring the historic Al Bastakiya district, dune bashing in the desert, or dining at a Michelin-starred restaurant, every moment in Dubai is extraordinary.'
            )}
          </p>
        </div>

        <div className="text-center mb-12">
          <h2
            className="text-display-lg text-obsidian-900"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.dubai.ourPrograms', 'Our Programs')}
          </h2>
          <div className="w-24 h-1 bg-gold-500 mx-auto mt-4" />
        </div>

        {/* Programs Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {programs.map((program) => (
            <TourCard
              key={program.id}
              tour={{
                id: program.id,
                slug: program.slug,
                destination: 'dubai',
                title: program.title,
                overview: program.overview,
                duration: program.duration,
                price: program.pricing?.winter?.[0]?.dbl || 899,
                images: program.images,
                type: 'Dubai Tour',
                code: program.code,
                minPax: program.minPax,
              }}
              linkBase="/programs/dubai"
            />
          ))}
        </motion.div>
      </section>

      {/* Bottom Tailor-a-Tour CTA */}
      <section className="relative py-24 mt-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-obsidian-900/75" />

        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t('dest.dubai.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?")}
          </span>
          <h2
            className="text-display-xl text-ivory-50 mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t('dest.dubai.ctaTitle', 'Let us design your perfect Dubai tour')}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t(
              'dest.dubai.ctaDesc',
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
