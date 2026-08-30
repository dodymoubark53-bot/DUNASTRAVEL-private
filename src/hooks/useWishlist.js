import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const LOCAL_STORAGE_KEY = 'dunas_local_favorites';

const readLocalFavorites = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalFavorites = (items) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('dunas_favorites_updated', { detail: items }));
  } catch (err) {
    console.warn('Failed to save favorites to localStorage:', err);
  }
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
    price: tourOrId.price ?? tourOrId.basePriceUsd,
    basePriceUsd: tourOrId.basePriceUsd ?? tourOrId.price,
    heroImage:
      tourOrId.heroImage ||
      (Array.isArray(tourOrId.images)
        ? typeof tourOrId.images[0] === 'string'
          ? tourOrId.images[0]
          : tourOrId.images[0]?.imageUrl
        : null),
  };
};

export const useWishlist = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState(() => {
    return readLocalFavorites();
  });
  const [loading, setLoading] = useState(true);
  const isSyncingRef = useRef(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      const local = readLocalFavorites();
      setFavorites(local);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // If user has guest favorites stored locally before login, sync them to backend
      const guestFavs = readLocalFavorites();
      if (guestFavs.length > 0 && !isSyncingRef.current) {
        isSyncingRef.current = true;
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
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(backendFavs));
      }
    } catch {
      setFavorites(readLocalFavorites());
    } finally {
      setLoading(false);
    }
  }, [user]);

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
      if (e.key === LOCAL_STORAGE_KEY) {
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
  }, [fetchFavorites]);

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
        const currentLocal = readLocalFavorites();
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
        writeLocalFavorites(updatedList);
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
        writeLocalFavorites(nextFavorites);

        try {
          await api.delete(`/tours/${targetKey}/favorite`);
        } catch (err) {
          console.error('Error removing favorite from backend:', err);
          await fetchFavorites();
        }
      } else {
        const nextFavorites = [normalized, ...favorites];
        setFavorites(nextFavorites);
        writeLocalFavorites(nextFavorites);

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
    [favorites, user, fetchFavorites]
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
