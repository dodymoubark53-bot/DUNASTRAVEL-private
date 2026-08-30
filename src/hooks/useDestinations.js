import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

function readDestinations(response) {
  const items = Array.isArray(response)
    ? response
    : Array.isArray(response?.items)
      ? response.items
      : Array.isArray(response?.data)
        ? response.data
        : [];
  return items.map((item) => {
    if (!item || typeof item !== 'object') return null;
    const slug = item.slug || item.id;
    if (!slug) return null;
    const toursCount = Number(item.toursCount || (Array.isArray(item.tours) ? item.tours.length : 0));
    return {
      ...item,
      id: item.id || slug,
      slug,
      title: item.title || item.name || slug,
      name: item.title || item.name || slug,
      image: item.heroImageUrl || item.image || null,
      toursCount: Number.isFinite(toursCount) ? Math.max(0, Math.round(toursCount)) : 0,
      tours: Array.isArray(item.tours) ? item.tours : [],
    };
  }).filter(Boolean);
}

const destinationsCache = new Map();
const pendingDestinationsRequests = new Map();
const DESTINATIONS_CACHE_TTL_MS = 300_000; // 5 minutes

export function useDestinations() {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const cacheKey = lang;
  const [destinations, setDestinations] = useState(() => {
    const cached = destinationsCache.get(cacheKey);
    return cached?.data || [];
  });
  const [loading, setLoading] = useState(() => !destinationsCache.has(cacheKey));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDestinations = async () => {
      try {
        const cached = destinationsCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < DESTINATIONS_CACHE_TTL_MS) {
          if (isMounted) {
            setDestinations(cached.data);
            setLoading(false);
          }
          return;
        }

        if (!cached) {
          setLoading(true);
        }
        setError(null);

        let request = pendingDestinationsRequests.get(cacheKey);
        if (!request) {
          request = api
            .get(`/destinations?locale=${encodeURIComponent(lang)}`)
            .then((res) => {
              const items = readDestinations(res);
              destinationsCache.set(cacheKey, { data: items, timestamp: Date.now() });
              return items;
            })
            .finally(() => pendingDestinationsRequests.delete(cacheKey));
          pendingDestinationsRequests.set(cacheKey, request);
        }

        const items = await request;
        if (isMounted) {
          setDestinations(items);
        }
      } catch (requestError) {
        if (isMounted) {
          const fallback = destinationsCache.get(cacheKey);
          if (!fallback) {
            setError(requestError);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void fetchDestinations();
    return () => {
      isMounted = false;
    };
  }, [cacheKey, lang]);

  return {
    destinations,
    loading,
    error,
    retry: () => {
      destinationsCache.delete(cacheKey);
      setLoading(true);
    },
  };
}

export default useDestinations;
