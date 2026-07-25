import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import seedTours from '../data/tours';

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
        console.warn(`[useTour] API network down for slug '${slug}', falling back to seed data:`, err.message);
        if (isMounted) {
          setError(err);
          // Fall back to seed data ONLY when network connection is down
          if (Array.isArray(seedTours)) {
            const fallbackTour = seedTours.find(
              (t) => t.slug === slug || t.id === slug || t.code === slug
            );
            if (fallbackTour) {
              setTour(fallbackTour);
            }
          }
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
