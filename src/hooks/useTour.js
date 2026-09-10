import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';
import { resolveDestinationSlug } from '../utils/destinationHelper';

import canonicalDb from '../data/database/unified_52_tours.json';
import { dubaiTours } from '../data/dubaiTours';
import { homeTurkeyPreviewTours, homeJordanPreviewTours, homeDubaiPreviewTours } from '../data/homePreviewTours';

const allStaticTours = canonicalDb.tours || [];

const slugify = (text) => String(text || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export function getFallbackTour(slug, lang = 'en') {
  if (!slug) return null;
  const lowerSlug = String(slug).toLowerCase();
  
  let match = allStaticTours.find(
    (t) => String(t.slug || '').toLowerCase() === lowerSlug
      || String(t.id || '').toLowerCase() === lowerSlug
      || String(t.code?.en || t.code?.ar || t.code || '').toLowerCase() === lowerSlug,
  );

  if (!match) {
    const additionalDatasets = [
      ...(dubaiTours || []),
      ...(homeDubaiPreviewTours || []),
      ...(homeTurkeyPreviewTours || []),
      ...(homeJordanPreviewTours || []),
    ];

    match = additionalDatasets.find((t) => {
      const idStr = String(t.id || '').toLowerCase();
      const slugStr = String(t.slug || '').toLowerCase();
      const enTitle = typeof t.name === 'object' ? (t.name.en || t.name.ar || '') : String(t.name || t.title || '');
      const genSlug = slugify(`${t.id || ''}-${enTitle}`).toLowerCase();
      const codeStr = typeof t.code === 'object' ? (t.code.en || t.code.ar || '') : String(t.code || '');

      return lowerSlug === idStr
        || lowerSlug === slugStr
        || lowerSlug === genSlug
        || (codeStr && lowerSlug === codeStr.toLowerCase());
    });
  }

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
      const list = val[lang] || val.en || val.ar || val.es || Object.values(val)[0];
      if (Array.isArray(list)) return list.map(item => String(item || '')).filter(Boolean);
    }
    return [];
  };

  const rawPrice = match.price || match.basePriceUsd || match.pricing?.winter?.[0]?.dbl || match.pricing?.summer?.[0]?.dbl || 490;
  const price = Number(rawPrice);
  const images = Array.isArray(match.images) && match.images.length > 0
    ? match.images
    : (match.heroImage ? [match.heroImage] : ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80']);

  const rawItinerary = Array.isArray(match.days)
    ? match.days
    : Array.isArray(match.itinerary)
      ? match.itinerary
      : (match.itinerary?.[lang] || match.itinerary?.en || match.itinerary?.ar || []);

  const itinerary = rawItinerary.map((item, index) => ({
    id: `day-${item.day || index + 1}`,
    day: item.day || index + 1,
    title: resolveText(item.title) || (lang === 'ar' ? `اليوم ${item.day || index + 1}` : `Day ${item.day || index + 1}`),
    description: resolveText(item.description || item.desc),
    meals: resolveText(item.meals),
  }));

  const destName = match.destination || match.country || (String(match.id).startsWith('REG-') || String(match.id).startsWith('HM') ? 'dubai' : 'egypt');

  return {
    ...match,
    id: match.id || match.slug,
    slug: match.slug || slug,
    title: resolveText(match.title || match.name),
    overview: resolveText(match.overview),
    duration: resolveText(match.duration),
    country: match.country || (destName === 'dubai' ? 'United Arab Emirates' : 'Egypt'),
    destination: resolveDestinationSlug(destName),
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

function normalizeTour(data, lang = 'en') {
  const id = data?.id || data?.slug;
  const slug = data?.slug || data?.id;
  const title = typeof data?.title === 'object' ? (data.title[lang] || data.title.en || data.title.ar) : (data?.title || slug);
  if (!id || !slug || !title) {
    throw new Error('Invalid tour details response');
  }
  const rawPrice = data.basePriceUsd ?? data.price ?? data.basePrice ?? 0;
  const price = Number(rawPrice);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Invalid tour price for ${data.slug}`);
  }

  const fallback = getFallbackTour(data.slug, lang);

  const images = Array.isArray(data.images) && data.images.length > 0
    ? data.images.map((image) => (typeof image === 'string' ? image : image?.imageUrl || ''))
    : (fallback?.images || []);

  const rawItineraryList = (Array.isArray(data.itinerary) && data.itinerary.length > 0)
    ? data.itinerary
    : (Array.isArray(data.days) && data.days.length > 0)
      ? data.days
      : (Array.isArray(fallback?.itinerary) && fallback.itinerary.length > 0)
        ? fallback.itinerary
        : (Array.isArray(fallback?.days) && fallback.days.length > 0)
          ? fallback.days
          : [];

  const resolveField = (val) => {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object') return val[lang] || val.en || val.ar || Object.values(val)[0] || '';
    return String(val);
  };

  const itinerary = rawItineraryList.map((item, idx) => ({
    ...item,
    day: item.sortOrder !== undefined ? item.sortOrder + 1 : (item.day || idx + 1),
    title: resolveField(item.title) || resolveField(item.dayLabel) || `Day ${idx + 1}`,
    description: resolveField(item.description) || resolveField(item.desc) || '',
    meals: resolveField(item.meals) || null,
  }));

  const included = (Array.isArray(data.includedServices) && data.includedServices.length > 0)
    ? data.includedServices
    : (Array.isArray(data.included) && data.included.length > 0)
      ? data.included
      : (fallback?.included || []);

  const excluded = (Array.isArray(data.excludedServices) && data.excludedServices.length > 0)
    ? data.excludedServices
    : (Array.isArray(data.excluded) && data.excluded.length > 0)
      ? data.excluded
      : (fallback?.excluded || []);

  const highlights = (Array.isArray(data.highlights) && data.highlights.length > 0)
    ? data.highlights
    : (fallback?.highlights || []);

  return {
    ...data,
    images,
    included,
    excluded,
    highlights,
    pricingTiers: Array.isArray(data.seasonPricing?.pricingTiers)
      ? data.seasonPricing.pricingTiers
      : data.seasonPricing?.pricingTiers?.categories
        || data.seasonPricing?.pricing?.categories
        || fallback?.pricingTiers
        || [],
    optionalExcursionsPricing: data.seasonPricing?.optionalExcursionsPricing || null,
    accommodation: data.hotelInfo?.accommodation || fallback?.accommodation || null,
    hotels: data.hotelInfo?.hotels || fallback?.hotels || null,
    hotelCategory: data.hotelInfo?.hotelCategory || fallback?.hotelCategory || null,
    excursions: data.terms?.excursions || fallback?.excursions || [],
    transportOptions: data.transportation?.transportOptions || null,
    route: data.transportation?.route || null,
    itinerary,
    price,
    destination: resolveDestinationSlug(
      data.destination || data.country || fallback?.destination || fallback?.country || data.city || fallback?.city || 'egypt'
    ),
    country: data.country || fallback?.country || 'Egypt',
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

    if (!slug) {
      setTour(null);
      setLoading(false);
      return undefined;
    }

    setLoading(true);

    const fetchTour = async () => {
      try {
        const result = normalizeTour(
          await api.get(`/tours/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`),
          lang
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
            const errorMsg = requestError?.response?.data?.message || requestError?.message || 'Tour not found';
            setError(typeof errorMsg === 'string' ? errorMsg : String(errorMsg));
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

export default useTour;
