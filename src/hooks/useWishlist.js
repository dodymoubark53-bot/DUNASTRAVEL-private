import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const useWishlist = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await api.get('/auth/favorites');
      setFavorites(Array.isArray(data) ? data : []);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = useCallback(
    (tourIdOrSlug) => {
      return favorites.some(
        (item) => item.id === tourIdOrSlug || item.slug === tourIdOrSlug
      );
    },
    [favorites]
  );

  const toggleFavorite = useCallback(
    async (tourIdOrSlug) => {
      if (!tourIdOrSlug) return;
      const currentlyFav = isFavorite(tourIdOrSlug);
      try {
        if (currentlyFav) {
          await api.delete(/tours//favorite);
          setFavorites((prev) =>
            prev.filter((f) => f.id !== tourIdOrSlug && f.slug !== tourIdOrSlug)
          );
        } else {
          await api.post(/tours//favorite, {});
          await fetchFavorites();
        }
      } catch (err) {
        console.error('Error toggling favorite:', err);
      }
    },
    [isFavorite, fetchFavorites]
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
