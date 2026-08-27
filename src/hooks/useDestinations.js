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
  { id: 'egypt', slug: 'egypt', title: 'Egypt', name: 'Egypt', subtitle: 'Land of the Pharaohs', heroImageUrl: '/imgs/egyothero.png', image: '/imgs/egyothero.png', toursCount: 9 },
  { id: 'turkey', slug: 'turkey', title: 'Turkey', name: 'Turkey', subtitle: 'Where East Meets West', heroImageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=1200', toursCount: 15 },
  { id: 'dubai', slug: 'dubai', title: 'Dubai', name: 'Dubai', subtitle: 'City of the Future', heroImageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', toursCount: 9 },
  { id: 'jordan', slug: 'jordan', title: 'Jordan', name: 'Jordan', subtitle: 'Kingdom of Wonder', heroImageUrl: 'https://cdn.al-ain.com/lg/images/2022/11/24/62-021616-best-tourist-areas-jordan-4.jpeg', image: 'https://cdn.al-ain.com/lg/images/2022/11/24/62-021616-best-tourist-areas-jordan-4.jpeg', toursCount: 7 },
  { id: 'morocco', slug: 'morocco', title: 'Morocco', name: 'Morocco', subtitle: 'Land of Colors & Spices', heroImageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200', toursCount: 1 },
  { id: 'tunisia', slug: 'tunisia', title: 'Tunisia', name: 'Tunisia', subtitle: 'Oasis & Mediterranean Charm', heroImageUrl: 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=1200&q=80', image: 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=1200&q=80', toursCount: 1 },
  { id: 'greece', slug: 'greece', title: 'Greece', name: 'Greece', subtitle: 'Cradle of Civilization', heroImageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200', image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200', toursCount: 1 },
  { id: 'holy-land', slug: 'holy-land', title: 'Holy Land', name: 'Holy Land', subtitle: 'Faith, History & Sacred Pathways', heroImageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200', image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=1200', toursCount: 0 },
];

function mergeDestinations(apiItems) {
  if (!Array.isArray(apiItems) || apiItems.length === 0) {
    return STATIC_DESTINATIONS;
  }
  const apiMap = new Map();
  apiItems.forEach((item) => {
    if (item?.slug) apiMap.set(item.slug.toLowerCase(), item);
    if (item?.id) apiMap.set(String(item.id).toLowerCase(), item);
  });

  const merged = STATIC_DESTINATIONS.map((staticItem) => {
    const apiItem = apiMap.get(staticItem.slug.toLowerCase()) || apiMap.get(staticItem.id.toLowerCase());
    if (!apiItem) return staticItem;
    return {
      ...staticItem,
      ...apiItem,
      heroImageUrl: apiItem.heroImageUrl || apiItem.image || staticItem.heroImageUrl,
      image: apiItem.image || apiItem.heroImageUrl || staticItem.image,
      toursCount: Number.isFinite(Number(apiItem.toursCount)) ? Number(apiItem.toursCount) : staticItem.toursCount,
    };
  });

  const staticSlugs = new Set(STATIC_DESTINATIONS.map((s) => s.slug.toLowerCase()));
  apiItems.forEach((item) => {
    const slug = (item.slug || item.id || '').toLowerCase();
    if (slug && !staticSlugs.has(slug)) {
      merged.push({
        id: slug,
        slug,
        title: item.title || item.name || slug,
        name: item.title || item.name || slug,
        subtitle: item.subtitle || item.description || '',
        heroImageUrl: item.heroImageUrl || item.image || '',
        image: item.image || item.heroImageUrl || '',
        toursCount: Number.isFinite(Number(item.toursCount)) ? Number(item.toursCount) : 0,
      });
    }
  });

  return merged;
}

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
        if (isMounted) setDestinations(mergeDestinations(items));
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
