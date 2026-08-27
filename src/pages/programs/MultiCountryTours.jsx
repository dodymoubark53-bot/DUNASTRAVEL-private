import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaChevronRight } from 'react-icons/fa';
import TourCard from '../../components/tour/TourCard';
import multiCountryTours from '../../data/multiCountryTours';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';

export default function MultiCountryTours() {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-obsidian-50 pb-24">
      <Helmet>
        <title>{`${t('programs.multiCountryTitle', 'Multi-Country Tours')} | Dunas Travel`}</title>
        <meta name="description" content={t('programs.multiCountryDesc', 'Multi-Country Tours')} />
      </Helmet>

      {/* Luxury Hero Section */}
      <LuxuryHeroSection
        badge={t('programs.multiCountryBadge', '🌐 تجارب سياحية عابرة للحدود')}
        title={t('programs.multiCountryTitle', 'الرحلات المجمعة.. اكتشاف عدة حضارات في رحلة واحدة')}
        subtitle={t('programs.multiCountrySubtitle', 'Multi-Country Odysseys: Egypt, Jordan, Turkey & Dubai')}
        description={t(
          'programs.multiCountryHeroDesc',
          'اجمع بين سحر الأهرامات في مصر وورديات البتراء بالأردن، أو ابحر بين بسفور تركيا وأبراج دبي الفاخرة، مع طيران وتنقلات مدمجة أعلى مستويات الترف والراحة.'
        )}
        highlights={[
          t('programs.multiTag1', '✈️ طيران وتنقلات VIP مدمجة بالكامل'),
          t('programs.multiTag2', '🗺️ باقات (مصر + الأردن / تركيا + دبي)'),
          t('programs.multiTag3', '📜 إدارة شاملة للتأشيرات والخدمات')
        ]}
        primaryCta={{
          text: t('programs.multiPrimaryCta', 'استكشف الرحلات المجمعة ←'),
          link: '#multi-tours-list'
        }}
        secondaryCta={{
          text: t('programs.multiSecondaryCta', 'طلب برنامج مخصص للجموع'),
          link: '/tailor-tour'
        }}
        bgImage="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
      />

      {/* Breadcrumb Header */}
      <div className="bg-obsidian-950 border-y border-gold-500/10 py-4 px-6 text-caption text-ivory-300">
        <div className="container mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-gold-500 transition-colors">
            {t('nav.home', 'Home')}
          </Link>
          <span className="rtl-flip text-[10px] text-gold-500/50">
            <FaChevronRight />
          </span>
          <Link to="/destinations/egypt" className="hover:text-gold-500 transition-colors">
            {t('dest.egypt.title', 'Egypt')}
          </Link>
          <span className="rtl-flip text-[10px] text-gold-500/50">
            <FaChevronRight />
          </span>
          <span className="text-gold-500 font-medium">{t('nav.multiCountry', 'Multi-Country Tours')}</span>
        </div>
      </div>

      {/* Main Content Section */}
      <section className="relative min-h-screen bg-obsidian-50 pt-16 pb-20" id="multi-tours-list">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-display-lg text-obsidian-900 font-display font-bold mb-4">
              {t('programs.multiCountryHeading', 'باقات الرحلات المجمعة المتاحة')}
            </h2>
            <p className="text-body-lg text-obsidian-600 max-w-2xl mx-auto">
              اختر وجهتك المفضلة التي تجمع أكثر من بلد ببرنامج سياحي واحد مريح وشامل.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {multiCountryTours.map((tour) => (
              <TourCard key={tour.id} tour={tour} linkBase="/programs/multi-country" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
