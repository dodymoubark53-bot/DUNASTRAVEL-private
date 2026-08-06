import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

export function useTour(slug) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!slug) return;

    const fetchTour = async () => {
      try {
        setLoading(true);
        // Always pass 'lang' query parameter matching active i18n language
        const data = await api.get(`/tours/${encodeURIComponent(slug)}?lang=${lang}`);
        if (isMounted) {
          setTour(data);
        }
      } catch (err) {
        // Never present a local fixture as a live tour after an API failure.
        if (isMounted) {
          setError(err);
          setTour(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTour();
    return () => {
      isMounted = false;
    };
  }, [slug, lang]);

  return { tour, loading, error };
}
