import { useState, useEffect } from 'react';
import api from '../utils/api';

const DEFAULT_LOCALES = [
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇪🇬', dir: 'rtl' },
  { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'pt', label: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
];

let cachedLocales = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 300_000; // 5 minutes

export function useActiveLocales() {
  const [activeCodes, setActiveCodes] = useState(() => {
    return cachedLocales || ['en', 'ar', 'es', 'pt', 'it'];
  });
  const [loading, setLoading] = useState(!cachedLocales);

  useEffect(() => {
    let isMounted = true;

    const fetchActiveLocales = async () => {
      try {
        if (cachedLocales && Date.now() - lastFetchTime < CACHE_TTL_MS) {
          if (isMounted) {
            setActiveCodes(cachedLocales);
            setLoading(false);
          }
          return;
        }

        const data = await api.get('/settings/public/locales');
        const list = Array.isArray(data?.locales) && data.locales.length > 0
          ? data.locales
          : ['en', 'ar', 'es', 'pt', 'it'];

        cachedLocales = list;
        lastFetchTime = Date.now();

        if (isMounted) {
          setActiveCodes(list);
        }
      } catch {
        // Resilient fallback to all default locales on network error or offline
        if (isMounted && !cachedLocales) {
          setActiveCodes(['en', 'ar', 'es', 'pt', 'it']);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchActiveLocales();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeLanguages = DEFAULT_LOCALES.filter((l) => activeCodes.includes(l.code));

  return {
    activeCodes,
    activeLanguages: activeLanguages.length > 0 ? activeLanguages : DEFAULT_LOCALES,
    loading,
  };
}

export default useActiveLocales;
