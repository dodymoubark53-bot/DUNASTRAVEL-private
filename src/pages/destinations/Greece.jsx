import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';
import TourCard from '../../components/tour/TourCard';
import tours from '../../data/tours.js';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1920&q=80';

export default function Greece() {
  const { t } = useTranslation();
  const greeceTours = tours.filter((tour) => tour && (tour.destination === 'greece' || tour.country === 'greece'));

  return (
    <div className="w-full min-h-screen bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('dest.greece.seoTitle', 'Luxury Greece Vacations & Island Tours | Dunas Travel')}</title>
        <meta
          name="description"
          content={t('dest.greece.seoDesc', 'Discover Santorini, Mykonos, Athens, and ancient Greek legends in ultimate luxury style.')}
        />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('dest.greece.badge', '🇬🇷 سحر الأسطورة الإغريقية وجزر إيجة البيضاء')}
        title={t('dest.greece.headline', 'اليونان.. مهد الحضارة وأجمل جزر العالم الرومانسية')}
        subtitle={t('dest.greece.subtitle', 'Greece: Cradle of Legends & Iconic Aegean Sunsets')}
        description={t(
          'dest.greece.desc',
          'استمتع بشروق الشمس وسحر غروبها في سانتوريني، وتجول بين أعمدة الأكروبوليس في أثينا، وابحر في مياه البحر إيجة الكريستالية على متن أفخم اليخوت البحرية.'
        )}
        highlights={[
          t('dest.greece.tag1', '🌅 إقامات بحمام سباحة خاص في سانتوريني'),
          t('dest.greece.tag2', '🏛️ جولات الأكروبوليس والآثار الإغريقية VIP'),
          t('dest.greece.tag3', '🛥️ كروز جزر ميكونوس وكريد المخصصة')
        ]}
        primaryCta={{
          text: t('dest.greece.ctaPrimary', 'استكشف باقات اليونان ←'),
          link: '#greece-tours'
        }}
        secondaryCta={{
          text: t('dest.greece.ctaSecondary', 'صمّم رحلتك اليونانية'),
          link: '/tailor-tour'
        }}
        bgImage={HERO_IMAGE}
      />

      {/* Content Grid */}
      <section className="container mx-auto px-6 mt-16" id="greece-tours">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-display-lg text-obsidian-900 font-serif mb-4">
            {t('dest.greece.sectionTitle', 'برامج وجولات اليونان الملكية')}
          </h2>
          <p className="text-body-lg text-obsidian-600">
            {t('dest.greece.sectionSubtitle', 'استكشف أفضل الفنادق والجولات في أثينا وجزر إيجة الساحرة.')}
          </p>
        </div>

        {greeceTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {greeceTours.map((tour, idx) => (
              <TourCard key={tour.id || idx} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center max-w-xl mx-auto border border-gold-500/20 shadow-lg">
            <h3 className="text-xl font-bold text-obsidian-900 mb-2">رحلات اليونان المخصصة</h3>
            <p className="text-obsidian-600 mb-6">تواصل معنا لتنظيم رحلة الأحلام إلى سانتوريني وأثينا بكل التفاصيل.</p>
            <a href="/tailor-tour" className="px-6 py-3 rounded-full bg-gold-500 text-obsidian-950 font-bold hover:bg-gold-400 transition-all">
              صمّم رحلتك الآن
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
