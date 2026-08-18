import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

/**
 * Hook to fetch FAQs from GET /api/faqs
 * @param {string} category Optional category filter
 */
export function useFaqs(category = null) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchFaqs = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ lang, locale: lang });
        if (category) params.append('category', category);

        const res = await api.get(`/faq?${params.toString()}`).catch(() => api.get(`/faqs?${params.toString()}`));
        let items = [];
        if (Array.isArray(res)) items = res;
        else if (res && Array.isArray(res.data)) items = res.data;
        else if (res && Array.isArray(res.items)) items = res.items;

        if (isMounted) {
          setFaqs(items);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[useFaqs] Failed to fetch FAQs:', err);
          setError(err);
          setFaqs([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFaqs();
    return () => {
      isMounted = false;
    };
  }, [category, lang]);

  return { faqs, loading, error };
}
