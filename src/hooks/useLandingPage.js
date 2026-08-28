import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

function normalizeLandingPage(value) {
  if (!value || !value.id || !value.slug || !value.title || !value.type || !Array.isArray(value.tours)) {
    throw new Error('Invalid landing page response');
  }

  return {
    ...value,
    tours: value.tours.map((tour) => {
      if (!tour?.id || !tour.slug || typeof tour.title !== 'string' || typeof tour.basePriceUsd !== 'string' || typeof tour.currency !== 'string') {
        throw new Error(`Invalid landing page tour for ${value.slug}`);
      }
      return tour;
    }),
  };
}

import { tours as staticTours } from '../data/tours.js';

function getFallbackLandingPage(slug, locale) {
  const normSlug = String(slug).toLowerCase();
  const matchedTours = staticTours
    .filter((t) => String(t.destination || t.country || t.category || '').toLowerCase() === normSlug)
    .map((t) => {
      const title = typeof t.title === 'object' ? (t.title[locale] || t.title.en || Object.values(t.title)[0]) : (t.title || '');
      const price = Number(t.price || t.basePriceUsd || 0);
      const images = Array.isArray(t.images) && t.images.length > 0 ? t.images : (t.heroImage ? [t.heroImage] : []);
      return {
        ...t,
        id: t.id || t.slug,
        slug: t.slug,
        title,
        basePriceUsd: String(price),
        currency: 'USD',
        country: t.country || t.destination || 'Morocco',
        images,
      };
    });

  if (normSlug === 'egypt') {
    return {
      id: 'egypt',
      slug: 'egypt',
      type: 'DESTINATION',
      title: locale === 'ar' ? 'مصر' : locale === 'es' ? 'Egipto' : locale === 'pt' ? 'Egito' : locale === 'it' ? 'Egitto' : 'Egypt',
      subtitle: locale === 'ar' ? 'أرض الفراعنة والتاريخ' : locale === 'es' ? 'Tierra de los Faraones' : 'Land of the Pharaohs',
      brief: locale === 'ar' ? 'حضارة عريقة وتاريخ مجيد.' : 'Ancient civilisation and historic heritage.',
      description: locale === 'ar' ? 'استكشف الوجهات والمعالم التاريخية في مصر.' : 'Explore historical landmarks and destinations in Egypt.',
      heroImageUrl: '/imgs/egyothero.png',
      tours: matchedTours,
    };
  }

  if (normSlug === 'morocco') {
    return {
      id: 'morocco',
      slug: 'morocco',
      type: 'DESTINATION',
      title: locale === 'ar' ? 'المغرب' : locale === 'es' ? 'Marruecos' : locale === 'pt' ? 'Marrocos' : locale === 'it' ? 'Marocco' : 'Morocco',
      subtitle: locale === 'ar' ? 'أرض الألوان والتوابل' : locale === 'es' ? 'Tierra de Colores y Especias' : 'Land of Colors & Spices',
      brief: locale === 'ar' ? 'من مدن فاس الإمبراطورية إلى أسواق مراكش العريقة.' : 'From the medinas of Fez to the vibrant souks of Marrakech.',
      description: locale === 'ar' ? 'استكشف ثقافة المغرب الغنية والهندسة المعمارية والرحلات عبر المدن الإمبراطورية.' : 'Explore rich Moroccan culture, imperial cities, and authentic experiences.',
      heroImageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200',
      tours: matchedTours,
    };
  }

  if (normSlug === 'tunisia' || normSlug === 'tunisie') {
    return {
      id: 'tunisia',
      slug: 'tunisia',
      type: 'DESTINATION',
      title: locale === 'ar' ? 'تونس' : locale === 'es' ? 'Túnez' : locale === 'pt' ? 'Tunísia' : locale === 'it' ? 'Tunisia' : 'Tunisia',
      subtitle: locale === 'ar' ? 'عبق قرطاج وسحر سيدي بوسعيد الأزرق' : 'Mediterranean Breeze & Carthage Legacies',
      brief: locale === 'ar' ? 'تجوّل بين الأزقة البيضاء والزرقاء واكتشف الآثار الرومانية والواحات الساحرة.' : 'Discover Carthage, Sidi Bou Said, and the Mediterranean shores.',
      description: locale === 'ar' ? 'استكشف المعالم التاريخية والرحلات الفاخرة في تونس.' : 'Explore historical landmarks and luxury tours in Tunisia.',
      heroImageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80',
      tours: matchedTours,
    };
  }

  if (matchedTours.length > 0) {
    return {
      id: normSlug,
      slug: normSlug,
      type: 'DESTINATION',
      title: normSlug.toUpperCase(),
      subtitle: 'Curated Experiences',
      brief: 'Explore our handpicked luxury tours.',
      description: 'Discover unforgettable journeys.',
      heroImageUrl: matchedTours[0].images?.[0] || '',
      tours: matchedTours,
    };
  }

  const tourMatch = staticTours.find(
    (t) => t.slug === normSlug || t.id === normSlug || t.slug === slug || t.id === slug
  );
  if (tourMatch) {
    const title = typeof tourMatch.title === 'object' ? (tourMatch.title[locale] || tourMatch.title.en || Object.values(tourMatch.title)[0]) : (tourMatch.title || '');
    const price = Number(tourMatch.price || tourMatch.basePriceUsd || 0);
    const images = Array.isArray(tourMatch.images) && tourMatch.images.length > 0 ? tourMatch.images : (tourMatch.heroImage ? [tourMatch.heroImage] : []);
    const normalizedTour = {
      ...tourMatch,
      id: tourMatch.id || tourMatch.slug,
      slug: tourMatch.slug,
      title,
      basePriceUsd: String(price),
      currency: 'USD',
      country: tourMatch.country || tourMatch.destination || 'Tunisia',
      images,
    };
    return {
      id: tourMatch.slug || tourMatch.id,
      slug: tourMatch.slug || tourMatch.id,
      type: 'TOUR',
      title: title || 'Luxury Experience',
      subtitle: 'Handpicked Luxury Tour',
      brief: typeof tourMatch.overview === 'object' ? (tourMatch.overview[locale] || tourMatch.overview.en || '') : (tourMatch.overview || ''),
      description: '',
      heroImageUrl: images[0] || '',
      tours: [normalizedTour],
    };
  }

  return null;
}

export function useLandingPage(slug, { destinationOnly = false } = {}) {
  const { i18n } = useTranslation();
  const locale = supportedLocale(i18n.language);
  const [landingPage, setLandingPage] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    if (!slug) return undefined;

    const endpoint = destinationOnly ? '/destinations' : '/tour-landing-pages';
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const page = normalizeLandingPage(
          await api.get(`${endpoint}/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`),
        );
        if (active) {
          const fallback = getFallbackLandingPage(slug, locale);
          if ((!page.tours || page.tours.length === 0) && fallback?.tours?.length > 0) {
            setLandingPage({
              ...page,
              tours: fallback.tours,
            });
          } else {
            setLandingPage(page);
          }
        }
      } catch (reason) {
        if (active) {
          const fallback = getFallbackLandingPage(slug, locale);
          if (fallback) {
            setLandingPage(fallback);
          } else {
            setLandingPage(null);
            setError(reason);
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => { active = false; };
  }, [destinationOnly, locale, slug]);

  return { landingPage, loading, error };
}

export default useLandingPage;
