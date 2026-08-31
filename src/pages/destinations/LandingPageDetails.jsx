import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FaCompass, FaHotel, FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import TourCard from '../../components/tour/TourCard';
import { useLandingPage } from '../../hooks/useLandingPage';
import ErrorState from '../../components/ui/ErrorState';
import LuxuryHeroSection from '../../components/common/LuxuryHeroSection';
import Button from '../../components/ui/Button';

function readableSections(sections) {
  if (!Array.isArray(sections)) return [];
  return sections.filter((section) => typeof section === 'string' && section.trim());
}

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

const DEST_FALLBACK_DATA = {
  jordan: {
    badge: 'dest.jordan.badge',
    badgeDefault: '🏜️ عجيبة العالم الوردية ووديان النجوم',
    headline: 'dest.jordan.headline',
    headlineDefault: 'الأردن.. سحر البتراء وأسرار وادي رم الأسطورية',
    subtitle: 'dest.jordan.subtitle',
    subtitleDefault: 'Jordan: Petra’s Rose Beauty & Cosmic Desert Nights',
    desc: 'dest.jordan.desc',
    descDefault: 'من منحوتات السيق الوردية في البتراء إلى هدوء البحر الميت الذي لا يُقاوم، وصولاً إلى التخييم الفاخر تحت قبة نجوم وادي رم. تجربة استكشافية تجمع بين المغامرة والراحة الاستثنائية.',
    tags: ['dest.jordan.tag1', 'dest.jordan.tag2', 'dest.jordan.tag3'],
    tagsDefault: ['🏛️ زيارة البتراء ودخول خاص', '🌌 مخيمات البابليك الفاخرة بوادي رم', '🌊 منتجعات علاجية على البحر الميت'],
    heroImage: 'https://cdn.al-ain.com/lg/images/2022/11/24/62-021616-best-tourist-areas-jordan-4.jpeg',
    hotelCities: ['amman', 'petra', 'wadiRum', 'aqaba', 'deadSea'],
  },
  turkey: {
    badge: 'dest.turkey.badge',
    badgeDefault: '✨ سحر البسفور وجبال كبادوكيا',
    headline: 'dest.turkey.headline',
    headlineDefault: 'تركيا.. جوهرة الأناضول والتاريخ البسفوري الفاخر',
    subtitle: 'dest.turkey.subtitle',
    subtitleDefault: 'Turkey: The Jewel of Anatolia & Bosphorus Elegance',
    desc: 'dest.turkey.desc',
    descDefault: 'اكتشف روعة الامتزاج بين ثقافة الشرق وأناقة الغرب؛ حوم فوق منطاد كبادوكيا عند الشروق، وتجوّل بين مساجد وقصور إستانبول العريقة، واستجم على شواطئ أنطاليا والريفيرا التركية الساحرة.',
    tags: ['dest.turkey.tag1', 'dest.turkey.tag2', 'dest.turkey.tag3'],
    tagsDefault: ['🎈 رحلات منطاد كبادوكيا الخاصة', '🛥️ يخوت خاصة في مضيق البسفور', '🏰 إقامات في فنادق الكهوف والأجواء الملكية'],
    heroImage: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1920&q=80',
  },
  dubai: {
    badge: 'dest.dubai.badge',
    badgeDefault: '💎 قمة الرفاهية والتجارب المستقبليّة',
    headline: 'dest.dubai.headline',
    headlineDefault: 'دبي.. عاصمة الفخامة العالمية والمغامرات الحديثة',
    subtitle: 'dest.dubai.subtitle',
    subtitleDefault: 'Dubai: The Global Capital of Luxury & Futuristic Wonders',
    desc: 'dest.dubai.desc',
    descDefault: 'عِش تجربة سياحية لا تُضاهى بين أطول ناطحات السحاب في العالم، والجزر الاصطناعية المذهلة، والتسوق الفاخر، إلى جانب سفاري الصحراء الملكي وتجارب اليخوت الخاصة.',
    tags: ['dest.dubai.tag1', 'dest.dubai.tag2', 'dest.dubai.tag3'],
    tagsDefault: ['🏙️ تذاكر برج خليفة والمنصات VIP', '🏎️ سيارات فاخرة ويخوت خاصة', '🏜️ سفاري صحراوي ملكي مع عشاء VIP'],
    heroImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80',
  },
  morocco: {
    badge: 'dest.morocco.badge',
    badgeDefault: '🕌 سحر المدن العتيقة ورمال الصحراء الكبرى',
    headline: 'dest.morocco.headline',
    headlineDefault: 'المغرب.. أصالة التراث الأندلسي وسحر مراكش الملكي',
    subtitle: 'dest.morocco.subtitle',
    subtitleDefault: 'Morocco: Imperial Cities & Sahara Mystique',
    desc: 'dest.morocco.desc',
    descDefault: 'استكشف أسرار فاس ومراكش والدار البيضاء، وعِش تجربة الرياضات الفاخرة، وانطلق في رحلات سفاري صحراوية لا تُنسى في مرزوكة.',
    tags: ['dest.morocco.tag1', 'dest.morocco.tag2', 'dest.morocco.tag3'],
    tagsDefault: ['🏰 إقامات في أفخم الرياضات التاريخية', '🐫 مغامرات صحراوية فاخرة في مرزوكة', '🎨 جولات حصرية في أسواق مراكش وفاس'],
    heroImage: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=1920&q=80',
  },
  tunisia: {
    badge: 'dest.tunisia.badge',
    badgeDefault: '🏛️ قرطاج الخالدة وسحر سيدي بوسعيد الأزرق',
    headline: 'dest.tunisia.headline',
    headlineDefault: 'تونس.. عبق التاريخ القرطاجي وواحات الصحراء والساحل',
    subtitle: 'dest.tunisia.subtitle',
    subtitleDefault: 'Tunisia: Ancient Carthage & Blue Mediterranean Charm',
    desc: 'dest.tunisia.desc',
    descDefault: 'اكتشف روعة الآثار الرومانية في الجم، وسحر الأزقة البيضاء والزرقاء في سيدي بوسعيد، وقصور تطاوين التاريخية وواحات توزر الساحرة.',
    tags: ['dest.tunisia.tag1', 'dest.tunisia.tag2', 'dest.tunisia.tag3'],
    tagsDefault: ['🏛️ مسرح الجم وآثار قرطاج الأسطورية', '🌊 سيدي بوسعيد والإطلالات المتوسطية', '🌴 واحات توزر والتخييم الصحراوي الفاخر'],
    heroImage: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80',
  },
  greece: {
    badge: 'dest.greece.badge',
    badgeDefault: '🇬🇷 سحر الأسطورة الإغريقية وجزر إيجة البيضاء',
    headline: 'dest.greece.headline',
    headlineDefault: 'اليونان.. مهد الحضارة وأجمل جزر العالم الرومانسية',
    subtitle: 'dest.greece.subtitle',
    subtitleDefault: 'Greece: Cradle of Legends & Iconic Aegean Sunsets',
    desc: 'dest.greece.desc',
    descDefault: 'استمتع بشروق الشمس وسحر غروبها في سانتوريني، وتجول بين أعمدة الأكروبوليس في أثينا، وابحر في مياه البحر إيجة الكريستالية على متن أفخم اليخوت البحرية.',
    tags: ['dest.greece.tag1', 'dest.greece.tag2', 'dest.greece.tag3'],
    tagsDefault: ['🌅 إقامات بحمام سباحة خاص في سانتوريني', '🏛️ جولات الأكروبوليس والآثار الإغريقية VIP', '🛥️ كروز جزر ميكونوس وكريد المخصصة'],
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1920&q=80',
  },
  'multi-country': {
    badge: 'nav.multiCountry',
    badgeDefault: '🌍 جولات عبر بلدان متعددة',
    headline: 'dest.egypt.multiCountryTitle',
    headlineDefault: 'برامج سياحية مشتركة عبر الشرق الأوسط والمتوسط',
    subtitle: 'dest.egypt.multiCountrySubtitle',
    subtitleDefault: 'Multi-Country Grand Expeditions',
    desc: 'dest.egypt.multiCountryDesc',
    descDefault: 'استكشف مسارات مدمجة تجمع بين سحر مصر، عراقة الأردن، فخامة دبي، وجزر اليونان في باقة متكاملة لا تُنسى.',
    tags: ['dest.starsMiddleEast', 'dest.egyptGreece', 'dest.egyptTurkey'],
    tagsDefault: ['🌟 نجوم الشرق الأوسط (19 يومًا)', '🏛️ مصر واليونان (11 يومًا)', '✨ مصر وتركيا (15 يومًا)'],
    heroImage: 'https://res.cloudinary.com/degbrq3ck/image/upload/v1783030113/Gemini_Generated_Image_cb2enncb2enncb2e_wvyejn.jpg',
  },
  religious: {
    badge: 'nav.religious',
    badgeDefault: '🕊️ رحلات الإيمان والتاريخ الروحاني الخالد',
    headline: 'dest.holylands.headline',
    headlineDefault: 'رحلات مسار العائلة المقدسة والآثار الروحانية',
    subtitle: 'dest.holylands.subtitle',
    subtitleDefault: 'Holy Family Trail & Sacred Spiritual Pilgrimages',
    desc: 'dest.holylands.desc',
    descDefault: 'انطلق في رحلة إيمانية عميقة تتبع خطى العائلة المقدسة عبر أديرة وكنائس مصر القديمة وجبال سيناء وصولاً إلى الأردن.',
    tags: ['dest.holylands.tag1', 'dest.holylands.tag2', 'dest.holylands.tag3'],
    tagsDefault: ['📖 مرشدون متخصصون في التاريخ الديني', '🏨 إقامات 5 نجوم قريبة من المعالم المقدسة', '✈️ خدمات التأشيرة والتنقلات VIP الشاملة'],
    heroImage: '/images/holy-land.webp',
  },
  holyland: {
    badge: 'nav.holyland',
    badgeDefault: '🕊️ مهد الحضارات والآثار الروحانية الخالدة',
    headline: 'dest.holyland.title',
    headlineDefault: 'الأراضي المقدسة.. تاريخ عريق وإرث إيماني أسطوري',
    subtitle: 'dest.holyland.subtitle',
    subtitleDefault: 'Holy Land: Ancient History & Eternal Spiritual Heritage',
    desc: 'dest.holyland.desc',
    descDefault: 'استكشف المعالم التاريخية والروحية الفريدة في الأراضي المقدسة، واختبر جولات فريدة مخصصة بين أقدم مواقع التراث البشري.',
    tags: ['dest.holyland.tag1', 'dest.holyland.tag2', 'dest.holyland.tag3'],
    tagsDefault: ['🕊️ جولات الإرث الروحي والتاريخي VIP', '🏨 إقامات فاخرة في أرقى الفنادق التاريخية', '✈️ تنظيم كامل للخدمات والتنقلات المريحة'],
    heroImage: '/images/holy-land.webp',
  },
  'holy-land': {
    badge: 'nav.holyland',
    badgeDefault: '🕊️ مهد الحضارات والآثار الروحانية الخالدة',
    headline: 'dest.holyland.title',
    headlineDefault: 'الأراضي المقدسة.. تاريخ عريق وإرث إيماني أسطوري',
    subtitle: 'dest.holyland.subtitle',
    subtitleDefault: 'Holy Land: Ancient History & Eternal Spiritual Heritage',
    desc: 'dest.holyland.desc',
    descDefault: 'استكشف المعالم التاريخية والروحية الفريدة في الأراضي المقدسة، واختبر جولات فريدة مخصصة بين أقدم مواقع التراث البشري.',
    tags: ['dest.holyland.tag1', 'dest.holyland.tag2', 'dest.holyland.tag3'],
    tagsDefault: ['🕊️ جولات الإرث الروحي والتاريخي VIP', '🏨 إقامات فاخرة في أرقى الفنادق التاريخية', '✈️ تنظيم كامل للخدمات والتنقلات المريحة'],
    heroImage: '/images/holy-land.webp',
  }
};

