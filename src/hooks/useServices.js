import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

function transformHotelToService(hotel) {
  const destinationName = hotel.destination ? hotel.destination.charAt(0).toUpperCase() + hotel.destination.slice(1) : '';
  const locationStr = hotel.city ? `${hotel.city}${destinationName ? ` • ${destinationName}` : ''}` : (destinationName || 'Egypt');
  
  return {
    id: hotel.id,
    slug: hotel.id,
    category: 'hotels',
    title: hotel.name || 'Luxury Hotel',
    location: locationStr,
    images: [
      hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    rating: Number(hotel.rating) || 5.0,
    stars: Number(hotel.stars) || 5,
    price: Number(hotel.pricePerNight) || 300,
    shortDesc: hotel.description || '5-Star Luxury Accommodation',
    amenities: hotel.amenities || []
  };
}

function transformTransportToService(vehicle) {
  return {
    id: vehicle.id,
    slug: vehicle.id,
    category: 'transportation',
    title: vehicle.name || 'Luxury Fleet Vehicle',
    location: `${vehicle.seats || 4} Seats • ${vehicle.category?.toUpperCase() || 'VIP'}`,
    images: [
      vehicle.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
    ],
    rating: Number(vehicle.rating) || 4.9,
    price: Number(vehicle.pricePerDay) || 250,
    shortDesc: (vehicle.features || []).join(' • ') || 'Premium VIP Transportation',
    features: vehicle.features || []
  };
}

/**
 * Hook to fetch services, hotels, and transportation packages from backend CMS or /api/services
 * @param {string} category Optional service category ('hotels', 'transportation', 'safari', 'cruises', 'camping')
 */
export function useServices(category = null) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        let items = [];

        // 1. If fetching hotels, load from hotels_catalog CMS block
        if (category === 'hotels') {
          try {
            const res = await api.get(`/cms/hotels_catalog?lang=${lang}`);
            const rawHotels = res?.content || res?.data?.content || (Array.isArray(res) ? res : []);
            if (Array.isArray(rawHotels) && rawHotels.length > 0) {
              items = rawHotels.map(transformHotelToService);
            }
          } catch (err) {
            console.warn('[useServices] Falling back to /services for hotels:', err);
          }
        }

        // 2. If fetching transportation, load from transportation_fleet CMS block
        if (category === 'transportation') {
          try {
            const res = await api.get(`/cms/transportation_fleet?lang=${lang}`);
            const rawVehicles = res?.content || res?.data?.content || (Array.isArray(res) ? res : []);
            if (Array.isArray(rawVehicles) && rawVehicles.length > 0) {
              items = rawVehicles.map(transformTransportToService);
            }
          } catch (err) {
            console.warn('[useServices] Falling back to /services for transportation:', err);
          }
        }

        // 3. Fallback or generic services fetch from /services
        if (items.length === 0) {
          const params = new URLSearchParams({ lang });
          if (category && category !== 'transportation' && category !== 'hotels') {
            params.append('category', category);
          }

          const endpoint = `/services?${params.toString()}`;
          const res = await api.get(endpoint);

          let fetched = [];
          if (Array.isArray(res)) fetched = res;
          else if (res && Array.isArray(res.data)) fetched = res.data;
          else if (res && Array.isArray(res.items)) fetched = res.items;

          // If fetching all services (category === null), also fetch & merge hotels and transportation
          if (!category) {
            try {
              const [hotelsRes, transRes] = await Promise.allSettled([
                api.get(`/cms/hotels_catalog?lang=${lang}`),
                api.get(`/cms/transportation_fleet?lang=${lang}`)
              ]);

              if (hotelsRes.status === 'fulfilled') {
                const rawH = hotelsRes.value?.content || hotelsRes.value?.data?.content || [];
                if (Array.isArray(rawH)) {
                  fetched = [...fetched, ...rawH.map(transformHotelToService)];
                }
              }

              if (transRes.status === 'fulfilled') {
                const rawT = transRes.value?.content || transRes.value?.data?.content || [];
                if (Array.isArray(rawT)) {
                  fetched = [...fetched, ...rawT.map(transformTransportToService)];
                }
              }
            } catch (mergeErr) {
              console.warn('[useServices] Error merging CMS catalogs:', mergeErr);
            }
          }

          items = fetched;
        }

        if (isMounted) {
          setServices(items);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[useServices] Failed to fetch services:', err);
          setError(err);
          setServices([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchServices();
    return () => {
      isMounted = false;
    };
  }, [category, lang]);

  return { services, loading, error };
}
