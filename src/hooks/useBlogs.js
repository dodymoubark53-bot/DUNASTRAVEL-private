import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { blogs as staticBlogs } from '../data/blogs';

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

    const getFallbackBlogs = () => {
      let items = [...staticBlogs];
      if (currentFilters.category) {
        items = items.filter(b => (b.category || '').toLowerCase() === currentFilters.category.toLowerCase());
      }
      return items;
    };

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({ lang, locale: lang });
        Object.entries(currentFilters).forEach(([k, v]) => {
          if (v !== undefined && v !== null) params.append(k, v);
        });

        const res = await api.get(`/blogs?${params.toString()}`);
        let items = [];
        if (Array.isArray(res)) items = res;
        else if (res && Array.isArray(res.data)) items = res.data;
        else if (res && Array.isArray(res.items)) items = res.items;

        if (isMounted) {
          if (items.length > 0) {
            setBlogs(items);
          } else {
            setBlogs(getFallbackBlogs());
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[useBlogs] Failed to fetch blogs from API, using fallback:', err);
          setError(err);
          setBlogs(getFallbackBlogs());
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlogs();
    return () => {
      isMounted = false;
    };
  }, [filterKey, lang]);

  return { blogs, loading, error };
}