export default function LandingPageDetails({ destinationOnly = false, slug: slugProp }) {
  const params = useParams();
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const routeSlug = params.slug || params.programSlug || params.programId || params.id;
  const rawSlug = slugProp || routeSlug || (pathSegments.length > 0 ? pathSegments[pathSegments.length - 1] : undefined);
  const slug = (rawSlug || '').toLowerCase().trim();
  const { t } = useTranslation();
  const { landingPage, loading, error, retry } = useLandingPage(slug, { destinationOnly });

  if (loading) {
    return (
      <div className="mx-auto grid min-h-[60vh] max-w-6xl grid-cols-1 gap-8 px-6 py-24 md:grid-cols-3" role="status" aria-label={t('common.loading', 'Loading destination')}>
        {[0, 1, 2].map((item) => <div key={item} className="h-80 animate-pulse rounded-2xl bg-obsidian-200/70 dark:bg-obsidian-800/50" />)}
      </div>
    );
  }

  if (error) {
    const isMissing = error.status === 404;
    const isUnauthorized = error.status === 401 || error.status === 403;
    const title = isMissing
      ? t('destinations.unavailable', 'This destination is unavailable')
      : t('destinations.loadError', 'Destination details could not be loaded');
    const message = isMissing
      ? t('destinations.unavailableDescription', 'It may be unpublished, inactive, or no longer offered.')
      : isUnauthorized
        ? t('destinations.accessError', 'You do not have permission to view this destination.')
        : error.message || t('destinations.retryDescription', 'Please try again in a moment.');
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-start">
        <ErrorState
          title={title}
          message={message}
          actionLabel={t('common.tryAgain', 'Try again')}
          onRetry={retry}
        />
        <Link
          className="mx-auto mt-4 inline-flex min-h-11 items-center rounded-full border border-gold-500/30 px-5 py-3 font-semibold text-obsidian-900 dark:text-ivory-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          to="/destinations"
        >
          {t('destinations.back', 'Browse destinations')}
        </Link>
      </section>
    );
  }

  if (!landingPage) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-start">
        <ErrorState
          title={t('destinations.unavailable', 'This destination is unavailable')}
          message={t('destinations.unavailableDescription', 'It may be unpublished, inactive, or no longer offered.')}
          actionLabel={t('common.tryAgain', 'Try again')}
          onRetry={retry}
        />
        <Link
          className="mx-auto mt-4 inline-flex min-h-11 items-center rounded-full border border-gold-500/30 px-5 py-3 font-semibold text-obsidian-900 dark:text-ivory-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          to="/destinations"
        >
          {t('destinations.back', 'Browse destinations')}
        </Link>
      </section>
    );
  }

  const sections = readableSections(landingPage.sections);
  const sortedTours = Array.isArray(landingPage.tours)
    ? [...landingPage.tours].sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      })
    : [];

  const config = DEST_FALLBACK_DATA[slug] || {};

  const heroBadge = config.badge ? t(config.badge, config.badgeDefault) : (landingPage.type || 'LUXURY DESTINATION');
  const heroTitle = landingPage.title || (config.headline ? t(config.headline, config.headlineDefault) : slug.toUpperCase());
  const heroSubtitle = landingPage.subtitle || (config.subtitle ? t(config.subtitle, config.subtitleDefault) : '');
  const heroDesc = landingPage.description || (config.desc ? t(config.desc, config.descDefault) : landingPage.brief || '');
  const heroHighlights = config.tags
    ? config.tags.map((tagKey, idx) => t(tagKey, config.tagsDefault?.[idx] || ''))
    : [];
  const heroImage = landingPage.heroImageUrl || config.heroImage || '/imgs/egyothero.png';

  // Jordan specific matrices
  const isJordan = slug === 'jordan';
  const hotelCities = config.hotelCities || [];
  const includedItems = isJordan ? t('dest.jordan.includesList', { returnObjects: true }) : null;
  const excludedItems = isJordan ? t('dest.jordan.excludesList', { returnObjects: true }) : null;
  const safeIncludes = Array.isArray(includedItems) ? includedItems : [];
  const safeExcludes = Array.isArray(excludedItems) ? excludedItems : [];

  return (
    <main className="bg-obsidian-50 dark:bg-[#0c0d19] pb-24 text-start">
      <Helmet>
        <title>{`${landingPage.seoTitle || heroTitle} | Dunas Travel`}</title>
        {landingPage.seoDescription && <meta name="description" content={landingPage.seoDescription} />}
        {landingPage.seoKeywords && <meta name="keywords" content={landingPage.seoKeywords} />}
      </Helmet>

      {/* Luxury Hero Section */}
      {landingPage.heroVideoUrl ? (
        <section className="relative isolate overflow-hidden bg-obsidian-900 text-ivory-50">
          <video
            src={landingPage.heroVideoUrl}
            poster={heroImage}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 -z-20 h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-obsidian-950 via-obsidian-900/70 to-obsidian-950/40" />
          <div className="container mx-auto px-6 py-24 md:py-36">
            <Link
              to={destinationOnly ? '/destinations' : '/programs'}
              className="text-xs font-semibold uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5"
            >
              <FaCompass className="text-[11px]" />
              <span>{destinationOnly ? t('destinations.all', 'All destinations') : t('programs.all', 'All programs')}</span>
            </Link>
            <h1 className="mt-4 max-w-4xl text-display-xl font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
              {heroTitle}
            </h1>
            {heroSubtitle && (
              <p className="mt-3 max-w-2xl text-xl text-gold-300 font-medium">{heroSubtitle}</p>
            )}
            {landingPage.brief && (
              <p className="mt-5 max-w-3xl leading-relaxed text-ivory-200 text-body-lg">{landingPage.brief}</p>
            )}
          </div>
        </section>
      ) : (
        <LuxuryHeroSection
          badge={heroBadge}
          title={heroTitle}
          subtitle={heroSubtitle}
          description={heroDesc}
          highlights={heroHighlights.length > 0 ? heroHighlights : undefined}
          primaryCta={{
            text: t('destinations.exploreTours', 'Explore Tours & Packages ←'),
            link: '#tours-grid'
          }}
          secondaryCta={{
            text: t('home.tailorTour', 'Tailor Your Tour'),
            link: '/tailor-tour'
          }}
          bgImage={heroImage}
        />
      )}

      {/* Brief Overview Section */}
      {landingPage.brief && !landingPage.heroVideoUrl && (
        <section className="container mx-auto px-6 mt-16" id="overview">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-body-lg text-obsidian-600 dark:text-ivory-200 leading-relaxed">
              {landingPage.brief}
            </p>
          </div>
        </section>
      )}

      {/* Curated Destination Tours Section */}
      <section className="container mx-auto px-6 mt-12" id="tours-grid">
        <div className="mb-10 flex items-end justify-between gap-4 border-b border-gold-500/15 pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 dark:text-gold-400">
              {t('destinations.experiences', 'Curated Journeys')}
            </p>
            <h2 className="mt-1 text-display-lg text-obsidian-900 dark:text-ivory-50 font-display" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t('destinations.tours', 'Featured Experiences')}
            </h2>
          </div>
          <span className="rounded-full bg-gold-500/15 px-3.5 py-1 text-xs font-bold text-gold-700 dark:text-gold-400 border border-gold-500/30">
            {sortedTours.length} {sortedTours.length === 1 ? t('tours.tourSingular', 'Tour') : t('tours.tourPlural', 'Tours')}
          </span>
        </div>

        {sortedTours.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {sortedTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={{
                  ...tour,
                  price: Number(tour.basePriceUsd),
                  images: Array.isArray(tour.images) ? tour.images : (tour.heroImage ? [tour.heroImage] : []),
                  destination: tour.country,
                  badge: tour.customBadge,
                }}
              />
            ))}
          </motion.div>
        ) : (
          <div className="rounded-2xl border border-obsidian-200 dark:border-gray-800 bg-white dark:bg-[#1a1a30] p-10 text-center text-obsidian-600 dark:text-ivory-400 shadow-card">
            <p>{t('destinations.noTours', 'No published tours are currently available for this destination.')}</p>
          </div>
        )}
      </section>

      {/* Jordan Accommodation Schedule (5 Cities Breakdown) */}
      {isJordan && hotelCities.length > 0 && (
        <section className="container mx-auto px-6 mt-24">
          <div className="text-center mb-12">
            <h2
              className="text-display-lg text-obsidian-900 dark:text-ivory-50 font-display"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('dest.jordan.hotelsTitle', 'Accommodation Schedule & Luxury Hotels')}
            </h2>
            <div className="w-24 h-1 bg-gold-500 mx-auto mt-4" />
            <p className="text-body-md text-obsidian-600 dark:text-ivory-300 mt-4 max-w-2xl mx-auto">
              {t(
                'dest.jordan.hotelsDesc',
                'Based on availability, accommodation in one of the following hotels in each destination.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {hotelCities.map((city) => {
              const keyName = `hotelList${city.charAt(0).toUpperCase()}${city.slice(1)}`;
              return (
                <div
                  key={city}
                  className="bg-white dark:bg-[#1a1a30] rounded-2xl shadow-card border border-gold-500/15 overflow-hidden"
                >
                  <div className="bg-obsidian-900 px-5 py-3.5 flex items-center gap-2">
                    <FaHotel className="text-gold-400 text-sm flex-shrink-0" />
                    <h3 className="text-gold-400 font-semibold text-xs md:text-sm uppercase tracking-widest">
                      {t(`dest.jordan.hotelCities.${city}`, city)}
                    </h3>
                  </div>
                  <div className="p-5">
                    <p className="text-body-sm text-obsidian-700 dark:text-ivory-200 leading-relaxed whitespace-pre-line">
                      {t(`dest.jordan.${keyName}`, '')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Jordan Inclusions / Exclusions Matrix */}
      {isJordan && (safeIncludes.length > 0 || safeExcludes.length > 0) && (
        <section className="container mx-auto px-6 mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Included */}
            <div className="bg-white dark:bg-[#1a1a30] rounded-2xl p-8 border border-gold-500/20 shadow-card">
              <h3
                className="text-display-md text-2xl text-obsidian-900 dark:text-ivory-50 mb-6 font-display"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t('tourDetail.included', 'What is Included')}
              </h3>
              <ul className="flex flex-col gap-3.5">
                {safeIncludes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-body-md text-obsidian-700 dark:text-ivory-200">
                    <FaCheck className="text-emerald-500 mt-1 flex-shrink-0 text-sm" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {t('dest.jordan.mandatoryFees', '') && (
                <p className="text-caption text-obsidian-500 dark:text-ivory-400 mt-5 italic border-t border-gold-500/10 pt-3">
                  {t('dest.jordan.mandatoryFees', '')}
                </p>
              )}
            </div>

            {/* Excluded */}
            <div className="bg-white dark:bg-[#1a1a30] rounded-2xl p-8 border border-gold-500/20 shadow-card">
              <h3
                className="text-display-md text-2xl text-obsidian-900 dark:text-ivory-50 mb-6 font-display"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t('tourDetail.excluded', 'What is Excluded')}
              </h3>
              <ul className="flex flex-col gap-3.5">
                {safeExcludes.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-body-md text-obsidian-700 dark:text-ivory-200">
                    <FaTimes className="text-rose-400 mt-1 flex-shrink-0 text-sm" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Jordan Children Policy */}
      {isJordan && (
        <section className="container mx-auto px-6 mt-20">
          <div className="bg-white dark:bg-[#1a1a30] rounded-2xl p-8 border border-gold-500/20 max-w-5xl mx-auto shadow-card">
            <h3
              className="text-display-md text-2xl text-obsidian-900 dark:text-ivory-50 mb-6 font-display text-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t('dest.jordan.childrenTitle', 'Children Policy')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['children_0to2', 'children_3to10', 'children_11plus'].map((key) => {
                const text = t(`dest.jordan.${key}`, '');
                if (!text) return null;
                return (
                  <div key={key} className="bg-obsidian-50 dark:bg-[#151528] p-4 rounded-xl border border-gold-500/10 flex items-start gap-3">
                    <FaInfoCircle className="text-gold-500 text-base mt-0.5 shrink-0" />
                    <span className="text-body-sm text-obsidian-700 dark:text-ivory-200">{text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Sections from API */}
      {sections.length > 0 && (
        <section className="container mx-auto px-6 mt-16">
          <div className="mx-auto grid max-w-5xl gap-4">
            {sections.map((section, index) => (
              <div
                key={`${index}-${section.slice(0, 20)}`}
                className="rounded-2xl border border-gold-500/15 bg-white dark:bg-[#1a1a30] p-6 text-obsidian-700 dark:text-ivory-200 shadow-sm"
              >
                <p className="leading-relaxed">{section}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tailor-Made VIP Consultation CTA Section */}
      <section className="relative py-24 mt-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-obsidian-950/85 backdrop-blur-xs" />
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <span className="text-gold-400 uppercase tracking-widest text-sm font-semibold block mb-4">
            {t(`dest.${slug}.ctaLabel`, t('dest.egypt.ctaLabel', "DIDN'T FIND WHAT YOU'RE LOOKING FOR?"))}
          </span>
          <h2
            className="text-display-xl text-ivory-50 mb-6 font-display"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t(`dest.${slug}.ctaTitle`, t('dest.egypt.ctaTitle', `Let us design your perfect ${heroTitle} journey`))}
          </h2>
          <p className="text-body-lg text-ivory-300 mb-10">
            {t(
              `dest.${slug}.ctaDesc`,
              t('dest.egypt.ctaDesc', 'Tell us your preferences, and our expert travel designers will craft a bespoke itinerary tailored just for you.')
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
    </main>
  );
}
