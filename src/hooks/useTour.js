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
    pricingTiers: Array.isArray(data.seasonPricing?.pricingTiers)
      ? data.seasonPricing.pricingTiers
      : data.seasonPricing?.pricingTiers?.categories
        || data.seasonPricing?.pricing?.categories
        || [],
    optionalExcursionsPricing: data.seasonPricing?.optionalExcursionsPricing || null,
    accommodation: data.hotelInfo?.accommodation || null,
    hotels: data.hotelInfo?.hotels || null,
    hotelCategory: data.hotelInfo?.hotelCategory || null,
    excursions: data.terms?.excursions || [],
    transportOptions: data.transportation?.transportOptions || null,
    route: data.transportation?.route || null,
    itinerary,
    price,
  };
}

import canonicalDb from '../data/database/unified_52_tours.json';

const allStaticTours = canonicalDb.tours || [];

function getFallbackTour(slug, lang = 'en') {
  const lowerSlug = slug ? String(slug).toLowerCase() : 'complete-egypt-8d';
  const normSlug = (lowerSlug.includes('classic') || lowerSlug === 'classic-program' || !slug) ? 'complete-egypt-8d' : slug;
  
  const match = allStaticTours.find(
    (t) => t.slug === normSlug || t.id === normSlug
      || t.slug === slug || t.id === slug
      || String(t.code?.en || t.code?.ar || t.code || t.id).toLowerCase() === String(normSlug).toLowerCase()
      || String(t.code?.en || t.code?.ar || t.code || t.id).toLowerCase() === String(slug).toLowerCase(),
  ) || allStaticTours.find((t) => t.destination === 'egypt') || allStaticTours[0];

  if (!match) return null;

  const resolveText = (val) => (typeof val === 'object' && val !== null ? (val[lang] || val.en || val.ar || val.es || Object.values(val)[0]) : (val || ''));
  
  const resolveList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) {
      return val.map(item => {
        if (typeof item === 'object' && item !== null) {
          return item[lang] || item.en || item.ar || item.es || Object.values(item)[0] || '';
        }
        return String(item || '');
      }).filter(Boolean);
    }
    if (typeof val === 'object' && val !== null) {
      return (val[lang] || val.en || val.ar || []).map(item => String(item || '')).filter(Boolean);
    }
    return [];
  };

  const price = Number(match.price || match.basePriceUsd || 0);
  const images = Array.isArray(match.images) && match.images.length > 0 ? match.images : (match.heroImage ? [match.heroImage] : []);

  const rawItinerary = Array.isArray(match.days)
    ? match.days
    : Array.isArray(match.itinerary)
      ? match.itinerary
      : (match.itinerary?.[lang] || match.itinerary?.en || match.itinerary?.ar || []);

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
    slug: match.slug || slug,
    title: resolveText(match.title || match.name),
    overview: resolveText(match.overview),
    duration: resolveText(match.duration),
    country: match.country || match.destination || 'Egypt',
    destination: String(match.destination || match.country || 'egypt').toLowerCase(),
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
  const [tour, setTour] = useState(() => getFallbackTour(slug, lang));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const initialFallback = getFallbackTour(slug, lang);
    if (initialFallback && isMounted) {
      setTour(initialFallback);
      setError(null);
    }

    if (!slug) return undefined;

    const fetchTour = async () => {
      try {
        const result = normalizeTour(
          await api.get(`/tours/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`),
        );
        if (isMounted) {
          setTour(result);
          setError(null);
        }
      } catch (requestError) {
        if (isMounted) {
          const fallback = getFallbackTour(slug, lang);
          if (fallback) {
            setTour(fallback);
            setError(null);
          } else {
            setError(requestError);
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
