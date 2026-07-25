import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

/**
 * Hook to fetch a single blog post by slug from GET /api/blogs/:slug
 * @param {string} slug
 */
export function useBlog(slug) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!slug) {
      return;
    }

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get(`/blogs/${slug}?lang=${lang}`);
        if (isMounted) {
          setBlog(data);
        }
      } catch (err) {
        if (isMounted) {
          console.warn(`[useBlog] Failed to fetch blog '${slug}':`, err);
          setError(err);
          setBlog(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlog();
    return () => {
      isMounted = false;
    };
  }, [slug, lang]);

  return { blog, loading, error };
}
