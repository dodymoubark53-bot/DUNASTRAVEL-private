import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

const toursCache = new Map();
const pendingRequests = new Map();
const CACHE_TTL_MS = 60_000;
const ALLOWED_FILTERS = new Set([
  'destination',
  'category',
  'market',
  'page',
  'limit',
  'search',
  'isFeatured',
]);

function readTours(response) {
  const items = Array.isArray(response)
    ? response
    : Array.isArray(response?.items)
      ? response.items
      : Array.isArray(response?.data)
        ? response.data
        : null;
  if (!items) {
    throw new Error('Invalid canonical tours response');
  }
  return items;
}

function mapTour(tour) {
  if (!tour?.id || !tour?.slug || !tour?.title) {
    throw new Error('Invalid tour catalog item');
  }
  const price = Number(tour.basePriceUsd);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Invalid tour price for ${tour.slug}`);
  }
  const images = tour.heroImage ? [tour.heroImage] : [];

  return {
    ...tour,
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    overview: typeof tour.overview === 'string' ? tour.overview : '',
    duration: typeof tour.duration === 'string' ? tour.duration : '',
    destination: String(tour.country || '').toLowerCase(),
    images,
    raw: { price, type: tour.category || '' },
    price,
    code: tour.id,
    highlights: Array.isArray(tour.highlights) ? tour.highlights : [],
  };
}

import canonicalDb from '../data/database/unified_52_tours.json';

const staticTours = canonicalDb.tours || [];

function mapStaticTour(t, lang) {
  const title = typeof t.title === 'object' ? (t.title[lang] || t.title.en || t.title.ar || Object.values(t.title)[0]) : (t.title || '');
  const overview = typeof t.overview === 'object' ? (t.overview[lang] || t.overview.en || t.overview.ar || Object.values(t.overview)[0]) : (t.overview || '');
  const duration = typeof t.duration === 'object' ? (t.duration[lang] || t.duration.en || t.duration.ar || Object.values(t.duration)[0]) : (t.duration || '');
  const price = Number(t.price || t.basePriceUsd || 0);
  const destination = String(t.destination || t.country || '').toLowerCase();
  const images = Array.isArray(t.images) && t.images.length > 0 ? t.images : (t.heroImage ? [t.heroImage] : []);

  const resolveList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) {
      return val.map(item => {
        if (typeof item === 'object' && item !== null) {
          return item[lang] || item.en || item.ar || Object.values(item)[0] || '';
        }
        return String(item || '');
      }).filter(Boolean);
    }
    return [];
  };

  return {
    ...t,
    id: t.id || t.slug,
    slug: t.slug,
    title,
    overview,
    duration,
    destination,
    country: t.country || t.destination || 'Egypt',
    category: t.category || t.destination || '',
    images,
    heroImage: images[0] || '',
    raw: { price, type: t.category || t.type || '' },
    price,
    basePriceUsd: price,
    code: typeof t.code === 'object' ? (t.code[lang] || t.code.en || t.code.ar) : (t.code || t.id),
    highlights: resolveList(t.highlights),
    included: resolveList(t.included),
    excluded: resolveList(t.excluded),
  };
}

function getFallbackTours(filters, lang) {
  let items = staticTours.map((t) => mapStaticTour(t, lang));
  if (filters.destination) {
    const dest = String(filters.destination).toLowerCase();
    items = items.filter((t) => String(t.destination || '').toLowerCase() === dest);
  }
  if (filters.category) {
    const cat = String(filters.category).toLowerCase();
    items = items.filter((t) => String(t.category || '').toLowerCase().includes(cat));
  }
  if (filters.limit) {
    items = items.slice(0, Number(filters.limit));
  }
  return items;
}

export function useTours(filters = {}) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const filterKey = JSON.stringify(filters);
  const cacheKey = `${lang}:${filterKey}`;
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const currentFilters = JSON.parse(filterKey);
    const fetchTours = async () => {
      try {
        await Promise.resolve();
        const fresh = toursCache.get(cacheKey);
        if (fresh && Date.now() - fresh.timestamp < CACHE_TTL_MS) {
          if (isMounted) {
            setTours(fresh.data);
            setLoading(false);
          }
          return;
        }
        setLoading(true);
        setError(null);
        setTours([]);
        let request = pendingRequests.get(cacheKey);
        if (!request) {
          const params = new URLSearchParams({ lang });
          Object.entries(currentFilters).forEach(([key, value]) => {
            if (ALLOWED_FILTERS.has(key) && value !== undefined && value !== null && value !== '') {
              params.set(key, String(value));
            }
          });
          request = api
            .get(`/tours?${params.toString()}`)
            .then((response) => readTours(response).map(mapTour))
            .then((items) => {
              const finalItems = items.length > 0 ? items : getFallbackTours(currentFilters, lang);
              toursCache.set(cacheKey, { data: finalItems, timestamp: Date.now() });
              return finalItems;
            })
            .catch(() => getFallbackTours(currentFilters, lang))
            .finally(() => pendingRequests.delete(cacheKey));
          pendingRequests.set(cacheKey, request);
        }
        const items = await request;
        if (isMounted) setTours(items);
      } catch (requestError) {
        if (isMounted) {
          const fallback = getFallbackTours(currentFilters, lang);
          setTours(fallback);
          if (fallback.length === 0) setError(requestError);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchTours();
    return () => {
      isMounted = false;
    };
  }, [cacheKey, filterKey, lang]);

  return { tours, loading, error };
}
