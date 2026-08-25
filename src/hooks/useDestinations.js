import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

function readDestinations(response) {
  const items = Array.isArray(response)
    ? response
    : Array.isArray(response?.items)
      ? response.items
      : Array.isArray(response?.data)
        ? response.data
        : null;
  if (!items) {
    throw new Error('Invalid canonical destinations response');
  }
  return items.map((item) => {
    if (!item?.id || !item.slug || typeof item.title !== 'string') {
      throw new Error('Invalid destination catalog item');
    }
    const toursCount = Number(item.toursCount);
    if (!Number.isInteger(toursCount) || toursCount < 0) {
      throw new Error(`Invalid destination tours count for ${item.slug}`);
    }
    return {
      ...item,
      name: item.title,
      image: item.heroImageUrl || null,
      toursCount,
    };
  });
}

const STATIC_DESTINATIONS = [
  { id: 'egypt', slug: 'egypt', title: 'Egypt', name: 'Egypt', subtitle: 'Land of the Pharaohs', heroImageUrl: '/imgs/egyothero.png', image: '/imgs/egyothero.png', toursCount: 5 },
  { id: 'turkey', slug: 'turkey', title: 'Turkey', name: 'Turkey', subtitle: 'Where East Meets West', heroImageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', toursCount: 3 },
  { id: 'jordan', slug: 'jordan', title: 'Jordan', name: 'Jordan', subtitle: 'Kingdom of Wonder', heroImageUrl: 'https://images.unsplash.com/photo-1548786811-dd4f764bc046?w=1200', image: 'https://images.unsplash.com/photo-1548786811-dd4f764bc046?w=1200', toursCount: 2 },
  { id: 'morocco', slug: 'morocco', title: 'Morocco', name: 'Morocco', subtitle: 'Land of Colors & Spices', heroImageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200', toursCount: 1 },
  { id: 'greece', slug: 'greece', title: 'Greece', name: 'Greece', subtitle: 'Cradle of Civilization', heroImageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200', toursCount: 1 },
  { id: 'dubai', slug: 'dubai', title: 'Dubai', name: 'Dubai', subtitle: 'City of the Future', heroImageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', toursCount: 1 },
  { id: 'tunisia', slug: 'tunisia', title: 'Tunisia', name: 'Tunisia', subtitle: 'Oasis & Mediterranean Charm', heroImageUrl: 'https://images.unsplash.com/photo-1548786811-dd4f764bc046?w=1200', image: 'https://images.unsplash.com/photo-1548786811-dd4f764bc046?w=1200', toursCount: 1 },
];

export function useDestinations() {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError(null);
        const items = readDestinations(
          await api.get(`/destinations?locale=${encodeURIComponent(lang)}`),
        );
        if (isMounted) setDestinations(items.length > 0 ? items : STATIC_DESTINATIONS);
      } catch (requestError) {
        if (isMounted) {
          setError(requestError);
          setDestinations(STATIC_DESTINATIONS);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void fetchDestinations();
    return () => {
      isMounted = false;
    };
  }, [lang]);

  return { destinations, loading, error };
}

export default useDestinations;
