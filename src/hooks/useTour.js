import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

function normalizeTour(data) {
  if (!data?.id || !data?.slug || !data?.title || typeof data.currency !== 'string') {
    throw new Error('Invalid tour details response');
  }
  const price = Number(data.basePriceUsd);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Invalid tour price for ${data.slug}`);
  }
  if (!Array.isArray(data.images) || !Array.isArray(data.itinerary)
    || !Array.isArray(data.includedServices) || !Array.isArray(data.excludedServices)) {
    throw new Error(`Invalid canonical tour presentation for ${data.slug}`);
  }
  const images = data.images.map((image) => {
    if (!image?.id || typeof image.imageUrl !== 'string') {
      throw new Error(`Invalid canonical tour image for ${data.slug}`);
    }
    return image.imageUrl;
  });
  const itinerary = data.itinerary.map((item) => {
    if (!item?.id || !Number.isInteger(item.sortOrder) || typeof item.description !== 'string') {
      throw new Error(`Invalid canonical itinerary item for ${data.slug}`);
    }
    return {
      ...item,
      day: item.sortOrder + 1,
      title: item.dayLabel || '',
      meals: item.meals || null,
    };
  });

  return {
    ...data,
    images,
    included: data.includedServices,
    excluded: data.excludedServices,
    itinerary,
    price,
  };
}

import { tours as staticTours } from '../data/tours.js';

function getFallbackTour(slug, lang) {
  const normSlug = (slug === 'classic-program' || slug === 'classic') ? 'complete-egypt-8d' : slug;
  const match = staticTours.find(
    (t) => t.slug === normSlug || t.id === normSlug || String(t.code?.en || t.code?.ar || t.id).toLowerCase() === String(normSlug).toLowerCase(),
  );
  if (!match) return null;

  const resolveText = (val) => (typeof val === 'object' && val !== null ? (val[lang] || val.en || Object.values(val)[0]) : (val || ''));
  const resolveList = (val) => (Array.isArray(val) ? val : (val && typeof val === 'object' ? (val[lang] || val.en || []) : []));

  const price = Number(match.price || match.basePriceUsd || 0);
  const images = Array.isArray(match.images) && match.images.length > 0 ? match.images : (match.heroImage ? [match.heroImage] : []);

  const rawItinerary = Array.isArray(match.days)
    ? match.days
    : Array.isArray(match.itinerary)
      ? match.itinerary
      : (match.itinerary?.[lang] || match.itinerary?.en || []);

  const itinerary = rawItinerary.map((item, index) => ({
    id: `day-${index + 1}`,
    day: item.day || index + 1,
    title: resolveText(item.title) || `Day ${index + 1}`,
    description: resolveText(item.description),
    meals: resolveText(item.meals),
  }));

  return {
    ...match,
    id: match.id || match.slug,
    slug: match.slug,
    title: resolveText(match.title || match.name),
    overview: resolveText(match.overview),
    duration: resolveText(match.duration),
    country: match.country || match.destination || 'Morocco',
    destination: String(match.destination || match.country || '').toLowerCase(),
    images,
    heroImage: images[0] || '',
    price,
    basePriceUsd: price,
    included: resolveList(match.included || match.includes),
    excluded: resolveList(match.excluded || match.excludes),
    highlights: resolveList(match.highlights),
    minPax: resolveText(match.minPax),
    code: resolveText(match.code),
    pricing: match.pricing || null,
    itinerary,
    currency: 'USD',
  };
}

export function useTour(slug) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!slug) return undefined;

    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = normalizeTour(
          await api.get(`/tours/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`),
        );
        if (isMounted) setTour(result);
      } catch (requestError) {
        if (isMounted) {
          const fallback = getFallbackTour(slug, lang);
          if (fallback) {
            setTour(fallback);
          } else {
            setError(requestError);
            setTour(null);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void fetchTour();
    return () => {
      isMounted = false;
    };
  }, [slug, lang]);

  return { tour, loading, error };
}
