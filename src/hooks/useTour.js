import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { supportedLocale } from '../utils/locale';

function normalizeTour(data) {
  if (!data?.id || !data?.slug || !data?.title || typeof data.currency !== 'string') {
    throw new Error('Invalid tour details response');
  }
  const price = Number(data.basePriceUsd);
  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`Invalid tour price for ${data.slug}`);
  }
  if (!Array.isArray(data.images) || !Array.isArray(data.itinerary)
    || !Array.isArray(data.includedServices) || !Array.isArray(data.excludedServices)) {
    throw new Error(`Invalid canonical tour presentation for ${data.slug}`);
  }
  const images = data.images.map((image) => {
    if (!image?.id || typeof image.imageUrl !== 'string') {
      throw new Error(`Invalid canonical tour image for ${data.slug}`);
    }
    return image.imageUrl;
  });
  const itinerary = data.itinerary.map((item) => {
    if (!item?.id || !Number.isInteger(item.sortOrder) || typeof item.description !== 'string') {
      throw new Error(`Invalid canonical itinerary item for ${data.slug}`);
    }
    return {
      ...item,
      day: item.sortOrder + 1,
      title: item.dayLabel || '',
      meals: item.meals || null,
    };
  });

  return {
    ...data,
    images,
    included: data.includedServices,
    excluded: data.excludedServices,
    itinerary,
    price,
  };
}

export function useTour(slug) {
  const { i18n } = useTranslation();
  const lang = supportedLocale(i18n.language);
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!slug) return undefined;

    const fetchTour = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = normalizeTour(
          await api.get(`/tours/${encodeURIComponent(slug)}?lang=${encodeURIComponent(lang)}`),
        );
        if (isMounted) setTour(result);
      } catch (requestError) {
        if (isMounted) {
          setError(requestError);
          setTour(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    void fetchTour();
    return () => {
      isMounted = false;
    };
  }, [slug, lang]);

  return { tour, loading, error };
}
