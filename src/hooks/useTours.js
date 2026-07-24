import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

/**
 * Unified hook to fetch a list of tours from the API.
 * 
 * @param {Object} filters - Query parameters (e.g. { category: 'classic', destination: 'egypt', limit: 10, isFeatured: true })
 * @param {Array} fallbackTours - Optional fallback array to return if the API returns 0 items or fails.
 */
export const useTours = (filters = {}, fallbackTours = []) => {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Stringify filters for dependency array
  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    let isMounted = true;
    
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query string
        const params = new URLSearchParams({ lang });
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value);
          }
        });

        // The API returns PaginatedResponse<Tour> -> { data: Tour[], meta: {...} }
        // api.js unwraps the backend Envelope, so we just check for data array or the object itself
        const response = await api.get(`/tours?${params.toString()}`);
        
        let apiTours = [];
        if (Array.isArray(response)) {
          apiTours = response;
        } else if (response && Array.isArray(response.data)) {
          apiTours = response.data;
        }

        if (isMounted) {
          // Static fallback is only allowed in local development if explicitly requested
          const isDev = import.meta.env.DEV;
          if (apiTours.length === 0 && fallbackTours.length > 0 && isDev) {
            console.warn(`[useTours] [DEV] No tours returned from API for filters: ${filterKey}. Using static fallback.`);
            setTours(fallbackTours);
          } else {
            // Map the API schema to match what frontend list components expect
            const mappedTours = apiTours.map(tour => ({
              ...tour,
              id: tour.id,
              slug: tour.slug,
              title: tour.title,
              overview: tour.overview || tour.title,
              duration: tour.duration,
              images: tour.heroImage ? [tour.heroImage] : (tour.images || ['https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80']),
              raw: { price: parseFloat(tour.basePriceUsd || 0), type: tour.category },
              code: tour.id,
              highlights: tour.title,
            }));
            setTours(mappedTours);
          }
        }
      } catch (err) {
        console.error('[useTours] Failed to fetch tours from backend API:', err);
        if (isMounted) {
          setError(err);
          const isDev = import.meta.env.DEV;
          if (fallbackTours.length > 0 && isDev) {
            setTours(fallbackTours);
          } else {
            setTours([]);
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTours();

    return () => {
      isMounted = false;
    };
  }, [filterKey, lang]); // Removed fallbackTours from deps to avoid infinite loops if passed inline

  return { tours, loading, error };
};
