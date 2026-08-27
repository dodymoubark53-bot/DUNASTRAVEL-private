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
