import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

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
  if (!response || !Array.isArray(response.data) || !response.meta) {
    throw new Error('Invalid canonical tours response');
  }
  return response.data;
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

export function useTours(filters = {}) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
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
              toursCache.set(cacheKey, { data: items, timestamp: Date.now() });
              return items;
            })
            .finally(() => pendingRequests.delete(cacheKey));
          pendingRequests.set(cacheKey, request);
        }
        const items = await request;
        if (isMounted) setTours(items);
      } catch (requestError) {
        if (isMounted) {
          setError(requestError);
          setTours([]);
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
