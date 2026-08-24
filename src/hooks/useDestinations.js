import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

function readDestinations(response) {
  const items = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.items)
        ? response.items
        : null;
  if (!items) throw new Error('Invalid destinations response');
  return items
    .filter((item) => item?.id && item?.slug && item?.title)
    .map((item) => ({
      ...item,
      name: item.title,
      image: item.heroImageUrl || null,
      toursCount: Number.isFinite(Number(item.toursCount)) ? Number(item.toursCount) : 0,
    }));
}

export function useDestinations() {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
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
        if (isMounted) setDestinations(items);
      } catch (requestError) {
        if (isMounted) {
          setError(requestError);
          setDestinations([]);
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
