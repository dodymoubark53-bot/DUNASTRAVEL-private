import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';

function readDestinations(response) {
  if (!response || !Array.isArray(response.data) || !response.meta) {
    throw new Error('Invalid canonical destinations response');
  }
  const items = response.data;
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
