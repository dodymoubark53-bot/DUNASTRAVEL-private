import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { tours as staticTours } from '../data/tours.js';

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

function getStaticLandingPage(slug, locale) {
  const normSlug = slug.toLowerCase();
  const matchingTours = staticTours.filter(t => 
    (t.destination || t.country || '').toLowerCase() === normSlug ||
    (t.category || '').toLowerCase() === normSlug
  );

  const tours = matchingTours.map(t => {
    const rawTitle = t.name || t.title;
    const title = typeof rawTitle === 'object' ? rawTitle[locale] || rawTitle.ar || rawTitle.en : rawTitle;
    const price = String(t.basePriceUsd || t.price || 450);
    return {
      id: t.id,
      slug: t.slug,
      title: typeof title === 'object' ? title[locale] || title.ar || title.en || t.slug : String(title || t.slug),
      basePriceUsd: price,
      currency: 'USD',
      images: t.images || [t.heroImage],
      country: t.country || 'Egypt',
      customBadge: t.badge || null,
    };
  });

  return {
    id: `static-${normSlug}`,
    slug: normSlug,
    title: normSlug === 'egypt' ? (locale === 'ar' ? 'مصر' : locale === 'pt' ? 'Egito' : 'Egypt') : normSlug,
    type: 'DESTINATION',
    subtitle: normSlug === 'egypt' ? (locale === 'ar' ? 'أرض الفراعنة والجمال الخالد' : 'Land of the Pharaohs') : '',
    brief: normSlug === 'egypt' ? (locale === 'ar' ? 'استكشف عراقة الآثار والأهرامات والعجائب.' : 'Explore ancient monuments and wonders.') : '',
    description: '',
    heroImageUrl: normSlug === 'egypt' ? '/imgs/egyothero.png' : 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1200',
    tours,
  };
}

export function useLandingPage(slug, { destinationOnly = false } = {}) {
  const { i18n } = useTranslation();
  const locale = i18n.language || 'en';
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
        let page;
        try {
          page = normalizeLandingPage(
            await api.get(`${endpoint}/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`),
          );
        } catch {
          page = null;
        }

        const fallback = getStaticLandingPage(slug, locale);
        if (!page) {
          page = fallback;
        } else {
          // Merge static tours if missing from API tours
          const apiSlugs = new Set(page.tours.map(t => t.slug.toLowerCase()));
          const missingStatic = fallback.tours.filter(st => !apiSlugs.has(st.slug.toLowerCase()));
          page = {
            ...page,
            tours: [...page.tours, ...missingStatic],
          };
        }

        // Also fetch any newly created published tours matching this destination from API
        try {
          const liveToursRes = await api.get(`/tours?destination=${encodeURIComponent(slug)}&lang=${encodeURIComponent(locale)}&limit=100`);
          const liveTours = Array.isArray(liveToursRes?.data) ? liveToursRes.data : (Array.isArray(liveToursRes) ? liveToursRes : []);
          if (liveTours.length > 0) {
            const currentSlugs = new Set((page.tours || []).map(t => t.slug.toLowerCase()));
            const newDynamicTours = liveTours
              .filter(t => t?.slug && !currentSlugs.has(t.slug.toLowerCase()))
              .map(t => ({
                id: t.id,
                slug: t.slug,
                title: typeof t.title === 'object' ? (t.title[locale] || t.title.ar || t.title.en || t.slug) : String(t.title || t.slug),
                basePriceUsd: String(t.basePriceUsd || t.price || 450),
                currency: t.currency || 'USD',
                images: t.images || (t.heroImage ? [t.heroImage] : []),
                country: t.country || slug,
                customBadge: t.badge || null,
              }));
            if (newDynamicTours.length > 0) {
              page = {
                ...page,
                tours: [...(page.tours || []), ...newDynamicTours],
              };
            }
          }
        } catch {
          // ignore if tours endpoint error
        }

        if (active) setLandingPage(page);
      } catch (reason) {
        if (active) {
          const fallback = getStaticLandingPage(slug, locale);
          setLandingPage(fallback);
          setError(null);
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
