import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';
import TourCard from '../../components/tour/TourCard';
import tours from '../../data/tours.js';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80';

export default function Tunisia() {
  const { t } = useTranslation();
  const tunisiaTours = tours.filter((tour) => tour && (tour.destination === 'tunisia' || tour.country === 'tunisia'));

  return (
    <div className="w-full min-h-screen bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('dest.tunisia.seoTitle', 'Luxury Tunisia Tours & Vacations | Dunas Travel')}</title>
        <meta
          name="description"
          content={t('dest.tunisia.seoDesc', 'Discover Carthage, Sidi Bou Said, and the Mediterranean shores of Tunisia in pure luxury.')}
        />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('dest.tunisia.badge', '🏛️ عبق قرطاج وسحر سيدي بوسعيد الأزرق')}
        title={t('dest.tunisia.headline', 'تونس.. جمال المتوسط ودفء الثقافة المغاربية')}
        subtitle={t('dest.tunisia.subtitle', 'Tunisia: Mediterranean Breeze & Carthage Legacies')}
        description={t(
          'dest.tunisia.desc',
          'تجوّل بين الأزقة البيضاء والزرقاء بقرطاج وسيدي بوسعيد، واكتشف آثار المسرح الروماني بجم، واستمتع بطبيعة طبرقة الساحلية والواحات الصحراوية الساحرة.'
        )}
        highlights={[
          t('dest.tunisia.tag1', '⚓ جولات قرطاج وسيدي بوسعيد البحرية'),
          t('dest.tunisia.tag2', '🏛️ زيارة متحف باردو والمواقع الرومانية'),
          t('dest.tunisia.tag3', '🌴 واحات توزر وسفاري كوكب توزر')
        ]}
        primaryCta={{
          text: t('dest.tunisia.ctaPrimary', 'استكشف سحر تونس ←'),
          link: '#tunisia-tours'
        }}
        secondaryCta={{
          text: t('dest.tunisia.ctaSecondary', 'احجز رحلتك الصيفية'),
          link: '/tailor-tour'
        }}
        bgImage={HERO_IMAGE}
      />

      {/* Content Grid */}
      <section className="container mx-auto px-6 mt-16" id="tunisia-tours">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-display-lg text-obsidian-900 font-serif mb-4">
            {t('dest.tunisia.sectionTitle', 'برامج ورحلات تونس الفاخرة')}
          </h2>
          <p className="text-body-lg text-obsidian-600">
            {t('dest.tunisia.sectionSubtitle', 'استمتع بأفخم الإقامات والجولات المخصصة لزيارة المعالم التونسية الخالدة.')}
          </p>
        </div>

        {tunisiaTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tunisiaTours.map((tour, idx) => (
              <TourCard key={tour.id || idx} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center max-w-xl mx-auto border border-gold-500/20 shadow-lg">
            <h3 className="text-xl font-bold text-obsidian-900 mb-2">رحلات تونس جاهزة للتفصيل</h3>
            <p className="text-obsidian-600 mb-6">تواصل مع مستشار السفر الخاص بنا لتصميم رحلتك المخصصة إلى تونس.</p>
            <a href="/tailor-tour" className="px-6 py-3 rounded-full bg-gold-500 text-obsidian-950 font-bold hover:bg-gold-400 transition-all">
              صمّم رحلتك الآن
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
