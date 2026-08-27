import { useState, useEffect } from 'react';
import api from '../utils/api';

/**
 * Hook to fetch reviews from GET /api/tours/:slug/reviews (or /api/reviews)
 * @param {string} tourId Optional tour slug/id filter
 */
export function useReviews(tourId = null) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReviews = async () => {
      if (!tourId) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const path = `/tours/${encodeURIComponent(tourId)}/reviews`;

        const res = await api.get(path);

        let items = [];
        if (Array.isArray(res)) items = res;
        else if (res && Array.isArray(res.data)) items = res.data;
        else if (res && Array.isArray(res.items)) items = res.items;

        if (isMounted) {
          setReviews(items);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[useReviews] API network down, falling back to empty/cached list:', err);
          setError(err);
          setReviews([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReviews();
    return () => {
      isMounted = false;
    };
  }, [tourId]);

  const submitReview = async (tourSlug, { rating, comment }) => {
    const slugToUse = tourSlug || tourId;
    if (!slugToUse) throw new Error('Tour slug is required to submit a review');
    const res = await api.post(`/tours/${encodeURIComponent(slugToUse)}/reviews`, { rating, comment });
    return res;
  };

  return { reviews, loading, error, submitReview };
}

