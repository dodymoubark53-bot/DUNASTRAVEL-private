import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';
import { blogs as fallbackBlogs } from '../data/blogs';

/**
 * Hook to fetch blog posts from GET /api/blogs with resilient fallback to full static catalog
 * @param {Object} filters Query params (category, tag, limit, page)
 */
const blogsCache = new Map();
const pendingBlogsRequests = new Map();
const BLOGS_CACHE_TTL_MS = 300_000; // 5 minutes

export function useBlogs(filters = {}) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);

  const [blogs, setBlogs] = useState(fallbackBlogs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterKey = JSON.stringify(filters);
  const cacheKey = `${lang}:${filterKey}`;

  useEffect(() => {
    let isMounted = true;
    const currentFilters = filterKey ? JSON.parse(filterKey) : {};

    const fetchBlogs = async () => {
      try {
        await Promise.resolve();

        // 1. Serve from in-memory cache if fresh
        const cached = blogsCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < BLOGS_CACHE_TTL_MS) {
          if (isMounted) {
            setBlogs(cached.data);
            setLoading(false);
          }
          return;
        }

        setLoading(true);
        setError(null);

        // 2. Deduplicate concurrent requests
        let request = pendingBlogsRequests.get(cacheKey);
        if (!request) {
          const params = new URLSearchParams({ locale: lang });
          Object.entries(currentFilters).forEach(([k, v]) => {
            if (v !== undefined && v !== null) params.append(k, v);
          });

          request = api
            .get(`/blogs?${params.toString()}`)
            .then((res) => {
              const items = Array.isArray(res)
                ? res
                : Array.isArray(res?.items)
                  ? res.items
                  : Array.isArray(res?.data)
                    ? res.data
                    : null;
              if (!items || items.length === 0) {
                return fallbackBlogs;
              }
              // Merge backend items with fallback static catalog (keyed by slug/id)
              const mergedMap = new Map();
              fallbackBlogs.forEach((b) => mergedMap.set(b.slug || b.id, b));
              items.forEach((b) => mergedMap.set(b.slug || b.id, { ...mergedMap.get(b.slug || b.id), ...b }));
              const result = Array.from(mergedMap.values());
              blogsCache.set(cacheKey, { data: result, timestamp: Date.now() });
              return result;
            })
            .catch(() => fallbackBlogs)
            .finally(() => pendingBlogsRequests.delete(cacheKey));
          pendingBlogsRequests.set(cacheKey, request);
        }

        const items = await request;
        if (isMounted) {
          setBlogs(items && items.length > 0 ? items : fallbackBlogs);
        }
      } catch (err) {
        if (isMounted) {
          setBlogs(fallbackBlogs);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchBlogs();
    return () => {
      isMounted = false;
    };
  }, [cacheKey, filterKey, lang]);

  return {
    blogs,
    loading,
    error,
    retry: () => {
      blogsCache.delete(cacheKey);
      setLoading(true);
    },
  };
}
