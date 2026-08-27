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

  const country = String(tour.country || '').toLowerCase();
  const destination = country === 'united arab emirates' ? 'dubai' : country;

  return {
    ...tour,
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    overview: typeof tour.overview === 'string' ? tour.overview : '',
    duration: typeof tour.duration === 'string' ? tour.duration : '',
    destination,
    images,
    raw: { price, type: tour.category || '' },
    price,
    code: tour.id,
    highlights: Array.isArray(tour.highlights) ? tour.highlights : [],
  };
}

export function useTours(filters = {}) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const filterKey = JSON.stringify(filters);
  const cacheKey = `${lang}:${filterKey}`;
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadNonce, setReloadNonce] = useState(0);

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
          setTours([]);
          setError(requestError);
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

  return { tours, loading, error, retry };
}
