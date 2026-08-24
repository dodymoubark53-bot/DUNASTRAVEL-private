import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

function readCmsCatalog(response, label) {
  const content = Array.isArray(response)
    ? response
    : Array.isArray(response?.content)
      ? response.content
      : Array.isArray(response?.data?.content)
        ? response.data.content
        : null;
  if (!content) throw new Error(`Invalid ${label} catalog response`);
  return content;
}

function requireFiniteNumber(value, field, id, { positive = false } = {}) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || (positive ? parsed <= 0 : parsed < 0)) {
    throw new Error(`Invalid ${field} for catalog item ${id}`);
  }
  return parsed;
}

function transformHotelToService(hotel) {
  if (!hotel?.id || !hotel?.name || !hotel?.destination || !hotel?.city) {
    throw new Error('Invalid hotel catalog item');
  }
  const pricePerNight = requireFiniteNumber(hotel.pricePerNight, 'pricePerNight', hotel.id);
  const rating = requireFiniteNumber(hotel.rating, 'rating', hotel.id);
  const stars = requireFiniteNumber(hotel.stars, 'stars', hotel.id, { positive: true });
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];

  return {
    ...hotel,
    slug: hotel.id,
    category: 'hotels',
    title: hotel.name,
    location: `${hotel.city} • ${hotel.destination}`,
    images: hotel.image ? [hotel.image] : [],
    image: hotel.image || null,
    rating,
    stars,
    price: pricePerNight,
    pricePerNight,
    shortDesc: hotel.description || '',
    amenities,
    isActive: hotel.isActive !== false,
  };
}

function transformTransportToService(vehicle) {
  if (!vehicle?.id || !vehicle?.name || !vehicle?.category) {
    throw new Error('Invalid transportation catalog item');
  }
  const seats = requireFiniteNumber(vehicle.seats, 'seats', vehicle.id, { positive: true });
  const doors = requireFiniteNumber(vehicle.doors, 'doors', vehicle.id);
  const rating = requireFiniteNumber(vehicle.rating, 'rating', vehicle.id);
  const pricePerDay = requireFiniteNumber(vehicle.pricePerDay, 'pricePerDay', vehicle.id);
  const features = Array.isArray(vehicle.features) ? vehicle.features : [];

  return {
    ...vehicle,
    slug: vehicle.id,
    title: vehicle.name,
    location: `${seats} Seats • ${vehicle.category.toUpperCase()}`,
    images: vehicle.image ? [vehicle.image] : [],
    image: vehicle.image || null,
    rating,
    seats,
    doors,
    transmission: vehicle.transmission || '',
    price: pricePerDay,
    pricePerDay,
    shortDesc: features.join(' • '),
    features,
    isActive: vehicle.isActive !== false,
  };
}

function readItems(response, label) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  throw new Error(`Invalid ${label} response`);
}

function transformTourToService(tour, category) {
  if (!tour?.id || !tour?.slug || !tour?.title) throw new Error('Invalid tour service item');
  const price = requireFiniteNumber(tour.basePriceUsd ?? tour.price, 'price', tour.id);
  const images = tour.heroImage
    ? [tour.heroImage]
    : Array.isArray(tour.images)
      ? tour.images.filter(Boolean)
      : [];
  return {
    ...tour,
    category,
    title: tour.title,
    location: tour.country || tour.destination || '',
    images,
    image: images[0] || null,
    price,
    shortDesc: tour.overview || tour.description || '',
  };
}

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
        let items;

        if (category === 'hotels') {
          const response = await api.get(`/cms/hotels_catalog?lang=${lang}`);
          items = readCmsCatalog(response, 'hotels')
            .filter((hotel) => hotel?.isActive !== false)
            .map(transformHotelToService);
        } else if (category === 'transportation') {
          const response = await api.get(`/cms/transportation_fleet?lang=${lang}`);
          items = readCmsCatalog(response, 'transportation')
            .filter((vehicle) => vehicle?.isActive !== false)
            .map(transformTransportToService);
        } else if (category) {
          const params = new URLSearchParams({ lang, category, limit: '100' });
          items = readItems(await api.get(`/tours?${params.toString()}`), 'tour services')
            .map((tour) => transformTourToService(tour, category));
        } else {
          const [hotelsResponse, fleetResponse] = await Promise.all([
            api.get(`/cms/hotels_catalog?lang=${lang}`),
            api.get(`/cms/transportation_fleet?lang=${lang}`),
          ]);
          const hotels = readCmsCatalog(hotelsResponse, 'hotels')
            .filter((hotel) => hotel?.isActive !== false)
            .map(transformHotelToService);
          const fleet = readCmsCatalog(fleetResponse, 'transportation')
            .filter((vehicle) => vehicle?.isActive !== false)
            .map(transformTransportToService);
          items = [...hotels, ...fleet];
        }

        if (isMounted) setServices(items);
      } catch (requestError) {
        if (isMounted) {
          setError(requestError);
          setServices([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchServices();
    return () => {
      isMounted = false;
    };
  }, [category, lang]);

  return { services, loading, error };
}
