import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

/**
 * Hook to fetch blog posts from GET /api/blogs with resilient fallback
 * @param {Object} filters Query params (category, tag, limit, page)
 */
export function useBlogs(filters = {}) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    let isMounted = true;
    const currentFilters = filterKey ? JSON.parse(filterKey) : {};

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ locale: lang });
        Object.entries(currentFilters).forEach(([k, v]) => {
          if (v !== undefined && v !== null) params.append(k, v);
        });

        const res = await api.get(`/blogs?${params.toString()}`);
        const items = Array.isArray(res)
          ? res
          : Array.isArray(res?.items)
            ? res.items
            : Array.isArray(res?.data)
              ? res.data
              : null;
        if (!items) {
          throw new Error('Invalid canonical blogs response');
        }

        if (isMounted) {
          setBlogs(items);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setBlogs([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchBlogs();
    return () => {
      isMounted = false;
    };
  }, [filterKey, lang]);

  return { blogs, loading, error };
}
