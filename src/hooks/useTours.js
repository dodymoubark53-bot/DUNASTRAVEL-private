import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { tours as staticTours } from '../data/tours';
import { multiCountryTours } from '../data/multiCountryTours';
import programsData from '../data/programs.json';
import { turkeyTours } from '../data/turkeyTours';

// Build unified curated fallback catalog
const buildFallbackCatalog = () => {
  const catalog = [];
  const seenSlugs = new Set();

  const addTour = (t, defaultDest = 'egypt') => {
    if (!t || (!t.slug && !t.id)) return;
    const slug = t.slug || t.id;
    if (seenSlugs.has(slug)) return;
    seenSlugs.add(slug);

    const dest = (t.destination || defaultDest).toLowerCase();
    catalog.push({
      ...t,
      id: t.id || slug,
      slug,
      title: t.title || t.name || slug,
      overview: t.overview || t.description || t.title || '',
      duration: t.duration || 'N/A',
      destination: dest,
      images: Array.isArray(t.images) && t.images.length > 0
        ? t.images
        : t.heroImage
        ? [t.heroImage]
        : ['https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80'],
      raw: {
        price: parseFloat(t.price || t.basePriceUsd || (t.raw && t.raw.price) || 890),
        type: t.type || t.category || 'Luxury Journey'
      },
      price: parseFloat(t.price || t.basePriceUsd || (t.raw && t.raw.price) || 890),
      code: t.id || slug,
      highlights: t.highlights || [],
      included: t.included || [],
      excluded: t.excluded || [],
      itinerary: t.itinerary || []
    });
  };

  (staticTours || []).forEach(t => addTour(t, t.destination || 'egypt'));
  (multiCountryTours || []).forEach(t => addTour(t, 'multi-country'));
  (turkeyTours || []).forEach(t => addTour(t, 'turkey'));
  ((programsData && programsData.programs) || []).forEach(p => addTour(p, p.destination || 'jordan'));

  return catalog;
};

const fallbackCatalog = buildFallbackCatalog();

// Unified in-memory cache and promise deduplication map
const _toursCache = new Map();
const _pendingToursPromises = new Map();
const CACHE_TTL_MS = 60_000;

/**
 * Unified hook to fetch a list of tours from GET /api/tours with resilient catalog fallback
 * 
 * @param {Object} filters Query parameters (destination, category, market, lang, page, limit, search)
 */
export function useTours(filters = {}) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  
  const filterKey = JSON.stringify(filters);
  const cacheKey = `${lang}:${filterKey}`;

  const [tours, setTours] = useState(() => {
    const cached = _toursCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    return [];
  });
  const [loading, setLoading] = useState(() => {
    const cached = _toursCache.get(cacheKey);
    return !(cached && Date.now() - cached.timestamp < CACHE_TTL_MS);
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const currentFilters = filterKey ? JSON.parse(filterKey) : {};

    // Check fresh cache
    const cached = _toursCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      if (isMounted) {
        setTours(cached.data);
        setLoading(false);
      }
      return;
    }

    const getFallbackTours = () => {
      let filtered = [...fallbackCatalog];
      if (currentFilters.destination) {
        const targetDest = currentFilters.destination.toLowerCase();
        filtered = filtered.filter(t => {
          const tDest = (t.destination || '').toLowerCase();
          if (targetDest === 'egypt') return tDest.includes('egypt') || tDest.includes('eg');
          if (targetDest === 'turkey') return tDest.includes('turkey') || tDest.includes('tr');
          if (targetDest === 'jordan') return tDest.includes('jordan') || tDest.includes('jo');
          if (targetDest === 'morocco') return tDest.includes('morocco') || tDest.includes('ma');
          if (targetDest === 'dubai') return tDest.includes('dubai') || tDest.includes('uae');
          if (targetDest === 'tunisia') return tDest.includes('tunisia') || tDest.includes('tn');
          if (targetDest === 'greece') return tDest.includes('greece') || tDest.includes('gr');
          if (targetDest === 'multi-country') return tDest.includes('multi') || t.id.startsWith('mct');
          return tDest === targetDest;
        });
      }
      if (currentFilters.limit && Number(currentFilters.limit) > 0) {
        filtered = filtered.slice(0, Number(currentFilters.limit));
      }
      return filtered;
    };

    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);

        // Deduplicate in-flight requests
        let fetchPromise = _pendingToursPromises.get(cacheKey);
        if (!fetchPromise) {
          const params = new URLSearchParams({ lang });
          const filterKeys = ['destination', 'category', 'market', 'page', 'limit', 'search', 'isFeatured'];
          Object.entries(currentFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' && (filterKeys.includes(key) || key === 'lang')) {
              params.set(key, value);
            }
          });

          fetchPromise = api.get(`/tours?${params.toString()}`)
            .then(response => {
              let apiTours = [];
              if (Array.isArray(response)) {
                apiTours = response;
              } else if (response && Array.isArray(response.data)) {
                apiTours = response.data;
              } else if (response && Array.isArray(response.items)) {
                apiTours = response.items;
              }

              if (apiTours.length > 0) {
                const mappedTours = apiTours.map(tour => ({
                  ...tour,
                  id: tour.id || tour.slug,
                  slug: tour.slug,
                  title: tour.title || tour.name,
                  overview: tour.overview || tour.description || tour.title,
                  duration: tour.duration || 'N/A',
                  destination: String(tour.country || tour.destination || '').toLowerCase(),
                  images: tour.heroImage ? [tour.heroImage] : (tour.images && tour.images.length > 0 ? tour.images : ['https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80']),
                  raw: { price: parseFloat(tour.basePriceUsd || tour.price || 0), type: tour.category || 'classic' },
                  price: parseFloat(tour.basePriceUsd || tour.price || 0),
                  code: tour.id || tour.slug,
                  highlights: tour.highlights || tour.title,
                }));
                _toursCache.set(cacheKey, { data: mappedTours, timestamp: Date.now() });
                return mappedTours;
              } else {
                const fallbacks = getFallbackTours();
                _toursCache.set(cacheKey, { data: fallbacks, timestamp: Date.now() });
                return fallbacks;
              }
            })
            .finally(() => {
              _pendingToursPromises.delete(cacheKey);
            });

          _pendingToursPromises.set(cacheKey, fetchPromise);
        }

        const data = await fetchPromise;
        if (isMounted) {
          setTours(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          const fallbacks = getFallbackTours();
          setTours(fallbacks);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTours();

    return () => {
      isMounted = false;
    };
  }, [cacheKey, filterKey, lang]);

  return { tours, loading, error };
}

