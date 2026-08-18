import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { blogs as staticBlogs } from '../data/blogs';

/**
 * Hook to fetch a single blog post by slug from GET /api/blogs/:slug with resilient fallback
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

    const getFallbackBlog = () => {
      return staticBlogs.find(b => b.slug === slug || b.id === slug) || null;
    };

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get(`/blogs/${slug}?lang=${lang}&locale=${lang}`);
        if (isMounted) {
          if (data && (data.title || data.slug || data.id)) {
            setBlog(data);
          } else {
            setBlog(getFallbackBlog());
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn(`[useBlog] Failed to fetch blog '${slug}', using fallback:`, err);
          setError(err);
          setBlog(getFallbackBlog());
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
