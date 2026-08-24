import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const useWishlist = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadGuestFavorites = () => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('dunas_guest_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  };

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites(loadGuestFavorites());
      return;
    }
    setLoading(true);
    try {
      const items = await api.get('/auth/favorites');
      if (!Array.isArray(items)) throw new Error('Invalid favorites collection');
      setFavorites(items);
    } catch (err) {
      console.warn('[useWishlist] Failed to fetch user favorites from API, using guest fallback:', err);
      setFavorites(loadGuestFavorites());
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const initFavs = async () => {
      if (!user) {
        if (isMounted) setFavorites(loadGuestFavorites());
        return;
      }
      setLoading(true);
      try {
        const items = await api.get('/auth/favorites');
        if (!Array.isArray(items)) throw new Error('Invalid favorites collection');
        if (isMounted) setFavorites(items);
      } catch (err) {
        console.warn('[useWishlist] Failed to initialize favorites:', err);
        if (isMounted) setFavorites(loadGuestFavorites());
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    initFavs();
    return () => { isMounted = false; };
  }, [user]);

  const isFavorite = (tourId) => {
    if (!tourId) return false;
    return favorites.some(
      (f) =>
        f.id === tourId ||
        f.tourId === tourId ||
        f.slug === tourId ||
        f._id === tourId ||
        f.code === tourId
    );
  };

  const toggleFavorite = async (tourOrId) => {
    const tourId = typeof tourOrId === 'object' && tourOrId !== null
      ? (tourOrId.id || tourOrId.slug)
      : tourOrId;

    if (!tourId) return false;

    const alreadyFav = isFavorite(tourId);

    if (user) {
      try {
        if (alreadyFav) {
          await api.delete(`/tours/${encodeURIComponent(tourId)}/favorite`);
          setFavorites((prev) =>
            prev.filter(
              (f) =>
                f.id !== tourId &&
                f.tourId !== tourId &&
                f.slug !== tourId &&
                f._id !== tourId &&
                f.code !== tourId
            )
          );
        } else {
          await api.post(`/tours/${encodeURIComponent(tourId)}/favorite`, {});
          await fetchFavorites();
        }
        return true;
      } catch (err) {
        console.warn('[useWishlist] API toggle failed, falling back to local toggle:', err);
      }
    }

    // Guest fallback (or offline mode)
    let updated;
    if (alreadyFav) {
      updated = favorites.filter(
        (f) =>
          f.id !== tourId &&
          f.tourId !== tourId &&
          f.slug !== tourId &&
          f._id !== tourId &&
          f.code !== tourId
      );
    } else {
      const tourObj = typeof tourOrId === 'object' && tourOrId !== null
        ? tourOrId
        : { id: tourId, slug: tourId, title: tourId };
      updated = [tourObj, ...favorites];
    }
    setFavorites(updated);
    try {
      localStorage.setItem('dunas_guest_favorites', JSON.stringify(updated));
    } catch {
      // ignore
    }
    return true;
  };

  return { favorites, loading, isFavorite, toggleFavorite, refetchFavorites: fetchFavorites };
};

