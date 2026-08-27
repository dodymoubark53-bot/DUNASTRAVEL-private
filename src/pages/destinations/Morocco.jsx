import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';
import TourCard from '../../components/tour/TourCard';
import moroccoTours from '../../data/moroccoTours.js';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1920&q=80';

export default function Morocco() {
  const { t } = useTranslation();
  const toursList = Array.isArray(moroccoTours) ? moroccoTours : [];

  return (
    <div className="w-full min-h-screen bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('dest.morocco.seoTitle', 'Luxury Morocco Tours & Vacations | Dunas Travel')}</title>
        <meta
          name="description"
          content={t('dest.morocco.seoDesc', 'Experience Marrakech, Fes, Chefchaouen, and Sahara Desert luxury glamping with Dunas Travel.')}
        />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('dest.morocco.badge', '🏺 عقود من الأناقة الأندلسية والمعمار الأصيل')}
        title={t('dest.morocco.headline', 'المغرب.. ألوان مراكش وأسرار المدن العريقة')}
        subtitle={t('dest.morocco.subtitle', 'Morocco: Colors of Marrakech & Ancient Imperial Heritage')}
        description={t(
          'dest.morocco.desc',
          'انغمس في أزقة مراكش الحمراء، وشفشاون الزرقاء، وأسواق فاس القديمة. استمتع بالإقامة في الرياضات التراثية الفاخرة وتذوق أشهر أطباق الطاجين تحت خيام الصحراء الكبرى.'
        )}
        highlights={[
          t('dest.morocco.tag1', '🏡 إقامة في أشهر رياضات مراكش'),
          t('dest.morocco.tag2', '🐫 رحلات صحراء مرزوكة والمخيمات المجهزة'),
          t('dest.morocco.tag3', '🎨 جولات شفشاون وفاس الثقافية')
        ]}
        primaryCta={{
          text: t('dest.morocco.ctaPrimary', 'اكتشف برامج المغرب ←'),
          link: '#morocco-tours'
        }}
        secondaryCta={{
          text: t('dest.morocco.ctaSecondary', 'احصل على برنامج مخصص'),
          link: '/tailor-tour'
        }}
        bgImage={HERO_IMAGE}
      />

      {/* Content Grid */}
      <section className="container mx-auto px-6 mt-16" id="morocco-tours">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-display-lg text-obsidian-900 font-serif mb-4">
            {t('dest.morocco.sectionTitle', 'برامج جولات المملكة المغربية')}
          </h2>
          <p className="text-body-lg text-obsidian-600">
            {t('dest.morocco.sectionSubtitle', 'استكشف باقات مراكش والدار البيضاء والصحراء بإشراف خبرائنا.')}
          </p>
        </div>

        {toursList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {toursList.map((tour, idx) => (
              <TourCard key={tour.id || idx} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center max-w-xl mx-auto border border-gold-500/20 shadow-lg">
            <h3 className="text-xl font-bold text-obsidian-900 mb-2">برامج المغرب الملكية</h3>
            <p className="text-obsidian-600 mb-6">احصل على كتيّب الرحلات أو صمّم رحلتك الخاصة إلى المغرب.</p>
            <a href="/tailor-tour" className="px-6 py-3 rounded-full bg-gold-500 text-obsidian-950 font-bold hover:bg-gold-400 transition-all">
              صمّم رحلتك الآن
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
