import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';
import canonicalDb from '../data/database/unified_52_tours.json';

const toursCache = new Map();
const pendingRequests = new Map();
const CACHE_TTL_MS = 60_000;
const ALLOWED_FILTERS = new Set([
  'destination',
  'category',
  'market',
  'page',
  'limit',
  'search',
  'isFeatured',
]);

const staticTours = canonicalDb.tours || [];

const DEST_ALIASES = {
  'united arab emirates': 'dubai',
  'uae': 'dubai',
  'emirates': 'dubai',
  'holy land': 'holy-land',
  'holyland': 'holy-land',
  'egypt': 'egypt',
  'turkey': 'turkey',
  'jordan': 'jordan',
  'morocco': 'morocco',
  'tunisia': 'tunisia',
  'greece': 'greece',
};

function normalizeDest(val) {
  const clean = String(val || '').toLowerCase().trim();
  return DEST_ALIASES[clean] || clean;
}

function mapTour(tour, lang = 'en') {
  if (!tour || typeof tour !== 'object') {
    throw new Error('Invalid tour catalog item');
  }
  const id = tour.id || tour.slug;
  const slug = tour.slug || tour.id;
  const rawTitle = tour.title || tour.name;
  const title = typeof rawTitle === 'object' && rawTitle !== null
    ? (rawTitle[lang] || rawTitle.en || rawTitle.ar || Object.values(rawTitle)[0] || slug)
    : String(rawTitle || slug || '');

  if (!id || !slug || !title) {
    throw new Error('Invalid tour catalog item');
  }

  const rawPrice = tour.basePriceUsd ?? tour.price ?? tour.basePrice ?? tour.raw?.price ?? 0;
  const price = Number(rawPrice);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Invalid tour price for ${slug}`);
  }

  const rawOverview = tour.overview ?? tour.description ?? tour.desc ?? '';
  const overview = typeof rawOverview === 'object' && rawOverview !== null
    ? (rawOverview[lang] || rawOverview.en || rawOverview.ar || Object.values(rawOverview)[0] || '')
    : String(rawOverview || '');

  const rawDuration = tour.duration ?? '';
  const duration = typeof rawDuration === 'object' && rawDuration !== null
    ? (rawDuration[lang] || rawDuration.en || rawDuration.ar || Object.values(rawDuration)[0] || '')
    : String(rawDuration || '');

  const destination = String(tour.destination || tour.country || '').toLowerCase();

  let images = [];
  if (Array.isArray(tour.images) && tour.images.length > 0) {
    images = tour.images.map(img => typeof img === 'string' ? img : (img?.imageUrl || img?.url || '')).filter(Boolean);
  } else if (tour.heroImage) {
    images = [tour.heroImage];
  } else if (tour.heroImageUrl) {
    images = [tour.heroImageUrl];
  }

  const resolveList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) {
      return val.map(item => {
        if (typeof item === 'object' && item !== null) {
          return item[lang] || item.en || item.ar || Object.values(item)[0] || '';
        }
        return String(item || '');
      }).filter(Boolean);
    }
    return [];
  };

  return {
    ...tour,
    id,
    slug,
    title,
    overview,
    duration,
    destination,
    country: tour.country || tour.destination || 'Egypt',
    category: tour.category || tour.type || tour.destination || '',
    images,
    heroImage: images[0] || '',
    raw: { price, type: tour.category || tour.type || '' },
    price,
    basePriceUsd: price,
    code: typeof tour.code === 'object' ? (tour.code[lang] || tour.code.en || tour.code.ar) : (tour.code || id),
    highlights: resolveList(tour.highlights),
    included: resolveList(tour.included || tour.includes || tour.includedServices),
    excluded: resolveList(tour.excluded || tour.excludes || tour.excludedServices),
  };
}

function mapStaticTour(t, lang) {
  const title = typeof t.title === 'object' ? (t.title[lang] || t.title.en || t.title.ar || Object.values(t.title)[0]) : (t.title || '');
  const overview = typeof t.overview === 'object' ? (t.overview[lang] || t.overview.en || t.overview.ar || Object.values(t.overview)[0]) : (t.overview || '');
  const duration = typeof t.duration === 'object' ? (t.duration[lang] || t.duration.en || t.duration.ar || Object.values(t.duration)[0]) : (t.duration || '');
  const price = Number(t.price || t.basePriceUsd || 0);
  const destination = String(t.destination || t.country || '').toLowerCase();
  const images = Array.isArray(t.images) && t.images.length > 0 ? t.images : (t.heroImage ? [t.heroImage] : []);

  const resolveList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) {
      return val.map(item => {
        if (typeof item === 'object' && item !== null) {
          return item[lang] || item.en || item.ar || Object.values(item)[0] || '';
        }
        return String(item || '');
      }).filter(Boolean);
    }
    return [];
  };

  return {
    ...t,
    id: t.id || t.slug,
    slug: t.slug,
    title,
    overview,
    duration,
    destination,
    country: t.country || t.destination || 'Egypt',
    category: t.category || t.destination || '',
    images,
    heroImage: images[0] || '',
    raw: { price, type: t.category || t.type || '' },
    price,
    basePriceUsd: price,
    code: typeof t.code === 'object' ? (t.code[lang] || t.code.en || t.code.ar) : (t.code || t.id),
    highlights: resolveList(t.highlights),
    included: resolveList(t.included),
    excluded: resolveList(t.excluded),
  };
}

function getFallbackTours(filters, lang) {
  let items = staticTours.map((t) => mapStaticTour(t, lang));

  if (filters.destination) {
    const targetDest = normalizeDest(filters.destination);
    items = items.filter((t) => {
      const tourDest = normalizeDest(t.destination || t.country);
      return tourDest === targetDest || tourDest.includes(targetDest) || targetDest.includes(tourDest);
    });
  }

  if (filters.category) {
    const cat = String(filters.category).toLowerCase();
    items = items.filter((t) => String(t.category || t.type || '').toLowerCase().includes(cat));
  }

  if (filters.search) {
    const q = String(filters.search).toLowerCase();
    items = items.filter((t) =>
      String(t.title || '').toLowerCase().includes(q) ||
      String(t.overview || '').toLowerCase().includes(q) ||
      String(t.slug || '').toLowerCase().includes(q)
    );
  }

  const total = items.length;
  const page = Math.max(1, Number(filters.page || 1));
  const limit = filters.limit ? Number(filters.limit) : total;
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;

  if (filters.page && filters.limit) {
    const start = (page - 1) * limit;
    items = items.slice(start, start + limit);
  } else if (filters.limit) {
    items = items.slice(0, limit);
  }

  return {
    items,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
}

function parseToursResponse(response, filters, lang) {
  let rawItems = [];
  let meta = {
    total: 0,
    page: Number(filters.page || 1),
    limit: Number(filters.limit || 12),
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  };

  if (Array.isArray(response)) {
    rawItems = response;
    meta.total = response.length;
  } else if (Array.isArray(response?.items)) {
    rawItems = response.items;
    meta.total = Number(response.total ?? response.items.length);
    meta.page = Number(response.page ?? meta.page);
    meta.limit = Number(response.limit ?? meta.limit);
    meta.totalPages = Number(response.totalPages ?? Math.ceil(meta.total / (meta.limit || 1)));
    meta.hasNextPage = Boolean(response.hasNextPage ?? (meta.page < meta.totalPages));
    meta.hasPrevPage = Boolean(response.hasPrevPage ?? (meta.page > 1));
  } else if (Array.isArray(response?.data)) {
    rawItems = response.data;
    const m = response.meta || {};
    meta.total = Number(m.total ?? response.data.length);
    meta.page = Number(m.page ?? meta.page);
    meta.limit = Number(m.limit ?? meta.limit);
    meta.totalPages = Number(m.totalPages ?? Math.ceil(meta.total / (meta.limit || 1)));
    meta.hasNextPage = Boolean(m.hasNextPage ?? (meta.page < meta.totalPages));
    meta.hasPrevPage = Boolean(m.hasPrevPage ?? (meta.page > 1));
  }

  const items = rawItems.map((t) => mapTour(t, lang));
  return { items, meta };
}

export function useTours(filters = {}) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const filterKey = JSON.stringify(filters);
  const cacheKey = `${lang}:${filterKey}`;
  const [toursState, setToursState] = useState(() => {
    const cached = toursCache.get(cacheKey);
    return cached?.data || {
      tours: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = () => {
    toursCache.delete(cacheKey);
    setRetryCount((c) => c + 1);
  };

  useEffect(() => {
    let isMounted = true;
    const currentFilters = JSON.parse(filterKey);
    const fetchTours = async () => {
      try {
        await Promise.resolve();
        const fresh = toursCache.get(cacheKey);
        if (fresh && Date.now() - fresh.timestamp < CACHE_TTL_MS) {
          if (isMounted) {
            setToursState(fresh.data);
            setLoading(false);
          }
          return;
        }
        setLoading(true);
        setError(null);
        let request = pendingRequests.get(cacheKey);
        if (!request) {
          const params = new URLSearchParams({ lang });
          Object.entries(currentFilters).forEach(([key, value]) => {
            if (ALLOWED_FILTERS.has(key) && value !== undefined && value !== null && value !== '') {
              params.set(key, String(value));
            }
          });
          request = api
            .get(`/tours?${params.toString()}`)
            .then((response) => parseToursResponse(response, currentFilters, lang))
            .then(({ items, meta }) => {
              const result = items.length > 0
                ? { tours: items, ...meta }
                : (() => {
                    const fallback = getFallbackTours(currentFilters, lang);
                    return { tours: fallback.items, ...fallback.meta };
                  })();
              toursCache.set(cacheKey, { data: result, timestamp: Date.now() });
              return result;
            })
            .catch(() => {
              const fallback = getFallbackTours(currentFilters, lang);
              return { tours: fallback.items, ...fallback.meta };
            })
            .finally(() => pendingRequests.delete(cacheKey));
          pendingRequests.set(cacheKey, request);
        }
        const resultData = await request;
        if (isMounted) setToursState(resultData);
      } catch (requestError) {
        if (isMounted) {
          const fallback = getFallbackTours(currentFilters, lang);
          setToursState({ tours: fallback.items, ...fallback.meta });
          if (fallback.items.length === 0) setError(requestError);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchTours();
    return () => {
      isMounted = false;
    };
  }, [cacheKey, filterKey, lang, retryCount]);

  return {
    tours: toursState.tours,
    total: toursState.total,
    page: toursState.page,
    limit: toursState.limit,
    totalPages: toursState.totalPages,
    hasNextPage: toursState.hasNextPage,
    hasPrevPage: toursState.hasPrevPage,
    loading,
    error,
    retry,
  };
}

