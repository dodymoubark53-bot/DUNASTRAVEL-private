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
