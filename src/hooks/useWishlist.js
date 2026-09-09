import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const GUEST_STORAGE_KEY = 'dunas_local_favorites';
const getUserStorageKey = (userId) => (userId ? `dunas_favorites_user_${userId}` : null);

const readGuestFavorites = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeGuestFavorites = (items) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('dunas_favorites_updated', { detail: items }));
  } catch (err) {
    console.warn('Failed to save favorites to localStorage:', err);
  }
};

const clearGuestFavorites = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(GUEST_STORAGE_KEY);
  } catch {}
};

const normalizeTour = (tourOrId) => {
  if (!tourOrId) return null;
  if (typeof tourOrId === 'string') {
    return { id: tourOrId, slug: tourOrId };
  }
  const id = tourOrId.id || tourOrId.slug || tourOrId._id;
  const slug = tourOrId.slug || tourOrId.id || tourOrId._id;
  return {
    ...tourOrId,
    id,
    slug,
    title: tourOrId.title,
    titleJsonb: tourOrId.titleJsonb,
    subtitle: tourOrId.subtitle,
    subtitleJsonb: tourOrId.subtitleJsonb,
    overview: tourOrId.overview,
    overviewJsonb: tourOrId.overviewJsonb,
    duration: tourOrId.duration,
    durationJsonb: tourOrId.durationJsonb,
    category: tourOrId.category,
    city: tourOrId.city,
    country: tourOrId.country,
    destination: tourOrId.destination || tourOrId.city || tourOrId.country || '',
    market: tourOrId.market,
    badge: tourOrId.badge || tourOrId.customBadge,
    minPax: tourOrId.minPax,
    minPaxJsonb: tourOrId.minPaxJsonb,
    rating: tourOrId.rating ?? (tourOrId.sourceRating ? Number(tourOrId.sourceRating) : 5),
    reviewsCount: tourOrId.reviewsCount ?? tourOrId.sourceReviewCount ?? 0,
    price: tourOrId.price ?? tourOrId.basePriceUsd,
    basePriceUsd: tourOrId.basePriceUsd ?? tourOrId.price,
    heroImage:
      tourOrId.heroImage ||
      (Array.isArray(tourOrId.images)
        ? typeof tourOrId.images[0] === 'string'
          ? tourOrId.images[0]
          : tourOrId.images[0]?.imageUrl
        : null),
    images: Array.isArray(tourOrId.images) ? tourOrId.images : [],
  };
};

export const useWishlist = () => {
  const { user } = useAuth();
  const userKey = getUserStorageKey(user?.id);

  const [favorites, setFavorites] = useState(() => {
    if (userKey && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(userKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {}
    }
    return readGuestFavorites();
  });
  const [loading, setLoading] = useState(true);
  const isSyncingRef = useRef(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      const local = readGuestFavorites();
      setFavorites(local);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // If user had guest favorites stored locally before login, sync them once to backend
      const guestFavs = readGuestFavorites();
      if (guestFavs.length > 0 && !isSyncingRef.current) {
        isSyncingRef.current = true;
        // Immediately clear guest favorites so they are never resynced on subsequent calls
        clearGuestFavorites();
        try {
          await Promise.allSettled(
            guestFavs.map((fav) => {
              const target = fav.slug || fav.id;
              return target ? api.post(`/tours/${target}/favorite`, {}) : Promise.resolve();
            })
          );
        } catch {
          // Ignore sync conflicts
        } finally {
          isSyncingRef.current = false;
        }
      }

      const data = await api.get('/auth/favorites');
      const backendFavs = Array.isArray(data) ? data : [];
      setFavorites(backendFavs);
      if (userKey && typeof window !== 'undefined') {
        localStorage.setItem(userKey, JSON.stringify(backendFavs));
      }
    } catch {
      if (userKey && typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem(userKey);
          if (cached) setFavorites(JSON.parse(cached));
        } catch {}
      } else {
        setFavorites(readGuestFavorites());
      }
    } finally {
      setLoading(false);
    }
  }, [user, userKey]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Real-time synchronization across components and browser tabs
  useEffect(() => {
    const handleCustomUpdate = (e) => {
      if (Array.isArray(e?.detail)) {
        setFavorites(e.detail);
      } else {
        fetchFavorites();
      }
    };

    const handleStorageUpdate = (e) => {
      const activeKey = userKey || GUEST_STORAGE_KEY;
      if (e.key === activeKey) {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setFavorites(Array.isArray(parsed) ? parsed : []);
        } catch {
          fetchFavorites();
        }
      }
    };

    window.addEventListener('dunas_favorites_updated', handleCustomUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('dunas_favorites_updated', handleCustomUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [fetchFavorites, userKey]);

  const isFavorite = useCallback(
    (tourOrId) => {
      if (!tourOrId) return false;
      const target = typeof tourOrId === 'string' ? tourOrId : tourOrId.id || tourOrId.slug;
      if (!target) return false;
      return favorites.some(
        (item) => item?.id === target || item?.slug === target || item === target
      );
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (tourOrId) => {
      const normalized = normalizeTour(tourOrId);
      if (!normalized) return;
      const targetKey = normalized.id || normalized.slug;
      if (!targetKey) return;

      const currentlyFav = favorites.some(
        (item) =>
          item?.id === normalized.id ||
          item?.slug === normalized.slug ||
          item?.id === targetKey ||
          item?.slug === targetKey ||
          item === targetKey
      );

      if (!user) {
        // Guest mode: save to localStorage with live event broadcast
        const currentLocal = readGuestFavorites();
        const exists = currentLocal.some(
          (item) =>
            item?.id === normalized.id ||
            item?.slug === normalized.slug ||
            item?.id === targetKey ||
            item?.slug === targetKey ||
            item === targetKey
        );

        let updatedList;
        if (exists) {
          updatedList = currentLocal.filter(
            (item) =>
              item?.id !== normalized.id &&
              item?.slug !== normalized.slug &&
              item?.id !== targetKey &&
              item?.slug !== targetKey &&
              item !== targetKey
          );
        } else {
          updatedList = [normalized, ...currentLocal];
        }

        setFavorites(updatedList);
        writeGuestFavorites(updatedList);
        return;
      }

      // Authenticated mode: optimistic update + backend API persistence
      if (currentlyFav) {
        const nextFavorites = favorites.filter(
          (item) =>
            item?.id !== normalized.id &&
            item?.slug !== normalized.slug &&
            item?.id !== targetKey &&
            item?.slug !== targetKey &&
            item !== targetKey
        );
        setFavorites(nextFavorites);
        if (userKey && typeof window !== 'undefined') {
          localStorage.setItem(userKey, JSON.stringify(nextFavorites));
        }

        try {
          await api.delete(`/tours/${targetKey}/favorite`);
        } catch (err) {
          console.error('Error removing favorite from backend:', err);
          await fetchFavorites();
        }
      } else {
        const nextFavorites = [normalized, ...favorites];
        setFavorites(nextFavorites);
        if (userKey && typeof window !== 'undefined') {
          localStorage.setItem(userKey, JSON.stringify(nextFavorites));
        }

        try {
          await api.post(`/tours/${targetKey}/favorite`, {});
        } catch (err) {
          if (err?.status !== 400) {
            console.error('Error adding favorite to backend:', err);
            await fetchFavorites();
          }
        }
      }
    },
    [favorites, user, userKey, fetchFavorites]
  );

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refetchFavorites: fetchFavorites,
  };
};

export default useWishlist;
