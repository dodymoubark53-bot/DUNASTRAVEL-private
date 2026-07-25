import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import seedTours from '../data/tours';

/**
 * Unified hook to fetch a list of tours from GET /api/tours
 * 
 * @param {Object} filters Query parameters (destination, category, market, lang, page, limit, search)
 */
export function useTours(filters = {}) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    let isMounted = true;
    const currentFilters = filterKey ? JSON.parse(filterKey) : {};
    
    const fetchTours = async () => {
      try {
        setLoading(true);
        setError(null);

        // Always pass 'lang' query parameter matching active i18n language
        const params = new URLSearchParams({ lang });
        const filterKeys = ['destination', 'category', 'market', 'page', 'limit', 'search', 'isFeatured'];
        Object.entries(currentFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '' && (filterKeys.includes(key) || key === 'lang')) {
            params.set(key, value);
          }
        });

        const response = await api.get(`/tours?${params.toString()}`);
        
        let apiTours = [];
        if (Array.isArray(response)) {
          apiTours = response;
        } else if (response && Array.isArray(response.data)) {
          apiTours = response.data;
        } else if (response && Array.isArray(response.items)) {
          apiTours = response.items;
        }

        if (isMounted) {
          const mappedTours = apiTours.map(tour => ({
            ...tour,
            id: tour.id || tour.slug,
            slug: tour.slug,
            title: tour.title || tour.name,
            overview: tour.overview || tour.description || tour.title,
            duration: tour.duration || 'N/A',
            images: tour.heroImage ? [tour.heroImage] : (tour.images && tour.images.length > 0 ? tour.images : ['https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80']),
            raw: { price: parseFloat(tour.basePriceUsd || tour.price || 0), type: tour.category || 'classic' },
            code: tour.id || tour.slug,
            highlights: tour.highlights || tour.title,
          }));
          setTours(mappedTours);
        }
      } catch (err) {
        console.warn('[useTours] API network down, falling back to local seed data:', err.message);
        if (isMounted) {
          setError(err);
          // Fall back to local seed data ONLY when network connection is down
          if (Array.isArray(seedTours)) {
            let fallback = [...seedTours];
            if (currentFilters.destination) {
              fallback = fallback.filter(t => t.destination?.toLowerCase() === currentFilters.destination.toLowerCase());
            }
            if (currentFilters.category) {
              fallback = fallback.filter(t => t.category?.toLowerCase() === currentFilters.category.toLowerCase() || t.type?.toLowerCase() === currentFilters.category.toLowerCase());
            }
            if (currentFilters.limit) {
              fallback = fallback.slice(0, Number(currentFilters.limit));
            }
            setTours(fallback);
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
  }, [filterKey, lang]);

  return { tours, loading, error };
}
