import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

/**
 * Hook to fetch a single blog post by slug from GET /api/blogs/:slug with resilient fallback
 * @param {string} slug
 */
export function useBlog(slug) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);

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
        const data = await api.get(`/blogs/${encodeURIComponent(slug)}?locale=${encodeURIComponent(lang)}`);
        if (isMounted) {
          if (data && (data.title || data.slug || data.id)) {
            setBlog(data);
          } else {
            throw new Error('Invalid blog response');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setBlog(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchBlog();
    return () => {
      isMounted = false;
    };
  }, [slug, lang]);

  return { blog, loading, error };
}
