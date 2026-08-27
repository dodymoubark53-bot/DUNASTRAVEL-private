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
        : null;
  if (!items) {
    throw new Error('Invalid canonical destinations response');
  }
  return items.map((item) => {
    if (!item?.id || !item.slug || typeof item.title !== 'string') {
      throw new Error('Invalid destination catalog item');
    }
    const toursCount = Number(item.toursCount);
    if (!Number.isInteger(toursCount) || toursCount < 0) {
      throw new Error(`Invalid destination tours count for ${item.slug}`);
    }
    return {
      ...item,
      name: item.title,
      image: item.heroImageUrl || null,
      toursCount,
    };
  });
}

const destinationsCache = new Map();
const pendingDestinationsRequests = new Map();
const DESTINATIONS_CACHE_TTL_MS = 300_000; // 5 minutes

export function useDestinations() {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const cacheKey = lang;
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDestinations = async () => {
      try {
        await Promise.resolve();

        // 1. Serve from in-memory cache if fresh
        const cached = destinationsCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < DESTINATIONS_CACHE_TTL_MS) {
          if (isMounted) {
            setDestinations(cached.data);
            setLoading(false);
          }
          return;
        }

        setLoading(true);
        setError(null);

        // 2. Deduplicate concurrent requests
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
          setError(requestError);
          setDestinations([]);
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
    }
  };
}

export default useDestinations;
