import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

function readItems(response, label) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.data)) return response.data;
  throw new Error(`Invalid ${label} response`);
}

function requireFiniteNumber(value, field, id, { positive = false } = {}) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || (positive ? parsed <= 0 : parsed < 0)) {
    throw new Error(`Invalid ${field} for catalog item ${id}`);
  }
  return parsed;
}

function transformHotelToService(hotel) {
  if (!hotel?.id && !hotel?.slug) {
    throw new Error('Invalid hotel catalog item');
  }
  const id = hotel.id || hotel.slug;
  const slug = hotel.slug || hotel.id;
  const name = typeof hotel.name === 'object' ? (hotel.name.en || hotel.name.ar || Object.values(hotel.name)[0]) : (hotel.name || slug);
  const stars = Number(hotel.stars) > 0 ? Number(hotel.stars) : 5;
  const rawPrice = hotel.pricePerNight ?? hotel.price ?? 0;
  const pricePerNight = Number(rawPrice) > 0 ? Number(rawPrice) : null;
  const rating = Number(hotel.rating) > 0 ? Number(hotel.rating) : stars;
  const city = hotel.city || 'Egypt';
  const destinationSlug = hotel.destinationSlug || 'egypt';
  const heroImage = hotel.heroImageUrl || hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
  const amenities = Array.isArray(hotel.amenities)
    ? hotel.amenities
    : hotel.amenities && typeof hotel.amenities === 'object'
      ? Object.entries(hotel.amenities)
          .filter(([, enabled]) => enabled === true)
          .map(([name]) => name.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()))
      : [];
  return {
    ...hotel,
    id,
    slug,
    category: 'hotels',
    title: name,
    name,
    location: `${city} - ${destinationSlug}`,
    images: hotel.heroImageUrl ? [hotel.heroImageUrl] : [heroImage],
    image: heroImage,
    rating,
    stars,
    price: pricePerNight,
    pricePerNight,
    overview: hotel.description ? [hotel.description] : [],
    highlights: amenities,
    included: [],
    excluded: [],
    shortDesc: hotel.description || '',
    amenities,
    isActive: true,
  };
}

function transformTransportToService(service) {
  if (!service?.id || !service?.name) {
    throw new Error('Invalid transportation service');
  }
  const rawPrice = service.basePriceUsd ?? service.pricePerDay ?? service.price ?? 0;
  const parsedPrice = Number(rawPrice);
  const pricePerTrip = Number.isFinite(parsedPrice) && parsedPrice >= 0 ? parsedPrice : 0;
  const heroImage = service.heroImageUrl || service.image || service.heroImage || null;
  const category = (service.vehicleCategory || service.category || 'bus').toLowerCase();

  return {
    ...service,
    id: service.id,
    name: service.name,
    category: 'transportation',
    vehicleCategory: category,
    vehicleType: service.vehicleType || service.name,
    capacity: service.capacity ?? service.seats ?? (category === 'private' ? 4 : category === 'coaster' ? 24 : 50),
    seats: service.capacity ?? service.seats ?? (category === 'private' ? 4 : category === 'coaster' ? 24 : 50),
    doors: service.doors ?? (category === 'private' ? 4 : 2),
    transmission: service.transmission || 'AUTO',
    serviceType: service.serviceType || 'AIRPORT',
    slug: service.id,
    title: service.name,
    location: String(service.serviceType || 'VIP Transfer').replaceAll('_', ' '),
    images: heroImage ? [heroImage] : [],
    image: heroImage,
    heroImage,
    heroImageUrl: heroImage,
    price: pricePerTrip,
    pricePerTrip,
    pricePerDay: pricePerTrip,
    overview: service.description ? [service.description] : [],
    highlights: [],
    included: [],
    excluded: [],
    features: Array.isArray(service.features) && service.features.length > 0
      ? service.features
      : Array.isArray(service.featuresJsonb)
        ? service.featuresJsonb
        : [],
    shortDesc: service.description || '',
    description: service.description || '',
    rating: service.rating || 5.0,
    reviews: service.reviews || 100,
    isActive: service.isActive !== false,
    isPrivate: service.isPrivate !== undefined ? Boolean(service.isPrivate) : category === 'private',
  };
}

function transformTourToService(tour, category) {
  if (!tour?.id || !tour?.slug || !tour?.title) throw new Error('Invalid tour service item');
  const price = requireFiniteNumber(tour.basePriceUsd ?? tour.price, 'price', tour.id);
  const images = tour.heroImage ? [tour.heroImage] : Array.isArray(tour.images) ? tour.images.filter(Boolean) : [];
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

function localeFor(language) {
  const locale = (language || 'en').split('-')[0];
  return ['en', 'ar', 'es', 'pt', 'it'].includes(locale) ? locale : 'en';
}

const servicesCache = new Map();
const pendingServicesRequests = new Map();
const SERVICES_CACHE_TTL_MS = 300_000; // 5 minutes

export function useServices(category = null) {
  const { i18n } = useTranslation();
  const lang = localeFor(i18n.language);
  const cacheKey = `${category || 'all'}:${lang}`;
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        await Promise.resolve();

        // 1. Serve from in-memory cache
        const cached = servicesCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < SERVICES_CACHE_TTL_MS) {
          if (isMounted) {
            setServices(cached.data);
            setLoading(false);
          }
          return;
        }

        setLoading(true);
        setError(null);

        // 2. Deduplicate
        let request = pendingServicesRequests.get(cacheKey);
        if (!request) {
          request = (async () => {
            let items;
            if (category === 'hotels') {
              items = readItems(await api.get(`/hotels?locale=${lang}`), 'hotels')
                .map(transformHotelToService);
            } else if (category === 'transportation') {
              items = readItems(await api.get(`/transportation/services?locale=${lang}`), 'transportation')
                .map(transformTransportToService);
            } else if (category) {
              const params = new URLSearchParams({ lang, category, limit: '30' });
              items = readItems(await api.get(`/tours?${params.toString()}`), 'tour services')
                .map((tour) => transformTourToService(tour, category));
            } else {
              const [hotelsResult, transportResult] = await Promise.allSettled([
                api.get(`/hotels?locale=${lang}`),
                api.get(`/transportation/services?locale=${lang}`),
              ]);
              const hotels = hotelsResult.status === 'fulfilled'
                ? readItems(hotelsResult.value, 'hotels').map(transformHotelToService)
                : [];
              const transportation = transportResult.status === 'fulfilled'
                ? readItems(transportResult.value, 'transportation').map(transformTransportToService)
                : [];
              items = [...hotels, ...transportation];
            }
            servicesCache.set(cacheKey, { data: items, timestamp: Date.now() });
            return items;
          })().finally(() => pendingServicesRequests.delete(cacheKey));
          pendingServicesRequests.set(cacheKey, request);
        }

        const items = await request;
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
    return () => { isMounted = false; };
  }, [cacheKey, category, lang]);

  return {
    services,
    loading,
    error,
    retry: () => {
      servicesCache.delete(cacheKey);
      setLoading(true);
    }
  };
}
