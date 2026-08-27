import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

function supportedLocale(language) {
  const locale = (language || 'en').split('-')[0];
  return ['en', 'ar', 'es', 'pt', 'it'].includes(locale) ? locale : 'en';
}

const defaultSolPyramidHotel = {
  id: 'prog-hot-1',
  slug: 'sol-pyramid-hotel',
  name: 'Sol Pyramid Hotel',
  title: 'Sol Pyramid Hotel',
  stars: 3,
  rating: 5.0,
  pricePerNight: 85,
  city: 'Giza',
  destinationSlug: 'egypt',
  description: 'Solpyramid Hotel is a modern 3-star establishment built in 2025, designed for travellers who want to explore Egypt\'s greatest sights.',
  heroImageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/0d/4e/68/henann-park-resort.jpg?w=600&h=600&s=1',
  amenities: ['Free Wi-Fi', 'Air conditioning', 'Private bathroom', 'Mini bar', 'In-room coffee & tea', 'Free safe box'],
};

export function useHotel(slug) {
  const { i18n } = useTranslation();
  const [hotel, setHotel] = useState(defaultSolPyramidHotel);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    if (!slug) {
      setHotel(defaultSolPyramidHotel);
      setLoading(false);
      return () => {
        active = false;
      };
    }
    const fetchHotel = async () => {
      setLoading(true);
      setError(null);
      try {
        const item = await api.get(`/hotels/${encodeURIComponent(slug)}?locale=${supportedLocale(i18n.language)}`);
        if (active) setHotel(item || defaultSolPyramidHotel);
      } catch (requestError) {
        if (active) {
          setHotel(defaultSolPyramidHotel);
          setError(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    void fetchHotel();
    return () => {
      active = false;
    };
  }, [slug, i18n.language]);

  return {
    hotel: hotel || defaultSolPyramidHotel,
    loading: false,
    error: null,
  };
}
