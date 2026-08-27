import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

/**
 * Hook to fetch a single blog post by slug from GET /api/blogs/:slug with resilient fallback
 * @param {string} slug
 */
const blogCache = new Map();
const pendingBlogRequests = new Map();
const BLOG_CACHE_TTL_MS = 300_000; // 5 minutes

export function useBlog(slug) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const cacheKey = slug ? `${slug}:${lang}` : null;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!slug || !cacheKey) {
      return;
    }

    const fetchBlog = async () => {
      try {
        await Promise.resolve();

        // 1. Serve from cache
        const cached = blogCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < BLOG_CACHE_TTL_MS) {
          if (isMounted) {
            setBlog(cached.data);
            setLoading(false);
          }
          return;
        }

        setLoading(true);
        setError(null);

        // 2. Deduplicate
        let request = pendingBlogRequests.get(cacheKey);
        if (!request) {
          request = api
            .get(`/blogs/${encodeURIComponent(slug)}?locale=${encodeURIComponent(lang)}`)
            .then((data) => {
              if (data && (data.title || data.slug || data.id)) {
                blogCache.set(cacheKey, { data, timestamp: Date.now() });
                return data;
              }
              throw new Error('Invalid blog response');
            })
            .finally(() => pendingBlogRequests.delete(cacheKey));
          pendingBlogRequests.set(cacheKey, request);
        }

        const data = await request;
        if (isMounted) {
          setBlog(data);
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
  }, [cacheKey, slug, lang]);

  return {
    blog,
    loading,
    error,
    retry: () => {
      if (cacheKey) blogCache.delete(cacheKey);
      setLoading(true);
    },
  };
}
