import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';
import { blogs as fallbackBlogs } from '../data/blogs';

/**
 * Hook to fetch a single blog post by slug from GET /api/blogs/:slug with resilient fallback to full static catalog
 * @param {string} slug
 */
const blogCache = new Map();
const pendingBlogRequests = new Map();
const BLOG_CACHE_TTL_MS = 300_000; // 5 minutes

export function useBlog(slug) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const cacheKey = slug ? `${slug}:${lang}` : null;

  const initialFallback = slug ? fallbackBlogs.find((b) => b.slug === slug || b.id === slug) || null : null;
  const [blog, setBlog] = useState(initialFallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!slug || !cacheKey) {
      return;
    }

    const fallbackItem = fallbackBlogs.find((b) => b.slug === slug || b.id === slug) || null;

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
                const merged = fallbackItem ? { ...fallbackItem, ...data } : data;
                blogCache.set(cacheKey, { data: merged, timestamp: Date.now() });
                return merged;
              }
              if (fallbackItem) return fallbackItem;
              throw new Error('Invalid blog response');
            })
            .catch(() => fallbackItem)
            .finally(() => pendingBlogRequests.delete(cacheKey));
          pendingBlogRequests.set(cacheKey, request);
        }

        const data = await request;
        if (isMounted) {
          setBlog(data || fallbackItem);
        }
      } catch (err) {
        if (isMounted) {
          setBlog(fallbackItem);
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
