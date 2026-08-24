import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

/**
 * Hook to fetch blog posts from GET /api/blogs with resilient fallback
 * @param {Object} filters Query params (category, tag, limit, page)
 */
export function useBlogs(filters = {}) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';

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
        let items = null;
        if (Array.isArray(res)) items = res;
        else if (res && Array.isArray(res.data)) items = res.data;
        else if (res && Array.isArray(res.items)) items = res.items;
        if (!items) throw new Error('Invalid blogs response');

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
