import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

const toursCache = new Map();
const pendingRequests = new Map();
const CACHE_TTL_MS = 300_000; // 5 minutes — tour catalog rarely changes within a session
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

function readMeta(response, itemCount = 0) {
  if (response?.meta && typeof response.meta === 'object') {
    return {
      total: Number.isInteger(response.meta.total) ? response.meta.total : itemCount,
      page: Number.isInteger(response.meta.page) ? response.meta.page : 1,
      limit: Number.isInteger(response.meta.limit) ? response.meta.limit : 10,
      totalPages: Number.isInteger(response.meta.totalPages) ? response.meta.totalPages : 1,
      hasNextPage: Boolean(response.meta.hasNextPage),
      hasPrevPage: Boolean(response.meta.hasPrevPage),
    };
  }
  return {
    total: itemCount,
    page: 1,
    limit: itemCount || 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };
}

function mapTour(tour) {
  if (!tour || typeof tour !== 'object') return null;
  const id = tour.id || tour._id || tour.slug;
  if (!id) return null;
  const slug = tour.slug || id;
  const title = tour.title || tour.name || 'Luxury Tour';
  const price = Number(tour.basePriceUsd ?? tour.price ?? 0);
  const images = Array.isArray(tour.images) && tour.images.length > 0
    ? tour.images
    : (tour.heroImage ? [tour.heroImage] : (tour.image ? [tour.image] : []));

  const country = String(tour.country || tour.destination || '').toLowerCase();
  const destination = country === 'united arab emirates' ? 'dubai' : (country || 'egypt');

  return {
    ...tour,
    id,
    slug,
    title,
    overview: typeof tour.overview === 'string' ? tour.overview : (tour.description || ''),
    duration: typeof tour.duration === 'string' ? tour.duration : '',
    destination,
    images,
    heroImage: tour.heroImage || images[0] || '/imgs/egyothero.png',
    raw: { price: Number.isFinite(price) ? price : 0, type: tour.category || '' },
    price: Number.isFinite(price) ? price : 0,
    code: id,
    highlights: Array.isArray(tour.highlights) ? tour.highlights : [],
    isFeatured: Boolean(tour.isFeatured),
    displayOrder: typeof tour.displayOrder === 'number' ? tour.displayOrder : 0,
  };
}

export function useTours(filters = {}) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const filterKey = JSON.stringify(filters);
  const cacheKey = `${lang}:${filterKey}`;
  const [tours, setTours] = useState(() => {
    const cached = toursCache.get(cacheKey);
    return cached?.data || [];
  });
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(() => !toursCache.has(cacheKey));
  const [error, setError] = useState(null);
  const [reloadNonce, setReloadNonce] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const currentFilters = JSON.parse(filterKey);
    const fetchTours = async () => {
      try {
        const fresh = toursCache.get(cacheKey);
        if (fresh && Date.now() - fresh.timestamp < CACHE_TTL_MS) {
          if (isMounted) {
            setTours(fresh.data);
            setMeta(fresh.meta);
            setLoading(false);
          }
          return;
        }
        
        // Stale-while-revalidate: keep existing tours instead of clearing to []
        if (!fresh) {
          setLoading(true);
        }
        setError(null);

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
            .then((response) => {
              const items = readTours(response).map(mapTour).filter(Boolean);
              const responseMeta = readMeta(response, items.length);
              const payload = { data: items, meta: responseMeta };
              toursCache.set(cacheKey, { ...payload, timestamp: Date.now() });
              return payload;
            })
            .finally(() => pendingRequests.delete(cacheKey));
          pendingRequests.set(cacheKey, request);
        }
        const payload = await request;
        if (isMounted) {
          setTours(payload.data);
          setMeta(payload.meta);
        }
      } catch (requestError) {
        if (isMounted) {
          // If network error, only clear if we had nothing cached
          const fallback = toursCache.get(cacheKey);
          if (!fallback) {
            setError(requestError);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchTours();
    return () => {
      isMounted = false;
    };
  }, [cacheKey, filterKey, lang, reloadNonce]);

  const retry = () => {
    toursCache.delete(cacheKey);
    setReloadNonce((value) => value + 1);
  };

  return {
    tours,
    meta,
    total: meta.total,
    page: meta.page,
    totalPages: meta.totalPages,
    hasNextPage: meta.hasNextPage,
    hasPrevPage: meta.hasPrevPage,
    loading,
    error,
    retry,
  };
}
