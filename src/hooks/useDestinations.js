import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

const staticDestinations = [
  { id: 'egypt', slug: 'egypt', title: 'Egypt', name: 'Egypt', toursCount: 9 },
  { id: 'turkey', slug: 'turkey', title: 'Turkey', name: 'Turkey', toursCount: 15 },
  { id: 'dubai', slug: 'dubai', title: 'Dubai', name: 'Dubai', toursCount: 9 },
  { id: 'jordan', slug: 'jordan', title: 'Jordan', name: 'Jordan', toursCount: 7 },
  { id: 'morocco', slug: 'morocco', title: 'Morocco', name: 'Morocco', toursCount: 1 },
  { id: 'tunisia', slug: 'tunisia', title: 'Tunisia', name: 'Tunisia', toursCount: 1 },
  { id: 'greece', slug: 'greece', title: 'Greece', name: 'Greece', toursCount: 1 },
  { id: 'holy-land', slug: 'holy-land', title: 'Holy Land', name: 'Holy Land', toursCount: 0 },
];

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
              const result = items.length > 0 ? items : staticDestinations;
              destinationsCache.set(cacheKey, { data: result, timestamp: Date.now() });
              return result;
            })
            .catch(() => {
              destinationsCache.set(cacheKey, { data: staticDestinations, timestamp: Date.now() });
              return staticDestinations;
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
          const cached = destinationsCache.get(cacheKey);
          setDestinations(cached?.data || staticDestinations);
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
