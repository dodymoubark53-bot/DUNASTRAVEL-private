import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

/**
 * Hook to fetch services and transportation packages from GET /api/services or GET /api/transportation
 * @param {string} category Optional service category
 */
export function useServices(category = null) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ lang });
        if (category) params.append('category', category);

        const endpoint = category === 'transportation' ? `/transportation?${params.toString()}` : `/services?${params.toString()}`;
        const res = await api.get(endpoint);

        let items = [];
        if (Array.isArray(res)) items = res;
        else if (res && Array.isArray(res.data)) items = res.data;
        else if (res && Array.isArray(res.items)) items = res.items;

        if (isMounted) {
          setServices(items);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[useServices] Failed to fetch services:', err);
          setError(err);
          setServices([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchServices();
    return () => {
      isMounted = false;
    };
  }, [category, lang]);

  return { services, loading, error };
}
