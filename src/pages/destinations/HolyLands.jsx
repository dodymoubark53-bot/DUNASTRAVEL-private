import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';
import TourCard from '../../components/tour/TourCard';
import tours from '../../data/tours.js';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1544971587-b842c27f8c14?auto=format&fit=crop&w=1920&q=80';

export default function HolyLands() {
  const { t } = useTranslation();
  const holyTours = tours.filter((tour) => tour && (tour.category === 'religious' || tour.destination === 'holylands' || tour.destination === 'palestine'));

  return (
    <div className="w-full min-h-screen bg-obsidian-50 pb-24">
      <Helmet>
        <title>{t('dest.holylands.seoTitle', 'Holy Land Pilgrimages & Sacred Journeys | Dunas Travel')}</title>
        <meta
          name="description"
          content={t('dest.holylands.seoDesc', 'Embark on sacred spiritual journeys across Jerusalem, Bethlehem, Nazareth, and holy sites with luxury comfort.')}
        />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('dest.holylands.badge', '🕊️ رحلات الإيمان والتاريخ الروحاني الخالد')}
        title={t('dest.holylands.headline', 'الأراضي المقدسة.. رحلة الروح والخطوات المباركة')}
        subtitle={t('dest.holylands.subtitle', 'Holy Lands: Sacred Faith Pilgrimages & Spiritual Heritage')}
        description={t(
          'dest.holylands.desc',
          'انطلق في رحلة إيمانية عميقة إلى القدس الشريف، وبيت لحم، والناصرة، ومواقع التاريخ الديني الخالدة. تنظيم احترافي عالي الدقة يشمل الإرشاد الروحي والتنقلات الفاخرة.'
        )}
        highlights={[
          t('dest.holylands.tag1', '📖 مرشدون متخصصون في التاريخ الديني'),
          t('dest.holylands.tag2', '🏨 إقامات 5 نجوم قريبة من المعالم المقدسة'),
          t('dest.holylands.tag3', '✈️ خدمات التأشيرة والتنقلات VIP الشاملة')
        ]}
        primaryCta={{
          text: t('dest.holylands.ctaPrimary', 'استكشف برامج الأراضي المقدسة ←'),
          link: '#holylands-tours'
        }}
        secondaryCta={{
          text: t('dest.holylands.ctaSecondary', 'تواصل مع مستشار الرحلات الدينية'),
          link: '/tailor-tour'
        }}
        bgImage={HERO_IMAGE}
      />

      {/* Content Grid */}
      <section className="container mx-auto px-6 mt-16" id="holylands-tours">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-display-lg text-obsidian-900 font-serif mb-4">
            {t('dest.holylands.sectionTitle', 'برامج الرحلات الروحانية والمقدسة')}
          </h2>
          <p className="text-body-lg text-obsidian-600">
            {t('dest.holylands.sectionSubtitle', 'نضمن لكم أعلى مستويات الراحة والأمان والتنظيم الهادئ طوال رحلتكم.')}
          </p>
        </div>

        {holyTours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {holyTours.map((tour, idx) => (
              <TourCard key={tour.id || idx} tour={tour} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center max-w-xl mx-auto border border-gold-500/20 shadow-lg">
            <h3 className="text-xl font-bold text-obsidian-900 mb-2">برامج الزيارة والحج الروحي</h3>
            <p className="text-obsidian-600 mb-6">نصمّم برامج مجموعات وأفراد مخصصة لزيارة الأراضي المقدسة بكافة الخدمات.</p>
            <a href="/tailor-tour" className="px-6 py-3 rounded-full bg-gold-500 text-obsidian-950 font-bold hover:bg-gold-400 transition-all">
              تواصل مع خبير الرحلات الدينية
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
