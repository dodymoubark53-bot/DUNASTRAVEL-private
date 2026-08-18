import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

export const CURATED_DESTINATIONS = [
  {
    id: 'egypt',
    name: 'Egypt',
    tag: 'Pharaohs & Wonders',
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'turkey',
    name: 'Turkey',
    tag: 'East Meets West',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'jordan',
    name: 'Jordan',
    tag: 'Desert & Ancient Ruins',
    image: 'https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'morocco',
    name: 'Morocco',
    tag: 'Colors & Culture',
    image: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'greece',
    name: 'Greece',
    tag: 'Myths & Blue Horizons',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    tag: 'Luxury & Skylines',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tunisia',
    name: 'Tunisia',
    tag: 'Sahara & Sea',
    image: 'https://images.unsplash.com/photo-1580502304784-8985b7eb7260?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'holyland',
    name: 'Holy Land',
    tag: 'Faith & History',
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'brazil',
    name: 'Brazil',
    tag: 'Samba & Sunshine',
    image: 'https://images.unsplash.com/photo-1483728642388-6c3bdd6c93e5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'italy',
    name: 'Italy',
    tag: 'La Dolce Vita',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'spain',
    name: 'Spain',
    tag: 'Passion & Elegance',
    image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80'
  }
];

export function useDestinations() {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const [destinations, setDestinations] = useState(CURATED_DESTINATIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get('/destinations?locale=' + lang + '&lang=' + lang);
        const items = Array.isArray(res) ? res : (res?.data || res?.items || []);

        if (isMounted) {
          if (items.length > 0) {
            setDestinations(items);
          } else {
            setDestinations(CURATED_DESTINATIONS);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.warn('[useDestinations] API down or empty, using curated list:', err);
          setError(err);
          setDestinations(CURATED_DESTINATIONS);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDestinations();
    return () => {
      isMounted = false;
    };
  }, [lang]);

  return { destinations, loading, error };
}

export default useDestinations;
